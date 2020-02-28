import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Input, Button } from 'react-native-elements';
import * as Device from 'expo-device';

export class AddAdvert extends Component {
    constructor(props) {
        super(props);
        /*
        TODO:
            вынести в отдельный класс, который будет определять:
            - тип устройства,
            - ось

            И на основе этих данных маппить инфу об устройсве
        */

        this.state = {
            customCharacteristic_key: null,
            customCharacteristic_value: null,
            item: {
                osBuildId: Device.osBuildId,
                modelName: Device.modelName,
                brand: Device.brand,
                deviceYearClass: Device.deviceYearClass,
                osName: Device.osName,
                photo: null,
                // TODO: заменить на массив объектов
                customCharacteristics: {
                    color: 'серо-буро-малиновый',
                    price: 'бесплатно',
                }
            }  
        }
    }
    render = () => (
        <View style={styles.screen}>
            {/* TODO: добавить file uploader для фотографии */}
            <Text>osBuildId: { this.state.item.osBuildId}</Text>
            <Text>modelName: { this.state.item.modelName}</Text>
            <Text>brand: { this.state.item.brand}</Text>
            <Text>deviceYearClass: { this.state.item.deviceYearClass}</Text>
            <Text>osName: { this.state.item.osName}</Text>

            {
                this.state.item.customCharacteristics.length ?
                    <Text>Характеристики:</Text> :
                    <Text></Text>
            }
            {this.getCharacteristics()}
            <View style={styles.customCharacteristic}>
                {/* TODO: ограничить кол-во вводимых символов */}
                <Input
                    containerStyle={styles.customCharacteristic_input}
                    placeholder="Характеристика"
                    onChange={this.onCustomCharacteristicChange.bind(this, 'key')}
                    value={this.state.customCharacteristic_key}
                />
                {/* TODO: ограничить кол-во вводимых символов */}
                <Input
                    containerStyle={styles.customCharacteristic_input}
                    placeholder="Значение"
                    onChange={this.onCustomCharacteristicChange.bind(this, 'value')}
                    value={this.state.customCharacteristic_value}
                />
            </View>
            <Button 
                title='ДОБАВИТЬ ХАРАКТЕРИСТИКУ'
                containerStyle={styles.addCharacteristicBtn}
                onPress={() => this.addCharacteristic()}
            />
        </View>
    )

    onCustomCharacteristicChange = (type, e) => {
        this.setState({ [`customCharacteristic_${type}`]: e.nativeEvent.text });
    }

    addCharacteristic = () => {
        // TODO: добавить подсвечивание незаполненного поля
        const {customCharacteristic_key, customCharacteristic_value} = this.state;
        
        if (!customCharacteristic_key || !customCharacteristic_value) { return; }

        const existCharacteristics = this.state.item.customCharacteristics;
        const newCharacteristic = {[customCharacteristic_key]: customCharacteristic_value};
        const customCharacteristics = Object.assign({}, existCharacteristics, newCharacteristic)
        const item = Object.assign({}, this.state.item, {customCharacteristics})
        
        this.setState({item});
    }
    
    getCharacteristics = () => Object.entries(this.state.item.customCharacteristics).map(([k, v], i) => <Text key={i}>{k}: {v}</Text>)
}

const styles = StyleSheet.create({
    screen: {
        padding: 8
    },
    customCharacteristic: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    customCharacteristic_input: {
        marginTop: 12,
        width: '50%'
    },
    addCharacteristicBtn: {
        marginTop: 12,
    }
})