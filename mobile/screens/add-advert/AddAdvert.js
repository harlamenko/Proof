import React, { Component } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Image, Input, Button, Header } from "react-native-elements";
import { adverts } from "../../constants/mocks";
import * as ImagePicker from "expo-image-picker";
import { Device } from "../../models/Device";
import { BackBtn } from "../../components";
import { MaterialIcons } from "@expo/vector-icons";

export class AddAdvert extends Component {
  constructor(props) {
    super(props);
    this.keyInputRef = React.createRef();
    this.valueInputRef = React.createRef();

    this.state = {
      keyInput: null,
      valueInput: null,
      item: new Device(),
    };

    this.setHeader();
  }

  setHeader = () => {
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

  pickPhoto = () => {
    ImagePicker.requestCameraRollPermissionsAsync().then((res) => {
      if (!res.granted) {
        return;
      }

      ImagePicker.launchImageLibraryAsync().then((image) => {
        const { item } = this.state;
        item.setPhoto(image.uri);
        this.setState({ item });
      });
    });
  };

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

  getCustomCharInput = (options) => {
    const type = `${options.propName}Input`;

    return (
      <Input
        ref={this[`${type}Ref`]}
        maxLength={128}
        containerStyle={styles.customCharacteristic_input}
        placeholder={options.placeholder}
        onChange={(e) => this.setState({ [type]: e.nativeEvent.text })}
        value={this.state[type]}
      />
    );
  };

  getDeviceInfo = () =>
    this.state.item.getVisibleDeviceInfo().map(({ name, value }, i) => (
      <Text key={i}>
        {name}: {value}
      </Text>
    ));

  render = () => (
    <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={30}>
      <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
        {this.state.item.photo ? this.getImage() : this.getImagePicker()}
        <View style={styles.deviceInfo}>
          <Text style={styles.deviceInfoTitle}>
            Информация о Вашем устройстве
          </Text>
          <Text style={styles.deviceInfoTitleHint}>
            (собрана автоматически)
          </Text>
          {this.getDeviceInfo()}
        </View>
        {this.getCharacteristics()}
        <View style={styles.customCharacteristic}>
          {this.getCustomCharInput({
            placeholder: "Характеристика",
            propName: "key",
          })}
          {this.getCustomCharInput({
            placeholder: "Значение",
            propName: "value",
          })}
        </View>
        <Button
          title="ДОБАВИТЬ ХАРАКТЕРИСТИКУ"
          containerStyle={styles.addCharacteristicBtn}
          onPress={this.addCharacteristic}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );

  addCharacteristic = () => {
    const { keyInput, valueInput, item } = this.state;

    if (!keyInput || !valueInput) {
      return Alert.alert(
        "Данные не заполнены!",
        "Для того, чтобы добавить характеристику необходимо заполнить оба поля."
      );
    }

    item.addCustomCharacteristics(keyInput, valueInput);
    this.setState({
      keyInput: null,
      valueInput: null,
    });
    this.keyInputRef.current.clear();
    this.valueInputRef.current.clear();
  };

  getCharacteristics = () => {
    const customCharacteristics = this.state.item.getCustomCharacteristics();

    return customCharacteristics.length ? (
      <View>
        <Text>Характеристики:</Text>
        {customCharacteristics.map(({ name, value }, i) => (
          <Text key={i}>
            {name}: {value}
          </Text>
        ))}
      </View>
    ) : null;
  };
}

const styles = StyleSheet.create({
  screen: {
    margin: 8,
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
