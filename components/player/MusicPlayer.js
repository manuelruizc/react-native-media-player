import React, {Component} from 'react';
import {View, StyleSheet, Image, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, ImageBackground, Dimensions, Animated, Easing, ToastAndroid } from 'react-native';
import Video from 'react-native-video';
import {debounce} from 'lodash';
import { convertMinsSecs } from '../../helpers/snippets';
import Icon from 'react-native-vector-icons/Ionicons';
import ControlsContainer from './components/ControlsContainer';
import SliderMediaTrackContainer from './components/SliderMediaTrackContainer';
import VolumeContainer from './components/VolumeContainer';
import { styles } from './styles/MainStyles'
import ScrollItems from './components/ScrollItems';
import MediaInfo from './components/MediaInfo';

const screenWidth = Dimensions.get('window').width;
const window = Dimensions.get('window');
export default class Playlists extends Component {

    constructor(props) {
        super(props);

        this.state = {
            currentTime: 0,
            currentTimeWhenSliding: 0,
            slidingActive: false,
            duration: 0,
            timeAvailable: false,
            playerFullScreen: false,
            seconds: 0,
            volume: 0,
            showFullButtons: false,
            activeFullButonsDuration: 3,
            activationInterval: null,
            lastIndex: 0,
            isFavorited: false,
        }
    }

    componentWillMount() {
      this.animatedValue = new Animated.Value(1);
      this.initAnimValue = new Animated.Value(150);
    }

    componentWillReceiveProps(newProps) {
      const { searchListStatus, currentVideoIndex, musicPlayerFullScreen } = newProps;
      const sls = this.props.searchListStatus;
      const cvi = this.props.currentVideoIndex;
      if(musicPlayerFullScreen && musicPlayerFullScreen != this.props.musicPlayerFullScreen) {
        this.myScroll.scrollTo({x: currentVideoIndex*screenWidth, y:0, animated: true});
      }

      if(newProps.allSongs != this.props.allSongs || (newProps.currentVideoIndex != this.props.currentVideoIndex)) {
        console.log('NEW: ',newProps.allSongs)
        console.log('OLD: ',this.props.allSongs)
        const { relatedVideos, searchListStatus, playlistSaved, currentPlaylistName, currentVideoIndex, currentVideoKey, allSongs } = newProps;
        const videos = searchListStatus ? relatedVideos : playlistSaved;
        const video = videos[currentVideoIndex];
        let id = null;
        if(video != undefined) {
          console.log("BILLIE JEAN")
          id = searchListStatus ? video.id : video.uri;
          const isFavorited = this.isFavorited(id, newProps.allSongs);
          this.setState({isFavorited});
        }
      }

      if(cvi === this.state.lastIndex)
        return;
      if(!searchListStatus) {
        this.myScroll.scrollTo({x: currentVideoIndex*screenWidth, y:0, animated: true});
      }
    }
    
    componentWillUnmount() {
      
      this.props.setSongProgress(this.state.currentTime, true);
    }

    async componentDidMount() {
      let { songProgress, currentVideoIndex, searchListStatus } = this.props;

      if(!searchListStatus) {
        this.myScroll.scrollTo({x: currentVideoIndex * screenWidth, y:0, animated: true});
      }
      
      this.setState({
        currentTime: songProgress
      });
  
      


      Animated.timing(this.initAnimValue, {
        toValue: 0,
        duration: 750,
        delay: 240,
        easing: Easing.linear
      }).start()

    }

    
    
    _animOnPressIn = () => {
      Animated.spring(this.animatedValue, {
        toValue: 1.2,
    }).start()
    }

    _animOnPressOut = () => {
      Animated.spring(this.animatedValue, {
        toValue: 1, 
        friction: 3,
        tension: 40
        }).start()  
    }

    toggleVideoFullscreen = (toggle = true) => {
      if(toggle) {
        this.setState({playerFullScreen: !this.state.playerFullScreen});
        return true;
      }
      this.setState({playerFullScreen: toggle});
    }

