import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('screen');

export const styles = StyleSheet.create({
    playaContainer: {
        width: '100%',
        height: height * 0.10,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor:'rgba(0, 0, 0, 0.1)',
        position: 'absolute',
        bottom: 0,
        left: 0,
    },
    playaContainerFullScreen: {
      position:'absolute',
      top:0,
      left:0,
      right:0,
      bottom:0,
      zIndex: 100,
      width: '100%',
      height: '100%',
      justifyContent: 'flex-start',
      alignItems: 'center'
    },
    doNotDisplay: {
        display: 'none'
    },
    fullScreenControlsContainer: {
      width,
      height: '100%',
      flexDirection:'row',
      alignItems:'center',
      justifyContent: 'flex-start',
      paddingLeft: 0,
    },
    fullScreenControlsContainerFullScreen: {
      width: '90%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      position: 'relative',
    },
    fullscreenVolumeContainer: {
      width:'85%',
      height:'auto',
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'space-between',
      marginTop:30,
    }
});  