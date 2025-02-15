import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  AsyncStorage,
  Dimensions,
  Easing,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import RNFS from "react-native-fs";
import OptionsMenu from "react-native-options-menu";
import SortableList from "react-native-sortable-list";
import Icon from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import {
  __togglePause,
  __updateAllSongs,
  __updateCurrentVideo,
  __updateCurrentVideoIndex,
  __updateCurrentVideoKey,
  __updateImageURI,
  __updateSearchListActive,
  __updateSongProgress,
  __updateVideoChannel,
  __updateVideoListPlaylist,
  __updateVideoTitle,
} from "../../redux/actions/actionNames";
import EditSong from "./EditSong";

const window = Dimensions.get("window");

const myIcon = <Icon name={"ios-more"} size={24} color={"white"} />;

const BothSources = (props) => {
  const { play } = props;
  return (
    <OptionsMenu
      customButton={myIcon}
      destructiveIndex={1}
      options={[
        "Edit",
        "Add to playlist",
        "Delete from playlist",
        "Delete from device (keep on playlist)",
        "Delete from device and playlist",
      ]}
      actions={[
        () => props.openEditModal(play),
        () => props.navigate("PlaylistOptions", { item: play }),
        () => props.deleteSongFromPlaylist(play.uri),
        () => props.deleteSongOnlyFromDevice(play.uri),
        () => props.deleteSongFromEverythingBothSources(play.uri),
      ]}
    />
  );
};

const OneSource = (props) => {
  const { play } = props;
  return (
    <OptionsMenu
      customButton={myIcon}
      destructiveIndex={1}
      options={[
        "Edit",
        "Add to playlist",
        "Delete from playlist",
        "Delete from device (keep on playlist)",
        "Delete from device and playlist",
      ]}
      actions={[
        () => props.openEditModal(play),
        () => props.navigate("PlaylistOptions", { item: play }),
        () => props.deleteSongFromPlaylist(play.uri),
        () => props.deleteSongOnlyFromDevice(play.uri),
        () => props.deleteSongFromEverything(play.uri),
      ]}
    />
  );
};

const Offline = (props) => {
  const { play } = props;
  return (
    <OptionsMenu
      customButton={myIcon}
      destructiveIndex={1}
      options={["Edit", "Download", "Add to playlist", "Delete from playlist"]}
      actions={[
        () => props.openEditModal(play),
        () => props.downloadSong(play),
        () => props.navigate("PlaylistOptions", { item: play }),
        () => props.deleteSongFromPlaylist(play.uri),
      ]}
    />
  );
};

