import { AsyncStorage } from 'react-native';

export const deleteSongFromPlaylist = async () => {
    let jsonSongs = await AsyncStorage.getItem('Songs');
    return;
    if(!jsonSongs) return 'Is empty';
    jsonSongs = JSON.parse(jsonSongs);
    jsonSongs.forEach((store, index) => {
        if(index == 0) {
            jsonSongs = store[1];
            jsonSongs = JSON.parse(jsonSongs);
            jsonSongs = jsonSongs.map(json => {
                if(json.uri == key) {
                    let playlist = json.playlist;
                    playlist = playlist.filter(play => play != playlistName);
                    json["playlist"] = playlist;
                    return json;
                }
                return json;
            });
            jsonSongs = jsonSongs.filter(song => song.playlist.length > 0);
        }
    });

};