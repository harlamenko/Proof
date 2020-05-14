import React, { Component } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Image, Input } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import { BackBtn } from "../../components";
import { Feather } from "@expo/vector-icons";
import { Form, Layout } from "../../shared/styles";
import { AdvertsContext, AuthContext } from "../../context";
import { Advert } from "../../models/Advert";
import ProofAPI from '../../api/ProofAPI';
import Toast from 'react-native-simple-toast';

class AddAdvert extends Component {
  static contextType = AdvertsContext;

  constructor(props) {
    super(props);

    this.state = {
      item: new Advert(this.props.auth.state.user._id),
      uploading: false
    };
  }

  componentWillMount() {
    if (this.props.auth.state.myAdvert) {
      this.props.navigation.navigate('Adverts');
    }
  }

  setHeader = () => {
    this.props.navigation.setOptions({
      headerLeft: () => <BackBtn {...this.props} style={{ marginLeft: 8 }} />,
      headerTitle: () => <Text style={styles.title}>Добавление объявления</Text>,
      headerRight: () => {
        return this.state.uploading ?
          <ActivityIndicator style={{ marginRight: 8 }} /> :
          <TouchableOpacity onPress={() => { this.publishItem() }}>
            <Feather name="check" size={28} style={{ marginRight: 8 }} />
          </TouchableOpacity>
      }
    });
  };

  publishItem = async () => {
    const { item } = this.state;
    const validationMessage = item.validate();

    if (validationMessage) {
      Alert.alert('Ошибка сохранения', validationMessage);
      return;
    }

    this.setState({ ...this.state, ...{ uploading: true } });
    const { data: advert } = await ProofAPI.put(`/adverts`, item);

    if (advert) {
      this.props.auth.setLocalInfo(advert);
      const { dropFilter } = this.context;
      dropFilter();

      const { state: { adverts, paging, search }, getAdverts } = this.context;
      getAdverts({ paging, search })
      Toast.showWithGravity('Публикация прошла успешно!', Toast.SHORT, Toast.CENTER);
      this.props.navigation.navigate("Adverts", { advert });
    } else {
      Toast.showWithGravity('Ошибка публикации', Toast.SHORT, Toast.CENTER);
    }

    this.setState({ ...this.state, ...{ uploading: false } });
  };

  pickPhoto = async () => {
    const { granted } = await ImagePicker.requestCameraRollPermissionsAsync();
    if (!granted) { return; }

    const { item } = this.state;
    item.addPhoto();
    const image = await ImagePicker.launchImageLibraryAsync();
    item.changeLastPhoto(image.uri);
    this.setState({ ...this.state, ...{ item } });
  }

  getImage = () => (
    <Image
      containerStyle={styles.deviceImageContainer}
      style={styles.deviceImage}
      resizeMode="center"
      source={{ uri: this.state.item.photo }}
      PlaceholderContent={<ActivityIndicator />}
    />
  );

  getImagePicker = () => (
    <TouchableOpacity onPress={this.pickPhoto}>
      <View style={styles.imagePicker}>
        <Text>Нажмите, чтобы выбрать фото</Text>
      </View>
    </TouchableOpacity>
  );

  render() {
    this.setHeader();

    if (this.state.uploading) {
      return (
        <View style={Layout.centeringContainer}>
          <ActivityIndicator size="large" />
        </View>
      )
    }

    return (
      <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
        <View style={{ marginTop: 8 }} >
          {this.state.item.photos.length ? this.getImage() : this.getImagePicker()}
        </View>
        <Input
          containerStyle={Form.input}
          label="Название"
          placeholder="Введите название устройства"
          maxLength={20}
          value={this.state.item.name}
          autoCorrect={false}
          onChangeText={
            name => this.setState({
              ...this.state,
              ...this.state.item.patch({ name })
            })
          }
        />
        <Input
          containerStyle={Form.input}
          keyboardType="numeric"
          placeholder="Введите стоимость устройства"
          maxLength={9}
          label="Цена"
          value={this.state.item.price}
          autoCorrect={false}
          onChangeText={
            price => this.setState({
              ...this.state,
              ...this.state.item.patch({ price })
            })
          }
        />
        <Input
          containerStyle={Form.input}
          label="Город"
          placeholder="Город, в котором состоится сделка"
          maxLength={20}
          textContentType="addressCity"
          value={this.state.item.city}
          autoCorrect={false}
          onChangeText={
            city => this.setState({
              ...this.state,
              ...this.state.item.patch({ city })
            })
          }
        />
        <Input
          containerStyle={Form.input}
          inputContainerStyle={Form.textarea}
          placeholder="Опишите устройство"
          label="Описание"
          value={this.state.item.description}
          autoCorrect={false}
          maxLength={255}
          spellCheck
          multiline
          onChangeText={
            description => this.setState({
              ...this.state,
              ...this.state.item.patch({ description })
            })
          }
        />
      </ScrollView>
    );
  }
}

export default (props) => {
  return (
    <AuthContext.Consumer>
      {value => <AddAdvert auth={value} {...props} />}
    </AuthContext.Consumer>
  )
}

const styles = StyleSheet.create({
  screen: {
    marginHorizontal: 8,
  },
  imagePicker: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 260,
    backgroundColor: "#e5dfdf",
  },
  deviceImage: {
    width: "100%",
    height: "100%",
  },
  deviceImageContainer: {
    height: 260,
  },
  title: {
    fontSize: 16,
    marginLeft: 8
  }
});
