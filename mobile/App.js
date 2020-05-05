import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Header } from "react-native-elements";
// TODO: заменить на react lazy (https://ru.reactjs.org/docs/code-splitting.html)
import { SignIn, SignUp, Adverts, AddAdvert, AdvertDetails } from './screens';
import { ScreenResolver } from './components';
import { TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Provider as AuthProvider, Context as AuthContext } from "./context/AuthContext";

const Stack = createStackNavigator();

class App extends React.Component {
  render() {
    const { token, initialyLoaded } = this.context.state;

    return (
      <NavigationContainer>
        <Stack.Navigator>
          {!initialyLoaded ?
            <Stack.Screen name="ScreenResolver" component={ScreenResolver} options={{ headerShown: false }} /> :
            !token ?
              <>
                <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
                <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
              </> :
              <>
                <Stack.Screen
                  name="Adverts"
                  component={Adverts}
                  options={{
                    header: (props) => (
                      <Header
                        centerComponent={{
                          text: "Объявления",
                          style: { color: "#fff" },
                        }}
                        rightComponent={
                          <TouchableOpacity
                            onPress={() => props.navigation.navigate("AddAdvert")}
                          >
                            <AntDesign name="plus" size={28} color="white" />
                          </TouchableOpacity>
                        }
                      />
                    ),
                  }}
                />
                <Stack.Screen name="AddAdvert" component={AddAdvert} />
                <Stack.Screen name="AdvertDetails" component={AdvertDetails} />
              </>
          }
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

App.contextType = AuthContext;

export default () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);