    toggleShowButtons = () => {
      const self = this;
      const boolean = this.state.showFullButtons ? false : true;
      self.setState({showFullButtons: boolean, activeFullButtonsDuration: 3}, () => {
        boolean ? this.setState({activationInterval: setInterval(this.animationInterval, 1000)}) : self.state.activationInterval === null ? 
          null : clearInterval(self.state.activationInterval);
      })
    }

    
    handleScroll = (event) =>  {
      const { lastIndex } = this.state;
      const {  searchListStatus } = this.props;
      const width = screenWidth;
      const offset = event.nativeEvent.contentOffset.x;
      const result = Math.round(offset / width);
      console.log("aqhi madre", {
        result, width,
      });
      if(lastIndex === result) return;
      if(searchListStatus) {
        const { relatedVideos } = this.props;
        const video = relatedVideos[result];
        this.props.playNextSongOnScroll(result, video);
      }
      else {
        const { playlistSaved } = this.props;
        const video = playlistSaved[result];
        const isDownloaded = video.isDownloaded;
        if(isDownloaded) {
          this.props.playNextSong(null, false, result);
        }
        else {
          this.props.playNextSongOnScroll(result, video, false, true);
        }
      }
      
      this.setState({ lastIndex: result });
    }

    _scrollToSong = () => {
      const { searchListStatus, currentVideoIndex } = this.props;

      if(!searchListStatus) {
        this.myScroll.scrollTo({x: this.state.lastIndex*screenWidth, y: 0, animated: true});
      }
    }

    addToPlaylist = () => {
      const { relatedVideos, searchListStatus, playlistSaved, } = this.props;
      const { lastIndex } = this.state;
      let videos = searchListStatus ? relatedVideos : playlistSaved;
      const video = videos[lastIndex];
      console.log("bibi gaitan", {video, videos, lastIndex, relatedVideos, playlistSaved,searchListStatus});
      if(video.uri === undefined) {
        let item =  { channel: video.author, title:  video.title, uri: video.id, time: 0, imageURI: video.video_thumbnail };
        this.props.addToPlaylist(item);
      }
      else {
        this.props.addToPlaylist(video);
      }
    }

    deleteFromPlaylist = () => {
      const { relatedVideos, searchListStatus, playlistSaved, } = this.props;
      const { lastIndex } = this.state;
      let videos = searchListStatus ? relatedVideos : playlistSaved;
      const video = videos[lastIndex];
      if(video.uri === undefined) {
        this.props.deleteSongFromPlaylist(video.id);
      }
      else {
        this.props.deleteSongFromPlaylist(video.uri);
      }
    }

    isFavorited = (uri, allSongs) => {
      let isFavorited = false;
      for(let i = 0; i < allSongs.length; i++) {
        const song = allSongs[i];
        if(song.playlist.includes("favorites__Playlist") && song.uri === uri) {
          isFavorited = true;
          break;
        }
      }

      return isFavorited;
    }

