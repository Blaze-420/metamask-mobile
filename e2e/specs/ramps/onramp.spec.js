'use strict';
import { loginToApp } from '../../viewHelper';
import TabBarComponent from '../../pages/TabBarComponent';
import WalletActionsModal from '../../pages/modals/WalletActionsModal';
import FixtureBuilder from '../../fixtures/fixture-builder';
import {
  loadFixture,
  startFixtureServer,
  stopFixtureServer,
} from '../../fixtures/fixture-helper';
import TestHelpers from '../../helpers';
import FixtureServer from '../../fixtures/fixture-server';
import { getFixturesServerPort } from '../../fixtures/utils';
import { SmokeCore } from '../../tags';
import BuyGetStartedView from '../../pages/Ramps/BuyGetStartedView';
import SelectRegionView from '../../pages/Ramps/SelectRegionView';
import SelectPaymentMethodView from '../../pages/Ramps/SelectPaymentMethodView';
import BuildQuoteView from '../../pages/Ramps/BuildQuoteView';
import QuoteView from '../../pages/Ramps/QuoteView';
import Assertions from '../../utils/Assertions';

const fixtureServer = new FixtureServer();

describe(SmokeCore('Buy Crypto'), () => {
  beforeAll(async () => {
    await TestHelpers.reverseServerPort();
    const fixture = new FixtureBuilder().build();
    await startFixtureServer(fixtureServer);
    await loadFixture(fixtureServer, { fixture });
    await device.launchApp({
      permissions: { notifications: 'YES' },
      launchArgs: { fixtureServerPort: `${getFixturesServerPort()}` },
    });
    await loginToApp();
  });

  afterAll(async () => {
    await stopFixtureServer(fixtureServer);
  });

  beforeEach(async () => {
    jest.setTimeout(150000);
  });

  it('should select Region and Payment Method to see the Build Buy Quote screen', async () => {
    await TabBarComponent.tapWallet();
    await TabBarComponent.tapActions();
    await WalletActionsModal.tapBuyButton();
    await BuyGetStartedView.tapGetStartedButton();
    await SelectRegionView.tapSelectRegionDropdown();
    await SelectRegionView.tapRegionOption('United States of America');
    await SelectRegionView.tapRegionOption('California');
    await SelectRegionView.tapContinueButton();
    await SelectPaymentMethodView.tapPaymentMethodOption('Debit or Credit');
    await SelectPaymentMethodView.tapContinueButton();
    await Assertions.checkIfVisible(BuildQuoteView.amountToBuyLabel);
    await Assertions.checkIfVisible(BuildQuoteView.getQuotesButton);
    await BuildQuoteView.tapCancelButton();
  });

  it('should skip to the Build Quote screen for returning user', async () => {
    await TabBarComponent.tapActions();
    await WalletActionsModal.tapBuyButton();
    await Assertions.checkIfVisible(BuildQuoteView.amountToBuyLabel);
    await Assertions.checkIfVisible(BuildQuoteView.getQuotesButton);
  });

  it('should select a new currency and check the quotes', async () => {
    await TabBarComponent.tapActions();
    await WalletActionsModal.tapBuyButton();
    await BuildQuoteView.tapSelectedCurrency(/.*USD.*/)
    await BuildQuoteView.selectCurrency('EUR')
    await BuildQuoteView.tapFiatAmount('€0')
    await BuildQuoteView.enterFiatAmount('50')
    await BuildQuoteView.tapGetQuotesButton()
    await Assertions.checkIfVisible(QuoteView.selectAQuoteLabel)
    await Assertions.checkIfTextIsDisplayed(/^≈ €.*EUR$/);
    await Assertions.checkIfTextIsNotDisplayed(/^≈ \$.*USD$/);
    await QuoteView.dismiss()
    await BuildQuoteView.tapCancelButton();
  });

  it('should select a new region and check the quotes', async () => {
    await TabBarComponent.tapActions();
    await WalletActionsModal.tapBuyButton();
    await BuildQuoteView.tapSelectedRegionFlag('🇺🇸')
    await BuildQuoteView.selectRegion('France')
    await BuildQuoteView.tapFiatAmount('€0')
    await BuildQuoteView.enterFiatAmount('50')
    await BuildQuoteView.tapGetQuotesButton()
    await Assertions.checkIfVisible(QuoteView.selectAQuoteLabel)
    await Assertions.checkIfTextIsDisplayed(/^≈ €.*EUR$/);
    await Assertions.checkIfTextIsNotDisplayed(/^≈ $.*USD$/);
    await QuoteView.dismiss()
    await BuildQuoteView.tapCancelButton();
  });

  it('should select a new token and check the quotes', async () => {
    await TabBarComponent.tapActions();
    await WalletActionsModal.tapBuyButton();
    await BuildQuoteView.tapSelectedToken('Ethereum')
    await BuildQuoteView.selectToken('Uniswap')
    await BuildQuoteView.tapFiatAmount('€0')
    await BuildQuoteView.enterFiatAmount('50')
    await BuildQuoteView.tapGetQuotesButton()
    await Assertions.checkIfVisible(QuoteView.selectAQuoteLabel)
    await Assertions.checkIfTextIsDisplayed(/.*UNI$/);
    await Assertions.checkIfTextIsDisplayed(/^≈ €.*EUR$/);
    await Assertions.checkIfTextIsNotDisplayed(/.*ETH$/);
    await QuoteView.dismiss()
    await BuildQuoteView.tapCancelButton();
  });

  it('should select a new payment method and check the quotes', async () => {
    await TabBarComponent.tapActions();
    await WalletActionsModal.tapBuyButton();
    await BuildQuoteView.tapSelectedPaymentMethod('Debit or Credit')
    await BuildQuoteView.selectPaymentMethod('Apple Pay')
    await BuildQuoteView.tapFiatAmount('€0')
    await BuildQuoteView.enterFiatAmount('50')
    await BuildQuoteView.tapGetQuotesButton()
    await Assertions.checkIfVisible(QuoteView.selectAQuoteLabel)
    await Assertions.checkIfTextIsDisplayed(/^≈ €.*EUR$/);
    await QuoteView.dismiss()
    await BuildQuoteView.tapCancelButton();
  });
});
