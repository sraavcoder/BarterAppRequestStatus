import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';

import ItemDonate from '../screens/ItemDonateScreen';
import RecieverDetailsScreen from '../screens/RecieverDetailsScreen';

export const AppStackNavigator = createStackNavigator({
    ItemDonate: {
        screen: ItemDonate,
        navigationOptions: { headerShown: false }
    },
    RecieverDetailsScreen: {
        screen: RecieverDetailsScreen,
        navigationOptions: { headerShown: false }
    },
},
    {
        initialRouteName: "ItemDonate"
    }
)