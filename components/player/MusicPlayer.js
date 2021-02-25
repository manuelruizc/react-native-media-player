/* eslint-disable keyword-spacing */
/* eslint-disable prettier/prettier */
import React, { useState, useRef, useEffect} from 'react';
import {View, StyleSheet, Image, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, ImageBackground, Dimensions, Animated, Easing, ToastAndroid } from 'react-native';
import Video from 'react-native-video';
import ControlsContainer from './components/ControlsContainer';
import SliderMediaTrackContainer from './components/SliderMediaTrackContainer';
import { styles } from './styles/MainStyles'
import ScrollItems from './components/ScrollItems';
import FullPlayer from './components/players/FullPlayer';
import { PlayButton, PrevButton, NextButton, PlayButtonSmall } from './components/Buttons';
import { Artist, ArtistSmall, SongInfoContainer, Title, TitleSmall } from './components/Texts';
import SmallPlayer, { CurrentVideoThumbnail, VideoInfoContainer, VideoTitleContainer } from './components/players/SmallPlayer';
import { useDispatch, useSelector } from 'react-redux';
import { togglePause, useTogglePause } from '../../redux/actions/storeActions';

const screenWidth = Dimensions.get('window').width;
const window = Dimensions.get('window');
const screenHeight = Dimensions.get('window').height;

