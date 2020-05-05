import React from 'react';
import { cleanup, render } from 'react-native-testing-library'
import { BackBtn } from './BackBtn';

describe('BackBtn', () => {
    afterEach(cleanup);

    it('should render', () => {
        expect(render(<BackBtn />)).not.toBeNull();
    });
})