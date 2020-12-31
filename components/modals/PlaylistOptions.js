import React, { Component, useEffect, useState } from 'react';
import {View, Text, Button, AsyncStorage, ToastAndroid, StyleSheet, TouchableOpacity, TextInput, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import OptionsMenu from 'react-native-options-menu';
import ModalPlaylists from './ModalPlaylists';


export default (props) => {
    const [playlists, setPlaylists] = useState([]);
    const [songs, setSongs] = useState([]);
    const [isModalActive, setIsModalActive] = useState(false);
    const [text, setText] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [currentPL, setCurrentPL] = useState('');


    useEffect(() => {
        AsyncStorage.multiGet(["Playlists", "Songs"], (err, stores) => {
            stores.forEach((store, index) => {
                const JSONified = JSON.parse(store[1]);
                if(JSONified != null) {
                    if(index == 0) {
                        setPlaylists(JSONified);
                    }
                    else if(index == 1) {
                        setSongs(JSONified);
                    }
                }
            });
        });
    }, []);

    const closeModalEdit = () => {
        setModalOpen(false);
    }

    const openModalEdit = (play) => {
        setModalOpen(true);
        setCurrentPL(play);
    }

    
    
      
    const goBack = () => {
        props.navigation.goBack()
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
                  setPlaylists(JSON.parse(jsonPlaylists));
            });
        });
    }
    
    openModal = () => {
        setIsModalActive(true);
        
    }
    closeModal = () => {
        setIsModalActive(false);
    }

    addToPlaylist = async (key) => {
        const item = props.navigation.getParam('item', 'ERROR');
        let {channel, title, uri, time, imageURI, } = item;
        channel = channel === undefined ? "Unknown" : channel;

        let songObject = {playlist: [key], imageURI, channel, title, uri, time, path: "", isDownloaded: false, customName: false, customArtist: false};
        if(imageURI != `file:///storage/emulated/0/Android/data/com.muustube/files/Images/${uri}.png`) {
            props.screenProps.downloadImage(imageURI, uri);
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
                            songObject["playlistsIndex"] = songObject["playlistsIndex"] === undefined ? {[key]: newIndexPlaylist} : {...songObject["playlistsIndex"], [key]: newIndexPlaylist};
                            newSongsArray.push(songObject);
                        }

                        props.screenProps.addToAllSongs(newSongsArray);
                        songs = JSON.stringify(newSongsArray);
                        AsyncStorage.setItem("Songs", songs)
                        .then(response => {
                            ToastAndroid.showWithGravity(
                                `Song added to playlist`,
                                ToastAndroid.SHORT,
                                ToastAndroid.CENTER,
                              );
                            props.navigation.goBack()
                            props.screenProps.updatePlaylistAfterDownload();
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
                            props.navigation.goBack()
                            props.screenProps.updatePlaylistAfterDownload();
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
            let playlistTitleExists = playlists.includes(text);

            if(!playlistTitleExists) {
                playlists.push(text);
                setPlaylists(playlists);
                playlists = JSON.stringify(playlists);
                await AsyncStorage.setItem("Playlists", playlists)
                .then(response => {
                    setText('');
                    setIsModalActive(false);
                })
                .catch(error => console.log(error));
            }
            else {
                ToastAndroid.showWithGravity(
                    `Already exists`,
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER,
                );
            }
          }
          catch(error) {
              console.log(error);
            }
        }
        const { navigation } = props;
        const item = navigation.getParam('item', 'ERROR');
        const myIcon = (<Icon name={"ios-more"} size={25} color={"#444"} style={{padding:12}} />)
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
                {modalOpen && (<ModalPlaylists isPlaylistOptions={true} deletePlaylist={deletePlaylist} playlist={currentPL} closeModal={closeModalEdit} />)}
                <View style={{width:'100%', height:'12%', backgroundColor: '#D3E0EC', flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingLeft:20, paddingRight:20}}>
                    <TouchableOpacity onPress={goBack}>
                        <Icon name={"ios-arrow-back"} size={28} color={"#444"} />
                    </TouchableOpacity>
                    <Text style={{color:'#444', fontSize:20}}>Playlists</Text>
                    <TouchableOpacity
                    onPress={openModal}>
                        <Icon name={"ios-add-circle-outline"} size={28} color={"#444"} />
                    </TouchableOpacity>
                </View>
              {playlists.length < 1 
            ?
            <View style={{width:'100%', height:'88%', alignItems:'center', justifyContent: 'center'}}>
                <Text style={{fontSize:24}}>No tienes playlists creadas</Text>
            </View>
            :
            <ScrollView style={{width:'100%', backgroundColor:'#D3E0EC'}}>
                {playlists.map(play => 
                    play == "songsDownloadedOnDevice" || play == "favorites__Playlist" ?
                    null
                    :
                    (
                    <TouchableOpacity onLongPress={() => openModalEdit(play)} onPress={() => addToPlaylist(play)} key={play} style={{borderBottomWidth:1, borderColor:'#ea4c89', paddingTop: 20, paddingBottom: 20, paddingLeft: 35, flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                        <Text style={{color:'#444'}}>{play}</Text>
                    </TouchableOpacity>
                    )
                )}
            </ScrollView>}
              <View style={isModalActive ? styles.modalActive : styles.modalNotActive} >
                <TouchableOpacity style={{width:'100%', height:'100%', backgroundColor:'transparent', position:'absolute', top:0, left:0, bottom:0, right:0}} onPress={closeModal}></TouchableOpacity>
                <View style={{width:'80%', height:'30%', backgroundColor:'white', zIndex:30, justifyContent:'space-around', alignItems:'center', paddingTop:15, paddingBottom:15, borderRadius:15}}>
                    <TextInput
                    onChangeText={(text) => setText(text)}
                    value={text}
                    style={{width:'85%', height: '35%', borderWidth:1, borderColor:'gray', fontSize:16, paddingLeft:10, borderRadius:50}}></TextInput>
                    <TouchableOpacity onPress={createPlaylist} style={{padding:15, width:'65%', borderRadius:50, backgroundColor:'#303F9F'}}>
                        <Text style={{color:'#444', textAlign:'center', fontSize:14}}>Create playlist</Text>
                    </TouchableOpacity>
                </View>
              </View>
            </View>
          );
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
