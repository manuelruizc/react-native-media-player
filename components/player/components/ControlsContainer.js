import React, { Component } from 'react';
import { View, TouchableOpacity, Text, TouchableWithoutFeedback, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from '../styles/MainStyles';
import { convertMinsSecs } from '../../../helpers/snippets';

class ControlsContainer  extends Component {
    constructor(props) {
      super(props);
      this.state = {

      }
    }
    render() {
      const { fullscreen } = this.props;
      return (
        <View
        style={fullscreen ?
        styles.fullScreenControlsContainerFullScreen :
        styles.fullScreenControlsContainer }>
          <View style={fullscreen ? styles.doNotDisplay
            : {flexDirection:'row', alignItems:'center', justifyContent:'flex-start', width:'75%',}}>
            <TouchableOpacity onPress={!fullscreen ? this.props.toggleFullScreen : null}>
              <View style={fullscreen ? styles.doNotDisplay : {width: '100%', height:'100%', alignItems:'flex-start', justifyContent:'center'}}>
                <Text 
                style={{fontSize:14, fontWeight: '400', color:"#FFFFFF", marginBottom:4}}
                numberOfLines={1}
                ellipsizeMode={"tail"}>{this.props.item === null ? this.props.videoTitle : !this.props.item.customName ? this.props.videoTitle : this.props.item.customName}</Text>
                <Text 
                style={{fontSize:14, fontWeight:'100', color:'#FFFFFF'}}>{`${convertMinsSecs(this.props.currentTime*1000, this.props.currentTime)}`} / {`${convertMinsSecs(this.props.duration*1000, this.props.duration)}`}</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={fullscreen ? {flexDirection:'row', alignItems:'center', justifyContent:'space-between', width:'100%', marginTop:50} : {flexDirection:'row', alignItems:'center', justifyContent:'space-between', width:'10%', marginLeft: 19}}>
            {/* <TouchableOpacity style={fullscreen ? {display: 'flex'} : {display:'none'}} onPress={isFavorited ? () => this.deleteFromPlaylist() : () => this.addToPlaylist()} >
                <Icon name={"ios-heart"} size={25} color={isFavorited ? 'tomato' : "#FFFFFF"} style={{padding:10}} />
            </TouchableOpacity> */}
            <TouchableOpacity onPress={this.props.prevSong}>
                <Icon name={"ios-skip-backward"} size={fullscreen ? 25 : 30} color={"#FFFFFF"} style={fullscreen ? {padding:10} : {display:'none'}} />
            </TouchableOpacity> 
            <TouchableOpacity style={fullscreen ? {display: 'flex'} : {display:'none'}} onPress={() => this.props.seekSong(-5)} >
                <Icon name={"ios-rewind"} size={35} color={"#FFFFFF"} style={{padding:10}} />
            </TouchableOpacity> 
            <TouchableWithoutFeedback onPressOut={this.props.playPause} onPressIn={this.props._animOnPressIn}>
                <Animated.View style={{justifyContent: 'center', alignItems: 'center', transform: [{scale: this.props.animatedValue}], width: fullscreen ? 65 : 35, height: fullscreen ? 65 : 35, borderRadius: 35, backgroundColor: 'snow',}}>
                  <Icon name={this.props.isPaused ? "ios-play" : "ios-pause"} size={fullscreen ? 40 : 18} color={"rgba(0, 0, 0, 0.8)"} style={{marginLeft: fullscreen ? !this.props.isPaused ? 0 : 4 : !this.props.isPaused ? 0 : 2}} />
                </Animated.View>
            </TouchableWithoutFeedback> 
            <TouchableOpacity style={fullscreen ? {display: 'flex'} : {display:'none'}} onPress={() => this.props.seekSong(5)} >
                <Icon name={"ios-rewind"} size={35} color={"#FFFFFF"} style={{padding:10, transform: [{rotate: '180deg'}]}} />
            </TouchableOpacity> 
            <TouchableOpacity onPress={this.props.nextSong} >
                <Icon name={"ios-skip-forward"} size={fullscreen ? 25 : 30} color={"#FFFFFF"} style={fullscreen ? {padding:10} : {display:'none'}} />
            </TouchableOpacity>
            {/* <TouchableOpacity style={fullscreen ? {display: 'flex'} : {display:'none'}} onPress={() => this.seekSong(-5)} >
                <Icon name={"ios-bookmark"} size={25} color={"#FFFFFF"} style={{padding:10}} />
            </TouchableOpacity> */}
          </View>
      </View>
      );
    }
}

export default ControlsContainer;