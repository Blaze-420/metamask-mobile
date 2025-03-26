import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Text, { TextVariant } from '../../../../component-library/components/Texts/Text';
import { AddressBookEntry } from '@metamask/address-book-controller';
import ListItem from '../../../../component-library/components/List/ListItem';
import Avatar, { AvatarSize, AvatarVariant } from '../../../../component-library/components/Avatars/Avatar';
import { renderShortAddress } from '../../../../util/address';
import { useStyles } from '../../../../component-library/hooks';
import styleSheet from './index.styles';

interface PetNamesListProps {
  addressBook: AddressBookEntry[];
  onAccountPress: (params: { address: string; name: string }) => void;
}

export function PetNamesList({ addressBook, onAccountPress }: PetNamesListProps) {
  const { styles } = useStyles(styleSheet, {});

  return (
    <View>
      {Object.entries(addressBook).map(([addressBookKey, addressBookEntry]) => (
        <TouchableOpacity key={addressBookKey} onPress={() => onAccountPress({address: addressBookEntry.address, name: addressBookEntry.name})}>
          <ListItem>
            <Avatar
              variant={AvatarVariant.Account}
              accountAddress={addressBookEntry.address}
              size={AvatarSize.Md}
            />
            <View style={styles.textStack}>
              <Text variant={TextVariant.HeadingMD}>{addressBookEntry.name}</Text>
              <Text variant={TextVariant.BodySM}>
                {renderShortAddress(addressBookEntry.address)}
              </Text>
            </View>
          </ListItem>
        </TouchableOpacity>
      ))}
    </View>
  );
}
