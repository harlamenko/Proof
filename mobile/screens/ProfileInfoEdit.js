import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackBtn, ProfileForm } from '../components';
import { AuthContext } from '../context';
import { Layout } from '../shared/styles';

export default class ProfileInfoEdit extends React.Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
  }

  state = { image: null, name: null };

  componentDidMount() {
    this.props.navigation.setOptions({
      headerLeft: () => <BackBtn {...this.props} style={{ marginLeft: 8 }} />,
      title: '',
    });

    let {
      state: {
        user: { image, name },
      },
    } = this.context;

    this.setState({ image, name });
  }

  render() {
    let {
      updateProfile,
      state: { loading },
    } = this.context;

    const { image, name } = this.state;

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
              updateProfile({ name, image }, () => {
                this.props.navigation.goBack();
              });
            }}
          />
        </View>
      </SafeAreaView>
    );
  }
}
