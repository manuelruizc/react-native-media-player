import { songExists } from "../../helpers/localstorage/songExists";

const initState = {
    paused: true,
    isLoadingSearch: true,
    musicPlayerFullScreen: false,
    lastSearch: "Bruno Mars",
    videoList: [],
    currentVideo: '',
    currentVideoIndex: 0,
    currentVideoKey: '',
    imageURI: '',
    videoTitle: "The Kiboomers - Kids Music Channel",
    videoChannel: "Freeze Dance | Freeze Song | Freeze Dance for Kids | Music for Kids | The Kiboomers",
    videoListPlaylist: [],
    playlistSource: [],
    allSongs: [],
    relatedVideos: [],
    searchListActive: false,
    isLoadingSong: false,
    isDownloadingSong: false,
    searched: false,
    currentVideoItem: {},
    currentPlaylistName: "",
    songProgress: 0,
    downloadedSongsList: [],
    downloadingVideoKey: [],
    sourceIsAudio: true,



    
    
    
};

const rootReducer = (state = initState, action) => {
    if(action.type === 'TOGGLE_PAUSE_STATE') {
        // if payload is not undefined or null but is a Boolean(true or false)
        if(typeof action.payload === 'boolean') {
            return {
                ...state,
                paused: action.payload
            }
        }
        return {
            ...state,
            paused: !state.paused
        }
    }
    else if(action.type === 'TOGGLE_PLAYER_FULLSCREEN') {
        return {
            ...state,
            musicPlayerFullScreen: !state.musicPlayerFullScreen
        }
    }
    else if(action.type === 'UPDATE_LOADING_SEARCH_STATUS') {
        if(action.payload) {
            return {
                ...state,
                isLoadingSearch: action.payload
            }
        }
        return {
            ...state,
            isLoadingSearch: !state.isLoadingSearch
        }
    }
    else if(action.type === 'UPDATE_LAST_SEARCH') {
        return {
            ...state,
            lastSearch: action.payload
        }
    }
    else if(action.type === 'UPDATE_VIDEOLIST') {
        let tempVideoList = action.payload;
        for(let i = 0; i < tempVideoList.length; i++) {
            const currentVideo = tempVideoList[i];
            const uri = currentVideo.uri ? currentVideo.uri : currentVideo.id;
            let songExistsInPhone = songExists(state.allSongs, uri, state.sourceIsAudio);
            songExistsInPhone = songExistsInPhone.toLowerCase() === 'already downloaded';
            if(!songExistsInPhone) continue;
            let filteredVideo = state.allSongs.filter(song => song.uri === uri);
            filteredVideo = filteredVideo[0];
            if(songExistsInPhone && filteredVideo)
                tempVideoList[i] = filteredVideo;
        }
        return {
            ...state,
            videoList: tempVideoList
        }
    }
    else if(action.type === 'UPDATE_CURRENTVIDEO') {
        return {
            ...state,
            currentVideo: action.payload,
        }
    }
    else if(action.type === 'UPDATE_CURRENTVIDEOKEY') {
        return {
            ...state,
            currentVideoKey: action.payload,
        }
    }
    else if(action.type === 'UPDATE_CURRENTVIDEOINDEX') {
        return {
            ...state,
            currentVideoIndex: action.payload,
        }
    }
    else if(action.type === 'UPDATE_IMAGEURI') {
        return {
            ...state,
            imageURI: action.payload,
        }
    }
    else if(action.type === 'UPDATE_VIDEOTITLE') {
        return {
            ...state,
            videoTitle: action.payload,
        }
    }
    else if(action.type === 'UPDATE_VIDEOCHANNEL') {
        return {
            ...state,
            videoChannel: action.payload,
        }
    }
    else if(action.type === 'UPDATE_VIDEOLIST_PLAYLIST') {
        return {
            ...state,
            videoListPlaylist: action.payload,
        }
    }
    else if(action.type === 'UPDATE_PLAYLIST_SOURCE') {
        return {
            ...state,
            playlistSource: action.payload,
        }
    }
    else if(action.type === 'UPDATE_ALL_SONGS') {
        return {
            ...state,
            allSongs: action.payload,
        }
    }
    else if(action.type === 'UPDATE_RELATED_VIDEOS') {
        let tempRelatedVideos = action.payload;
        for(let i = 0; i < tempRelatedVideos.length; i++) {
            const currentVideo = tempRelatedVideos[i];
            const uri = currentVideo.uri ? currentVideo.uri : currentVideo.id;
            let songExistsInPhone = songExists(state.allSongs, uri, state.sourceIsAudio);
            songExistsInPhone = songExistsInPhone.toLowerCase() === 'already downloaded';
            let filteredVideo = state.allSongs.filter(song => song.uri === uri);
            filteredVideo = filteredVideo[0];
            if(!tempRelatedVideos.uri)
                tempRelatedVideos[i].uri = tempRelatedVideos[i].id;
            if(songExistsInPhone && filteredVideo)
                tempRelatedVideos[i] = filteredVideo;
        }
        return {
            ...state,
            relatedVideos: tempRelatedVideos,
        }
    }
    else if(action.type === 'UPDATE_SEARCHLIST_ACTIVE') {
        return {
            ...state,
            searchListActive: action.payload,
        }
    }
    else if(action.type === 'UPDATE_IS_LOADING_SONG') {
        return {
            ...state,
            isLoadingSong: action.payload,
        }
    }
    else if(action.type === 'UPDATE_IS_DOWNLOADING_SONG') {
        return {
            ...state,
            isDownloadingSong: action.payload,
        }
    }
    else if(action.type === 'UPDATE_SEARCHED') {
        return {
            ...state,
            searched: action.payload,
        }
    }
    else if(action.type === 'UPDATE_CURRENT_VIDEO_ITEM') {
        return {
            ...state,
            currentVideoItem: action.payload,
        }
    }
    else if(action.type === 'UPDATE_CURRENT_PLAYLIST_NAME') {
        return {
            ...state,
            currentPlaylistName: action.payload,
        }
    }
    else if(action.type === 'UPDATE_SONG_PROGRESS') {
        return {
            ...state,
            songProgress: action.payload,
        }
    }
    else if(action.type === 'UPDATE_DOWNLOADED_SONGS_LIST') {
        return {
            ...state,
            downloadedSongsList: action.payload,
        }
    }
    else if(action.type === 'UPDATE_DOWNLOADING_VIDEO_KEY') {
        return {
            ...state,
            downloadingVideoKey: action.payload,
        }
    }
    else if(action.type === 'UPDATE_SOURCE_IS_AUDIO') {
        return {
            ...state,
            sourceIsAudio: !state.sourceIsAudio,
        }
    }

    return state;
}

export default rootReducer;