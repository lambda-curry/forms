import { test, expect } from '../fixtures/test-setup.fixture';
import { HomePage } from '../page-objects/home-page';
import { ProductPage } from '../page-objects/product-page';
import { CartDrawer } from '../page-objects/cart-drawer';
import { CheckoutPage } from '../page-objects/checkout-page';

test.describe('Complete Checkout Flow', () => {
  test('should complete a purchase with test payment', async ({ page }) => {
    // Initialize page objects
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const cartDrawer = new CartDrawer(page);
    const checkoutPage = new CheckoutPage(page);

    // Step 1: Visit the home page
    await homePage.goto();
    
    // Step 2: Add a product to cart from home page
    await homePage.addToCart();
    
    // Step 3: Open the cart drawer
    await homePage.openCartDrawer();
    
    // Step 4: Verify cart drawer is open and has items
    await cartDrawer.waitForDrawerOpen();
    await cartDrawer.verifyItemInCart();
    
    // Step 5: Proceed to checkout
    await cartDrawer.proceedToCheckout();
    
    // Step 6: Verify we're on the checkout page
    await expect(page).toHaveURL(/\/checkout/);
    
    // Step 7: Fill in the address form
    await checkoutPage.fillAddressForm({
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      address: '123 Test St',
      city: 'Test City',
      state: 'TX',
      zip: '12345',
      phone: '555-123-4567'
    });
    
    // Step 8: Select test payment option
    await checkoutPage.selectTestPayment();
    
    // Step 9: Complete checkout with test payment
    await checkoutPage.completeCheckout();
    
    // Step 10: Verify successful checkout (this will depend on your app's behavior)
    // For example, you might check for a success message or redirection to a confirmation page
    await expect(page).toHaveURL(/\/confirmation|\/success|\/thank-you/);
  });

  test('should add product from PDP and complete checkout', async ({ page }) => {
    // Initialize page objects
    const productPage = new ProductPage(page);
    const cartDrawer = new CartDrawer(page);
    const checkoutPage = new CheckoutPage(page);

    // Step 1: Visit a product detail page (replace with an actual product handle)
    await productPage.goto('sample-product');
    
    // Step 2: Add the product to cart
    await productPage.addToCart();
    
    // Step 3: Open the cart drawer
    await productPage.openCartDrawer();
    
    // Step 4: Verify cart drawer is open and has items
    await cartDrawer.waitForDrawerOpen();
    await cartDrawer.verifyItemInCart();
    
    // Step 5: Proceed to checkout
    await cartDrawer.proceedToCheckout();
    
    // Step 6: Verify we're on the checkout page
    await expect(page).toHaveURL(/\/checkout/);
    
    // Step 7: Fill in the address form
    await checkoutPage.fillAddressForm({
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      address: '123 Test St',
      city: 'Test City',
      state: 'TX',
      zip: '12345',
      phone: '555-123-4567'
    });
    
    // Step 8: Select test payment option
    await checkoutPage.selectTestPayment();
    
    // Step 9: Complete checkout with test payment
    await checkoutPage.completeCheckout();
    
    // Step 10: Verify successful checkout
    await expect(page).toHaveURL(/\/confirmation|\/success|\/thank-you/);
  });
});

