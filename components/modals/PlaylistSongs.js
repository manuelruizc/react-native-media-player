import React, { Component } from 'react';
import {View, Text, ActivityIndicator, Dimensions, Image, AsyncStorage, Animated, Platform, Easing, StyleSheet, ToastAndroid, TouchableOpacity, TextInput, ScrollView} from 'react-native';
import RNFS from 'react-native-fs';
import Icon from 'react-native-vector-icons/Ionicons';
import OptionsMenu from 'react-native-options-menu';
import EditSong from './EditSong';
import SortableList from 'react-native-sortable-list';
import { connect } from 'react-redux';

const window = Dimensions.get('window');

const myIcon = (<Icon name={"ios-more"} size={24} color={"white"} />);

const BothSources = (props) => {
    const {play} = props;
    return (
    <OptionsMenu
        customButton={myIcon}
        destructiveIndex={1}
        options={["Editar", "Agregar a playlist", "Eliminar de playlist", "Eliminar del dispositivo", "Eliminar completamente (both)"]}
        actions={[() => props.openEditModal(play), () => props.navigate('PlaylistOptions', {item: play}), () => props.deleteSongFromPlaylist(play.uri), () => props.deleteSongOnlyFromDevice(play.uri), () => props.deleteSongFromEverythingBothSources(play.uri)]}
    />
    );
}

const OneSource = (props) => {
    const {play} = props;
    return (
        <OptionsMenu
            customButton={myIcon}
            destructiveIndex={1}
            options={["Editar", "Agregar a playlist", "Eliminar de playlist", "Eliminar del dispositivo", "Eliminar completamente"]}
            actions={[() => props.openEditModal(play), () => props.navigate('PlaylistOptions', {item: play}), () => props.deleteSongFromPlaylist(play.uri), () => props.deleteSongOnlyFromDevice(play.uri), () => props.deleteSongFromEverything(play.uri)]}
        />
    );
}

const Offline = (props) => {
    const {play} = props;
    return (
    <OptionsMenu
        customButton={myIcon}
        destructiveIndex={1}
        options={["Editar", "Descargar", "Agregar a playlist", "Eliminar de playlist"]}
        actions={[() => props.openEditModal(play), () => props.downloadSong(play), () => props.navigate('PlaylistOptions', {item: play}), () => props.deleteSongFromPlaylist(play.uri)]}
    />
    );
}


class PlaylistSongs extends Component {
    constructor(props) {
        super(props);

        this.state = {
            allSongs: [],
            songs:[],
            isModalActive: false,
            text: "",
            isLoadingLocalStorage: true,
            isEditModalActive: false,
            currentItem: null,
            currentOrder: [],
            isEditingActive: false,
        }
    }

    


    loadSongs = (songs = null) => {
        const self = this;
        const key = this.props.navigation.getParam('key', 'error');
        const cameFrom = this.props.navigation.getParam('comeFrom', 'ERROR');
        const sourceIsAudio = this.props.screenProps.sourceIsAudio;
        const pathName = sourceIsAudio ? "isAudio" : "isVideo";
        const ext = pathName === "path" ? "mp3" : "mp4";
        let { allSongs } = this.props;
        allSongs = songs === null ? allSongs : songs;
        console.log('allSongs', allSongs)
        this.setState({allSongs: allSongs, songs: allSongs});
        if(cameFrom == "Playlists") {
            allSongs = allSongs.filter(json => json.playlist.includes(key));
            allSongs.sort(function(a, b) { 
                return a.playlistsIndex[key] - b.playlistsIndex[key];
            });
        }
        else if(cameFrom == "Downloads") {
            allSongs = allSongs.filter(json => json.playlist.includes(key) && json.isDownloaded && json[pathName]);
            if(key != 'songsDownloadedOnDevice') {
                allSongs.sort(function(a, b) { 
                    return a.playlistsIndex[key] - b.playlistsIndex[key];
                });
            }
        }

        self.setState({songs:allSongs}, () => console.log(this.state.songs));
        // self.props.screenProps.setVideoListPlaylist(JSONified);
        // self.props.screenProps.searchListStatus(false);
        self.setState({isLoadingLocalStorage: false});
    }

