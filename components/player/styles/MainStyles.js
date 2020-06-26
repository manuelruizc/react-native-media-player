import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    playaContainer: {
        width: '100%',
        height: '12%',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor:'#00007A',
        borderTopRightRadius: 8, borderTopLeftRadius: 8,
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
      backgroundColor: 'black',
      justifyContent: 'flex-start',
      alignItems: 'center'
    },
    doNotDisplay: {
        display: 'none'
    },
    fullScreenControlsContainer: {
      width:'100%',
      height: '100%',
      flexDirection:'row',
      alignItems:'center',
      justifyContent: 'flex-start',
      paddingLeft: 12,
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