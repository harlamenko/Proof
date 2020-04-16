
import React from 'react';
import { View, Text } from 'react-native';
import { Image } from 'react-native-elements';
import { adverts } from '../constants/mocks';


export class AdvertDetails extends React.Component {
    constructor(props) {
        super(props);
        const { id } = this.props.route.params;
        this.state = {
            item: adverts.find(item => item.id === id)
        }
    }
    render() {
        return (
            <View>
                <Image
                    style={{ width: '100%', height: 280 }}
                    resizeMode="contain"
                    source={{ uri: this.state.item.photo }}
                />
                {this.getCharacteristics()}
            </View>
        )
    }

    getCharacteristics = () => {
        const info = this.state.item.getFullInfo();

        return <View>
            <Text>Характеристики:</Text>
            {info.map(({ name, value }, i) => <Text key={i}>{name}: {value}</Text>)}
        </View>
    }
}