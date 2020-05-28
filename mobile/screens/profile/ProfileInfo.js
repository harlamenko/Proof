import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Input, Button } from 'react-native-elements';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { AuthContext } from '../../context';
import Constants from 'expo-constants';
import { View } from 'react-native';

export default class ProfileInfo extends React.Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
  }

  state = {
    image: null,
    name: null,
  };

  render() {
    let { image, name } = this.state;
    const {
      updateProfile,
      changeRegistering,
      state: { loading },
    } = this.context;

    this.props.navigation.setOptions({ headerShown: false });

    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Avatar
          rounded={true}
          size="xlarge"
          icon={{ name: 'user', type: 'feather' }}
          source={image ? { uri: image } : null}
          showEditButton={!!image}
          onPress={!image ? this._pickImage : () => {}}
          onEditPress={this._pickImage}
        />
        <Input
          containerStyle={{ width: 200, marginVertical: 12 }}
          placeholder="Ваше имя"
          value={name}
          autoCorrect={false}
          maxLength={17}
          onChangeText={(v) => this.setState({ name: v })}
        />
        <View style={{ marginTop: 150, marginBottom: -150, width: '95%' }}>
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
    this._getPermissionAsync();
  }

  componentWillUnmount() {
    this.props.navigation.setOptions({ headerShown: true });
  }

  _getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Необходимо разрешить использование камеры!');
      }
    }
  };

  _pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 3],
        quality: 0.7,
      });

      if (result.cancelled) {
        return;
      }

      const res = await ImageManipulator.manipulateAsync(
        result.uri,
        [{ resize: { height: 400 } }],
        { compress: 0.6, base64: true }
      );

      this.setState({ image: `data:image/jpeg;base64,${res.base64}` });
    } catch (err) {
      console.error(err);
    }
  };
}
