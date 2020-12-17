import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('screen');

export const Title = ({children}) => <Text numberOfLines={1} ellipsizeMode={"tail"} style={styles.title}>{children}</Text>

export const TitleSmall = ({children}) => <Text numberOfLines={1} ellipsizeMode={"tail"} style={styles.titleSmall}>{children}</Text>

export const Artist = ({children}) => <Text numberOfLines={1} ellipsizeMode={"tail"} style={styles.artist}>{children}</Text>

export const ArtistSmall = ({children}) => <Text numberOfLines={1} ellipsizeMode={"tail"} style={styles.artistSmall}>{children}</Text>

export const SongInfoContainer = ({children}) => <View style={styles.songInfoContainer}>{children}</View>

export const InfoBar = ({children}) => <View style={styles.infoBar}>{children}</View>

export const InfoBarOptions = ({children}) => <View style={styles.infoBarOptions}>{children}</View>

const styles = StyleSheet.create({
    songInfoContainer: {
        width: (width/100)*90,
        height: '7%',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8
    },
    title: {
        width:'100%',
        fontSize:19,
        textAlign:'left',
        color:'#FFFFFF',
        fontWeight:'bold'
    },
    artist: {
        width:'100%',
        fontSize:13,
        textAlign:'left',
        color:'rgba(255, 255, 255, 0.6)'
    },
    titleSmall: {
        width:'100%',
        fontSize:12,
        textAlign:'left',
        color:'#FFFFFF',
        fontWeight:'bold'
    },
    artistSmall: {
        width:'100%',
        fontSize:10,
        textAlign:'left',
        color:'rgba(255, 255, 255, 0.6)'
    }
});