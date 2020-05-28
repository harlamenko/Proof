import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Input, Button, Icon } from 'react-native-elements';
import { Form } from '../../shared/styles';

export default ({
  title,
  errorMessage,
  submitBtnText,
  onSubmit,
  loading,
  isSingIn,
  onClearErrorMessage,
}) => {
  const [email, setEmail] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [password2, setPassword2] = useState('admin');

  return (
    <View>
      <Text h3 style={[styles.title, styles.bounders]}>
        {title}
      </Text>
      <Input
        containerStyle={Form.input}
        label="Email"
        value={email}
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={(value) => setEmail(value)}
      />
      <Input
        containerStyle={Form.input}
        label="Пароль"
        value={password}
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry
        onChangeText={(value) => setPassword(value)}
      />
      {isSingIn ? (
        <Input
          containerStyle={Form.input}
          label="Повторите пароль"
          value={password2}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
          onChangeText={(value) => setPassword2(value)}
        />
      ) : null}
      {errorMessage ? (
        <View style={{ position: 'relative' }}>
          <Icon
            name="x"
            type="feather"
            containerStyle={{ position: 'absolute', right: 4, zIndex: 10 }}
            iconStyle={{ zIndex: 10 }}
            onPress={() => {
              onClearErrorMessage();
            }}
          />
          <Text testID="errMsg" style={[styles.errorMessage, styles.bounders]}>
            {errorMessage}
          </Text>
        </View>
      ) : null}
      <Button
        testID="submitBtn"
        loading={loading}
        containerStyle={[styles.bounders, styles.submitBtn]}
        title={submitBtnText}
        onPress={() => onSubmit({ email, password, password2 })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    marginBottom: 22,
  },
  errorMessage: {
    color: 'red',
    marginBottom: 16,
    fontSize: 16,
  },
  bounders: {
    marginHorizontal: 10,
  },
  submitBtn: {
    marginTop: 8,
  },
});
