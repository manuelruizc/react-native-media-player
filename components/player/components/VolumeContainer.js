import React, { Component } from 'react';
import { View, } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import VolumeControl, {
    VolumeControlEvents
} from "react-native-volume-control";
import Slider from 'react-native-slider';
import { styles } from '../styles/MainStyles'

class VolumeContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            volume: 0,
        }
    }

    async componentDidMount() {
        this.setState({
            volume: await VolumeControl.getVolume(),
        });
        this.volEvent = VolumeControlEvents.addListener(
        "VolumeChanged",
        this.volumeEvent
        );
    }

    componentWillUnmount() {
        this.volEvent.remove();
    }

    volumeEvent = event => {
        this.setState({ volume: event.volume });
    };
  
    sliderChange = (value) => {
        VolumeControl.change(value);
    }

    render() { 
        const { fullscreen } = this.props;
        const { volume } = this.state;
        return (
        <View style={fullscreen ? styles.fullscreenVolumeContainer : styles.doNotDisplay}>
            <Icon name={"ios-volume-mute"} size={25} color={"white"} />
            <Slider
            style={{width:'80%',}}
            maximumValue={1}
            minimumValue={0}
            step={0.06666666666666667}
            thumbTintColor={"snow"}
            minimumTrackTintColor='snow'
            maximumTrackTintColor='rgba(255, 255, 255, 0.25)'
            trackStyle={{width:'100%', height:'7%'}}
            value={volume}
            onValueChange={this.sliderChange}
            />
            <Icon name={"ios-volume-high"} size={25} color={"white"} />
        </View>
        );
    }
}

export default VolumeContainer;