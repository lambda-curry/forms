import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly addToCartButton: Locator;
  readonly cartDrawerButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addToCartButton = page.locator('[data-testid="add-to-cart"]');
    this.cartDrawerButton = page.locator('[data-testid="cart-button"]');
  }

  async goto() {
    await this.page.goto('/');
  }

  async addToCart() {
    await this.addToCartButton.click();
  }

  async openCartDrawer() {
    await this.cartDrawerButton.click();
  }
}

