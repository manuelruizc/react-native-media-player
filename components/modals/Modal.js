import React, { Component } from 'react';
import { Animated, View, TouchableWithoutFeedback } from 'react-native';


class Modal extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
        this.animated_value = new Animated.Value(0);
    }

    componentDidMount() {
        Animated.timing(this.animated_value, {
            toValue: 1,
            duration: 670,
        }).start();
    }

    closeModal = () => {
        Animated.timing(this.animated_value, {
            toValue: 0,
            duration: 670,
        }).start(() => {
            this.props.closeModal();
        });
    }

    render() {
        const translateY = this.animated_value.interpolate({
            inputRange:[0, 1],
            outputRange: [1000, 0],
            extrapolate: 'clamp',
        });
        const backgroundColor = this.animated_value.interpolate({
            inputRange: [0, 0.8, 1],
            outputRange: ['rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0.75)'],
        });

        return (
        <Animated.View
            style={{zIndex: 2, width: '100%', height: '100%', backgroundColor:'rgba(0,0,0,0.75)',
            position:'absolute', top:0, left:0,}}
        >
            <TouchableWithoutFeedback onPress={this.closeModal}>
                <View style={{width:'100%', height: '100%', position:'absolute', top: 0, left:0, zIndex: 3}}></View>
            </TouchableWithoutFeedback>
            <Animated.View style={{justifyContent: 'center', alignItems: 'center', width:'100%', height:'100%', transform:[{translateY}]}}>
                {this.props.children}
            </Animated.View>
        </Animated.View>
        );
    }
}
 
export default Modal;