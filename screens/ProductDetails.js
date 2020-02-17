
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Image } from 'react-native-elements';
import { products } from './../constants/mocks';


export class ProductDetails extends React.Component {
    constructor(props) {
        super(props);
        const { id } = this.props.route.params;
        this.item = products.find(item => item.id === id);
    }
    render() {
        return (
            <View>
                <Image
                    style={{width: '100%', height: 280}}
                    resizeMode="contain"
                    source={{ uri: this.item.photo }}
                />
                <Text>Характеристики:</Text>
                {/* добавить listview */}
                {this.getCharacteristics()}
            </View>
        )
    }

    getCharacteristics = () =>
        Object.entries(this.item.characteristics).map(([k, v], i) => (
            // TODO: заменить на listitem
            <View key={i}>
                <Text>
                    {k}:
                </Text>
                <Text style={styles.text}>
                    {v}
                </Text>
            </View>
        )
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})