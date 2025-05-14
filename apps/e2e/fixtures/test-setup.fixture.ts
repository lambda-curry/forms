// Use require instead of import to avoid TypeScript errors
const { test: base, expect } = require('@playwright/test');

// Define a fixture that sets up the test environment
export const test = base.extend({
  // Add any global setup here if needed
});

export { expect };
