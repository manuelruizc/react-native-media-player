import React, { Component } from 'react';
import { View, TouchableWithoutFeedback, TextInput, Animated, Text, Image, TouchableOpacity, AsyncStorage } from 'react-native';
import Modal from './Modal';

class EditSong extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentArtist: "",
            currentSong: "",
            currentURI: "",
        }
    }

    closeModal = () => {
        this.props.closeModal();
    }

    componentDidMount() {
        const { item } = this.props;
        const artist = !item.customArtist ? item.channel : item.customArtist;
        const song = !item.customName ? item.title : item.customName;
        this.setState({currentArtist: artist, currentSong: song, currentURI: item.uri});
    }

    saveSong = async () => {
        try {
            const { currentArtist, currentSong, currentURI } = this.state;
            let songs = await AsyncStorage.getItem("Songs");
            console.log(songs)
            songs = JSON.parse(songs);
            const self = this;

            songs.forEach(song => {
                if(song.uri === self.state.currentURI) {
                    if(currentSong != "")
                        song.customName = currentSong;
                    if(currentArtist != "")
                        song.customArtist = currentArtist;
                }
            });

            this.props.addToAllSongs(songs);
            songs = JSON.stringify(songs);

            AsyncStorage.setItem("Songs", songs);

            //  this.props.loadSongs();
            this.closeModal()
        }
        catch(e) {
            console.log(e)
        }
    }

    render() { 
        return (
            <Modal closeModal={this.closeModal}>
                <View style={{width:'90%', height:'60%', backgroundColor:'white', borderRadius:13, zIndex: 4, justifyContent: 'center', alignItems: 'center',}}>
                    <Image source={{uri: "https://s3-eu-west-1.amazonaws.com/malikafavre/project_thumbnails/Leftovers_thumbnail.png?mtime=1433248579"}} resizeMode={"cover"} style={{width:40, height:40, borderRadius:900, marginBottom:15}} />
                    <View style={{width:'80%', height:'35%', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20}}>
                        <TextInput onChangeText={(text) => this.setState({currentSong: text})}
                        value={this.state.currentSong}
                        style={{width:'100%', height:'48%', fontSize:14}} placeholder="Custom song name" />
                        <TextInput onChangeText={(text) => this.setState({currentArtist: text})}
                        value={this.state.currentArtist}
                        style={{width:'100%', height:'48%', fontSize:14}} placeholder="Custom artist name" />
                    </View>
                    <View style={{width:'80%', height:'15%', flexDirection:'row', justifyContent: 'space-between', alignItems: 'center',}}>
                        <TouchableOpacity onPress={this.saveSong}
                         style={{width:'44%', height:'100%', borderRadius: 13, backgroundColor:'lightgreen',alignItems:'center', justifyContent: 'center'}}>
                            <Text style={{color:'black'}}>Guardar</Text> 
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.closeModal}
                         style={{width:'44%', height:'100%', borderRadius: 13, alignItems:'center', justifyContent:'center'}}>
                            <Text style={{color:'lightsalmon'}}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }
}
 
export default EditSong;