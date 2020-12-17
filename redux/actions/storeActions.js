import React from 'react';
import { useDispatch } from 'react-redux';
import { __togglePause, __togglePlayerFullscreen, __updateAllSongs, __updateCurrentPlaylistName, __updateCurrentVideo, __updateCurrentVideoIndex, __updateCurrentVideoItem, __updateCurrentVideoKey, __updateDownloadedSongsList, __updateDownloadingVideoKey, __updateImageURI, __updateIsDownloadingSong, __updatePlaylistSource, __updateRelatedVideos, __updateSearchListActive, __updateSongProgress, __updateVideoChannel, __updateVideoList, __updateVideoListPlaylist, __updateVideoTitle } from './actionNames';

export const useTogglePause = () => {
    const dispatch = useDispatch();

    return (payload) => {
        if(payload) {
            dispatch({
              type: __togglePause,
              payload
            });
        }
        else {
            dispatch({
                type: __togglePause
            });
        }
    }
}

