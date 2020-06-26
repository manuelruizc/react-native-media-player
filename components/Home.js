import React, {Component} from 'react';
import {Platform, Animated, ActivityIndicator, Image, ImageBackground, TouchableOpacity, BackHandler, StyleSheet, Text, View, ScrollView, TouchableHighlight, TextInput, Easing} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'react-native-axios';
import {debounce} from 'lodash';
import OptionsMenu from 'react-native-options-menu';
import ItemCard from './home/ItemCard';
import DownloadNewSong from './modals/DownloadNewSong';
import { styles } from './styles/HomeStyles';
import Header from './home/Header';


export default class Home extends Component {
  static navigationOptions = {
    title: "Home",
    headerStyle: {
      backgroundColor: '#f4511e',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  }

  constructor(props) {
    super(props);

    this.state = {
      videos: [],
      perro: "Pollo",
      currentVideo: "https://r2---sn-9gv7enek.googlevideo.com/videoplayback?c=WEB&key=yt6&mime=video%2Fmp4&usequic=no&fvip=3&dur=215.225&expire=1554782710&clen=9287241&ratebypass=yes&requiressl=yes&ei=lsWrXM7gNOuOir4P-rOpuAc&source=youtube&initcwndbps=475000&ipbits=0&sparams=clen%2Cdur%2Cei%2Cgir%2Cid%2Cinitcwndbps%2Cip%2Cipbits%2Citag%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Cratebypass%2Crequiressl%2Csource%2Cusequic%2Cexpire&lmt=1537225349583990&beids=23800701&id=o-AC9TY7PUxuUrDTICR8iIcpuovoSjJ0jR0TNb7q0-uxZe&ms=au%2Conr&mt=1554760979&mv=m&pl=49&itag=18&mm=31%2C26&ip=2806%3A104e%3A19%3A5399%3A4966%3Aa2ac%3Aeae1%3Ab051&mn=sn-9gv7enek%2Csn-q4fl6n7l&gir=yes&signature=C227376E49EF7290630929ED507D45CFAE720884.B34BEA21A59B4625D78E9A3A890906843BD36538",
      currentVideoKey: "",
      currentVideoIndex: 0,
      isLoading: false,
      currentVideoTitle: "Reproduce un video",
      paused: false,
      isLoadingSearch: true,
      isDone: false,
      text: "",
      songs: [],
      isModalOpen: false,
      currentItem: null
    }
  }

  componentDidMount(){
    BackHandler.addEventListener("hardwareBackPress", this.backButtonAction);

    this.loopAnimation();
    Animated.timing(this.initAnimValue, {
      toValue: 1,
      duration: 700,
      delay: 870,
      easing: Easing.linear
    }).start();
    //this.searchVideo("Rhythm of the night");
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backButtonAction);
  }

  componentWillMount() {
    this.opacityValue = new Animated.Value(0);
    this.initAnimValue = new Animated.Value(0);
    
  }

  backButtonAction = () => {
    if(this.props.screenProps.musicPlayerFullScreen) {
      this.props.screenProps.musicPlayerHide();
      return true;
    }
    else {
      return false;
    }
  }

  openModal = (item) => {
    this.setState({isModalOpen: true, currentItem: item});
  }

  closeModal = () => {
    this.setState({isModalOpen: false});
  }



