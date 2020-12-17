import React from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export const PlayButton = ({onPress, isPaused}) => {

    return(
        <TouchableOpacity onPress={onPress}>
            <Animated.View style={styles.playButton}>
                <Icon
                    style={{marginLeft: isPaused ? 5 : 0}}
                    name={isPaused ? 'ios-play' : 'ios-pause'}
                    size={35}
                    color='#000000'
                />
            </Animated.View> 
        </TouchableOpacity>
    );
}

export const PlayButtonSmall = ({onPress, isPaused}) => {

    return(
        <TouchableOpacity onPress={onPress}>
            <Animated.View style={styles.PlayButtonSmall}>
                <Icon
                    style={{marginLeft: isPaused ? 5 : 0}}
                    name={isPaused ? 'ios-play' : 'ios-pause'}
                    size={32}
                    color='#FFFFFF'
                />
            </Animated.View> 
        </TouchableOpacity>
    );
}

export const NextButton = ({onPress}) => {

    return(
        <TouchableOpacity onPress={onPress}>
            <View style={styles.button}>
                <Icon
                    name='ios-skip-forward'
                    size={35}
                    color='#FFFFFF'
                />
            </View> 
        </TouchableOpacity>
    );
}

export const PrevButton = ({onPress}) => {

    return(
        <TouchableOpacity onPress={onPress}>
            <View style={styles.button}>
                <Icon
                    name='ios-skip-backward'
                    size={35}
                    color='#FFFFFF'
                />
            </View> 
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    playButton: {
        width: 60,
        height: 60,
        borderRadius: 60,
        backgroundColor: '#FFFFFF',
        justifyContent:'center',
        alignItems:'center',
    },
    PlayButtonSmall: {
        width: 60,
        height: 60,
        justifyContent:'center',
        alignItems:'center',
    },
    button: {

    }
});