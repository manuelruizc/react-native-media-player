/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {View, TouchableOpacity, TextInput} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <View
        style={{
          width: '100%',
          height: '12%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor:'#111111',
        }}>
        <TouchableOpacity
          style={{marginLeft: 20}}
          onPress={this.props.navigation.openDrawer}>
          <Icon name={'ios-menu'} size={30} color={'#333'} />
        </TouchableOpacity>
        <View
          style={{
            width: '80%',
            height: '65%',
            borderTopLeftRadius: 900,
            borderBottomLeftRadius: 900,
            backgroundColor: 'red',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Icon
            name={'ios-search'}
            size={20}
            color={'rgba(0, 0, 0, 0.4)'}
            style={{width: '5%', marginLeft: 10}}
          />
          <TextInput
            style={{
              width: '95%',
              height: '100%',
              borderColor: 'white',
              paddingLeft: 15,
              fontSize: 14,
              color: 'white',
            }}
            onChangeText={text => {
              this.props.changeText(text);
              this.props.searchVideo(text);
            }}
            placeholder={'Search videos...'}
            placeholderTextColor={'rgba(0, 0, 0, 0.4)'}
            value={this.props.text}
          />
        </View>
      </View>
    );
  }
}

export default Header;
