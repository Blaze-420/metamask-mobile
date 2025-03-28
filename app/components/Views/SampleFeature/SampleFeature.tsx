import React from 'react';
import {ScrollView} from 'react-native';

import {strings} from '../../../../locales/i18n';
import {useTheme} from '../../../util/theme';
import createStyles from './SampleFeature.styles';
import Text, {TextColor, TextVariant} from '../../../component-library/components/Texts/Text';
import {SampleCounterPane} from './SampleCounterPane/SampleCounterPane';
import {SampleNetworkDisplay} from './SampleNetworkDisplay/SampleNetworkDisplay';
import {SamplePetNames} from './SamplePetNames/SamplePetNames';
import useSampleNetwork from '../../hooks/SampleFeature/useSampleNetwork/useSampleNetwork';

/**
 * Main view for app Sample Feature
 *
 * @sampleFeature do not use in production code
 */
const SampleFeature = () => {

    const theme = useTheme();
    const {colors} = theme;
    const styles = createStyles(colors);

    const {networkName, networkImageSource} = useSampleNetwork();

    return (
        <ScrollView style={styles.wrapper}>
            <Text
                color={TextColor.Default}
                variant={TextVariant.HeadingLG}
                style={styles.heading}
            >
                {strings('sample_feature.title')}
            </Text>
            <Text
                color={TextColor.Alternative}
                variant={TextVariant.BodyMD}
                style={styles.desc}
            >
                {strings('sample_feature.description')}
            </Text>
            <SampleNetworkDisplay
                name={networkName}
                imageSource={networkImageSource}
            />
            <SampleCounterPane/>
            <SamplePetNames/>
        </ScrollView>
    );
};

export default SampleFeature;
