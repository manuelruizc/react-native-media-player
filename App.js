import React, {Component} from 'react';
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
import { createInitialPaths, getSongsFromLocalStorage, createDefaultPlaylits } from './helpers/localstorage/saving';


const AppContainer = createAppContainer(MyDrawerNavigator);

const { width, height } = Dimensions.get('window');

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      paused: true,
      currentVideo: "https://r4---sn-0opoxu-hxmee.googlevideo.com/videoplayback?clen=4094846&requiressl=yes&key=cms1&txp=5511222&keepalive=yes&source=youtube&mime=audio%2Fwebm&ip=198.54.114.79&sparams=clen,dur,ei,expire,gir,id,ip,ipbits,ipbypass,itag,keepalive,lmt,mime,mip,mm,mn,ms,mv,pl,requiressl,source,usequic&id=o-AN_WkpC93qd3PsPjErSrLWTAKtZuASNIvBsBKDpCt1Wj&ei=yojDXKTjJdmYkwaO269Q&fvip=4&lmt=1540654186975365&c=WEB&gir=yes&dur=255.541&expire=1556340010&pl=51&ipbits=0&itag=251&ratebypass=yes&signature=48A796AFBD2B713B5EE804CDCB515F968636668D.0E93313E8F287675D0C945C7B998AF9511AFCDA7&redirect_counter=1&rm=sn-a5mkk7z&req_id=2a742d812695a3ee&cms_redirect=yes&ipbypass=yes&mip=2806:104e:19:5399:11ea:f81:d133:5baa&mm=31&mn=sn-0opoxu-hxmee&ms=au&mt=1556318332&mv=m&usequic=no",
      downloadPath: `${RNFS.DocumentDirectoryPath}`,
      playerOptions: {
        repeat: false,
      },
      currentVideoKey: "",
      currentVideoIndex: 0,
      musicPlayerFullScreen: false,
      imageURI: 'https://i.ytimg.com/vi/13oXf68zRcM/maxresdefault.jpg',
      videoTitle: "Bruno Mars - Locked out of Heaven [Live in Paris]",
      videoChannel: "Bruno Mars",
      firstURI: "13oXf68zRcM",
      videoIsDownloaded: false,
      videoList: [],
      videoListPlaylist: [],
      playlistSource: [],
      isLoadingSong: false,
      isDownloadingSong: false,
      searchListActive: false,
      searched: false,
      currentVideoItem: null,
      splashScreenIsActive: true,
      isAboutToActivate: false,
      isLoadingSearch: true,
      downloadedSongsList: [],
      downloadingVideoKey: [],
      sourceIsAudio: true,
      appIsConnected: false,
      songProgress: 0,
      lastSearch: "Bruno Mars",
      currentPlaylistName: "",
      allSongs: [],
      relatedVideos: [],
      loading_bubble: true,
    };
    this.animation = new Animated.Value(0);
  }
  start_animation = () => {
    Animated.sequence([
      Animated.delay(900),
      Animated.spring(this.animation, {
        toValue: 1,
        friction: 40,
        useNativeDriver: true,
      })
    ]).start(() => this.setState({loading_bubble: false}));
  }



