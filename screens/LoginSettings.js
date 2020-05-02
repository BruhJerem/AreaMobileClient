import React from 'react';
import {KeyboardAvoidingView, StyleSheet, TextInput, TouchableOpacity, View, Text, AsyncStorage} from "react-native";

export default class LoginSettings  extends React.Component {

    static navigationOptions = () => {
        return {
            title: 'Server Settings',
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            // Default IP : http://193.70.90.129:8080
            ip: global.server_ip,
        };
        this._submit = this._submit.bind(this)
    }

    componentDidMount() {
        this._loadInitialState().done()
    }

    _loadInitialState = async () => {
        const server_ip = await AsyncStorage.getItem('server_ip');
        global.server_ip = server_ip;
        this.setState({
            ip: server_ip
        })
    };

    _submit = () => {
        console.log("Submit");
        if (global.server_ip !== this.state.ip) {
            global.server_ip = this.state.ip;
            AsyncStorage.setItem('server_ip', global.server_ip);
            alert('Server IP has been updated');
        }
        this.props.navigation.navigate('Login')
    };

    _setDefault = () => {
        this.setState({
            ip: 'http://193.70.90.129:8080'
        })
    };

    render() {
        return (
            <KeyboardAvoidingView behavior='padding' style={styles.wrapper}>
                <View style={styles.container}>
                    <TextInput style={styles.textInput} placeholder='Server IP' value={this.state.ip}
                               onChangeText={ (ip) => this.setState({ip})}>
                    </TextInput>
                    <TouchableOpacity style={styles.btn} onPress={this._submit}>
                        <Text style={styles.btnText}>Submit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btn} onPress={this._setDefault}>
                        <Text style={styles.btnText}>Set Default Server</Text>
                    </TouchableOpacity>

                </View>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 40,
        paddingRight: 40,
        backgroundColor: 'white'
    },
    textInput: {
        alignSelf: 'stretch',
        padding: 16,
        alignItems: 'center',
        fontWeight: 'bold',
        height: 47,
        color: '#9460a6',
        borderBottomColor: '#FC672D',
        borderBottomWidth: 3,
        fontSize: 16,
        marginBottom: 30,
    },
    btn: {
        padding: 16,
        fontWeight: 'bold',
        borderRadius: 40,
        alignSelf: 'stretch',
        marginTop: 60,
        borderColor: '#FC672D',
        borderWidth: 4,
    },
    btnText: {
        display: 'flex',
        textAlign: 'center',
        color: '#9460a6',
        fontWeight: 'bold',
        fontSize: 19,
    }
});
