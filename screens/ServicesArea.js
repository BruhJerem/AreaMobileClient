import React from "react";
import {
    Text,
    View,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView,
    FlatList,
    RefreshControl
} from "react-native";
import {LinearGradient} from "expo";
import {Card} from 'react-native-elements'

export default class ServicesArea extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('item', ''),
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        };
    };
    constructor(props) {
        super(props);
        this.state = {
            token: -1,
            componentLoading: false,
            status: -1,
            refreshing: false,

            objectData: [],
            reactionStatus: -1,
            componentLoadingReaction: false,
        };

        const { navigation } = this.props;
        const item = navigation.getParam('item', '');
        this.requestServiceToken(item).done();

        this.renderRow = this.renderRow.bind(this);
        this.checkIfConnected = this.checkIfConnected.bind(this);
    }

    _onRefresh = () => {
        this.setState({refreshing: true});
        const { navigation } = this.props;
        const item = navigation.getParam('item', '');
        this.requestServiceToken(item).done();
        this.requestServiceComponent(item).done();
        this.setState({refreshing: false})
    };

    componentDidMount() {
        const { navigation } = this.props;
        const item = navigation.getParam('item', '');
        this.requestServiceComponent(item).done();
    }

    renderRow ({ item }) {
        if (!item.reactionConnected) {
            return (
                <Card
                    title={item.data}
                    titleStyle={styles.titleStyle}>
                    <LinearGradient colors={['#fc672d', '#ff595d', '#ff5888','#f764ae', '#dc75ce']}
                                    style={{borderRadius: 40, alignSelf: 'stretch', padding: 16}}
                                    start={[1.0, 1.0]}
                                    end={[0.0, 0.0]}>

                        <TouchableOpacity style={styles.btn} onPress={() => this.props.navigation.navigate('Profile')}>
                            <Text style={styles.btnText}>Not Connected to {item.reaction}</Text>
                            <Text style={styles.btnText}>Click here to setup</Text>
                        </TouchableOpacity>

                    </LinearGradient>
                </Card>
            )
        }

        return (
            <Card
                title={item.data}
                titleStyle={styles.titleStyle}>
                <LinearGradient colors={['#fc672d', '#ff595d', '#ff5888','#f764ae', '#dc75ce']}
                                style={{borderRadius: 40, alignSelf: 'stretch', padding: 16}}
                                start={[1.0, 1.0]}
                                end={[0.0, 0.0]}>

                    <TouchableOpacity style={styles.btn} onPress={() => this.props.navigation.navigate('ServicesAreaSettings', {
                        item: item})}>
                        <Text style={styles.btnText}>Settings</Text>
                    </TouchableOpacity>

                </LinearGradient>
            </Card>
        )
    }

    render() {
        const { navigation } = this.props;
        const serviceName = navigation.getParam('item', '');
        if (serviceName === '') {
            alert("An error has occured. Please try again.");
            this.props.navigation.goBack();
        } else {
            // Service is loading
            if (!this.state.componentLoading) {
                return (
                    <View style={styles.loadingScreen}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                )
            }
            // Service has no Token in DB
            if (this.state.status === false) {
                return (
                    <ScrollView
                        contentContainerStyle={styles.headerCenter}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={() => this._onRefresh()}
                            />
                        }>
                        <Text style={styles.textCenter}>You are not connected to {serviceName} yet</Text>
                        <LinearGradient colors={['#fc672d', '#ff595d', '#ff5888','#f764ae', '#dc75ce']}
                                        style={{borderRadius: 40, alignSelf: 'stretch', padding: 16, marginTop: 60}}
                                        start={[1.0, 1.0]}
                                        end={[0.0, 0.0]}>

                            <TouchableOpacity style={styles.btn} onPress={() => this.props.navigation.navigate('Profile')}>
                                <Text style={styles.btnText}>Click here to setup</Text>
                            </TouchableOpacity>

                        </LinearGradient>
                    </ScrollView>
                )
            }
            // Service has found Token in DB
            else {
                // No reactions for service
                if (this.state.objectData.length === 0) {
                    return (
                        <ScrollView
                            contentContainerStyle={styles.headerCenter}
                            showsVerticalScrollIndicator={false}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={() => this._onRefresh()}
                                />
                            }>
                            <Text style={styles.textCenter}>No actions for {serviceName} yet</Text>
                        </ScrollView>
                    )
                }
                // Reaction found
                return (
                    <View style={ styles.container }>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={() => this._onRefresh()}
                                />
                            }>
                            <FlatList
                                data={this.state.objectData}
                                renderItem={this.renderRow}
                                keyExtractor={item => item.data}
                            />
                        </ScrollView>
                    </View>
                );
            }
        }
    }

    requestServiceToken = async (serviceName)=> {
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
                this.setState({
                    status: res.status
                });
                if (res.status) {
                    this.setState({
                        token: res.token.token
                    });
                }
            })
            .catch((err) => alert(err))
            .done()
    };

    requestServiceComponent = async (serviceName) => {
        const head = "Bearer " + global.tokenConnectedUser;
        const link = global.server_ip + '/api/action/components?service=' + serviceName;
        this.setState({componentLoading: false});
        await fetch(link, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/JSON',
                'Authorization': head,
            },
        })
            .then((response) => response.json())
            .then(async (res) => {
                if (res) {
                    console.log("Request Service Component");
                    console.log(res);
                    // Check if connected
                    let data = [];
                    for (let i = 0; i < res.length; i++) {
                        if (res[i].reaction === "" || res[i].reaction === "Mail" || res[i].reaction === 'Twitter') {
                            data.push({
                                action: res[i].action,
                                data: res[i].data,
                                id: res[i].id,
                                isActive: res[i].isActive,
                                reaction: null,
                                reactionConnected: true,
                            })
                        } else {
                            let promise = this.checkIfConnected(res[i].reaction);
                            await promise.then(() => {
                                data.push({
                                    action: res[i].action,
                                    data: res[i].data,
                                    id: res[i].id,
                                    isActive: res[i].isActive,
                                    reaction: res[i].reaction,
                                    reactionConnected: this.state.reactionStatus,
                                })
                            })
                        }
                    }
                    this.setState({objectData: data});
                } else {
                    console.log(res);
                    console.log("ERROR")
                }
            })
            .catch((err) => {
                console.log(err)
                // No reaction found
            })
            .then(() => {
                this.setState({componentLoading: true})
            })
    };

    /* id: 0
    *  serviceName: github
    *  data: Github issues assigned to me Todoist"
    *  isActive: false
    *  reaction: Twitter
    */
    checkIfConnected = async (reactionName) => {
        console.log("Get token for " + reactionName);
        const head = "Bearer " + global.tokenConnectedUser;
        const link = global.server_ip + '/api/getoauthtoken?service=' + reactionName;
        await fetch (link, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/JSON',
                'Authorization': head,
            },
        })
            .then((response) => response.json())
            .then((res) => {
                console.log(res);
                this.setState({reactionStatus: res.status})
            })
            .catch((err) => console.log(err))
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingLeft: 40,
        paddingRight: 40,
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

});
