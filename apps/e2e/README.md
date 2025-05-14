# E2E Testing with Playwright

This package contains end-to-end tests for the application using Playwright.

## Directory Structure

```
apps/e2e/
├── fixtures/           # Test fixtures and setup
├── page-objects/       # Page Object Models
├── tests/              # Test files
├── playwright.config.ts # Playwright configuration
└── package.json        # Package configuration
```

## Running Tests

From the root of the monorepo:

```bash
# Run all tests
yarn workspace e2e test

# Run tests with UI
yarn workspace e2e test:ui

# Run tests in debug mode
yarn workspace e2e test:debug

# View test report
yarn workspace e2e report
```

## Test Flow

The tests cover the following flow:

1. Visit the home page or product detail page
2. Add a product to the cart
3. Open the cart drawer
4. Verify the cart contains the added item
5. Proceed to checkout
6. Fill in the address form
7. Select the test payment option
8. Complete the checkout
9. Verify successful checkout

## Page Objects

- `HomePage`: Handles interactions on the home page
- `ProductPage`: Handles interactions on the product detail page
- `CartDrawer`: Handles interactions with the cart drawer
- `CheckoutPage`: Handles interactions on the checkout page

## Customizing Tests

To add new tests or modify existing ones, update the files in the `tests` directory. To add new page objects, add new files to the `page-objects` directory.

