import React from 'react';
import {ImageSourcePropType, Text, View} from 'react-native';
import AvatarNetwork from '../../../../component-library/components/Avatars/Avatar/variants/AvatarNetwork';
import styles from './SampleNetworkDisplay.styles';

interface SampleNetworkDisplayProps {
  name: string;
  imageSource: ImageSourcePropType;
}

export function SampleNetworkDisplay({ name, imageSource }: SampleNetworkDisplayProps) {

    console.log('name', name);
    console.log('imageSource', imageSource);

    return (
      <View style={styles.container}>
        <AvatarNetwork name={name} imageSource={imageSource} />
        <Text style={styles.text}>{name}</Text>
      </View>
    );
}

