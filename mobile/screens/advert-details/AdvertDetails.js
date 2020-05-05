import React from "react";
import QRCode from "react-native-qrcode-generator";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { Image, Header, Overlay } from "react-native-elements";
import { adverts } from "../../constants/mocks";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BackBtn, QRScanner } from "../../components";

const { width: screenWidth } = Dimensions.get("window");

export class AdvertDetails extends React.Component {
  constructor(props) {
    super(props);
    const { id } = this.props.route.params;

    this.state = {
      item: adverts.find((item) => item.id === id),
      isOverlayVisible: false,
      isMyAdvert: id === 1, // TODO: заменить на проверку по данным пользователя
      hasPermission: false,
      scanned: true,
    };

    this.setHeader();
  }

  render() {
    return (
      <View>
        <Image
          style={{ width: "100%", height: 280 }}
          resizeMode="contain"
          source={{ uri: this.state.item.photo }}
        />

        {this.getCharacteristics()}

        <Overlay
          isVisible={this.state.isOverlayVisible}
          onBackdropPress={this.toggleOverlayVisibility}
          fullScreen={!this.checkIsMyAdvert()}
          height={"auto"}
          width={"auto"}
        >
          {this.checkIsMyAdvert() ? (
            <QRCode
              value={this.state.item.getInfoForQR()}
              size={screenWidth - 80}
              bgColor="black"
              fgColor="white"
            />
          ) : (
              <QRScanner qrScanned={this._onQRScanned} />
            )}
        </Overlay>
      </View>
    );
  }

  setHeader = () => {
    this.props.navigation.setOptions({
      header: (props) => (
        <Header
          leftComponent={<BackBtn {...props} />}
          centerComponent={{
            // TODO: добавить название объявления
            text: this.state.item.modelName,
            style: { color: "#fff" },
          }}
          rightComponent={
            <TouchableOpacity onPress={this.toggleOverlayVisibility}>
              <MaterialCommunityIcons
                name={this.checkIsMyAdvert() ? "qrcode" : "qrcode-scan"}
                size={32}
                color="white"
              />
            </TouchableOpacity>
          }
        />
      ),
    });
  };

  checkIsMyAdvert = () => this.state.isMyAdvert;

  toggleOverlayVisibility = () => {
    this.setState((state) => ({ isOverlayVisible: !state.isOverlayVisible }));
  };

  getCharacteristics = () => {
    const info = this.state.item.getFullInfo();

    return (
      <View>
        <Text>Характеристики:</Text>
        {info.map(({ name, value }, i) => (
          <Text key={i}>
            {name}: {value}
          </Text>
        ))}
      </View>
    );
  };

  _onQRScanned = (data) => {
    // TODO: обработать уведомление о результате проверки
    console.log(data === this.state.item.getInfoForQR());
    this.toggleOverlayVisibility();
  };
}
