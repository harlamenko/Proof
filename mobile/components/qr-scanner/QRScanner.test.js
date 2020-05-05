import React from 'react';
import { cleanup, render } from 'react-native-testing-library'
import { QRScanner } from './QRScanner';

describe('QRScanner', () => {
    afterEach(cleanup);

    it('should render', () => {
        expect(render(<QRScanner />)).not.toBeNull();
    });
})