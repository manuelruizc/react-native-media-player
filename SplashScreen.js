import React, { useEffect } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";

const { width } = Dimensions.get("window");

const SplashScreen = ({ isAboutToActivate, upliftSplashState }) => {
  useEffect(() => {
    if (isAboutToActivate) {
      upliftSplashState(true);
    }
  }, [isAboutToActivate]);
  return (
    <View style={styles.container}>
      <Image
        source={require("./assets/applogo.png")}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
  },
  image: {
    width: width * 0.4,
    height: width * 0.4,
    fontWeight: "900",
    color: "white",
  },
});
export default SplashScreen;
