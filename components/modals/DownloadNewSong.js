import React, { useState } from "react";
import {
  Dimensions,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "./Modal";

const { width, height } = Dimensions.get("window");

export default (props) => {
  const [currentArtist, setCurrentArtist] = useState("");
  const [currentSong, setCurrentSong] = useState("");

  const closeModal = () => {
    props.closeModal();
  };

  const downloadSong = () => {
    const { item, downloadSong } = props;
    downloadSong(item, currentArtist, currentSong);
    props.closeModal();
  };

  return (
    <Modal closeModal={props.closeModal}>
      <View
        style={{
          width: width * 0.9,
          height: height * 0.45,
          backgroundColor: "white",
          borderRadius: 6,
          zIndex: 100000000,
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
            onPress={downloadSong}
            style={{
              width: "55%",
              height: "88%",
              backgroundColor: "#010101",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "white" }}>Download</Text>
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
