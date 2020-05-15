import { AsyncStorage } from 'react-native';
import createDataContext from "./createDataContext";
import Toast from 'react-native-simple-toast';
import ProofAPI from '../api/ProofAPI';

const authReducer = (prevState, action) => {
  switch (action.type) {
    case 'SET_ERROR_MESSAGE':
      return {
        ...prevState,
        errorMessage: action.payload
      };
    case 'SIGN_IN':
      return {
        ...prevState,
        token: action.payload.token,
        user: action.payload.user,
        errorMessage: ''
      };
    case 'SIGN_OUT':
      return {
        ...prevState,
        token: null,
      };
    case 'SET_LOCAL_INFO':
      return {
        ...prevState,
        ...action.payload
      };
    case 'CLEAR_ERROR_MESSAGE':
      return {
        ...prevState,
        errorMessage: ''
      };
    case 'SET_INITIAL_LOADING':
      return {
        ...prevState,
        initialyLoaded: true
      };
    case 'CHANGE_LOADING':
      return {
        ...prevState,
        loading: action.payload
      };
    default:
      return prevState;
  }
};

const signup = dispatch => async ({ email, password }) => {
  dispatch({ type: 'CHANGE_LOADING', payload: true });
  try {
    dispatch({ type: 'CLEAR_ERROR_MESSAGE' });

    const { data: { token, user } } = await ProofAPI.post('/signup', { email, password });

    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));

    Toast.showWithGravity('Вы зарегистрировались!', Toast.SHORT, Toast.CENTER);
    dispatch({ type: 'SIGN_IN', payload: { token, user } })
  } catch (err) {
    dispatch({ type: 'SET_ERROR_MESSAGE', payload: 'Ошибка регистрации.' });
  }
  dispatch({ type: 'CHANGE_LOADING', payload: false });
}

const signin = dispatch => async ({ email, password }) => {
  dispatch({ type: 'CHANGE_LOADING', payload: true });
  try {
    dispatch({ type: 'CLEAR_ERROR_MESSAGE' });
    const { data: { token, user } } = await ProofAPI.post('/signin', { email, password });
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    dispatch({ type: 'SIGN_IN', payload: { token, user } });
    Toast.showWithGravity('Вы вошли в аккаунт!', Toast.SHORT, Toast.CENTER);
  } catch (err) {
    dispatch({ type: 'SET_ERROR_MESSAGE', payload: 'Ошибка входа.' });
  }
  dispatch({ type: 'CHANGE_LOADING', payload: false });
}

const signout = dispatch => async () => {
  dispatch({ type: 'CHANGE_LOADING', payload: true });
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('user');
  Toast.showWithGravity('Вы вышли из аккаунта', Toast.SHORT, Toast.CENTER);
  dispatch({ type: 'SIGN_OUT' })
  dispatch({ type: 'CHANGE_LOADING', payload: false });
}

const clearErrorMessage = dispatch => () => {
  dispatch({ type: 'CLEAR_ERROR_MESSAGE' });
}

const tryLocalSignin = dispatch => async () => {
  const token = await AsyncStorage.getItem('token');
  const user = await AsyncStorage.getItem('user');

  dispatch({ type: 'SIGN_IN', payload: { token, user: JSON.parse(user) } });
  dispatch({ type: 'SET_INITIAL_LOADING' });
}

const getLocalInfo = dispatch => async () => {
  const myAdvert = await AsyncStorage.getItem('myAdvert');
  dispatch({ type: 'SET_LOCAL_INFO', payload: { myAdvert: JSON.parse(myAdvert) } });
}

const setLocalInfo = dispatch => async (myAdvert) => {
  await AsyncStorage.setItem('myAdvert', JSON.stringify(myAdvert));
  dispatch({ type: 'SET_LOCAL_INFO', payload: { myAdvert } });
}

export const { Provider, Context } = createDataContext(
  authReducer,
  { signin, signup, signout, clearErrorMessage, tryLocalSignin, getLocalInfo, setLocalInfo },
  { token: null, myAdvert: null, errorMessage: '', initialyLoaded: false, loading: false }
);
