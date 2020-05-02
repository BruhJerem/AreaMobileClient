import React from "react";
import {Card, Text} from "react-native-elements";
import {StyleSheet, View, FlatList, ActivityIndicator, ScrollView, RefreshControl, TextInput} from "react-native";
import { Dropdown } from 'react-native-material-dropdown';
import { Switch } from 'react-native-switch';
import DropdownAlert from 'react-native-dropdownalert';

import api_key from "../api_key";

export default class ServicesAreaSettings extends React.Component {
    static navigationOptions = () => {
        return {
            title: 'Settings',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            componentReady: false,
            activeSwitch: false,
            tokens: {},

            data: [],

            action_data: [],
            action_select: null,

            reaction_data: [],
            reaction_select: null,

            switchDisableStatus: false,

            facebookContent: null,
            item: {},
            iddrop : [],
            namedrop : [],

            discordContent: null,

        };

        this._renderItem = this._renderItem.bind(this);
        this.requestServiceToken = this.requestServiceToken.bind(this);
        this.updateAction = this.updateAction.bind(this);
        this._refresh = this._refresh.bind(this);
        this.requestAllServiceToken = this.requestAllServiceToken.bind(this);

        this.getRepoGithub = this.getRepoGithub.bind(this);
        this.getBoardsTrello = this.getBoardsTrello.bind(this);
        this.getFollowsChannelTwitch = this.getFollowsChannelTwitch.bind(this)

    }

    requestAllServiceToken = async () => {
        for (let i = 0; i < this.state.data.length; i++) {
             await this.requestServiceToken(this.state.data[i], i, this.state.data.length - 1);
        }
    };

    async componentDidMount() {
        try {
            const {navigation} = this.props;
            const item = navigation.getParam('item', '');
            if (item === '') {
                navigation.goBack()
            }
            let arr;
            if (item.reaction === 'Mail' || item.reaction === null)
                arr = [item.action];
            else
                arr = [item.action, item.reaction];
            console.log(item)
            await this.setState({data: arr});
            this.setState({activeSwitch: item.isActive});
            this.setState({item: item});
            this.requestAllServiceToken()
        }
        catch {
            console.log('WTF')
        }
    }

    _refresh = () => {
        this.setState({refreshing: true});
        this.requestAllServiceToken();
        this.forceUpdate();
        this.setState({refreshing: false});
    };

