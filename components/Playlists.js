import React, { Component } from 'react';
import {View, BackHandler, ActivityIndicator, Text, RefreshControl, AsyncStorage, ToastAndroid, StyleSheet, TouchableOpacity, TextInput, ScrollView, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import OptionsMenu from 'react-native-options-menu';
import NetInfo from "@react-native-community/netinfo";
import ModalPlaylists from './modals/ModalPlaylists';
import {debounce} from 'lodash';


class Playlists extends Component {
    constructor(props) {
        super(props);

        this.state = {
            playlists: [],
            displayPlaylists: [],
            searchPlaylistText: "",
            songs:[],
            isModalActive: false,
            text: "",
            refreshing: false,
            isConnected: true,
            isLoadingLocalStorage: true,
            images: [
                "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
                "https://images.unsplash.com/photo-1513829596324-4bb2800c5efb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
                "https://images.unsplash.com/photo-1507838153414-b4b713384a76?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
                "https://images.unsplash.com/photo-1525362081669-2b476bb628c3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80",
                "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
                "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
            ],
            modalOpen: false,
            currentPL: ""
        }
    }

    componentDidMount() {
        NetInfo.getConnectionInfo().then(data => {
            if(data.type == "unknown" || data.type == "cellular") {
              this.setState({isConnected: false});
            }
          });

        const self = this;
        AsyncStorage.multiGet(["Playlists", "Songs"], (err, stores) => {
            stores.forEach((store, index) => {
                const JSONified = JSON.parse(store[1]);
                if(JSONified != null) {
                    if(index == 0) {
                      let playlists = JSONified.filter(json => json != "songsDownloadedOnDevice");
                      console.log(playlists)
                      self.setState({playlists, displayPlaylists: playlists})
                    }
                    else if(index == 1) {
                        self.setState({songs:JSONified})
                    }
                }
                console.log('Arbeloa');
                console.log(JSONified)
            });
            self.setState({isLoadingLocalStorage: false});
        });

        BackHandler.addEventListener('hardwareBackPress', this.backButtonAction);
        
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.backButtonAction);
    }

    getPlaylistBackground = (playlistName) => {
        const { songs } = this.state;
        let response = false;
        for(let i = 0; i < songs.length; i++) {
            if(songs[i].playlist.indexOf(playlistName) != -1) {
                response = songs[i].imageURI;
                break;
            }
        }

        return response;
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

    _onRefresh = () => {
      const self = this;
      this.setState({refreshing:true});
        AsyncStorage.multiGet(["Playlists", "Songs"], (err, stores) => {
            stores.forEach((store, index) => {
                const JSONified = JSON.parse(store[1]);
                if(JSONified != null) {
                    if(index == 0) {
                      let playlists = JSONified.filter(json => json != "songsDownloadedOnDevice");
                      console.log(playlists)
                      self.setState({playlists, displayPlaylists: playlists})
                    }
                    else if(index == 1) {
                        self.setState({songs:JSONified})
                    }
                }
                self.setState({refreshing:false})
            });
        });
    }

    closeModalEdit = () => {
        this.setState({modalOpen: false});
    }

    openModalEdit = (play) => {
        this.setState({modalOpen: true, currentPL: play});
    }

    crunch = () => {
        ToastAndroid.showWithGravity(
            `LongPress`,
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
        );
    }

    searchPlaylist = debounce((payload) => {
        const { playlists, displayPlaylists } = this.state;
        if(playlists.length > 0) {
            let filteredArray = playlists.filter((play) => play.match(payload));
            this.setState({ displayPlaylists: filteredArray})
        }
    }, 700);

    render() {
        const { navigation } = this.props;
        const item = navigation.getParam('item', 'ERROR');
        const myIcon = (<Icon name={"ios-more"} size={25} color={"#444"} style={{padding:12}} />)
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', backgroundColor: '#D3E0EC' }}>
            {this.state.modalOpen ? (<ModalPlaylists deletePlaylist={this.deletePlaylist} playlist={this.state.currentPL} closeModal={this.closeModalEdit} />) : false}
            <View style={{width:'100%', height:'10%', flexDirection:'row', alignItems:'center', justifyContent:'flex-start'}}>
                <View style={{width:'10%', height:'100%', alignItems:'center', justifyContent:'center'}}>
                    <Icon name={"ios-search"} size={20} color={"#444"} />
                </View>
                <TextInput
                    onChangeText={(text) => {
                        this.setState({searchPlaylistText:text});
                        this.searchPlaylist(text);
                    }
                    }
                    placeholder={"Search playlist"}
                    placeholderTextColor={"#444"}
                    value={this.state.searchPlaylistText}
                    style={{width:'90%', height:'100%', color:'#444'}} />
            </View>
            <View style={{width:'100%', height:'14%', flexDirection:'row', alignItems:'flex-end', justifyContent:'space-between', paddingLeft:'5%', paddingRight:'5%',}}>
                <View>
                    <Text style={{color:'#444', marginBottom:10, fontSize:13, fontWeight:'bold'}}>PLAYLISTS</Text>
                    <Text style={{color:'#444', fontSize:20, marginBottom:10}}>Your playlists</Text>
                </View>
                <TouchableOpacity
                style={{marginBottom:10}}
                onPress={this.openModal}
                >
                    <Icon name={"ios-add-circle-outline"} size={28} color={"white"} />
                </TouchableOpacity>
            </View>
          {this.state.isLoadingLocalStorage ?
          (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
          )
        :
        this.state.playlists.length < 1 
        ?
        <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }
        style={{width:'100%', height:'88%',}}>
            <Text style={{fontSize:24, flex:1, width:'100%', marginTop: '75%', textAlign:'center'}}>No tienes playlists creadas</Text>
        </ScrollView>
        :
        <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }
        style={{width:'100%', backgroundColor:'#D3E0EC'}}>
            {this.state.displayPlaylists.map((play, index) => 
                play == "songsDownloadedOnDevice" ?
                null
                :
                (
                <TouchableOpacity onLongPress={() => this.openModalEdit(play)} onPress={() => this.props.navigation.navigate('PlaylistSongs', {key: play, comeFrom: 'Playlists'})} key={play} style={{backgroundColor:'#1A237E', width:'90%', marginLeft:'5%', height: 110, borderRadius: 13, overflow:'hidden', marginBottom:12, marginTop:12}}>
                    <ImageBackground style={{width:'100%', height:'100%'}} resizeMode={"cover"} source={{uri: play === "favorites__Playlist" ? this.state.images[index%this.state.images.length] : this.getPlaylistBackground(play) ? this.getPlaylistBackground(play) : this.state.images[index%this.state.images.length]}} >
                        <View style={{width:'100%', height:'100%', backgroundColor: 'rgba(234,76,137, 0.45)', position: 'absolute'}}>
                            <Text style={{color:'white', fontSize:24, position:'absolute', top:10, left:20, fontWeight:'bold'}}>{play === "favorites__Playlist" ? "FAVORITES" :play.toUpperCase()}</Text>
                        </View>
                    </ImageBackground>
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
                    <Text style={{color:'white', textAlign:'center', fontSize:14}}>Crear playlist</Text>
                </TouchableOpacity>
            </View>
          </View>
          {!this.props.screenProps.appIsConnected
          ?
        (<Text style={{width:'100%', backgroundColor:'red', color:'white', textAlign:'center'}}>Sin conexión a internet</Text>) : null}
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
                    console.log("palylsit")
                    console.log(jsonPlaylists)
                    jsonPlaylists = jsonPlaylists.filter(j => j != key);
                    console.log(jsonPlaylists)
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
                  this.setState({playlists: JSON.parse(jsonPlaylists), displayPlaylists: JSON.parse(jsonPlaylists)});
            });
        });
    }

    openModal = () => {
        this.setState({isModalActive: true})
    
    }
    closeModal = () => {
        this.setState({isModalActive: false})
    }

    addToPlaylist = async (key) => {
        console.log(key)
        const item = this.props.navigation.getParam('item', 'ERROR');
        console.log(item)
        const {channel, title, uri, time} = item;
        const songObject = {playlist: [key], channel, title, uri, time, path: "", isDownloaded: false};
        const self  = this;
        if(item != 'ERROR') {
            try {
                await AsyncStorage.getItem("Songs")
                .then(response => {
                    if(response != null) {
                        let songs = JSON.parse(response);
                        let isSavedAlready = false;
                        let newSongsArray = songs.map(song => {
                            if(song.uri == songObject.uri && !song.playlist.includes(key)) {
                                song.playlist.push(key);
                                isSavedAlready = true;
                                return song;
                            }
                            else if(song.uri == songObject.uri && song.playlist.includes(key)) {
                                isSavedAlready = true;
                                return song;
                            }
                            else {
                                return song;
                            }
                        });

                        if(!isSavedAlready) newSongsArray.push(songObject);
                        console.log(newSongsArray)
                        this.props.screenProps.setLocalePlaylist(newSongsArray);
                        self.props.screenProps.addToAllSongs(newSongsArray);
                        songs = JSON.stringify(newSongsArray);
                        AsyncStorage.setItem("Songs", songs)
                        .then(response => {
                            console.log(response)
                            console.log("Sooooongs")
                            console.log(songs);
                            ToastAndroid.showWithGravity(
                                `Song added to playlist`,
                                ToastAndroid.SHORT,
                                ToastAndroid.CENTER,
                              );
                            this.props.navigation.goBack()
                        })
                        .catch(error => console.log(error))
                    }
                    else {
                        let songs = [songObject];
                        songs = JSON.stringify(songs);
                        AsyncStorage.setItem("Songs", songs)
                        .then(response => {
                            console.log(response)
                            ToastAndroid.showWithGravity(
                                `Song added to playlist`,
                                ToastAndroid.SHORT,
                                ToastAndroid.CENTER,
                              );
                            this.props.navigation.goBack()
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
                self.setState({playlists, displayPlaylists: playlists})
                playlists = JSON.stringify(playlists);
                console.log(playlists)
                await AsyncStorage.setItem("Playlists", playlists)
                .then(response => {
                    self.setState({text: "", isModalActive: false})
                })
                .catch(error => console.log(error));
            }
            else {
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

export default Playlists;