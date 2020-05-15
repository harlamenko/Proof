import React from "react";
import QRCode from "react-native-qrcode-generator";
import { View, TouchableOpacity, Dimensions, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { Image, Overlay, Text, Button } from "react-native-elements";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
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
      processing: false
    };
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      const { my } = this.props.route.params;

      if (my) {
        const { getMyAdvert } = this.context;

        getMyAdvert(this.props.auth.state.user.id);
      } else if (advert) {
        const { setCurrentAdvert } = this.context;
        const { advert } = this.props.route.params;

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
    this.context.clearEmptyMessage();
  }

  render() {
    this.setHeader();

    const { state: { currentAdvert, emptyMessage } } = this.context;

    if (!currentAdvert && !emptyMessage) {
      return (
        <View style={Layout.centeringContainer}>
          <ActivityIndicator size="large" />
        </View>
      )
    }

    if (emptyMessage) {
      this.props.navigation.setOptions({
        headerShown: true,
        title: '',
        headerLeft: () => <BackBtn {...this.props} style={{ marginLeft: 8 }} />
      });

      return (
        <View style={Layout.centeringContainer}>
          <Text h4>{emptyMessage}</Text>
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
            fullScreen={!currentAdvert.belongsTo(this.props.auth.state.user.id)}
            height="auto"
            width="auto"
          >
            {
              currentAdvert.belongsTo(this.props.auth.state.user.id) ?
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
          !currentAdvert.belongsTo(this.props.auth.state.user.id) ?
            <Button
              containerStyle={{ margin: 8 }}
              title="Написать продавцу"
            /> :
            null
        }
      </>
    );
  }

  handleDel = () => {
    Alert.alert('Вы уверены, что хотите удалить объявление?', '', [
      { text: 'Да', onPress: this.confirmDel },
      { text: 'Нет', }
    ]);
  }

  confirmDel = () => {
    this.setState({ processing: true });
    const { state: { currentAdvert }, dropFilter, deleteAdvert } = this.context;
    deleteAdvert(currentAdvert.id);
    dropFilter();
    this.props.auth.setLocalInfo(null);
    const { state: { paging, search }, getAdverts } = this.context;
    getAdverts({ paging, search });
    this.setState({ processing: false });

    this.props.navigation.navigate('Adverts');
  }

  handleEdit = () => {
    Alert.alert('Вы уверены, что хотите изменить объявление?', '', [
      { text: 'Да', onPress: this.confirmEdit },
      { text: 'Нет', }
    ]);
  }

  confirmEdit = () => {
    const { state: { currentAdvert } } = this.context;
    this.props.navigation.navigate('EditAdvert', { advert: currentAdvert });
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
          if (this.state.processing) { return <ActivityIndicator style={{ marginRight: 8 }} /> }

          return (
            currentAdvert.belongsTo(this.props.auth.state.user.id) ?
              (
                <View style={{ flex: 1, flexDirection: "row", alignItems: 'center' }}>
                  <TouchableOpacity onPress={this.handleDel} >
                    <MaterialCommunityIcons name="delete-outline" size={32} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this.handleEdit} style={{ marginLeft: 12, marginRight: 18 }} >
                    <Feather name="edit-2" size={28} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this.toggleOverlayVisibility} style={{ marginRight: 8 }} >
                    <MaterialCommunityIcons name="qrcode" size={32} />
                  </TouchableOpacity>
                </View>
              ) :
              (
                <TouchableOpacity onPress={this.toggleOverlayVisibility} style={{ marginRight: 8 }} >
                  <MaterialCommunityIcons name="qrcode-scan" size={32} />
                </TouchableOpacity>
              )
          )
        }
      });
    } else {
      this.props.navigation.setOptions({ headerShown: false });
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