import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Header } from 'react-native-elements';
import { Welcome } from './screens/Welcome';
import { AdvertDetails } from './screens/AdvertDetails';
import { Adverts } from './screens/Adverts';
import { AddAdvert } from './screens/AddAdvert';

const Stack = createStackNavigator();

export default class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          {/* <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen
            name='Welcome'
            component={Welcome}
            options={{
              headerShown: false
            }}
          /> */}
          {/* <Stack.Screen
            name='Adverts'
            component={Adverts}
            options={{
              headerTitle: 'Объявления',
              header: props => <Header
                leftComponent={{
                  icon: 'arrow-back',
                  color: '#fff',
                  onPress: () => props.navigation.goBack()
                }}
                centerComponent={{
                  text: 'Объявления',
                  style: { color: '#fff' }
                }}
                rightComponent={{
                  icon: 'add',
                  color: '#fff',
                  onPress: () => props.navigation.navigate('AddAdvert')
                }}
              />
            }}
          />
          <Stack.Screen
            name='AdvertDetails'
            component={AdvertDetails}
            options={{
              header: props => <Header
                leftComponent={{
                  icon: 'arrow-back',
                  color: '#fff',
                  onPress: () => props.navigation.goBack()
                }}
                centerComponent={{
                  // TODO: добавить название объявления
                  text: 'Объявление',
                  style: { color: '#fff' }
                }}
              />
            }}
          /> */}
          <Stack.Screen
            name='AddAdvert'
            component={AddAdvert}
            options={{
              header: props => <Header
                leftComponent={{
                  icon: 'arrow-back',
                  color: '#fff',
                  onPress: () => props.navigation.goBack()
                }}
                centerComponent={{
                  text: 'Добавление объявления',
                  style: { color: '#fff' }
                }}
                rightComponent={{
                  icon: 'check',
                  color: '#fff',
                  onPress: () => { }
                }}
              />
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
