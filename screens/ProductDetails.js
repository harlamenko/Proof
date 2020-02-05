
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
export class ProductDetails extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>ProductDetails</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})