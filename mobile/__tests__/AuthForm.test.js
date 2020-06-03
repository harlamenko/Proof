jest.mock('react-native-simple-toast', () => ({
  SHORT: jest.fn(),
}));
import React from 'react';
import { cleanup, fireEvent, render } from 'react-native-testing-library';
import { AuthForm } from '../components';

describe('AuthForm', () => {
  afterEach(cleanup);

  it('Должен рендерится', () => {
    expect(render(<AuthForm />)).not.toBeNull();
  });

  it('Должен отображать сообщение об ошибке, если есть', () => {
    let errorMessage = '';
    const { getByTestId, update } = render(
      <AuthForm errorMessage={errorMessage} />
    );
    expect(() => getByTestId('errMsg')).toThrow('No instances found');

    errorMessage = 'error';
    update(<AuthForm errorMessage={errorMessage} />);
    const errMsg = getByTestId('errMsg');
    expect(errMsg.props.children).toBe(errorMessage);
  });

  it('Должна вызываться функция-проп onClearErrorMessage по нажатию на X', () => {
    const errorMessage = 'error';
    const onClearErrorMessage = jest.fn();
    const { getByTestId } = render(
      <AuthForm
        errorMessage={errorMessage}
        onClearErrorMessage={onClearErrorMessage}
      />
    );
    fireEvent(getByTestId('X'), 'onPress');

    expect(onClearErrorMessage).toHaveBeenCalled();
  });

  it('Должна вызываться функция-проп onSubmit по нажатию на submit-кнопку', () => {
    const onSubmit = jest.fn();
    const { getByTestId } = render(<AuthForm onSubmit={onSubmit} />);
    const submitBtn = getByTestId('submitBtn');

    fireEvent(submitBtn, 'onPress');
    expect(onSubmit).toHaveBeenCalled();
  });

  it('Должен отображаться input для подтверждения пароля, если передан проп isSingIn', () => {
    const { getByTestId } = render(<AuthForm isSingIn={true} />);
    expect(getByTestId('password2')).not.toBeNull();
  });
});
