import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    KeyboardAvoidingView,
    TouchableOpacity,
    AsyncStorage,
} from 'react-native';

export default class SignUp extends React.Component {

    static navigationOptions = () => {
        return {
            headerTransparent: true,
            headerTintColor: '#9460a6',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        };
    };


    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        };
    }

    componentDidMount() {
        this._loadInitialState().done();
    }

    _loadInitialState = async () => {
        const token = await AsyncStorage.getItem('user_token');
        const id = await AsyncStorage.getItem('user_id');
        if (token !== null && id !== null) {
            this.props.navigation.navigate('AppNavigator')
        }
    };

    render() {
        return (
            <KeyboardAvoidingView behavior='padding' style={styles.wrapper}>
                {/*<ImageBackground source={require('../assets/images/background_login.jpg')} style={{width: '100%', height: '100%'}}>*/}
                    <View style={styles.container}>

                        <Text style={styles.header}>
                            - SIGN UP -
                        </Text>
                            <TextInput style={styles.textInput} placeholder='Email'
                                       onChangeText={ (email) => this.setState({email})}>
                            </TextInput>

                            <TextInput style={styles.textInput} placeholder='Password'
                                       secureTextEntry={true} onChangeText={ (password) => this.setState({password})}>

                            </TextInput>

                        <TouchableOpacity style={styles.btn} onPress={this.signUp}>
                            <Text style={styles.btnText}>Sign up</Text>
                        </TouchableOpacity>

                    </View>
                {/*</ImageBackground>*/}
            </KeyboardAvoidingView>
        );
    }

    signUp = () => {
        fetch (global.server_ip + '/api/user/new', {
            method: 'POST',
            headers: {
                'Accept': 'application/JSON',
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
            })
        })
            .then((response) => response.json())
            .then((res) => {
                if (res.status === true) {
                    alert("Account Successfully create");
                    //this.props.navigation.navigate('Login');
                }
                else {
                    alert(res.message);
                }
            })
            .done();
    }

};

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
    header: {
        fontSize: 54,
        marginBottom: 60,
        color: '#FC672D',
        fontWeight: 'bold'
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
    },
});
