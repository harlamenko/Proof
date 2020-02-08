
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { Card, ThemeProvider, Image } from 'react-native-elements';

import { products } from './../constants/mocks';
import { theme } from './../constants/theme';


export class Products extends React.Component {
    render() {
        return (
            <ThemeProvider theme={theme}>
                <FlatList
                    data={products}
                    renderItem={this.renderItem}
                    keyExtractor={this.keyExtractor}
                />
            </ThemeProvider>
        )
    }

    keyExtractor = ({id}) => id;

    renderItem = ({item}) => (
        <Card
            title={item.name}
            titleStyle={{textAlign: 'left'}}
        >
            <View style={styles.card}>
                <Image
                    style={{width: 100, height: 180}}
                    resizeMode="contain"
                    source={{ uri: item.photo }}
                />
                <View style={styles.characteristics}>
                    {this.getCharacteristics(item)}
                </View>
            </View>
        </Card>
    )

    getCharacteristics = (item) =>
        Object.entries(item.characteristics).map(([k, v]) => (
            <View style={styles.characteristic}>
                <Text style={[styles.characteristicKey, styles.text]}>
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
    card: {
        flex: 1,
        flexDirection: 'row',
    },
    cardImage: {
        marginLeft: 8
    },
    characteristics: {
        marginLeft: 12,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    characteristic: {
        flex: 1,
        flexDirection: 'row',
        maxHeight: 24,
        maxWidth: '85%',
        overflow: 'hidden'
    },
    characteristicKey: {
        marginRight: 4,
        fontWeight: 'bold'
    },
    text: {
        fontSize: 16
    }
})