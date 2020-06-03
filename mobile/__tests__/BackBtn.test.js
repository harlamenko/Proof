import React from 'react';
import { cleanup, render } from 'react-native-testing-library';
import { BackBtn } from '../components/BackBtn';

describe('BackBtn', () => {
  afterEach(cleanup);

  it('Должен рендерится', () => {
    expect(render(<BackBtn />)).not.toBeNull();
  });
});
