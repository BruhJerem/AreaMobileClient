import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    ScrollView
} from 'react-native'
import { Card, List} from 'react-native-elements'
import { LinearGradient } from 'expo'


export default class Services extends React.Component {
    static navigationOptions = {
        /*header: null,*/
        title: "Services",
    };

    constructor(props) {
        super(props);
        this.state = {
            availableServices: [],
            nbServices : -1,

            refreshing: false,
        };
        this.requestServices();
        this.renderRow = this.renderRow.bind(this)
    }

    _onRefresh = () => {
        this.setState({refreshing: true});
        this.requestServices();
        this.forceUpdate();
        console.log("Refresh !");
        this.setState({refreshing: false})
    };

    renderRow ({ item }) {
        return (
            <Card
                title={item}
                titleStyle={styles.titleStyle}>
                <LinearGradient colors={['#fc672d', '#ff595d', '#ff5888', '#f764ae', '#dc75ce']}
                                style={{borderRadius: 40, alignSelf: 'stretch', padding: 16}}
                                start={[1.0, 1.0]}
                                end={[0.0, 0.0]}>

                    <TouchableOpacity style={styles.btn}>
                        <Text style={styles.btnText} onPress={() => this.props.navigation.navigate('ServicesArea', {
                            item: item,
                        })}>VIEW AVAILABLE AREA'S</Text>

                    </TouchableOpacity>
                </LinearGradient>
            </Card>
        )
    }

  render() {
      if (this.state.nbServices === -1) {
          return (
              <View style={styles.loadingScreen}>
                  <ActivityIndicator size="large" color="#0000ff" />
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
                console.log("nb services : ", this.state.nbServices);
            })
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
    }
});
