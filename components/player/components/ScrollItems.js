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
                        isAudioSource={isAudioSource}
                        src={{uri: video.video_thumbnail}} />
                     </View> 
                    );
                  }
                  return (
                    <View
                      style={{width: screenWidth, height: screenWidth, justifyContent:'center', alignItems:'center'}}
                      key={i}
                    >
                      <RelatedThumbnails
                      item={item}
                      isAudioSource={isAudioSource}
                      src={{uri: video.imageURI}} />
                    </View>
                  );
                })}
            </>
        );
    }
}
 
export default ScrollItems;