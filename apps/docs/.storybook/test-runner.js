const { getJestConfig } = require('@storybook/test-runner');

const testRunnerConfig = getJestConfig();

/**
 * @type {import('@jest/types').Config.InitialOptions}
 */
module.exports = {
  ...testRunnerConfig,
  // Increase timeout for CI environments
  testTimeout: 30000, // 30 seconds instead of default 15 seconds

  // Configure for CI environments
  setupFilesAfterEnv: [...(testRunnerConfig.setupFilesAfterEnv || []), require.resolve('./test-runner-setup.js')],
};
