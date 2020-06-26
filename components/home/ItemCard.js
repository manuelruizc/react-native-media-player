import React, { Component } from 'react';
import {TouchableOpacity, View, ImageBackground, Text, Animated, Easing} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';



class ItemCard extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.opacityValue = new Animated.Value(0);
        this.rotate_animation = new Animated.Value(0);
    }


    render() {
        const {item, index, playSong, getVideoURI, screenProps } = this.props;
        return (
            <TouchableOpacity 
            onPress={item.isDownloaded ? () => playSong(index, item) : () => getVideoURI(item.uri, item.title, index, item.imageURI, index)}
            style={{width: '100%', height:65, flexDirection:'row', justifyContent:'flex-start', alignItems:'center',}}>
                <Animated.View
                style={{height:55, width:55, borderRadius:55, overflow: 'hidden',
                alignItems:'center', justifyContent:'center', position:'relative',
                transform: [ { rotate } ]}}>
                    <ImageBackground
                    source={{uri: item.imageURI}}
                    resizeMode='cover' style={{height:'100%', width: '100%', borderRadius:55,}}>
                    </ImageBackground>
                </Animated.View>
                <View style={{flex: 4, height:'100%', justifyContent: 'center', alignItems:'flex-start', marginLeft:8}}>
                    {screenProps.currentVideoKey == item.uri
                    ?
                    (
                    <React.Fragment>
                        <Text style={{color: '#1ACBE8', fontSize:12, marginBottom:4, fontWeight:'bold', width:'80%'}} numberOfLines={1} ellipsizeMode={"tail"}>{item.title}</Text>
                    <Text style={{color: '#1ACBE8', fontSize:12}}>{item.time}{screenProps.isLoadingSong.toString()}{(screenProps.currentVideoKey == item.uri).toString()}</Text>
                    </React.Fragment>
                    )
                    :
                    (
                    <React.Fragment>
                        <Text numberOfLines={1} ellipsizeMode={"tail"} style={{color: 'white', fontSize:12, marginBottom:4, fontWeight:'bold', width:'80%'}}>{item.title}</Text>
                        <Text style={{color: 'rgba(255, 255, 255, 0.7)', fontSize:12}}>{item.time}</Text>
                    </React.Fragment>
                    )
                    }
                </View>
            </TouchableOpacity>
        );
    }
}

export default ItemCard;