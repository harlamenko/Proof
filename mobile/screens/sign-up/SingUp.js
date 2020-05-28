import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';
import { AuthContext } from '../../context';
import { AuthForm } from '../../components';

const SignUp = ({ navigation }) => {
  const { state, signup, clearErrorMessage } = useContext(AuthContext);

  const submit = async (data) => {
    try {
      await signup(data);
      navigation.navigate('ProfileInfo');
    } catch (e) {}
  };

  return (
    <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 150,
  },
  toggleBtn: {
    marginBottom: 20,
    marginHorizontal: 10,
  },
});

export default SignUp;
