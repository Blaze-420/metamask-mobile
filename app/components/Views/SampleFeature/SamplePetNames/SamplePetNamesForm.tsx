import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import Label from '../../../../component-library/components/Form/Label';
import TextField from '../../../../component-library/components/Form/TextField';
import Button, {ButtonVariants} from '../../../../component-library/components/Buttons/Button';
import {useStyles} from '../../../../component-library/hooks';
import styleSheet from './SamplePetNames.styles';
import {strings} from '../../../../../locales/i18n';
import {toChecksumAddress} from 'ethereumjs-util';
import Engine from '../../../../core/Engine';
import {Hex} from '@metamask/utils';
import {SamplePetNamesFormContentProps} from './SamplePetNamesForm.types';

/**
 * Sample PetNamesForm component
 *
 * @sampleFeature do not use in production code
 */
export function SamplePetNamesForm({chainId, initialAddress, initialName}: SamplePetNamesFormContentProps) {

    const [address, setAddress] = useState(initialAddress);
    const [name, setName] = useState(initialName);
    const {styles} = useStyles(styleSheet, {});

    useEffect(() => {
        setAddress(initialAddress);
        setName(initialName);
    }, [initialAddress, initialName]);

    const savePetName = () => {
        const {AddressBookController} = Engine.context;
        if (!name || !address) return;
        AddressBookController.set(
            toChecksumAddress(address),
            name,
            chainId as Hex,
        );
    };

    return (
        <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
                <Label>{strings('sample_feature.pet_name.address')}</Label>
                <TextField
                    value={address}
                    onChangeText={setAddress}
                    placeholder={strings('sample_feature.pet_name.address_placeholder')}
                    autoCapitalize="none"
                    testID="pet-name-address-input"
                />
            </View>

            <View style={styles.inputContainer}>
                <Label>{strings('sample_feature.pet_name.name')}</Label>
                <TextField
                    value={name}
                    onChangeText={setName}
                    placeholder={strings('sample_feature.pet_name.name_placeholder')}
                    testID="pet-name-name-input"
                />
            </View>

            <Button
                variant={ButtonVariants.Primary}
                onPress={savePetName}
                disabled={!address || !name}
                testID="add-pet-name-button"
                label={strings('sample_feature.pet_name.add_pet_name_button')}
            />
        </View>
    );
}

