import React, { Component } from 'react';
import {
    ActivityIndicator,
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    ScrollView,
    TouchableOpacity,
    Alert
} from 'react-native';
import {
    Image,
    Input,
    Button
} from 'react-native-elements';
import * as Device from 'expo-device';
import * as ImagePicker from 'expo-image-picker';

export class AddAdvert extends Component {
    constructor(props) {
        super(props);
        this.keyInputRef = React.createRef();
        this.valueInputRef = React.createRef();
        /*
        TODO:
            вынести в отдельный класс, который будет определять:
            - тип устройства,
            - ось

            И на основе этих данных маппить инфу об устройсве
        */
        this.state = {
            keyInput: null,
            valueInput: null,
            item: {
                osBuildId: Device.osBuildId,
                modelName: Device.modelName,
                brand: Device.brand,
                deviceYearClass: Device.deviceYearClass,
                osName: Device.osName,
                photo: null,
                customCharacteristics: []
            }
        }
    }

    pickPhoto = () => {
        ImagePicker.requestCameraRollPermissionsAsync().then(res => {
            if (!res.granted) { return; }

            ImagePicker.launchImageLibraryAsync().then(image => {
                const { uri: photo } = image;
                const item = Object.assign({}, this.state.item, { photo });
                this.setState(Object.assign({}, this.state, { item }));
            })
        })
    }

    getImage = () => (
        <Image
            containerStyle={styles.deviceImageContainer}
            style={styles.deviceImage}
            resizeMode="center"
            source={{ uri: this.state.item.photo }}
            PlaceholderContent={<ActivityIndicator />}
        />
    )

    getImagePicker = () => (
        <TouchableOpacity onPress={this.pickPhoto}>
            <View style={styles.imagePicker}>
                <Text>Нажмите, чтобы выбрать фото</Text>
            </View>
        </TouchableOpacity>
    )

    getCustomCharInput = (options) => {
        const type = `${options.propName}Input`;

        return (
            <Input
                ref={this[`${type}Ref`]}
                maxLength={128}
                containerStyle={styles.customCharacteristic_input}
                placeholder={options.placeholder}
                onChange={e => this.setState({ [type]: e.nativeEvent.text })}
                value={this.state[type]}
            />
        )
    }

    render = () => (
        <KeyboardAvoidingView
            behavior="position"
            keyboardVerticalOffset={30}
        >
            <ScrollView
                style={styles.screen}
                showsVerticalScrollIndicator={false}
            >
                {this.state.item.photo ? this.getImage() : this.getImagePicker()}

                <Text>osBuildId: {this.state.item.osBuildId}</Text>
                <Text>modelName: {this.state.item.modelName}</Text>
                <Text>brand: {this.state.item.brand}</Text>
                <Text>deviceYearClass: {this.state.item.deviceYearClass}</Text>
                <Text>osName: {this.state.item.osName}</Text>

                {this.getCharacteristics()}

                <View style={styles.customCharacteristic}>
                    {this.getCustomCharInput({ placeholder: "Характеристика", propName: 'key' })}
                    {this.getCustomCharInput({ placeholder: "Значение", propName: 'value' })}
                </View>

                <Button
                    title='ДОБАВИТЬ ХАРАКТЕРИСТИКУ'
                    containerStyle={styles.addCharacteristicBtn}
                    onPress={this.addCharacteristic}
                />
            </ScrollView>
        </KeyboardAvoidingView>
    )

    addCharacteristic = () => {
        const { keyInput, valueInput } = this.state;

        if (!keyInput || !valueInput) {
            return Alert.alert(
                'Данные не заполнены!',
                'Для того, чтобы добавить характеристику необходимо заполнить оба поля.'
            );
        }

        const customCharacteristics = this.state.item.customCharacteristics;
        customCharacteristics.push({
            name: keyInput,
            value: valueInput
        });
        const item = Object.assign({}, this.state.item, { customCharacteristics });
        this.setState({ item });
        this.keyInputRef.current.clear();
        this.valueInputRef.current.clear();
    }

    getCharacteristics = () => (
        this.state.item.customCharacteristics.length ?
        <View>
            <Text>Характеристики:</Text>
            {this.state.item.customCharacteristics.map(({ name, value }, i) => <Text key={i}>{name}: {value}</Text>)}
        </View> :
        null
    )
}

const styles = StyleSheet.create({
    screen: {
        margin: 8
    },
    customCharacteristic: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    customCharacteristic_input: {
        marginTop: 12,
        width: '50%',
    },
    addCharacteristicBtn: {
        marginTop: 12,
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
        height: 260
    }
})