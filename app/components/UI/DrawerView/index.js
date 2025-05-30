import React, { PureComponent } from 'react';
import {
  Alert,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  Text,
  InteractionManager,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Share from 'react-native-share';
import Icon from 'react-native-vector-icons/FontAwesome';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { fontStyles } from '../../../styles/common';
import {
  hasBlockExplorer,
  findBlockExplorerForRpc,
  getBlockExplorerName,
  getDecimalChainId,
} from '../../../util/networks';
import Identicon from '../Identicon';
import StyledButton from '../StyledButton';
import { renderFromWei, renderFiat } from '../../../util/number';
import { strings } from '../../../../locales/i18n';
import Modal from 'react-native-modal';
import {
  toggleInfoNetworkModal,
  toggleNetworkModal,
} from '../../../actions/modals';
import { showAlert } from '../../../actions/alert';
import {
  getEtherscanAddressUrl,
  getEtherscanBaseUrl,
} from '../../../util/etherscan';
import Engine from '../../../core/Engine';
import Logger from '../../../util/Logger';
import Device from '../../../util/device';
import AppConstants from '../../../core/AppConstants';
import { MetaMetricsEvents } from '../../../core/Analytics';
import URL from 'url-parse';
import EthereumAddress from '../EthereumAddress';
import { getEther } from '../../../util/transactions';
import { newAssetTransaction } from '../../../actions/transaction';
import { protectWalletModalVisible } from '../../../actions/user';
import DeeplinkManager from '../../../core/DeeplinkManager/SharedDeeplinkManager';
import SettingsNotification from '../SettingsNotification';
import { RPC } from '../../../constants/network';
import { findRouteNameFromNavigatorState } from '../../../util/general';
import {
  isDefaultAccountName,
  doENSReverseLookup,
} from '../../../util/ENSUtils';
import ClipboardManager from '../../../core/ClipboardManager';
import { collectiblesSelector } from '../../../reducers/collectibles';
import { getCurrentRoute } from '../../../reducers/navigation';
import { ScrollView } from 'react-native-gesture-handler';
import { isZero } from '../../../util/lodash';
import { Authentication } from '../../../core/';
import { ThemeContext, mockTheme } from '../../../util/theme';
import { getLabelTextByAddress } from '../../../util/address';
import {
  onboardNetworkAction,
  networkSwitched,
} from '../../../actions/onboardNetwork';
import Routes from '../../../constants/navigation/Routes';
import { scale } from 'react-native-size-matters';
import generateTestId from '../../../../wdio/utils/generateTestId';
import { DRAWER_VIEW_LOCK_TEXT_ID } from '../../../../wdio/screen-objects/testIDs/Screens/DrawerView.testIds';
import {
  selectChainId,
  selectNetworkConfigurations,
  selectProviderConfig,
  selectEvmTicker,
} from '../../../selectors/networkController';
import { selectCurrentCurrency } from '../../../selectors/currencyRateController';
import { selectTokens } from '../../../selectors/tokensController';
import { selectAccounts } from '../../../selectors/accountTrackerController';
import { selectContractBalances } from '../../../selectors/tokenBalancesController';
import { selectSelectedInternalAccount } from '../../../selectors/accountsController';

import { QRTabSwitcherScreens } from '../../../components/Views/QRTabSwitcher';
import { createAccountSelectorNavDetails } from '../../Views/AccountSelector';
import NetworkInfo from '../NetworkInfo';
import { withMetricsAwareness } from '../../../components/hooks/useMetrics';
import { toChecksumHexAddress } from '@metamask/controller-utils';
import safePromiseHandler from './utils';

const createStyles = (colors) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      width: 315,
      backgroundColor: colors.background.default,
    },
    header: {
      paddingTop: Device.isIphoneX() ? 60 : 24,
      backgroundColor: colors.background.alternative,
      height: Device.isIphoneX() ? 110 : 74,
      flexDirection: 'column',
      paddingBottom: 0,
    },
    metamaskLogo: {
      flexDirection: 'row',
      flex: 1,
      marginTop: Device.isAndroid() ? 0 : 12,
      marginLeft: 15,
      paddingTop: Device.isAndroid() ? 10 : 0,
    },
    metamaskFox: {
      height: 27,
      width: 27,
      marginRight: 15,
    },
    metamaskName: {
      marginTop: 4,
      width: 90,
      height: 18,
      tintColor: colors.text.default,
    },
    account: {
      flex: 1,
      backgroundColor: colors.background.alternative,
    },
    accountBgOverlay: {
      borderBottomColor: colors.border.muted,
      borderBottomWidth: 1,
      padding: 17,
    },
    identiconWrapper: {
      marginBottom: 12,
      width: 56,
      height: 56,
    },
    identiconBorder: {
      borderRadius: 96,
      borderWidth: 2,
      padding: 2,
      borderColor: colors.primary.default,
    },
    accountNameWrapper: {
      flexDirection: 'row',
      paddingRight: 17,
    },
    accountName: {
      fontSize: 20,
      lineHeight: 24,
      marginBottom: 5,
      color: colors.text.default,
      ...fontStyles.normal,
    },
    caretDown: {
      textAlign: 'right',
      marginLeft: 7,
      marginTop: 3,
      fontSize: 18,
      color: colors.icon.alternative,
    },
    accountBalance: {
      fontSize: 14,
      lineHeight: 17,
      marginBottom: 5,
      color: colors.text.default,
      ...fontStyles.normal,
    },
    accountAddress: {
      fontSize: 12,
      lineHeight: 17,
      color: colors.text.alternative,
      ...fontStyles.normal,
    },
    buttons: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderBottomColor: colors.border.muted,
      borderBottomWidth: 1,
      padding: 15,
    },
    button: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 30,
      borderWidth: 1.5,
    },
    leftButton: {
      marginRight: 5,
    },
    rightButton: {
      marginLeft: 5,
    },
    buttonText: {
      paddingLeft: scale(4),
      fontSize: scale(13),
      color: colors.primary.default,
      ...fontStyles.normal,
    },
    buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: scale(2),
    },
    buttonIcon: {
      marginTop: 0,
    },
    buttonReceive: {
      transform: [{ rotate: '90deg' }],
    },
    menu: {},
    noTopBorder: {
      borderTopWidth: 0,
    },
    menuSection: {
      borderTopWidth: 1,
      borderColor: colors.border.muted,
      paddingVertical: 10,
    },
    menuItem: {
      flex: 1,
      flexDirection: 'row',
      paddingVertical: 9,
      paddingLeft: 17,
    },
    selectedRoute: {
      backgroundColor: colors.primary.muted,
      marginRight: 10,
      borderTopRightRadius: 20,
      borderBottomRightRadius: 20,
    },
    selectedName: {
      color: colors.primary.default,
    },
    menuItemName: {
      flex: 1,
      paddingHorizontal: 15,
      paddingTop: 2,
      fontSize: 16,
      color: colors.text.alternative,
      ...fontStyles.normal,
    },
    menuItemWarningText: {
      color: colors.text.default,
      fontSize: 12,
      ...fontStyles.normal,
    },
    noIcon: {
      paddingLeft: 0,
    },
    menuItemIconImage: {
      width: 22,
      height: 22,
      tintColor: colors.icon.alternative,
    },
    selectedMenuItemIconImage: {
      width: 22,
      height: 22,
      tintColor: colors.primary.default,
    },
    bottomModal: {
      justifyContent: 'flex-end',
      margin: 0,
    },
    importedWrapper: {
      marginTop: 10,
      width: 73,
      paddingHorizontal: 10,
      paddingVertical: 3,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.icon.alternative,
    },
    importedText: {
      color: colors.icon.alternative,
      fontSize: 10,
      ...fontStyles.bold,
    },
    protectWalletContainer: {
      backgroundColor: colors.background.default,
      paddingTop: 24,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingVertical: 16,
      paddingBottom: Device.isIphoneX() ? 20 : 0,
      paddingHorizontal: 40,
    },
    protectWalletIconContainer: {
      alignSelf: 'center',
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.error.muted,
      borderColor: colors.error.default,
      borderWidth: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    protectWalletIcon: { alignSelf: 'center', color: colors.error.default },
    protectWalletTitle: {
      textAlign: 'center',
      fontSize: 18,
      marginVertical: 8,
      ...fontStyles.bold,
      color: colors.text.default,
    },
    protectWalletContent: {
      textAlign: 'center',
      fontSize: 14,
      marginVertical: 8,
      justifyContent: 'center',
      ...fontStyles.normal,
      color: colors.text.default,
    },
    protectWalletButtonWrapper: { marginVertical: 8 },
  });

