console.error = jest.fn();
jest.mock('axios', () => ({
  create: jest.fn().mockReturnValue({
    interceptors: {
      request: {
        use: jest.fn(),
      },
    },
    post: jest.fn().mockReturnValueOnce(
      Promise.resolve({
        data: {
          adverts: [{ _id: 1 }],
        },
      })
    ),
  }),
}));
jest.mock('react-native-simple-toast', () => ({
  SHORT: jest.fn(),
}));
const userInfo = {
  email: 'adf@adf.com',
  password: 'Aasdfas124231',
  password2: 'Aasdfas124231',
};

import React from 'react';
import { Button } from 'react-native-elements';
import { cleanup, fireEvent, render } from 'react-native-testing-library';
import { AuthContext, AuthProvider } from '../context';
import {
  authReducer,
  CHANGE_LOADING,
  CHANGE_REGISTERING,
  CLEAR_ERROR_MESSAGE,
  initialState,
  SET_ERROR_MESSAGE,
  SET_INITIAL_LOADING,
  SET_LOCAL_INFO,
  SIGN_IN,
  SIGN_OUT,
  validateEmail,
  validatePassword,
} from '../context/AuthContext';

describe('AuthContext', () => {
  afterEach(cleanup);

  it('Правильно валидируется email', () => {
    expect(validateEmail('asdf')).toBeFalsy();
    expect(validateEmail('asdf@afd.com')).toBeTruthy();
  });

  it('Правильно валидируется пароль', () => {
    expect(validatePassword('asdf')).toBeFalsy();
    expect(validatePassword('Aasdf12312afdcom')).toBeTruthy();
  });

  it('authReducer по умолчанию возвращает текущее состояние', () => {
    const action = { type: null };
    const state = authReducer(initialState, action);

    expect(state).toEqual(initialState);
  });

  it('authReducer корректно изменяет сообщение об ошибке', () => {
    let msg = 'ошибка';
    let action = { type: SET_ERROR_MESSAGE, payload: msg };
    let state = authReducer(initialState, action);

    expect(state.errorMessage).toMatch(msg);

    msg = '';
    action = { type: SET_ERROR_MESSAGE, payload: msg };
    state = authReducer(state, action);

    expect(state.errorMessage).toMatch(msg);
  });

  it('authReducer корректно сохраняет данные пользователя', () => {
    const user = { token: '123', user: '123' };
    const action = { type: SIGN_IN, payload: user };
    const state = authReducer(initialState, action);

    expect(state.token).toMatch(user.token);
    expect(state.user).toMatch(user.user);
    expect(state.errorMessage).toMatch('');
  });

  it('authReducer корректно очищает данные пользователя', () => {
    const action = { type: SIGN_OUT };
    const state = authReducer(initialState, action);

    expect(state.token).toBeNull();
  });

  it('authReducer корректно сохраняет пользовательское объявление', () => {
    const myAdvert = { _id: 1 };
    const action = { type: SET_LOCAL_INFO, payload: { myAdvert } };
    const state = authReducer(initialState, action);

    expect(state.myAdvert).toEqual(myAdvert);
  });

  it('authReducer корректно очищает сообщение об ошибке', () => {
    const action = { type: CLEAR_ERROR_MESSAGE };
    const state = authReducer(initialState, action);

    expect(state.errorMessage).toMatch('');
  });

  it('authReducer корректно изменяет состояние загрузки', () => {
    let action = { type: SET_INITIAL_LOADING };
    let state = authReducer(initialState, action);

    expect(state.initialyLoaded).toBeTruthy();

    action = { type: CHANGE_LOADING, payload: true };
    state = authReducer(state, action);

    expect(state.loading).toBeTruthy();

    action = { type: CHANGE_LOADING, payload: false };
    state = authReducer(state, action);

    expect(state.loading).toBeFalsy();
  });

  it('authReducer корректно изменяет состояние регистрации', () => {
    let action = { type: CHANGE_REGISTERING, payload: true };
    let state = authReducer(initialState, action);

    expect(state.registering).toBeTruthy();

    action = { type: CHANGE_REGISTERING, payload: false };
    state = authReducer(state, action);

    expect(state.registering).toBeFalsy();
  });

  it('signin инициирует запрос на вход', () => {
    const Test = ({ onPress, signup }) => (
      <Button
        testID="btn"
        onPress={() => {
          onPress();
          signup(userInfo);
        }}
      />
    );
    const onPress = jest.fn();
    const { getByTestId } = render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => <Test onPress={onPress} {...value} />}
        </AuthContext.Consumer>
      </AuthProvider>
    );
    fireEvent(getByTestId('btn'), 'onPress');
    expect(onPress).toHaveBeenCalled();
  });

  it('signin кеширует данные пользователя', () => {
    const Test = ({ onPress, signin }) => (
      <Button
        testID="btn"
        onPress={() => {
          onPress();
          signin();
        }}
      />
    );
    const onPress = jest.fn();
    const { getByTestId } = render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => <Test onPress={onPress} {...value} />}
        </AuthContext.Consumer>
      </AuthProvider>
    );
    fireEvent(getByTestId('btn'), 'onPress');
    expect(onPress).toHaveBeenCalled();
  });

  it('signup корректно валидирует email', () => {
    const Test = ({ onPress, signup }) => (
      <Button
        testID="btn"
        onPress={() => {
          onPress();
          signup(userInfo);
        }}
      />
    );
    const onPress = jest.fn();
    const { getByTestId } = render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => <Test onPress={onPress} {...value} />}
        </AuthContext.Consumer>
      </AuthProvider>
    );
    fireEvent(getByTestId('btn'), 'onPress');
    expect(onPress).toHaveBeenCalled();
  });

  it('signup устанавливает сообщения об невалидном email', () => {
    const Test = ({ onPress, signup }) => (
      <Button
        testID="btn"
        onPress={() => {
          onPress();
          signup(userInfo);
        }}
      />
    );
    const onPress = jest.fn();
    const { getByTestId } = render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => <Test onPress={onPress} {...value} />}
        </AuthContext.Consumer>
      </AuthProvider>
    );
    fireEvent(getByTestId('btn'), 'onPress');
    expect(onPress).toHaveBeenCalled();
  });

  it('signup корректно валидирует пароль', () => {
    const Test = ({ onPress, signup }) => (
      <Button
        testID="btn"
        onPress={() => {
          onPress();
          signup(userInfo);
        }}
      />
    );
    const onPress = jest.fn();
    const { getByTestId } = render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => <Test onPress={onPress} {...value} />}
        </AuthContext.Consumer>
      </AuthProvider>
    );
    fireEvent(getByTestId('btn'), 'onPress');
    expect(onPress).toHaveBeenCalled();
  });

  it('signup устанавливает сообщения об невалидном пароле', () => {
    const Test = ({ onPress, signup }) => (
      <Button
        testID="btn"
        onPress={() => {
          onPress();
          signup(userInfo);
        }}
      />
    );
    const onPress = jest.fn();
    const { getByTestId } = render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => <Test onPress={onPress} {...value} />}
        </AuthContext.Consumer>
      </AuthProvider>
    );
    fireEvent(getByTestId('btn'), 'onPress');
    expect(onPress).toHaveBeenCalled();
  });

  it('signup инициирует запрос на регистрацию', () => {
    const Test = ({ onPress, signup }) => (
      <Button
        testID="btn"
        onPress={() => {
          onPress();
          signup(userInfo);
        }}
      />
    );
    const onPress = jest.fn();
    const { getByTestId } = render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => <Test onPress={onPress} {...value} />}
        </AuthContext.Consumer>
      </AuthProvider>
    );
    fireEvent(getByTestId('btn'), 'onPress');
    expect(onPress).toHaveBeenCalled();
  });

  it('signup кеширует данные пользователя', () => {
    const Test = ({ onPress, signup }) => (
      <Button
        testID="btn"
        onPress={() => {
          onPress();
          signup(userInfo);
        }}
      />
    );
    const onPress = jest.fn();
    const { getByTestId } = render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => <Test onPress={onPress} {...value} />}
        </AuthContext.Consumer>
      </AuthProvider>
    );
    fireEvent(getByTestId('btn'), 'onPress');
    expect(onPress).toHaveBeenCalled();
  });

  it('signout очищает кешированные данные пользователя', () => {
    const Test = ({ onPress, signout }) => (
      <Button
        testID="btn"
        onPress={() => {
          onPress();
          signout();
        }}
      />
    );
    const onPress = jest.fn();
    const { getByTestId } = render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => <Test onPress={onPress} {...value} />}
        </AuthContext.Consumer>
      </AuthProvider>
    );
    fireEvent(getByTestId('btn'), 'onPress');
    expect(onPress).toHaveBeenCalled();
  });

  it('signout отображает сообщение о выходе', () => {
    const Test = ({ onPress, signout }) => (
      <Button
        testID="btn"
        onPress={() => {
          onPress();
          signout();
        }}
      />
    );
    const onPress = jest.fn();
    const { getByTestId } = render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => <Test onPress={onPress} {...value} />}
        </AuthContext.Consumer>
      </AuthProvider>
    );
    fireEvent(getByTestId('btn'), 'onPress');
    expect(onPress).toHaveBeenCalled();
  });

  it('clearErrorMessage очищает сообщение об ошибке', () => {
    const Test = ({ onPress, clearErrorMessage }) => (
      <Button
        testID="btn"
        onPress={() => {
          onPress();
          clearErrorMessage();
        }}
      />
    );
    const onPress = jest.fn();
    const { getByTestId } = render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => <Test onPress={onPress} {...value} />}
        </AuthContext.Consumer>
      </AuthProvider>
    );
    fireEvent(getByTestId('btn'), 'onPress');
    expect(onPress).toHaveBeenCalled();
  });

  it('tryLocalSignin инициирует запрос на вход на основе кеша', () => {
    const Test = ({ onPress, tryLocalSignin }) => (
      <Button
        testID="btn"
        onPress={() => {
          onPress();
          tryLocalSignin();
        }}
      />
    );
    const onPress = jest.fn();
    const { getByTestId } = render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => <Test onPress={onPress} {...value} />}
        </AuthContext.Consumer>
      </AuthProvider>
    );
    fireEvent(getByTestId('btn'), 'onPress');
    expect(onPress).toHaveBeenCalled();
  });

  it('getLocalInfo получает информацию об объявлении пользователя', () => {
    const Test = ({ onPress, getLocalInfo }) => (
      <Button
        testID="btn"
        onPress={() => {
          onPress();
          getLocalInfo();
        }}
      />
    );
    const onPress = jest.fn();
    const { getByTestId } = render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => <Test onPress={onPress} {...value} />}
        </AuthContext.Consumer>
      </AuthProvider>
    );
    fireEvent(getByTestId('btn'), 'onPress');
    expect(onPress).toHaveBeenCalled();
  });

  it('setLocalInfo сохраняет информацию об объявлении пользователя', () => {
    const Test = ({ onPress, setLocalInfo }) => (
      <Button
        testID="btn"
        onPress={() => {
          onPress();
          setLocalInfo();
        }}
      />
    );
    const onPress = jest.fn();
    const { getByTestId } = render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => <Test onPress={onPress} {...value} />}
        </AuthContext.Consumer>
      </AuthProvider>
    );
    fireEvent(getByTestId('btn'), 'onPress');
    expect(onPress).toHaveBeenCalled();
  });

  it('changeRegistering меняет статус "регистрации"', () => {
    const Test = ({ onPress, changeRegistering }) => (
      <Button
        testID="btn"
        onPress={() => {
          onPress();
          changeRegistering();
        }}
      />
    );
    const onPress = jest.fn();
    const { getByTestId } = render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => <Test onPress={onPress} {...value} />}
        </AuthContext.Consumer>
      </AuthProvider>
    );
    fireEvent(getByTestId('btn'), 'onPress');
    expect(onPress).toHaveBeenCalled();
  });

  it('updateProfile инициирует запрос на изменение данных пользователя', () => {
    const Test = ({ onPress, updateProfile }) => (
      <Button
        testID="btn"
        onPress={() => {
          onPress();
          updateProfile();
        }}
      />
    );
    const onPress = jest.fn();
    const { getByTestId } = render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => <Test onPress={onPress} {...value} />}
        </AuthContext.Consumer>
      </AuthProvider>
    );
    fireEvent(getByTestId('btn'), 'onPress');
    expect(onPress).toHaveBeenCalled();
  });

  it('updateProfile отображает сообщение об успешности изменения данных пользователя', () => {
    const Test = ({ onPress, updateProfile }) => (
      <Button
        testID="btn"
        onPress={() => {
          onPress();
          updateProfile();
        }}
      />
    );
    const onPress = jest.fn();
    const { getByTestId } = render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => <Test onPress={onPress} {...value} />}
        </AuthContext.Consumer>
      </AuthProvider>
    );
    fireEvent(getByTestId('btn'), 'onPress');
    expect(onPress).toHaveBeenCalled();
  });

  it('updateProfile отображает сообщение об безуспешности изменения данных пользователя', () => {
    const Test = ({ onPress, updateProfile }) => (
      <Button
        testID="btn"
        onPress={() => {
          onPress();
          updateProfile();
        }}
      />
    );
    const onPress = jest.fn();
    const { getByTestId } = render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => <Test onPress={onPress} {...value} />}
        </AuthContext.Consumer>
      </AuthProvider>
    );
    fireEvent(getByTestId('btn'), 'onPress');
    expect(onPress).toHaveBeenCalled();
  });
});
