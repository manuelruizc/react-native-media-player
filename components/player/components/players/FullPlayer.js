/* eslint-disable prettier/prettier */
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";

const { width, height } = Dimensions.get("screen");
const fullscreenActive = [
  {
    translateY: 0,
  },
];
const fullscreenUnactive = [
  {
    translateY: width,
  },
];

const FullPlayer = ({
  searchListStatus,
  item,
  currentPlaylistName,
  fullscreen,
  relatedVideos,
  playlistSaved,
  children,
}) => {
  // let animValue = new Animated.Value(height);
  // const goUp = new Animated.Value(0);
  // let listOfVideos = searchListStatus ? relatedVideos : playlistSaved;
  // useEffect(() => {
  //     listOfVideos = searchListStatus ? relatedVideos : playlistSaved;
  //     if(!searchListStatus && listOfVideos.length > 0 && currentPlaylistName != 'songsDownloadedOnDevice' && currentPlaylistName != "searchbar") {

  //         listOfVideos = listOfVideos.filter(video => video.playlistsIndex != undefined && video.playlistsIndex[currentPlaylistName] != undefined);

  //         listOfVideos.sort(function(a, b) {
  //           return a.playlistsIndex[currentPlaylistName] - b.playlistsIndex[currentPlaylistName];
  //         });
  //       }
  // }, [searchListStatus]);

  // useEffect(() => {
  //     timing({
  //         duration: 1000,
  //         from: fullscreen ? height : -(height - (height / 4)),
  //         to: fullscreen ? -(height - (height / 4)) : height,
  //         easing: Easing.linear,
  //     });
  // }, [fullscreen]);

  const onScroll = () => {};

  return (
    <View
      style={[
        styles.container,
        fullscreen ? fullscreenActive : fullscreenUnactive,
      ]}
    >
      {children}
    </View>
  );
};

const Title = ({ text }) => <Text style={styles.title}>{text}</Text>;
const Artist = ({ text }) => <Text style={styles.artist}>{text}</Text>;
const SongInfoContainer = ({ children }) => (
  <View style={styles.songInfoContainer}>{children}</View>
);
const InfoBar = ({ children }) => (
  <View style={styles.infoBar}>{children}</View>
);
const InfoBarOptions = ({ children }) => (
  <View style={styles.infoBarOptions}>{children}</View>
);

const styles = StyleSheet.create({
  container: {
    width,
    height,
    position: "absolute",
    top: 0,
    left: 0,
    margin: 0,
    zIndex: 50,
    backgroundColor: "#010101",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  blurredBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  carouselContainer: {
    width,
    height: width,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 45,
    paddingRight: 0,
  },
  gestureContainer: {
    width,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  gestureItem: {
    width: 28,
    height: 4,
    borderRadius: 28,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  songInfoContainer: {
    width: (width / 100) * 90,
    height: "7%",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: {
    width: "100%",
    fontSize: 19,
    textAlign: "left",
    color: "#444",
    fontWeight: "bold",
  },
  artist: {
    width: "100%",
    fontSize: 13,
    textAlign: "left",
    color: "rgba(0, 0, 0, 0.3)",
  },
  infoBar: {},
});

export default FullPlayer;
