jest.mock('react-native-simple-toast', () => ({
  SHORT: jest.fn(),
}));
import React from 'react';
import { render } from 'react-native-testing-library';
import { AuthProvider } from '../context';
import SignIn from '../screens/SingIn';

const TestComponent = () => (
  <AuthProvider>
    <SignIn />
  </AuthProvider>
);

describe('SingIn screen', () => {
  it('Должен рендерится', () => {
    expect(render(<TestComponent />)).not.toBeNull();
  });

  it('Должен рендерится корректно', () => {
    const SignInScreen = render(<TestComponent />).toJSON();
    expect(SignInScreen).toMatchSnapshot();
  });
});
