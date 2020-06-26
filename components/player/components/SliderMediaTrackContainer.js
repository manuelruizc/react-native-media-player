import React, { Component } from 'react';
import { View, Text, Dimensions, } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Slider from 'react-native-slider';
import { styles } from '../styles/MainStyles';
import { convertMinsSecs } from '../../../helpers/snippets';

const screenWidth = Dimensions.get('window').width;

class SliderMediaTrackContainer extends Component {
    constructor(props) {
      super(props);
      this.state = {  }
    }
  
    
    render() {
      const { fullscreen, slidingActive, currentTimeWhenSliding, } = this.props;
      return (
        <View style={fullscreen ? {width: (screenWidth/100)*90, marginBottom:0, justifyContent: 'center', alignItems: 'center',} : styles.doNotDisplay}>
          <Slider
          style={{width:'100%', marginBottom: 0}}
          maximumValue={this.props.duration} // state
          minimumValue={0}
          value={slidingActive ? currentTimeWhenSliding : this.props.currentTime} // state
          onValueChange={this.props.updateInfoTime} // function props
          step={1}
          thumbTintColor={"snow"}
          minimumTrackTintColor='snow'
          maximumTrackTintColor='rgba(255, 255, 255, 0.25)'
          trackStyle={{width:'100%'}}
          onSlidingComplete={this.props.onSlidingComplete} // function props
          onSlidingStart={this.props.onSlidingStart} // function props
          />
          <View style={fullscreen ? {width: (screenWidth/100)*90,flexDirection: 'row', alignItems:'center', justifyContent: 'space-between',} : styles.doNotDisplay}>
            <Text style={{color:'rgba(255, 255, 255, 0.6)', fontSize:14, fontWeight: 'bold'}}>{slidingActive ? convertMinsSecs(currentTimeWhenSliding*1000, currentTimeWhenSliding) : convertMinsSecs(this.props.currentTime*1000, this.props.currentTime)}</Text>
            <Text style={{color:'rgba(255, 255, 255, 0.6)', fontSize:14, fontWeight: 'bold'}}>{convertMinsSecs(this.props.duration*1000, this.props.duration)}</Text>
          </View>
        </View>
      );
    }
}

export default SliderMediaTrackContainer;