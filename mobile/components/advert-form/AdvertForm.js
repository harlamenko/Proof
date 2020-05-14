import React, { Component } from "react";
import {
    ActivityIndicator,
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { Image, Input } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import { Form } from "../../shared/styles";

export default class AdvertForm extends Component {
    constructor(props) { super(props); }

    pickPhoto = async () => {
        const { granted } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (!granted) { return; }

        this.props.onPhotoAdding();

        const image = await ImagePicker.launchImageLibraryAsync();
        this.props.onPhotoAdded(image.uri);
    }

    getImage = () => (
        <Image
            containerStyle={styles.deviceImageContainer}
            style={styles.deviceImage}
            resizeMode="center"
            source={{ uri: this.props.advert.photo }}
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
        return (
            <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
                <View style={{ marginTop: 8 }} >
                    {this.props.advert.photos.length ? this.getImage() : this.getImagePicker()}
                </View>
                <Input
                    containerStyle={Form.input}
                    label="Название"
                    placeholder="Введите название устройства"
                    maxLength={20}
                    value={this.props.advert.name}
                    autoCorrect={false}
                    onChangeText={this.props.onNameChange}
                />
                <Input
                    containerStyle={Form.input}
                    keyboardType="numeric"
                    placeholder="Введите стоимость устройства"
                    maxLength={9}
                    label="Цена"
                    value={this.props.advert.price ? `${this.props.advert.price}` : null}
                    autoCorrect={false}
                    onChangeText={this.props.onPriceChange}
                />
                <Input
                    containerStyle={Form.input}
                    label="Город"
                    placeholder="Город, в котором состоится сделка"
                    maxLength={20}
                    textContentType="addressCity"
                    value={this.props.advert.city}
                    autoCorrect={false}
                    onChangeText={this.props.onCityChange}
                />
                <Input
                    containerStyle={Form.input}
                    inputContainerStyle={Form.textarea}
                    placeholder="Опишите устройство"
                    label="Описание"
                    value={this.props.advert.description}
                    autoCorrect={false}
                    maxLength={255}
                    spellCheck
                    multiline
                    onChangeText={this.props.onDescriptionChange}
                />
            </ScrollView>
        );
    }
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
    }
});
