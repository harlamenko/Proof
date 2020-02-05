import { React } from 'react';
import { createAppContainer, createStackNavigator} from 'react-navigation';

import Welcome from '../screens/Welcome';
import ProductDetails from '../screens/ProductDetails';
import Products from '../screens/Products';

const screens = {
    Welcome,
    ProductDetails,
    Products
}

const options = {
    initialRouteName: 'Products'
}

const stack = createStackNavigator(screens, options)

export default createAppContainer(stack);