
import React from 'react';
import { Text, ThemeProvider, Input, Button } from 'react-native-elements';
import { View, StyleSheet } from 'react-native';
import { theme } from './../constants/theme';
import { globalStyles } from './../constants/styles'

export class Welcome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login: '',
            password: ''
        }

        this.login = this.login.bind(this)
        this.handleLoginChange = this.handleLoginChange.bind(this)
        this.handlePasswordChange = this.handlePasswordChange.bind(this)
    }

    handleLoginChange(e) {
        this.setState({login: e.nativeEvent.text})
    }

    handlePasswordChange(e) {
        this.setState({password: e.nativeEvent.text})
    }

    login() {
        // login logic
        this.props.navigation.navigate('Products');
    }

    render() {
        return (
            <ThemeProvider theme={theme}>
                <View style={[globalStyles.screen, styles.container]}>
                    <Text h2 style={styles.title}>Welcome</Text>
                    <Input
                        placeholder="Логин"
                        onChange={this.handleLoginChange}
                        value={this.state.login}
                    />
                    <Input
                        placeholder="Пароль"
                        onChange={this.handlePasswordChange}
                        value={this.state.password}
                    />
                    <Button title="Войти" onPress={this.login} />
                </View>
            </ThemeProvider>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: 120
    },
    title: {
        position: 'absolute',
        top: 30,
        left: 10
    }
})