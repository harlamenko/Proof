import { AsyncStorage } from 'react-native';
import createDataContext from './createDataContext';
import Toast from 'react-native-simple-toast';
import ProofAPI from '../api/ProofAPI';

const CHANGE_REGISTERING = 'CHANGE_REGISTERING';
const SET_ERROR_MESSAGE = 'SET_ERROR_MESSAGE';
const SIGN_IN = 'SIGN_IN';
const SIGN_OUT = 'SIGN_OUT';
const SET_LOCAL_INFO = 'SET_LOCAL_INFO';
const CLEAR_ERROR_MESSAGE = 'CLEAR_ERROR_MESSAGE';
const SET_INITIAL_LOADING = 'SET_INITIAL_LOADING';
const CHANGE_LOADING = 'CHANGE_LOADING';

const validateEmail = (email) => {
  return /\S+@\S+\.\S+/.test(String(email).toLowerCase());
};

const validatePassword = (pwd) => {
  return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/.test(String(pwd));
};

const authReducer = (prevState, action) => {
  switch (action.type) {
    case SET_ERROR_MESSAGE:
      return {
        ...prevState,
        errorMessage: action.payload,
      };
    case SIGN_IN:
      return {
        ...prevState,
        ...action.payload,
        errorMessage: '',
      };
    case SIGN_OUT:
      return {
        ...prevState,
        token: null,
      };
    case SET_LOCAL_INFO:
      return {
        ...prevState,
        ...action.payload,
      };
    case CLEAR_ERROR_MESSAGE:
      return {
        ...prevState,
        errorMessage: '',
      };
    case SET_INITIAL_LOADING:
      return {
        ...prevState,
        initialyLoaded: true,
      };
    case CHANGE_LOADING:
      return {
        ...prevState,
        loading: action.payload,
      };
    case CHANGE_REGISTERING:
      return {
        ...prevState,
        registering: action.payload,
      };
    default:
      return prevState;
  }
};

const signup = (dispatch) => ({ email, password, password2 }) => {
  if (!validateEmail(email)) {
    dispatch({ type: SET_ERROR_MESSAGE, payload: 'Email введён неправильно.' });
    return;
  }

  if (!validatePassword(password)) {
    dispatch({
      type: SET_ERROR_MESSAGE,
      payload: `Пароль введён неправильно. 
Пароль должен содержать минимум:
- 1 цифру;
- 1 букву в нижнем регистре;
- 1 букву в верхнем регистре.
Минимальная длинна пароля - 8 символов.`,
    });
    return;
  }

  if (password !== password2) {
    dispatch({ type: SET_ERROR_MESSAGE, payload: 'Пароли не совпадают.' });
    return;
  }

  return new Promise(async (resolve) => {
    dispatch({ type: CHANGE_LOADING, payload: true });
    dispatch({ type: CHANGE_REGISTERING, payload: true });

    try {
      dispatch({ type: CLEAR_ERROR_MESSAGE });
      const {
        data: { token, user },
      } = await ProofAPI.post('/signup', { email, password });

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      resolve();

      Toast.showWithGravity('Вы зарегистрировались!', Toast.SHORT, Toast.CENTER);
      dispatch({ type: SIGN_IN, payload: { token, user } });
    } catch (err) {
      dispatch({ type: SET_ERROR_MESSAGE, payload: 'Ошибка регистрации.' });
    }

    dispatch({ type: CHANGE_LOADING, payload: false });
  });
};

const signin = (dispatch) => async ({ email, password }) => {
  dispatch({ type: CHANGE_LOADING, payload: true });
  try {
    dispatch({ type: CLEAR_ERROR_MESSAGE });
    const {
      data: { token, user },
    } = await ProofAPI.post('/signin', { email, password });
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    dispatch({ type: SIGN_IN, payload: { token, user } });
    Toast.showWithGravity('Вы вошли в аккаунт!', Toast.SHORT, Toast.CENTER);
  } catch (err) {
    dispatch({ type: SET_ERROR_MESSAGE, payload: 'Ошибка входа.' });
  }
  dispatch({ type: CHANGE_LOADING, payload: false });
};

const signout = (dispatch) => async () => {
  dispatch({ type: CHANGE_LOADING, payload: true });
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('user');
  Toast.showWithGravity('Вы вышли из аккаунта', Toast.SHORT, Toast.CENTER);
  dispatch({ type: SIGN_OUT });
  dispatch({ type: CHANGE_LOADING, payload: false });
};

const clearErrorMessage = (dispatch) => () => {
  dispatch({ type: CLEAR_ERROR_MESSAGE });
};

const tryLocalSignin = (dispatch) => async () => {
  const token = await AsyncStorage.getItem('token');
  const user = await AsyncStorage.getItem('user');

  dispatch({ type: SIGN_IN, payload: { token, user: JSON.parse(user) } });
  dispatch({ type: SET_INITIAL_LOADING });
};

const getLocalInfo = (dispatch) => async () => {
  const myAdvert = await AsyncStorage.getItem('myAdvert');
  dispatch({ type: SET_LOCAL_INFO, payload: { myAdvert: JSON.parse(myAdvert) } });
};

const setLocalInfo = (dispatch) => async (myAdvert) => {
  await AsyncStorage.setItem('myAdvert', JSON.stringify(myAdvert));
  dispatch({ type: SET_LOCAL_INFO, payload: { myAdvert } });
};

const changeRegistering = (dispatch) => (payload) => {
  dispatch({ type: CHANGE_REGISTERING, payload });
};

const updateProfile = (dispatch) => async (payload) => {
  dispatch({ type: CHANGE_LOADING, payload: true });

  try {
    const { data: user } = await ProofAPI.post('/profile', payload);
    await AsyncStorage.setItem('user', JSON.stringify(user));

    dispatch({ type: SIGN_IN, payload: { user } });
    Toast.showWithGravity('Данные успешно сохранены!', Toast.SHORT, Toast.CENTER);
  } catch (err) {
    console.error(err);
  }

  dispatch({ type: CHANGE_REGISTERING, payload: false });
  dispatch({ type: CHANGE_LOADING, payload: false });
};

export const { Provider, Context } = createDataContext(
  authReducer,
  {
    signin,
    signup,
    signout,
    clearErrorMessage,
    tryLocalSignin,
    getLocalInfo,
    setLocalInfo,
    changeRegistering,
    updateProfile,
  },
  {
    token: null,
    myAdvert: null,
    errorMessage: '',
    initialyLoaded: false,
    loading: false,
    registering: false,
    user: null,
  }
);
