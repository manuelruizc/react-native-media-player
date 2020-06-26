import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import RelatedThumbnails from './RelatedThumbnails';

const screenWidth = Dimensions.get('window').width;

class ScrollItems extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() {
        const { videos, isAudioSource, searchListStatus, item} = this.props;
        return (
            <>
            {videos.map((video, i) => {
                  if(searchListStatus) {
                    return (
                     <View style={{width: screenWidth, height: screenWidth, justifyContent:'center', alignItems:'center'}}
                     key={i}>
                       <RelatedThumbnails  
                        item={item}
                        styling={isAudioSource ? {width: (screenWidth/100)*70, marginRight:(screenWidth/100) * 15, marginLeft:(screenWidth/100) * 15, height: (screenWidth/100)*70, shadowColor: "#000",} : styles.doNotDisplay}
                        src={{uri: video.video_thumbnail}} />
                     </View> 
                    );
                  }
                  return (
                    <View style={{width: screenWidth, height: screenWidth, justifyContent:'center', alignItems:'center'}}
                    key={i}>
                      <RelatedThumbnails
                      item={item}
                      styling={isAudioSource ? {width: (screenWidth/100)*70, marginRight:(screenWidth/100) * 15, marginLeft:(screenWidth/100) * 15, height: (screenWidth/100)*70, shadowColor: "#000",} : styles.doNotDisplay}
                      src={{uri: video.imageURI}} />
                    </View>
                  );
                })}
            </>
        );
    }
}
 
export default ScrollItems;