export default (props) => {
  const dispatch = useDispatch();
  const changeAllSongs = (payload) => {
    dispatch({
      type: __updateAllSongs,
      payload,
    });
  };
  const changeVideoChannel = (payload) => {
    dispatch({
      type: __updateVideoChannel,
      payload,
    });
  };
  // 3
  const changeVideoTitle = (payload) => {
    dispatch({
      type: __updateVideoTitle,
      payload,
    });
  };
  const changeSearchListStatus = (payload) => {
    // this.setState({searchListActive: boolean});
    dispatch({
      type: __updateSearchListActive,
      payload,
    });
  };
  const changeImageURI = (payload) => {
    dispatch({
      type: __updateImageURI,
      payload,
    });
  };
  // 8
  const changeCurrentVideo = (payload) => {
    dispatch({
      type: __updateCurrentVideo,
      payload,
    });
  };
  // 9
  const changeCurrentVideoKey = (payload) => {
    dispatch({
      type: __updateCurrentVideoKey,
      payload,
    });
  };
  const changeVideoListPlaylist = (payload) => {
    dispatch({
      type: __updateVideoListPlaylist,
      payload,
    });
  };
  const changeCurrentVideoIndex = (payload) => {
    dispatch({
      type: __updateCurrentVideoIndex,
      payload,
    });
  };
  // 19
  const changeSongProgress = (payload) => {
    dispatch({
      type: __updateSongProgress,
      payload,
    });
  };
  // 20
  const togglePause = (payload = null) => {
    if (payload === null) {
      return dispatch({
        type: __togglePause,
      });
    }
    dispatch({
      type: __togglePause,
      payload,
    });
  };
  const allSongs = useSelector((state) => state.allSongs);
  const downloadingVideoKey = useSelector((state) => state.downloadingVideoKey);
  const currentVideoKey = useSelector((state) => state.currentVideoKey);
  const paused = useSelector((state) => state.paused);
  const [songs, setSong] = useState([]);
  const [isModalActive, setIsModalActive] = useState(false);
  const [isLoadingLocalStorage, setIsLoadingLocalStorage] = useState(true);
  const [isEditModalActive, setIsEditModalActive] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [currentOrder, setCurrentOrder] = useState([]);
  const [isEditingActive, setIsEditingActive] = useState(false);

  const loadSongs = (songs = null, where = "idk") => {
    const key = props.navigation.getParam("key", "error");
    const cameFrom = props.navigation.getParam("comeFrom", "ERROR");
    const sourceIsAudio = props.screenProps.sourceIsAudio;
    const pathName = sourceIsAudio ? "isAudio" : "isVideo";
    const ext = pathName === "path" ? "mp3" : "mp4";
    let tempAllSongs = songs;
    tempAllSongs = songs === null ? allSongs : songs;
    if (cameFrom == "Playlists") {
      tempAllSongs = tempAllSongs.filter((json) => json.playlist.includes(key));
      tempAllSongs.sort(function (a, b) {
        return a.playlistsIndex[key] - b.playlistsIndex[key];
      });
    } else if (cameFrom == "Downloads") {
      tempAllSongs = tempAllSongs.filter(
        (json) =>
          json.playlist.includes(key) && json.isDownloaded && json[pathName]
      );
      if (key != "songsDownloadedOnDevice") {
        tempAllSongs.sort(function (a, b) {
          return a.playlistsIndex[key] - b.playlistsIndex[key];
        });
      }
    }
    setSong([...tempAllSongs]);
    setIsLoadingLocalStorage(false);
  };

  useEffect(() => {
    loadSongs();
  }, []);
  useEffect(() => {
    loadSongs(allSongs, "lhf");
  }, [allSongs]);

  const closeEditModal = () => {
    setIsEditModalActive(false);
  };

  const openEditModal = (play) => {
    setCurrentItem(play);
    setIsEditModalActive(true);
  };

  const downloadAllPlaylist = () => {
    const { sourceIsAudio } = props.screenProps;
    const pathName = sourceIsAudio ? "isAudio" : "isVideo";
    songs.forEach((song) => {
      if (!song.isDownloaded && !song[pathName]) {
        downloadSong(song);
      }
    });
  };

  const { navigation } = props;
  const { sourceIsAudio } = props.screenProps;
  const pathName = sourceIsAudio ? "isAudio" : "isVideo";
  const key = navigation.getParam("key", "ERROR");
  const cameFrom = navigation.getParam("comeFrom", "ERROR");

  const toggleEdit = () => {
    setIsEditingActive(!isEditingActive);
  };

  const downloadSong = (item) => {
    props.screenProps.downloadSong(item);
  };

  const playSong = (index, songData) => {
    const key = props.navigation.getParam("key", "error");
    const cameFrom = props.navigation.getParam("comeFrom", "ERROR");
    const {
      channel,
      isDownloaded,
      title,
      path,
      time,
      uri,
      imageURI,
    } = songData;
    const pathName = sourceIsAudio ? "pathAudio" : "pathVideo";

    changeVideoListPlaylist(songs, "playlist", key);
    changeSearchListStatus(false);
    changeSongProgress(0, false);

    if (isDownloaded) {
      changeCurrentVideo(songData[pathName]);
      changeCurrentVideoKey(uri);
      changeImageURI(imageURI);
      changeVideoChannel(channel);
      changeVideoTitle(title);
      props.screenProps.playNewSong(false, index, songData, key);
      props.screenProps.loadingState(false);
      props.screenProps.changeVideoDownloadStatus(true);
    } else {
      props.screenProps.playIndexSong(index, songData, null, true, songs);
    }
    changeCurrentVideoIndex(index);
  };

  const openModal = () => {
    setIsModalActive(true);
  };

  const closeModal = () => {
    setIsModalActive(false);
  };

  ddToPlaylist = async (key) => {
    const item = props.navigation.getParam("item", "ERROR");
    const { channel, title, uri, time } = item;
    const songObject = { playlist: key, channel, title, uri, time };
    if (item != "ERROR") {
      try {
        await AsyncStorage.getItem("Songs")
          .then((response) => {
            if (response != null) {
              let songs = JSON.parse(response);
              songs.push(songObject);
              changeAllSongs(songs);
              AsyncStorage.setItem("Songs", JSON.stringify(songs))
                .then((response) => {})
                .catch((error) => console.error(error));
            } else {
              let songs = [songObject];
              changeAllSongs(songs);
              songs = JSON.stringify(songs);
              AsyncStorage.setItem("Songs", songs)
                .then((response) => {
                  console.error(response);
                })
                .catch((error) => console.error(error));
            }
          })
          .catch((error) => console.error(error));
      } catch (error) {
        console.error(error);
      }
    }
  };

  borrarPlaylist = async () => {
    try {
      await AsyncStorage.removeItem("Playlists");
      return true;
    } catch (exception) {
      return false;
    }
  };

  deleteSongFromPlaylist = (key) => {
    const playlistName = props.navigation.getParam("key", "ERROR");
    const cameFrom = props.navigation.getParam("comeFrom", "ERROR");
    let jsonSongs = null;
    AsyncStorage.multiGet(["Songs"], (err, stores) => {
      stores.forEach((store, index) => {
        if (index == 0) {
          jsonSongs = store[1];
          jsonSongs = JSON.parse(jsonSongs);
          jsonSongs = jsonSongs.map((json) => {
            if (json.uri == key) {
              let playlist = json.playlist;
              playlist = playlist.filter((play) => play != playlistName);
              json["playlist"] = playlist;
              return json;
            }
            return json;
          });
          jsonSongs = jsonSongs.filter((song) => song.playlist.length > 0);
        }
      });
      changeAllSongs(jsonSongs);
      jsonSongs = JSON.stringify(jsonSongs);

      AsyncStorage.multiSet([["Songs", jsonSongs]], () => {
        ToastAndroid.showWithGravity(
          `Song delete from playlist`,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
        let JSONified = JSON.parse(jsonSongs);
        if (cameFrom == "Playlists") {
          JSONified = JSONified.filter((json) =>
            json.playlist.includes(playlistName)
          );
        } else if (cameFrom == "Downloads") {
          JSONified = JSONified.filter(
            (json) => json.playlist.includes(playlistName) && json.isDownloaded
          );
        }
        setSong(JSONified);
      });
    });
  };

  const deleteSongOnlyFromDevice = (key) => {
    const playlistName = props.navigation.getParam("key", "ERROR");
    const cameFrom = props.navigation.getParam("comeFrom", "ERROR");
    let jsonSongs = null;
    const { switchValue, currentPlaylistName } = props.screenProps;
    let isCurrentPlaylist = false;
    const extension = switchValue ? ".mp3" : ".mp4";
    const pathMedia = switchValue ? "pathAudio" : "pathVideo";
    const booleanFormat = switchValue ? "isAudio" : "isVideo";
    const counterFormat = switchValue ? "isVideo" : "isAudio";

    const path = `file:///storage/emulated/0/Android/data/com.muustube/files/Download/${key}${extension}`;

    if (key == currentVideoKey) {
      self.props.screenProps.playNextSong();
    }

    if (currentPlaylistName === playlistName) {
      isCurrentPlaylist = true;
    }

    RNFS.exists(path)
      .then((result) => {
        if (result) {
          return (
            RNFS.unlink(path)
              .then(() => {
                AsyncStorage.multiGet(["Songs"], (err, stores) => {
                  jsonSongs = stores[0][1];
                  jsonSongs = JSON.parse(jsonSongs);
                  jsonSongs = jsonSongs.map((json) => {
                    if (json.uri == key) {
                      json[pathMedia] = "";
                      json[booleanFormat] = false;
                      json["playlist"] = json[counterFormat]
                        ? json["playlist"]
                        : json.playlist.filter(
                            (name) => name != "songsDownloadedOnDevice"
                          );
                      json["isDownloaded"] = json[counterFormat] ? true : false;
                      return json;
                    }
                    return json;
                  });
                  jsonSongs = jsonSongs.filter(
                    (json) => json.playlist.length > 0
                  );
                  jsonSongs = JSON.stringify(jsonSongs);

                  AsyncStorage.multiSet([["Songs", jsonSongs]], () => {
                    ToastAndroid.showWithGravity(
                      `Song deleted from device storage`,
                      ToastAndroid.SHORT,
                      ToastAndroid.CENTER
                    );
                    let JSONified = JSON.parse(jsonSongs);

                    if (cameFrom == "Playlists") {
                      JSONified = JSONified.filter((json) =>
                        json.playlist.includes(playlistName)
                      );
                    } else if (cameFrom == "Downloads") {
                      JSONified = JSONified.filter(
                        (json) =>
                          json.playlist.includes(playlistName) &&
                          json.isDownloaded &&
                          json[booleanFormat]
                      );
                    }

                    setSong(JSONified);
                    changeAllSongs(JSONified);
                    if (isCurrentPlaylist) {
                      changeVideoListPlaylist(songs, "playlist", key);
                    }
                  });
                });
              })
              // `unlink` will throw an error, if the item to unlink does not exist
              .catch((err) => {
                //console.log(err.message);
              })
          );
        }
      })
      .catch((err) => {
        //console.log(err.message);
      });
  };

  const deleteSongFromEverything = (key) => {
    const playlistName = props.navigation.getParam("key", "ERROR");
    const cameFrom = props.navigation.getParam("comeFrom", "ERROR");
    let jsonSongs = null;
    const { switchValue } = props.screenProps;
    const extension = switchValue ? ".mp3" : ".mp4";
    const pathMedia = switchValue ? "pathAudio" : "pathVideo";
    const booleanFormat = switchValue ? "isAudio" : "isVideo";
    const counterFormat = switchValue ? "isVideo" : "isAudio";

    const path = `file:///storage/emulated/0/Android/data/com.muustube/files/Download/${key}${extension}`;

    RNFS.exists(path)
      .then((result) => {
        if (result) {
          return (
            RNFS.unlink(path)
              .then(() => {
                AsyncStorage.multiGet(["Songs"], (err, stores) => {
                  jsonSongs = stores[0][1];
                  jsonSongs = JSON.parse(jsonSongs);
                  jsonSongs = jsonSongs.filter((song) => song.uri != key);
                  jsonSongs = JSON.stringify(jsonSongs);

                  if (key == currentVideoKey) {
                    props.screenProps.playNextSong(null, true);
                  }

                  AsyncStorage.multiSet([["Songs", jsonSongs]], () => {
                    ToastAndroid.showWithGravity(
                      `Song source deleted from the device and playlists`,
                      ToastAndroid.SHORT,
                      ToastAndroid.CENTER
                    );
                    let JSONified = JSON.parse(jsonSongs);

                    if (cameFrom == "Playlists") {
                      JSONified = JSONified.filter((json) =>
                        json.playlist.includes(playlistName)
                      );
                    } else if (cameFrom == "Downloads") {
                      JSONified = JSONified.filter(
                        (json) =>
                          json.playlist.includes(playlistName) &&
                          json.isDownloaded &&
                          json[booleanFormat]
                      );
                    }
                    setSong(JSONified);
                    changeAllSongs(JSONified);
                  });
                });
              })
              // `unlink` will throw an error, if the item to unlink does not exist
              .catch((err) => {
                //console.log(err.message);
              })
          );
        }
      })
      .catch((err) => {
        //console.log(err.message);
      });
  };

  const deleteSongFromEverythingBothSources = (key) => {
    deleteSongFromEverythingBothSourcesCore(key);
  };

  const deleteSongFromEverythingBothSourcesCore = (key) => {
    const playlistName = props.navigation.getParam("key", "ERROR");
    const cameFrom = props.navigation.getParam("comeFrom", "ERROR");
    const { sourceIsAudio } = props.screenProps;
    const filePath = sourceIsAudio ? "pathAudio" : "pathVideo";
    let jsonSongs = null;
    const path = `file:///storage/emulated/0/Android/data/com.muustube/files/Download/${key}.mp3`;
    const pathVideo = `file:///storage/emulated/0/Android/data/com.muustube/files/Download/${key}.mp4`;
    const self = this;

    RNFS.exists(path)
      .then((result) => {
        if (result) {
          return (
            RNFS.unlink(path)
              .then(() => {
                RNFS.exists(pathVideo)
                  .then((result) => {
                    if (result) {
                      return (
                        RNFS.unlink(pathVideo)
                          .then(() => {
                            AsyncStorage.multiGet(["Songs"], (err, stores) => {
                              jsonSongs = stores[0][1];
                              jsonSongs = JSON.parse(jsonSongs);
                              jsonSongs = jsonSongs.filter(
                                (json) => json.uri != key
                              );
                              jsonSongs = JSON.stringify(jsonSongs);

                              if (key == currentVideoKey) {
                                props.screenProps.playNextSong(null, true);
                              }

                              AsyncStorage.multiSet(
                                [["Songs", jsonSongs]],
                                () => {
                                  ToastAndroid.showWithGravity(
                                    `Song sources (audio/video) deleted.`,
                                    ToastAndroid.SHORT,
                                    ToastAndroid.CENTER
                                  );
                                  let JSONified = JSON.parse(jsonSongs);

                                  if (cameFrom == "Playlists") {
                                    JSONified = JSONified.filter(
                                      (json) =>
                                        json.playlist.includes(playlistName) &&
                                        json[filePath]
                                    );
                                  } else if (cameFrom == "Downloads") {
                                    JSONified = JSONified.filter(
                                      (json) =>
                                        json.playlist.includes(playlistName) &&
                                        json.isDownloaded &&
                                        json[filePath]
                                    );
                                  }
                                  setSong(JSONified);
                                }
                              );
                            });
                          })
                          // `unlink` will throw an error, if the item to unlink does not exist
                          .catch((err) => {
                            //console.log(err.message);
                          })
                      );
                    }
                  })
                  .catch((err) => {
                    //console.log(err.message);
                  });
              })
              // `unlink` will throw an error, if the item to unlink does not exist
              .catch((err) => {
                //console.log(err.message);
              })
          );
        }
      })
      .catch((err) => {
        //console.log(err.message);
      });
  };

  // SET THE ORDER ARRAY WHEN DRAGGIN AND SORTIN'
  const setCurrentOrderFunc = (currentOrder) => {
    setCurrentOrder(currentOrder);
  };

  const saveCurrentOrder = () => {
    const key = props.navigation.getParam("key", "error");
    let newOrderedArray = [];

    //  If there's no change in the playlist order
    if (currentOrder.length == 0) {
      setIsEditingActive(false);
      // this.loadSongs();
      return false;
    }

    //  Playlist reordering
    for (let i = 0; i < currentOrder.length; i++) {
      songs[Number(currentOrder[i])].playlistsIndex[key] = i;
      newOrderedArray.push(songs[Number(currentOrder[i])]);
    }

    let tempAllSongs = allSongs;
    tempAllSongs = allSongs.filter((song) => !song.playlist.includes(key));

    //  new songs array and saving
    tempAllSongs = [...tempAllSongs, ...newOrderedArray];
    changeAllSongs(tempAllSongs);
    AsyncStorage.setItem("Songs", JSON.stringify(tempAllSongs));
    loadSongs();
    if (props.screenProps.currentPlaylistName == key)
      props.screenProps.updatePlaylistAfterDownload();
    setIsEditingActive(false);
  };
  return (
    <PlaylistSongsContainer>
      {isEditModalActive && (
        <EditSong
          loadSongs={loadSongs}
          item={currentItem}
          closeModal={closeEditModal}
          addToAllSongs={changeAllSongs}
        />
      )}
      <HeaderContainer>
        <HeaderInfo key={key} saveCurrentOrder={saveCurrentOrder} />
        {cameFrom !== "Downloads" && (
          <EditPlaylistOrderButton
            isEditingActive={isEditingActive}
            saveCurrentOrder={saveCurrentOrder}
            toggleEdit={toggleEdit}
          />
        )}
      </HeaderContainer>
      <DownloadButton downloadAllPlaylist={downloadAllPlaylist} />
      {isLoadingLocalStorage ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#ea4c89" />
        </View>
      ) : songs.length < 1 ? (
        <Text style={{ color: "white" }}>
          {cameFrom == "Downloads"
            ? "There's no downloaded songs on this playlist"
            : "There's no songs in this playlist"}
        </Text>
      ) : isEditingActive ? (
        <Container setCurrentOrderFunc={setCurrentOrderFunc} data={songs} />
      ) : (
        <ScrollView style={{ width: "100%" }}>
          {songs.map((play, index) => (
            <ItemContainer
              key={play.uri}
              index={index}
              title={play.title}
              totalSongs={songs.length - 1}
            >
              <PlayButton
                currentVideoKey={currentVideoKey}
                togglePause={togglePause}
                playSong={playSong}
                index={index}
                play={play}
                paused={paused}
              />
              <ItemData>
                <ItemTitle
                  play={play}
                  downloadingVideoKey={downloadingVideoKey}
                  pathName={pathName}
                >
                  {!play.customName ? play.title : play.customName}
                </ItemTitle>
                <ItemArtist>
                  {!play.customArtist ? play.channel : play.customArtist}
                </ItemArtist>
              </ItemData>
              {play.isDownloaded ? (
                play.pathVideo && play.pathAudio ? (
                  <BothSources
                    openEditModal={openEditModal}
                    play={play}
                    navigate={props.navigation.navigate}
                    deleteSongFromPlaylist={deleteSongFromPlaylist}
                    deleteSongOnlyFromDevice={deleteSongOnlyFromDevice}
                    deleteSongFromEverythingBothSources={
                      deleteSongFromEverythingBothSources
                    }
                  />
                ) : (
                  <OneSource
                    openEditModal={openEditModal}
                    play={play}
                    navigate={props.navigation.navigate}
                    deleteSongFromPlaylist={deleteSongFromPlaylist}
                    deleteSongOnlyFromDevice={deleteSongOnlyFromDevice}
                    deleteSongFromEverything={deleteSongFromEverything}
                  />
                )
              ) : (
                <Offline
                  openEditModal={openEditModal}
                  play={play}
                  navigate={props.navigation.navigate}
                  downloadSong={downloadSong}
                  deleteSongFromPlaylist={deleteSongFromPlaylist}
                />
              )}
            </ItemContainer>
          ))}
        </ScrollView>
      )}
    </PlaylistSongsContainer>
  );
};

