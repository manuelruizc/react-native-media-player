import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('screen');

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
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
      width:'80%',
      marginBottom: '6.5%',
      marginTop: '4%',
      fontSize: 12,
      color: '#EEEEEE',
    },
    scrollViewContainer: {
      width:'100%',
      backgroundColor: '#111111',
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
      width:'100%',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      margin: 0,
      color: 'white',
      position: 'relative',
      height: width * 0.34,
      paddingLeft: 10
    },
    imageURI: {
      width: width * 0.30,
      height: width * 0.22,
      borderRadius: 4
    },
    loadingCardContainer: {
      width:'100%',
      borderRadius:13,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      margin: 0,
      position: 'relative',
      marginBottom: 10,
      marginTop: 10,
      paddingLeft: 10,
    },
    loadingCardThumbnail: {
      width: width * 0.30,
      height: width * 0.22,
      borderRadius: 4,
      backgroundColor: '#332F2E',
      marginRight: 8,
    },
    loadingDataContainer: {
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    loadingCardTitle: {
      width: width * 0.35,
      height: 18,
      marginBottom: 12,
      backgroundColor: '#332F2E',
    },
    loadingCardArtist: {
      width: width * 0.28,
      height: 10,
      backgroundColor: '#332F2E',
    }
});