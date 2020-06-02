import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Button, Icon, Text, Tooltip } from 'react-native-elements';
import SafeAreaView from 'react-native-safe-area-view';
import { AdvertsContext, AuthContext } from '../context';
import { Layout } from '../shared/styles';

class Profile extends React.Component {
  static contextType = AdvertsContext;
  tooltip = React.createRef();

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
        <View style={{ height: '65%' }}>
          <View style={{ position: 'absolute', right: 12, top: 12 }}>
            <Tooltip
              ref={this.tooltip}
              containerStyle={{ flex: 1 }}
              width={158}
              backgroundColor="lightgrey"
              height={60}
              popover={
                <View>
                  <Button
                    title="Редактировать"
                    onPress={() => {
                      this.tooltip.current.toggleTooltip();
                      this.props.navigation.navigate('ProfileInfoEdit');
                    }}
                  />
                </View>
              }
            >
              <Icon name="more-vertical" type="feather" />
            </Tooltip>
          </View>

          <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
              marginHorizontal: 8,
            }}
          >
            <View style={Layout.centeringContainer}>
              <Avatar
                rounded={true}
                size="xlarge"
                icon={{ name: 'user', type: 'feather' }}
                source={user.image ? { uri: user.image } : null}
                containerStyle={{ marginBottom: 22 }}
              />
              <Text h3>{user.name || user.email}</Text>
            </View>
          </View>
        </View>
        <View style={{ height: '35%' }}>
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
    <AuthContext.Consumer>
      {(value) => <Profile auth={value} {...props} />}
    </AuthContext.Consumer>
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
