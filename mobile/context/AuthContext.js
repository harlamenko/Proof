import { AsyncStorage } from 'react-native';
import createDataContext from "./createDataContext";
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
    default:
      return prevState;
  }
};

const signup = dispatch => async ({ email, password }) => {
  try {
    dispatch({ type: 'CLEAR_ERROR_MESSAGE' });

    const { data: { token, user } } = await ProofAPI.post('/signup', { email, password });
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));

    dispatch({ type: 'SIGN_IN', payload: { token, user } })
  } catch (err) {
    dispatch({ type: 'SET_ERROR_MESSAGE', payload: 'Ошибка регистрации.' });
  }
}

const signin = dispatch => async ({ email, password }) => {
  try {
    dispatch({ type: 'CLEAR_ERROR_MESSAGE' });

    const { data: { token, user } } = await ProofAPI.post('/signin', { email, password });
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));

    dispatch({ type: 'SIGN_IN', payload: { token, user } });
  } catch (err) {
    dispatch({ type: 'SET_ERROR_MESSAGE', payload: 'Ошибка входа.' });
  }
}

const signout = dispatch => async () => {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('user');

  dispatch({ type: 'SIGN_OUT' })
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

// TODO: доб метод на удаление при удалении объявления
// TODO: доб метод на изменении при изменении объявления
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
  { token: null, myAdvert: null, errorMessage: '', initialyLoaded: false }
);
