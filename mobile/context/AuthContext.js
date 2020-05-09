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
        token: action.payload,
        errorMessage: ''
      };
    case 'SIGN_OUT':
      return {
        ...prevState,
        token: null,
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

    const res = await ProofAPI.post('/signup', { email, password });
    await AsyncStorage.setItem('token', res.data.token);

    dispatch({ type: 'SIGN_IN', payload: res.data.token })
  } catch (err) {
    dispatch({ type: 'SET_ERROR_MESSAGE', payload: 'Ошибка регистрации.' });
  }
}

const signin = dispatch => async ({ email, password }) => {
  try {
    dispatch({ type: 'CLEAR_ERROR_MESSAGE' });

    const res = await ProofAPI.post('/signin', { email, password });
    await AsyncStorage.setItem('token', res.data.token);

    dispatch({ type: 'SIGN_IN', payload: res.data.token })
  } catch (err) {
    dispatch({ type: 'SET_ERROR_MESSAGE', payload: 'Ошибка входа.' });
  }
}

const signout = dispatch => async () => {
  await AsyncStorage.removeItem('token');

  dispatch({ type: 'SIGN_OUT' })
}

const clearErrorMessage = dispatch => () => {
  dispatch({ type: 'CLEAR_ERROR_MESSAGE' });
}

const tryLocalSignin = dispatch => async () => {
  const token = await AsyncStorage.getItem('token');

  dispatch({ type: 'SIGN_IN', payload: token });
  dispatch({ type: 'SET_INITIAL_LOADING' });
}

export const { Provider, Context } = createDataContext(
  authReducer,
  { signin, signup, signout, clearErrorMessage, tryLocalSignin },
  { token: null, errorMessage: '', initialyLoaded: false }
);