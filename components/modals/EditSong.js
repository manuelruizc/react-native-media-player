import React, { useEffect, useState } from 'react';
import { View, TouchableWithoutFeedback, TextInput, Animated, Text, Image, TouchableOpacity, AsyncStorage } from 'react-native';
import Modal from './Modal';

export default (props) => {
    const [currentArtist, setCurrentArtist] = useState('');
    const [currentSong, setCurrentSong] = useState('');
    const [currentURI, setCurrentURI] = useState('');
    
    const closeModal = () => {
        props.closeModal();
    }

    useEffect(() => {
        const { item } = props;
        const artist = !item.customArtist ? item.channel : item.customArtist;
        const song = !item.customName ? item.title : item.customName;
        setCurrentArtist(artist);
        setCurrentSong(song);
        setCurrentURI(item.uri);
    }, []);

    const saveSong = async () => {
        try {
            let songs = await AsyncStorage.getItem("Songs");
            songs = JSON.parse(songs);
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
            closeModal()
        }
        catch(e) {
            console.error(e)
        }
    }

    return (
        <Modal closeModal={closeModal}>
            <View style={{width:'90%', height:'60%', backgroundColor:'white', borderRadius:13, zIndex: 4, justifyContent: 'center', alignItems: 'center',}}>
                <Image source={{uri: "https://s3-eu-west-1.amazonaws.com/malikafavre/project_thumbnails/Leftovers_thumbnail.png?mtime=1433248579"}} resizeMode={"cover"} style={{width:40, height:40, borderRadius:900, marginBottom:15}} />
                <View style={{width:'80%', height:'35%', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20}}>
                    <TextInput onChangeText={(text) => setCurrentSong(text)}
                    value={currentSong}
                    style={{width:'100%', height:'48%', fontSize:14}} placeholder="Custom song name" />
                    <TextInput onChangeText={(text) => setCurrentArtist(text)}
                    value={currentArtist}
                    style={{width:'100%', height:'48%', fontSize:14}} placeholder="Custom artist name" />
                </View>
                <View style={{width:'80%', height:'15%', flexDirection:'row', justifyContent: 'space-between', alignItems: 'center',}}>
                    <TouchableOpacity onPress={saveSong}
                        style={{width:'44%', height:'100%', borderRadius: 13, backgroundColor:'lightgreen',alignItems:'center', justifyContent: 'center'}}>
                        <Text style={{color:'black'}}>Save</Text> 
                    </TouchableOpacity>
                    <TouchableOpacity onPress={closeModal}
                        style={{width:'44%', height:'100%', borderRadius: 13, alignItems:'center', justifyContent:'center'}}>
                        <Text style={{color:'lightsalmon'}}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}