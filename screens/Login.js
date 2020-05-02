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

export default class Login extends React.Component {

    static navigationOptions = () => {
        return {
            header: null
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
        }
    }

    componentDidMount() {
        this._loadInitialState().done();
    }

    _loadInitialState = async () => {
        try {
            const token = await AsyncStorage.getItem('user_token');
            const id = await AsyncStorage.getItem('user_id');
            const server_ip = await AsyncStorage.getItem('server_ip');
            const isAdmin = await AsyncStorage.getItem('admin');
            if (server_ip === null) {
                alert('Please choose a server IP in settings')
                return
            }
            global.server_ip = server_ip;
            if (token !== null && id !== null && isAdmin !== null) {
                global.tokenConnectedUser = token;
                global.idConnectedUser = id;
                global.admin = isAdmin
                await this.props.navigation.navigate('TabNav')
            }
        }
        catch (e) {
            await alert(e);
        }
    };

    render() {
        return (
            <KeyboardAvoidingView behavior='padding' style={styles.wrapper}>

                    <View style={styles.container}>

                        <Text style={styles.header}>
                            - LOGIN -
                        </Text>

                        <TextInput style={styles.textInput} placeholder='Username'
                               onChangeText={ (username) => this.setState({username})}>
                        </TextInput>

                        <TextInput style={styles.textInput} placeholder='Password'
                                   secureTextEntry={true} onChangeText={ (password) => this.setState({password})}>

                        </TextInput>

                        <TouchableOpacity style={styles.btn} onPress={this.login}>
                            <Text style={styles.btnText}>Log in</Text>
                        </TouchableOpacity>

                        <Text style={{color: '#9460a6', paddingTop: 20, fontWeight: 'bold', fontSize: 14}}
                              onPress={() => this.props.navigation.navigate('SignUp')}>
                            No account yet? Sign-Up for free!
                        </Text>
                        <Text style={{color: '#9460a6', paddingTop: 20, fontWeight: 'bold', fontSize: 14}}
                              onPress={() => this.props.navigation.navigate('LoginSettings')}>
                            Settings
                        </Text>
                    </View>

            </KeyboardAvoidingView>
        );
    }



    login = () => {
        fetch (global.server_ip + '/api/user/login', {
            method: 'POST',
            headers: {
                //'Accept': 'application/JSON',
                'Content-Type': 'application/JSON',
            },
            body: JSON.stringify({
                email: this.state.username,
                password: this.state.password,
            }),
        })
            .then((response) => response.json())
            .then((res) => {
                console.log(res)
                if (res.status === true) {
                    AsyncStorage.setItem('user_token', res.account.token);
                    AsyncStorage.setItem('user_id', res.account.ID.toString());
                    AsyncStorage.setItem('admin', res.account.admin.toString());

                    global.tokenConnectedUser = res.account.token;
                    global.idConnectedUser = res.account.ID.toString();
                    global.admin = res.account.admin.toString();

                    this.props.navigation.navigate('TabNav');
                }
                else {
                    alert(res.message);
                }
            })
            .catch((err) => {
                alert(err);
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
    loadingScreen: {
        flex: 1,
        backgroundColor: '#FC672D',
        paddingLeft: 40,
        paddingRight: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
