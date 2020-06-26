import React, { Component } from 'react';
import { View, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return (
            <View
            style={{width:'100%', height:'12%', flexDirection:'row', justifyContent:'space-between', alignItems:'center',}}>
                <TouchableOpacity style={{marginLeft:20}} onPress={this.props.navigation.openDrawer}>
                    <Icon name={"ios-menu"} size={30} color={"white"} />
                </TouchableOpacity>
                <View
                    style={{width:'80%', height:'65%', borderTopLeftRadius:900, borderBottomLeftRadius:900, backgroundColor:'rgba(0, 0, 0, 0.18)', flexDirection:'row', alignItems:'center', justifyContent:'space-between',}}>
                    <Icon name={"ios-search"} size={20} color={"white"} style={{width:'5%', marginLeft:10,}} />
                    <TextInput style={{width:'95%', height:'100%', borderColor:'white', paddingLeft:15, fontSize:14, color: 'white'}}
                    onChangeText={(text) => {
                        this.props.changeText(text);
                        this.props.searchVideo(text);
                    }
                    }
                    placeholder={"Search videos..."}
                    placeholderTextColor={"#A094A0"}
                    value={this.props.text} />
                </View>
                {//<TouchableOpacity style={{width:'10%', marginRight:'8%'}} onPress={this.emptyText} >
                    //<Icon name={"ios-close-circle"} size={22} color={"#FF2C2C"} />
                //</TouchableOpacity>
                }
            </View>
        );
    }
}
 
export default Header;