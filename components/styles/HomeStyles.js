import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#0000AE',
    },
    lightbox: {
      position: 'absolute',
      top:0,
      left:0,
      right:0,
      bottom:0,
      width:'100%',
      height:'100%',
      zIndex: 20
    },
    searcherContainer: {
      width:'100%',
      height:'10%',
      justifyContent: 'center',
      alignItems:'center',
    },
    videoTitle: {
      textAlign: 'left',
      color: '#FFFFFF',
      width:'93%',
      marginBottom: '6.5%',
      marginTop: '4%',
      fontSize: 18
    },
    scrollViewContainer: {
      width:'100%',
    },
    scrollViewFlexbox: {
      justifyContent:'center',
      alignItems: 'center'
    },
    backgroundVideo: {
      width:'93%',
      height:'30%',
      borderWidth:1,
      borderColor: 'green',
      marginTop: '10%'
    },
   magic: {
    height: 65,
    width:'100%',
    borderRadius:13,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: 0,
    color: 'white',
    paddingLeft:15,
    position: 'relative',
    marginBottom: 10,
    marginTop: 10,
    }
});