  searchVideo = debounce((payload) => {
    if(payload != "") {
      this.setState({isLoadingSearch: true, videos: []})
      this.props.screenProps.loadingSearchStatus(true);
      this.props.screenProps.setLastSearch(payload);
      const self = this;
      axios.get(`http://tubeplaya.herokuapp.com/search/${payload}/`)
      .then(function (response) {
        self.setState({videos:response.data, isLoadingSearch: false}, () => {
          self.setVideoList();
          self.props.screenProps.loadingSearchStatus(false);
          self.props.screenProps.currentVideoIndexChange(0);
        });
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }, 700);


  getVideoURI = (uri, title, index, imageURI) => {
    this.props.screenProps.loadingState(true);
    this.props.screenProps.searchListStatus(true);
    this.props.screenProps.currentVideoKeyChange(uri);
    this.props.screenProps.changeVideoDownloadStatus(false);
    this.props.screenProps.currentVideoIndexChange(0);
    const self = this;
    const vidios = this.props.screenProps.videoList;
    this.setState({currentVideoKey: uri});
    this.props.screenProps.setSongProgress(0, false);
    this.props.screenProps.updateLastPlaylist(this.props.screenProps.videoList, "search", "searchbar");

    const newStateVideos = vidios.map((vidio, i) => {
      if(index == i && !vidio.isPlaying) {
        return {title: vidio.title, uri: vidio.uri, imageURI: vidio.imageURI, time: vidio.time, isPlaying: true};
      }
      else {
        return {title: vidio.title, uri: vidio.uri, imageURI: vidio.imageURI, time: vidio.time, isPlaying: false};
      }
    });


    if(uri == this.props.screenProps.currentVideoKey) {
      const isPaused = this.state.paused ? false: true;

      this.setState({paused: isPaused})
      this.props.screenProps.togglePause(isPaused);
    }
    else {
      this.setState({isLoading: true, videos: newStateVideos, paused: false});
      axios.get(`https://tubeplaya.herokuapp.com/video_info/${uri}`)
      .then(function (response) {
        const source = self.props.screenProps.switchValue ? response.data.formats[0].url : response.data.formats[1].url;
        self.props.screenProps.currentVideoURIChange(source);
        self.props.screenProps.currentVideoURImage(response.data.thumbnail);
        self.props.screenProps.changeVideoChannel(response.data.uploader);
        self.props.screenProps.changeVideoTitle(response.data.title);
        self.props.screenProps.loadingState(false);
        self.props.screenProps.updateRelatedVideos(response.data.related_videos.slice(0, 2));
        const songData = {channel: response.data.uploader, isDownloaded: false, title: response.data.title, path:"", time: "", uri, imageURI: response.data.thumbnail};
        self.props.screenProps.changeCurrentVideoUpdate(songData);
        self.props.screenProps.playNewSong(false, index, songData);
        self.setVideoList();
        self.setState({currentVideo: response.data.uri, currentVideoIndex: index, perro: response.data.uri, isLoading:false, currentVideoTitle: title, videos: newStateVideos, paused: false});
      })
      .catch(function (error) {
        console.log(error);
      });
    }

    
  }


  downloadSong = (item, currentArtist, currentSong) => {
    const artist = currentArtist === "" ? false : currentArtist;
    const song = currentSong === "" ? false : currentSong;
    this.props.screenProps.downloadSong(item, artist, song);
    this.props.screenProps.getSongs();
  }

  setVideoList = () => {
    let videoList = this.state.videos;
    this.props.screenProps.setVideoList(videoList);
  }

  loopAnimation = () => {
    Animated.sequence([
      Animated.timing(this.opacityValue, {
        toValue: 0,
        duration: 1000,
        easing: Easing.linear
      }),
      Animated.timing(this.opacityValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear
      })
    ]).start(() => {
      // Logic whenever an iteration finishes...
      this.loopAnimation()
    });
  }

  changeText = text => {
    this.setState({text});
  }

  render() {
    let videoList = this.props.screenProps.videoList;
    const path = this.props.screenProps.switchValue ? "isAudio" : "isVideo";
    const downloadedSongs = this.props.screenProps.allSongs.filter(song => song.isDownloaded && song[path]);
    const songs = this.state.songs;
    const searchStatus = this.props.screenProps.isLoadingSearch
    const {navigation} = this.props;
    const pathName = this.props.screenProps.switchValue ? "path" : "videopath";
    const myIcon = (<Icon name={"ios-more"} size={25} color={"white"} style={{transform: [{rotate:'90deg'}]}} />);

    return (
      <View style={styles.container}>

        {this.state.isModalOpen ? (<DownloadNewSong item={this.state.currentItem} downloadSong={this.downloadSong} closeModal={this.closeModal} />) : false}

        <Header
          navigation={navigation}
          text={this.state.text}
          changeText={this.changeText}
          searchVideo={this.searchVideo}
        />
        <ScrollView style={styles.scrollViewContainer} contentContainerStyle={{flexGrow: 1}}>
            {!this.props.screenProps.isLoadingSearch ?
              videoList.map((item, index) => (
              <Animated.View title={item.title} key={item.uri} style={this.props.screenProps.downloadingVideoKey.includes(item.uri) ? {...styles.magic, opacity:this.opacityValue} : [styles.magic, {opacity: this.initAnimValue}] }>
                  <ItemCard
                  downloadedSongs={downloadedSongs}
                  item={item}
                  index={index}
                  getVideoURI={this.getVideoURI}
                  playSong={this.playSong}
                  screenProps={this.props.screenProps}
                  />
                  
                  <View style={{justifyContent:'flex-start', alignItems:'flex-start', flex:2, position:'absolute', top:10, right:20,}}>
                  {
                    (item.isDownloaded && item[pathName]  || this.props.screenProps.downloadingVideoKey == item.uri)
                    ?
                    (<OptionsMenu
                      customButton={myIcon}
                      destructiveIndex={1}
                      options={["Agregar a playlist"]}
                      actions={[() => this.props.navigation.navigate('PlaylistOptions', {item})]}
                    />)
                    :
                    (<OptionsMenu
                      customButton={myIcon}
                      destructiveIndex={1}
                      options={["Agregar a playlist", "Descargar"]}
                      actions={[() => this.props.navigation.navigate('PlaylistOptions', {item}), () => this.openModal(item)]}
                    />)
                  }
                  </View>
                </Animated.View>
            )
          )
          :
          (<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" color="#1ACBE8" />
          </View>)
            }
        </ScrollView>
        {!this.props.screenProps.appIsConnected
          ?
        (<Text style={{width:'100%', backgroundColor:'red', color:'white', textAlign:'center'}}>Sin conexión a internet</Text>) : null}
      </View>
    );
  }

  emptyText = () => {
    this.setState({text: ""})
  }

  playSong = (index, songData) => {
    const self = this;
    const pathName = this.props.screenProps.switchValue ? "pathAudio" : "pathVideo    ";
    const {channel, isDownloaded, title, time, uri, imageURI} = songData;
    const path = songData[pathName];
    this.props.screenProps.setSongProgress(0, false);

    if(uri == this.props.screenProps.currentVideoKey) {
      this.props.screenProps.togglePause();
    }
    else {
      if(isDownloaded) {
        self.props.screenProps.currentVideoURIChange(path);
        self.props.screenProps.currentVideoKeyChange(uri);
        self.props.screenProps.currentVideoURImage(imageURI);
        self.props.screenProps.changeVideoChannel(channel);
        self.props.screenProps.changeVideoTitle(title);
        self.props.screenProps.playNewSong(false, index);
        self.props.screenProps.loadingState(false);
        self.props.screenProps.changeVideoDownloadStatus(true);
        self.props.screenProps.changeCurrentVideoUpdate(songData);
        this.props.screenProps.searchListStatus(true);
      }
      // this.setVideoList();
      this.props.screenProps.updateLastPlaylist(this.props.screenProps.videoList, "search", "searchbar");
    }
}
}