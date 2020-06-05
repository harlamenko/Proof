import { AsyncStorage } from 'react-native';
import Toast from 'react-native-simple-toast';
import ProofAPI from '../api/ProofAPI';
import createDataContext from './createDataContext';

export const initialState = {
  token: null,
  myAdvert: null,
  errorMessage: '',
  initialyLoaded: false,
  loading: false,
  registering: false,
  user: null,
};

export const CHANGE_REGISTERING = 'CHANGE_REGISTERING';
export const SET_ERROR_MESSAGE = 'SET_ERROR_MESSAGE';
export const SIGN_IN = 'SIGN_IN';
export const SIGN_OUT = 'SIGN_OUT';
export const SET_LOCAL_INFO = 'SET_LOCAL_INFO';
export const CLEAR_ERROR_MESSAGE = 'CLEAR_ERROR_MESSAGE';
export const SET_INITIAL_LOADING = 'SET_INITIAL_LOADING';
export const CHANGE_LOADING = 'CHANGE_LOADING';

export const validateEmail = (email) => {
  return /\S+@\S+\.\S+/.test(String(email).toLowerCase());
};

export const validatePassword = (pwd) => {
  return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/.test(String(pwd));
};

export const authReducer = (prevState, action) => {
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
  if (!email || !password2 || !password) {
    dispatch({ type: SET_ERROR_MESSAGE, payload: 'Не все поля заполнены!' });
    return false;
  }

  if (!validateEmail(email)) {
    dispatch({ type: SET_ERROR_MESSAGE, payload: 'Email введён неправильно.' });
    return false;
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
    return false;
  }

  if (password !== password2) {
    dispatch({ type: SET_ERROR_MESSAGE, payload: 'Пароли не совпадают.' });
    return false;
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

      Toast.showWithGravity(
        'Вы зарегистрировались!',
        Toast.SHORT,
        Toast.CENTER
      );
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
  dispatch({
    type: SET_LOCAL_INFO,
    payload: { myAdvert: JSON.parse(myAdvert) },
  });
};

const setLocalInfo = (dispatch) => async (myAdvert) => {
  await AsyncStorage.setItem('myAdvert', JSON.stringify(myAdvert));
  dispatch({ type: SET_LOCAL_INFO, payload: { myAdvert } });
};

const changeRegistering = (dispatch) => (payload) => {
  dispatch({ type: CHANGE_REGISTERING, payload });
};

const updateProfile = (dispatch) => async (payload, cb = null) => {
  dispatch({ type: CHANGE_LOADING, payload: true });

  try {
    const { data: user } = await ProofAPI.post('/profile', payload);
    await AsyncStorage.setItem('user', JSON.stringify(user));

    if (cb) {
      cb();
    }

    dispatch({ type: SIGN_IN, payload: { user } });
    Toast.showWithGravity(
      'Данные успешно сохранены!',
      Toast.SHORT,
      Toast.CENTER
    );
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
  initialState
);
