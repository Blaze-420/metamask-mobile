import React from 'react';
import renderWithProvider from '../../../../util/test/renderWithProvider';
import {Index} from './index';
import initialRootState from '../../../../util/test/initial-root-state';
import {waitFor} from '@testing-library/react-native';

jest.mock('react-native/Libraries/Linking/Linking', () => ({
    addEventListener: jest.fn(() => ({ remove: jest.fn() })),
}));


describe('SamplePetNamesForm', () => {
    it('render matches snapshot', async () => {
        const {toJSON} = renderWithProvider(
            <Index chainId={'0x1'}/>,
            { state: initialRootState }
        );

        await waitFor(() => {
            expect(toJSON()).toMatchSnapshot();
        });
    });

    it('displays addresses', async () => {
        initialRootState.engine.backgroundState.AddressBookController.addressBook = {
            '0x1': {
                '0xE191c1cc6EB6D2b79cC1e55463A39045Ff8F2781': {
                    address: '0xE191c1cc6EB6D2b79cC1e55463A39045Ff8F2781',
                    name: 'Alice',
                    chainId: '0x1',
                    memo: '',
                    isEns: false,
                },
                '0x2a8EB6bbD9831814fD62879Bcc82c606e8477886': {
                    address: '0x2a8EB6bbD9831814fD62879Bcc82c606e8477886',
                    name: 'Bob',
                    chainId: '0x1',
                    memo: '',
                    isEns: false,
                },
            },
        };

        const { getByText } = renderWithProvider(
            <Index chainId={'0x1'}/>,
            { state: initialRootState }
        );

        await waitFor(() => {
            expect(getByText('Alice')).toBeTruthy();
            expect(getByText('Bob')).toBeTruthy();
            expect(getByText('0xE191...2781')).toBeTruthy();
            expect(getByText('0x2a8E...7886')).toBeTruthy();
        });
    });
});
