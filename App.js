/* eslint-disable prettier/prettier */
import React, { Component, useRef, useState, useEffect } from 'react';
import axios from 'react-native-axios';
import RNFS from 'react-native-fs';
import downloadManager from 'react-native-simple-download-manager';
import MusicControl from 'react-native-music-control';
import {ToastAndroid, Platform, Animated, Easing, StyleSheet, Text, View, Dimensions, TouchableHighlight, AsyncStorage, BackHandler} from 'react-native';
import MyDrawerNavigator from './navigation/NavigationScreens';
import {createAppContainer} from 'react-navigation';
import MusicPlayer from './components/player/MusicPlayer';
import SplashScreen from './SplashScreen';  
import NetInfo from "@react-native-community/netinfo";
import { songExists } from './helpers/localstorage/songExists';
import {LogLevel, RNFFmpegConfig, RNFFmpeg, RNFFprobe} from 'react-native-ffmpeg';
import {
  createInitialPaths,
  getSongsFromLocalStorage,
  createDefaultPlaylits,
  initialStorageSettings,
  saveSongs,
} from './helpers/localstorage/saving';
import { initialServiceSetup } from './helpers/musicservices';
import Icon from 'react-native-vector-icons/Ionicons';
import FullPlayer from './components/player/components/players/FullPlayer';
import SmallPlayer from './components/player/components/players/SmallPlayer';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './redux/store/store';
import { __togglePause, __togglePlayerFullscreen, __updateAllSongs, __updateCurrentPlaylistName, __updateCurrentVideo, __updateCurrentVideoIndex, __updateCurrentVideoItem, __updateCurrentVideoKey, __updateDownloadedSongsList, __updateDownloadingVideoKey, __updateImageURI, __updateIsDownloadingSong, __updateLastSearch, __updateLoadingSearchStatus, __updatePlaylistSource, __updateRelatedVideos, __updateSearchListActive, __updateSongProgress, __updateVideoChannel, __updateVideoList, __updateVideoListPlaylist, __updateVideoTitle } from './redux/actions/actionNames';
// paused: true,
// currentVideo: "https://r4---sn-0opoxu-hxmee.googlevideo.com/videoplayback?clen=4094846&requiressl=yes&key=cms1&txp=5511222&keepalive=yes&source=youtube&mime=audio%2Fwebm&ip=198.54.114.79&sparams=clen,dur,ei,expire,gir,id,ip,ipbits,ipbypass,itag,keepalive,lmt,mime,mip,mm,mn,ms,mv,pl,requiressl,source,usequic&id=o-AN_WkpC93qd3PsPjErSrLWTAKtZuASNIvBsBKDpCt1Wj&ei=yojDXKTjJdmYkwaO269Q&fvip=4&lmt=1540654186975365&c=WEB&gir=yes&dur=255.541&expire=1556340010&pl=51&ipbits=0&itag=251&ratebypass=yes&signature=48A796AFBD2B713B5EE804CDCB515F968636668D.0E93313E8F287675D0C945C7B998AF9511AFCDA7&redirect_counter=1&rm=sn-a5mkk7z&req_id=2a742d812695a3ee&cms_redirect=yes&ipbypass=yes&mip=2806:104e:19:5399:11ea:f81:d133:5baa&mm=31&mn=sn-0opoxu-hxmee&ms=au&mt=1556318332&mv=m&usequic=no",
// downloadPath: `${RNFS.DocumentDirectoryPath}`,
// playerOptions: {
//   repeat: false,
// },
// currentVideoKey: "",
// currentVideoIndex: 0,
// musicPlayerFullScreen: false,
// imageURI: 'https://i.ytimg.com/vi/13oXf68zRcM/maxresdefault.jpg',
// videoTitle: "The Kiboomers - Kids Music Channel",
// videoChannel: "Freeze Dance | Freeze Song | Freeze Dance for Kids | Music for Kids | The Kiboomers",
// firstURI: "2UcZWXvgMZE",
// videoIsDownloaded: false,
// videoList: [],
// videoListPlaylist: [],
// playlistSource: [],
// isLoadingSong: false,
// isDownloadingSong: false,
// searchListActive: false,
// searched: false,
// currentVideoItem: {imageURI: 'https://i.ytimg.com/vi/2UcZWXvgMZE/maxresdefault.jpg'},
// isLoadingSearch: true,
// downloadedSongsList: [],
// downloadingVideoKey: [],
// songProgress: 0,
// lastSearch: "Bruno Mars",
// currentPlaylistName: "",
// allSongs: [],
// relatedVideos: [],

const AppContainer = createAppContainer(MyDrawerNavigator);

const { width, height } = Dimensions.get('window');

