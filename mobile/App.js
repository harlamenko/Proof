import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// TODO: заменить на react lazy (https://ru.reactjs.org/docs/code-splitting.html)
import {
  SignIn,
  SignUp,
  AddAdvert,
  AdvertDetails,
  Profile,
  ChatList,
  Adverts,
  Filter,
  EditAdvert,
  Chat
} from './screens';
import { ScreenResolver } from './components';
import { AuthProvider, AuthContext, AdvertsProvider, ChatProvider } from "./context";
import { YellowBox } from 'react-native';
import { Feather } from "@expo/vector-icons";

YellowBox.ignoreWarnings(['Remote ', 'Warning:']);

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const Tabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;

        switch (route.name) {
          case 'Adverts':
            iconName = 'menu';
            break;
          case 'ChatList':
            iconName = 'message-square';
            break;
          case 'Profile':
            iconName = 'user';
            break;
        }

        return <Feather name={iconName} size={size} color={color} />;
      },
    })}
    tabBarOptions={{
      activeTintColor: 'black',
      inactiveTintColor: 'gray',
      keyboardHidesTabBar: true,
      showLabel: false
    }}
  >
    {/* <Tab.Screen name="Adverts" component={Adverts} /> */}
    <Tab.Screen name="ChatList" component={ChatList} options={{ unmountOnBlur: true }} />
    <Tab.Screen name="Profile" component={Profile} options={{ unmountOnBlur: true }} />
  </Tab.Navigator>
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
              <ChatProvider>
                <AdvertsProvider>
                  <Stack.Navigator>
                    <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
                    <Stack.Screen name="AddAdvert" component={AddAdvert} unmountOnBlur={true} />
                    <Stack.Screen name="EditAdvert" component={EditAdvert} unmountOnBlur={true} />
                    <Stack.Screen name="AdvertDetails" component={AdvertDetails} unmountOnBlur={true} />
                    <Stack.Screen name="Filter" component={Filter} options={{ headerShown: false }} />
                    <Stack.Screen name="Chat" component={Chat} unmountOnBlur={true} />
                  </Stack.Navigator>
                </AdvertsProvider>
              </ChatProvider>
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