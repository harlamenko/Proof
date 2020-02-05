import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import { Welcome } from '../screens/Welcome';
import { ProductDetails } from '../screens/ProductDetails';
import { Products } from '../screens/Products';

const screens = {
    Welcome,
    ProductDetails,
    Products
}

const options = {
    initialRouteName: 'Products'
}

const stack = createStackNavigator(screens, options)

export const AppContainer = createAppContainer(stack);