const PlaylistSongsContainer = ({ children }) => (
  <View style={stylesPlaylistsSongs.container}>{children}</View>
);
const HeaderContainer = ({ children }) => (
  <View style={stylesPlaylistsSongs.headerContainer}>{children}</View>
);
const HeaderInfo = ({ key, saveCurrentOrder }) => {
  return (
    <View>
      <Text
        onPress={saveCurrentOrder}
        style={stylesPlaylistsSongs.playlistType}
      >
        PLAYLIST {key === "songsDowloadedOnDevice" && "(DOWNLOADED)"}
      </Text>
      <Text style={stylesPlaylistsSongs.playlistName}>
        {key == "songsDownloadedOnDevice" ? "Downloads" : key}
      </Text>
    </View>
  );
};
const EditPlaylistOrderButton = ({
  isEditingActive,
  saveCurrentOrder,
  toggleEdit,
}) => {
  return (
    <View>
      <Text
        onPress={isEditingActive ? saveCurrentOrder : toggleEdit}
        style={stylesPlaylistsSongs.editButton}
      >
        {isEditingActive ? "SAVE" : "EDIT"}
      </Text>
    </View>
  );
};
const DownloadButton = ({ downloadAllPlaylist }) => {
  return (
    <View style={stylesPlaylistsSongs.downloadButtonContainer}>
      <TouchableOpacity
        style={stylesPlaylistsSongs.downloadButton}
        onPress={downloadAllPlaylist}
      >
        <Text style={{ color: "white" }}>Download all</Text>
      </TouchableOpacity>
    </View>
  );
};
const ItemContainer = ({ children, title, index, totalSongs }) => {
  return (
    <View
      key={title}
      style={[
        stylesPlaylistsSongs.itemContainer,
        { marginBottom: index === totalSongs ? window.height * 0.13 : 5 },
      ]}
    >
      {children}
    </View>
  );
};
const PlayButton = ({
  currentVideoKey,
  togglePause,
  playSong,
  index,
  play,
  paused,
}) => {
  if (currentVideoKey === play.uri) {
    return (
      <TouchableOpacity
        style={stylesPlaylistsSongs.playButtonContainer}
        onPress={togglePause}
      >
        {paused ? (
          <Icon name={"ios-play"} size={15} color={"#5B4F5F"} />
        ) : (
          <Icon name={"ios-pause"} size={15} color={"#5B4F5F"} />
        )}
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity
      style={{
        width: 30,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        borderWidth: 1,
        borderColor: "#5B4F5F",
        borderRadius: 900,
      }}
      onPress={() => playSong(index, play)}
    >
      <Icon name={"ios-play"} size={15} color={"#5B4F5F"} />
    </TouchableOpacity>
  );
};
const ItemData = ({ children }) => (
  <View style={stylesPlaylistsSongs.itemData}>{children}</View>
);
const ItemTitle = ({ play, downloadingVideoKey, children, pathName }) => {
  return (
    <Text
      style={[
        stylesPlaylistsSongs.itemTitle,
        {
          color:
            play.isDownloaded && play[pathName]
              ? "#ea4c89"
              : songIsDownloading(downloadingVideoKey, play.uri)
              ? "orange"
              : "#444",
        },
      ]}
      numberOfLines={1}
      ellipsizeMode={"tail"}
    >
      {children}
    </Text>
  );
};
const ItemArtist = ({ children }) => {
  return <Text style={stylesPlaylistsSongs.itemArtist}>{children}</Text>;
};

const songIsDownloading = (downloadedSongs, uri) => {
  if (downloadedSongs.filter((dS) => dS.uri === uri).length > 0) {
    return true;
  }
  return false;
};

const stylesPlaylistsSongs = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#222",
    position: "relative",
  },
  headerContainer: {
    width: "100%",
    height: "14%",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingLeft: "5%",
    paddingRight: "5%",
  },
  playlistType: {
    color: "rgba(255, 255, 255,0.4)",
    marginBottom: 10,
    fontSize: 13,
    fontWeight: "bold",
  },
  playlistName: {
    color: "#444",
    fontSize: 20,
  },
  editButton: {
    fontSize: 30,
    color: "rgba(255, 255, 255, 0.5)",
  },
  downloadButtonContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  downloadButton: {
    width: "40%",
    height: 35,
    backgroundColor: "#ea4c89",
    borderRadius: 900,
    justifyContent: "center",
    alignItems: "center",
  },
  itemContainer: {
    width: "88%",
    height: 70,
    marginLeft: "6%",
    marginTop: 5,
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
  },
  playButtonContainer: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#5B4F5F",
    borderRadius: 900,
  },
  itemData: {
    width: "67%",
    height: "100%",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  itemTitle: {
    width: "100%",
    fontSize: 16,
  },
  itemArtist: {
    width: "100%",
    fontSize: 10,
  },
});

