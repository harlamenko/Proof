
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
export class Products extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>Products</Text>
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