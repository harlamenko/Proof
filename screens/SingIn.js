import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-elements";
import { Context as AuthContext } from '../context/AuthContext';
import AuthForm from '../components/AuthForm';

const SignIn = ({ navigation }) => {
  const { state, signin, clearErrorMessage } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <AuthForm
        title="Войти"
        errorMessage={state.errorMessage}
        submitBtnText="Войти"
        onSubmit={signin}
      />
      <Button
        containerStyle={styles.toggleBtn}
        title="РЕГИСТРАЦИЯ"
        type="clear"
        onPress={() => { clearErrorMessage(); navigation.navigate('SignUp'); }}
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

export default SignIn;
