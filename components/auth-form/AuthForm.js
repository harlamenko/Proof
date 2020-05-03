import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text, Input, Button } from "react-native-elements";

export default ({ title, errorMessage, submitBtnText, onSubmit }) => {
    // TODO: убрать хардкод
    const [email, setEmail] = useState('admin');
    const [password, setPassword] = useState('admin');

    return (
        <View>
            <Text h3 style={[styles.title, styles.bounders]}>{title}</Text>
            <Input
                containerStyle={styles.input}
                label="Email"
                value={email}
                autoCapitalize='none'
                autoCorrect={false}
                onChangeText={value => setEmail(value)}
            />
            <Input
                containerStyle={styles.input}
                label="Пароль"
                value={password}
                autoCapitalize='none'
                autoCorrect={false}
                secureTextEntry
                onChangeText={value => setPassword(value)}
            />
            {errorMessage ? <Text style={[styles.errorMessage, styles.bounders]}>{errorMessage}</Text> : null}
            <Button
                containerStyle={[styles.bounders, styles.submitBtn]}
                title={submitBtnText}
                onPress={() => onSubmit({ email, password })}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        marginVertical: 8,
    },
    title: {
        marginBottom: 22,
    },
    errorMessage: {
        color: 'red',
        marginBottom: 16,
        fontSize: 16
    },
    bounders: {
        marginHorizontal: 10
    },
    submitBtn: {
        marginTop: 8
    }
});