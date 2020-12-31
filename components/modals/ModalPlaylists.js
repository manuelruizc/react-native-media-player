import React, { Component } from 'react';
import { View, TouchableWithoutFeedback, Easing, Animated, Text, Image, TouchableOpacity } from 'react-native';
import Modal from './Modal';


export default (props) => {


    const deletePlaylist = () => {
        const { playlist, deletePlaylist } = props;
        deletePlaylist(playlist);
        props.closeModal();
    }

    return (
        <Modal closeModal={closeModal}>
            <View style={{width:'90%', height:'60%', backgroundColor:'white', borderRadius:13, zIndex: 4, justifyContent: 'center', alignItems: 'center',}}>
                <Image source={{uri: "https://s3-eu-west-1.amazonaws.com/malikafavre/project_thumbnails/Leftovers_thumbnail.png?mtime=1433248579"}} resizeMode={"cover"} style={{width:135, height:135, borderRadius:900, marginBottom:25}} />
                <Text style={{marginBottom:45, color:'rgba(0, 0, 0, 0.8)', fontSize:13 }}>PLAYLIST OPTIONS</Text>
                <View style={{width:'80%', height:'15%', flexDirection:'row', justifyContent: 'space-between', alignItems: 'center',}}>
                    {props.isPlaylistOptions ? 
                        null
                    :(<TouchableOpacity style={{width:'44%', height:'100%', borderRadius: 13, backgroundColor:'lightgreen',alignItems:'center', justifyContent: 'center'}}>
                    <Text style={{color:'black'}}>Edit</Text> 
                </TouchableOpacity>)
                }
                    <TouchableOpacity onPress={deletePlaylist}
                        style={{width:'44%', height:'100%', borderRadius: 13, alignItems:'center', justifyContent:'center'}}>
                        <Text style={{color:'lightsalmon'}}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
