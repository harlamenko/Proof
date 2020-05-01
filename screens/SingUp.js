import React from "react";
import { StyleSheet } from "react-native";
import { Text, Input, Button } from "react-native-elements";
import { useState } from "react";

const SignUp = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  return (
    <View>
      <Text h3 style={styles.title}>
        Зарегистрироваться
      </Text>
      <Input
        style={styles.input}
        label="Email"
        value={email}
        onChange={setEmail}
      />
      <Input
        style={styles.input}
        label="Пароль"
        value={password}
        onChange={setPassword}
      />
      <Button title="Зарегистрироваться" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    marginBottom: 200,
  },
  input: {
    marginVertical: 8,
  },
  title: {
    marginBottom: 22,
  },
});

export default SignUp;