    _renderItem = ({item}) => {
        switch (item) {
            case "Github":
                // Here action DATA
                if (item === this.state.data[0]) {
                    if (this.state.action_data.length === 0) {
                        return (
                            <View style={styles.loadingScreen}>
                                <ActivityIndicator size="large" color="#0000ff" />
                            </View>
                        )
                    }
                    return (
                        <Card
                            title={"Github"}
                            titleStyle={styles.titleStyle}>
                            <Dropdown
                                label='Repo Github'
                                data={this.state.action_data}
                                value={this.state.action_select}
                                onChangeText={(res) => {
                                    let tmp = this.state.item;
                                    tmp['settingsaction'] = ['GithubRepoName', res];
                                    this.setState({action_select: res});
                                    this.setState({item: tmp})
                                }}
                            />
                        </Card>
                    )
                } else {
                    if (this.state.reaction_data.length === 0) {
                        return (
                            <View style={styles.loadingScreen}>
                                <ActivityIndicator size="large" color="#0000ff" />
                            </View>
                        )
                    }
                    return (
                        <Card
                            title={"Github"}
                            titleStyle={styles.titleStyle}>
                            <Dropdown
                                label='Repo Github'
                                data={this.state.reaction_data}
                                value={this.state.reaction_select}
                                onChangeText={(res) => {
                                    let tmp = this.state.item;
                                    this.setState({reaction_select: res});
                                    tmp['settingsreaction'] = ['GithubRepoName', res];
                                    this.setState({item: tmp})
                                }}
                            />
                        </Card>
                    )
                }
            case "Trello":
                // Action DATA

                if (item === this.state.data[0]) {
                    if (this.state.action_data.length === 0) {
                        return (
                            <View style={styles.loadingScreen}>
                                <ActivityIndicator size="large" color="#0000ff" />
                            </View>
                        )
                    }
                    return (
                        <Card
                            title={"Trello"}
                            titleStyle={styles.titleStyle}>
                            <Dropdown
                                label='Trello Boards'
                                data={this.state.action_data}
                                value={this.state.action_select}
                                onChangeText={(res) => {
                                    let tmp = this.state.item;
                                    let x = 0;
                                    for (let i = 0 ; i < this.state.namedrop.length ; i++) {
                                        if (this.state.namedrop[i] === res) {
                                            x = i;
                                        }
                                    }
                                    tmp['settingsaction'] = ['TrelloBoardName', this.state.iddrop[x]];
                                    this.setState({action_select: res});
                                    this.setState({item: tmp});
                                }}
                            />
                        </Card>
                    )
                } else {
                    if (this.state.reaction_data.length === 0) {
                        return (
                            <View style={styles.loadingScreen}>
                                <ActivityIndicator size="large" color="#0000ff" />
                            </View>
                        )
                    }
                    return (
                        <Card
                            title={"Trello"}
                            titleStyle={styles.titleStyle}>
                            <Dropdown
                                label='Trello Boards'
                                data={this.state.reaction_data}
                                value={this.state.reaction_select}
                                onChangeText={(res) => {
                                    let tmp = this.state.item;
                                    let x = 0;
                                    for (let i = 0 ; i < this.state.namedrop.length ; i++) {
                                        if (this.state.namedrop[i] === res) {
                                            x = i;
                                        }
                                    }
                                    tmp['settingsreaction'] = ['TrelloBoardName', this.state.iddrop[x]];
                                    this.setState({reaction_select: res});
                                    this.setState({item: tmp});
                                }}
                            />
                        </Card>
                    )
                }
            case "Twitch":
                if (item === this.state.data[0]) {
                    if (this.state.action_data.length === 0) {
                        return (
                            <View style={styles.loadingScreen}>
                                <ActivityIndicator size="large" color="#0000ff" />
                            </View>
                        )
                    }
                    return (
                        <Card
                            title={"Twitch"}
                            titleStyle={styles.titleStyle}>
                            <Dropdown
                                label='Twitch Follower'
                                data={this.state.action_data}
                                value={this.state.action_select}
                                onChangeText={(res) => {
                                    let tmp = this.state.item;
                                    tmp['settingsaction'] = ['TwitchFollowName', res];
                                    this.setState({action_select: res});
                                    this.setState({item: tmp})
                                }}
                            />
                        </Card>
                    )
                } else {
                    if (this.state.reaction_data.length === 0) {
                        return (
                            <View style={styles.loadingScreen}>
                                <ActivityIndicator size="large" color="#0000ff" />
                            </View>
                        )
                    }
                    return (
                        <Card
                            title={"Twitch"}
                            titleStyle={styles.titleStyle}>
                            <Dropdown
                                label='Twitch Follower'
                                data={this.state.reaction_data}
                                value={this.state.reaction_select}
                                onChangeText={(res) => {
                                    let tmp = this.state.item;
                                    tmp['settingsreaction'] = ['TwitchFollowName', res];
                                    this.setState({reaction_select: res});
                                    this.setState({item: tmp})
                                }}
                            />
                        </Card>
                    )
                }
            case 'Facebook':
                if (item === this.state.data[0]) {
                    return (
                        <Card
                            title={"Facebook"}
                            titleStyle={styles.titleStyle}>
                            <TextInput style={styles.textInput} placeholder='Facebook post content'
                                       onChangeText={ (facebookContent) => {
                                           this.setState({facebookContent});
                                           if (facebookContent === "")
                                               this.setState({switchDisableStatus: true});
                                           else
                                               this.setState({switchDisableStatus: false});
                                           let tmp = this.state.item;
                                           tmp['settingsaction'] = ['FacebookPostContent', facebookContent];
                                           this.setState({action_select: facebookContent});
                                           this.setState({item: tmp})
                                       }}>
                            </TextInput>
                        </Card>
                    )
                } else {
                    return (
                        <Card
                            title={"Facebook"}
                            titleStyle={styles.titleStyle}>
                            <TextInput style={styles.textInput} placeholder='Facebook post content'
                                       onChangeText={ (discordContent) => {
                                           this.setState({facebookContent});
                                           if (discordContent === "")
                                               this.setState({switchDisableStatus: true});
                                           else
                                               this.setState({switchDisableStatus: false});
                                           let tmp = this.state.item;
                                           tmp['settingsreaction'] = ['FacebookPostContent', facebookContent];
                                           this.setState({reaction_select: facebookContent});
                                           this.setState({item: tmp})
                                       }}>
                            </TextInput>
                        </Card>
                    )
                }
            case 'Discord':
                if (item === this.state.data[0]) {
                    return (
                        <Card
                            title={"Discord"}
                            titleStyle={styles.titleStyle}>
                            <TextInput style={styles.textInput} placeholder='Discord Guild ID'
                                       onChangeText={ (discordContent) => {
                                           this.setState({discordContent});
                                           if (discordContent === "")
                                               this.setState({switchDisableStatus: true});
                                           else
                                               this.setState({switchDisableStatus: false});
                                           let tmp = this.state.item;
                                           tmp['settingsaction'] = ['ChannelID', discordContent];
                                           this.setState({action_select: discordContent});
                                           this.setState({item: tmp})
                                       }}>
                            </TextInput>
                        </Card>
                    )
                } else {
                    return (
                        <Card
                            title={"Discord"}
                            titleStyle={styles.titleStyle}>
                            <TextInput style={styles.textInput} placeholder='Discord Guild ID'
                                       onChangeText={ (discordContent) => {
                                           this.setState({discordContent});
                                           if (discordContent === "")
                                               this.setState({switchDisableStatus: true});
                                           else
                                               this.setState({switchDisableStatus: false});
                                           let tmp = this.state.item;
                                           tmp['settingsreaction'] = ['ChannelID', discordContent];
                                           this.setState({reaction_select: discordContent});
                                           this.setState({item: tmp})
                                       }}>
                            </TextInput>
                        </Card>
                    )
                }

        }
    };

