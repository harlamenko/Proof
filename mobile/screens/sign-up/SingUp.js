import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthForm } from '../../components';
import { AuthContext } from '../../context';

const SignUp = ({ navigation }) => {
  const { state, signup, clearErrorMessage } = useContext(AuthContext);

  const submit = async (data) => {
    try {
      await signup(data);
      navigation.navigate('ProfileInfo');
    } catch (e) {}
  };

  return (
    <SafeAreaView style={styles.container}>
      <AuthForm
        isSingIn={true}
        title="Зарегистрироваться"
        loading={state.loading}
        errorMessage={state.errorMessage}
        onClearErrorMessage={clearErrorMessage}
        submitBtnText="Зарегистрироваться"
        onSubmit={submit}
      />
      <Button
        containerStyle={styles.toggleBtn}
        title="ВХОД"
        type="clear"
        onPress={() => {
          clearErrorMessage();
          navigation.navigate('SignIn');
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  toggleBtn: { marginTop: 40, marginBottom: -40 },
});

export default SignUp;
