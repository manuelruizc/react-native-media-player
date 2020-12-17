import React, { useState } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const MusicPlayer = () => {
    const [isFullscreenActive, setFullscreenState] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [currentTimeWhenSliding, setCurrentTimeWhenSliding] = useState(0);
    const [isSliding, setSlidingState] = useState(false);
    const [duration, setDuration] = useState(0);
    const [timeAvailable, setTimeAvailibilityState] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [volume, setVolume] = useState(0);
    const [lastIndex, setLastIndex] = useState(0);
    const [isFavorited, setIsFavorited] = useState(false);
    
    return (
        <View>

        </View>
    );
}
 
export default MusicPlayer;