import Matchers from '../../utils/Matchers';
import Gestures from '../../utils/Gestures';
import { BuildQuoteSelectors } from '../../selectors/Ramps/BuildQuote.selectors';

class BuildQuoteView {
  get amountToBuyLabel() {
    return Matchers.getElementByText(BuildQuoteSelectors.AMOUNT_TO_BUY_LABEL);
  }

  get amountToSellLabel() {
    return Matchers.getElementByText(BuildQuoteSelectors.AMOUNT_TO_SELL_LABEL);
  }

  get getQuotesButton() {
    return Matchers.getElementByText(BuildQuoteSelectors.GET_QUOTES_BUTTON);
  }

  get cancelButton() {
    return Matchers.getElementByText(BuildQuoteSelectors.CANCEL_BUTTON_TEXT);
  }

  async tapCancelButton() {
    await Gestures.waitAndTap(this.cancelButton);
  }

  async tapGetQuotesButton() {
    await Gestures.waitAndTap(this.getQuotesButton);
  }

  async tapSelectedCurrency(currency) {
    await Gestures.waitAndTap(Matchers.getElementByText(currency));
  }

  async selectCurrency(currency) {
    await Gestures.waitAndTap(Matchers.getElementByText(currency));
  }

  async tapSelectedRegionFlag(flag) {
    await Gestures.waitAndTap(Matchers.getElementByText(flag));
  }

  async selectRegion(region) {
    await Gestures.waitAndTap(Matchers.getElementByText(region));
  }

  async tapSelectedPaymentMethod(paymentMethod) {
    await Gestures.waitAndTap(Matchers.getElementByText(paymentMethod));
  }

  async selectPaymentMethod(paymentMethod) {
    await Gestures.waitAndTap(Matchers.getElementByText(paymentMethod));
  }

  async tapFiatAmount(amount) {
    await Gestures.waitAndTap(Matchers.getElementByText(amount));
  }

  async enterFiatAmount(amount) {
    for (let digit = 0; digit < amount.length; digit++) {
      const numberButton = Matchers.getElementByText(amount[digit]);
      await Gestures.waitAndTap(numberButton);
    }
    await Gestures.waitAndTap(Matchers.getElementByText(BuildQuoteSelectors.DONE_BUTTON_TEXT));
  }

  async tapSelectedToken(token) {
    await Gestures.waitAndTap(Matchers.getElementByText(token));
  }

  async selectToken(token) {
    await Gestures.waitAndTap(Matchers.getElementByText(token));
  }
}

export default new BuildQuoteView();
