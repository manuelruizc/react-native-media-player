import React, {Component} from 'react';
import {StyleSheet, ImageBackground, Image, Dimensions, Easing, Animated, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default class SplashScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      container_animation: new Animated.Value(0),
      item_animation: new Animated.Value(0)
    }
  }

  componentDidMount() {
    this.startAnimation();
  }

  componentWillReceiveProps(newProps) {
    if(newProps.isAboutToActivate) {
      // Animated.timing(this.state.item_animation, {
      //   toValue: 2,
      //   duration: 380,
      //   useNativeDriver: true,
      // }).start();
    }
  }

  startAnimation = () => {
    const { isAboutToActivate } = this.props;
    this.state.container_animation.setValue(0);
    this.state.item_animation.setValue(0);
    Animated.parallel([
      Animated.timing(this.state.container_animation, {
        toValue: 1,
        duration: 3500,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(this.state.item_animation, {
          toValue: 1,
          duration: 3500/4,
          useNativeDriver: true,
        }),
        Animated.timing(this.state.item_animation, {
          toValue: 0,
          duration: 3500/4,
          useNativeDriver: true,
        }),
        Animated.timing(this.state.item_animation, {
          toValue: 1,
          duration: 3500/4,
          useNativeDriver: true,
        }),
        Animated.timing(this.state.item_animation, {
          toValue: 0,
          duration: 3500/4,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      if(isAboutToActivate)
        this.startAnimation();
      else {
        Animated.timing(this.state.item_animation, {
          toValue: 2,
          duration: 1500,
          useNativeDriver: true,
        }).start(() => {
          this.props.upliftSplashState();
        });
      }
    });
  }
  
  render() {
    const { isAboutToActivate } = this.props;
    const rotate = this.state.container_animation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
      extrapolate:'clamp'
    });
    const scale = this.state.item_animation.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [0.6, 1.2, 20],
      extrapolate: 'clamp',
    });
    const transform = [{scale}]
    const container_styles = { transform: [ { rotate } ] }

    const backgroundColor = '#4B4BFA';
    
    return(
      <View style={styles.container}>
        <Animated.View style={[styles.animation_container, container_styles]}>
          <Animated.View
          style={{width: width*0.20, height: width*0.20,borderRadius:width, backgroundColor,
          position:'absolute', top: 0, left: (width*0.35) - (width*0.20/2), transform}} />
          <Animated.View
          style={{width: width*0.20, height: width*0.20,borderRadius:width, backgroundColor,
          position:'absolute', bottom: 0, left: (width*0.35) - (width*0.20/2), transform}} />
          <Animated.View
          style={{width: width*0.20, height: width*0.20,borderRadius:width, backgroundColor,
          position:'absolute', left: 0, top: (width*0.35) - (width*0.20/2), transform}} />
          <Animated.View
          style={{width: width*0.20, height: width*0.20,borderRadius:width, backgroundColor,
          position:'absolute', right: 0, top: (width*0.35) - (width*0.20/2), transform}} />
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width:'100%',
    height:'100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black'
  },
  animation_container: {
    width: width*0.7,
    height: width*0.7,
    // borderRadius: width,
    // backgroundColor: 'lightgreen',
    position:'relative',
  }
});