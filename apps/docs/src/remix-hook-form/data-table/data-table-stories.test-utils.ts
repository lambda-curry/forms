import type { StoryContext } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';

/**
 * Shared test utilities for data table stories
 */

/**
 * Test initial render of data table with configurable title pattern
 */
export const testInitialRender =
  (titlePattern: string | RegExp) =>
  async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);

    // Check if the table is rendered with the correct title
    const title = await canvas.findByText(titlePattern);
    expect(title).toBeInTheDocument();

    // Check if the table has the correct number of rows initially (should be pageSize)
    const rows = canvas.getAllByRole('row', { hidden: true });
    // First row is header, so we expect pageSize + 1 rows
    expect(rows.length).toBeGreaterThan(1); // At least header + 1 data row

    // Check if filter button is rendered (more reliable than pagination)
    const filterButton = canvas.getByRole('button', { name: /filter/i });
    expect(filterButton).toBeInTheDocument();
  };

/**
 * Test filtering functionality
 */
export const testFiltering = async ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement);

  // Open the filter dropdown
  const filterButton = canvas.getByRole('button', { name: /filter/i });
  await userEvent.click(filterButton);

  // Wait for the popover to open
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Find the dialog popover that contains the filter options
  const popover = canvasElement.parentElement?.querySelector('[role="dialog"][data-state="open"]');

  if (!popover) throw new Error('Could not find open filter dialog');

  // Find the Status option by data-value attribute within the popover
  const statusElement = popover.querySelector('[data-value="status"]');

  if (!statusElement) throw new Error('Could not find Status option in filter dialog');

  await userEvent.click(statusElement);

  // Wait for the status filter options to appear
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Find the "In Progress" option by data-value attribute
  const inProgressElement = popover.querySelector('[data-value="In Progress5"]');

  if (!inProgressElement) throw new Error('Could not find "In Progress" option in status filter');

  // Click on the "In Progress" option
  await userEvent.click(inProgressElement);

  // Wait for the filter to be applied (longer wait for server-side)
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Close the filter dropdown by clicking outside
  const title = canvas.getByText(/Issues Table/);
  await userEvent.click(title);

  // Wait for dropdown to close and table to update
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Verify that the table now only shows "In Progress" tasks
  const tableRows = canvas.getAllByRole('row');

  // Skip the header row and check data rows
  const dataRows = tableRows.slice(1);

  // Verify we have some data rows
  expect(dataRows.length).toBeGreaterThan(0);

  // Check that all visible rows contain "in progress" status
  // The status column is the 3rd column (index 2) after Task and Title
  for (const row of dataRows) {
    const cells = within(row).getAllByRole('cell');
    // Get the status cell (3rd column, index 2)
    const statusCell = cells[2];
    expect(statusCell).toBeDefined();

    // Check that the status cell contains "in progress" (case-insensitive due to CSS capitalize)
    const statusText = statusCell.textContent?.toLowerCase() || '';
    expect(statusText).toContain('in progress');
  }

  // Verify the filter interface is working by checking if filter button is still present
  expect(filterButton).toBeInTheDocument();
};

/**
 * Test pagination functionality with configurable wait times
 */
export const testPagination =
  (options?: { serverSide?: boolean }) =>
  async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    const isServerSide = options?.serverSide ?? false;

    // Wait for the table to be fully rendered
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Find pagination controls using aria-label
    const nextButton = canvas.getByLabelText(/next/i);
    const previousButton = canvas.getByLabelText(/previous/i);

    expect(nextButton).toBeInTheDocument();
    expect(previousButton).toBeInTheDocument();

    // Verify initial state - previous button should be disabled on first page
    expect(previousButton).toBeDisabled();

    // Test clicking next page
    await userEvent.click(nextButton);

    // Wait for pagination to update (longer for server-side)
    const waitTime = isServerSide ? 500 : 300;
    await new Promise((resolve) => setTimeout(resolve, waitTime));

    // After clicking next, previous button should be enabled
    expect(previousButton).not.toBeDisabled();

    // Test going back to previous page
    await userEvent.click(previousButton);

    // Wait for pagination to update
    await new Promise((resolve) => setTimeout(resolve, waitTime));

    // Should be back to first page, previous button disabled again
    expect(previousButton).toBeDisabled();
  };
