import React, { Component } from 'react';
import { View, TouchableWithoutFeedback, Easing, Animated, Text, Image, TouchableOpacity } from 'react-native';
import Modal from './Modal';


class ModalPlaylists extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    componentDidMount() {
        this.animatedValue1 = new Animated.Value(0);

        Animated.timing(this.animatedValue1, {
            toValue: 1,
            duration: 5000,
            easing: Easing.bounce
        }).start()
    }

    closeModal = () => {
        Animated.timing(this.animatedValue1, {
            toValue: 0,
            duration: 1000,
            easing: Easing.bounce
        }).start();
        setTimeout(() => true, 1000);

        this.props.closeModal()   
    }

    deletePlaylist = () => {
        const {playlist, deletePlaylist} = this.props;
        deletePlaylist(playlist);
        this.props.closeModal();
    }

    render() { 
        return (
            <Modal closeModal={this.closeModal}>
                <View style={{width:'90%', height:'60%', backgroundColor:'white', borderRadius:13, zIndex: 4, justifyContent: 'center', alignItems: 'center',}}>
                    <Image source={{uri: "https://s3-eu-west-1.amazonaws.com/malikafavre/project_thumbnails/Leftovers_thumbnail.png?mtime=1433248579"}} resizeMode={"cover"} style={{width:135, height:135, borderRadius:900, marginBottom:25}} />
                    <Text style={{marginBottom:45, color:'rgba(0, 0, 0, 0.8)', fontSize:13 }}>¿QUÉ DESEAS HACER?</Text>
                    <View style={{width:'80%', height:'15%', flexDirection:'row', justifyContent: 'space-between', alignItems: 'center',}}>
                        {this.props.isPlaylistOptions ? 
                         null
                        :(<TouchableOpacity style={{width:'44%', height:'100%', borderRadius: 13, backgroundColor:'lightgreen',alignItems:'center', justifyContent: 'center'}}>
                        <Text style={{color:'black'}}>Editar</Text> 
                    </TouchableOpacity>)
                    }
                        <TouchableOpacity onPress={this.deletePlaylist}
                         style={{width:'44%', height:'100%', borderRadius: 13, alignItems:'center', justifyContent:'center'}}>
                            <Text style={{color:'lightsalmon'}}>Eliminar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }
}
 
export default ModalPlaylists;