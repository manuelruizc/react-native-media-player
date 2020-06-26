import React, { Component } from 'react';
import { ImageBackground, View, Text } from 'react-native';

class RelatedThumbnails extends Component {
    constructor(props){
      super(props);
  
    }
    render() {
      const { styling, src, isAudioSource, item } = this.props;
      return ( 
        <ImageBackground style={styling} resizeMode={"cover"} source={src}>
          <View style={{width: '100%', height: '100%', backgroundColor:'rgba(0, 0, 0, 0.6)', paddingBottom:'6%', alignItems:'center', justifyContent:'flex-end'}}>
            <View style={{width:'90%', height: '20%', alignItems: 'center', justifyContent: 'space-between',}}>
              <Text style={{width:'100%', fontSize:16, textAlign:'center', color:'white'}} numberOfLines={1} ellipsizeMode={"tail"}>{item === null ? this.props.videoTitle : !item.customName ? this.props.videoTitle : item.customName}</Text>
              <Text style={{width:'100%', fontSize:13, textAlign:'center', color:'white', fontWeight:'bold'}} numberOfLines={1} ellipsizeMode={"tail"}>{item === null ? this.props.videoChannel : !item.customArtist ? this.props.videoChannel : item.customArtist}</Text>
            </View>
          </View>
        </ImageBackground>
      );
    }
}

export default RelatedThumbnails;