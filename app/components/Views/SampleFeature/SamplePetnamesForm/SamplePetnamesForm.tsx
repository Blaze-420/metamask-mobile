import React, {useState} from 'react';
import {KeyboardAvoidingView, Platform, SafeAreaView, View,} from 'react-native';
import Text, {TextVariant} from '../../../../component-library/components/Texts/Text';
import Label from '../../../../component-library/components/Form/Label';
import TextField from '../../../../component-library/components/Form/TextField';
import Button, {ButtonVariants} from '../../../../component-library/components/Buttons/Button';
import {useStyles} from '../../../../component-library/hooks';
import styleSheet from './SamplePetnamesForm.styles';
import AddressList from '../../confirmations/SendFlow/AddressList';
import {strings} from '../../../../../locales/i18n';

interface SamplePetnamesFormProps {
  chainId: string;
}

export function SamplePetnamesForm({chainId}:SamplePetnamesFormProps) {
  const [address, setAddress] = useState('');
  const [name, setName] = useState('');

  const { styles } = useStyles(styleSheet, {});

  const handleSubmit = () => {
    // Handle form submission here
    if (address && name) {
      // Add validation and submission logic
      console.log('Submitting:', { address, name });
      // Clear form
      setAddress('');
      setName('');
    }
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.card}>
          <Text variant={TextVariant.HeadingSM}>{strings('sample_feature.pet_name.list_count_text')}</Text>

          <AddressList
            chainId={chainId}
            onlyRenderAddressBook 
            inputSearch={undefined}
            onAccountPress={undefined}
            onAccountLongPress={undefined}
            onIconPress={undefined}
            reloadAddressList={undefined}
          />

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Label>{strings('address_book.address')}</Label>
              <TextField
                value={address}
                onChangeText={setAddress}
                placeholder="0x..."
                autoCapitalize="none"
                testID="pet-name-address-input"
              />
            </View>

            <View style={styles.inputContainer}>
              <Label>{strings('address_book.name')}</Label>
              <TextField
                value={name}
                onChangeText={setName}
                placeholder={strings('address_book.nickname')}
                testID="pet-name-name-input"
              />
            </View>

            <Button
              variant={ButtonVariants.Primary}
              onPress={handleSubmit}
              disabled={!address || !name}
              testID="add-pet-name-button"
              label={strings('sample_feature.pet_name.add_pet_name_button')}
            >
              Add Pet Name
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
