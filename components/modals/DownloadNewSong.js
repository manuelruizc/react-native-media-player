import React, { useState } from 'react';
import { View, TouchableWithoutFeedback, TextInput, Animated, Text, Image, TouchableOpacity } from 'react-native';
import Modal from './Modal';

export default (props) => {
    const [currentArtist, setCurrentArtist] = useState('');
    const [currentSong, setCurrentSong] = useState('');

    const closeModal = () => {
        props.closeModal();
    }

    const downloadSong = () => {
        const { item, downloadSong } = props;
        downloadSong(item, currentArtist, currentSong);
        props.closeModal();
    }

    return (
        <Modal closeModal={props.closeModal}>
            <View style={{width:'90%', height:'60%', backgroundColor:'white', borderRadius:13, zIndex: 100000000, justifyContent: 'center', alignItems: 'center',}}>
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
                    <TouchableOpacity onPress={downloadSong}
                        style={{width:'44%', height:'100%', borderRadius: 13, backgroundColor:'lightgreen',alignItems:'center', justifyContent: 'center'}}>
                        <Text style={{color:'black'}}>Download</Text> 
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