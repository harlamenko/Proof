import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthForm } from '../components';
import { AuthContext } from '../context';

const SignIn = ({ navigation }) => {
  const { state, signin, clearErrorMessage } = useContext(AuthContext);

  return (
    <SafeAreaView style={styles.container}>
      <AuthForm
        title="Войти"
        errorMessage={state.errorMessage}
        onClearErrorMessage={clearErrorMessage}
        loading={state.loading}
        submitBtnText="Войти"
        onSubmit={signin}
      />
      <Button
        containerStyle={styles.toggleBtn}
        title="РЕГИСТРАЦИЯ"
        type="clear"
        onPress={() => {
          clearErrorMessage();
          navigation.navigate('SignUp');
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  toggleBtn: { marginTop: 40, marginBottom: -40 },
});

export default SignIn;
