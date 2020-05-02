import { Card, ListItem } from 'react-native-elements'

import React from "react";
import {LinearGradient} from "expo";
import {ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView, RefreshControl} from "react-native";

export default class PanelAdmin extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            mod_current_email: '',
            mod_new_email: '',
            mod_new_password: '',
            del_usr:'',
            adm_usr: '',
            users_list: [],
            admin_list: [],
            refreshing: false,
            isReady: false,
        };


        this.requestUsers();

        this._refreshView = this._refreshView.bind(this);

        this.updateUserEmail = this.updateUserEmail.bind(this);
        this.createAccount = this.createAccount.bind(this);
        this.deleteAccount = this.deleteAccount.bind(this);
        this.adminAccount = this.adminAccount.bind(this);

    };

    _onRefresh = () => {
        this.setState({refreshing: true});
        this.requestUsers();
        this.setState({refreshing: false})
    };

    _refreshView = () => {
        this.setState({isReady: false});
        this.setState({users_list: []});
        this.setState({admin_list: []});
        this.requestUsers();
    };

    static navigationOptions = () => {
        return {
            title: 'Admin Panel',
        }
    };

    render() {
        if (!this.state.isReady) {
            return (
                <View style={styles.loadingScreen}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )
        }
        return (
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={() => this._onRefresh()}
                    />
                    <Card
                        title="Create Account"
                        titleStyle={styles.titleStyle}>
                        <TextInput style={styles.textInput} placeholder='Email'
                                   onChangeText={ (email) => this.setState({email})}>
                        </TextInput>
                        <TextInput style={styles.textInput} placeholder='Password' secureTextEntry={true}
                                   onChangeText={ (password) => this.setState({password})}>
                        </TextInput>
                        <LinearGradient colors={['#fc672d', '#ff595d', '#ff5888', '#f764ae', '#dc75ce']}
                                        style={{borderRadius: 40, alignSelf: 'stretch', padding: 16}}
                                        start={[1.0, 1.0]}
                                        end={[0.0, 0.0]}>
                            <TouchableOpacity style={styles.btn} onPress={this.createAccount}>
                                <Text style={styles.btnText}>Create Account</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </Card>
                    <Card
                        title="Modify Account"
                        titleStyle={styles.titleStyle}>
                        <TextInput style={styles.textInput} placeholder='Current Email'
                                   onChangeText={ (mod_current_email) => this.setState({mod_current_email})}>
                        </TextInput>
                        <TextInput style={styles.textInput} placeholder='New Email'
                                   onChangeText={ (mod_new_email) => this.setState({mod_new_email})}>
                        </TextInput>
                        <LinearGradient colors={['#fc672d', '#ff595d', '#ff5888', '#f764ae', '#dc75ce']}
                                        style={{borderRadius: 40, alignSelf: 'stretch', padding: 16}}
                                        start={[1.0, 1.0]}
                                        end={[0.0, 0.0]}>
                            <TouchableOpacity style={styles.btn} onPress={this.updateUserEmail}>
                                <Text style={styles.btnText}>Modify Account</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </Card>
                    <Card
                        title="Delete Account"
                        titleStyle={styles.titleStyle}>
                        <TextInput style={styles.textInput} placeholder='Email Account'
                                   onChangeText={ (del_usr) => this.setState({del_usr})}>
                        </TextInput>
                        <LinearGradient colors={['#fc672d', '#ff595d', '#ff5888', '#f764ae', '#dc75ce']}
                                        style={{borderRadius: 40, alignSelf: 'stretch', padding: 16}}
                                        start={[1.0, 1.0]}
                                        end={[0.0, 0.0]}>
                            <TouchableOpacity style={styles.btn} onPress={this.deleteAccount}>
                                <Text style={styles.btnText}>Delete Account</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </Card>
                    <Card
                        title="Make Account Admin"
                        titleStyle={styles.titleStyle}>
                        <TextInput style={styles.textInput} placeholder='Email Account'
                                   onChangeText={ (adm_usr) => this.setState({adm_usr})}>
                        </TextInput>
                        <LinearGradient colors={['#fc672d', '#ff595d', '#ff5888', '#f764ae', '#dc75ce']}
                                        style={{borderRadius: 40, alignSelf: 'stretch', padding: 16}}
                                        start={[1.0, 1.0]}
                                        end={[0.0, 0.0]}>
                            <TouchableOpacity style={styles.btn} onPress={this.adminAccount}>
                                <Text style={styles.btnText}>Admin Account</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </Card>
                    <Card title="Admin List" titleStyle={styles.titleStyle}>
                        {
                            this.state.admin_list.map((u, i) => {
                                return (
                                    <ListItem
                                        key={i}
                                        //roundAvatar
                                        title={u.email}
                                        //avatar={{uri:u.avatar}}
                                    />
                                );
                            })
                        }
                    </Card>
                    <Card title="Users List" titleStyle={styles.titleStyle}>
                        {
                            this.state.users_list.map((u, i) => {
                                return (
                                    <ListItem
                                        key={i}
                                        //roundAvatar
                                        title={u.email}
                                        //avatar={{uri:u.avatar}}
                                    />
                                );
                            })
                        }
                    </Card>
                </ScrollView>
            </View>
        )
    }

    requestUsers = () => {
        const head = "Bearer " + global.tokenConnectedUser;
        fetch (global.server_ip + '/api/user/users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/JSON',
                'Authorization': head,
            },
        })
            .then((response) => response.json())
            .then((res) => {
                let admin_list = [];
                let user_list = [];
                for (let i = 0; i < res.account.length; i++) {
                    if (res.account[i].admin)
                        admin_list.push({email: res.account[i].email});
                    else
                        user_list.push({email: res.account[i].email})
                }
                this.setState ({
                    admin_list : admin_list
                });
                this.setState ({
                    users_list : user_list
                });
                this.setState({isReady: true})
            })
            .done();
    };

    updateUserEmail = () => {
        const head = "Bearer " + global.tokenConnectedUser;
        if (this.state.mod_current_email === '' || this.state.mod_new_email === '') {
            alert('Please enter all fields');
            return
        }
        fetch(global.server_ip + '/api/user/email?email=' + this.state.mod_current_email + '&newemail=' + this.state.mod_new_email, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/JSON',
                'Authorization' : head
            }
        })
            .then((res) => res.json())
            .then(() => {
                alert('New email has been assigned');
                this._refreshView()
            })
            .catch((err) => alert(err))
    };

    createAccount = () => {
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
                    this._refreshView()
                }
                else {
                    alert(res.message);
                }
            })
            .done();
    };

    deleteAccount = () => {
        const head = "Bearer " + global.tokenConnectedUser;
        fetch (global.server_ip + '/api/user/delete?email=' + this.state.del_usr, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/JSON',
                'Authorization' : head,
            },
        })
            .then((response) => response.json())
            .then((res) => {
                if (res.status === true) {
                    alert("Account Successfully deleted");
                    this._refreshView()                }
                else {
                    alert(res.message);
                }
            })
            .catch(() => alert('Please enter valid email'))
            .done();
    };

    adminAccount = () => {
        const head = 'Bearer ' + global.tokenConnectedUser;
        fetch(global.server_ip + '/api/user/admin?email=' + this.state.adm_usr + '&status=true', {
            method: 'PUT',
            headers: {
                'Accept': 'application/JSON',
                'Authorization' : head,
            }
        })
            .then((response) => response.json())
            .then((res) => {
                alert(res.message);
                this._refreshView();
            })
            .catch(() => alert('Please enter valid email that is not an admin currently'))
            .done();
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingLeft: 40,
        paddingRight: 40,
    },
    loadingScreen: {
        flex: 1,
        backgroundColor: '#fff',
        paddingLeft: 40,
        paddingRight: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: 24,
        marginBottom: 60,
        color: '#FC672D',
        fontWeight: 'bold'
    },
    btn: {
        borderRadius: 0,
        marginLeft: 0,
        marginRight: 0,
        marginBottom: 0,
        color: '#FFF'
    },
    btnText: {
        display: 'flex',
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold',
    },
    titleStyle: {
        color: '#FC672D'
    },
    textInput: {
        alignSelf: 'stretch',
        alignItems: 'center',
        height: 36,
        color: 'black',
        borderBottomColor: '#FC672D',
        borderBottomWidth: 1,
        fontSize: 16,
        marginBottom: 30,
        marginTop: 20
    },
});
