import React from 'react';
import {ScrollView} from 'react-native';

import {strings} from '../../../../locales/i18n';
import {useTheme} from '../../../util/theme';
import createStyles from './SampleFeature.styles';
import Text, {TextColor, TextVariant} from '../../../component-library/components/Texts/Text';
import {SampleCounterPane} from './SampleCounterPane/SampleCounterPane';
import {SampleNetworkDisplay} from './SampleNetworkDisplay/SampleNetworkDisplay';
import {useSelector} from 'react-redux';
import {selectNetworkImageSource, selectNetworkName} from '../../../selectors/networkInfos';
import {selectChainId, selectNetworkConfigurations} from '../../../selectors/networkController';
import {SamplePetnamesForm} from './SamplePetnamesForm/SamplePetnamesForm';


/**
 * Main view for app Experimental Settings
 */
const SampleFeature = () => {

    const theme = useTheme();
    const {colors} = theme;
    const styles = createStyles(colors);

    const networkImageSource = useSelector(selectNetworkImageSource);
    const chainId = useSelector(selectChainId);
    const networkConfigurations = useSelector(selectNetworkConfigurations);
    const name = useSelector(selectNetworkName);
    const networkName = networkConfigurations?.[chainId]?.name ?? name;

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
            <SamplePetnamesForm chainId={chainId}/>
        </ScrollView>
    );
};

export default SampleFeature;
