import React from "react";
import QRCode from "react-native-qrcode-generator";
import { View, TouchableOpacity, Dimensions, ActivityIndicator, StyleSheet } from "react-native";
import { Image, Overlay, Text, Button } from "react-native-elements";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BackBtn, QRScanner } from "../../components";
import { AdvertsContext, AuthContext } from "../../context";
import { Layout } from "../../shared/styles";
import { ScrollView } from "react-native-gesture-handler";

const { width: screenWidth } = Dimensions.get("window");
class AdvertDetails extends React.Component {
  static contextType = AdvertsContext;

  _unsubscribe = null;

  constructor(props) {
    super(props);

    this.state = {
      isOverlayVisible: false,
      hasPermission: false,
      scanned: true,
    };
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      const { setCurrentAdvert } = this.context;
      const { advert } = this.props.route.params;

      if (advert) {
        setCurrentAdvert(advert);
      } else {
        const { id } = this.props.route.params;
        const { getAdvertDetails } = this.context;

        getAdvertDetails(id);
      }
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
    this.context.dropCurrentAdvert();
  }

  render() {
    this.setHeader();

    const { state: { currentAdvert } } = this.context;

    if (!currentAdvert) {
      return (
        <View style={Layout.centeringContainer}>
          <ActivityIndicator size="large" />
        </View>
      )
    }

    return (
      <>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Image
            style={{ width: "100%", height: 280 }}
            resizeMode="contain"
            source={{ uri: currentAdvert.photo }}
          />

          <Text style={[styles.horizontalGaps, { fontSize: 20, marginVertical: 8 }]}>
            {currentAdvert.name}
          </Text>
          <Text style={[styles.horizontalGaps, { fontSize: 18, fontWeight: "bold" }]}>
            {currentAdvert.price} ₽
          </Text>
          <Text style={[styles.horizontalGaps, { marginTop: 4 }]}>
            г. {currentAdvert.city}
          </Text>
          <Text style={[styles.horizontalGaps, { fontSize: 18, marginTop: 8, marginBottom: 4 }]}>
            Характеристики
          </Text>
          <Text style={styles.horizontalGaps}>
            Модель телефона: {currentAdvert.model_name}
          </Text>
          <Text style={styles.horizontalGaps}>
            Производитель: {currentAdvert.brand_name}
          </Text>
          <Text style={styles.horizontalGaps}>
            Год производства: {currentAdvert.year_class}
          </Text>
          <Text style={styles.horizontalGaps}>
            Название операционной системы: {currentAdvert.os_name}
          </Text>
          <Text style={[styles.horizontalGaps, { fontSize: 18, marginTop: 8, marginBottom: 4 }]}>
            Описание
          </Text>
          <Text style={styles.horizontalGaps}>
            {currentAdvert.description}
          </Text>

          <Overlay
            isVisible={this.state.isOverlayVisible}
            onBackdropPress={this.toggleOverlayVisibility}
            fullScreen={!currentAdvert.belongsTo(this.props.auth.state.user._id)}
            height="auto"
            width="auto"
          >
            {
              currentAdvert.belongsTo(this.props.auth.state.user._id) ?
                <QRCode
                  value={currentAdvert.getInfoForQR()}
                  size={screenWidth - 80}
                  bgColor="black"
                  fgColor="white"
                /> :
                <QRScanner qrScanned={this._onQRScanned} />
            }
          </Overlay>
        </ScrollView>
        {
          !currentAdvert.belongsTo(this.props.auth.state.user._id) ?
            <Button
              containerStyle={{ margin: 8 }}
              title="Написать продавцу"
            /> :
            null
        }
      </>
    );
  }

  setHeader = () => {
    const { state: { currentAdvert } } = this.context;
    if (currentAdvert) {

      this.props.navigation.setOptions({
        headerShown: true,
        headerLeft: () => <BackBtn {...this.props} style={{ marginLeft: 8 }} />,
        headerTitle: () => <Text style={{ fontSize: 16 }}>{currentAdvert.name}</Text>,
        headerRight: () => {
          if (!currentAdvert) { return null; }

          return (
            <TouchableOpacity
              onPress={this.toggleOverlayVisibility}
              style={{ marginRight: 8 }}
            >
              <MaterialCommunityIcons
                name={
                  currentAdvert.belongsTo(this.props.auth.state.user._id) ?
                    "qrcode" : "qrcode-scan"
                }
                size={32}
              />
            </TouchableOpacity>
          )
        }
      });
    } else {
      this.props.navigation.setOptions({
        headerShown: false
      });
    }
  };

  toggleOverlayVisibility = () => {
    this.setState((state) => ({ isOverlayVisible: !state.isOverlayVisible }));
  };

  _onQRScanned = (data) => {
    const { state: { currentAdvert } } = this.context;
    // TODO: обработать уведомление о результате проверки
    console.log(data === currentAdvert.getInfoForQR());
    this.toggleOverlayVisibility();
  };
}

export default (props) => {
  return (
    <AuthContext.Consumer>
      {value => <AdvertDetails auth={value} {...props} />}
    </AuthContext.Consumer>
  )
}

const styles = StyleSheet.create({
  horizontalGaps: {
    marginHorizontal: 8
  }
})