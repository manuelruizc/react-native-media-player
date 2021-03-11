import React, { useEffect, useState } from "react";
import {
  AsyncStorage,
  Dimensions,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import { __updateAllSongs } from "../../redux/actions/actionNames";
import Modal from "./Modal";

const { width, height } = Dimensions.get("window");

export default (props) => {
  const [currentArtist, setCurrentArtist] = useState("");
  const [currentSong, setCurrentSong] = useState("");
  const [currentURI, setCurrentURI] = useState("");
  const dispatch = useDispatch();

  const closeModal = () => {
    props.closeModal();
  };

  useEffect(() => {
    const { item } = props;
    const artist = !item.customArtist ? item.channel : item.customArtist;
    const song = !item.customName ? item.title : item.customName;
    setCurrentArtist(artist);
    setCurrentSong(song);
    setCurrentURI(item.uri);
  }, []);

  const saveSong = async () => {
    try {
      let songs = await AsyncStorage.getItem("Songs");
      songs = JSON.parse(songs);
      songs.forEach((song) => {
        if (song.uri === currentURI) {
          if (currentSong != "") song.customName = currentSong;
          if (currentArtist != "") song.customArtist = currentArtist;
        }
      });

      dispatch({
        type: __updateAllSongs,
        payload: songs,
      });
      songs = JSON.stringify(songs);

      await AsyncStorage.setItem("Songs", songs);

      closeModal();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Modal closeModal={closeModal}>
      <View
        style={{
          width: width * 0.9,
          height: height * 0.6,
          backgroundColor: "white",
          borderRadius: 13,
          zIndex: 4,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "80%",
            height: "35%",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 20,
          }}
        >
          <TextInput
            onChangeText={(text) => setCurrentSong(text)}
            value={currentSong}
            style={{
              width: "100%",
              height: "48%",
              fontSize: 14,
              borderBottomWidth: 1,
              borderBottomColor: "#010101",
            }}
            placeholder="Custom song name"
          />
          <TextInput
            onChangeText={(text) => setCurrentArtist(text)}
            value={currentArtist}
            style={{
              width: "100%",
              height: "48%",
              fontSize: 14,
              borderBottomWidth: 1,
              borderBottomColor: "#010101",
            }}
            placeholder="Custom artist name"
          />
        </View>
        <View
          style={{
            width: "80%",
            height: "15%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={saveSong}
            style={{
              width: "44%",
              height: "70%",
              backgroundColor: "black",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "white" }}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={closeModal}
            style={{
              width: "44%",
              height: "100%",
              borderRadius: 13,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "lightsalmon" }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
