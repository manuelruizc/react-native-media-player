import MusicControl from 'react-native-music-control';

export const initialServiceSetup = (playpause, playNextSong) => {
    const self = this;
    MusicControl.enableBackgroundMode(true);
    // MusicControl.handleAudioInterruptions(true);
    MusicControl.on('play', ()=> {
      playpause();
    });

    MusicControl.on('pause', ()=> {
      playpause();
    });

    MusicControl.on('nextTrack', ()=> {
      playNextSong();
    });

    MusicControl.on('previousTrack', ()=> {
      playNextSong(true);
    });
}