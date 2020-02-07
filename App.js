import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { Welcome } from './screens/Welcome';
import { ProductDetails } from './screens/ProductDetails';
import { Products } from './screens/Products';

const Stack = createStackNavigator();

export default class App extends React.Component {
  render( ){
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen
            name='Welcome'
            component={Welcome}
            options={{
              headerShown: false
            }}
          />
          <Stack.Screen name='ProductDetails' component={ProductDetails} />
          <Stack.Screen name='Products' component={Products} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
