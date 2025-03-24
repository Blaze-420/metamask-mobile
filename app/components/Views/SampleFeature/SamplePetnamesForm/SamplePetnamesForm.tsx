import React from 'react';
import {
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Text, {TextVariant} from '../../../../component-library/components/Texts/Text';
import Label from '../../../../component-library/components/Form/Label';
import TextField from '../../../../component-library/components/Form/TextField';

import {useStyles} from '../../../../component-library/hooks';
import styleSheet from './SamplePetnamesForm.styles';
import AddressList from '../../confirmations/SendFlow/AddressList';
import {strings} from '../../../../../locales/i18n';

interface SamplePetnamesFormProps {
  chainId: string;
}

export function SamplePetnamesForm({chainId}:SamplePetnamesFormProps) {

  const { styles } = useStyles(styleSheet, {});

  return (
    <SafeAreaView style={styles.wrapper}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.card}>
          <Text variant={TextVariant.HeadingSM}>{strings('sample_feature.petnames.list_count_text')}</Text>

          {/* Pet Names List */}
          <AddressList
              chainId={chainId}
              onlyRenderAddressBook inputSearch={undefined} onAccountPress={undefined} onAccountLongPress={undefined}
              onIconPress={undefined} reloadAddressList={undefined}            />

          {/*/!* Form *!/*/}
          {/*<View style={styles.formContainer}>*/}
          {/*  <Label style={styles.label}>Address</Label>*/}
          {/*  <TextField*/}
          {/*    style={styles.input}*/}
          {/*    placeholder="0x..."*/}
          {/*    placeholderTextColor={colors.text.muted}*/}
          {/*    autoCapitalize="none"*/}
          {/*    autoCorrect={false}*/}
          {/*    spellCheck={false}*/}
          {/*    {...getFieldProps('address')}*/}
          {/*  />*/}

          {/*  <Label style={styles.label}>Name</Label>*/}
          {/*  <TextField*/}
          {/*    style={styles.input}*/}
          {/*    placeholder="Enter a nickname"*/}
          {/*    placeholderTextColor={colors.text.muted}*/}
          {/*    autoCapitalize="none"*/}
          {/*    autoCorrect={false}*/}
          {/*    spellCheck={false}*/}
          {/*    {...getFieldProps('petname')}*/}
          {/*  />*/}

          {/*  {formError && <Text style={styles.errorText}>{formError}</Text>}*/}

          {/*  {submitStatus === 'success' && (*/}
          {/*    <Text style={styles.successText}>Pet name added successfully!</Text>*/}
          {/*  )}*/}

          {/*  <StyledButton*/}
          {/*    type="confirm"*/}
          {/*    onPress={handleSubmit}*/}
          {/*    disabled={isSubmitting || !isFormValid}*/}
          {/*  >*/}
          {/*    {isSubmitting ? 'Adding...' : 'Add Pet Name'}*/}
          {/*  </StyledButton>*/}
          {/*</View>*/}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
