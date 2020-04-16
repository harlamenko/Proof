import React from 'react';
import { TouchableOpacity } from 'react-native';
import { SimpleLineIcons } from '@expo/vector-icons';

export function BackBtn(props) {
    return (
        <TouchableOpacity
            onPress={() => props.navigation.canGoBack() && props.navigation.goBack()} >
            <SimpleLineIcons
                name="arrow-left"
                size={22}
                color="white" />
        </TouchableOpacity>
    )
}