const App = () => {
  // Component State data
  const [isAboutToActivate, setIsAboutToActivate] = useState(false);
  const [loadingBubble, setLoadingBubble] = useState(true);
  const [appIsConnected, setAppIsConnected] = useState(true);
  const [splashScreenIsActive, setSplashScreenIsActive] = useState(true);
  const [firstURI, setFirstURI] = useState('2UcZWXvgMZE');
  // downloadPath: `${RNFS.DocumentDirectoryPath}`,
  // ******
  // playerOptions: {
    //   repeat: false,
    // },
    // ****** PENDING
    // firstURI: "2UcZWXvgMZE",
    // *************



  // App Store data
  const paused = useSelector(state => state.paused);
  const currentVideo = useSelector(state => state.currentVideo);
  const currentVideoKey = useSelector(state => state.currentVideoKey);
  const currentVideoIndex = useSelector(state => state.currentVideoIndex);
  const musicPlayerFullScreen = useSelector(state => state.musicPlayerFullScreen);
  const imageURI = useSelector(state => state.imageURI);
  const videoTitle = useSelector(state => state.videoTitle);
  const videoChannel = useSelector(state => state.videoChannel);
  const videoIsDownloaded = useSelector(state => state.videoIsDownloaded);
  const videoList = useSelector(state => state.videoList);
  const videoListPlaylist = useSelector(state => state.videoListPlaylist);
  const playlistSource = useSelector(state => state.playlistSource);
  const isLoadingSong = useSelector(state => state.isLoadingSong);
  const isDownloadingSong = useSelector(state => state.isDownloadingSong);
  const searchListActive = useSelector(state => state.searchListActive);
  const searched = useSelector(state => state.searched);
  const currentVideoItem = useSelector(state => state.currentVideoItem);
  const isLoadingSearch = useSelector(state => state.isLoadingSearch);
  const downloadedSongsList = useSelector(state => state.downloadedSongsList);
  const downloadingVideoKey = useSelector(state => state.downloadingVideoKey);
  const songProgress = useSelector(state => state.songProgress);
  const lastSearch = useSelector(state => state.lastSearch);
  const currentPlaylistName = useSelector(state => state.currentPlaylistName);
  const allSongs = useSelector(state => state.allSongs);
  const sourceIsAudio = useSelector(state => state.sourceIsAudio);
  const relatedVideos = useSelector(state => state.relatedVideos);

  const animation = useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch();

  // DISPATCH
// 2
  const changeVideoChannel = (payload) => {
    dispatch({
      type: __updateVideoChannel,
      payload
    })
  }
// 3
  const changeVideoTitle = (payload) => {
    dispatch({
      type: __updateVideoTitle,
      payload
    })
  }
// 4
  const changeCurrentVideoItem = (payload) => {
    dispatch({
      type: __updateCurrentVideoItem,
      payload
    });
  }
// 5
  const changeSearchListStatus = (payload) => {
    // this.setState({searchListActive: boolean});
    dispatch({
      type: __updateSearchListActive,
      payload,
    });
  }
// 6
  const changeDownloadedSongsList = (payload) => {
    dispatch({
      type: __updateDownloadedSongsList,
      payload
    });
  }
// 7
  const changeImageURI = (payload) => {
    dispatch({
      type: __updateImageURI,
      payload
    })
  }
// 8
  const changeCurrentVideo = (payload) => {
    dispatch({
      type: __updateCurrentVideo,
      payload
    });
  }
// 9
  const changeCurrentVideoKey = (payload) => {
    dispatch({
      type: __updateCurrentVideoKey,
      payload
    })
  }
// 10
  const changeRelatedVideos = (payload) => {
    dispatch({
      type: __updateRelatedVideos,
      payload
    })
  }
// 11
  const changeVideoList = (payload) => {
    dispatch({
      type: __updateVideoList,
      payload
    })
  }
// 14
  const changePlaylistSource = (payload) => {
    dispatch({
      type: __updatePlaylistSource,
      payload
    })
  }
// 15
  const changeVideoListPlaylist = (payload) => {
    dispatch({
      type: __updateVideoListPlaylist,
      payload
    })
  };
  // 16
  const changeCurrentPlaylistName = (payload) => {
    dispatch({
      type: __updateCurrentPlaylistName,
      payload
    })
  };

// 17
  const isDownloadingSongStatus = (payload, uri = "") => {
    dispatch({
      type: __updateIsDownloadingSong,
      payload
    })
  }
// 18
  const changeCurrentVideoIndex = (payload) => {
    dispatch({
      type: __updateCurrentVideoIndex,
      payload
    })
}
// 19
  const changeSongProgress = (payload) => {
    dispatch({
      type: __updateSongProgress,
      payload
    })
  }
// 20
const togglePause = (payload = null) => {
  if(payload === null) {
    return dispatch({
      type: __togglePause
    });
  }
  dispatch({
    type: __togglePause,
    payload
  });
}
// 21
const toggleFullScreenMusicPlayer = () => {
  dispatch({
    type: __togglePlayerFullscreen,
  })
}

const changeAllSongs = (payload) => {
  dispatch({
    type: __updateAllSongs,
    payload
  })
}

const changeDownloadingVideoKey = (payload) => {
  dispatch({
    type: __updateDownloadingVideoKey,
    payload
  })
}

const changeLastSearch = (payload) => {
  dispatch({
    type: __updateLastSearch,
    payload
  })
}

// 12
  const changeIsLoadingSearch = (payload) => {
    if(payload) {
      return dispatch({
        type: __updateLoadingSearchStatus,
        payload
      });
    }
    dispatch({
      type: __updateLoadingSearchStatus
    })
  }
// 13
  const changeVideoDownloadStatus = (bool) => {
    // check this
  }

  const start_animation = () => {
    Animated.sequence([
      Animated.delay(1000),
      Animated.timing(animation, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      })
    ]).start(() => setLoadingBubble(false));
  }

