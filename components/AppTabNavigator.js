import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { AppStackNavigator } from './StackNavigator';
import BookRequestScreen from '../screens/ItemRequestScreen';

export const AppTabNavigator = createBottomTabNavigator({
  ItemDonate: {
    screen: AppStackNavigator,
    navigationOptions: {
      tabBarLabel: "Donate Items",
    }
  },
  ItemRequest: {
    screen: BookRequestScreen,
    navigationOptions: {
      tabBarLabel: "Request Items",
    }
  }
});
