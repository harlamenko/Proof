import Constants from 'expo-constants';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import React from 'react';
import { View } from 'react-native';
import { Avatar, Input } from 'react-native-elements';
import { Layout } from '../shared/styles';

export default class ProfileForm extends React.Component {
  constructor(props) {
    super(props);
  }

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

      this.props.onPickImage(`data:image/jpeg;base64,${res.base64}`);
    } catch (err) {
      console.error(err);
    }
  };

  componentDidMount() {
    this._getPermissionAsync();
  }

  _getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Необходимо разрешить использование камеры!');
      }
    }
  };

  render() {
    let { image, name, onNameChanged } = this.props;

    return (
      <View style={Layout.centeringContainer}>
        <Avatar
          testID={'Avatar'}
          rounded={true}
          size="xlarge"
          icon={{ name: 'user', type: 'feather' }}
          source={image ? { uri: image } : null}
          onAccessoryPress={this._pickImage}
          showAccessory={!!image}
          onPress={!image ? this._pickImage : () => {}}
        />
        <Input
          testID={'Name'}
          containerStyle={{ width: 200, marginVertical: 22 }}
          placeholder="Ваше имя"
          value={name}
          autoCorrect={false}
          maxLength={17}
          onChangeText={onNameChanged}
        />
      </View>
    );
  }
}
