downloadSongHelper = async(item) => {
    console.log(item)
    const {channel, uri, imageURI, playlist, time, title} = item;
    let newSongsArray = [];
    const self = this;
    const {sourceIsAudio} = this.state;
    console.log(this.state.downloadedSongsList);
    try {
      let value = await AsyncStorage.getItem('Songs');
      if(value == null) {
        self.isDownloadingSongStatus(true, uri);
        axios.get(`https://sellosylaserinkprint.com/debbiedowner/scrap/videoinfo/${uri}`)
        .then(function (response) {
          let {downloadingVideoKey} = self.state;
          downloadingVideoKey.push(uri);
          self.setState({downloadingVideoKey});
          // media current format
          const extension = sourceIsAudio ? ".weba" : ".mp4";
          const url = sourceIsAudio ? response.data.formats[0].url : response.data.formats[1].url
          const thumbnail = response.data.thumbnail;

        let config = {
          downloadTitle: title,
          downloadDescription:
            "Descargando cancion",
          saveAsName: `${response.data.id}${extension}`,
          allowedInRoaming: true,
          allowedInMetered: true,
          showInDownloads: true,
          external: false,
          path: ""
        };

        // saving on local storage
        downloadManager
          .download((url), (headers = {}), (config))
          .then(response => {
            console.log(response); 
            
            let playlists = ["songsDownloadedOnDevice"];
            playlists = JSON.stringify(playlists);
            AsyncStorage.setItem("Playlists", playlists)
            .then(asyncalive => {
              self.isDownloadingSongStatus(false);
              const pathObjectName = sourceIsAudio ? "pathAudio" : "pathVideo";
              const isObjectMedia = sourceIsAudio ? "isAudio" : "isVideo";

              const songObject = {playlist: ["songsDownloadedOnDevice"], channel, isAudio: false, isVideo: false, pathVideo:'', pathAudio:'', title, uri, time, imageURI:thumbnail, isDownloaded: true, customName:'', customArtist: ''};
              songObject[pathObjectName] = `${response.reason}`;
              songObject[isObjectMedia] = true;
              let songs = [songObject];

              songs = JSON.stringify(songs);
              //SAVING ON LOCALSTORAGE
              AsyncStorage.setItem("Songs", songs)
              .then(res => {
                let {downloadingVideoKey} = self.state;
                downloadingVideoKey = downloadingVideoKey.filter(dld => dld != songObject.uri);
                self.setState({downloadingVideoKey});
                self.getSongsAndUpdate();
              })
            .catch(error => console.log(error))
          })
          .catch(error => console.log(error))
          //END SAVING ON LOCALSTORAGE


          })
          .catch(err => {
            console.log(err);
            self.isDownloadingSongStatus(false);
          });
        });
      }
      else {
        self.isDownloadingSongStatus(true, uri);
        axios.get(`https://sellosylaserinkprint.com/debbiedowner/scrap/videoinfo/${uri}`)
        .then(function (response) {
          let {downloadingVideoKey} = self.state;
          downloadingVideoKey.push(uri);
          self.setState({downloadingVideoKey});
          // media current format
          const extension = sourceIsAudio ? ".weba" : ".mp4";
          const url = sourceIsAudio ? response.data.formats[0].url : response.data.formats[1].url
          const thumbnail = response.data.thumbnail;
          let object = this.songIsInPlaylist(uri);
          const songObject = {playlist: ["songsDownloadedOnDevice"], channel, isAudio: false, isVideo: false, pathVideo:'', pathAudio:'', title, uri, time, imageURI:thumbnail, isDownloaded: true, customName:'', customArtist: ''};





        
        });
      }
        
    } catch (error) {
      // Error retrieving data
      console.log(error)
    }

}

import { RNFS } from 'react-native-fs';
import { AsyncStorage } from 'react-native';

export const createInitialPaths = () => {
  let path_name = "file:///storage/emulated/0/Android/data/com.muustube/files/Download/";
  let path_imgs = "file:///storage/emulated/0/Android/data/com.muustube/files/Images/";

  await RNFS.mkdir(path_name);
  await RNFS.mkdir(path_imgs);
}


export const getSongsFromLocalStorage = async () => {
  let songs = await AsyncStorage.getItem("Songs");
  songs = JSON.parse(songs);
  if(songs != null)
    return songs;
  return [];
}


export const createDefaultPlaylits = () => {
  AsyncStorage.multiGet(["Playlists"], (err, stores) => {
    let playlists = stores[0][1];
    if(playlists != null) {
      playlists = JSON.parse(playlists);

      if(!(playlists.includes("songsDownloadedOnDevice"))) {
        playlists.push("songsDownloadedOnDevice");
      }

      if(!(playlists.includes("favorites__Playlist"))) {
        playlists.push("favorites__Playlist");
      }
      
      const playlistsString = JSON.stringify(playlists);
      AsyncStorage.multiSet([['Playlists', playlistsString]], () => {
        
      });
    }
    else {
      playlists = ["songsDownloadedOnDevice", "favorites__Playlist"];
      const playlistsString = JSON.stringify(playlists);
      AsyncStorage.multiSet([['Playlists', playlistsString]], () => {
          
      });
    }
  });
}



export const nice_function = () => {
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