const metamask_name = require('../../../images/branding/metamask-name.png'); // eslint-disable-line
const metamask_fox = require('../../../images/branding/fox.png'); // eslint-disable-line
const ICON_IMAGES = {
  wallet: require('../../../images/wallet-icon.png'), // eslint-disable-line
  'selected-wallet': require('../../../images/selected-wallet-icon.png'), // eslint-disable-line
};

/**
 * View component that displays the MetaMask fox
 * in the middle of the screen
 */
class DrawerView extends PureComponent {
  static propTypes = {
    /**
    /* navigation object required to push new views
    */
    navigation: PropTypes.object,
    /**
     * Object representing the configuration of the current selected network
     */
    providerConfig: PropTypes.object.isRequired,
    /**
     * List of accounts from the AccountTrackerController
     */
    accounts: PropTypes.object,
    /**
     * Currently selected account
     */
    selectedInternalAccount: PropTypes.object,
    /**
    /* Selected currency
    */
    currentCurrency: PropTypes.string,
    /**
     * List of keyrings
     */
    keyrings: PropTypes.array,
    /**
     * Action that toggles the network modal
     */
    toggleNetworkModal: PropTypes.func,
    /**
     * Action that shows the global alert
     */
    showAlert: PropTypes.func.isRequired,
    /**
     * Boolean that determines the status of the networks modal
     */
    networkModalVisible: PropTypes.bool.isRequired,
    /**
     * Start transaction with asset
     */
    newAssetTransaction: PropTypes.func.isRequired,
    /**
     * Boolean that determines if the user has set a password before
     */
    passwordSet: PropTypes.bool,
    /**
     * Wizard onboarding state
     */
    wizard: PropTypes.object,
    /**
     * Current provider ticker
     */
    ticker: PropTypes.string,
    /**
     * Network configurations
     */
    networkConfigurations: PropTypes.object,
    /**
     * Array of ERC20 assets
     */
    tokens: PropTypes.array,
    /**
     * Array of ERC721 assets
     */
    collectibles: PropTypes.array,
    /**
     * redux flag that indicates if the user
     * completed the seed phrase backup flow
     */
    seedphraseBackedUp: PropTypes.bool,
    /**
     * An object containing token balances for current account and network in the format address => balance
     */
    tokenBalances: PropTypes.object,
    /**
     * Prompts protect wallet modal
     */
    protectWalletModalVisible: PropTypes.func,
    /**
     * Callback to close drawer
     */
    onCloseDrawer: PropTypes.func,
    /**
     * Latest navigation route
     */
    currentRoute: PropTypes.string,
    /**
     * handles action for onboarding to a network
     */
    onboardNetworkAction: PropTypes.func,
    /**
     * returns switched network state
     */
    switchedNetwork: PropTypes.object,
    /**
     * updates when network is switched
     */
    networkSwitched: PropTypes.func,
    /**
     *  Boolean that determines the state of network info modal
     */
    infoNetworkModalVisible: PropTypes.bool,
    /**
     * Redux action to close info network modal
     */
    toggleInfoNetworkModal: PropTypes.func,
    /**
     * Metrics injected by withMetricsAwareness HOC
     */
    metrics: PropTypes.object,
    /**
     * Selected multichain chainId
     */
    chainId: PropTypes.string,
  };

