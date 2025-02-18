import { StyleSheet } from 'react-native';

import Device from '../../../../util/device';
import { Theme } from '../../../../util/theme/models';

const styleSheet = (params: {
  theme: Theme;
  vars: { isFlatConfirmation: boolean };
}) => {
  const {
    theme,
    vars: { isFlatConfirmation },
  } = params;
  const modalScrollWrapperHeight = Device.isIos() ? '75%' : '70%';

  return StyleSheet.create({
    flatContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
      backgroundColor: theme.colors.background.alternative,
      justifyContent: 'space-between',
      paddingHorizontal: 16,
    },
    modalContainer: {
      backgroundColor: theme.colors.background.alternative,
      paddingHorizontal: 16,
      paddingVertical: 24,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingBottom: Device.isIphoneX() ? 20 : 0,
      maxHeight: '90%',
    },
    scrollableSection: {
      padding: 4,
    },
    scrollable: {
      minHeight: '100%',
    },
    scrollWrapper: {
      minHeight: isFlatConfirmation ? '100%' : modalScrollWrapperHeight,
      maxHeight: isFlatConfirmation ? '100%' : modalScrollWrapperHeight,
      margin: 0,
    },
  });
};

export default styleSheet;
