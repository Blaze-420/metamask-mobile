import React, {useState} from 'react';
import {KeyboardAvoidingView, Platform, SafeAreaView, View} from 'react-native';
import Text, {TextVariant} from '../../../../component-library/components/Texts/Text';
import {useStyles} from '../../../../component-library/hooks';
import styleSheet from './index.styles';
import {strings} from '../../../../../locales/i18n';
import {useSelector} from 'react-redux';
import {selectAddressBookByChain} from '../../../../selectors/addressBookController';
import {RootState} from '../../../../reducers';
import {PetNamesList} from './PetNamesList';
import {PetNamesForm} from './PetNamesForm';
import {Hex} from '@metamask/utils';
import {SupportedCaipChainId} from '@metamask/multichain-network-controller';

interface SamplePetNamesFormProps {
    chainId: SupportedCaipChainId | Hex;
}

export function SamplePetNames({chainId}: SamplePetNamesFormProps) {
    const {styles} = useStyles(styleSheet, {});

    const [selectedAddress, setSelectedAddress] = useState('');
    const [selectedName, setSelectedName] = useState('');

    const addressBook = useSelector((state: RootState) =>
        selectAddressBookByChain(
            state,
            chainId as Hex,
        ),
    );

    const onAccountPress = (params: { address: string; name: string }) => {
        setSelectedAddress(params.address);
        setSelectedName(params.name);
    };

    return (
        <SafeAreaView style={styles.wrapper}>
            <KeyboardAvoidingView
                style={styles.keyboardAvoidingView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.card}>
                    <Text variant={TextVariant.HeadingSM}>{strings('sample_feature.pet_name.list_count_text')}</Text>
                    <PetNamesList addressBook={addressBook} onAccountPress={onAccountPress}/>
                    <PetNamesForm chainId={chainId} initialAddress={selectedAddress} initialName={selectedName}/>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