    render() {
        if (this.state.item === '') {
            alert("An error has occured. Please try again.");
            this.props.navigation.goBack();
        }

        if (!this.state.componentReady) {
            return (
                <View style={styles.loadingScreen}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )
        }
        return (
            <ScrollView style={{backgroundColor: '#fff'}}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={() => this._refresh()}
                            />
                        }
            >
                <View style={{marginBottom: 80}}>
                    <DropdownAlert showCancel={true} ref={ref => this.dropdown = ref} />
                </View>
                <Text style={styles.textCenter}>{this.state.item.data}</Text>
                <FlatList
                    data={this.state.data}
                    renderItem={this._renderItem}
                    keyExtractor={item => item}
                />
                <View style={styles.bottom}>
                    <Card
                        title={"Active"}
                        titleStyle={styles.titleStyle}>
                        <View style={ styles.switchContainer }>
                            <Switch
                                value={this.state.activeSwitch}
                                disabled={this.state.switchDisableStatus}
                                onValueChange={async (val) => {
                                    console.log('Update');
                                    this.setState({activeSwitch: val});
                                    this.updateAction();
                                }}
                                activeText={'On'}
                                inActiveText={'Off'}
                                circleSize={30}
                                barHeight={1}
                                circleBorderWidth={3}
                                backgroundActive={'green'}
                                backgroundInactive={'gray'}
                                circleActiveColor={'#FC672D'}
                                circleInActiveColor={'#000000'}
                                innerCircleStyle={{ alignItems: "center", justifyContent: "center" }}
                            />
                        </View>
                    </Card>
                </View>
            </ScrollView>
        )
    }

    requestServiceToken = async (serviceName, index, endIndex)=> {
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
                //console.log(res);
                if (res.status) {
                    let tmp = this.state.tokens;
                    tmp[serviceName] = res.token.token;
                    this.setState({
                        tokens: tmp
                    });
                }
            })
            .catch((err) => console.log(err))
            .then(async () => {
                switch (serviceName) {
                    case 'Github':
                        await this.getRepoGithub(index, endIndex);
                        break;
                    case 'Trello':
                        await this.getBoardsTrello(index, endIndex);
                        break;
                    case 'Twitch':
                        await this.getFollowsChannelTwitch(index, endIndex);
                        break;
                    case 'Facebook':
                        this.setState({switchDisableStatus: true});
                        break;
                    case 'Discord':
                        this.setState({switchDisableStatus: true});
                        break
                }
            })
            .then(() => {
                if (index == endIndex)
                    this.setState({componentReady: true})
            })
    };

    updateAction = async () => {
        const head = "Bearer " + global.tokenConnectedUser;
        const link = global.server_ip + '/api/action/update';
        console.log(this.state.item)
        await fetch(link, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/JSON',
                'Authorization': head,
            },
            // {"service": "Github", "serviceid": 3, "status": true}
            body: JSON.stringify({
                service: this.state.item.action,
                serviceid: this.state.item.id,
                status: !this.state.item.isActive,
                settingsaction: this.state.item.settingsaction,
                settingsreaction: this.state.item.settingsreaction,
            }),
        })
            .then((res) => {
                console.log(res)
                if (res.status === 404) {
                    this.dropdown.alertWithType('error', 'Error', 'An error has occured')
                    return
                }
                console.log("New Request action for " + this.state.item.action);
                let tmpItem = this.state.item;
                tmpItem.isActive = !this.state.item.isActive;
                this.setState({item: tmpItem});
                this.dropdown.alertWithType('success', 'Success', 'Action has been updated');
            })
            .catch((err) => this.dropdown.alertWithType('error', 'Error', err))
            .done()
    };

    getFollowsChannelTwitch = async (index) => {
        // get ID
        const token = this.state.tokens['Twitch'];
        let data = [];
        let url = 'https://api.twitch.tv/kraken/user';
        await fetch(url, {
            method: 'GET',
            headers: {
                'Client-ID': api_key.Twitch.key,
                'Authorization': 'OAuth ' + token,
                'Accept' : 'application/vnd.twitchtv.v5+json'
            }
        })
            .then((res) => res.json())
            .then(async (res) => {
                url = 'https://api.twitch.tv/kraken/users/' + res._id + '/follows/channels';
                await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Client-ID': api_key.Twitch.key,
                        'Authorization': 'OAuth ' + token,
                        'Accept': 'application/vnd.twitchtv.v5+json'
                    }
                })
                    .then((res) => res.json())
                    .then(async (res) => {
                        for (let i = 0; i < res.follows.length; i++) {
                            data.push({value: res.follows[i].channel.display_name})
                        }
                        if (index === 0) {
                            // Action
                            await this.setState({action_data: data})
                        } else {
                            // Reaction
                            await this.setState({reaction_data: data})
                        }
                    })
                    .then(async () => {
                        let tmp = this.state.item;
                        if (index === 0) {
                            this.setState({action_select: this.state.action_data[0]['value']});
                            tmp['settingsaction'] = ['TwitchFollowName', this.state.action_select];
                        } else {
                            this.setState({reaction_select: this.state.reaction_data[0]['value']});
                            tmp['settingsreaction'] = ['TwitchFollowName', this.state.reaction_select];
                        }
                        await this.setState({item: tmp});

                    })
                    .catch((err) => console.log(err))
            })
    };

    getBoardsTrello = async (index) => {
        const token = this.state.tokens['Trello'];
        const link = 'https://trello.com/1/members/me/boards?fields=name&token=' + token + '&key=' + api_key.Trello.key;
        let data_dropdown = [];

        await fetch(link, {
            method: 'GET',
            headers: {
                'Content-Type' : 'application/JSON'
            }
        })
            .then((result) => result.json())
            .then(async (res) => {
                let idBoards = [];
                let nameBoards = [];
                for (let i = 0; i < res.length; i++) {
                    if (!res[i].closed) {
                        idBoards.push(res[i].id);
                        nameBoards.push(res[i].name);
                        data_dropdown.push({value:res[i].name});
                    }
                }
                this.setState({iddrop : idBoards});
                this.setState({namedrop : nameBoards});

                if (index === 0) {
                    await this.setState({action_data: data_dropdown})
                } else {
                    await this.setState({reaction_data: data_dropdown})
                }
                let tmp = this.state.item;
                if (index === 0) {
                    this.setState({action_select: data_dropdown[0]['value']});
                    tmp['settingsaction'] = ['TrelloBoardName', idBoards[0]];
                    await this.setState({item: tmp});
                } else {
                    this.setState({reaction_select: data_dropdown[0]['value']});
                    tmp['settingsreaction'] = ['TrelloBoardName', idBoards[0]];
                    await this.setState({item: tmp});
                }
                /*if (index === endIndex) {
                    this.setState({componentReady: true})
                }*/
            })
    };

    getRepoGithub = async (index) => {
        const link = 'https://api.github.com/user/repos?access_token=' + this.state.tokens['Github'];
        await fetch(link, {
            method: 'GET',
            headers: {
                'Content-Type' : 'application/JSON'
            }
        })
            .then((result) => result.json())
            .then(async (res) => {
                let data = [];
                for (let i = 0; i < res.length; i++) {
                    data.push({value: res[i].full_name})
                }
                let tmp = this.state.item;
                if (index === 0) {
                    await this.setState({action_data: data});
                    tmp['settingsaction'] = ['GithubRepoName', res[0].full_name];
                    await this.setState({action_select: res[0].full_name})
                }
                else {
                    await this.setState({reaction_data: data});
                    tmp['settingsreaction'] = ['GithubRepoName', res[0].full_name];
                    await this.setState({reaction_select: res[0].full_name})

                }
                await this.setState({item: tmp});
            })
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 20,
    },
    loadingScreen: {
        flex: 1,
        backgroundColor: '#fff',
        paddingLeft: 40,
        paddingRight: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerCenter: {
        flex: 1,
        backgroundColor: '#fff',
        paddingLeft: 40,
        paddingRight: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textCenter: {
        fontSize: 24,
        marginBottom: 60,
        marginTop: 10,
        color: '#FC672D',
        fontWeight: 'bold',
        alignItems: 'center',
        textAlign: 'center',
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
    switchContainer: {
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
    },
    bottom: {
        marginTop: 40,
        marginBottom: 30,
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
