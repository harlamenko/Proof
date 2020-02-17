
import React from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Card, ThemeProvider, Image } from 'react-native-elements';
import { products } from './../constants/mocks';
import { theme } from './../constants/theme';


export class Products extends React.Component {
    constructor(props) {
        super(props);
    }
    
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

    keyExtractor = ({id}) => `${id}`;

    renderItem = ({item}) => (
        <TouchableOpacity
            onPress={this.redirectToDetails.bind(this, item.id)}
            activeOpacity={0.5}
        >
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
                    {/* TODO: заменить на listview */}
                    <View style={styles.characteristics}>
                        {this.getCharacteristics(item)}
                    </View>
                </View>
            </Card>
        </TouchableOpacity>
    )

    redirectToDetails = (id) => {
        this.props.navigation.navigate('ProductDetails', {id});
    }
    
    getCharacteristics = (item) =>
        Object.entries(item.characteristics).map(([k, v], i) => (
            // TODO: заменить на listitem
            <View key={i} style={styles.characteristic}>
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