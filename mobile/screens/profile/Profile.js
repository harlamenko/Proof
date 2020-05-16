import React from 'react';
import { Text, Button } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, View } from 'react-native';
import { AuthContext, AdvertsContext } from '../../context';

class Profile extends React.Component {
    static contextType = AdvertsContext;

    constructor(props) { super(props); }

    componentDidMount() {
        this.props.navigation.dangerouslyGetParent().setOptions({
            headerShown: false,
        });
    }

    componentWillUnmount() {
        this.props.navigation.dangerouslyGetParent().setOptions({
            headerShown: true,
        });
    }

    render() {
        this.props.navigation.dangerouslyGetParent().setOptions({
            headerShown: false,
        });

        return (
            <SafeAreaView>
                <View style={{ height: '50%' }}>
                    <View style={{ flex: 1, justifyContent: "space-between", marginHorizontal: 8 }}>
                        {/* TODO заменить на имя после расширения модели пользователя */}
                        <Text h3 >{this.props.auth.state.user.email}</Text>
                        <Text h4 >Баланс: 0 ₽</Text>
                    </View>
                </View>
                <View style={{ height: '50%' }}>
                    <Button
                        disabled={true}
                        containerStyle={[styles.button, styles.btnWithDivider, styles.topButton]}
                        title="Пополнить" />
                    <Button
                        containerStyle={[styles.button, styles.btnWithDivider]}
                        title="Показать мое объявление"
                        onPress={() => {
                            this.props.navigation.navigate('AdvertDetails', { my: true })
                        }}
                    />
                    <Button
                        containerStyle={styles.button}
                        title="Выйти из аккаунта"
                        type="outline"
                        onPress={this.props.auth.signout}
                    />
                </View>
            </SafeAreaView>
        )
    }
}


export default (props) => {
    return (
        <AuthContext.Consumer>
            {value => <Profile auth={value} {...props} />}
        </AuthContext.Consumer>
    )
}

const styles = StyleSheet.create({
    button: {
        marginHorizontal: 8, paddingVertical: 36
    },
    btnWithDivider: {
        borderBottomWidth: 1, borderBottomColor: 'gray'
    },
    topButton: {
        paddingTop: 16
    }
})