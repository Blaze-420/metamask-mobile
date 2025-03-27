import React, {useState} from 'react';
import {KeyboardAvoidingView, Platform, SafeAreaView, View} from 'react-native';
import Text, {TextVariant} from '../../../../component-library/components/Texts/Text';
import {useStyles} from '../../../../component-library/hooks';
import styleSheet from './SamplePetNames.styles';
import {strings} from '../../../../../locales/i18n';
import {SamplePetNamesList} from './SamplePetNamesList';
import {SamplePetNamesForm} from './SamplePetNamesForm';
import {Hex} from '@metamask/utils';
import {SupportedCaipChainId} from '@metamask/multichain-network-controller';

/**
 * Sample interface for PetNames component props
 *
 * @sampleFeature do not use in production code
 */
interface SamplePetNamesFormProps {
    chainId: SupportedCaipChainId | Hex;
}

/**
 * Sample PetNames component
 *
 * @sampleFeature do not use in production code
 */
export function SamplePetNames({chainId}: SamplePetNamesFormProps) {
    const {styles} = useStyles(styleSheet, {});

    const [selectedAddress, setSelectedAddress] = useState('');
    const [selectedName, setSelectedName] = useState('');

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
                    <SamplePetNamesList chainId={chainId} onAccountPress={onAccountPress}/>
                    <SamplePetNamesForm chainId={chainId} initialAddress={selectedAddress} initialName={selectedName}/>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}


// useReducer
