import { Page, Locator } from '@playwright/test';

export class CartDrawer {
  readonly page: Page;
  readonly cartDrawer: Locator;
  readonly checkoutButton: Locator;
  readonly cartItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartDrawer = page.locator('[data-testid="cart-drawer"]');
    this.checkoutButton = page.locator('[data-testid="checkout-button"]');
    this.cartItems = page.locator('[data-testid="cart-item"]');
  }

  async waitForDrawerOpen() {
    await this.cartDrawer.waitFor({ state: 'visible' });
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async verifyItemInCart() {
    await this.cartItems.first().waitFor({ state: 'visible' });
  }
}

