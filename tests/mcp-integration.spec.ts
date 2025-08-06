import { test, expect } from '@playwright/test';

test('MCP Integration Test - Google Homepage', async ({ page }) => {
  // Test basic navigation
  await page.goto('https://www.google.com');
  
  // Verify the page loaded
  await expect(page).toHaveTitle(/Google/);
  
  // Check for the search input
  const searchInput = page.locator('input[name="q"]');
  await expect(searchInput).toBeVisible();
  
  // Type in the search box
  await searchInput.fill('Playwright MCP');
  
  // Take a screenshot for verification
  await page.screenshot({ path: 'test-results/google-search.png' });
});

test('MCP Integration Test - Example.com', async ({ page }) => {
  // Test a simple static site
  await page.goto('https://example.com');
  
  // Verify the page loaded
  await expect(page).toHaveTitle('Example Domain');
  
  // Check for the main heading
  await expect(page.locator('h1')).toContainText('Example Domain');
  
  // Take a screenshot
  await page.screenshot({ path: 'test-results/example-com.png' });
});

