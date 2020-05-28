import React from 'react';
import { cleanup, render, fireEvent } from 'react-native-testing-library';
import AuthForm from './AuthForm';

describe('Auth form', () => {
  afterEach(cleanup);

  it('when error message exists - display it', () => {
    let errorMessage = '';
    const { getByTestId, update } = render(<AuthForm errorMessage={errorMessage} />);
    expect(() => getByTestId('errMsg')).toThrow('No instances found');

    errorMessage = 'error';
    update(<AuthForm errorMessage={errorMessage} />);
    const errMsg = getByTestId('errMsg');
    expect(errMsg.props.children).toBe(errorMessage);
  });

  it('onSubmit cb runs when submit button pressed', () => {
    const onSubmit = jest.fn();
    const { getByTestId } = render(<AuthForm onSubmit={onSubmit} />);
    const submitBtn = getByTestId('submitBtn');

    fireEvent(submitBtn, 'onPress');
    expect(onSubmit).toHaveBeenCalled();
  });
});