  state = {
    showProtectWalletModal: undefined,
    account: {
      ens: undefined,
      name: undefined,
      address: undefined,
      currentChainId: undefined,
    },
    networkType: undefined,
    showModal: false,
    networkUrl: undefined,
  };

  browserSectionRef = React.createRef();

  currentBalance = null;
  previousBalance = null;
  processedNewBalance = false;
  animatingNetworksModal = false;
  selectedChecksummedAddress = toChecksumHexAddress(
    this.props.selectedInternalAccount.address,
  );

  isCurrentAccountImported() {
    let ret = false;
    const { keyrings } = this.props;
    const allKeyrings =
      keyrings && keyrings.length
        ? keyrings
        : Engine.context.KeyringController.state.keyrings;
    for (const keyring of allKeyrings) {
      if (keyring.accounts.includes(this.selectedChecksummedAddress)) {
        ret = keyring.type !== 'HD Key Tree';
        break;
      }
    }

    return ret;
  }

  renderTag() {
    const colors = this.context.colors || mockTheme.colors;
    const styles = createStyles(colors);
    const label = getLabelTextByAddress(this.selectedChecksummedAddress);

    return label ? (
      <View style={[styles.importedWrapper]}>
        <Text numberOfLines={1} style={styles.importedText}>
          {label}
        </Text>
      </View>
    ) : null;
  }