//SETUPS INICIALES

  initialServiceSetup = () => {
    const self = this;
    MusicControl.enableBackgroundMode(true);
    // MusicControl.handleAudioInterruptions(true);
    MusicControl.on('play', ()=> {
      self.playpause();
    });

    MusicControl.on('pause', ()=> {
      self.playpause(true);
    });

    MusicControl.on('nextTrack', ()=> {
      self.playNextSong();
    });

    MusicControl.on('previousTrack', ()=> {
      self.playNextSong(true);
    });
  }

  
   async componentDidMount() {

    await createInitialPaths();

    const downloadedSongsList = getSongsFromLocalStorage();
    this.initialServiceSetup();
    const self = this;
    

    const listener = isConnected => {
      const connectionType = isConnected;
      if(connectionType) {
        this.setState({appIsConnected: true});
      }
      else {
        this.setState({appIsConnected: false});
      }
    };
    // Subscribe
    const subscription = NetInfo.isConnected.addEventListener('connectionChange', listener);


    // this.createDownloadsPlaylist();
    createDefaultPlaylits();

    let status = false;

    AsyncStorage.multiGet(["currentSong", "currentPlaylist", "Songs", "SourceIsAudio", "songProgress", "lastSearch", "currentVideoItem"], (err, stores) => {
      stores.forEach((store, index) => {
        if(index == 0) {
          if(store[1]) {
            const JSONified = JSON.parse(store[1]);
            // let sourceIsAudio = stores[3][1];
            // sourceIsAudio = JSON.parse(sourceIsAudio);
            let sourceIsAudio = true //sourceIsAudio[0].sourceIsAudio;
            console.log("LAST_SONG", JSONified)
            self.setState({
              imageURI: JSONified.image,
              currentVideoIndex: JSONified.index,
              currentVideoKey: JSONified.key,
              currentVideo: sourceIsAudio ? JSONified.pathAudio : JSONified.pathVideo,
              videoChannel: JSONified.videoChannel,
              videoIsDownloaded: JSONified.videoIsDownloaded,
              videoTitle: JSONified.videoTitle,
              currentVideoItem: JSONified,
            });
          }
        }
        else if(index == 1) {
          let response = store[1];
          if(response !=  null) {
            response = JSON.parse(response);
            console.log("last playlist", response)
            const source = response[0];
            let playlist = response[1];
            const currentPlaylistName = response[2];
            if(source == "playlist") {
              if(currentPlaylistName != "songsDownloadedOnDevice") {
                playlist = playlist.filter(play => play.playlist.includes(currentPlaylistName))
                playlist.sort(function(a, b) { 
                  return a.playlistsIndex[currentPlaylistName] - b.playlistsIndex[currentPlaylistName];
                });
              }
              console.log("PLEASE ME",playlist)
              status = false;
              self.setState({searchListActive: false, videoListPlaylist: playlist, playlistSource: source, currentPlaylistName});
            }
            else {
              status = true;
              self.setState({searchListActive: true, playlistSource: source, currentPlaylistName, videoListPlaylist: playlist, currentVideoIndex: 0,});
            }
          }
        }
        else if(index == 2) {
          if(store[1] != null) {
            let allSongs = store[1];
            allSongs = JSON.parse(allSongs);
            console.log('thats what i like',allSongs)
            self.setState({allSongs})
          }
        }
        else if(index == 3) {
          if(store[1] != null) {
            let sourceIsAudio = store[1];
            sourceIsAudio = JSON.parse(sourceIsAudio);
            sourceIsAudio = sourceIsAudio[0].sourceIsAudio;
            sourceIsAudio ? self.setState({sourceIsAudio: true}) : self.setState({sourceIsAudio: false})
          }
        }
        else if(index == 4) {
          if(store[1] != null) {
            let songProgress = Number(store[1]);
            self.setState({songProgress});
          }
        }
        else if(index == 5) {
          if(store[1] != null) {
            let lastSearch = String(store[1]);
            self.setState({lastSearch});
            NetInfo.getConnectionInfo().then(data => {
              if(data.type == "unknown") {
                this.setState({appIsConnected: false});
                // this.changeSplashState(lastSearch);
              }
              else {
                this.setState({appIsConnected: true});
                // this.changeSplashState(lastSearch);
              }
            });
          }
          else {
            NetInfo.getConnectionInfo().then(data => {
              if(data.type == "unknown") {
                this.setState({appIsConnected: false});
                // this.changeSplashState(self.state.lastSearch);
              }
              else {
                this.setState({appIsConnected: true});
                // this.changeSplashState(self.state.lastSearch);
              }
            });
          }
        }
        else if(index == 6) {
          if(store[1] == null) {
            self.getSavedSongData(null, true)
            self.searchListStatus(true);
            console.log("AQUI queeee")
            return true;
          }
          let currentVideoItem = String(store[1]);
          songData = JSON.parse(currentVideoItem);
          let isAudioSource = JSON.parse(stores[3][1]);
          isAudioSource = isAudioSource == null ? true :isAudioSource[0].sourceIsAudio;
          const { isDownloaded, channel, imageURI, title, uri, pathVideo, pathAudio } = songData;
          self.setState({currentVideoItem: songData}, () => {
            if(isDownloaded) {
              // self.currentVideoURIChange(path);
              self.setState({currentVideo: isAudioSource ? pathAudio : pathVideo, paused: true});
              self.currentVideoKeyChange(uri);
              self.currentVideoURImage(imageURI);
              self.changeVideoChannel(channel);
              self.changeVideoTitle(title);
              self.playNewSong(true, index);
              self.loadingState(false);
              self.changeVideoDownloadStatus(true);
              self.changeCurrentVideoUpdate(songData); // dummy function
              self.searchListStatus(false);
              self.changeSplashState(self.state.lastSearch);
            }
            else {
                self.changeCurrentVideoUpdate(songData); // dummy function
                self.getSavedSongData(songData)
                self.searchListStatus(status);
            }
          });
        }
      });
    });
  }
  // TERMINAN SETUPS INICIALES

  


  render() {
      const scale = this.animation.interpolate({inputRange:[0, 1], outputRange:[30, 0], extrapolate:'clamp'});
      const opacity = this.animation.interpolate({inputRange:[0, 0.9, 1], outputRange:[1, 1, 0], extrapolate:'clamp'})
      return(
        <View style={{flex:1, backgroundColor:'#00007A', position:'relative'}}>
          {this.state.splashScreenIsActive ?
          (<SplashScreen upliftSplashState={this.upliftSplashState} isAboutToActivate={this.state.isAboutToActivate} />)
          :
          (
            <View style={{flex:1, width:'100%'}}>
              <AppContainer
            screenProps={{
            ...this.state,
            downloadImage: this.downloadImage,
            playpause: this.playpause,
            paused: this.state.paused,
            stop: this.stop,
            currentVideoURIChange: this.currentVideoURIChange,
            currentVideoKeyChange: this.currentVideoKeyChange,
            currentVideoKey: this.state.currentVideoKey,
            currentVideoIndexChange:this.currentVideoIndexChange,
            currentVideoURImage: this.currentVideoURImage,
            changeVideoChannel:this.changeVideoChannel,
            changeVideoTitle:this.changeVideoTitle,
            playNewSong: this.playNewSong,
            setVideoList: this.setVideoList,
            videoList: this.state.videoList,
            togglePause: this.togglePause,
            playNextSong: this.playNextSong,
            isLoadingSong: this.state.isLoadingSong,
            loadingState: this.loadingState,
            playIndexSong: this.playIndexSong,
            isDownloadingSong: this.state.isDownloadingSong,
            isDownloadingSongStatus: this.isDownloadingSongStatus,
            musicPlayerFullScreen: this.state.musicPlayerFullScreen,
            musicPlayerHide: this.musicPlayerHide,
            searchListStatus: this.searchListStatus,
            setVideoListPlaylist: this.setVideoListPlaylist,
            searchListActive: this.state.searchListActive,
            videoListPlaylist: this.state.videoListPlaylist,
            downloadSong: this.downloadSong,
            changeVideoDownloadStatus: this.changeVideoDownloadStatus,
            changeCurrentVideoUpdate: this.changeCurrentVideoUpdate,
            updateLastPlaylist: this.updateLastPlaylist,
            searched: this.state.searched,
            changeSplashState: this.changeSplashState,
            isLoadingSearch: this.state.isLoadingSearch,
            loadingSearchStatus: this.loadingSearchStatus,
            downloadedSongsList: this.downloadedSongsList,
            getSongs: this.getSongs,
            downloadingVideoKey: this.state.downloadingVideoKey,
            setDownloadingVideoKey: this.setDownloadingVideoKey,
            switchValue: this.state.sourceIsAudio,
            changeSource: this.changeSource,
            currentVideoItem: this.state.currentVideoItem,
            appIsConnected: this.state.appIsConnected,
            setLocalePlaylist: this.setLocalePlaylist,
            setLastSearch: this.setLastSearch,
            setSongProgress: this.setSongProgress,
            updatePlaylistAfterDownload: this.updatePlaylistAfterDownload,
            currentPlaylistName: this.state.currentPlaylistName,
            addToAllSongs: this.addToAllSongs,
            allSongs: this.state.allSongs,
            updateRelatedVideos: this.updateRelatedVideos,
          }} />

          <MusicPlayer
            appIsConnected={this.state.appIsConnected}
            allSongs={this.state.allSongs}
            addToPlaylist={this.addToPlaylist}
            deleteSongFromPlaylist={this.deleteSongFromPlaylist}
            currentPlaylistName={this.state.currentPlaylistName}
            playlistSaved={this.state.videoListPlaylist}
            searchListStatus={this.state.searchListActive}
            playNextSongOnScroll={this.playNextSongOnScroll}
            relatedVideos={this.state.relatedVideos}
            paused={this.state.paused}
            playpause={this.playpause}
            currentVideoURIChange={this.currentVideoURIChange}
            currentVideoIndexChange={this.currentVideoIndexChange}
            currentVideoKeyChange={this.currentVideoKey}
            currentVideo={this.state.currentVideo}
            currentVideoIndex={this.state.currentVideoIndex}
            currentVideoKey={this.state.currentVideoKey}
            stop={this.stop}
            musicPlayerFullScreen={this.state.musicPlayerFullScreen}
            toggleFullScreenMusicPlayer={this.toggleFullScreenMusicPlayer}
            imageURI={this.state.imageURI}
            videoTitle={this.state.videoTitle}
            videoChannel={this.state.videoChannel}
            playNextSong={this.playNextSong}
            videoIsDownloaded={this.state.videoIsDownloaded}
            currentVideoItem={this.state.currentVideoItem}
            downloadSong={this.downloadSong}
            changeVideoDownloadStatus={this.changeVideoDownloadStatus}
            enableMusicControls={this.enableMusicControls}
            updateLastSongData={this.updateLastSongData}
            downloadingVideoKey={this.state.downloadingVideoKey}
            sourceIsAudio={this.state.sourceIsAudio}
            setSongProgress={this.setSongProgress}
            songProgress={this.state.songProgress}
            state={this.state}
            />
            </View>
          )
          }
          {(this.state.loading_bubble && !this.state.splashScreenIsActive) ?
          (<Animated.View style={{position:'absolute', opacity, top:(height / 2) - 250, left: (width/2) - 250, width: 500, height: 500, borderRadius: 500, backgroundColor:'#4B4BFA', transform:[{scale}]}} />)
        : null}
        </View>
      );
  }

  updateRelatedVideos = (relatedVideos) => {
    this.setState({relatedVideos});
  }

  // ESTA BUSCANDO ? : EN EL ESTADO
  loadingSearchStatus = (boolean) => {
    this.setState({isLoadingSearch: boolean})
  }

  // INICIALIZAR LA PLAYLIST PARA DESCARGAS
  // updated as a helper
  createDownloadsPlaylist = () => {
    
  }

  // CAMBIAR EL SOURCE ?AUDIO:VIDEO
  changeSource = () => {
    this.setState({sourceIsAudio: !this.state.sourceIsAudio}, () => {
      const {sourceIsAudio} = this.state;
      let objectSourceIsAudio = sourceIsAudio ? [{sourceIsAudio: true}] : [{sourceIsAudio: false}];
      objectSourceIsAudio = JSON.stringify(objectSourceIsAudio);
      AsyncStorage.setItem("SourceIsAudio", objectSourceIsAudio)
      .then(function(response) {
      })
      .catch(function(error) {
        console.log(error)
      });
    });
  }

  upliftSplashState = () => {
    this.setState({splashScreenIsActive: false}, () => {
      this.start_animation();
    });
  }

  // CAMBIAR LA PANTALLA DE SPLASH AL APP Y REALIZA LA BÚSQUEDA DE CANCIONES
  changeSplashState = (lastSearch) => {
    const self = this;
    const { appIsConnected } = this.state;
    if(!appIsConnected) {
      this.setState({isAboutToActivate: true});
      return false;
    }
    axios.get(`http://tubeplaya.herokuapp.com/search/${lastSearch}/`)
      .then(function (response) {
        songs = self.state.downloadedSongsList;
        let videoList = null;
        videoList = response.data.map((video, i) => {
          let isDownloaded = false;
          let path = "";
          songs.forEach(song => {
            if(video.uri == song.uri && song.isDownloaded) {
              isDownloaded = true;
              path = self.state.sourceIsAudio ? song.pathAudio : song.pathVideo;
            }
          });
          
          if(isDownloaded) {
            video["isDownloaded"] = true;
            video[self.state.sourceIsAudio ? "pathAudio" : "pathVideo"] = path;
            return video
          }
          return video;
        });
        self.setState({isAboutToActivate: true, videoList, isLoadingSearch: false});
      })
      .catch(function (error) {
        self.setState({isAboutToActivate: true})
      });
  }

  // LA CANCIÓN ACTUAL, GUARDAR LOS DATOS LOCALMENTE Y EN EL ESTADO
  updateLastSongData = (data = null, index) => {
    let currentSongData = {};
    if(data === null) {
      currentSongData = {
        [this.state.sourceIsAudio ? "pathAudio" : "pathVideo"]: this.state.currentVideo,
        key: this.state.currentVideoKey,
        index: index,
        image: this.state.imageURI,
        videoTitle: this.state.videoTitle,
        videoChannel: this.state.videoChannel,
        videoIsDownloaded: this.state.videoIsDownloaded  
      }
    }
    else {
      currentSongData = data;
      currentSongData.index = index;
    }
    
    this.setState({currentVideoItem: currentSongData});

    currentSongData = JSON.stringify(currentSongData);


    AsyncStorage.multiSet([["currentSong", currentSongData], ["currentVideoItem", currentSongData]])
    .then(function(response) {
      console.log(response)
    })
    .catch(function(error) {
      console.log(error)
    });
  }

  // LO MISMO DE ARRIBA PERO CON PLAYLISTS
  updateLastPlaylist = (playlist, source, playlistName) => {
    playlistArray = [source, playlist, playlistName];
    console.log("playlist array", playlistArray)
    this.setState({playlistSource: source, videoListPlaylist: playlist, currentPlaylistName: playlistName}, () => {
      console.log("STATE", this.state.videoListPlaylist);
    });
    AsyncStorage.setItem("currentPlaylist", JSON.stringify(playlistArray))
    .then(function(response) {
      console.log(response)
    })
    .catch(function(error) {
      console.log(error)
    });
  }

  // IS SEARCHED ? :
  changeSearchingStatus = (boolean) => {
    this.setState({searched: boolean});
  }

  
  // STATUS DE VIDEOS DESCARGADOS ?????????????
  changeVideoDownloadStatus = (bool) => {
    this.setState({videoIsDownloaded: bool});
  }

  // NO SIRVE
  changeCurrentVideoUpdate = (currentVideoItem) => {
    
  }

  // PAUSAR VIDEO
  playpause = (paused = null) => {
    const self = this;
    if(paused === null) {
      this.setState({paused: !this.state.paused}, () => {
        self.updateMusicControls();
        console.log(self.state.paused)
      });
    }
    else {
      this.setState({paused: true}, () => {
        self.updateMusicControls();
        console.log(self.state.paused)
      });
    }
  }

  //PLAYLIST LOCAL ????????????
  setLocalePlaylist = (downloadedSongsList) => {
    this.setState({downloadedSongsList});
  }

  // ESCONDER REPRODUCTOR
  musicPlayerHide = () => {
    this.setState({musicPlayerFullScreen: false});
  }

  // ???
  isDownloadingSongStatus = (boolean, uri = "") => {
    this.setState({isDownloadingSong: boolean});
  }

  // OBETENER CANCIONES GUARDADAS EN PLAYLIST
  // UPDATED AS HELPER
  getSongs = () => {
    const self = this;
    AsyncStorage.multiGet(["Songs"], (err, stores) => {
      let songs = stores[0][1];
      songs = JSON.parse(songs);
      if(songs != null) {
        songs = songs.filter(song => song.isDownloaded);
        self.setState({downloadedSongsList: songs});
      }

    });
  }

  

  getSongsAndUpdate = () => {
    const self = this;
    AsyncStorage.multiGet(["Songs"], (err, stores) => {
      let songs = stores[0][1];
      if(songs != null) {
        songs = JSON.parse(songs);

        songs = songs.filter(song => song.isDownloaded);
        self.setState({downloadedSongsList: songs}, () => {
          
          self.setVideoList(self.state.videoList);
          self.isSongDownloaded();
        });
      }

    });
  }

  // ??????
  isSongDownloaded = () => {
    const self = this;
    const songs = this.state.downloadedSongsList;
    let answer = false;
    for(let i = 0; i < songs.length; i++) {
      if(songs[i].uri == this.state.currentVideoKey) {
        answer = true;
        break;
      }
    }

    this.setState({videoIsDownloaded: answer});
  }

  // ==?????????
  setVideoList = (vL) => {
    const self = this;
    const songs = this.state.downloadedSongsList
    let videoList = null;
    videoList = vL.map((video, i) => {
      let isDownloaded = false;
      let path = "";
      songs.forEach(song => {
        if(video.uri == song.uri && song.isDownloaded) {
          isDownloaded = true;
          path = this.state.sourceIsAudio ? song.pathAudio : song.pathVideo;
        }
      });
      
      if(isDownloaded) {
        video["isDownloaded"] = true;
        video[self.state.sourceIsAudio ? "pathAudio" : "pathVideo"] = path;
        return video
      }
      return video;
    });
    this.setState({videoList});
  }

  // ?????
  setVideoListPlaylist = (videoListPlaylist) => {
    this.setState({videoListPlaylist});
  }

  // ?????
  searchListStatus = (boolean) => {
    this.setState({searchListActive: boolean});
  }

  // ????
  loadingState = (isLoadingSong) => {
    this.setState({isLoadingSong});
  }

  // ?????
  playNewSong = (paused, index, songData = false) => {
    this.updateMusicControls(true);
      if(songData != false) {
        this.updateLastSongData(songData, index);
      }
      this.setState({paused,});
  }
  
  // ?????????????
  togglePause = (paused = !this.state.paused) => {
    this.setState({paused:paused});
  }

  
  

  playNextSongOnScroll = (ix, video, initialSong = false, isFromPlaylist = false) => {
    const self = this;
    console.log("video....", video)
    console.log("ISFROM", isFromPlaylist)
    const id = isFromPlaylist ? video.uri : video.id;
    this.setState({isLoadingSong: true, currentVideoKey: id, songProgress: 0});
    axios.get(`https://tubeplaya.herokuapp.com/video_info/${id}`)
    .then(function (response) {
        let { relatedVideos } = self.state;
      let isVisited = false;
      if(relatedVideos.length > 0) {
        for(let i = 0; i < relatedVideos.length; i++) {
          const vid = relatedVideos[i];
          if(vid.id === id) {
            if(vid.isVisited) {
              console.log("VISTO");
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
        if(relatedVideos.length === 0) {
          response.data.related_videos.slice(0, 2).forEach((video, index) => {
            if(index === 0) {
              video.isVisited = true;
            }
            relatedVideos.push(video);
          });
        }
        else {
          response.data.related_videos.slice(1, 2).forEach((video, index) => {
            relatedVideos.push(video);
          });
        }
      }

        self.setState(
          {
            currentVideo: self.state.sourceIsAudio ? response.data.formats[0].url : response.data.formats[2].url,
            currentVideoIndex: ix,
            currentVideoKey: id,
            imageURI: response.data.thumbnail,
            isLoading:false,
            // videoList: newStateVideos,
            videoChannel: response.data.uploader,
            videoTitle:response.data.title,
            videoIsDownloaded: false,
            relatedVideos,
          }, () => {
            self.setState({isLoadingSong: false,})
          }
        );

        let currentSongData = {
          [self.state.sourceIsAudio ? "pathAudio" : "pathVideo"]: self.state.sourceIsAudio ? response.data.formats[0].url : response.data.formats[2].url,
          key: id,
          image: video.video_thumbnail,
          videoTitle: video.title,
          videoChannel: video.author,
          videoIsDownloaded: false,
          currentVideoIndex: ix,
        }
        self.updateLastSongData(currentSongData, ix)
        // self.updateLastPlaylist();
        
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  

  //????
  playNextSong = (prev = null, dontPlay = false, index = null) => {
    this.updateMusicControls(true);


    const currentIndex = this.state.currentVideoIndex;
    let nextIndex = prev ? currentIndex - 1 : currentIndex + 1;
    const vidl = this.state.playlistSource != "playlist" ? this.state.videoList : this.state.videoListPlaylist;
    console.log("videolistsssssss", vidl)
    const videoListLength = this.state.playlistSource != "playlist" ? vidl.length : vidl.length;
    console.log(vidl, "perro",videoListLength);
    let newIndex = !prev ? (nextIndex < videoListLength) ? nextIndex : 0 : (nextIndex < 0) ? videoListLength - 1 : nextIndex;
    if(index != null)
      newIndex = index;
    if(newIndex === 0 && prev === null && index === null) this.setState({paused: true});
    const videoInfo = this.state.playlistSource != "playlist" ? this.state.videoList[newIndex] : this.state.videoListPlaylist[newIndex];
    const self = this;
    const {isLoadingSong} = this.state;

    console.log("federer", videoInfo)

    this.setState({isLoadingSong: true, currentVideoKey: videoInfo.uri, currentVideoIndex: nextIndex, songProgress: 0});


    const currentList = this.state.playlistSource === "playlist" ? this.state.videoListPlaylist : this.state.videoList;
    const newStateVideos = currentList.map((vidio, i) => {
      if(currentIndex == i && !vidio.isPlaying) {
        return {title: vidio.title, uri: vidio.uri, imageURI: vidio.imageURI, time: vidio.time, isPlaying: true, isDownloaded: vidio.isDownloaded, [this.state.sourceIsAudio ? "pathAudio" : "pathVideo"]: this.state.sourceIsAudio ? vidio.pathAudio : vidio.pathVideo};
      }
      else {
        return {title: vidio.title, uri: vidio.uri, imageURI: vidio.imageURI, time: vidio.time, isPlaying: false, isDownloaded: vidio.isDownloaded, [this.state.sourceIsAudio ? "pathAudio" : "pathVideo"]: this.state.sourceIsAudio ? vidio.pathAudio : vidio.pathVideo};
      }
    });
    if(this.state.searchListActive && !videoInfo.isDownloaded) {
      axios.get(`https://tubeplaya.herokuapp.com/video_info/${videoInfo.uri}`)
      .then(function (response) {
        let { relatedVideos } = self.state;
      let isVisited = false;
      if(relatedVideos.length > 0) {
        for(let i = 0; i < relatedVideos.length; i++) {
          const vid = relatedVideos[i];
          if(vid.id === videoInfo.uri) {
            if(vid.isVisited) {
              console.log("VISTO");
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
        if(relatedVideos.length === 0) {
          response.data.related_videos.slice(0, 2).forEach((video, index) => {
            if(index === 0) {
              video.isVisited = true;
            }
            relatedVideos.push(video);
          });
        }
        else {
          response.data.related_videos.slice(1, 2).forEach((video, index) => {
            relatedVideos.push(video);
          });
        }
      }

        self.setState(
          {
            currentVideo: self.state.sourceIsAudio ? response.data.formats[0].url : response.data.formats[2].url,
            currentVideoIndex: newIndex,
            currentVideoKey: videoInfo.uri,
            imageURI: response.data.thumbnail,
            isLoading:false,
            videoList: newStateVideos,
            videoChannel: response.data.uploader,
            videoTitle:response.data.title,
            videoIsDownloaded: false,
            relatedVideos,
          }, () => {
            this.setState({isLoadingSong: false,})
          }
        );
        self.updateLastSongData(videoInfo, newIndex)
        // self.updateLastPlaylist();
        
      })
      .catch(function (error) {
        console.log(error);
      });
    }
    else {
      if(videoInfo.isDownloaded) {
        this.setState(
          {
            currentVideo: self.state.sourceIsAudio ? videoInfo.pathAudio : videoInfo.pathVideo,
            currentVideoIndex: newIndex,
            currentVideoKey: videoInfo.uri,
            imageURI: videoInfo.imageURI,
            isLoading:false,
            videoChannel: videoInfo.channel,
            videoTitle: videoInfo.title,
            videoIsDownloaded: true
          }, () => {
            this.setState({isLoadingSong: false,})
            self.updateLastSongData(videoInfo, newIndex)
          }
        );
        
      }
      else {
        axios.get(`https://tubeplaya.herokuapp.com/video_info/${videoInfo.uri}`)
        .then(function (response) {
          let { relatedVideos } = self.state;
          let isVisited = false;
          if(relatedVideos.length > 0) {
            for(let i = 0; i < relatedVideos.length; i++) {
              const vid = relatedVideos[i];
              if(vid.id === videoInfo.uri) {
                if(vid.isVisited) {
                  console.log("VISTO");
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
            if(relatedVideos.length === 0) {
              response.data.related_videos.slice(0, 2).forEach((video, index) => {
                if(index === 0) {
                  video.isVisited = true;
                }
                relatedVideos.push(video);
              });
            }
            else {
              response.data.related_videos.slice(1, 2).forEach((video, index) => {
                relatedVideos.push(video);
              });
            }
          }

          self.setState(
            {
              currentVideo: self.state.sourceIsAudio ? response.data.formats[0].url : response.data.formats[2].url,
              currentVideoIndex: newIndex,
              currentVideoKey: videoInfo.uri,
              imageURI: response.data.thumbnail,
              isLoading:false,
              videoList: newStateVideos,
              videoChannel: response.data.uploader,
              videoTitle:response.data.title,
              videoIsDownloaded: false,
              relatedVideos,
            }, () => {
              this.setState({isLoadingSong: false,})
              self.updateLastSongData(videoInfo, newIndex)
            }
          );
        })
        .catch(function (error) {
          console.log(error);
        });
      } 
    }
  }

  getSavedSongData = (songData, uriSearch = false) => {
    const { appIsConnected } = this.state;
    if(!appIsConnected) {
      this.changeSplashState(this.state.lastSearch);
      return false;
    }
    console.log("CAIN VELASQUEZ");
    const self = this;
    let urii = null;

    if(songData != null)
      urii = songData.key === undefined ? songData.uri : songData.key;
    const uri = uriSearch ? self.state.firstURI : urii;
    console.log("songData", songData);
    axios.get(`https://tubeplaya.herokuapp.com/video_info/${uri}`)
    .then(function (response) {
      let { relatedVideos } = self.state;
      let isVisited = false;
      if(relatedVideos.length > 0) {
        for(let i = 0; i < relatedVideos.length; i++) {
          const vid = relatedVideos[i];
          if(vid.id === uri) {
            if(vid.isVisited) {
              console.log("VISTO");
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
        if(relatedVideos.length === 0) {
          response.data.related_videos.slice(0, 2).forEach((video, index) => {
            if(index === 0) {
              video.isVisited = true;
            }
            relatedVideos.push(video);
          });
        }
        else {
          response.data.related_videos.slice(1, 2).forEach((video, index) => {
            relatedVideos.push(video);
          });
        }
      }

      console.log("SEMIDISI", relatedVideos)
      self.setState(
        {
          currentVideo: self.state.sourceIsAudio ? response.data.formats[0].url : response.data.formats[2].url,
          currentVideoKey: uri,
          imageURI: response.data.thumbnail,
          isLoading:false,
          videoChannel: response.data.uploader,
          videoTitle:response.data.title,
          paused: true,
          relatedVideos,
          searchListActive: true,
        }, () => {
          {
            self.setState({isLoadingSong: false,})
            self.changeSplashState(self.state.lastSearch);
          }
        }
      );
    })
    .catch(function (error) {
      self.changeSplashState(self.state.lastSearch);
    });
  }


  playIndexSong = (newIndex, songData, playlist = null, isFromPlaylist = false, playlistLL = null) => {
    const {searchListActive} = this.state; 
    const currentIndex = this.state.currentVideoIndex;
    const videoListLength = isFromPlaylist ? this.state.videoListPlaylist.length : this.state.videoList.length;
    const videoInfo = isFromPlaylist ? playlistLL[newIndex] : this.state.videoList[newIndex];
    const self = this;
    const {isLoadingSong} = this.state;
    this.setState({isLoadingSong: true, currentVideoKey:videoInfo.uri});

    console.log("PLEASE MEEEEE")
    console.log({fedd: videoInfo, isFromPlaylist, videoListPlaylist: playlistLL, videoList: this.state.videoList})

    let newStateVideos = this.state.videoList.map((vidio, i) => {
      if(currentIndex == i && !vidio.isPlaying) {
        return {title: vidio.title, uri: vidio.uri, time: vidio.time, isPlaying: true};
      }
      else {
        return {title: vidio.title, uri: vidio.uri, time: vidio.time, isPlaying: false};
      }
    });



    axios.get(`https://tubeplaya.herokuapp.com/video_info/${videoInfo.uri}`)
    .then(function (response) {
      let { relatedVideos } = self.state;
      let isVisited = false;
      if(relatedVideos.length > 0) {
        for(let i = 0; i < relatedVideos.length; i++) {
          const vid = relatedVideos[i];
          if(vid.id === videoInfo.uri) {
            if(vid.isVisited) {
              console.log("VISTO");
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
        if(relatedVideos.length === 0) {
          response.data.related_videos.slice(0, 2).forEach((video, index) => {
            if(index === 0) {
              video.isVisited = true;
            }
            relatedVideos.push(video);
          });
        }
        else {
          response.data.related_videos.slice(1, 2).forEach((video, index) => {
            relatedVideos.push(video);
          });
        }
      }

      self.setState(
        {
          currentVideo: self.state.sourceIsAudio ? response.data.formats[0].url : response.data.formats[2].url,
          // currentVideoIndex: newIndex,
          currentVideoKey: videoInfo.uri,
          imageURI: response.data.thumbnail,
          isLoading:false,
          videoList: newStateVideos,
          videoChannel: response.data.uploader,
          videoTitle:response.data.title,
          paused: false,
          relatedVideos,
        }, () =>{
          self.setState({currentVideoItem: videoInfo, isLoadingSong: false,});
          self.updateLastSongData(videoInfo, newIndex);
        }
      );
    })
    .catch(function (error) {
      console.log(error);
    });

  }
  
  changeVideoChannel = (videoChannel) => {
    this.setState({videoChannel});
  }

  changeVideoTitle = (videoTitle) => {
    this.setState({videoTitle});
  }

  currentVideoURImage = (imageURI) => {
    this.setState({imageURI});
  }

  toggleFullScreenMusicPlayer = () => {
    this.setState({musicPlayerFullScreen: !this.state.musicPlayerFullScreen});
  }

  stop = () => {
    console.log(this.state.paused);
    this.setState({paused: true}, () => console.log(this.state.paused));
  }

  setSongProgress = (seconds, willSave = true) => {
    this.setState({songProgress: seconds});
    console.log('POLLO', willSave)
    if(!willSave) return true;
    console.log('POLLO', willSave)
    AsyncStorage.setItem("songProgress", String(seconds))
    .then(response => {
      console.log('ITS SHOWTIME' ,response)
    })
    .catch((e) => console.log(e));
  }

  setLastSearch = (lastSearch) => {
    AsyncStorage.setItem("lastSearch", String(lastSearch))
    .then(response => {
      console.log(response)
    })
    .catch((e) => console.log(e));
  }

  currentVideoURIChange = (currentVideo) => {
    this.setState({currentVideo})
  }

  currentVideoKeyChange = (currentVideoKey) => {
    this.setState({currentVideoKey})
  }

  currentVideoIndexChange = (currentVideoIndex) => {
    console.log("currentVideoIndex", currentVideoIndex)
    this.setState({currentVideoIndex});
  }

  songIsInPlaylists = (id, value) => {
    value = JSON.parse(value);
    const result = value.filter(val => val.uri === id);
  }
  
  downloadImage = async (fromUrl, id) => {
    try {
      console.log("FROMURL", fromUrl);
      console.log("id", id);
      RNFS.downloadFile({
        fromUrl,
        toFile: `file:///storage/emulated/0/Android/data/com.muustube/files/Images/${id}.png`,
      }).promise.then((r) => {
        console.log("IMAGE DOWNLOADED");
      });
    }
    catch(error) {
      console.log(error);
    }
}

  downloadSong = async(item, currentArtist = false, currentSong = false) => {
    // let path_name = "file:///storage/emulated/0/Android/data/com.muustube/files/Download/";
    // let path_imgs = "file:///storage/emulated/0/Android/data/com.muustube/files/Images/";

    // await RNFS.mkdir(path_name);
    // await RNFS.mkdir(path_imgs);
    let {channel, uri, imageURI, playlist, time, title} = item;
    let timeInSeconds = time.length <= 5 ? Number(time.substring(0, time.length - 3)) : 100;
    channel = channel === undefined ? "unknown" : channel;
    let newSongsArray = [];
    const self = this;
    const { sourceIsAudio } = this.state;
    const extension = sourceIsAudio ? ".mp4" : ".mp4";
    try {
      let newSongs = await AsyncStorage.getItem('Songs');
      if(newSongs == null) {
        self.isDownloadingSongStatus(true, uri);
        axios.get(`https://tubeplaya.herokuapp.com/video_info/${uri}`)
        .then(function (response) {
          let {downloadingVideoKey} = self.state;
          downloadingVideoKey.push(uri);
          self.setState({downloadingVideoKey});
          // media current format
          let url = sourceIsAudio ? response.data.formats[0].url : response.data.formats[2].url
          url = timeInSeconds > 13 ? response.data.formats[3].url : url;
          const thumbnail = response.data.thumbnail;

            let playlists = ["songsDownloadedOnDevice"];
            playlists = JSON.stringify(playlists);
            AsyncStorage.setItem("Playlists", playlists)
            .then(asyncalive => {
              self.isDownloadingSongStatus(false);
              const pathObjectName = sourceIsAudio ? "pathAudio" : "pathVideo";
              const isObjectMedia = sourceIsAudio ? "isAudio" : "isVideo";

              let songObject = {playlist: ["songsDownloadedOnDevice"], channel, isAudio: false, isVideo: false, pathVideo:'', pathAudio:'', title, uri, time, imageURI:thumbnail, isDownloaded: true, customName:currentSong, customArtist: currentArtist};
              songObject[pathObjectName] = `${response.reason}`;
              songObject[isObjectMedia] = true;
              let songs = [songObject];

              if(imageURI != `file:///storage/emulated/0/Android/data/com.muustube/files/Images/${uri}.png`) {
                self.downloadImage(thumbnail, uri);
                songObject.imageURI = `file:///storage/emulated/0/Android/data/com.muustube/files/Images/${uri}.png`;
              }

              if(sourceIsAudio) {

                RNFFmpeg.execute(`-i ${url} file:///storage/emulated/0/Android/data/com.muustube/files/Download/${songObject.uri}.mp3`).then(result => {
                  console.log(result)
                  if(result.rc === 0) {
                    songObject[pathObjectName] = `file:///storage/emulated/0/Android/data/com.muustube/files/Download/${songObject.uri}.mp3`;
                    self.saveSongInLocalStorage(songObject, uri);
                  }
                  else {
                    self.deleteFromQueue(uri);
                    ToastAndroid.showWithGravity(
                      "Video not available in your region",
                      ToastAndroid.SHORT,
                      ToastAndroid.CENTER,
                    );
                  }
                });     
              }
              else {
                self.saveSongInLocalStorage(songObject, uri);
              }

          })
          .catch(error => console.log(error))
        });
      }
      else {
        self.isDownloadingSongStatus(true, uri);
        const songIsSaved = songExists(newSongs, uri, sourceIsAudio);
        
        if(songIsSaved === "Already downloaded") return false;

        const pathObjectName = sourceIsAudio ? "pathAudio" : "pathVideo";
        const isObjectMedia = sourceIsAudio ? "isAudio" : "isVideo";

        axios.get(`https://tubeplaya.herokuapp.com/video_info/${uri}`)
        .then(function (response) {
          let {downloadingVideoKey} = self.state;
          downloadingVideoKey.push(uri);
          self.setState({downloadingVideoKey});
          
          // media current format
          let url = sourceIsAudio ? response.data.formats[0].url : response.data.formats[2].url
          url = timeInSeconds > 13 ? response.data.formats[3].url : url;
          const thumbnail = response.data.thumbnail;
          let songObject = {};
          
          self.isDownloadingSongStatus(false);
          
          //  songObject = {};
          let isAlreadyInPlaylist = false;
            
          let playlistSongs = JSON.parse(newSongs);
          if(songIsSaved === "Already in playlist") {
              playlistSongs.forEach((song, i) => {
                console.log
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
              self.downloadImage(thumbnail, uri);
              songObject.imageURI = `file:///storage/emulated/0/Android/data/com.muustube/files/Images/${uri}.png`;
            }

            if(sourceIsAudio) {

              RNFFmpeg.execute(`-i ${url} file:///storage/emulated/0/Android/data/com.muustube/files/Download/${songObject.uri}.mp3`).then(result => {
                console.log(result)
                if(result.rc === 0) {
                  songObject[pathObjectName] = `file:///storage/emulated/0/Android/data/com.muustube/files/Download/${songObject.uri}.mp3`;
                  playlistSongs.push(songObject);
                  playlistSongs = JSON.stringify(playlistSongs);
                  self.saveSongInLocalStorage(songObject, uri, isAlreadyInPlaylist);
                }
                else {
                  self.deleteFromQueue(uri);
                  ToastAndroid.showWithGravity(
                    "Video not available in your region",
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER,
                  );
                }
              });     
            }
            else {
              self.saveSongInLocalStorage(songObject, uri);
            }
      });


      }
        
    } catch (error) {
      console.log(error)
    }
  }

  setDownloadingVideoKey = (downloadingVideoKey) => {
    this.setState({downloadingVideoKey});
  }

  deleteFromQueue = (uri) => {
    let {downloadingVideoKey} = this.state;
    downloadingVideoKey = downloadingVideoKey.filter(dld => dld != uri);
    this.setState({downloadingVideoKey});
  }

  updatePlaylistAfterDownload = (songs = null) => {
    const self = this;
    if(songs == null) {
      AsyncStorage.getItem("Songs", (e, result) => {
        const { currentPlaylistName } = self.state;
        songs = JSON.parse(result);
        let videoListPlaylist = songs.filter(song => song.playlist.includes(currentPlaylistName));
        if(currentPlaylistName != "songsDownloadedOnDevice") {
          videoListPlaylist.sort(function(a, b) { 
            return a.playlistsIndex[currentPlaylistName] - b.playlistsIndex[currentPlaylistName];
          });
        }
        self.updateLastPlaylist(songs, "playlist", currentPlaylistName);
        self.setState({videoListPlaylist})
      });
    }
    else {
      const { currentPlaylistName } = self.state;
      let videoListPlaylist = songs.filter(song => song.playlist.includes(currentPlaylistName));
      if(currentPlaylistName != "songsDownloadedOnDevice") {
        videoListPlaylist.sort(function(a, b) { 
          return a.playlistsIndex[currentPlaylistName] - b.playlistsIndex[currentPlaylistName];
        });
      }
      self.updateLastPlaylist(songs, "playlist", currentPlaylistName);
      self.setState({videoListPlaylist})
    }
    console.log("PLAYList AL CIEN")
  }

  saveSongInLocalStorage = async (songObject, uri, isAlreadyInPlaylist = false) => {
    const self = this;
    AsyncStorage.getItem("Songs", (e, result) => {
      let allSongs = result;
      if(result != null) {
        allSongs = JSON.parse(allSongs);
        if(isAlreadyInPlaylist) {
          allSongs = allSongs.filter(songs => songs.uri != songObject.uri);
        }
        allSongs.push(songObject);
      }
      else {
        allSongs = [songObject];
      }
      

      self.updatePlaylistAfterDownload(allSongs);
      self.addToAllSongs(allSongs);
      allSongs = JSON.stringify(allSongs);

      AsyncStorage.setItem("Songs", allSongs)
      .then(res => {
        self.deleteFromQueue(uri);
        self.getSongsAndUpdate();
      })
      .catch(error => console.log(error))

    });
  }

  addToAllSongs = (allSongs) => {
    this.setState({allSongs});
  }

  deleteSongFromPlaylist = (key) => {
    const playlistName = "favorites__Playlist";
    
    let jsonSongs = null;
    const self = this;
    AsyncStorage.multiGet(["Songs"], (err, stores) => {
        stores.forEach((store, index) => {
            if(index == 0) {
                jsonSongs = store[1];
                jsonSongs = JSON.parse(jsonSongs);
                jsonSongs = jsonSongs.map(json => {
                    if(json.uri == key) {
                        console.log("YEISON", json);
                        let playlist = json.playlist;
                        playlist = playlist.filter(play => play != playlistName);
                        json["playlist"] = playlist;
                        return json;
                    }
                    return json;
                });
                jsonSongs = jsonSongs.filter(song => song.playlist.length > 0);
                console.log(jsonSongs)
            }
        });
        self.addToAllSongs(jsonSongs);
        jsonSongs = JSON.stringify(jsonSongs);

        AsyncStorage.multiSet([['Songs', jsonSongs]], () => {
            ToastAndroid.showWithGravity(
                `Song delete from favorites`,
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
            );
            let JSONified = JSON.parse(jsonSongs);
            // if(cameFrom == "Playlists") {
            //     JSONified = JSONified.filter(json => json.playlist.includes(playlistName));
            // }
            // else if(cameFrom == "Downloads") {
            //     JSONified = JSONified.filter(json => json.playlist.includes(playlistName) && json.isDownloaded);
            // }

            console.log("FEDERER", JSONified)
            self.updatePlaylistAfterDownload();
        });
        
    });
}

  addToPlaylist = async (item) => {
    const self  = this;
    const key = "favorites__Playlist";
    let {channel, title, uri, time, imageURI, } = item;
    console.log(item);
    channel = channel === undefined ? "Unknown" : channel;

    let songObject = {playlist: [key], imageURI, channel, title, uri, time, path: "", isDownloaded: false, customName: false, customArtist: false};
    if(imageURI != `file:///storage/emulated/0/Android/data/com.muustube/files/Images/${uri}.png`) {
      self.downloadImage(imageURI, uri);
      songObject.imageURI = `file:///storage/emulated/0/Android/data/com.muustube/files/Images/${uri}.png`;
    }
    if(item != 'ERROR') {
        try {
            await AsyncStorage.getItem("Songs")
            .then(response => {
                let songs = JSON.parse(response);
                if(songs != null) {
                    let playlistSongs = songs.filter(song => song.playlist.includes(key));
                    let newIndexPlaylist = playlistSongs.length;
                    let isInThePlaylist = true;
                    let isSavedAlready = false;
                    let newSongsArray = songs.map(song => {
                        if(song.uri == songObject.uri && !song.playlist.includes(key)) {
                            song["playlistsIndex"] = song["playlistsIndex"] === undefined ? {[key]: newIndexPlaylist} : {...song["playlistsIndex"], [key]: newIndexPlaylist};
                            song.playlist.push(key);
                            isSavedAlready = true;
                            return song;
                        }
                        else if(song.uri == songObject.uri && song.playlist.includes(key)) {
                            isSavedAlready = true;
                            return song;
                        }
                        else {
                            isInThePlaylist = true;
                            return song;
                        }
                    });

                    if(!isSavedAlready) {
                        songObject["playlistsIndex"] = songObject["playlistsIndex"] === undefined ? {[key]: newIndexPlaylist} : {...songObject["playlistsIndex"], [key]: newIndexPlaylist};;
                        console.log(songObject)
                        newSongsArray.push(songObject);
                    }

                    console.log("FEDERERERERERERE", newSongsArray)
                    //songs.push(songObject)
                    self.addToAllSongs(newSongsArray);
                    songs = JSON.stringify(newSongsArray);
                    AsyncStorage.setItem("Songs", songs)
                    .then(response => {
                        ToastAndroid.showWithGravity(
                            `Song added to playlist`,
                            ToastAndroid.SHORT,
                            ToastAndroid.CENTER,
                          );
                        // this.props.navigation.goBack()
                        self.updatePlaylistAfterDownload();
                    })
                    .catch(error => console.log(error))
                }
                else {
                    songObject["playlistsIndex"] = songObject["playlistsIndex"] === undefined ? {[key]: 0} : {...songObject["playlistsIndex"], [key]: 0};
                    let songs = [songObject];
                    songs = JSON.stringify(songs);
                    AsyncStorage.setItem("Songs", songs)
                    .then(response => {
                        ToastAndroid.showWithGravity(
                            `Song added to playlist`,
                            ToastAndroid.SHORT,
                            ToastAndroid.CENTER,
                          );
                        // this.props.navigation.goBack()
                        self.updatePlaylistAfterDownload();
                    })
                    .catch(error => console.log(error))
                }
            })
            .catch(error => console.log(error));
        }
        catch(error) {
            console.log(error)
        }
    }
}


  enableMusicControls = () => {
    MusicControl.setNowPlaying({
        title: this.state.videoTitle,
        artwork: this.state.imageURI, // URL or RN's image require()
        artist: this.state.videoChannel,
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

  updateMusicControls = (willPlay = false) => {
    let { paused } = this.state;
    paused = willPlay ? false : paused;
    MusicControl.updatePlayback({
      state: paused ? MusicControl.STATE_PAUSED : MusicControl.STATE_PLAYING,
      elapsedTime: 135,
      title: this.state.videoTitle,
      artwork: this.state.imageURI, // URL or RN's image require()
      artist: this.state.videoChannel,
    })
  }
}







export default App;