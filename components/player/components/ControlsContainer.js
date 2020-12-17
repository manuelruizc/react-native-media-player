import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  TouchableWithoutFeedback,
  Animated,
  Image,
  Dimensions,
  StyleSheet
} from 'react-native';

const { width } = Dimensions.get('screen');

export default ({children}) => {

  return(
    <View style={styles.container}>
      {children}
    </View>
  );
};

const styles =  StyleSheet.create({
  container: {
    width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  }
});