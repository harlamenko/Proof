import React, { Component } from 'react';
import { ActivityIndicator, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { BackBtn, AdvertForm } from '../../components';
import { Feather } from '@expo/vector-icons';
import { Layout } from '../../shared/styles';
import { AdvertsContext, AuthContext } from '../../context';
import { Advert } from '../../models/Advert';
import ProofAPI from '../../api/ProofAPI';
import Toast from 'react-native-simple-toast';

class AddAdvert extends Component {
  static contextType = AdvertsContext;

  constructor(props) {
    super(props);

    this.state = {
      item: new Advert(this.props.auth.state.user.id),
      uploading: false,
    };
  }

  setHeader = () => {
    this.props.navigation.setOptions({
      headerLeft: () => <BackBtn {...this.props} style={{ marginLeft: 8 }} />,
      headerTitle: () => <Text style={styles.title}>Добавление объявления</Text>,
      headerRight: () => {
        return this.state.uploading ? (
          <ActivityIndicator style={{ marginRight: 8 }} />
        ) : (
          <TouchableOpacity
            onPress={() => {
              this.publishItem();
            }}
          >
            <Feather name="check" size={28} style={{ marginRight: 8 }} />
          </TouchableOpacity>
        );
      },
    });
  };

  publishItem = async () => {
    const { item } = this.state;
    const validationMessage = item.validate();

    if (validationMessage) {
      Alert.alert('Ошибка публикации', validationMessage);
      return;
    }

    this.setState({ ...this.state, ...{ uploading: true } });
    const { data: advert } = await ProofAPI.put(`/adverts`, item);

    if (advert) {
      this.props.auth.setLocalInfo(advert);
      const { dropFilter } = this.context;
      dropFilter();

      const {
        state: { paging, search },
        getAdverts,
      } = this.context;
      getAdverts({ paging, search });
      Toast.showWithGravity('Публикация прошла успешно!', Toast.SHORT, Toast.CENTER);
      this.props.navigation.navigate('Adverts');
    } else {
      Toast.showWithGravity('Ошибка публикации', Toast.SHORT, Toast.CENTER);
    }

    this.setState({ ...this.state, ...{ uploading: false } });
  };

  handlePhotoAdding = () => {
    const { item } = this.state;
    item.addPhoto();
    this.setState({ ...this.state, item });
  };

  handlePickingCanceled = () => {
    const { item } = this.state;
    item.deleteLastPhoto();
    this.setState({ ...this.state, item });
  };

  handlePhotoAdded = (uri) => {
    const { item } = this.state;
    item.changeLastPhoto(uri);
    this.setState({ ...this.state, item });
  };

  handleNameChange = (name) =>
    this.setState({
      ...this.state,
      ...this.state.item.patch({ name }),
    });

  handlePriceChange = (price) =>
    this.setState({
      ...this.state,
      ...this.state.item.patch({ price }),
    });

  handleCityChange = (city) =>
    this.setState({
      ...this.state,
      ...this.state.item.patch({ city }),
    });

  handleDescriptionChange = (description) =>
    this.setState({
      ...this.state,
      ...this.state.item.patch({ description }),
    });

  render() {
    this.setHeader();

    if (this.state.uploading) {
      return (
        <View style={Layout.centeringContainer}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    return (
      <AdvertForm
        advert={this.state.item}
        onPickingCanceled={this.handlePickingCanceled}
        onPhotoAdding={this.handlePhotoAdding}
        onPhotoAdded={this.handlePhotoAdded}
        onNameChange={this.handleNameChange}
        onPriceChange={this.handlePriceChange}
        onCityChange={this.handleCityChange}
        onDescriptionChange={this.handleDescriptionChange}
      />
    );
  }
}

export default (props) => {
  return (
    <AuthContext.Consumer>{(value) => <AddAdvert auth={value} {...props} />}</AuthContext.Consumer>
  );
};

const styles = StyleSheet.create({
  screen: {
    marginHorizontal: 8,
  },
  imagePicker: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 260,
    backgroundColor: '#e5dfdf',
  },
  deviceImage: {
    width: '100%',
    height: '100%',
  },
  deviceImageContainer: {
    height: 260,
  },
  title: {
    fontSize: 16,
    marginLeft: 8,
  },
});
