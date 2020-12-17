import React, { Component } from 'react';
import {View, Text, Button, AsyncStorage, ToastAndroid, StyleSheet, TouchableOpacity, TextInput, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import OptionsMenu from 'react-native-options-menu';
import ModalPlaylists from './ModalPlaylists';

class PlaylistOptions extends Component {
    constructor(props) {
        super(props);

        this.state = {
            playlists: [],
            songs:[],
            isModalActive: false,
            text: "",
            modalOpen: false,
            currentPL: "",
        }
    }


    componentDidMount() {
        const self = this;
        AsyncStorage.multiGet(["Playlists", "Songs"], (err, stores) => {
            stores.forEach((store, index) => {
                const JSONified = JSON.parse(store[1]);
                if(JSONified != null) {
                    if(index == 0) {
                        self.setState({playlists:JSONified})
                    }
                    else if(index == 1) {
                        self.setState({songs:JSONified})
                    }
                }
            });
        });
    }

    closeModalEdit = () => {
        this.setState({modalOpen: false});
    }

    openModalEdit = (play) => {
        this.setState({modalOpen: true, currentPL: play});
    }

    render() {
        const { navigation } = this.props;
        const item = navigation.getParam('item', 'ERROR');
        const myIcon = (<Icon name={"ios-more"} size={25} color={"#444"} style={{padding:12}} />)


      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
            {this.state.modalOpen ? (<ModalPlaylists isPlaylistOptions={true} deletePlaylist={this.deletePlaylist} playlist={this.state.currentPL} closeModal={this.closeModalEdit} />) : false}
            <View style={{width:'100%', height:'12%', backgroundColor: '#D3E0EC', flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingLeft:20, paddingRight:20}}>
                <TouchableOpacity onPress={this.goBack}>
                    <Icon name={"ios-arrow-back"} size={28} color={"#444"} />
                </TouchableOpacity>
                <Text style={{color:'#444', fontSize:20}}>Playlists</Text>
                <TouchableOpacity
                onPress={this.openModal}>
                    <Icon name={"ios-add-circle-outline"} size={28} color={"#444"} />
                </TouchableOpacity>
            </View>
          {this.state.playlists.length < 1 
        ?
        <View style={{width:'100%', height:'88%', alignItems:'center', justifyContent: 'center'}}>
            <Text style={{fontSize:24}}>No tienes playlists creadas</Text>
        </View>
        :
        <ScrollView style={{width:'100%', backgroundColor:'#D3E0EC'}}>
            {this.state.playlists.map(play => 
                play == "songsDownloadedOnDevice" || play == "favorites__Playlist" ?
                null
                :
                (
                <TouchableOpacity onLongPress={() => this.openModalEdit(play)} onPress={() => this.addToPlaylist(play)} key={play} style={{borderBottomWidth:1, borderColor:'#ea4c89', paddingTop: 20, paddingBottom: 20, paddingLeft: 35, flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                    <Text style={{color:'#444'}}>{play}</Text>
                    {/*<OptionsMenu
                        customButton={myIcon}
                        destructiveIndex={1}
                        options={["Agregar", "Eliminar"]}
                        actions={[() => this.addToPlaylist(play), () => this.deletePlaylist(play)]}
                    />*/}
                </TouchableOpacity>
                )
            )}
        </ScrollView>}
          <View style={this.state.isModalActive ? styles.modalActive : styles.modalNotActive} >
            <TouchableOpacity style={{width:'100%', height:'100%', backgroundColor:'transparent', position:'absolute', top:0, left:0, bottom:0, right:0}} onPress={this.closeModal}></TouchableOpacity>
            <View style={{width:'80%', height:'30%', backgroundColor:'white', zIndex:30, justifyContent:'space-around', alignItems:'center', paddingTop:15, paddingBottom:15, borderRadius:15}}>
                <TextInput
                onChangeText={(text) => this.setState({text})}
                value={this.state.text}
                style={{width:'85%', height: '35%', borderWidth:1, borderColor:'gray', fontSize:16, paddingLeft:10, borderRadius:50}}></TextInput>
                <TouchableOpacity onPress={this.createPlaylist} style={{padding:15, width:'65%', borderRadius:50, backgroundColor:'#303F9F'}}>
                    <Text style={{color:'#444', textAlign:'center', fontSize:14}}>Crear playlist</Text>
                </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }
    goBack = () => {
        this.props.navigation.goBack()
    }

    deletePlaylist = (key) => {
        let jsonPlaylists = null;
        let jsonSongs = null;
        AsyncStorage.multiGet(["Playlists", "Songs"], (err, stores) => {
            stores.forEach((store, index) => {
                if(index == 0) {
                    jsonPlaylists = store[1];
                    jsonPlaylists = JSON.parse(jsonPlaylists);
                    jsonPlaylists = jsonPlaylists.filter(j => j != key);
                }
                else if(index == 1) {
                    jsonSongs = store[1];
                    if(jsonSongs != null) {
                        if(jsonSongs.length > 0) {
                            jsonSongs = JSON.parse(jsonSongs);
                            jsonSongs = jsonSongs.map(json => {
                                let playlist = json.playlist;
                                playlist = playlist.filter(play => play != key);
                                json["playlist"] = playlist;
                                return json;
                            });
                            jsonSongs = jsonSongs.filter(song => song.playlist.length > 0);
                        }
                    }
                }
            });
            jsonSongs = JSON.stringify(jsonSongs);
            jsonPlaylists = JSON.stringify(jsonPlaylists);

            AsyncStorage.multiSet([['Playlists', jsonPlaylists], ['Songs', jsonSongs]], () => {
                ToastAndroid.showWithGravity(
                    `Playlist deleted`,
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER,
                  );
                  this.setState({playlists: JSON.parse(jsonPlaylists)});
                  console.log('asdasd', jsonSongs)
            });
        });
    }

    openModal = () => {
        this.setState({isModalActive: true})
    
    }
    closeModal = () => {
        this.setState({isModalActive: false})
    }

    componentWillReceiveProps(newProps) {
        console.log("newProps",newProps);
        
    }

    addToPlaylist = async (key) => {
        const self  = this;
        const item = this.props.navigation.getParam('item', 'ERROR');
        let {channel, title, uri, time, imageURI, } = item;
        console.log(item);
        channel = channel === undefined ? "Unknown" : channel;

        let songObject = {playlist: [key], imageURI, channel, title, uri, time, path: "", isDownloaded: false, customName: false, customArtist: false};
        if(imageURI != `file:///storage/emulated/0/Android/data/com.muustube/files/Images/${uri}.png`) {
            self.props.screenProps.downloadImage(imageURI, uri);
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
                        self.props.screenProps.addToAllSongs(newSongsArray);
                        songs = JSON.stringify(newSongsArray);
                        AsyncStorage.setItem("Songs", songs)
                        .then(response => {
                            ToastAndroid.showWithGravity(
                                `Song added to playlist`,
                                ToastAndroid.SHORT,
                                ToastAndroid.CENTER,
                              );
                            this.props.navigation.goBack()
                            this.props.screenProps.updatePlaylistAfterDownload();
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
                            this.props.navigation.goBack()
                            this.props.screenProps.updatePlaylistAfterDownload();
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

    createPlaylist = async () => {
        try {
            let playlists = await AsyncStorage.getItem("Playlists");
            playlists = JSON.parse(playlists);
            let playlistTitleExists = playlists.includes(this.state.text);
            let self = this;

            if(!playlistTitleExists) {
                playlists.push(this.state.text);
                this.setState({playlists})
                playlists = JSON.stringify(playlists);
                console.log(playlists)
                await AsyncStorage.setItem("Playlists", playlists)
                .then(response => {
                    self.setState({text: "", isModalActive: false,})
                })
                .catch(error => console.log(error));
            }
            else {
                console.log("Ya existe")
            }
          }
          catch(error) {
            console.log(error);
          }
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

export default PlaylistOptions;