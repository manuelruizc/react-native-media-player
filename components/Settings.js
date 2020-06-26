import React, { Component } from 'react';
import { View, Switch } from 'react-native';

class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    changeSource = (songData) => {
        this.props.screenProps.changeSource();
        const self = this;
        let {switchValue} = this.props.screenProps;
        switchValue = !switchValue;
        if(songData != null) {
            const pathyCantu = switchValue ? "path" : "videopath";
            const source = songData[pathyCantu];
        
            if(source) {
                if(songData.isDownloaded) {
                    self.props.screenProps.currentVideoURIChange(source);
                    self.props.screenProps.currentVideoURImage(songData.imageURI);
                    self.props.screenProps.changeVideoChannel(songData.uploader);
                    self.props.screenProps.changeVideoTitle(songData.title);
                    self.props.screenProps.playNewSong(false, this.props.screenProps.currentVideoIndex);
                    self.props.screenProps.loadingState(false);
                    self.props.screenProps.changeCurrentVideoUpdate(songData);
                    //self.setState({currentVideo: response.data.uri, currentVideoIndex: index, perro: response.data.uri, isLoading:false, currentVideoTitle: title, videos: newStateVideos, paused: false});
                }
            }
            else {
                const uri = this.props.screenProps.currentVideoItem.uri;
                //replayVideo
                self.props.screenProps.stop()
                /*this.props.screenProps.loadingState(true)
                axios.get(`https://sellosylaserinkprint.com/debbiedowner/scrap/videoinfo/${uri}`)
                .then(function (response) {
                    const source = switchValue ? response.data.formats[0].url : response.data.formats[1].url;
                    self.props.screenProps.currentVideoURIChange(source);
                    self.props.screenProps.currentVideoURImage(response.data.thumbnail);
                    self.props.screenProps.changeVideoChannel(response.data.uploader);
                    self.props.screenProps.changeVideoTitle(response.data.title);
                    self.props.screenProps.playNewSong(false, this.props.screenProps.currentVideoIndex ? this.props.screenProps.currentVideoIndex : null);
                    self.props.screenProps.loadingState(false);
                    self.props.screenProps.changeCurrentVideoUpdate(songData);
                    //self.setState({currentVideo: response.data.uri, currentVideoIndex: index, perro: response.data.uri, isLoading:false, currentVideoTitle: title, videos: newStateVideos, paused: false});
                })
                .catch(function (error) {
                    console.log(error);
                });*/
            }
        }

        
    }

    render() { 
        return (
        <View style={{width:'100%', height:'100%', backgroundColor:'black', alignItems:'center', justifyContent:'center'}}>
            <Switch onValueChange={() => this.changeSource(this.props.screenProps.currentVideoItem)} value={this.props.screenProps.switchValue} />
        </View>
        );
    }
}
 
export default Settings;