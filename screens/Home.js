import React from 'react';
import {
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import {LinearGradient} from "expo";
import {Card} from "react-native-elements";


export default class Home extends React.Component {
    static navigationOptions = {
    /*header: null,*/
    title: 'Home'
    };

    constructor(props) {
    super(props);
    this.state = {
        actions: [],
        isReady: false,
        nbServices: -1,
        refreshing: false,
        availableServices: [],
        data: [],
    };
        this._onRefresh = this._onRefresh.bind(this);
        this.renderRow = this.renderRow.bind(this);
        this.requestServices().done();
        this.requestAllActiveServiceComponent().done();
    }

    _onRefresh = () => {
        this.setState({refreshing: true});
        this.requestServices().done();
        this.requestAllActiveServiceComponent().done();
        this.forceUpdate();
        console.log("Refresh !");
        this.setState({refreshing: false})
    };
    componentWillMount() {
        this._onRefresh()
    }

    renderRow ({ item }) {
        return (
            <Card
                title={item.action}
                titleStyle={styles.titleStyle}>
                <Text>{item.data}</Text>
            </Card>
        )
    }

    render() {
        let helloMessage;
        if (global.admin === 'true')
            helloMessage = <Text style={styles.helloHeader}> Hello, Admin! </Text>;
        if (!this.state.isReady) {
            return (
                <View style={styles.loadingScreen}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
          )
      }
      if (this.state.data.length === 0) {
          return (
              <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.headerCenter}
                  refreshControl={
                      <RefreshControl
                          refreshing={this.state.refreshing}
                          onRefresh={() => this._onRefresh()}
                      />
                  }
              >
                  {helloMessage}
                  <Text style={styles.textCenter}>No Area's activated</Text>
                  <LinearGradient colors={['#fc672d', '#ff595d', '#ff5888', '#f764ae', '#dc75ce']}
                                  style={{borderRadius: 40, alignSelf: 'stretch', padding: 16}}
                                  start={[1.0, 1.0]}
                                  end={[0.0, 0.0]}>

                      <TouchableOpacity style={styles.btn}>
                          <Text style={styles.btnText} onPress={() => this.props.navigation.navigate('Services')}>
                              Click here to setup
                          </Text>
                      </TouchableOpacity>
                  </LinearGradient>
              </ScrollView>
          )
      } else {
          // Here we need to print all the areas active for the user
          return (
              <View style={ styles.container }>
                  <ScrollView
                      showsVerticalScrollIndicator={false}
                      refreshControl={
                          <RefreshControl
                              refreshing={this.state.refreshing}
                              onRefresh={() => this._onRefresh()}
                          />
                      }
                  >
                      {helloMessage}
                      <Text style={styles.header}>All my active AREA's</Text>
                      <FlatList
                          data={this.state.data}
                          renderItem={this.renderRow}
                          keyExtractor={item => item.data}
                      />
                  </ScrollView>
              </View>
          )
      }
  }

  requestAllActiveServiceComponent = async () => {
        const head = "Bearer " + global.tokenConnectedUser;
        await fetch (global.server_ip + '/api/actions/user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/JSON',
                'Authorization': head
            },
        })
            .then((response) => response.json())
            .then((res) => {
                console.log(res)
                this.setState({data: res})
                this.setState({isReady: true})
            })
            .catch((e) => alert(e))
            .done();
    }

    requestServices = async () => {
        const head = "Bearer " + global.tokenConnectedUser;
        await fetch (global.server_ip + '/api/services', {
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
                console.log("nb services : ", this.state.nbServices);
            })
            .catch((e) => {
                alert('An error has occured, please log in again')
                this.props.navigation.navigate('Login')
            })
            .done();
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingLeft: 10,
        paddingRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    helloHeader: {
        fontSize: 30,
        marginTop: 20,
        marginBottom: 20,
        textAlign: 'center',
        color: '#FC672D',
        fontWeight: 'bold'
    },
    header: {
        fontSize: 30,
        marginTop: 20,
        marginBottom: 60,
        textAlign: 'center',
        color: '#FC672D',
        fontWeight: 'bold'
    },
    loadingScreen: {
        flex: 1,
        backgroundColor: '#fff',
        paddingLeft: 40,
        paddingRight: 40,
        justifyContent: 'center',
        alignItems: 'center',
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
    },
    titleStyle: {
        color: '#FC672D'
    },
});
