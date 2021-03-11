import React, { Component } from "react";
import { Dimensions, Image, View } from "react-native";
const screenWidth = Dimensions.get("screen").width;

const thumbnailSize = (screenWidth / 100) * 80;
const thumbnailMargin = (100 - thumbnailSize) / 2;

class RelatedThumbnails extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { styling, src, isAudioSource, item } = this.props;
    const style = {
      width: thumbnailSize,
      height: thumbnailSize,
      marginRight: thumbnailMargin,
      marginLeft: thumbnailMargin,
      borderRadius: 6,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: "#CCCCCC",
    };
    return (
      <View style={style}>
        <Image
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            borderRadius: 6,
          }}
          resizeMode={"cover"}
          source={src}
        />
      </View>
    );
  }
}

export default RelatedThumbnails;
