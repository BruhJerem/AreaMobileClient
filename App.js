import React from 'react';
import { createStackNavigator } from 'react-navigation'
import TabLogNavigator from './navigation/TabLogNavigator';
import MainTabNavigator from "./navigation/MainTabNavigator";


const Application = createStackNavigator({
    TabLog: TabLogNavigator,
    TabNav: MainTabNavigator,
    }, {
            navigationOptions : {
                header: null,
                gesturesEnabled: false
            },
    });

export default class App extends React.Component {

  render() {
      return (
          <Application/>
      );
  }
};