const Container = (props) => {
  const modal = (key, currentOrder) => {
    props.setCurrentOrderFunc(currentOrder);
  };
  const _renderRow = ({ data, active }) => {
    return <Row data={data} active={active} />;
  };

  return (
    <View style={st.container}>
      <SortableList
        onReleaseRow={modal}
        style={st.list}
        contentContainerStyle={st.contentContainer}
        data={props.data}
        renderRow={_renderRow}
      />
    </View>
  );
};

const Row = (props) => {
  const _active = useRef(new Animated.Value(0)).current;
  const _style = {
    ...Platform.select({
      ios: {
        transform: [
          {
            scale: _active.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.1],
            }),
          },
        ],
        shadowRadius: _active.interpolate({
          inputRange: [0, 1],
          outputRange: [2, 10],
        }),
      },

      android: {
        transform: [
          {
            scale: _active.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.07],
            }),
          },
        ],
        elevation: _active.interpolate({
          inputRange: [0, 1],
          outputRange: [2, 6],
        }),
      },
    }),
  };

  useEffect(() => {
    Animated.timing(_active, {
      duration: 300,
      easing: Easing.bounce,
      toValue: Number(props.active),
    }).start();
  }, [props.active]);

  const { data, active } = props;

  return (
    <Animated.View
      style={[
        _style,
        {
          width: "88%",
          height: 70,
          marginLeft: "6%",
          marginBottom: 5,
          marginTop: 5,
          alignItems: "center",
          justifyContent: "space-around",
          flexDirection: "row",
        },
      ]}
    >
      <Image
        source={{ uri: data.imageURI }}
        style={{
          width: 30,
          height: 30,
          justifyContent: "center",
          alignItems: "center",
          borderWidth: 1,
          borderColor: "#5B4F5F",
          borderRadius: 900,
        }}
      />
      <View
        style={{
          width: "67%",
          height: "100%",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <Text
          style={{ width: "100%", fontSize: 16, color: "#444" }}
          numberOfLines={1}
          ellipsizeMode={"tail"}
        >
          {!data.customName ? data.title : data.customName}
        </Text>
        <Text
          style={{
            width: "100%",
            fontSize: 10,
            color: "rgba(0, 0, 0, 0.4)",
            marginBottom: 3,
          }}
        >
          {!data.customArtist ? data.channel : data.customArtist}
        </Text>
      </View>
      <Icon name={"ios-more"} size={24} color={"#444"} />
    </Animated.View>
  );
};

const st = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",

    ...Platform.select({
      ios: {
        paddingTop: 20,
      },
    }),
  },

  title: {
    fontSize: 20,
    paddingVertical: 20,
    color: "#999999",
  },

  list: {
    flex: 1,
  },

  contentContainer: {
    width: window.width,

    ...Platform.select({
      ios: {
        paddingHorizontal: 30,
      },

      android: {
        paddingHorizontal: 0,
      },
    }),
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    height: 80,
    flex: 1,
    marginTop: 7,
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: 4,

    ...Platform.select({
      ios: {
        width: window.width - 30 * 2,
        shadowColor: "rgba(0,0,0,0.2)",
        shadowOpacity: 1,
        shadowOffset: { height: 2, width: 2 },
        shadowRadius: 2,
      },

      android: {
        width: window.width,
        elevation: 0,
      },
    }),
  },

  image: {
    width: 50,
    height: 50,
    marginRight: 30,
    borderRadius: 25,
  },

  text: {
    fontSize: 10,
    color: "#222222",
  },
});

const styles = StyleSheet.create({
  modalActive: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  modalNotActive: {
    display: "none",
  },
});
