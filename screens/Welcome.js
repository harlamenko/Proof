
import React from 'react';
import { Text, ThemeProvider } from 'react-native-elements';
import { View } from 'react-native';
import { theme } from './../constants/theme';
import { globalStyles } from './../constants/styles'

export class Welcome extends React.Component {
    render() {
        return (
            <ThemeProvider theme={theme}>
                <View style={globalStyles.screen}>
                    <Text h2>Welcome</Text>
                </View>
            </ThemeProvider>
        )
    }
}
