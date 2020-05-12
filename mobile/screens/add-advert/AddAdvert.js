import React, { Component } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Image, Input, Header } from "react-native-elements";
import { adverts } from "../../constants/mocks";
import * as ImagePicker from "expo-image-picker";
import { Device } from "../../models/Device";
import { BackBtn } from "../../components";
import { MaterialIcons } from "@expo/vector-icons";
import { Form } from "../../shared/styles";

export class AddAdvert extends Component {
  constructor(props) {
    super(props);

    this.state = {
      item: new Device(),
    };

    this.setHeader();
  }
  setHeader = () => {
    // TODO вынести в свойство класса
    this.props.navigation.setOptions({
      header: (props) => (
        <Header
          leftComponent={<BackBtn {...props} />}
          centerComponent={{
            text: "Добавление объявления",
            style: { color: "#fff" },
          }}
          rightComponent={
            <TouchableOpacity onPress={this.publishItem.bind(this)}>
              <MaterialIcons name="done" size={28} color="white" />
            </TouchableOpacity>
          }
        />
      ),
    });
  };

  publishItem = () => {
    const { item } = this.state;
    item.id = adverts.length + 1;
    // TODO: send to BE
    adverts.push(new Device(item));
    this.props.navigation.navigate("Adverts");
  };

  pickPhoto = async () => {
    const { granted } = await ImagePicker.requestCameraRollPermissionsAsync();
    if (!granted) { return; }
    const image = await ImagePicker.launchImageLibraryAsync();
    const { item } = this.state;
    item.setPhoto(image.uri);
    this.setState({ item });
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

  render = () => (
    <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={30}>
      <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
        <View style={{ marginTop: 8 }} >
          {this.state.item.photo ? this.getImage() : this.getImagePicker()}
        </View>
        <Input
          containerStyle={Form.input}
          label="Название"
          placeholder="Введите название устройства"
          maxLength={20}
          value={this.state.item.name}
          autoCorrect={false}
          onChangeText={name => this.setState(this.state.item.patch({ name }))}
        />
        <Input
          containerStyle={Form.input}
          keyboardType="numeric"
          placeholder="Введите стоимость устройства"
          maxLength={9}
          label="Цена"
          value={this.state.item.price}
          autoCorrect={false}
          onChangeText={price => this.setState(this.state.item.patch({ price }))}
        />
        <Input
          containerStyle={Form.input}
          label="Город"
          placeholder="Город, в котором состоится сделка"
          maxLength={20}
          textContentType="addressCity"
          value={this.state.item.address}
          autoCorrect={false}
          onChangeText={address => this.setState(this.state.item.patch({ address }))}
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
          onChangeText={description => this.setState(this.state.item.patch({ description }))}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    marginHorizontal: 8,
  },
  customCharacteristic: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  customCharacteristic_input: {
    marginTop: 12,
    width: "50%",
  },
  addCharacteristicBtn: {
    marginTop: 12,
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
  deviceInfo: {
    marginBottom: 16,
    marginTop: 16,
  },
  deviceInfoTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  deviceInfoTitleHint: {
    fontSize: 16,
    color: "gray",
    marginBottom: 8,
  },
});
