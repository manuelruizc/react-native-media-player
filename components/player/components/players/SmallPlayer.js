import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text, Image } from 'react-native';

const { width, height } = Dimensions.get('window');

const SmallPlayer = ({
    fullscreen,
    children
}) => {
    return (
        <View style={styles.container}>
            {children}
        </View>
    );
}

export const VideoInfoContainer = ({children}) => {
    return(
        <View style={styles.playerInfo}>
            {children}
        </View>
    )
}

export const VideoTitleContainer = ({children}) => {
    return(
        <View style={styles.videoTitleContainer}>
            {children}
        </View>
    )
}

export const CurrentVideoThumbnail = ({
    source,
    resizeMode
}) => {
    return(
        <Image
            source={{uri: source}}
            resizeMode={resizeMode}
            style={styles.image}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        width,
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.83)',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems:'center',
    },
    playerInfo: {
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    image: {
        width: height * 0.14,
        height: '100%',
        marginRight: 8,
    },
    videoTitleContainer: {
        width: width * 0.5,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'flex-start',
    }
});

 
export default SmallPlayer;