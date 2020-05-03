import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-elements";
import { Context as AuthContext } from '../../context/AuthContext';
import { AuthForm } from '../../components';

const SignUp = ({ navigation }) => {
  const { state, signup, clearErrorMessage } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <AuthForm
        title="Зарегистрироваться"
        errorMessage={state.errorMessage}
        submitBtnText="Зарегистрироваться"
        onSubmit={signup}
      />
      <Button
        containerStyle={styles.toggleBtn}
        title="ВХОД"
        type="clear"
        onPress={() => { clearErrorMessage(); navigation.navigate('SignIn'); }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: 150,
  },
  toggleBtn: {
    marginBottom: 20,
    marginHorizontal: 10,
  }
});

export default SignUp;
