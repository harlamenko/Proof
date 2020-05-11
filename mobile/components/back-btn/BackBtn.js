import React from 'react';
import { TouchableOpacity } from 'react-native';
import { SimpleLineIcons } from '@expo/vector-icons';

export function BackBtn(props) {
    const { navigation } = props;

    return (
        <TouchableOpacity
            onPress={() => navigation.canGoBack() && navigation.goBack()}
            {...props} >
            <SimpleLineIcons
                name="arrow-left"
                size={22}
            />
        </TouchableOpacity>
    )
}
