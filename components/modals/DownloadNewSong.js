import React, { Component } from 'react';
import { View, TouchableWithoutFeedback, TextInput, Animated, Text, Image, TouchableOpacity } from 'react-native';
import Modal from './Modal';

class DownloadNewSong extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentArtist: "",
            currentSong: ""
        }
    }

    closeModal = () => {
        this.props.closeModal();
    }

    downloadSong = () => {
        const { item, downloadSong } = this.props;
        const { currentArtist, currentSong } = this.state;
        downloadSong(item, currentArtist, currentSong);
        this.props.closeModal();
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
                        <TouchableOpacity onPress={this.downloadSong}
                         style={{width:'44%', height:'100%', borderRadius: 13, backgroundColor:'lightgreen',alignItems:'center', justifyContent: 'center'}}>
                            <Text style={{color:'black'}}>Descargar</Text> 
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
 
export default DownloadNewSong;