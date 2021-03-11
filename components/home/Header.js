/* eslint-disable react-native/no-inline-styles */
import React from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default (props) => {
  return (
    <View
      style={{
        width: "100%",
        height: "12%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#111111",
      }}
    >
      <TouchableOpacity
        style={{ marginLeft: 20 }}
        onPress={props.navigation.openDrawer}
      >
        <Icon name={"ios-menu"} size={30} color={"#333"} />
      </TouchableOpacity>
      <View
        style={{
          width: "80%",
          height: "65%",
          borderTopLeftRadius: 6,
          borderBottomLeftRadius: 6,
          backgroundColor: "#FF6861",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Icon
          name={"ios-search"}
          size={20}
          color={"rgba(0, 0, 0, 0.4)"}
          style={{ width: "5%", marginLeft: 10 }}
        />
        <TextInput
          style={{
            width: "95%",
            height: "100%",
            borderColor: "white",
            paddingLeft: 15,
            fontSize: 14,
            color: "white",
          }}
          onChangeText={(text) => {
            props.changeText(text);
            props.searchVideo(text);
          }}
          placeholder={"Search videos..."}
          placeholderTextColor={"rgba(0, 0, 0, 0.4)"}
          value={props.text}
        />
      </View>
    </View>
  );
};
