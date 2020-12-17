import React, { Component } from 'react';
import {TouchableOpacity, View, Image, Text, Animated, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from '../styles/HomeStyles'

const { width } = Dimensions.get('screen');



class ItemCard extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.opacityValue = new Animated.Value(0);
        this.rotate_animation = new Animated.Value(0);
    }



    render() {
        const {item, index, playSong, getVideoURI, screenProps, downloadingVideoKey, playPause } = this.props;
        const isCurrentSong = screenProps.currentVideoKey === item.uri;
        return (
            <TouchableOpacity 
                onPress={isCurrentSong ? () => playPause() : item.isDownloaded ? () => playSong(index, item) : () => getVideoURI(item.uri, item.title, index, item.imageURI, index)}
                style={{flex: 4, height:65, flexDirection:'row', justifyContent:'flex-start', alignItems:'center',}}
            >
                <Image
                    source={{uri: item.imageURI}}
                    resizeMode='cover'
                    style={styles.imageURI}
                />
                <View style={{flex: 4, height:'100%', justifyContent: 'center', alignItems:'flex-start', marginLeft:8}}>
                    {screenProps.currentVideoKey == item.uri
                    ?
                    (
                    <React.Fragment>
                        <Text style={styles.videoTitle} numberOfLines={1} ellipsizeMode={"tail"}>{item.title}</Text>
                        <View style={{flexDirection:'row', justifyContent: 'flex-start', alignItems:'center'}}>
                            <Text style={{color: '#ea4c89', fontSize:12,}}>{item.time}</Text>
                            {downloadingVideoKey.includes(item.uri) &&
                            (<View style={{justifyContent:'center', alignItems:'center', paddingTop: 3, paddingBottom:3, paddingLeft: 5, paddingRight: 5, backgroundColor: '#222', borderRadius: 100, color:'white', fontSize: 12, marginLeft: 8}}>
                                <Text style={{color:'white', fontSize: 10}}>Downloading</Text>
                            </View>)}
                        </View>
                    </React.Fragment>
                    )
                    :
                    (
                    <React.Fragment>
                        <Text numberOfLines={1} ellipsizeMode={"tail"} style={{color: '#444', fontSize:12, marginBottom:4, fontWeight:'bold', width:'80%'}}>{item.title}</Text>
                        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                            <Text style={{color: '#456', fontSize:12}}>{item.time}</Text>
                            {downloadingVideoKey.includes(item.uri) &&
                            (<View style={{justifyContent:'center', alignItems:'center', paddingTop: 3, paddingBottom:3, paddingLeft: 5, paddingRight: 5, backgroundColor:'#222', borderRadius: 100, color:'white', fontSize: 12, marginLeft: 8}}>
                               <Text style={{color:'white', fontSize:10}}>Downloading</Text>
                            </View>)}
                        </View>
                    </React.Fragment>
                    )
                    }
                </View>
            </TouchableOpacity>
        );
    }
}

export default ItemCard;