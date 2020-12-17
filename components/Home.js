import React, {Component, useCallback, useEffect, useState} from 'react';
import {
  Platform,
  Animated,
  ActivityIndicator,
  Image,
  ImageBackground,
  TouchableOpacity,
  BackHandler,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableHighlight,
  TextInput,
  Easing
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'react-native-axios';
import {debounce} from 'lodash';
import OptionsMenu from 'react-native-options-menu';
import ItemCard from './home/ItemCard';
import DownloadNewSong from './modals/DownloadNewSong';
import { styles } from './styles/HomeStyles';
import Header from './home/Header';
import LoadingCard from './home/LoadingCard';
import { useSelector, useDispatch } from 'react-redux';


const Home = (props) => {
  const [videos, setVideos] = useState([]);
  const [currentVideoKey, setCurrentVideoKey] = useState("");
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const musicPlayerFullScreen = useSelector(state => state.musicPlayerFullScreen);
  const lastSearch = useSelector(state => state.lastSearch);
  const isLoadingSearch = useSelector(state => state.isLoadingSearch);
  const videoList = useSelector(state => state.videoList);
  const dispatch = useDispatch();
  const togglePause = () => {
    dispatch({type: 'TOGGLE_PAUSE_STATE'});
  }
  const toggleMusicPlayerFullScreen = () => {
    dispatch({type: 'TOGGLE_PLAYER_FULLSCREEN'});
  }
  const updateVideoList = (videos) => {
    dispatch({type: 'UPDATE_VIDEOLIST', payload: videos})
  }
  const updateLoadingSearch = (payload) => {
    dispatch({type: 'UPDATE_LOADING_SEARCH_STATUS', payload});
  }
  const updateLastSearch = (search) => {
    dispatch({type: 'UPDATE_LAST_SEARCH', payload: search});
  }

  useEffect(() => {
    const backButtonAction = () => {
      if(musicPlayerFullScreen) {
        toggleMusicPlayerFullScreen();
        return true;
      }
      else {
        return false;
      }
    }
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backButtonAction
    );

    return () => backHandler.remove();
  }, [musicPlayerFullScreen]);


  const openModal = (item) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
  }

  const searchVideo = useCallback(
    debounce((payload) => {
      console.log("Todo me gusta de ti!", payload);
      if(payload != "") {
        setIsLoading(true);
        setVideos([]);
        updateLoadingSearch(true);
        updateLastSearch(payload);
        axios.get(`http://tubeplaya.herokuapp.com/search/${payload}/`)
        .then(function (response) {
          setVideos(response.data);
          setIsLoading(false);
          updateVideoList(response.data);
          updateLoadingSearch(false);
          props.screenProps.currentVideoIndexChange(0);
        })
        .catch(function (error) {
          console.log(error);
        });
      }
    }, 1000),
    []
  );

  // searchVideo = debounce((payload) => {
  //   if(payload != "") {
  //     setIsLoading(true);
  //     setVideos([]);
  //     props.screenProps.loadingSearchStatus(true);
  //     props.screenProps.setLastSearch(payload);
  //     axios.get(`http://tubeplaya.herokuapp.com/search/${payload}/`)
  //     .then(response => {
  //       setVideos(response.data);
  //       setIsLoading(false);
  //       setVideoList();
  //       props.screenProps.loadingSearchStatus(false);
  //       props.screenProps.currentVideoIndexChange(0);
  //     })
  //     .catch(error => console.log(error));
  //   }
  // }, 1000);

  const getVideoURI = async (uri, title, index, imageURI) => {
    props.screenProps.loadingState(true);
    props.screenProps.changeSearchListStatus(true);
    props.screenProps.currentVideoKeyChange(uri);
    props.screenProps.changeVideoDownloadStatus(false);
    props.screenProps.currentVideoIndexChange(0);
    const propVideos = props.screenProps.videoList;
    props.screenProps.setSongProgress(0, false);
    props.screenProps.updateLastPlaylist(propVideos, "search", "searchbar");

    const newStateVideos = propVideos.map((_video, i) => {
      if(index == i && !_video.isPlaying) {
        return {title: _video.title, uri: _video.uri, imageURI: _video.imageURI, time: _video.time, isPlaying: true};
      }
      else {
        return {title: _video.title, uri: _video.uri, imageURI: _video.imageURI, time: _video.time, isPlaying: false};
      }
    });


    if(uri == props.screenProps.currentVideoKey) {
      props.screenProps.togglePause();
    }
    else {
      setIsLoading(true);
      setVideos(newStateVideos);
      const response = await axios.get(`https://tubeplaya.herokuapp.com/video_info/${uri}`);
      const source = props.screenProps.switchValue ? response.data.formats[0].url : response.data.formats[1].url;
      props.screenProps.currentVideoURIChange(source);
      props.screenProps.currentVideoURImage(response.data.thumbnail);
      props.screenProps.changeVideoChannel(response.data.uploader);
      props.screenProps.changeVideoTitle(response.data.title);
      props.screenProps.updateRelatedVideos(response.data.related_videos.slice(0, 2));
      const songData = {channel: response.data.uploader, isDownloaded: false, title: response.data.title, path:"", time: "", uri, imageURI: response.data.thumbnail};
      props.screenProps.playNewSong(false, index, songData);
      setVideoList();
      setCurrentVideoIndex(index);
      setIsLoading(false);
      setVideos(newStateVideos);
    }
  }

  const downloadSong = (item, currentArtist, currentSong) => {
    const artist = currentArtist === "" ? false : currentArtist;
    const song = currentSong === "" ? false : currentSong;
    props.screenProps.downloadSong(item, artist, song);
  }

  const setVideoList = () => {
    props.screenProps.setVideoList(videos);
  }

  const changeText = text => {
    setSearchTerm(text);
  }

  const emptyText = () => {
    setSearchTerm('');
  }

  const playSong = (index, songData) => {
    const pathName = props.screenProps.switchValue ? "pathAudio" : "pathVideo";
    const {channel, isDownloaded, title, time, uri, imageURI} = songData;
    const path = songData[pathName];
    props.screenProps.setSongProgress(0, false);

    if(uri == props.screenProps.currentVideoKey) {
      props.screenProps.togglePause();
    }
    else {
      if(isDownloaded) {
        props.screenProps.currentVideoURIChange(path);
        props.screenProps.currentVideoKeyChange(uri);
        props.screenProps.currentVideoURImage(imageURI);
        props.screenProps.changeVideoChannel(channel);
        props.screenProps.changeVideoTitle(title);
        props.screenProps.playNewSong(false, index);
        props.screenProps.loadingState(false);
        props.screenProps.changeVideoDownloadStatus(true);
        props.screenProps.searchListStatus(true);
      }
      setVideoList();
      props.screenProps.updateLastPlaylist(props.screenProps.videoList, "search", "searchbar");
    }
  }

  const path = props.screenProps.switchValue ? "isAudio" : "isVideo";
  const downloadedSongs = props.screenProps.allSongs.filter(song => song.isDownloaded && song[path]);
  // const songs = this.state.songs;
  const searchStatus = props.screenProps.isLoadingSearch
  const {navigation} = props;
  const pathName = props.screenProps.switchValue ? "path" : "videopath";
  const myIcon = (<Icon name={"ios-more"} size={25} color={"white"} style={{transform: [{rotate:'90deg'}]}} />);

  return(
    <View style={styles.container}>

      {isModalOpen ? (<DownloadNewSong item={currentItem} downloadSong={downloadSong} closeModal={closeModal} />) : false}

      <Header
        navigation={navigation}
        text={searchTerm}
        changeText={changeText}
        searchVideo={searchVideo}
      />
      <ScrollView style={styles.scrollViewContainer} contentContainerStyle={{flexGrow: 1}}>
          {!isLoadingSearch ?
            videoList.map((item, index) => {
              const cardStyle = props.screenProps.currentVideoKey == item.uri ?
                                [styles.magic, { backgroundColor: 'rgba(255, 255, 255, 0.1)'}] :
                                styles.magic;
            return (
            <Animated.View
              title={item.title}
              key={item.uri}
              style={cardStyle}
            >
                <ItemCard
                  playPause={togglePause}
                  downloadedSongs={downloadedSongs}
                  item={item}
                  index={index}
                  getVideoURI={getVideoURI}
                  playSong={playSong}
                  screenProps={props.screenProps}
                  downloadingVideoKey={props.screenProps.downloadingVideoKey}
                />
                
                <View style={{justifyContent:'flex-start', alignItems:'flex-start', flex:2, position:'absolute', top:10, right:20,}}>
                {
                  (item.isDownloaded && item[pathName]  || props.screenProps.downloadingVideoKey == item.uri)
                  ?
                  (<OptionsMenu
                    customButton={myIcon}
                    destructiveIndex={1}
                    options={["Agregar a playlist"]}
                    actions={[() => props.navigation.navigate('PlaylistOptions', {item})]}
                  />)
                  :
                  (<OptionsMenu
                    customButton={myIcon}
                    destructiveIndex={1}
                    options={["Agregar a playlist", "Descargar"]}
                    actions={[() => props.navigation.navigate('PlaylistOptions', {item}), () => openModal(item)]}
                  />)
                }
                </View>
              </Animated.View>
            )
          }
        )
        :
        (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111111'}}>
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
        </View>
        )
          }
      </ScrollView>
      {!props.screenProps.appIsConnected
        ?
      (<Text style={{width:'100%', backgroundColor:'red', color:'white', textAlign:'center'}}>Sin conexión a internet</Text>) : null}
    </View>
  );
}

export default Home;


