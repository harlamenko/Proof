
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Image } from 'react-native-elements';
import { adverts } from '../constants/mocks';


export class AdvertDetails extends React.Component {
    constructor(props) {
        super(props);
        const { id } = this.props.route.params;
        this.state = {
            item : adverts.find(item => item.id === id)
        }
    }
    render() {
        return (
            <View>
                <Image
                    style={{width: '100%', height: 280}}
                    resizeMode="contain"
                    source={{ uri: this.state.item.photo }}
                />
                {this.getCharacteristics()}
            </View>
        )
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
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})