//SETUPS INICIALES
  const initial_ = (object) => {
    const { isDownloaded, channel, imageURI, title, uri, pathVideo, pathAudio, index } = object.currentVideoItem;
    if(isDownloaded) {
      // self.currentVideoURIChange(path);
      // this.setState({currentVideo: sourceIsAudio ? pathAudio : pathVideo, paused: true});
      // paused is true by default in initialState and sourceIsAlwaysAudio
      changeCurrentVideoKey(uri);
      changeVideoChannel(channel);
      changeVideoTitle(title);
      playNewSong(true, index);
      // this.loadingState(false);
      // this.changeVideoDownloadStatus(true);  check if this is used
      changeSearchListStatus(false);
      changeSplashState();
    }
    else {
      getSavedSongData(object.currentVideoItem)
      changeSearchListStatus(true);
    }
  }
  
  useEffect(async() => {
    await createInitialPaths();

    initialServiceSetup(togglePause, playNextSong);
    

    const listener = isConnected => {
      const connectionType = isConnected;
      setAppIsConnected(connectionType ? true : false);
    };
    // Subscribe
    const subscription = NetInfo.isConnected.addEventListener('connectionChange', listener);


    createDefaultPlaylits();

    const initial_storage_response = await initialStorageSettings();
    if(initial_storage_response.length === 0) {
      changeSplashState();
      return true;
    }
    initial_storage_response.forEach((object, index) => {
      if(index === 0) {
        setUpStorageDataToStoreCurrentVideo(object);
      }
      else if(index === 1) {
        setUpStorageDataToStoreSearchListData(object);
      }
      else {
        setUpStorageDataToStore(object);
      }
      if(index == initial_storage_response.length - 1) {
        initial_(object);
      }
    });
    return true;
  }, []);

  const SongIsDownloadedInSource = (array, object) => {
    const pathName = object.sourceIsAudio ? 'pathAudio' : 'pathVideo';
    // const exists = array.find(x => x.uri === object.uri && x[pathName]);
    let exists = false;
    for(let i = array.length - 1; i >= 0; i--) {
      const song = array[i];
      console.log(song);
      if(song.uri === object.uri && song[pathName]) {
        exists = true;
        break;
      }
    }
    console.log(exists);
    return exists;
  }
  useEffect(() => {
    let tempDownloadingVideoKey = downloadingVideoKey;
    for(let i = tempDownloadingVideoKey.length - 1; i >= 0; i--) {
      const currentVideoObject = tempDownloadingVideoKey[i];
      const exists = SongIsDownloadedInSource(allSongs, currentVideoObject);
      if(exists)
        tempDownloadingVideoKey.splice(i, 1);
    }
    console.log(tempDownloadingVideoKey);
    changeDownloadingVideoKey(tempDownloadingVideoKey);
  }, [allSongs])
  
  const setUpStorageDataToStore = (object) => {
    const keys = Object.keys(object);
    const values = Object.values(object);
    let i = 0;
    for(i; i < keys.length; i++) {
      const currentKey = keys[i];
      const currentValue = values[i];
      if(currentKey === 'allSongs') {
        changeAllSongs(currentValue);
        continue;
      }
      else if(currentKey === 'songProgress') {
        changeSongProgress(currentValue);
        continue;
      }
      else if(currentKey === 'lastSearch') {
        changeLastSearch(currentValue);
        continue;
      }
    }
  }

  const setUpStorageDataToStoreSearchListData = (object) => {
    const keys = Object.keys(object);
    const values = Object.values(object);
    let i = 0;
    for(i; i < keys.length; i++) {
      const currentKey = keys[i];
      const currentValue = values[i];
      if(currentKey === 'searchListActive') {
        changeSearchListStatus(currentValue);
        continue;
      }
      else if(currentKey === 'playlistSource') {
        changePlaylistSource(currentValue);
        continue;
      }
      else if(currentKey === 'currentPlaylistName') {
        changeCurrentPlaylistName(currentValue);
        continue;
      }
      else if(currentKey === 'videoListPlaylist') {
        changeVideoListPlaylist(currentValue);
        continue;
      }
      else if(currentKey === 'currentVideoIndex') {
        changeCurrentVideoIndex(currentValue);
        continue;
      }
    }
  }

  const setUpStorageDataToStoreCurrentVideo = (object) => {
    const keys = Object.keys(object);
    const values = Object.values(object);
    let i = 0;
    for(i; i < keys.length; i++) {
      const currentKey = keys[i];
      const currentValue = values[i];
      if(currentKey === 'imageURI') {
        changeImageURI(currentValue);
        continue;
      }
      else if(currentKey === 'currentVideoIndex') {
        changeCurrentVideoIndex(currentValue);
        continue;
      }
      else if(currentKey === 'currentVideoKey') {
        changeCurrentVideoKey(currentValue);
        continue;
      }
      else if(currentKey === 'currentVideo') {
        changeCurrentVideo(currentValue);
        continue;
      }
      else if(currentKey === 'videoChannel') {
        changeVideoChannel(currentValue);
        continue;
      }
      else if(currentKey === 'videoIsDownloaded') {
        
        continue;
      }
      else if(currentKey === 'videoTitle') {
        changeVideoTitle(currentValue);
        continue;
      }
      else if(currentKey === 'currentVideoItem') {
        changeCurrentVideoItem(currentValue);
        continue;
      }
      
    }
  }
  // TERMINAN SETUPS INICIALES

  const upliftSplashState = () => {
    setSplashScreenIsActive(false);
    start_animation();
  }

  // CAMBIAR LA PANTALLA DE SPLASH AL APP Y REALIZA LA BÚSQUEDA DE CANCIONES
  // check this
  const changeSplashState = async () => {
    const localStorageLastSearch = await AsyncStorage.getItem('lastSearch');
    if(!appIsConnected) {
      setIsAboutToActivate(true);
      return false;
    }
    axios.get(`https://tubeplaya.herokuapp.com/search/${localStorageLastSearch}/`)
      .then(function (response) {
        songs = downloadedSongsList;
        let tempVideoList = null;
        videoList
        tempVideoList = response.data.map((video, i) => {
          let isDownloaded = false;
          let path = "";
          songs.forEach(song => {
            if(video.uri == song.uri && song.isDownloaded) {
              isDownloaded = true;
              path = sourceIsAudio ? song.pathAudio : song.pathVideo;
            }
          });
          
          if(isDownloaded) {
            video["isDownloaded"] = true;
            video[sourceIsAudio ? "pathAudio" : "pathVideo"] = path;
            return video
          }
          return video;
        });
        // self.setState({isAboutToActivate: true, videoList, isLoadingSearch: false});
        setIsAboutToActivate(true);
        changeVideoList(tempVideoList);
        changeIsLoadingSearch(false);
      })
      .catch(function (error) {
        setIsAboutToActivate(true);
      });
  }

  // LA CANCIÓN ACTUAL, GUARDAR LOS DATOS LOCALMENTE Y EN EL ESTADO
  const updateLastSongData = (data = null, index) => {
    
    let currentSongData = {};
    if(data === null) {
      currentSongData = {
        [sourceIsAudio ? "pathAudio" : "pathVideo"]: currentVideo,
        key: currentVideoKey,
        index: index,
        image: imageURI,
        videoTitle: videoTitle,
        videoChannel: videoChannel,
        videoIsDownloaded: videoIsDownloaded  
      }
    }
    else {
      currentSongData = data;
      currentSongData.index = index;
    }
    
    changeCurrentVideoItem(currentSongData);

    currentSongData = JSON.stringify(currentSongData);

    AsyncStorage.multiSet([["currentSong", currentSongData], ["currentVideoItem", currentSongData]])
    .then(function(response) {
    })
    .catch(function(error) {
      console.log(error)
    });
  }

  // me quede aquí
  // LO MISMO DE ARRIBA PERO CON PLAYLISTS
  const updateLastPlaylist = (playlist, source, playlistName) => {
    let playlistArray = [source, playlist, playlistName];
    changePlaylistSource(source);
    changeVideoListPlaylist(playlist);
    changeCurrentPlaylistName(playlistName);
    AsyncStorage.setItem("currentPlaylist", JSON.stringify(playlistArray))
    .then(function(response) {
      
    })
    .catch(function(error) {
      console.log(error)
    });
  }

  

  // PAUSAR VIDEO
  const playpause = (paused = null) => {
    alert("not using this, PLAYPAUSE");
  }

  //PLAYLIST LOCAL ???????????? pending!!!
  const setLocalePlaylist = (downloadedSongsList) => {
    // this.setState({downloadedSongsList});
    alert("not using this, SETLOCALEPLAYLIST");
  }


  const getSongsAndUpdate = () => {
    AsyncStorage.multiGet(["Songs"], (err, stores) => {
      let songs = stores[0][1];
      if(songs != null) {
        songs = JSON.parse(songs);

        songs = songs.filter(song => song.isDownloaded);
        changeDownloadedSongsList(songs);
        setVideoList(videoList);
        // self.setState({downloadedSongsList: songs}, () => {
          
        //   self.setVideoList(self.state.videoList);
        // });
      }
    });
  }
  // ==????????? USING THIS WITH REDUX
  const setVideoList = (vL) => {
    const songs = downloadedSongsList
    let videoList = null;
    videoList = vL.map((video, i) => {
      let isDownloaded = false;
      let path = "";
      songs.forEach(song => {
        if(video.uri == song.uri && song.isDownloaded) {
          isDownloaded = true;
          path = sourceIsAudio ? song.pathAudio : song.pathVideo;
        }
      });
      
      if(isDownloaded) {
        video["isDownloaded"] = true;
        video[sourceIsAudio ? "pathAudio" : "pathVideo"] = path;
        return video
      }
      return video;
    });
    changeVideoList(videoList);
  }



  // ????? fixed ?
  const playNewSong = (paused, index, songData = false) => {
      if(songData != false) {
        updateLastSongData(songData, index);
      }
      togglePause(paused);
  }

  const playNextSongOnScroll = (ix, video, initialSong = false, isFromPlaylist = false) => {
    const id = isFromPlaylist ? video.uri : video.id;
    if(video.isDownloaded) {
      changeCurrentVideo(sourceIsAudio ? video.pathAudio : video.pathVideo);
      changeCurrentVideoKey(video.uri);
      changeImageURI(video.imageURI);
      changeVideoChannel(video.channel);
      changeVideoTitle(video.title);
      changeCurrentVideoItem(video);
      changeCurrentVideoIndex(ix);
      return
    }
    // this.setState({isLoadingSong: true, currentVideoKey: id, songProgress: 0});
    changeCurrentVideoKey(id);
    changeSongProgress(0);
    axios.get(`https://tubeplaya.herokuapp.com/video_info/${id}`)
    .then(function (response) {
      let tempRelatedVideos = relatedVideos;
      let isVisited = false;
      if(tempRelatedVideos.length > 0) {
        for(let i = 0; i < tempRelatedVideos.length; i++) {
          const vid = tempRelatedVideos[i];
          if(vid.id === id) {
            if(vid.isVisited) {
              isVisited = true;
              break;
            }
            else {
              vid.isVisited = true;
              break;
            }
          }
        }
      }

      if(!isVisited) {
        if(tempRelatedVideos.length === 0) {
          response.data.related_videos.slice(0, 2).forEach((video, index) => {
            if(index === 0) {
              video.isVisited = true;
            }
            tempRelatedVideos.push(video);
          });
        }
        else {
          response.data.related_videos.slice(1, 2).forEach((video, index) => {
            tempRelatedVideos.push(video);
          });
        }
      }

      changeCurrentVideo(sourceIsAudio ? response.data.formats[0].url : response.data.formats[2].url);
      changeCurrentVideoIndex(ix);
      changeCurrentVideoKey(id);
      changeImageURI(response.data.thumbnail);
      changeVideoChannel(response.data.uploader);
      changeVideoTitle(response.data.title);
      changeRelatedVideos(tempRelatedVideos);
      changeCurrentVideoItem(response.data);
      // changeVideoISD
       //     videoIsDownloaded: false,
      

        let currentSongData = {
          [sourceIsAudio ? "pathAudio" : "pathVideo"]: sourceIsAudio ? response.data.formats[0].url : response.data.formats[2].url,
          key: id,
          image: video.video_thumbnail,
          videoTitle: video.title,
          videoChannel: video.author,
          videoIsDownloaded: false,
          currentVideoIndex: ix,
        }
        
        updateLastSongData(currentSongData, ix)
        // self.updateLastPlaylist();
        
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  
  //????
  const playNextSong = (prev = null, dontPlay = false, index = null, isPaused = null) => {
    const currentIndex = currentVideoIndex;
    let nextIndex = prev ? currentIndex - 1 : currentIndex + 1;
    const vidl = playlistSource != "playlist" ? videoList : videoListPlaylist;
    const videoListLength = playlistSource != "playlist" ? vidl.length : vidl.length;
    let newIndex = prev ? currentIndex - 1 : currentIndex + 1 ;
    newIndex = newIndex < 0 ? vidl.length - 1 : newIndex === vidl.length ? 0 : newIndex;
    if(index != null)
      newIndex = index;
    // if(newIndex === 0 && prev === null && index === null)

    const videoInfo = playlistSource != "playlist" ? videoList[newIndex] : videoListPlaylist[newIndex];

    changeCurrentVideoKey(videoInfo.uri);
    changeCurrentVideoIndex(nextIndex);
    changeSongProgress(0);
    let isSongPaused = (newIndex === 0 && prev === null && index === null) ? true : false;
    if (isPaused != null) {
      isSongPaused = isPaused;
    }
    togglePause(isSongPaused);
    // this.setState({isLoadingSong: true, currentVideoKey: videoInfo.uri, currentVideoIndex: nextIndex, songProgress: 0, }, () => {
    //   let paused = (newIndex === 0 && prev === null && index === null) ? true : false;
    //   setTimeout(() => {
    //     self.setState({paused});
    //   }, 1000);
    // });


    const currentList = playlistSource === "playlist" ? videoListPlaylist : videoList;
    const newStateVideos = currentList.map((vidio, i) => {
      if(currentIndex == i && !vidio.isPlaying) {
        return {title: vidio.title, uri: vidio.uri, imageURI: vidio.imageURI, time: vidio.time, isPlaying: true, isDownloaded: vidio.isDownloaded, [sourceIsAudio ? "pathAudio" : "pathVideo"]: sourceIsAudio ? vidio.pathAudio : vidio.pathVideo};
      }
      else {
        return {title: vidio.title, uri: vidio.uri, imageURI: vidio.imageURI, time: vidio.time, isPlaying: false, isDownloaded: vidio.isDownloaded, [sourceIsAudio ? "pathAudio" : "pathVideo"]: sourceIsAudio ? vidio.pathAudio : vidio.pathVideo};
      }
    });
    if(searchListActive && !videoInfo.isDownloaded) {
      axios.get(`https://tubeplaya.herokuapp.com/video_info/${videoInfo.uri}`)
      .then(function (response) {
      let tempRelatedVideos = relatedVideos;
      let isVisited = false;
      if(tempRelatedVideos.length > 0) {
        for(let i = 0; i < tempRelatedVideos.length; i++) {
          const vid = tempRelatedVideos[i];
          if(vid.id === videoInfo.uri) {
            if(vid.isVisited) {
              isVisited = true;
              break;
            }
            else {
              vid.isVisited = true;
              break;
            }
          }
        }
      }

      if(!isVisited) {
        if(tempRelatedVideos.length === 0) {
          response.data.related_videos.slice(0, 2).forEach((video, index) => {
            if(index === 0) {
              video.isVisited = true;
            }
            tempRelatedVideos.push(video);
          });
        }
        else {
          response.data.related_videos.slice(1, 2).forEach((video, index) => {
            tempRelatedVideos.push(video);
          });
        }
      }

      changeCurrentVideo(sourceIsAudio ? response.data.formats[0].url : response.data.formats[2].url);
      changeCurrentVideoIndex(newIndex);
      changeCurrentVideoKey(videoInfo.uri);
      changeImageURI(response.data.thumbnail);
      changeVideoList(newStateVideos);
      changeVideoChannel(response.data.uploader);
      changeVideoTitle(response.data.title);
      changeRelatedVideos(tempRelatedVideos);
      // self.setState(
      //   {
      //     currentVideo: self.state.sourceIsAudio ? response.data.formats[0].url : response.data.formats[2].url,
      //     currentVideoIndex: newIndex,
      //     currentVideoKey: videoInfo.uri,
      //     imageURI: response.data.thumbnail,
      //     isLoading:false,
      //     videoList: newStateVideos,
      //     videoChannel: response.data.uploader,
      //     videoTitle:response.data.title,
      //     videoIsDownloaded: false,
      //     relatedVideos,
      //   }, () => {
      //     // self.setState({isLoadingSong: false,})
      //   }
      // );
      updateLastSongData(videoInfo, newIndex)
        // self.updateLastPlaylist();
        
      })
      .catch(function (error) {
        console.log(error);
      });
    }
    else {
      if(videoInfo.isDownloaded) {
        changeCurrentVideo(sourceIsAudio ? videoInfo.pathAudio : videoInfo.pathVideo);
        changeCurrentVideoIndex(newIndex);
        changeCurrentVideoKey(videoInfo.uri);
        changeImageURI(videoInfo.imageURI);
        changeVideoChannel(videoInfo.channel);
        changeVideoTitle(videoInfo.title);
        updateLastSongData(videoInfo, newIndex);
      }
      else {
        axios.get(`https://tubeplaya.herokuapp.com/video_info/${videoInfo.uri}`)
        .then(function (response) {
          let tempRelatedVideos = relatedVideos;
          let isVisited = false;
          if(tempRelatedVideos.length > 0) {
            for(let i = 0; i < tempRelatedVideos.length; i++) {
              const vid = tempRelatedVideos[i];
              if(vid.id === videoInfo.uri) {
                if(vid.isVisited) {
                  isVisited = true;
                  break;
                }
                else {
                  vid.isVisited = true;
                  break;
                }
              }
            }
          }
    
          if(!isVisited) {
            if(tempRelatedVideos.length === 0) {
              response.data.related_videos.slice(0, 2).forEach((video, index) => {
                if(index === 0) {
                  video.isVisited = true;
                }
                tempRelatedVideos.push(video);
              });
            }
            else {
              response.data.related_videos.slice(1, 2).forEach((video, index) => {
                tempRelatedVideos.push(video);
              });
            }
          }

          changeCurrentVideo(sourceIsAudio ? response.data.formats[0].url : response.data.formats[2].url);
          changeCurrentVideoIndex(newIndex);
          changeCurrentVideoKey(videoInfo.uri);
          changeImageURI(response.data.thumbnail);
          changeVideoTitle(responese.data.title);
          changeVideoChannel(response.data.channel);
          changeRelatedVideos(tempRelatedVideos);
          changeVideoList(newStateVideos);
          updateLastSongData(videoInfo, newIndex)
          // self.setState(
          //   {
          //     currentVideo: self.state.sourceIsAudio ? response.data.formats[0].url : response.data.formats[2].url,
          //     currentVideoIndex: newIndex,
          //     currentVideoKey: videoInfo.uri,
          //     imageURI: response.data.thumbnail,
          //     isLoading:false,
          //     videoList: newStateVideos,
          //     videoChannel: response.data.uploader,
          //     videoTitle:response.data.title,
          //     videoIsDownloaded: false,
          //     relatedVideos,
          //   }, () => {
          //     // self.setState({isLoadingSong: false,})
          //   }
          // );
        })
        .catch(function (error) {
          console.log(error);
        });
      } 
    }
  }

  const getSavedSongData = (songData, uriSearch = false) => {
    if(!appIsConnected) {
      changeSplashState();
      return false;
    }
    let urii = null;
    
    if(songData != null)
      urii = songData.key === undefined ? songData.uri : songData.key;
    const uri = uriSearch ? firstURI : urii;
    axios.get(`https://tubeplaya.herokuapp.com/video_info/${uri}`)
    .then(function (response) {
      let isVisited = false;
      let tempRelatedVideos = relatedVideos;
      if(tempRelatedVideos.length > 0) {
        for(let i = 0; i < tempRelatedVideos.length; i++) {
          const vid = tempRelatedVideos[i];
          if(vid.id === uri) {
            if(vid.isVisited) {
              isVisited = true;
              break;
            }
            else {
              vid.isVisited = true;
              break;
            }
          }
        }
      }

      if(!isVisited) {
        if(tempRelatedVideos.length === 0) {
          response.data.related_videos.slice(0, 2).forEach((video, index) => {
            if(index === 0) {
              video.isVisited = true;
            }
            tempRelatedVideos.push(video);
          });
        }
        else {
          response.data.related_videos.slice(1, 2).forEach((video, index) => {
            tempRelatedVideos.push(video);
          });
        }
      }

      changeCurrentVideo(sourceIsAudio ? response.data.formats[0].url : response.data.formats[2].url);
      changeCurrentVideoKey(uri);
      changeImageURI(response.data.thumbnail);
      changeVideoChannel(response.data.uploader);
      changeVideoTitle(response.data.title)
      togglePause(true);
      changeRelatedVideos(tempRelatedVideos);
      changeSearchListStatus(true);
      changeSplashState();
    })
    .catch(function (error) {
      changeSplashState();
    });
  }

  const playIndexSong = (newIndex, songData, playlist = null, isFromPlaylist = false, playlistLL = null) => {
    const currentIndex = currentVideoIndex;
    const videoListLength = isFromPlaylist ? videoListPlaylist.length : videoList.length;
    const videoInfo = isFromPlaylist ? playlistLL[newIndex] : videoList[newIndex];
    
    changeCurrentVideoKey(videoInfo.uri);

    let newStateVideos = videoList.map((vidio, i) => {
      if(currentIndex == i && !vidio.isPlaying) {
        return {title: vidio.title, uri: vidio.uri, time: vidio.time, isPlaying: true};
      }
      else {
        return {title: vidio.title, uri: vidio.uri, time: vidio.time, isPlaying: false};
      }
    });



    axios.get(`https://tubeplaya.herokuapp.com/video_info/${videoInfo.uri}`)
    .then(function (response) {
      let tempRelatedVideos = [];
      let isVisited = false;

      changeCurrentVideo(sourceIsAudio ? response.data.formats[0].url : response.data.formats[2].url);
      changeCurrentVideoIndex(newIndex);
      changeCurrentVideoKey(videoInfo.uri);
      changeImageURI(response.data.thumbnail);
      changeVideoList(newStateVideos);
      changeVideoChannel(response.data.uploader);
      changeVideoTitle(response.data.title);
      togglePause(false);
      changeRelatedVideos([response.data.related_videos[0], response.data.related_videos[1]]);

      changeCurrentVideoIndex(videoInfo);
      updateLastSongData(videoInfo, newIndex);
      // self.setState(
      //   {
      //     currentVideo: self.state.sourceIsAudio ? response.data.formats[0].url : response.data.formats[2].url,
      //     // currentVideoIndex: newIndex,
      //     currentVideoKey: videoInfo.uri,
      //     imageURI: response.data.thumbnail,
      //     isLoading:false,
      //     videoList: newStateVideos,
      //     videoChannel: response.data.uploader,
      //     videoTitle:response.data.title,
      //     paused: false,
      //     relatedVideos,
      //   }, () =>{
      //     self.setState({currentVideoItem: videoInfo, });
      //     updateLastSongData(videoInfo, newIndex);
      //   }
      // );
    })
    .catch(function (error) {
      console.log(error);
    });

  }
  
  // THIS IS A HELPER FUNCTION
  const setSongProgress = (seconds, willSave = true) => {
    // this.setState({songProgress: seconds});
    changeSongProgress(seconds);
    if(!willSave) return true;
    AsyncStorage.setItem("songProgress", String(seconds))
    .then(response => {
    })
    .catch((e) => console.log(e));
  }
  
  // THIS IS A HELPER FUNCTION
  const setLastSearch = (lastSearch) => {
    AsyncStorage.setItem("lastSearch", String(lastSearch))
    .then(response => {
    })
    .catch((e) => console.log(e));
  }

  const songIsInPlaylists = (id, value) => {
    value = JSON.parse(value);
    const result = value.filter(val => val.uri === id);
  }
  
  // CHANGE IT TO ASYNC (AWAIT)
  const downloadImage = async (fromUrl, id) => {
    try {
      RNFS.downloadFile({
        fromUrl,
        toFile: `file:///storage/emulated/0/Android/data/com.muustube/files/Images/${id}.png`,
      }).promise.then((r) => {
        
      });
    }
    catch(error) {
      console.log(error);
    }
  }

  const downloadSong = async (item, currentArtist = false, currentSong = false) => {
    let { channel, uri, imageURI, playlist, time, title } = item;
    let timeInSeconds = time.length <= 5 ? Number(time.substring(0, time.length - 3)) : 100;
    channel = channel === undefined ? "unknown" : channel;
    let newSongsArray = [];
    const extension = sourceIsAudio ? ".mp4" : ".mp4";
    try {
      let newSongs = await AsyncStorage.getItem('Songs');
      if(newSongs == null) {
        isDownloadingSongStatus(uri);
        axios.get(`https://tubeplaya.herokuapp.com/video_info/${uri}`)
        .then(function (response) {
          let tempDownloadingVideoKey = downloadingVideoKey;
          console.log('downloadingVideoKey', tempDownloadingVideoKey);
          tempDownloadingVideoKey.push({ uri, sourceIsAudio});
          console.log('downloadingVideoKeyAfterPush', tempDownloadingVideoKey);
          // self.setState({downloadingVideoKey});
          changeDownloadingVideoKey(tempDownloadingVideoKey);
          // media current format
          let url = sourceIsAudio ? response.data.formats[0].url : response.data.formats[2].url
          url = timeInSeconds > 13 ? response.data.formats[3].url : url;
          const thumbnail = response.data.thumbnail;

            let playlists = ["songsDownloadedOnDevice"];
            playlists = JSON.stringify(playlists);
            AsyncStorage.setItem("Playlists", playlists)
            .then(asyncalive => {
              isDownloadingSongStatus(false);
              const pathObjectName = sourceIsAudio ? "pathAudio" : "pathVideo";
              const isObjectMedia = sourceIsAudio ? "isAudio" : "isVideo";

              let songObject = {playlist: ["songsDownloadedOnDevice"], channel, isAudio: false, isVideo: false, pathVideo:'', pathAudio:'', title, uri, time, imageURI:thumbnail, isDownloaded: true, customName:currentSong, customArtist: currentArtist};
              songObject[pathObjectName] = `${response.reason}`;
              songObject[isObjectMedia] = true;
              let songs = [songObject];

              if(imageURI != `file:///storage/emulated/0/Android/data/com.muustube/files/Images/${uri}.png`) {
                downloadImage(thumbnail, uri);
                songObject.imageURI = `file:///storage/emulated/0/Android/data/com.muustube/files/Images/${uri}.png`;
              }

              if(sourceIsAudio) {

                RNFFmpeg.execute(`-i ${url} file:///storage/emulated/0/Android/data/com.muustube/files/Download/${songObject.uri}.mp3`).then(result => {
                  if(result.rc === 0) {
                    songObject[pathObjectName] = `file:///storage/emulated/0/Android/data/com.muustube/files/Download/${songObject.uri}.mp3`;
                    saveSongInLocalStorage(songObject, uri);
                  }
                  else {
                    deleteFromQueue(uri);
                    ToastAndroid.showWithGravity(
                      "Video not available in your region",
                      ToastAndroid.SHORT,
                      ToastAndroid.CENTER,
                    );
                  }
                });     
              }
              else {
                saveSongInLocalStorage(songObject, uri);
              }

          })
          .catch(error => console.log(error))
        });
      }
      else {
        isDownloadingSongStatus(true, uri);
        const songIsSaved = songExists(newSongs, uri, sourceIsAudio);
        
        if(songIsSaved === "Already downloaded") return false;

        const pathObjectName = sourceIsAudio ? "pathAudio" : "pathVideo";
        const isObjectMedia = sourceIsAudio ? "isAudio" : "isVideo";

        axios.get(`https://tubeplaya.herokuapp.com/video_info/${uri}`)
        .then(function (response) {
          let tempDownloadingVideoKey = downloadingVideoKey;
          console.log('downloadingVideoKey', tempDownloadingVideoKey);
          tempDownloadingVideoKey.push({uri, sourceIsAudio});
          console.log('downloadingVideoKeyAfterPush', tempDownloadingVideoKey);
          changeDownloadingVideoKey(tempDownloadingVideoKey);
          // self.setState({downloadingVideoKey});
          
          // media current format
          let url = sourceIsAudio ? response.data.formats[0].url : response.data.formats[2].url
          url = timeInSeconds > 13 ? response.data.formats[3].url : url;
          const thumbnail = response.data.thumbnail;
          let songObject = {};
          
          isDownloadingSongStatus(false);
          
          //  songObject = {};
          let isAlreadyInPlaylist = false;
            
          let playlistSongs = JSON.parse(newSongs);
          if(songIsSaved === "Already in playlist") {
              playlistSongs.forEach((song, i) => {
                if(song.uri === uri) {
                  isAlreadyInPlaylist = true;
                  if(song["playlist"].indexOf("songsDownloadedOnDevice") === -1)
                    song["playlist"].push("songsDownloadedOnDevice");
                  song["isDownloaded"] = true;
                  song[isObjectMedia] = true;
                  song[pathObjectName] = `${response.reason}`;
                  song["imageURI"] = thumbnail;
                  song["customName"] = currentSong;
                  song["customArtist"] = currentArtist;
                  songObject = song;
                }
              });
            }
            else if(songIsSaved === "Not existing") {
              console.log('hereeee')
              songObject = {
                playlist: ["songsDownloadedOnDevice"],
                channel,
                title,
                uri,
                time,
                imageURI:thumbnail,
                isDownloaded: true,
                customName: currentSong,
                customArtist: currentArtist
              }
              songObject[isObjectMedia] = true;
              songObject[pathObjectName] = `${response.reason}`;
            }
            if(imageURI != `file:///storage/emulated/0/Android/data/com.muustube/files/Images/${uri}.png`) {
              downloadImage(thumbnail, uri);
              songObject.imageURI = `file:///storage/emulated/0/Android/data/com.muustube/files/Images/${uri}.png`;
            }
            if(sourceIsAudio) {
              RNFFmpeg.execute(`-i ${url} file:///storage/emulated/0/Android/data/com.muustube/files/Download/${songObject.uri}.mp3`).then(result => {
                if(result.rc === 0) {
                  songObject[pathObjectName] = `file:///storage/emulated/0/Android/data/com.muustube/files/Download/${songObject.uri}.mp3`;
                  playlistSongs.push(songObject);
                  playlistSongs = JSON.stringify(playlistSongs);
                  saveSongInLocalStorage(songObject, uri, isAlreadyInPlaylist);
                }
                else {
                  console.log(downloadingVideoKey)
                  deleteFromQueue(uri);
                  ToastAndroid.showWithGravity(
                    "Video not available in your region",
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER,
                  );
                }
              });     
            }
            else {
              saveSongInLocalStorage(songObject, uri);
            }
      });


      }
        
    } catch (error) {
      console.log(error)
    }
  }

  

  const deleteFromQueue = (uri) => {
    return;
    let tempDownloadingVideoKey = downloadingVideoKey;
    const date = new Date();
    console.log(uri)
    console.log(date);
    console.log('downloadingVideoKeyDeleteFrom', tempDownloadingVideoKey);
    tempDownloadingVideoKey = tempDownloadingVideoKey.filter(dld => dld != uri);
    console.log('downloadingVideoKeyDeleted????', tempDownloadingVideoKey);
    console.log(date);
    // this.setState({downloadingVideoKey});
    changeDownloadingVideoKey(tempDownloadingVideoKey);
  }

  const saveSongInLocalStorage = async (songObject, uri, isAlreadyInPlaylist = false) => {
    let allSongs = await saveSongs(songObject, isAlreadyInPlaylist);

    updatePlaylistAfterDownload(allSongs);
    addToAllSongs(allSongs);
    allSongs = JSON.stringify(allSongs);

    AsyncStorage.setItem("Songs", allSongs)
    .then(res => {
    
      getSongsAndUpdate();
    })
    .catch(error => console.log(error))
  }

  const updatePlaylistAfterDownload = (songs = null) => {
    if(songs == null) {
      AsyncStorage.getItem("Songs", (e, result) => {
        songs = JSON.parse(result);
        let videoListPlaylist = songs.filter(song => song.playlist.includes(currentPlaylistName));
        if(currentPlaylistName != "songsDownloadedOnDevice") {
          videoListPlaylist.sort(function(a, b) { 
            return a.playlistsIndex[currentPlaylistName] - b.playlistsIndex[currentPlaylistName];
          });
        }
        updateLastPlaylist(songs, "playlist", currentPlaylistName);
        // self.setState({videoListPlaylist})
        changeVideoListPlaylist(videoListPlaylist);
      });
    }
    else {
      let videoListPlaylist = songs.filter(song => song.playlist.includes(currentPlaylistName));
      if(currentPlaylistName != "songsDownloadedOnDevice") {
        videoListPlaylist.sort(function(a, b) { 
          return a.playlistsIndex[currentPlaylistName] - b.playlistsIndex[currentPlaylistName];
        });
      }
      updateLastPlaylist(songs, "playlist", currentPlaylistName);
      // self.setState({videoListPlaylist})
      changeVideoListPlaylist(videoListPlaylist);
    }
  }

  

  const addToAllSongs = (allSongs) => {
    changeAllSongs(allSongs);
  }

  const enableMusicControls = () => {
    MusicControl.setNowPlaying({
        title: videoTitle,
        artwork: imageURI, // URL or RN's image require()
        artist: videoChannel,
        album: '',
        genre: '',
        duration: 294, // (Seconds)
        description: '', // Android Only
        color: 0xFFFFFF, // Notification Color - Android Only
      });
  
      MusicControl.enableControl('play', true)
      MusicControl.enableControl('pause', true)
      MusicControl.enableControl('stop', false)
      MusicControl.enableControl('nextTrack', true)
      MusicControl.enableControl('previousTrack', true);
  }

  


  // creating functions to make it work lmao
  const stop = () => {
    togglePause(true);
  }

  const loadingState = () => {return}

  const scale = animation.interpolate({inputRange:[0, 1], outputRange:[30, 0], extrapolate:'clamp'});
  const opacity = animation.interpolate({inputRange:[0, 0.9, 1], outputRange:[1, 1, 0], extrapolate:'clamp'})
  return(
      <View style={{flex:1, backgroundColor:'#222', position:'relative'}}>
        {splashScreenIsActive ?
        (<SplashScreen upliftSplashState={upliftSplashState} isAboutToActivate={isAboutToActivate} />)
        :
        (
          <View style={{flex:1, width:'100%'}}>
            <AppContainer
              screenProps={{
                // ...state,
                downloadImage: downloadImage,
                paused: paused,
                stop: stop,
                currentVideoURIChange: changeCurrentVideo,
                currentVideoKeyChange: changeCurrentVideoKey,
                currentVideoKey: currentVideoKey,
                currentVideoIndexChange:changeCurrentVideoIndex,
                changeVideoChannel:changeVideoChannel,
                changeVideoTitle:changeVideoTitle,
                playNewSong: playNewSong,
                setVideoList: setVideoList,
                videoList: videoList,
                togglePause: togglePause,
                playNextSong: playNextSong,
                isLoadingSong: isLoadingSong,
                loadingState: loadingState,
                playIndexSong: playIndexSong,
                isDownloadingSong: isDownloadingSong,
                isDownloadingSongStatus: isDownloadingSongStatus,
                musicPlayerFullScreen: musicPlayerFullScreen,
                musicPlayerHide: toggleFullScreenMusicPlayer, // using dispatch redux
                changeSearchListStatus: changeSearchListStatus, //using dispatch redux
                searchListStatus: changeSearchListStatus, //using dispatch redux
                setVideoListPlaylist: changeVideoListPlaylist, // using dispatch redux
                searchListActive: searchListActive,
                videoListPlaylist: videoListPlaylist,
                downloadSong: downloadSong,
                changeVideoDownloadStatus: changeVideoDownloadStatus,
                updateLastPlaylist: updateLastPlaylist,
                searched: searched,
                changeSplashState: changeSplashState,
                isLoadingSearch: isLoadingSearch,
                loadingSearchStatus: changeIsLoadingSearch, // using dispatch redux
                downloadedSongsList: downloadedSongsList,
                downloadingVideoKey: downloadingVideoKey,
                setDownloadingVideoKey: changeDownloadingVideoKey, // using dispatch redux
                switchValue: sourceIsAudio,
                sourceIsAudio: sourceIsAudio,
                changeSource: () => console.log('change source'),
                currentVideoItem: currentVideoItem,
                appIsConnected: appIsConnected,
                setLocalePlaylist: setLocalePlaylist,
                setLastSearch: setLastSearch,
                setSongProgress: setSongProgress,
                updatePlaylistAfterDownload: updatePlaylistAfterDownload,
                currentPlaylistName: currentPlaylistName,
                addToAllSongs: addToAllSongs,
                allSongs: allSongs,
                changeRelatedVideos: changeRelatedVideos,
                playAndPause: playpause,
                currentVideoURImage: changeImageURI
                }}
            />
            <MusicPlayer
              // {...state}
              appIsConnected={appIsConnected}
              playNextSong={playNextSong}
              playNextSongOnScroll={playNextSongOnScroll}
              playpause={playpause}
              currentVideoURIChange={changeCurrentVideo}
              currentVideoIndexChange={changeCurrentVideoIndex}
              currentVideoKeyChange={currentVideoKey}
              toggleFullScreenMusicPlayer={toggleFullScreenMusicPlayer}
              downloadSong={downloadSong}
              changeVideoDownloadStatus={changeVideoDownloadStatus}
              enableMusicControls={enableMusicControls}
              updateLastSongData={updateLastSongData}
              setSongProgress={setSongProgress}
              toggleFullScreenMusicPlayer={toggleFullScreenMusicPlayer}
            />
          </View>
        )
        }
        {(loadingBubble && !splashScreenIsActive) ?
        (<Animated.View style={{position:'absolute', opacity, top:(height / 2) - 250, left: (width/2) - 250, width: 500, height: 500, borderRadius: 500, backgroundColor:'#ea4c89 ', transform:[{scale}]}} />)
      : null}
      </View>
  );
}







export default App;