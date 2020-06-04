jest.mock('react-native-simple-toast', () => ({
  SHORT: jest.fn(),
}));
import React from 'react';
import { cleanup, render } from 'react-native-testing-library';
import { AuthProvider } from '../context';
import SignUp from '../screens/SingUp';

const TestComponent = () => (
  <AuthProvider>
    <SignUp testId="SignUp" />
  </AuthProvider>
);

describe('SingUp', () => {
  afterEach(cleanup);

  it('Должен рендерится', () => {
    expect(render(<TestComponent />)).not.toBeNull();
  });

  it('Должен рендерится корректно', () => {
    const SignInScreen = render(<TestComponent />).toJSON();
    expect(SignInScreen).toMatchSnapshot();
  });
});
