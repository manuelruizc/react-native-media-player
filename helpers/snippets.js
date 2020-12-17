export const convertMinsSecs = (time, duration) => {
    if(duration >= 3600) {
        let ms = time % 1000;
        time = (time - ms) / 1000;
        let secs = time % 60;
        time = (time - secs) / 60;
        let mins = time % 60;
        let hrs = (time - mins) / 60;

        return `${hrs < 10 ? `0${hrs}` : hrs}:${mins < 10 ? `0${mins}` : mins}:${secs < 10 ? `0${secs}` : secs}`;
    }
    
    let ms = time % 1000;
    time = (time - ms) / 1000;
    let secs = time % 60;
    time = (time - secs) / 60;
    let mins = time % 60;
    
    mins = mins < 10 ? `0${mins}` : mins
    secs = secs < 10 ? `0${secs}` : secs

    return `${mins}:${secs}`;
}

































































/*
AsyncStorage.multiGet(["currentSong", "currentPlaylist", "Songs", "SourceIsAudio", "songProgress", "lastSearch", "currentVideoItem"], (err, stores) => {
      stores.forEach((store, index) => {
        if(index == 0) {
          if(store[1]) {
            const JSONified = JSON.parse(store[1]);
            // let sourceIsAudio = stores[3][1];
            // sourceIsAudio = JSON.parse(sourceIsAudio);
            let sourceIsAudio = true //sourceIsAudio[0].sourceIsAudio;

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
*/