import { Page, Locator } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly addressInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly zipInput: Locator;
  readonly phoneInput: Locator;
  readonly testPaymentOption: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('[data-testid="email"]');
    this.firstNameInput = page.locator('[data-testid="firstName"]');
    this.lastNameInput = page.locator('[data-testid="lastName"]');
    this.addressInput = page.locator('[data-testid="address"]');
    this.cityInput = page.locator('[data-testid="city"]');
    this.stateInput = page.locator('[data-testid="state"]');
    this.zipInput = page.locator('[data-testid="zip"]');
    this.phoneInput = page.locator('[data-testid="phone"]');
    this.testPaymentOption = page.locator('[data-testid="test-payment"]');
    this.checkoutButton = page.locator('[data-testid="checkout-test-payment-button"]');
  }

  async fillAddressForm(customerInfo: {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
  }) {
    await this.emailInput.fill(customerInfo.email);
    await this.firstNameInput.fill(customerInfo.firstName);
    await this.lastNameInput.fill(customerInfo.lastName);
    await this.addressInput.fill(customerInfo.address);
    await this.cityInput.fill(customerInfo.city);
    await this.stateInput.fill(customerInfo.state);
    await this.zipInput.fill(customerInfo.zip);
    await this.phoneInput.fill(customerInfo.phone);
  }

  async selectTestPayment() {
    await this.testPaymentOption.click();
  }

  async completeCheckout() {
    await this.checkoutButton.click();
  }
}

