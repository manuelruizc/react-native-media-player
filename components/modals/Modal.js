import React, { Component, useEffect, useRef } from 'react';
import { Animated, View, TouchableWithoutFeedback } from 'react-native';



export default (props) => {
    const animated_value = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animated_value, {
            toValue: 1,
            duration: 450,
        }).start();
    }, []);

    const closeModal = () => {
        Animated.timing(animated_value, {
            toValue: 0,
            duration: 450,
        }).start(() => {
            props.closeModal();
        });
    }

    const translateY = animated_value.interpolate({
        inputRange:[0, 1],
        outputRange: [1000, 0],
        extrapolate: 'clamp',
    });
    const backgroundColor = animated_value.interpolate({
        inputRange: [0, 0.8, 1],
        outputRange: ['rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0.75)'],
    });

    return (
        <Animated.View
            style={{zIndex: 10, width: '100%', height: '100%', backgroundColor:'rgba(0,0,0,0.75)',
            position:'absolute', top:0, left:0,}}
        >
            <TouchableWithoutFeedback onPress={closeModal}>
                <View style={{width:'100%', height: '100%', position:'absolute', top: 0, left:0, zIndex: 0}}></View>
            </TouchableWithoutFeedback>
            <Animated.View style={{justifyContent: 'center', zIndex: 100000000, alignItems: 'center', width:'100%', height:'100%', transform:[{translateY}]}}>
                {props.children}
            </Animated.View>
        </Animated.View>
    );
}
