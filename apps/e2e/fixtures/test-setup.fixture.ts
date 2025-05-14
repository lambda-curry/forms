import { test as base } from '@playwright/test';

// Define a fixture that sets up the test environment
export const test = base.extend({
  // Add any global setup here if needed
});

export { expect } from '@playwright/test';

