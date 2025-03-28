import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Text, { TextVariant } from '../../../../component-library/components/Texts/Text';
import styles from './SampleCounterPane.styles';
import useSampleCounter from '../../../hooks/SampleFeature/useSampleCounter/useSampleCounter';
import {strings} from '../../../../../locales/i18n';

/**
 * Sample SampleCounterPane component
 *
 * @sampleFeature do not use in production code
 */
export function SampleCounterPane() {

    const counter = useSampleCounter();

    return (
        <View style={styles.card}>
            <View style={styles.container}>
                <Text
                    variant={TextVariant.HeadingSM}
                    testID="sample-counter-pane-title"
                >
                    {strings('sample_feature.counter.title')}
                </Text>
                <Text testID="sample-counter-pane-value">
                    {strings('sample_feature.counter.value',{value : counter.value})}
                </Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        counter.increment();
                    }}
                    testID="sample-counter-pane-increment-button"
                >
                    <Text style={styles.buttonText}>
                        {strings('sample_feature.counter.increment')}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
