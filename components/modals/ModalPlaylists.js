import React from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import Modal from "./Modal";

const { width, height } = Dimensions.get("window");

export default (props) => {
  const deletePlaylist = () => {
    const { playlist, deletePlaylist } = props;
    deletePlaylist(playlist);
    props.closeModal();
  };
  const { closeModal } = props;
  return (
    <Modal closeModal={closeModal}>
      <View
        style={{
          width: width * 0.8,
          height: height * 0.3,
          backgroundColor: "white",
          borderRadius: 13,
          zIndex: 4,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            marginBottom: 45,
            color: "rgba(0, 0, 0, 0.8)",
            fontSize: 13,
          }}
        >
          PLAYLIST OPTIONS
        </Text>
        <View
          style={{
            width: "80%",
            height: "15%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {props.isPlaylistOptions ? null : (
            <TouchableOpacity
              style={{
                width: "44%",
                height: "100%",
                backgroundColor: "#010101",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "white" }}>Edit</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={deletePlaylist}
            style={{
              width: "44%",
              height: "100%",
              borderRadius: 13,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#eb2f64" }}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
