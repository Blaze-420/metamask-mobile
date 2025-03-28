import React from 'react';
import renderWithProvider from '../../../../util/test/renderWithProvider';
import initialRootState from '../../../../util/test/initial-root-state';
import {waitFor} from '@testing-library/react-native';
import {SamplePetNamesForm} from './SamplePetNamesForm';

jest.mock('react-native/Libraries/Linking/Linking', () => ({
    addEventListener: jest.fn(() => ({remove: jest.fn()})),
}));

describe('SamplePetNamesForm', () => {
    it('render matches snapshot', async () => {
        const {toJSON} = renderWithProvider(
            <SamplePetNamesForm chainId={'0x1'}
                                initialAddress={'0xc6893a7d6a966535F7884A4de710111986ebB132'}
                                initialName={'Test Account'}/>,
            {state: initialRootState}
        );

        await waitFor(() => {
            expect(toJSON()).toMatchSnapshot();
        });
    });
});
