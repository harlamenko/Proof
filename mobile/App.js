import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// TODO: заменить на react lazy (https://ru.reactjs.org/docs/code-splitting.html)
import { SignIn, SignUp, AddAdvert, AdvertDetails, Profile, Chat, Adverts, Filter } from './screens';
import { ScreenResolver } from './components';
import { AuthProvider, AuthContext, AdvertsProvider } from "./context";
import { YellowBox } from 'react-native';

YellowBox.ignoreWarnings(['Remote debugger']);

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AdvertStack = () => (
  <AdvertsProvider>
    <Stack.Navigator>
      <Stack.Screen name="Adverts" component={Adverts} />
      <Stack.Screen name="AdvertDetails" component={AdvertDetails} />
      <Stack.Screen name="Filter" component={Filter} options={{ headerShown: false }} />
    </Stack.Navigator>
  </AdvertsProvider>
)

class App extends React.Component {
  static contextType = AuthContext;

  render() {
    const { token, initialyLoaded } = this.context.state;

    return (
      <NavigationContainer>
        {
          !initialyLoaded ?
            <Stack.Navigator>
              <Stack.Screen name="ScreenResolver" component={ScreenResolver} options={{ headerShown: false }} />
            </Stack.Navigator> :
            !token ?
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="SignIn" component={SignIn} />
                <Stack.Screen name="SignUp" component={SignUp} />
              </Stack.Navigator> :
              <Tab.Navigator tabBarOptions={{ keyboardHidesTabBar: true }}>
                <Tab.Screen name="AdvertStack" component={AdvertStack} />
                <Tab.Screen name="Chat" component={Chat} />
                <Tab.Screen name="Profile" component={Profile} />
                <Tab.Screen name="AddAdvert" component={AddAdvert} />
              </Tab.Navigator>
        }
      </NavigationContainer>
    );
  }
}

export default () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);