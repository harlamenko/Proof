import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Header } from 'react-native-elements';
// TODO: заменить на react lazy (https://ru.reactjs.org/docs/code-splitting.html)
import { Welcome } from './screens/Welcome';
import { AdvertDetails } from './screens/AdvertDetails';
import { Adverts } from './screens/Adverts';
import { AddAdvert } from './screens/AddAdvert';
import { BackBtn } from './components/BackBtn';
import { TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

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
                        }} /> */}
                    <Stack.Screen
                        name='Adverts'
                        component={Adverts}
                        options={{
                            header: props => (
                                <Header
                                    leftComponent={<BackBtn {...props} />}
                                    centerComponent={{
                                        text: 'Объявления',
                                        style: { color: '#fff' }
                                    }}
                                    rightComponent={
                                        <TouchableOpacity
                                            onPress={() => props.navigation.navigate('AddAdvert')}>
                                            <AntDesign
                                                name="plus"
                                                size={28}
                                                color="white" />
                                        </TouchableOpacity>
                                    } />
                            )
                        }} />

                    <Stack.Screen
                        name='AdvertDetails'
                        component={AdvertDetails} />

                    <Stack.Screen
                        name='AddAdvert'
                        component={AddAdvert} />

                </Stack.Navigator>
            </NavigationContainer>
        );
    }
}
