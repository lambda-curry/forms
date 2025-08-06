# Playwright MCP Integration Guide

This document outlines how to integrate Playwright with the MCP (Model Context Protocol) server for automated browser testing in the Lambda Query Forms repository.

## Setup Complete ✅

The following components have been successfully installed and configured:

### 1. Playwright Installation
- ✅ Playwright and @playwright/test packages installed
- ✅ Browser binaries downloaded (Chromium, Firefox, WebKit)
- ✅ System dependencies installed for browser execution
- ✅ Playwright configuration file created (`playwright.config.ts`)

### 2. Test Scripts Added
- ✅ `yarn test:playwright` - Run Playwright tests
- ✅ `yarn test:playwright:ui` - Run tests with UI mode
- ✅ `yarn test:playwright:debug` - Run tests in debug mode

### 3. MCP Server Configuration

The updated MCP configuration (as recommended) removes the explicit executable path to let Playwright auto-detect the browser:

```json
{
  "mcpServers": {
    "context7": { "url": "https://mcp.context7.com/mcp" },
    "medusa": { "url": "https://docs.medusajs.com/mcp" },
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--project-ref=kfuyjexvpaghfmbjcygo"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "sbp_c4bdb5e8151b8fd7fcd3b0ab0dec8e4643b00722"
      }
    },
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
}
```

### Key Changes Made:
- ✅ Removed `--executable-path` argument to allow auto-detection
- ✅ Added `--no-sandbox` for containerized environments
- ✅ Configured for headless operation

## Available MCP Tools

The Playwright MCP server provides the following tools for browser automation:

### Navigation
- `playwright_1mcp_browser_navigate` - Navigate to URLs
- `playwright_1mcp_browser_navigate_back` - Go back in history
- `playwright_1mcp_browser_navigate_forward` - Go forward in history

### Interaction
- `playwright_1mcp_browser_click` - Click elements
- `playwright_1mcp_browser_type` - Type text into inputs
- `playwright_1mcp_browser_press_key` - Press keyboard keys
- `playwright_1mcp_browser_hover` - Hover over elements
- `playwright_1mcp_browser_drag` - Drag and drop
- `playwright_1mcp_browser_select_option` - Select dropdown options

### Information Gathering
- `playwright_1mcp_browser_snapshot` - Get accessibility snapshot
- `playwright_1mcp_browser_take_screenshot` - Capture screenshots
- `playwright_1mcp_browser_console_messages` - Get console logs
- `playwright_1mcp_browser_network_requests` - View network activity

### Browser Management
- `playwright_1mcp_browser_resize` - Resize browser window
- `playwright_1mcp_browser_tab_list` - List open tabs
- `playwright_1mcp_browser_tab_new` - Open new tab
- `playwright_1mcp_browser_tab_select` - Switch tabs
- `playwright_1mcp_browser_tab_close` - Close tabs

### Utilities
- `playwright_1mcp_browser_wait_for` - Wait for conditions
- `playwright_1mcp_browser_evaluate` - Execute JavaScript
- `playwright_1mcp_browser_file_upload` - Upload files
- `playwright_1mcp_browser_handle_dialog` - Handle alerts/dialogs

## Testing the Integration

### 1. Basic Playwright Tests
Run the standard Playwright tests to verify the installation:

```bash
yarn test:playwright
```

### 2. MCP Integration Tests
The MCP integration allows you to control browsers programmatically through the MCP protocol. Example usage:

```typescript
// Example of how MCP tools would be used
await playwright_1mcp_browser_navigate({ url: 'http://localhost:6006' });
await playwright_1mcp_browser_snapshot(); // Get page structure
await playwright_1mcp_browser_click({ 
  element: 'Get started button', 
  ref: 'button[data-testid="get-started"]' 
});
await playwright_1mcp_browser_take_screenshot({ filename: 'storybook-home.png' });
```

### 3. Storybook Integration
The configuration is set up to work with the Storybook development server:

```bash
# Start Storybook (in one terminal)
cd apps/docs && yarn dev

# Run tests against Storybook (in another terminal)
yarn test:playwright
```

## Troubleshooting

### Common Issues and Solutions

1. **Browser Dependencies Missing**
   - Solution: Install system dependencies with `sudo apt-get install` commands
   - The setup script has already installed the required packages

2. **MCP Server Connection Issues**
   - Verify the MCP configuration is correct
   - Check that the Playwright MCP server is running
   - Ensure network connectivity to the MCP server

3. **Headless Mode Issues**
   - The configuration uses `--headless` and `--no-sandbox` for containerized environments
   - For debugging, you can temporarily remove `--headless` from the MCP config

## Next Steps

1. **Create Form-Specific Tests**: Write tests that specifically target the Lambda Query Forms components
2. **Integration with CI/CD**: Set up automated testing in your CI pipeline
3. **Visual Regression Testing**: Use Playwright's screenshot capabilities for visual testing
4. **Performance Testing**: Leverage network monitoring tools for performance analysis

## File Structure

```
├── playwright.config.ts          # Playwright configuration
├── tests/
│   ├── example.spec.ts           # Basic Storybook tests
│   └── mcp-integration.spec.ts   # MCP integration examples
├── test-results/                 # Test output directory
└── docs/
    └── playwright-mcp-integration.md  # This guide
```

The integration is now ready for use! The MCP server configuration should resolve the previous path resolution issues by allowing Playwright to auto-detect the browser executable.

