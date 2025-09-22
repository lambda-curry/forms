// Configure testing-library for CI environments
const { configure } = require('@testing-library/react');

// Increase timeout for element queries in CI environments
configure({
  testIdAttribute: 'data-testid',
  // Increase default timeout for findBy* queries (especially important for CI)
  asyncUtilTimeout: 10000, // 10 seconds instead of default 1 second
});
