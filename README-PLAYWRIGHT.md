# Playwright Testing Setup

This document provides a quick start guide for the Playwright testing setup in the Lambda Query Forms repository.

## 🚀 Quick Start

### 1. Install Dependencies
Dependencies are already installed! The setup includes:
- Playwright test framework
- Browser binaries (Chromium, Firefox, WebKit)
- System dependencies for headless browser execution

### 2. Run Tests

```bash
# Run all Playwright tests
yarn test:playwright

# Run tests with UI mode (interactive)
yarn test:playwright:ui

# Run tests in debug mode
yarn test:playwright:debug

# Run specific test file
yarn playwright test tests/mcp-integration.spec.ts
```

### 3. Start Storybook for Component Testing

```bash
# In one terminal - start Storybook
cd apps/docs && yarn dev

# In another terminal - run form-specific tests
yarn playwright test tests/forms-mcp-demo.spec.ts
```

## 📁 Test Files

- `tests/example.spec.ts` - Basic Storybook navigation tests
- `tests/mcp-integration.spec.ts` - External website testing examples
- `tests/forms-mcp-demo.spec.ts` - Form component testing demonstrations

## 🔧 Configuration

The Playwright configuration is in `playwright.config.ts` and includes:
- Multi-browser testing (Chromium, Firefox, WebKit)
- Screenshot and trace collection on failures
- Base URL configuration for Storybook
- HTML reporting

## 🤖 MCP Integration

The repository is configured to work with the Playwright MCP server for AI-driven testing. See `docs/playwright-mcp-integration.md` for detailed information.

### MCP Configuration
```json
{
  "playwright": {
    "command": "npx",
    "args": [
      "@playwright/mcp@latest",
      "--browser=chromium",
      "--headless",
      "--no-sandbox"
    ]
  }
}
```

## 📊 Test Results

Test results are stored in:
- `test-results/` - Screenshots and artifacts
- `playwright-report/` - HTML test reports

## 🐛 Troubleshooting

### Common Issues

1. **Storybook not running**: Make sure Storybook is started with `cd apps/docs && yarn dev`
2. **Browser dependencies**: System dependencies are pre-installed, but if you encounter issues, check the integration guide
3. **Port conflicts**: Storybook runs on port 6006 by default

### Getting Help

- Check `docs/playwright-mcp-integration.md` for detailed setup information
- Review test examples in the `tests/` directory
- Consult the [Playwright documentation](https://playwright.dev/docs/intro)

## 🎯 Next Steps

1. Write tests specific to your form components
2. Set up CI/CD integration
3. Add visual regression testing
4. Explore MCP integration for AI-driven testing

