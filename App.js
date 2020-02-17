import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { Welcome } from './screens/Welcome';
import { AdvertDetails } from './screens/AdvertDetails';
import { Adverts } from './screens/Adverts';

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
          <Stack.Screen
            name='Adverts'
            component={Adverts}
            options={{
              headerTitle: 'Объявления',
              headerStatusBarHeight: 20
            }}
          />
          <Stack.Screen
            name='AdvertDetails'
            component={AdvertDetails}
            options={{
              headerStatusBarHeight: 20
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
