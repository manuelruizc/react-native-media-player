import {createBottomTabNavigator, createAppContainer, createStackNavigator, createDrawerNavigator} from 'react-navigation';
import Downloads from '../components/Downloads';
import Home from '../components/Home';
import Playlists from '../components/Playlists';
import PlaylistOptions from '../components/modals/PlaylistOptions';
import PlaylistSongs from '../components/modals/PlaylistSongs';
import Settings from '../components/Settings';

const DownloadsMenu = createStackNavigator({
    Downloads,
    PlaylistOptions,
    PlaylistSongs
  },{
      headerMode: 'none',
      navigationOptions: {
          headerVisible: false,
      }
  });
  const PlaylistsMenu = createStackNavigator({
    Playlists,
    PlaylistOptions,
    PlaylistSongs
  },{
      headerMode: 'none',
      navigationOptions: {
          headerVisible: false,
      }
  });
  const HomeMenu = createStackNavigator({
    Home,
    PlaylistOptions,
    PlaylistSongs
  },{
      headerMode: 'none',
      navigationOptions: {
          headerVisible: false,
      }
  });
  
const MyDrawerNavigator = createDrawerNavigator({
    Home: HomeMenu,
    Downloads: DownloadsMenu,
    Playlists: PlaylistsMenu,
    Settings: Settings
  });

export default MyDrawerNavigator;