    componentDidMount() {
        this.loadSongs();
    }

    closeEditModal = () => {
        this.setState({isEditModalActive: false})
    }
    openEditModal = (play) => {
        this.setState({isEditModalActive: true, currentItem: play}, () => console.log(this.state))
    }

    downloadAllPlaylist = () => {
        let { songs } = this.state;
        const { sourceIsAudio } = this.props.screenProps;
        const pathName = sourceIsAudio ? "isAudio" : "isVideo";
        const self = this;
        console.log("PERRROO")
        songs.forEach(song => {
            if(song.isDownloaded && song[pathName]) {
                console.log("Ya esta descargada");
            }
            else {
                self.downloadSong(song);
                console.log("Descargando")
            }
        })
    }

    componentWillReceiveProps(newProps) {
        if(newProps.allSongs != this.props.allSongs) {
            
            this.loadSongs(newProps.allSongs);
        }
    }

    render() {
        const { navigation } = this.props;
        const { sourceIsAudio, downloadingVideoKey } = this.props.screenProps;
        const pathName = sourceIsAudio ? "isAudio" : "isVideo";
        const key = navigation.getParam('key', 'ERROR');
        const cameFrom = navigation.getParam('comeFrom', 'ERROR');
        const { songs, isEditingActive } = this.state;

        return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', backgroundColor:'#D3E0EC', position:'relative' }}>

            {this.state.isEditModalActive ? (<EditSong loadSongs={this.loadSongs} item={this.state.currentItem} closeModal={this.closeEditModal} addToAllSongs={this.props.screenProps.addToAllSongs} />) : false}
            
            <View style={{width:'100%', height:'14%', flexDirection:'row', alignItems:'flex-end', justifyContent:'space-between', paddingLeft:'5%', paddingRight:'5%',}}>
                <View>
                    <Text onPress={this.saveCurrentOrder} style={{color:'rgba(0,0,0,0.4)', marginBottom:10, fontSize:13, fontWeight:'bold',}}>PLAYLIST (DOWNLOADED)</Text>
                    <Text style={{color:'#444', fontSize:20}}>{key == "songsDownloadedOnDevice" ? "Downloads" : key}</Text>
                </View>
                <View style={cameFrom == "Downloads" ? {display: 'none'} : null}>
                    <Text onPress={isEditingActive ? this.saveCurrentOrder : this.toggleEdit} style={{fontSize:30}}>{isEditingActive ? (<Icon name="ios-bookmark" size={25} color={"white"} />) : (<Icon name="ios-create" size={25} color={"white"} />)}</Text>
                </View>
            </View>
            <View style={{width:'100%', justifyContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity style={{width:'40%', height:35, backgroundColor:'#ea4c89', borderRadius:900, justifyContent: 'center', alignItems: 'center'}} onPress={this.downloadAllPlaylist}>
                    <Text style={{color:'white'}}>Download all</Text>
                </TouchableOpacity>
            </View>
          {this.state.isLoadingLocalStorage ?
          (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
          )
        :
        songs.length < 1 
        ?
        <Text style={{color:'white'}}>{cameFrom == "Downloads" ? "No tienes canciones descargadas en esta playlist" : "No tienes canciones en esta playlist"}</Text>
        :
        isEditingActive ? 
        (<Container setCurrentOrder={this.setCurrentOrder} data={this.state.songs} />)
        :
        (<ScrollView style={{width:'100%',}}>
        {songs.map((play, index) => (
            <View key={play.title} style={{width:'88%', height:70, marginLeft:'6%', marginBottom:5, marginTop:5, alignItems:'center', justifyContent:'space-around', flexDirection: 'row', }}>
                {this.props.screenProps.currentVideoKey == play.uri ?
                (
                <TouchableOpacity style={{width:30, height:30, justifyContent:'center', alignItems:'center', textAlign: 'center', borderWidth:1, borderColor:'#5B4F5F', borderRadius:900}} onPress={this.togglePause}>
                    {this.props.screenProps.paused ?
                    (<Icon name={"ios-play"} size={15} color={"#5B4F5F"} />)
                    :
                    (<Icon name={"ios-pause"} size={15} color={"#5B4F5F"} />)}
                </TouchableOpacity>)
                :
                (
                <TouchableOpacity style={{width:30, height:30, justifyContent:'center', alignItems:'center', textAlign: 'center', borderWidth:1, borderColor:'#5B4F5F', borderRadius:900}} onPress={() => this.playSong(index, play)}>
                    <Icon name={"ios-play"} size={15} color={"#5B4F5F"} />
                </TouchableOpacity>
                )}
                <View style={{width: '67%', height:'100%', justifyContent: 'center', alignItems: 'flex-start',}}>
                    <Text style={{width:'100%', fontSize:16, color:play.isDownloaded && play[pathName] ? '#ea4c89' : downloadingVideoKey.includes(play.uri) ? "orange" : '#444'}} numberOfLines={1} ellipsizeMode={"tail"}>{!play.customName ? play.title : play.customName}</Text>
                    <Text style={{width:'100%', fontSize:10, color:play.isDownloaded && play[pathName] ? '#ea4c89' : downloadingVideoKey.includes(play.uri) ? "orange" : '#444', marginBottom:3}}>{!(play.customArtist) ? play.channel : play.customArtist }</Text>
                </View>
                    {play.isDownloaded ?
                    play.pathVideo && play.pathAudio ?
                    (<BothSources
                        openEditModal={this.openEditModal}
                        play={play}
                        navigate={this.props.navigation.navigate}
                        deleteSongFromPlaylist={this.deleteSongFromPlaylist}
                        deleteSongOnlyFromDevice={this.deleteSongOnlyFromDevice}
                        deleteSongFromEverythingBothSources={this.deleteSongFromEverythingBothSources}
                    />)
                    :
                    (<OneSource
                        openEditModal={this.openEditModal}
                        play={play}
                        navigate={this.props.navigation.navigate}
                        deleteSongFromPlaylist={this.deleteSongFromPlaylist}
                        deleteSongOnlyFromDevice={this.deleteSongOnlyFromDevice}
                        deleteSongFromEverything={this.deleteSongFromEverything}
                    />)
                    :
                    (<Offline
                        openEditModal={this.openEditModal}
                        play={play}
                        navigate={this.props.navigation.navigate}
                        downloadSong={this.downloadSong}
                        deleteSongFromPlaylist={this.deleteSongFromPlaylist}
                    />)}
                </View>
                    )
                )}
            </ScrollView>)}
        </View>
      );
    }

    toggleEdit = () => {
        this.setState({isEditingActive: !this.state.isEditingActive});
    }

    downloadSong = (item) => {
        this.props.screenProps.downloadSong(item)
      }

    togglePause = () => {
        this.props.screenProps.togglePause();
    }

    playSong = (index, songData) => {
        const key = this.props.navigation.getParam('key', 'error');
        const cameFrom = this.props.navigation.getParam('comeFrom', 'ERROR');
        const self = this;
        const {channel, isDownloaded, title, path, time, uri, imageURI} = songData;
        const pathName = this.props.screenProps.sourceIsAudio ? "pathAudio" : "pathVideo";
        
        this.props.screenProps.updateLastPlaylist(this.state.songs, "playlist", key);
        this.props.screenProps.searchListStatus(false);
        this.props.screenProps.setSongProgress(0, false);
        
        console.log("asdasdasASDASDASDKLAJSKDJASN DOJASKDN AISKJD ASODJAND", songData);
        console.log({key, cameFrom});
        
        if(isDownloaded) {
            self.props.screenProps.currentVideoURIChange(songData[pathName]);
            self.props.screenProps.currentVideoKeyChange(uri);
            self.props.screenProps.currentVideoURImage(imageURI);
            self.props.screenProps.changeVideoChannel(channel);
            self.props.screenProps.changeVideoTitle(title);
            self.props.screenProps.playNewSong(false, index, songData, key);
            self.props.screenProps.loadingState(false);
            self.props.screenProps.changeVideoDownloadStatus(true);
        }
        else {
            this.props.screenProps.playIndexSong(index, songData, null, true, this.state.songs);
        }
        self.props.screenProps.currentVideoIndexChange(index);
        
    }

    openModal = () => {
        this.setState({isModalActive: true})
    
    }
    closeModal = () => {
        this.setState({isModalActive: false})
    }

    ddToPlaylist = async (key) => {
        const item = this.props.navigation.getParam('item', 'ERROR');
        const {channel, title, uri, time} = item;
        const songObject = {playlist: key, channel, title, uri, time};
        const self  = this;
        if(item != 'ERROR') {
            try {
                await AsyncStorage.getItem("Songs")
                .then(response => {
                    if(response != null) {
                        let songs = JSON.parse(response);
                        songs.push(songObject)
                        self.props.screenProps.addToAllSongs(songs);
                        AsyncStorage.setItem("Songs", JSON.stringify(songs))
                        .then(response => {
                            console.log(response)
                        })

                        .catch(error => console.log(error))
                    }
                    else {
                        let songs = [songObject];
                        self.props.screenProps.addToAllSongs(songs);
                        songs = JSON.stringify(songs);
                        AsyncStorage.setItem("Songs", songs)
                        .then(response => {
                            console.log(response)
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

    borrarPlaylist = async () => {
        try {
            await AsyncStorage.removeItem("Playlists");
            return true;
          }
          catch(exception) {
            return false;
          }
    }

    deleteSongFromPlaylist = (key) => {
        const playlistName = this.props.navigation.getParam('key', 'ERROR');
        const cameFrom = this.props.navigation.getParam('comeFrom', 'ERROR');
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
            self.props.screenProps.addToAllSongs(jsonSongs);
            jsonSongs = JSON.stringify(jsonSongs);

            AsyncStorage.multiSet([['Songs', jsonSongs]], () => {
                ToastAndroid.showWithGravity(
                    `Song delete from playlist`,
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER,
                );
                let JSONified = JSON.parse(jsonSongs);
                if(cameFrom == "Playlists") {
                    JSONified = JSONified.filter(json => json.playlist.includes(playlistName));
                }
                else if(cameFrom == "Downloads") {
                    JSONified = JSONified.filter(json => json.playlist.includes(playlistName) && json.isDownloaded);
                }

                console.log("FEDERER", JSONified)
                self.setState({songs: JSONified}, () => {

                })
            });
            
        });
    }

    deleteSongOnlyFromDevice = (key) => {
        const playlistName = this.props.navigation.getParam('key', 'ERROR');
        const cameFrom = this.props.navigation.getParam('comeFrom', 'ERROR');
        let jsonSongs = null;
        const  { switchValue, currentPlaylistName } = this.props.screenProps;
        let isCurrentPlaylist = false;
        const extension = switchValue ? ".mp3" : ".mp4";
        const pathMedia = switchValue ? "pathAudio" : "pathVideo";
        const booleanFormat = switchValue ? "isAudio" : "isVideo";
        const counterFormat = switchValue ? "isVideo" : "isAudio";
        
        const path = `file:///storage/emulated/0/Android/data/com.muustube/files/Download/${key}${extension}`;
        const self = this;

        if(key == this.props.screenProps.currentVideoKey) {
            self.props.screenProps.playNextSong();
        }

        if(currentPlaylistName === playlistName) {
            isCurrentPlaylist = true;
        }

        RNFS.exists(path)
        .then( (result) => {
            console.log(result)
            if(result){
            return RNFS.unlink(path)
                .then(() => {
                    AsyncStorage.multiGet(["Songs"], (err, stores) => {

                        jsonSongs = stores[0][1];
                        jsonSongs = JSON.parse(jsonSongs);
                        jsonSongs = jsonSongs.map(json => {
                            if(json.uri == key) {
                                json[pathMedia] = "";
                                json[booleanFormat] = false;
                                json["playlist"] = json[counterFormat] ? json["playlist"] : json.playlist.filter(name => name != "songsDownloadedOnDevice");
                                json["isDownloaded"] = json[counterFormat] ? true : false;
                                return json;
                            }
                            return json;
                        });
                        jsonSongs = jsonSongs.filter(json => json.playlist.length > 0);
                        console.log('ahhh claaaaaroooooooo',jsonSongs)
                        jsonSongs = JSON.stringify(jsonSongs);
        
                        
                        AsyncStorage.multiSet([['Songs', jsonSongs]], () => {
                            ToastAndroid.showWithGravity(
                                `Song deleted from device storage`,
                                ToastAndroid.SHORT,
                                ToastAndroid.CENTER,
                            );
                            let JSONified = JSON.parse(jsonSongs);
                            
                            if(cameFrom == "Playlists") {
                                JSONified = JSONified.filter(json => json.playlist.includes(playlistName));
                            }
                            else if(cameFrom == "Downloads") {
                                JSONified = JSONified.filter(json => json.playlist.includes(playlistName) && json.isDownloaded && json[booleanFormat]);
                            }
                            
            
                            self.setState({songs: JSONified}, () => {
                                self.props.screenProps.addToAllSongs(JSONified);
                                if(isCurrentPlaylist) {
                                    self.props.screenProps.updateLastPlaylist(self.state.songs, "playlist", key);
                                }
                            })
                        });
                    });
                })
                // `unlink` will throw an error, if the item to unlink does not exist
                .catch((err) => {
                    //console.log(err.message);
                });
            }

        })
        .catch((err) => {
            //console.log(err.message);
        });
    }

    deleteSongFromEverything = (key) => {
        const playlistName = this.props.navigation.getParam('key', 'ERROR');
        const cameFrom = this.props.navigation.getParam('comeFrom', 'ERROR');
        let jsonSongs = null;
        const  { switchValue } = this.props.screenProps;
        const extension = switchValue ? ".mp3" : ".mp4";
        const pathMedia = switchValue ? "pathAudio" : "pathVideo";
        const booleanFormat = switchValue ? "isAudio" : "isVideo";
        const counterFormat = switchValue ? "isVideo" : "isAudio";
        
        const path = `file:///storage/emulated/0/Android/data/com.muustube/files/Download/${key}${extension}`;
        const self = this;

        RNFS.exists(path)
        .then( (result) => {
            console.log(result)
            if(result){
            return RNFS.unlink(path)
                .then(() => {
                    AsyncStorage.multiGet(["Songs"], (err, stores) => {

                        jsonSongs = stores[0][1];
                        jsonSongs = JSON.parse(jsonSongs);
                        jsonSongs = jsonSongs.filter(song => song.uri != key);
                        jsonSongs = JSON.stringify(jsonSongs);
            
                        if(key == this.props.screenProps.currentVideoKey) {
                            self.props.screenProps.playNextSong(null, true);
                        }
                        
                        AsyncStorage.multiSet([['Songs', jsonSongs]], () => {
                            ToastAndroid.showWithGravity(
                                `Song source deleted from the device and playlists`,
                                ToastAndroid.SHORT,
                                ToastAndroid.CENTER,
                            );
                            let JSONified = JSON.parse(jsonSongs);
                            
                            if(cameFrom == "Playlists") {
                                JSONified = JSONified.filter(json => json.playlist.includes(playlistName));
                            }
                            else if(cameFrom == "Downloads") {
                                JSONified = JSONified.filter(json => json.playlist.includes(playlistName) && json.isDownloaded && json[booleanFormat]);
                            }
                            
            
                            self.setState({songs: JSONified}, () => {
                                self.props.screenProps.addToAllSongs(JSONified);
                            })
                        });
                    });
                })
                // `unlink` will throw an error, if the item to unlink does not exist
                .catch((err) => {
                    //console.log(err.message);
                });
            }

        })
        .catch((err) => {
            //console.log(err.message);
        });
    }

    deleteSongFromEverythingBothSources = (key) => {
        this.deleteSongFromEverythingBothSourcesCore(key);
    }

    deleteSongFromEverythingBothSourcesCore = (key) => {
        const playlistName = this.props.navigation.getParam('key', 'ERROR');
        const cameFrom = this.props.navigation.getParam('comeFrom', 'ERROR');
        const {sourceIsAudio} = this.props.screenProps;
        const pathyCantu = sourceIsAudio ? "pathAudio" : "pathVideo";
        let jsonSongs = null;
        const path = `file:///storage/emulated/0/Android/data/com.muustube/files/Download/${key}.mp3`;
        const pathVideo = `file:///storage/emulated/0/Android/data/com.muustube/files/Download/${key}.mp4`;
        const self = this;
        

        RNFS.exists(path)
        .then( (result) => {

            if(result){
                return RNFS.unlink(path)
                    .then(() => {
                        RNFS.exists(pathVideo)
                    .then( (result) => {

                if(result){
                return RNFS.unlink(pathVideo)
                    .then(() => {
                        AsyncStorage.multiGet(["Songs"], (err, stores) => {
                            jsonSongs = stores[0][1];
                            jsonSongs = JSON.parse(jsonSongs);
                            jsonSongs = jsonSongs.filter(json => json.uri != key);
                            jsonSongs = JSON.stringify(jsonSongs);
                
                            if(key == this.props.screenProps.currentVideoKey) {
                                self.props.screenProps.playNextSong(null, true);
                            }
                            
                            AsyncStorage.multiSet([['Songs', jsonSongs]], () => {   
                                ToastAndroid.showWithGravity(
                                    `Song sources (audio/video) deleted.`,
                                    ToastAndroid.SHORT,
                                    ToastAndroid.CENTER,
                                );
                                let JSONified = JSON.parse(jsonSongs);
                                
                                if(cameFrom == "Playlists") {
                                    JSONified = JSONified.filter(json => json.playlist.includes(playlistName) && json[pathyCantu]);
                                }
                                else if(cameFrom == "Downloads") {
                                    JSONified = JSONified.filter(json => json.playlist.includes(playlistName) && json.isDownloaded && json[pathyCantu]);
                                }

                
                                self.setState({songs: JSONified}, () => {
                                    //console.log(self.state)
                                })
                            });
                        });
                    })
                    // `unlink` will throw an error, if the item to unlink does not exist
                .catch((err) => {
                    //console.log(err.message);
                });
            }

        })
        .catch((err) => {
            //console.log(err.message);
        });
                })
                // `unlink` will throw an error, if the item to unlink does not exist
                .catch((err) => {
                    //console.log(err.message);
                });
            }

        })
        .catch((err) => {
            //console.log(err.message);
        });
    }

    createPlaylist = async () => {
        try {
            let {playlists} = this.state;
            let playlistTitleExists = playlists.includes(this.state.text);
            let self = this;


            if(!playlistTitleExists) {
                playlists.push(this.state.text);
                playlists = JSON.stringify(playlists);
                
                await AsyncStorage.setItem("Playlists", playlists)
                .then(response => {
                    self.setState({text: "", isModalActive: false})
                })
                .catch(error => console.log(error));
            }
            else {
                //console.log("Ya existe")
            }
          }
          catch(error) {
            console.log(error);
          }
    }
    
    // SET THE ORDER ARRAY WHEN DRAGGIN AND SORTIN'
    setCurrentOrder = (currentOrder) => {
        this.setState({currentOrder})
    }
    
    saveCurrentOrder = () => {
        const self = this;
        let { allSongs, songs, currentOrder } = this.state;
        const key = this.props.navigation.getParam('key', 'error');
        let newOrderedArray = [];
        
        //  If there's no change in the playlist order
        if(currentOrder.length == 0) {
            this.setState({isEditingActive: false});
            // this.loadSongs();
            return false;
        }
        
        //  Playlist reordering
        for(let i = 0; i < currentOrder.length; i++) {
            console.log(songs[Number(currentOrder[i])].playlistsIndex[key]);
            songs[Number(currentOrder[i])].playlistsIndex[key] = i;
            newOrderedArray.push(songs[Number(currentOrder[i])]);
        }


        allSongs = allSongs.filter(song => !song.playlist.includes(key));


        //  new songs array and saving
        allSongs = [...allSongs, ...newOrderedArray];
        self.props.screenProps.addToAllSongs(allSongs);
        AsyncStorage.setItem("Songs", JSON.stringify(allSongs));
        this.setState({isEditingActive: false}, () => {
            self.loadSongs();
            if(self.props.screenProps.currentPlaylistName == key)
                self.props.screenProps.updatePlaylistAfterDownload();
        })
    }
  }

  const styles = StyleSheet.create({
    modalActive: {
        width:'100%',
        height:'100%',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        position: 'absolute',
        top:0,
        left:0,
        bottom:0,
        right:0,
        zIndex:20,
        justifyContent:'center',
        alignItems: 'center'
    },
    modalNotActive: {
        display:'none'
    }
  });



  class Container extends Component {
    constructor(props) {
      super(props);
    }

    modal = (key, currentOrder) => {
        this.props.setCurrentOrder(currentOrder);
    }
  
    render() {
      return (
        <View style={st.container}>
          <SortableList
            onReleaseRow={this.modal}
            style={st.list}
            contentContainerStyle={st.contentContainer}
            data={this.props.data}
            renderRow={this._renderRow} />
        </View>
      );
    }
  
    _renderRow = ({data, active}) => {
      return <Row data={data} active={active} />
    }
  }
  
  class Row extends Component {
  
    constructor(props) {
      super(props);
  
      this._active = new Animated.Value(0);
  
      this._style = {
        ...Platform.select({
          ios: {
            transform: [{
              scale: this._active.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.1],
              }),
            }],
            shadowRadius: this._active.interpolate({
              inputRange: [0, 1],
              outputRange: [2, 10],
            }),
          },
  
          android: {
            transform: [{
              scale: this._active.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.07],
              }),
            }],
            elevation: this._active.interpolate({
              inputRange: [0, 1],
              outputRange: [2, 6],
            }),
          },
        })
      };
    }
  
    componentWillReceiveProps(nextProps) {
      if (this.props.active !== nextProps.active) {
        Animated.timing(this._active, {
          duration: 300,
          easing: Easing.bounce,
          toValue: Number(nextProps.active),
        }).start();
      }
    }
  
    render() {
     const {data, active} = this.props;
        
      return (
        <Animated.View style={[
          this._style,
          {width:'88%', height:70, marginLeft:'6%', marginBottom:5, marginTop:5, alignItems:'center', justifyContent:'space-around', flexDirection: 'row', }
        ]}>
          <Image source={{uri: data.imageURI}} style={{width:30, height:30, justifyContent:'center', alignItems:'center', borderWidth:1, borderColor:'#5B4F5F', borderRadius:900}} />
          <View style={{width: '67%', height:'100%', justifyContent: 'center', alignItems: 'flex-start',}}>
            <Text style={{width:'100%', fontSize:16, color:'#444'}} numberOfLines={1} ellipsizeMode={"tail"}>{!data.customName ? data.title : data.customName}</Text>
            <Text style={{width:'100%', fontSize:10, color:'rgba(0, 0, 0, 0.4)', marginBottom:3}}>{!(data.customArtist) ? data.channel : data.customArtist }</Text>
        </View>
        <Icon name={"ios-more"} size={24} color={"#444"} />
        </Animated.View>
      );
    }
  }
  