  render() {
    const isPaused = this.props.paused;
    const fullscreen = /*true*/this.props.musicPlayerFullScreen;
    const downloaded = this.props.videoIsDownloaded; 
    const isAudioSource = this.props.sourceIsAudio;
    const { playerFullScreen, showFullButtons } = this.state;
    const item = this.props.currentVideoItem === null ? null : this.props.currentVideoItem;
    const { relatedVideos, searchListStatus, playlistSaved, currentPlaylistName, currentVideoIndex, currentVideoKey, allSongs } = this.props;
    const { isFavorited } = this.state;

    let list_of_videos = searchListStatus ? relatedVideos : playlistSaved;
    if(!searchListStatus && list_of_videos.length > 0 && currentPlaylistName != 'songsDownloadedOnDevice' && currentPlaylistName != "searchbar") {
      list_of_videos.sort(function(a, b) { 
        return a.playlistsIndex[currentPlaylistName] - b.playlistsIndex[currentPlaylistName];
      });
    }

    return (
        <Animated.View style={fullscreen ? styles.playaContainerFullScreen : [styles.playaContainer, {transform: [{translateY: this.initAnimValue}]}]}>
          <View style={[{width: screenWidth, height:screenWidth, alignItems: 'center', justifyContent: 'center', marginBottom: 45, paddingRight: !isAudioSource ? 15 : 0}, fullscreen ? {} : {position: 'absolute', top: 0, right: 600,}]}>
            <ScrollView 
            ref={(ref) => {
              this.myScroll = ref;
            }}
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={event => this.handleScroll(event)}
            scrollEventThrottle={16} contentContainerStyle={{flexGrow: 1}} horizontal pagingEnabled >
                <ScrollItems
                  isAudioSource={isAudioSource}
                  searchListStatus={searchListStatus}
                  videos={list_of_videos}
                  item={item}
                />
                <View style={isAudioSource ? styles.doNotDisplay : fullscreen ? playerFullScreen ? {width:'100%', height: '100%', position:'relative'} : {width:'100%', height: '100%',} : styles.doNotDisplay}>
                  <Video
                  style={isAudioSource ? styles.doNotDisplay : playerFullScreen ? {width: window.height + 38.5, height: window.width, backgroundColor: 'black', transform: [{rotate:'90deg'}, {translateX: (window.width / 100) * 58.35}, {translateY: (window.height / 100) * 28.32}], zIndex: 101} :{width:'100%', height:'100%', backgroundColor:'rgba(0, 0, 0, 0.97)'}} 
                  source={{uri: this.props.currentVideo}}
                  ref={(ref) => {
                  this.player = ref
                  }}     // Store reference
                  onBuffer={this.onBuffer}       // Callback when remote video is buffering
                  onError={this.errorSong}        // Callback when video cannot be loaded
                  onAudioBecomingNoisy={this.stop}
                  playInBackground={true}
                  fullscreen={true}
                  resizeMode={"contain"}
                  audioOnly={true}
                  onLoad={this.onLoad}
                  paused={isPaused}
                  onEnd={this.VideoEnded}
                  onProgress={this.Progress} 
                  progressUpdateInterval={1000}
                  onSeek={this.onSeek}
                  />
                  <View
                    style={isAudioSource ? styles.doNotDisplay : playerFullScreen ? {width: window.height + 38.5, height: window.width, transform: [{rotate:'90deg'}, {translateX: (window.width / 100) * 58.35}, {translateY: (window.height / 100) * 28.32}], zIndex: 400, justifyContent:'center', alignItems:'center', position: 'absolute'} : styles.doNotDisplay}
                  >
                    <View onStartShouldSetResponder={() => this.toggleShowButtons()} style={playerFullScreen ? {zIndex:399, position:'relative', width:'100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.45)', flexDirection:'row', alignItems:'center', justifyContent: 'space-around', display: showFullButtons ? "flex" : "none"} : styles.doNotDisplay}>
                      <TouchableWithoutFeedback onPressIn={() => this.seekSong(-5, true)}>
                        <Animated.View>
                          <Icon name={"ios-rewind"} size={50} color={"#FFFFFF"} style={{padding:10,}} />
                        </Animated.View>
                      </TouchableWithoutFeedback>
                      <TouchableWithoutFeedback onPressOut={() => this.playPause(true)} onPressIn={this._animOnPressIn}>
                        <Animated.View style={{transform: [{scale: this.animatedValue}]}}>
                          <Icon name={isPaused ? "ios-play" : "ios-pause"} size={fullscreen ? 65 : 50} color={"#FFFFFF"} style={{padding:10}} />
                        </Animated.View>
                      </TouchableWithoutFeedback>
                      <TouchableWithoutFeedback onPressIn={() => this.seekSong(5, true)}>
                        <Animated.View>
                          <Icon name={"ios-rewind"} size={50} color={"#FFFFFF"} style={{padding:10,transform: [{rotate: '180deg'}]}} />
                        </Animated.View>
                      </TouchableWithoutFeedback>
                      <View style={{position:'absolute', bottom:8, right: 8, flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                        <TouchableWithoutFeedback  onPress={() => {this.toggleVideoFullscreen(false); this.toggleShowButtons();}}>
                            <Icon name={"md-expand"} size={32} color={"#FFFFFF"} style={{padding:10,}} />
                        </TouchableWithoutFeedback>
                      </View>
                    </View>
                    <View onStartShouldSetResponder={() => this.toggleShowButtons()} style={playerFullScreen ? {zIndex:398, position:'absolute', width:'100%', height:'100%', top:0, left:0,} : styles.doNotDisplay}></View>
                  </View>
                </View>
              </ScrollView>
            </View>

            
            <MediaInfo
              fullscreen={fullscreen}
              item={item}
              videoChannel={this.props.videoChannel}
              videoTitle={this.props.videoTitle}
            />

            <SliderMediaTrackContainer
              fullscreen={fullscreen}
              duration={this.state.duration}
              currentTime={this.state.currentTime}
              currentTimeWhenSliding={this.state.currentTimeWhenSliding}
              slidingActive={this.state.slidingActive}
              updateInfoTime={this.updateInfoTime}
              onSlidingComplete={this.onSlidingComplete}
              onSlidingStart={this.onSlidingStart}
            />


            <ControlsContainer
              isPaused={isPaused}
              fullscreen={fullscreen}
              toggleFullScreen={this.toggleFullScreen}
              videoTitle={this.props.videoTitle}
              item={item}
              currentTime={this.state.currentTime}
              duration={this.state.duration}
              nextSong={this.nextSong}
              seekSong={this.seekSong}
              prevSong={this.prevSong}
              animatedValue={this.animatedValue}
              _animOnPressIn={this._animOnPressIn}
              playPause={this.playPause}
            />


            <VolumeContainer
              fullscreen={fullscreen}
              volume={this.state.volume}
            />
            {fullscreen && !isAudioSource ?
                  (
                  <View style={{position:'absolute', bottom:5, right:5}}>
                    <TouchableWithoutFeedback onPress={() => {this.toggleVideoFullscreen(); this.toggleShowButtons();}}>
                      <Icon name={"ios-expand"} size={32} color={"#FFFFFF"} style={{padding:10,}} />
                    </TouchableWithoutFeedback>
                  </View>
                  )
                  :
                  null
                }
        </Animated.View>
    );
  }

  animationInterval = () => {
    if(this.state.activeFullButtonsDuration === 0) {
      clearInterval(this.state.activationInterval);
      this.setState({showFullButtons: false, activeFullButtonsDuration: 4, activationInterval: null}, () => console.log(this.state));
    }
    else
      this.setState({activeFullButtonsDuration: this.state.activeFullButtonsDuration - 1});
  }


  playPause = (animation = false) => {
      this._animOnPressOut();
      this.props.playpause();
      const { activeFullButtonsDuration, activationInterval } = this.state;
      if(animation) {
        if(activeFullButtonsDuration) {
          this.setState({activeFullButtonsDuration: 4});
        }
        else if(activationInterval != null) {
          this.setState({activationInterval: setInterval(this.animationInterval, 1000)})
        }
      }
  }

  seekSong = (seconds, animation = false) => {
    let { currentTime, duration, activeFullButtonsDuration, activationInterval } = this.state;
    if(currentTime + seconds < 0) {
      this.player.seek(0);
      return true;
    }
    else if(currentTime + seconds > duration) {
      this.player.seek(Number(duration - 1));
    }

    if(animation) {
      if(activeFullButtonsDuration) {
        this.setState({activeFullButtonsDuration: 4});
      }
      else if(activationInterval != null) {
        this.setState({activationInterval: setInterval(this.animationInterval, 1000)})
      }
    }
    this.player.seek(Number(currentTime + seconds));
  }


  goToFullScreen = () => {
    if(!this.state.playerFullScreen && !this.props.isAudioSource) {
        this.setState({playerFullScreen: true});
    }
  }

  downloadSong = (item) => {
    this.props.downloadSong(item)
  }

  updateInfoTime = (currentTime) => {
      this.setState({currentTime, currentTimeWhenSliding: currentTime});
  }

  onSlidingComplete = (currentTime) => {
    this.setState({currentTime, currentTimeWhenSliding: currentTime, slidingActive: false}, () => this.player.seek(currentTime));
  }

  onSlidingStart = () => {
    this.setState({slidingActive: true});
  }

  onSeek = (info) => {
    console.log(info.currentTime)
    console.log(info.seekTime)
  }

  toggleFullScreen = () => {
      this.props.toggleFullScreenMusicPlayer();
  }

  Progress = (info) => {
    if(this.state.timeAvailable) return;
    let {currentTime} = info;
    let secs = 0;
    let self = this;

    currentTime = Math.round(Number(currentTime));

    this.setState({seconds: this.state.seconds+1});


    if(!this.state.timeAvailable) {
        this.setState({currentTime});
    }
  }

  stop = () => {
      this.props.stop()
  }

  onLoad = (info) => {
    let {duration, currentPosition} = info;
    let nextIndex = 0;
    const { relatedVideos, searchListStatus, playlistSaved, currentPlaylistName, currentVideoIndex, currentVideoKey, allSongs } = this.props;

    duration = Math.round(Number(duration));
    currentPosition = this.props.songProgress;
    this.setState({duration});
    this.player.seek(this.props.songProgress);
    if(this.props.videoIsDownloaded) {
        // this.props.updateLastSongData();
    }
    if(currentVideoIndex === 0) {
      this.myScroll.scrollTo({x: 0, y: 0, animated: true});
    }
    this.props.enableMusicControls();
  }

  VideoEnded = () => {
    const { searchListStatus, currentVideoIndex, relatedVideos, playlistSaved } = this.props;
    const {  lastIndex } = this.state;
    let index = lastIndex + 1;
    this.setState( { lastIndex: index } );
    let scrollToValue = screenWidth*index;
    if(searchListStatus) {
      const video = relatedVideos[index];
      if(video == undefined) return false;
      this.props.playNextSongOnScroll(index, video);
      this.myScroll.scrollTo({x: scrollToValue, y:0,  animated: true})
    }
    else {
      index = playlistSaved[index] === undefined ? 0 : index;
      this.setState({lastIndex: index});
      scrollToValue = screenWidth*index;
      this.myScroll.scrollTo({x: scrollToValue, y:0,  animated: true})
      this.props.playNextSong();
    }
  }

  nextSong = () => {
    const { searchListStatus, currentVideoIndex, relatedVideos, playlistSaved } = this.props;
    let {  lastIndex } = this.state;
    let index = lastIndex + 1;
    this.setState( { lastIndex: index } );
    let scrollToValue = screenWidth*index;
    if(searchListStatus) {
      const video = relatedVideos[index];
      if(video == undefined) return false;
      console.log('viddid', video);
      console.log('index', index)
      this.props.playNextSongOnScroll(index, video);
      this.myScroll.scrollTo({x: scrollToValue, y:0,  animated: true});
    }
    else {
      this.props.playNextSong();
      index = playlistSaved[index] === undefined ? 0 : index;
      this.setState({lastIndex: index})
      scrollToValue = screenWidth*index;
      this.myScroll.scrollTo({x: scrollToValue, y:0,  animated: true});
    }
  }

  errorSong = () => {
    ToastAndroid.showWithGravity(
      "This song can't be played",
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
    const { searchListStatus, currentVideoIndex, relatedVideos, playlistSaved, appIsConnected } = this.props;
    if(!appIsConnected) return false;
    const {  lastIndex } = this.state;
    let index = lastIndex + 1;
    this.setState( { lastIndex: index } );
    let scrollToValue = screenWidth*index;
    if(searchListStatus) {
      const video = relatedVideos[currentVideoIndex + 1];
      if(video == undefined) return false;
      this.props.playNextSongOnScroll(index, video);
      this.myScroll.scrollTo({x: scrollToValue, y:0,  animated: true})
    }
    else {
      index = playlistSaved[index] === undefined ? 0 : index;
      this.setState({lastIndex: index});
      scrollToValue = screenWidth*index;
      this.props.playNextSong();
    }
  }

  prevSong = () => {
    let {currentTime} = this.state;
    currentTime = Math.round(Number(currentTime));
    const { searchListStatus, currentVideoIndex, relatedVideos, playlistSaved } = this.props;
    let index = 0;
    let scrollToValue = 0;
    if(currentTime < 2) {
      const { lastIndex } = this.state;

      if(searchListStatus) {
        index = lastIndex === 0 ? this.props.relatedVideos.length - 1 : lastIndex - 1;
        this.setState( { lastIndex: index } );
        scrollToValue = screenWidth*index;
        const video = relatedVideos[index];
        if(video == undefined) return false;
        this.props.playNextSongOnScroll(index, video);
        this.myScroll.scrollTo({x: scrollToValue, y:0,  animated: true});
      }
      else {
        index = lastIndex === 0 ? playlistSaved.length - 1 : lastIndex - 1;
        this.setState({lastIndex: index});
        scrollToValue = screenWidth*index;  
        this.myScroll.scrollTo({x: scrollToValue, y:0,  animated: true})
        this.props.playNextSong(true, false, index);
      }

    }
    else {
      this.setState({currentTime:0}, () => this.player.seek(0));
    }
  }
}

