import React from 'react';
import { Text, Button, Avatar } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, View } from 'react-native';
import { AuthContext, AdvertsContext } from '../../context';
import { Layout } from '../../shared/styles';

class Profile extends React.Component {
  static contextType = AdvertsContext;

  constructor(props) {
    super(props);
  }

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
    const { user } = this.props.auth.state;
    return (
      <SafeAreaView>
        <View style={{ height: '50%' }}>
          <View style={{ flex: 1, justifyContent: 'space-between', marginHorizontal: 8 }}>
            <View style={Layout.centeringContainer}>
              <Avatar
                rounded={true}
                size="xlarge"
                icon={{ name: 'user', type: 'feather' }}
                source={user.image ? { uri: user.image } : null}
              />
              <Text h3>{user.name || user.email}</Text>
            </View>
            <Text h4>Баланс: 0 ₽</Text>
          </View>
        </View>
        <View style={{ height: '50%' }}>
          <Button
            disabled={true}
            containerStyle={[styles.button, styles.btnWithDivider, styles.topButton]}
            title="Пополнить"
          />
          <Button
            containerStyle={[styles.button, styles.btnWithDivider]}
            title="Показать мое объявление"
            onPress={() => {
              this.props.navigation.navigate('AdvertDetails', { my: true });
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
    );
  }
}

export default (props) => {
  return (
    <AuthContext.Consumer>{(value) => <Profile auth={value} {...props} />}</AuthContext.Consumer>
  );
};

const styles = StyleSheet.create({
  button: {
    marginHorizontal: 8,
    paddingVertical: 36,
  },
  btnWithDivider: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  topButton: {
    paddingTop: 16,
  },
});