  const st = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  
      ...Platform.select({
        ios: {
          paddingTop: 20,
        },
      }),
    },
  
    title: {
      fontSize: 20,
      paddingVertical: 20,
      color: '#999999',
    },
  
    list: {
      flex: 1,
    },
  
    contentContainer: {
      width: window.width,
  
      ...Platform.select({
        ios: {
          paddingHorizontal: 30,
        },
  
        android: {
          paddingHorizontal: 0,
        }
      })
    },
  
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      padding: 16,
      height: 80,
      flex: 1,
      marginTop: 7,
      marginBottom: 12,
      borderWidth: 1,
      borderRadius: 4,
  
  
      ...Platform.select({
        ios: {
          width: window.width - 30 * 2,
          shadowColor: 'rgba(0,0,0,0.2)',
          shadowOpacity: 1,
          shadowOffset: {height: 2, width: 2},
          shadowRadius: 2,
        },
  
        android: {
          width: window.width,
          elevation: 0,
        },
      })
    },
  
    image: {
      width: 50,
      height: 50,
      marginRight: 30,
      borderRadius: 25,
    },
  
    text: {
      fontSize: 10,
      color: '#222222',
    },
  });








const mapStateToProps = (state) => {
    return {
        allSongs: state.allSongs,
    }
}


export default connect(mapStateToProps)(PlaylistSongs);