  async componentDidUpdate() {
    const route = findRouteNameFromNavigatorState(
      this.props.navigation.dangerouslyGetState().routes,
    );
    if (!this.props.passwordSet || !this.props.seedphraseBackedUp) {
      if (
        [
          'SetPasswordFlow',
          'ChoosePassword',
          'AccountBackupStep1',
          'AccountBackupStep1B',
          'ManualBackupStep1',
          'ManualBackupStep2',
          'ManualBackupStep3',
          'Webview',
          Routes.LOCK_SCREEN,
        ].includes(route)
      ) {
        this.state.showProtectWalletModal &&
          // eslint-disable-next-line react/no-did-update-set-state
          this.setState({ showProtectWalletModal: false });
        return;
      }
      let tokenFound = false;

      this.props.tokens.forEach((token) => {
        if (
          this.props.tokenBalances[token.address] &&
          !isZero(this.props.tokenBalances[token.address])
        ) {
          tokenFound = true;
        }
      });
      if (
        !this.props.passwordSet ||
        this.currentBalance > 0 ||
        tokenFound ||
        this.props.collectibles.length > 0
      ) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({ showProtectWalletModal: true });

        this.props.metrics.trackEvent(
          this.props.metrics
            .createEventBuilder(
              MetaMetricsEvents.WALLET_SECURITY_PROTECT_VIEWED,
            )
            .addProperties({
              wallet_protection_required: false,
              source: 'Backup Alert',
            })
            .build(),
        );
      } else {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({ showProtectWalletModal: false });
      }
    } else {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ showProtectWalletModal: false });
    }
    const pendingDeeplink = DeeplinkManager.getPendingDeeplink();
    const { KeyringController } = Engine.context;
    if (
      pendingDeeplink &&
      KeyringController.isUnlocked() &&
      route !== Routes.LOCK_SCREEN
    ) {
      DeeplinkManager.expireDeeplink();
      DeeplinkManager.parse(pendingDeeplink, {
        origin: AppConstants.DEEPLINKS.ORIGIN_DEEPLINK,
      });
    }
    await this.updateAccountInfo();
  }

  updateAccountInfo = async () => {
    const { providerConfig, selectedInternalAccount, chainId } = this.props;
    const { currentChainId, address, name } = this.state.account;
    const accountName = selectedInternalAccount.metadata.name;
    if (
      currentChainId !== chainId ||
      address !== this.selectedChecksummedAddress ||
      name !== accountName
    ) {
      const ens = await doENSReverseLookup(
        this.selectedChecksummedAddress,
        chainId,
      );
      this.setState((state) => ({
        account: {
          ens,
          name: accountName,
          currentChainId: chainId,
          address: this.selectedChecksummedAddress,
        },
      }));
    }
  };

  openAccountSelector = () => {
    const { navigation } = this.props;

    navigation.navigate(
      ...createAccountSelectorNavDetails({
        onOpenImportAccount: this.hideDrawer,
        onOpenConnectHardwareWallet: this.hideDrawer,
        onSelectAccount: this.hideDrawer,
      }),
    );
    this.props.metrics.trackEvent(
      this.props.metrics
        .createEventBuilder(MetaMetricsEvents.NAVIGATION_TAPS_ACCOUNT_NAME)
        .build(),
    );
  };

  // NOTE: do we need this event?
  trackOpenBrowserEvent = () => {
    const { chainId } = this.props;
    this.props.metrics.trackEvent(
      this.props.metrics
        .createEventBuilder(MetaMetricsEvents.BROWSER_OPENED)
        .addProperties({
          source: 'In-app Navigation',
          chain_id: getDecimalChainId(chainId),
        })
        .build(),
    );
  };

  onReceive = () => {
    this.props.navigation.navigate(Routes.QR_TAB_SWITCHER, {
      initialScreen: QRTabSwitcherScreens.Receive,
      disableTabber: true,
    });
    this.props.metrics.trackEvent(
      this.props.metrics
        .createEventBuilder(MetaMetricsEvents.NAVIGATION_TAPS_RECEIVE)
        .build(),
    );
  };

  onSend = async () => {
    this.props.newAssetTransaction(getEther(this.props.ticker));
    this.props.navigation.navigate('SendFlowView');
    this.hideDrawer();
    this.props.metrics.trackEvent(
      this.props.metrics
        .createEventBuilder(MetaMetricsEvents.NAVIGATION_TAPS_SEND)
        .build(),
    );
  };

  goToBrowser = () => {
    this.props.navigation.navigate(Routes.BROWSER.HOME);
    this.hideDrawer();
    // Q: duplicated analytic event?
    this.trackOpenBrowserEvent();
    this.props.metrics.trackEvent(
      this.props.metrics
        .createEventBuilder(MetaMetricsEvents.NAVIGATION_TAPS_BROWSER)
        .build(),
    );
  };

  showWallet = () => {
    this.props.navigation.navigate('WalletTabHome');
    this.hideDrawer();
    this.props.metrics.trackEvent(
      this.props.metrics
        .createEventBuilder(MetaMetricsEvents.WALLET_OPENED)
        .build(),
    );
  };

  onPressLock = async () => {
    const { passwordSet } = this.props;
    await Authentication.lockApp();
    if (!passwordSet) {
      this.props.navigation.navigate('OnboardingRootNav', {
        screen: Routes.ONBOARDING.NAV,
        params: { screen: 'Onboarding' },
      });
    } else {
      this.props.navigation.replace(Routes.ONBOARDING.LOGIN, { locked: true });
    }
  };

  lock = () => {
    Alert.alert(
      strings('drawer.lock_title'),
      '',
      [
        {
          text: strings('drawer.lock_cancel'),
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: strings('drawer.lock_ok'),
          onPress: this.onPressLock,
        },
      ],
      { cancelable: false },
    );
    this.props.metrics.trackEvent(
      this.props.metrics
        .createEventBuilder(MetaMetricsEvents.NAVIGATION_TAPS_LOGOUT)
        .build(),
    );
  };

  viewInEtherscan = () => {
    const { providerConfig, networkConfigurations } = this.props;
    if (providerConfig.type === RPC) {
      const blockExplorer = findBlockExplorerForRpc(
        providerConfig.rpcUrl,
        networkConfigurations,
      );
      const url = `${blockExplorer}/address/${this.selectedChecksummedAddress}`;
      const title = new URL(blockExplorer).hostname;
      this.goToBrowserUrl(url, title);
    } else {
      const url = getEtherscanAddressUrl(
        providerConfig.type,
        this.selectedChecksummedAddress,
      );
      const etherscan_url = getEtherscanBaseUrl(providerConfig.type).replace(
        'https://',
        '',
      );
      this.goToBrowserUrl(url, etherscan_url);
    }
    this.props.metrics.trackEvent(
      this.props.metrics
        .createEventBuilder(MetaMetricsEvents.NAVIGATION_TAPS_VIEW_ETHERSCAN)
        .build(),
    );
  };

  submitFeedback = () => {
    this.props.metrics.trackEvent(
      this.props.metrics
        .createEventBuilder(MetaMetricsEvents.NAVIGATION_TAPS_SEND_FEEDBACK)
        .build(),
    );
    this.goToBrowserUrl(
      'https://community.metamask.io/c/feature-requests-ideas/',
      strings('drawer.request_feature'),
    );
  };

  showHelp = () => {
    this.props.navigation.navigate(Routes.BROWSER.HOME, {
      screen: Routes.BROWSER.VIEW,
      params: {
        newTabUrl: 'https://support.metamask.io',
        timestamp: Date.now(),
      },
    });
    this.props.metrics.trackEvent(
      this.props.metrics
        .createEventBuilder(MetaMetricsEvents.NAVIGATION_TAPS_GET_HELP)
        .build(),
    );
    this.hideDrawer();
  };

  goToBrowserUrl(url, title) {
    this.props.navigation.navigate('Webview', {
      screen: 'SimpleWebview',
      params: {
        url,
        title,
      },
    });
    this.hideDrawer();
  }

  hideDrawer = () => {
    this.props.onCloseDrawer();
  };

  hasBlockExplorer = (providerType) => {
    const { networkConfigurations } = this.props;
    if (providerType === RPC) {
      const {
        providerConfig: { rpcUrl },
      } = this.props;
      const blockExplorer = findBlockExplorerForRpc(
        rpcUrl,
        networkConfigurations,
      );
      if (blockExplorer) {
        return true;
      }
    }
    return hasBlockExplorer(providerType);
  };

  getIcon(name, size) {
    const colors = this.context.colors || mockTheme.colors;

    return (
      <Icon name={name} size={size || 24} color={colors.icon.alternative} />
    );
  }

  getFeatherIcon(name, size) {
    const colors = this.context.colors || mockTheme.colors;

    return (
      <FeatherIcon
        name={name}
        size={size || 24}
        color={colors.icon.alternative}
      />
    );
  }

  getMaterialIcon(name, size) {
    const colors = this.context.colors || mockTheme.colors;

    return (
      <MaterialIcon
        name={name}
        size={size || 24}
        color={colors.icon.alternative}
      />
    );
  }

  getImageIcon(name) {
    const colors = this.context.colors || mockTheme.colors;
    const styles = createStyles(colors);

    return (
      <Image source={ICON_IMAGES[name]} style={styles.menuItemIconImage} />
    );
  }

  getSelectedIcon(name, size) {
    const colors = this.context.colors || mockTheme.colors;

    return (
      <Icon name={name} size={size || 24} color={colors.primary.default} />
    );
  }

  getSelectedMaterialIcon(name, size) {
    const colors = this.context.colors || mockTheme.colors;

    return (
      <MaterialIcon
        name={name}
        size={size || 24}
        color={colors.primary.default}
      />
    );
  }

  getSelectedImageIcon(name) {
    const colors = this.context.colors || mockTheme.colors;
    const styles = createStyles(colors);

    return (
      <Image
        source={ICON_IMAGES[`selected-${name}`]}
        style={styles.selectedMenuItemIconImage}
      />
    );
  }

  getSections = () => {
    const {
      providerConfig: { type, rpcUrl },
      networkConfigurations,
    } = this.props;
    let blockExplorer, blockExplorerName;
    if (type === RPC) {
      blockExplorer = findBlockExplorerForRpc(rpcUrl, networkConfigurations);
      blockExplorerName = getBlockExplorerName(blockExplorer);
    }
    return [
      [
        {
          name: strings('drawer.share_address'),
          icon: this.getMaterialIcon('share-variant'),
          action: this.onShare,
        },
        {
          name:
            (blockExplorer &&
              `${strings('drawer.view_in')} ${blockExplorerName}`) ||
            strings('drawer.view_in_etherscan'),
          icon: this.getIcon('eye'),
          action: this.viewInEtherscan,
        },
      ],
      [
        {
          name: strings('drawer.help'),
          icon: this.getIcon('comments'),
          action: this.showHelp,
        },
        {
          name: strings('drawer.request_feature'),
          icon: this.getFeatherIcon('message-square'),
          action: this.submitFeedback,
        },
        {
          name: strings('drawer.lock'),
          icon: this.getFeatherIcon('log-out'),
          action: this.lock,
          // ...generateTestId(Platform, DRAWER_VIEW_LOCK_ICON_ID),
          testID: DRAWER_VIEW_LOCK_TEXT_ID,
        },
      ],
    ];
  };

  copyAccountToClipboard = async () => {
    await ClipboardManager.setString(this.selectedChecksummedAddress);
    this.toggleReceiveModal();
    InteractionManager.runAfterInteractions(() => {
      this.props.showAlert({
        isVisible: true,
        autodismiss: 1500,
        content: 'clipboard-alert',
        data: { msg: strings('account_details.account_copied_to_clipboard') },
      });
    });
  };

  onShare = () => {
    Share.open({
      message: this.selectedChecksummedAddress,
    })
      .then(() => {
        this.props.protectWalletModalVisible();
      })
      .catch((err) => {
        Logger.log('Error while trying to share address', err);
      });
    this.props.metrics.trackEvent(
      this.props.metrics
        .createEventBuilder(
          MetaMetricsEvents.NAVIGATION_TAPS_SHARE_PUBLIC_ADDRESS,
        )
        .build(),
    );
  };

  onSecureWalletModalAction = () => {
    this.setState({ showProtectWalletModal: false });
    this.props.navigation.navigate(
      'SetPasswordFlow',
      this.props.passwordSet ? { screen: 'AccountBackupStep1' } : undefined,
    );
    InteractionManager.runAfterInteractions(() => {
      this.props.metrics.trackEvent(
        this.props.metrics
          .createEventBuilder(MetaMetricsEvents.WALLET_SECURITY_PROTECT_ENGAGED)
          .addProperties({
            wallet_protection_required: true,
            source: 'Modal',
          })
          .build(),
      );
    });
  };

  onInfoNetworksModalClose = () => {
    const {
      chainId,
      onboardNetworkAction,
      networkSwitched,
      toggleInfoNetworkModal,
    } = this.props;

    onboardNetworkAction(chainId);
    networkSwitched({ networkUrl: '', networkStatus: false });

    // Wrap the toggle call in a setTimeout to avoid awaiting a non-promise function.
    safePromiseHandler(toggleInfoNetworkModal(), 100);
  };

  renderProtectModal = () => {
    const colors = this.context.colors || mockTheme.colors;
    const styles = createStyles(colors);

    return (
      <Modal
        isVisible={this.state.showProtectWalletModal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        style={styles.bottomModal}
        backdropColor={colors.overlay.default}
        backdropOpacity={1}
        animationInTiming={600}
        animationOutTiming={600}
      >
        <View style={styles.protectWalletContainer}>
          <View style={styles.protectWalletIconContainer}>
            <FeatherIcon
              style={styles.protectWalletIcon}
              name="alert-triangle"
              size={20}
            />
          </View>
          <Text style={styles.protectWalletTitle}>
            {strings('protect_your_wallet_modal.title')}
          </Text>
          <Text style={styles.protectWalletContent}>
            {!this.props.passwordSet
              ? strings('protect_your_wallet_modal.body_for_password')
              : strings('protect_your_wallet_modal.body_for_seedphrase')}
          </Text>
          <View style={styles.protectWalletButtonWrapper}>
            <StyledButton
              type={'confirm'}
              onPress={this.onSecureWalletModalAction}
            >
              {strings('protect_your_wallet_modal.button')}
            </StyledButton>
          </View>
        </View>
      </Modal>
    );
  };

  render() {
    const {
      providerConfig,
      accounts,
      selectedInternalAccount,
      currentCurrency,
      seedphraseBackedUp,
      currentRoute,
      navigation,
      infoNetworkModalVisible,
    } = this.props;
    const colors = this.context.colors || mockTheme.colors;
    const styles = createStyles(colors);
    const {
      account: { name: nameFromState, ens: ensFromState },
    } = this.state;

    const account = {
      address: this.selectedChecksummedAddress,
      name: nameFromState,
      ens: ensFromState,
      ...selectedInternalAccount,
      ...accounts[this.selectedChecksummedAddress],
    };
    const { name, ens } = account;
    account.balance =
      (accounts[this.selectedChecksummedAddress] &&
        renderFromWei(accounts[this.selectedChecksummedAddress].balance)) ||
      0;
    const fiatBalance = Engine.getTotalEvmFiatAccountBalance();
    const totalFiatBalance = fiatBalance.ethFiat + fiatBalance.tokenFiat;
    if (totalFiatBalance !== Number(this.previousBalance)) {
      this.previousBalance = this.currentBalance;
    }
    this.currentBalance = totalFiatBalance;
    const fiatBalanceStr = renderFiat(this.currentBalance, currentCurrency);
    const accountName = isDefaultAccountName(name) && ens ? ens : name;

    return (
      <View style={styles.wrapper} testID={'drawer-screen'}>
        <ScrollView>
          <View style={styles.header}>
            <View style={styles.metamaskLogo}>
              <Image
                source={metamask_fox}
                style={styles.metamaskFox}
                resizeMethod={'auto'}
              />
              <Image
                source={metamask_name}
                style={styles.metamaskName}
                resizeMethod={'auto'}
              />
            </View>
          </View>
          <View style={styles.account}>
            <View style={styles.accountBgOverlay}>
              <TouchableOpacity
                style={styles.identiconWrapper}
                onPress={this.openAccountSelector}
                testID={'navbar-account-identicon'}
              >
                <View style={styles.identiconBorder}>
                  <Identicon
                    diameter={48}
                    address={this.selectedChecksummedAddress}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.accountInfo}
                onPress={this.openAccountSelector}
                testID={'navbar-account-button'}
              >
                <View style={styles.accountNameWrapper}>
                  <Text style={styles.accountName} numberOfLines={1}>
                    {accountName}
                  </Text>
                  <Icon name="caret-down" size={24} style={styles.caretDown} />
                </View>
                <Text style={styles.accountBalance}>{fiatBalanceStr}</Text>
                <EthereumAddress
                  address={account.address}
                  style={styles.accountAddress}
                  type={'short'}
                />
                {this.renderTag()}
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.buttons}>
            <StyledButton
              type={'rounded-normal'}
              onPress={this.onSend}
              containerStyle={[styles.button, styles.leftButton]}
              testID={'drawer-send-button'}
            >
              <View style={styles.buttonContent}>
                <MaterialIcon
                  name={'arrow-top-right'}
                  size={22}
                  color={colors.primary.default}
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>
                  {strings('drawer.send_button')}
                </Text>
              </View>
            </StyledButton>
            <StyledButton
              type={'rounded-normal'}
              onPress={this.onReceive}
              containerStyle={[styles.button, styles.rightButton]}
              testID={'drawer-receive-button'}
            >
              <View style={styles.buttonContent}>
                <MaterialIcon
                  name={'keyboard-tab'}
                  size={22}
                  color={colors.primary.default}
                  style={[styles.buttonIcon, styles.buttonReceive]}
                />
                <Text style={styles.buttonText}>
                  {strings('drawer.receive_button')}
                </Text>
              </View>
            </StyledButton>
          </View>
          <View style={styles.menu}>
            {this.getSections().map(
              (section, i) =>
                section?.length > 0 && (
                  <View
                    key={`section_${i}`}
                    style={[
                      styles.menuSection,
                      i === 0 ? styles.noTopBorder : null,
                    ]}
                  >
                    {section
                      .filter((item) => {
                        if (!item) return undefined;
                        const { name = undefined } = item;
                        if (
                          name &&
                          name.toLowerCase().indexOf('etherscan') !== -1
                        ) {
                          const type = providerConfig?.type;
                          return (
                            (type && this.hasBlockExplorer(type)) || undefined
                          );
                        }
                        return true;
                      })
                      .map((item, j) => (
                        <TouchableOpacity
                          key={`item_${i}_${j}`}
                          style={[
                            styles.menuItem,
                            item.routeNames &&
                            item.routeNames.includes(currentRoute)
                              ? styles.selectedRoute
                              : null,
                          ]}
                          ref={
                            item.name === strings('drawer.browser') &&
                            this.browserSectionRef
                          }
                          onPress={() => item.action()} // eslint-disable-line
                        >
                          {item.icon
                            ? item.routeNames &&
                              item.routeNames.includes(currentRoute)
                              ? item.selectedIcon
                              : item.icon
                            : null}
                          <Text
                            style={[
                              styles.menuItemName,
                              !item.icon ? styles.noIcon : null,
                              item.routeNames &&
                              item.routeNames.includes(currentRoute)
                                ? styles.selectedName
                                : null,
                            ]}
                            {...generateTestId(Platform, item.testID)}
                            numberOfLines={1}
                          >
                            {item.name}
                          </Text>
                          {!seedphraseBackedUp && item.warning ? (
                            <SettingsNotification isNotification isWarning>
                              <Text style={styles.menuItemWarningText}>
                                {item.warning}
                              </Text>
                            </SettingsNotification>
                          ) : null}
                        </TouchableOpacity>
                      ))}
                  </View>
                ),
            )}
          </View>
        </ScrollView>

        <Modal
          isVisible={infoNetworkModalVisible}
          onBackdropPress={navigation.goBack}
          onBackButtonPress={navigation.goBack}
          onSwipeComplete={navigation.goBack}
          swipeDirection={'down'}
          propagateSwipe
          backdropColor={colors.overlay.default}
          backdropOpacity={1}
        >
          <NetworkInfo onClose={this.onInfoNetworksModalClose} />
        </Modal>

        {this.renderProtectModal()}
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  providerConfig: selectProviderConfig(state),
  chainId: selectChainId(state),
  accounts: selectAccounts(state),
  selectedInternalAccount: selectSelectedInternalAccount(state),
  networkConfigurations: selectNetworkConfigurations(state),
  currentCurrency: selectCurrentCurrency(state),
  keyrings: state.engine.backgroundState.KeyringController.keyrings,
  networkModalVisible: state.modals.networkModalVisible,
  infoNetworkModalVisible: state.modals.infoNetworkModalVisible,
  passwordSet: state.user.passwordSet,
  wizard: state.wizard,
  ticker: selectEvmTicker(state),
  tokens: selectTokens(state),
  tokenBalances: selectContractBalances(state),
  collectibles: collectiblesSelector(state),
  seedphraseBackedUp: state.user.seedphraseBackedUp,
  currentRoute: getCurrentRoute(state),
  switchedNetwork: state.networkOnboarded.switchedNetwork,
});

const mapDispatchToProps = (dispatch) => ({
  toggleNetworkModal: () => dispatch(toggleNetworkModal()),
  showAlert: (config) => dispatch(showAlert(config)),
  newAssetTransaction: (selectedAsset) =>
    dispatch(newAssetTransaction(selectedAsset)),
  protectWalletModalVisible: () => dispatch(protectWalletModalVisible()),
  onboardNetworkAction: (chainId) => dispatch(onboardNetworkAction(chainId)),
  networkSwitched: ({ networkUrl, networkStatus }) =>
    dispatch(networkSwitched({ networkUrl, networkStatus })),
  toggleInfoNetworkModal: () => dispatch(toggleInfoNetworkModal(false)),
});

DrawerView.contextType = ThemeContext;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withMetricsAwareness(DrawerView));
