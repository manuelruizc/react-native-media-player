import React, { Component } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { styles } from '../styles/MainStyles';

const screenWidth = Dimensions.get('window').width;

class MediaInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        const { item, videoChannel, videoTitle, fullscreen } = this.props;
        return (
            <View style={fullscreen ? {width: (screenWidth/100)*90, height: '7%', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8,} : styles.doNotDisplay}>
              <Text style={{width:'100%', fontSize:19, textAlign:'left', color:'snow', fontWeight:'bold',}} numberOfLines={1} ellipsizeMode={"tail"}>{item === null ? this.props.videoTitle : !item.customName ? this.props.videoTitle : item.customName}</Text>
              <Text style={{width:'100%', fontSize:13, textAlign:'left', color:'rgba(255, 255, 255, 0.5)',}} numberOfLines={1} ellipsizeMode={"tail"}>{item === null ? this.props.videoChannel : !item.customArtist ? this.props.videoChannel : item.customArtist}</Text>
            </View>
        );
    }
}
 
export default MediaInfo;