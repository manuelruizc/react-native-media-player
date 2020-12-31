import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import RelatedThumbnails from './RelatedThumbnails';

const screenWidth = Dimensions.get('window').width;

export default (props) => {
        const { videos, isAudioSource, searchListStatus, item} = props;
        return (
          <>
            {videos.map((video, i) => {
              const { video_thumbnail, thumbnails, imageURI } = video;
              const thumbnail = imageURI ? imageURI : thumbnails ? thumbnails[thumbnails.length - 1].url : video_thumbnail;
              if(searchListStatus) {
                    return (
                     <View style={{width: screenWidth, height: screenWidth, justifyContent:'center', alignItems:'center'}}
                     key={i}>
                       <RelatedThumbnails  
                        item={item}
                        isAudioSource={isAudioSource}
                        src={{uri: thumbnail}} />
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
                      src={{uri: thumbnail}} />
                    </View>
                  );
                })}
            </>
        );
}