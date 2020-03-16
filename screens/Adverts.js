
import React from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Card, ThemeProvider, Image } from 'react-native-elements';
import { adverts } from '../constants/mocks';
import { advertsScreen } from '../constants/theme';


export class Adverts extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <ThemeProvider theme={advertsScreen}>
                <FlatList
                    data={adverts}
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
                title={item.modelName}
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
        </TouchableOpacity>
    )

    redirectToDetails = (id) => {
        this.props.navigation.navigate('AdvertDetails', {id});
    }
    
    getCharacteristics = ({customCharacteristics}) => (
        customCharacteristics.length ?
            customCharacteristics.map(({ name, value }, i) => <Text key={i}>{name}: {value}</Text>) :
            null
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