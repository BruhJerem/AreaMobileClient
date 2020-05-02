import React from 'react';
import {
    ActivityIndicator,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    RefreshControl,
    Button, AsyncStorage
} from 'react-native';
import {Card} from "react-native-elements";
import {LinearGradient, AuthSession} from "expo";
import { Facebook } from 'expo';

import api_key from "../api_key";

function githubTokenFromLink(githubToken) {
    if (githubToken === undefined) {
        return undefined
    }
    const tab = githubToken.split('&');
    let content;
    console.log(tab);
    for (let i = 0; i < tab.length; i++) {
        content = tab[i].split('=');
        if (content[0] === "access_token") {
            return content[1]
        }
    }
    return undefined;
}

export default class Profile extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        if (global.admin === 'true') {
            return {
                title: 'Profile',
                headerRight: (
                    <Button
                        onPress={() => params.logout()}
                        title="Logout"
                        color="blue"
                    />
                ),
                headerLeft: (
                    <Button
                        onPress={() => params.goToAdmin()}
                        title="Admin"
                        color="blue"
                    />
                )
            }
        } else {
            return {
                title: 'Profile',
                headerRight: (
                    <Button
                        onPress={() => params.logout()}
                        title="Logout"
                        color="blue"
                    />
                ),
            }
        }

    };

    componentDidMount() {
        this.props.navigation.setParams({ logout: this.logout });
        this.props.navigation.setParams({ goToAdmin: this.goToAdmin });
    }

    constructor(props) {
        super(props);
        this.state = {
            availableServices: [],
            token: -1,
            nbServices : -1,

            serviceToken: -1,
            allTokenLoaded: false,
            allToken: {},
            nbTokenLoaded: 0,

            refreshing: false,
        };
        // Get all services from Server
        this.requestServices();

        this.requestAllServiceToken = this.requestAllServiceToken.bind(this);
        this.renderRow = this.renderRow.bind(this);
        this.connectToService = this.connectToService.bind(this);
        this.disconnectToService = this.disconnectToService.bind(this);
        this.logout = this.logout.bind(this);
        this.goToAdmin = this.goToAdmin.bind(this);

        // When new Service added, bind new function api
        this.authGithub = this.authGithub.bind(this);
        this.authTrello = this.authTrello.bind(this);
        this.authInsta = this.authInsta.bind(this);
        this.authTwitch = this.authTwitch.bind(this);
        this.authGmail = this.authGmail.bind(this);
        this.authFacebook = this.authFacebook.bind(this);
        this.authDiscord = this.authDiscord.bind(this);

    }

    _onRefresh = () => {
        this.setState({refreshing: true});
        this.setState({nbTokenLoaded: 0});
        this.requestServices();
        this.forceUpdate();
        console.log("Refresh !");
        this.setState({refreshing: false})

    };

    renderRow ({ item }) {

        if (this.state.allToken[item] !== -1) {
            console.log(item + " is connected");
            return (
                <Card
                    title={item}
                    titleStyle={styles.titleStyle}>
                    <LinearGradient colors={['#fc672d', '#ff595d', '#ff5888', '#f764ae', '#dc75ce']}
                                    style={{borderRadius: 40, alignSelf: 'stretch', padding: 16}}
                                    start={[1.0, 1.0]}
                                    end={[0.0, 0.0]}>

                        <TouchableOpacity style={styles.btn}>
                            <Text style={styles.btnText} onPress={() => this.disconnectToService(item)}>Disconnect to {item}</Text>

                        </TouchableOpacity>
                    </LinearGradient>
                </Card>
            )
        }
        // Here the function couldn't found a token for the item
        else {
            return (
                <Card
                    title={item}
                    titleStyle={styles.titleStyle}>
                    <LinearGradient colors={['#fc672d', '#ff595d', '#ff5888', '#f764ae', '#dc75ce']}
                                    style={{borderRadius: 40, alignSelf: 'stretch', padding: 16}}
                                    start={[1.0, 1.0]}
                                    end={[0.0, 0.0]}>

                        <TouchableOpacity style={styles.btn}>
                            <Text style={styles.btnText} onPress={() => this.connectToService(item)}>Connect
                                to {item}</Text>

                        </TouchableOpacity>
                    </LinearGradient>
                </Card>
            )
        }
    }

    render() {
        if ((this.state.nbServices === -1 || this.state.nbTokenLoaded !== this.state.nbServices) && !this.state.refreshing) {
            return (
                <View style={styles.loadingScreen}>
                    <ActivityIndicator size="large" color="#0000ff"/>
                </View>
            )
        } else {
            return (
                <View style={styles.container}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={() => this._onRefresh()}
                            />
                        }
                    >
                        <FlatList
                            data={this.state.availableServices}
                            renderItem={this.renderRow}
                            keyExtractor={item => item}
                        />
                    </ScrollView>
                </View>
            );
        }
    }

    goToAdmin() {
        this.props.navigation.navigate('PanelAdmin')
    }

    logout = () => {
        console.log("Logout");
        AsyncStorage.removeItem('user_token');
        AsyncStorage.removeItem('user_id');
        //AsyncStorage.removeItem('admin');
        this.props.navigation.navigate('Login')
    };

    requestServices = () => {
        const head = "Bearer " + global.tokenConnectedUser;
        fetch (global.server_ip + '/api/services', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/JSON',
                'Authorization': head,
            },
        })
            .then((response) => response.json())
            .then((res) => {
                this.setState({
                    availableServices : res.services,
                });
                this.setState({
                    nbServices : this.state.availableServices.length,
                });
            })
            .then(() => this.requestAllServiceToken())
            .done();
    };

    requestServiceToken = async (serviceName) => {
        console.log("Get token for " + serviceName);
        const head = "Bearer " + global.tokenConnectedUser;
        const link = global.server_ip + '/api/getoauthtoken?service=' + serviceName;
        await fetch (link, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/JSON',
                'Authorization': head,
            },
        })
            .then((response) => response.json())
            .then((res) => {
                let tmp = this.state.allToken;
                if (res.status === true) {
                    tmp[serviceName] = res.token.token;
                } else {
                    tmp[serviceName] = -1;
                }
                this.setState({allToken: tmp});
                this.setState({nbTokenLoaded: this.state.nbTokenLoaded + 1})
            })
            .catch((err) => console.log(err))
            .done()
    };

    requestAllServiceToken = async () => {
        for (let i = 0; i < this.state.availableServices.length; i++) {
            await this.requestServiceToken(this.state.availableServices[i]);
        }
    };

    saveOAuthToken = async (serviceName, serviceToken) => {
        const head = "Bearer " + global.tokenConnectedUser;
        const link = global.server_ip + '/api/saveoauthtoken';
        console.log("AUTH into Server");
        console.log(serviceName);
        console.log(serviceToken);

        await fetch (link, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/JSON',
                'Authorization' : head,
            },
            body: JSON.stringify({
                service: serviceName,
                token: serviceToken.toString(),
            }),
        })
            .then(() => {
                this._onRefresh();
            })
            .catch((err) => console.log(err))
            .done()
    };

    disconnectToService = (item) => {
        const head = "Bearer " + global.tokenConnectedUser;
        const url = global.server_ip + '/api/deletetoken?service=' + item;
        fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/JSON',
                'Authorization': head
            }
        })
            .then((res) => console.log(res))
            .then(() => {
                let tmp = this.state.allToken;
                tmp[item] = -1;
                this.setState({allToken: tmp});
                this._onRefresh()
            })
    };

    connectToService = (serviceName) => {
        switch (serviceName) {
            case "Github":
                this.authGithub();
                break;
            case "Trello":
                this.authTrello();
                break;
            case "Instagram":
                this.authInsta();
                break;
            case "Twitch":
                this.authTwitch();
                break;
            case "Gmail":
                this.authGmail();
                break;
            case "Facebook":
                this.authFacebook();
                break;
            case "Discord":
                this.authDiscord();
                break;
            default:
                console.log("Not implemented yet")
        }
    };

    authDiscord = async () => {
        const apiKey = api_key.Discord.client_id;
        const redirectUrl = AuthSession.getRedirectUrl();
        const random_key = '5606186033';
        let url = 'https://discordapp.com/api/oauth2/authorize?client_id=' + apiKey + '&redirect_uri=' + encodeURIComponent(redirectUrl)+ '&response_type=code&scope=messages.read&state=' + random_key;
        let result = await AuthSession.startAsync({
            authUrl: url
        });
        if (result.type === 'success') {
            console.log('Auth Discord Successfull');
            console.log(result);
            url = 'https://discordapp.com/api/oauth2/token?client_id=' + apiKey + '&client_secret=' + api_key.Discord.secret_key + '&grant_type=authorization_code&code='+result.params.code+'&redirect_uri='+redirectUrl+'&scope=messages.read&state='+random_key;
            await fetch(url, {
                method: 'POST',
                headers: 'x-www-form-urlencoded',
            })
                .then((res) => res.json())
                .then((res) => {
                    this.saveOAuthToken("Discord", res.access_token)
                })
        }
    };

    authFacebook = async () => {
        try {
            const {
                type,
                token,
                expires,
                permissions,
                declinedPermissions,
            } = await Facebook.logInWithReadPermissionsAsync(api_key.Facebook.client_id, {
                permissions: ['public_profile'],
            });
            if (type === 'success') {
                console.log('Auth Facebook Successfull');
                await this.saveOAuthToken("Facebook", token)
            }
        } catch ({ message }) {
            alert(`Facebook Login Error: ${message}`);
        }
    };

    authGmail = async () => {
        const apiKey = api_key.Gmail.client_id;
        const redirectUrl = AuthSession.getRedirectUrl();
        const random_key = '5606186033';
        let url = 'https://accounts.google.com/o/oauth2/auth?client_id=' + apiKey + '&redirect_uri=' + redirectUrl + '&scope=https://www.googleapis.com/auth/analytics.readonly&response_type=code&state=' + random_key;
        let result = await AuthSession.startAsync({
            authUrl: url
        });
        if (result.type === 'success') {
            console.log('Auth Gmail Successfull');
            console.log(result);
            url = 'https://www.googleapis.com/oauth2/v4/token?client_id=' + apiKey + '&client_secret=' + api_key.Gmail.secret_key + '&code=' + result.params.code + '&grant_type=authorization_code&redirect_uri=' + redirectUrl;
            await fetch(url, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/JSON"
                }
            })
                .then((result) => result.json())
                .then((res) => {
                    this.saveOAuthToken("Gmail", res.access_token)
                })
        }
    };

    authTwitch = async () => {
        const apiKey = api_key.Twitch.key;
        const redirectUrl = AuthSession.getRedirectUrl();
        const url = 'https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=' + apiKey + '&redirect_uri=' + redirectUrl + '&scope=user_read';
        let result = await AuthSession.startAsync({
            authUrl: url
        });
        if (result.type === 'success') {
            console.log('Auth Twitch Successfull');
            console.log(result);
            await this.saveOAuthToken("Twitch", result.params.access_token)
        }
    };

    authInsta = async () => {
        const apiKey = api_key.Instagram.client_id;
        const redirectUrl = AuthSession.getRedirectUrl();
        let url = 'https://api.instagram.com/oauth/authorize?client_id=' + apiKey + '&redirect_uri=' + redirectUrl +'&response_type=token';
        let result = await AuthSession.startAsync({
            authUrl: url
        });
        if (result.type === 'success') {
            console.log('Auth Insta Successfull');
            await this.saveOAuthToken("Instagram", result.params.access_token)
        }
    };

    authTrello = async () => {
        const apiKey = api_key.Trello.key;
        const redirectUrl = AuthSession.getRedirectUrl();
        const url = 'https://trello.com/1/authorize?expiration=never&name=AreaProject&scope=read,write&response_type=token&key=' + apiKey + '&return_url=' + redirectUrl;
        let result = await AuthSession.startAsync({
            authUrl: url
        });

        if (result.type === 'success') {
            console.log("Auth Trello Successful");
            console.log(result);
            console.log(this.state.availableServices);
            await this.saveOAuthToken("Trello", result.params.token)
        }
    };

    authGithub = async () => {
        const clientID = api_key.Github.key;
        const clientSecret = api_key.Github.secret_key;
        const randomString = "5606186033";

        let redirectUrl = AuthSession.getRedirectUrl();
        let result = await AuthSession.startAsync({
            authUrl:
                `https://github.com/login/oauth/authorize?` +
                `&client_id=${clientID}` +
                `&scope=repo` +
                `&state=${randomString}` +
                `&redirect_uri=${encodeURIComponent(redirectUrl)}`,
        });

        if (result.type === "success") {
            console.log("Auth successfull");
            console.log(result);
            const url = 'https://github.com/login/oauth/access_token?client_id=' + clientID + '&client_secret=' + clientSecret + '&code=' + result.params.code + '&state=' + randomString + '&redirect_uri=' + encodeURIComponent(redirectUrl);
            await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                /*.then((res) => res.json())*/
                .then(async (response) => {
                    console.log(response)
                    this.saveOAuthToken("Github", await githubTokenFromLink(response._bodyText))

                })
                .catch((err) => console.log(err))
                .done()
        }
    };
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
    btnBottom: {
        borderRadius: 0,
        marginLeft: 0,
        marginRight: 0,
        marginBottom: 10,
        color: '#FFF',
    },
    btnText: {
        display: 'flex',
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold',
    },
    titleStyle: {
        color: '#FC672D'
    }
});
