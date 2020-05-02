import React from 'react';
import {Platform} from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import Home from '../screens/Home';

import Profile from '../screens/Profile';
import PanelAdmin from '../screens/PanelAdmin'

import Services from '../screens/Services';
import ServicesArea from '../screens/ServicesArea';
import ServicesAreaSettings from '../screens/ServicesAreaSettings'

const HomeStack = createStackNavigator({
  Home: Home,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

const ProfileStack = createStackNavigator({
    Profile: Profile,
    PanelAdmin: PanelAdmin,
});

ProfileStack.navigationOptions = {
  tabBarLabel: 'Profile',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'}
    />
  ),
};

const SettingsStack = createStackNavigator({
    Services: Services,
    ServicesArea: ServicesArea,
    ServicesAreaSettings: ServicesAreaSettings,
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Services',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}

      name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
    />
  ),
};

export default createBottomTabNavigator({
  HomeStack,
  ProfileStack,
  SettingsStack,
    },
    {
        tabBarOptions: {
            activeTintColor: '#dc75ce',
            inactiveTintColor: 'gray',
        },
    });
