import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-elements';
import SafeAreaView from 'react-native-safe-area-view';
import { ProfileForm } from '../../components';
import { AuthContext } from '../../context';
import { Layout } from '../../shared/styles';

export default class ProfileInfo extends React.Component {
  static contextType = AuthContext;

  state = {
    image: null,
    name: null,
  };

  constructor(props) {
    super(props);
  }

  render() {
    let { image, name } = this.state;
    const {
      updateProfile,
      changeRegistering,
      state: { loading },
    } = this.context;

    this.props.navigation.setOptions({ headerShown: false });

    return (
      <SafeAreaView style={[Layout.centeringContainer, { height: '80%' }]}>
        <ProfileForm
          {...this.props}
          image={image}
          name={name}
          onPickImage={(v) => this.setState({ image: v })}
          onNameChanged={(v) => this.setState({ name: v })}
        />
        <View style={{ height: '20%', width: '95%' }}>
          <Button
            title="СОХРАНИТЬ"
            loading={loading}
            onPress={() => {
              updateProfile({ name, image });
            }}
          />
          <Button
            containerStyle={{ marginTop: 30 }}
            title="Пропустить"
            disabled={loading}
            type="clear"
            onPress={() => {
              changeRegistering(true);
            }}
          />
        </View>
      </SafeAreaView>
    );
  }

  componentDidMount() {
    this.props.navigation.setOptions({ headerShown: false });
  }

  componentWillUnmount() {
    this.props.navigation.setOptions({ headerShown: true });
  }
}