const MusicPlayer = (props) => {
  // App Store data
  const allSongs = useSelector(state => state.allSongs);
  const currentPlaylistName = useSelector(state => state.currentPlaylistName);
  const currentVideo = useSelector(state => state.currentVideo);
  const currentVideoIndex = useSelector(state => state.currentVideoIndex);
  const currentVideoItem = useSelector(state => state.currentVideoItem);
  const currentVideoKey = useSelector(state => state.currentVideoKey);
  const downloadedSongsList = useSelector(state => state.downloadedSongsList);
  const downloadingVideoKey = useSelector(state => state.downloadingVideoKey);
  const imageURI = useSelector(state => state.imageURI);
  const isLoadingSong = useSelector(state => state.isLoadingSong);
  const isDownloadingSong = useSelector(state => state.isDownloadingSong);
  const isLoadingSearch = useSelector(state => state.isLoadingSearch);
  const lastSearch = useSelector(state => state.lastSearch);
  const musicPlayerFullScreen = useSelector(state => state.musicPlayerFullScreen);
  const playlistSource = useSelector(state => state.playlistSource);
  const paused = useSelector(state => state.paused);
  const relatedVideos = useSelector(state => state.relatedVideos);
  const searchListActive = useSelector(state => state.searchListActive);
  const searched = useSelector(state => state.searched);
  const songProgress = useSelector(state => state.songProgress);
  const sourceIsAudio = useSelector(state => state.sourceIsAudio);
  const videoTitle = useSelector(state => state.videoTitle);
  const videoChannel = useSelector(state => state.videoChannel);
  const videoIsDownloaded = useSelector(state => state.videoIsDownloaded);
  const videoListPlaylist = useSelector(state => state.videoListPlaylist);
  const videoList = useSelector(state => state.videoList);

  const _dispatchTogglePause = useTogglePause();

  let myScroll = useRef(null);
  let player = useRef(null);
  let listOfVideos = searchListActive ? relatedVideos : videoListPlaylist;
  const initAnimValue = new Animated.Value(150)
  const animatedValue = new Animated.Value(1)
  const [currentTime, setCurrentTime] = useState(0);
  const [currentTimeWhenSliding, setCurrentTimeWhenSliding] = useState(0);
  const [slidingActive, setSlidingActive] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  const [timeAvailable, setTimeAvailable] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [volume, setVolume] = useState(0);
  const [showFullButtons, setShowFullButtons] = useState(false);
  const [lastIndex, setLastIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const isPaused = useSelector(state => state.paused);
  const dispatch = useDispatch();
  const toggleMusicPlayerFullScreen = () => {
    dispatch({type: 'TOGGLE_PLAYER_FULLSCREEN'});
  }
 
    useEffect(() => {
      // let { songProgress, currentVideoIndex, searchListActive } = props;

      if(!searchListActive) {
        myScroll.scrollTo({x: currentVideoIndex * screenWidth, y:0, animated: true});
      }
      setTimeout(() => {
        setIsMounted(true);
      }, 900);
      setCurrentTime(songProgress);
      Animated.timing(initAnimValue, {
        toValue: 0,
        duration: 750,
        delay: 240,
        easing: Easing.linear
      }).start()
      return () => {
        props.setSongProgress(currentTime, true);
      };
    }, []);

    useEffect(() => {
      if(!searchListActive) {
        myScroll.scrollTo({x: currentVideoIndex*screenWidth, y:0, animated: true});
      }
      
      listOfVideos = searchListActive ? relatedVideos : videoListPlaylist;
        if(!searchListActive && listOfVideos.length > 0 && currentPlaylistName != 'songsDownloadedOnDevice' && currentPlaylistName != "searchbar") {
      
            listOfVideos = listOfVideos.filter(video => video.playlistsIndex != undefined && video.playlistsIndex[currentPlaylistName] != undefined);
            
            listOfVideos.sort(function(a, b) { 
              return a.playlistsIndex[currentPlaylistName] - b.playlistsIndex[currentPlaylistName];
            });
          }
    }, [searchListActive]);

    useEffect(() => {
      if(musicPlayerFullScreen)
        myScroll.scrollTo({x: currentVideoIndex*screenWidth, y:0, animated: true});
    }, [musicPlayerFullScreen]);

    // useEffect(() => {
    //   if(props.currentVideoIndex === lastIndex) {

    //   }
    // }, [props.currentVideoIndex]);

    useEffect(() => {
      // const { relatedVideos, searchListActive, videoListPlaylist, currentVideoIndex } = props;
      const videos = searchListActive ? relatedVideos : videoListPlaylist;
      const video = videos[currentVideoIndex];
      let id = null;
      if(video != undefined) {
        
        id = searchListActive ? video.id : video.uri;
        const isVideoFavorited = isSongFavorited(id, allSongs);
        setIsFavorited(isVideoFavorited);
      }
    }, [allSongs, currentVideoIndex]);


    // componentWillReceiveProps(newProps) {
    //   const { searchListActive, currentVideoIndex, musicPlayerFullScreen } = newProps;
    //   const sls = props.searchListActive;
    //   const cvi = props.currentVideoIndex;
    //   if(musicPlayerFullScreen && musicPlayerFullScreen != props.musicPlayerFullScreen) {
    //     myScroll.scrollTo({x: currentVideoIndex*screenWidth, y:0, animated: true});
    //   }

    //   if(newProps.allSongs != props.allSongs || (newProps.currentVideoIndex != props.currentVideoIndex)) {
        
    //     const { relatedVideos, searchListActive, videoListPlaylist, currentPlaylistName, currentVideoIndex, currentVideoKey, allSongs } = newProps;
    //     const videos = searchListActive ? relatedVideos : videoListPlaylist;
    //     const video = videos[currentVideoIndex];
    //     let id = null;
    //     if(video != undefined) {
          
    //       id = searchListActive ? video.id : video.uri;
    //       const isFavorited = this.isFavorited(id, newProps.allSongs);
    //       this.setState({isFavorited});
    //     }
    //   }

    //   if(cvi === this.state.lastIndex)
    //     return;
    //   if(!searchListActive) {
    //     myScroll.scrollTo({x: currentVideoIndex*screenWidth, y:0, animated: true});
    //   }
    // }
    

    // const toggleVideoFullscreen = (toggle = true) => {
    //   if(toggle) {
    //     this.setState({playerFullScreen: !playerFullScreen});
    //     return true;
    //   }
    //   this.setState({playerFullScreen: toggle});
    // }

    // const toggleShowButtons = () => {
    //   const self = this;
    //   const boolean = showFullButtons ? false : true;
    //   self.setState({showFullButtons: boolean, activeFullButtonsDuration: 3}, () => {
    //     boolean ? setState({activationInterval: setInterval(this.animationInterval, 1000)}) : activationInterval === null ? 
    //       null : clearInterval(activationInterval);
    //   })
    // }
    
    const handleScroll = ({nativeEvent}) =>  {
      const width = screenWidth;
      const offset = nativeEvent.contentOffset.x;
      const result = Math.round(offset / width);
      
      if((offset/width) != result) return;
      if(lastIndex === result) return;
      if(searchListActive) {
        const video = relatedVideos[result];
        props.playNextSongOnScroll(result, video);
      }
      else {
        const video = videoListPlaylist[result];
        const isDownloaded = video.isDownloaded;
        if(isDownloaded) {
          const _pausedState = isMounted ? null : true;
          props.playNextSong(null, false, result, _pausedState);
        }
        else {
          props.playNextSongOnScroll(result, video, false, true);
        }
      }
      
      setLastIndex(result);
    }

    const _scrollToSong = () => {
      // const { searchListActive, currentVideoIndex } = props;

      if(!searchListActive) {
        myScroll.scrollTo({x: lastIndex*screenWidth, y: 0, animated: true});
      }
    }

    const addToPlaylist = () => {
      // const { relatedVideos, searchListActive, videoListPlaylist, } = props;
      let videos = searchListActive ? relatedVideos : videoListPlaylist;
      const video = videos[lastIndex];
      if(video.uri === undefined) {
        let item =  { channel: video.author, title:  video.title, uri: video.id, time: 0, imageURI: video.video_thumbnail };
        props.addToPlaylist(item);
      }
      else {
        props.addToPlaylist(video);
      }
    }

    const deleteFromPlaylist = () => {
      // const { relatedVideos, searchListActive, videoListPlaylist, } = props;
      let videos = searchListActive ? relatedVideos : videoListPlaylist;
      const video = videos[lastIndex];
      if(video.uri === undefined) {
        props.deleteSongFromPlaylist(video.id);
      }
      else {
        props.deleteSongFromPlaylist(video.uri);
      }
    }

    const isSongFavorited = (uri, allSongs) => {
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

  // const animationInterval = () => {
  //   if(this.state.activeFullButtonsDuration === 0) {
  //     clearInterval(this.state.activationInterval);
  //     this.setState({showFullButtons: false, activeFullButtonsDuration: 4, activationInterval: null}, () => console.log(this.state));
  //   }
  //   else
  //     this.setState({activeFullButtonsDuration: this.state.activeFullButtonsDuration - 1});
  // }

  const playPause = () => {
      _dispatchTogglePause();
  }

  const seekSong = (seconds, animation = false) => {
    if(currentTime + seconds < 0) {
      player.seek(0);
      return true;
    }
    else if(currentTime + seconds > duration) {
      player.seek(Number(duration - 1));
    }

    // if(animation) {
    //   if(activeFullButtonsDuration) {
    //     this.setState({activeFullButtonsDuration: 4});
    //   }
    //   else if(activationInterval != null) {
    //     this.setState({activationInterval: setInterval(this.animationInterval, 1000)})
    //   }
    // }
    player.seek(Number(currentTime + seconds));
  }

  // const goToFullScreen = () => {
  //   if(!playerFullScreen && !props.isAudioSource) {
  //       setState({playerFullScreen: true});
  //   }
  // }

  const downloadSong = (item) => {
    props.downloadSong(item)
  }

  const updateInfoTime = (currentTime_) => {
    setCurrentTime(currentTime_);
    setCurrentTimeWhenSliding(currentTime_);
  }

  const onSlidingComplete = (currentTime_) => {
    setCurrentTime(currentTime_);
    setCurrentTimeWhenSliding(currentTime_);
    setSlidingActive(false);
    player.seek(currentTime_);
  }

  const onSlidingStart = () => {
    setSlidingActive(true);
  }

  const onSeek = (info) => {
    
  }

  const toggleFullScreen = () => {
      props.toggleFullScreenMusicPlayer();
  }

  const Progress = (info) => {
    if(timeAvailable) return;
    let currentTime_ = info.currentTime;
    currentTime_ = Math.round(Number(currentTime_));
    setSeconds(seconds + 1);
    if(!timeAvailable) {
        setCurrentTime(currentTime_);
    }
  }

  const onLoad = (info) => {
    let {duration, currentPosition} = info;
    let nextIndex = 0;
    // const { relatedVideos, searchListActive, videoListPlaylist, currentPlaylistName, currentVideoIndex, currentVideoKey, allSongs } = props;
    duration = Math.round(Number(duration));
    currentPosition = songProgress;
    setDuration(duration);
    if(videoIsDownloaded) {
        // props.updateLastSongData();
    }
    if(currentVideoIndex === 0) {
      myScroll.scrollTo({x: 0, y: 0, animated: true});
    }
    props.enableMusicControls();
  }

  const VideoEnded = () => {
    // const { searchListActive, currentVideoIndex, relatedVideos, videoListPlaylist } = props;
    let index = lastIndex + 1;
    setLastIndex(index);
    setCurrentTime(0);
    let scrollToValue = screenWidth*index;
    if(searchListActive) {
      const video = relatedVideos[index];
      if(video == undefined) return false;
      props.playNextSongOnScroll(index, video);
      myScroll.scrollTo({x: scrollToValue, y:0,  animated: true})
    }
    else {
      index = videoListPlaylist[index] === undefined ? 0 : index;
      setLastIndex(index);
      scrollToValue = screenWidth*index;
      myScroll.scrollTo({x: scrollToValue, y:0,  animated: true})
      props.playNextSong();
    }
  }

  const nextSong = () => {
    // const { searchListActive, currentVideoIndex, relatedVideos, videoListPlaylist } = props;
    let index = lastIndex + 1;
    setLastIndex(index);
    let scrollToValue = screenWidth * index;
    if(searchListActive) {
      const video = relatedVideos[index];
      if(video == undefined) return false;
      props.playNextSongOnScroll(index, video);
      myScroll.scrollTo({x: scrollToValue, y:0,  animated: true});
    }
    else {
      index = videoListPlaylist[index] === undefined ? 0 : index;
      setLastIndex(index);
      scrollToValue = screenWidth * index;
      myScroll.scrollTo({x: scrollToValue, y:0,  animated: true});
      props.playNextSong();
    }
  }

  const errorSong = () => {
    ToastAndroid.showWithGravity(
      "This song can't be played",
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
    // const { searchListActive, currentVideoIndex, relatedVideos, videoListPlaylist, appIsConnected } = props;
    if(!props.appIsConnected) return false;
    let index = lastIndex + 1;
    setLastIndex(index);
    let scrollToValue = screenWidth*index;
    if(searchListActive) {
      return;
      const video = relatedVideos[currentVideoIndex + 1];
      if(video == undefined) return false;
      props.playNextSongOnScroll(index, video);
      myScroll.scrollTo({x: scrollToValue, y:0,  animated: true})
    }
    else {
      return;
      index = videoListPlaylist[index] === undefined ? 0 : index;
      setLastIndex(index);
      scrollToValue = screenWidth*index;
      props.playNextSong();
    }
  }

  const prevSong = () => {
    let currentTime_ = Math.round(Number(currentTime));
    // const { searchListActive, currentVideoIndex, relatedVideos, videoListPlaylist } = props;
    let index = 0;
    let scrollToValue = 0;
    if(currentTime_ < 2) {

      if(searchListActive) {
        index = lastIndex === 0 ? relatedVideos.length - 1 : lastIndex - 1;
        setLastIndex(lastIndex);
        scrollToValue = screenWidth*index;
        const video = relatedVideos[index];
        if(video == undefined) return false;
        props.playNextSongOnScroll(index, video);
        myScroll.scrollTo({x: scrollToValue, y:0,  animated: true});
      }
      else {
        index = lastIndex === 0 ? videoListPlaylist.length - 1 : lastIndex - 1;
        setLastIndex(lastIndex);
        scrollToValue = screenWidth*index;  
        myScroll.scrollTo({x: scrollToValue, y:0,  animated: true})
        props.playNextSong(true, false, index);
      }

    }
    else {
      setCurrentTime(0);
      player.seek(0);
    }
  }


  // const isPaused = props.paused;
  const fullscreen = musicPlayerFullScreen;
  const downloaded = videoIsDownloaded; 
  const isAudioSource = sourceIsAudio;
  const item = currentVideoItem === null ? null : currentVideoItem;
  const title = item === null ? 'videoTitle' : !item.customName ? item.title : item.customName;
  const artist = item === null ? 'videoChannel' : !item.customArtist ? item.channel : item.customArtist;
  const currentBackgroundImageSource = currentVideoItem.imageURI;
  // const { relatedVideos, searchListActive, videoListPlaylist, currentPlaylistName, currentVideoIndex, currentVideoKey, allSongs } = props;

  let list_of_videos = searchListActive ? relatedVideos : videoListPlaylist;
  if(!searchListActive && list_of_videos.length > 0 && currentPlaylistName != 'songsDownloadedOnDevice' && currentPlaylistName != "searchbar") {
    
    list_of_videos = list_of_videos.filter(video => video.playlistsIndex != undefined && video.playlistsIndex[currentPlaylistName] != undefined);
    
    list_of_videos.sort(function(a, b) {
      return a.playlistsIndex[currentPlaylistName] - b.playlistsIndex[currentPlaylistName];
    });
  }


  return (
      <Animated.View style={fullscreen ? styles.playaContainerFullScreen : styles.playaContainer}>
        {props.children}
        <Video
          style={styles.doNotDisplay} 
          source={{uri: currentVideo}}
          ref={(ref) => { player = ref}}
          onError={errorSong}
          onAudioBecomingNoisy={() => dispatch({type: 'TOGGLE_PAUSE_STATE'})}
          playInBackground={true}
          fullscreen={true}
          resizeMode={"contain"}
          audioOnly={true}
          onLoad={onLoad}
          paused={isPaused}
          onEnd={VideoEnded}
          onProgress={Progress} 
          progressUpdateInterval={1000}
          onSeek={onSeek}
        />
        <SmallPlayer fullscreen={musicPlayerFullScreen} >
          <TouchableOpacity onPress={toggleMusicPlayerFullScreen}>
            <VideoInfoContainer>
              <CurrentVideoThumbnail source={currentBackgroundImageSource} resizeMode='cover' />
              <VideoTitleContainer>
                <TitleSmall>{title}</TitleSmall>
                <ArtistSmall>{artist}</ArtistSmall>
              </VideoTitleContainer>
            </VideoInfoContainer>
          </TouchableOpacity>
          <PlayButtonSmall onPress={(playPause)} isPaused={isPaused} />
        </SmallPlayer>
        <FullPlayer
          searchListStatus={searchListActive}
          item={item}
          currentPlaylistName={currentPlaylistName}
          fullscreen={fullscreen}
          playlistSaved={videoListPlaylist}
          relatedVideos={relatedVideos}
        >
          <View style={styles_.carouselContainer}>
              <ScrollView
                ref={ref => myScroll = ref}
                showsHorizontalScrollIndicator={false}
                onScroll={(event) => handleScroll(event)}
                scrollEventThrottle={16}
                contentContainerStyle={{flexGrow: 1}}
                horizontal
                pagingEnabled
              >
              <ScrollItems
                isAudioSource={true}
                searchListStatus={searchListActive}
                videos={listOfVideos}
                item={item}
              />
            </ScrollView>
          </View>
          <SliderMediaTrackContainer
            fullscreen={fullscreen}
            duration={duration}
            currentTime={currentTime}
            currentTimeWhenSliding={currentTimeWhenSliding}
            slidingActive={slidingActive}
            updateInfoTime={updateInfoTime}
            onSlidingComplete={onSlidingComplete}
            onSlidingStart={onSlidingStart}
          />
          <SongInfoContainer>
            <Title>{title}</Title>
            <Artist>{artist}</Artist>
          </SongInfoContainer>
          <ControlsContainer>
            <PrevButton onPress={prevSong} />
            <PlayButton onPress={playPause} isPaused={isPaused} />
            <NextButton onPress={nextSong} />
          </ControlsContainer>
        </FullPlayer>
      </Animated.View>
    );
}


const styles_ = StyleSheet.create({
  carouselContainer: {
    width: screenWidth,
    height: screenWidth,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 45,
    paddingRight: 0,
  },
});

export default MusicPlayer;




/*
<MediaInfo
  fullscreen={fullscreen}
  item={item}
  videoChannel={props.videoChannel}
  videoTitle={props.videoTitle}
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
  videoTitle={props.videoTitle}
  item={item}
  currentTime={this.state.currentTime}
  duration={this.state.duration}
  nextSong={this.nextSong}
  seekSong={this.seekSong}
  prevSong={this.prevSong}
  animatedValue={this.animatedValue}
  _animOnPressIn={this._animOnPressIn}
  playPause={this.playPause}
  videoChannel={props.videoChannel}
/>
<VolumeContainer
  fullscreen={fullscreen}
  volume={this.state.volume}
/>
*/