import { DataTableFacetedFilter } from '@lambdacurry/forms/ui/data-table/data-table-faceted-filter';
import { Button } from '@lambdacurry/forms/ui/button';
import type { Meta, StoryContext, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';

// Mock data for testing
const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Pending', value: 'pending' },
  { label: 'Archived', value: 'archived' },
];

const roleOptions = [
  { label: 'Admin', value: 'admin' },
  { label: 'User', value: 'user' },
  { label: 'Editor', value: 'editor' },
  { label: 'Viewer', value: 'viewer' },
];

// Test component wrapper
const DataTableFilterTestWrapper = () => {
  const [statusValues, setStatusValues] = useState<string[]>([]);
  const [roleValues, setRoleValues] = useState<string[]>([]);

  const handleClearAll = () => {
    setStatusValues([]);
    setRoleValues([]);
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-lg font-semibold">Data Table Filter Test</h2>
      <p className="text-sm text-gray-600">
        Test the DataTableFacetedFilter component with various scenarios
      </p>
      
      <div className="flex gap-4 items-center">
        <DataTableFacetedFilter
          title="Status"
          options={statusOptions}
          selectedValues={statusValues}
          onValuesChange={setStatusValues}
        />
        
        <DataTableFacetedFilter
          title="Role"
          options={roleOptions}
          selectedValues={roleValues}
          onValuesChange={setRoleValues}
        />
        
        <Button 
          variant="outline" 
          onClick={handleClearAll}
          data-testid="clear-all-filters"
        >
          Clear All
        </Button>
      </div>

      {/* Display selected values for testing */}
      <div className="mt-4 p-4 bg-gray-50 rounded">
        <h3 className="font-medium mb-2">Selected Filters:</h3>
        <div data-testid="selected-status">
          Status: {statusValues.length > 0 ? statusValues.join(', ') : 'None'}
        </div>
        <div data-testid="selected-role">
          Role: {roleValues.length > 0 ? roleValues.join(', ') : 'None'}
        </div>
      </div>
    </div>
  );
};

const meta: Meta<typeof DataTableFacetedFilter> = {
  title: 'Data Table/Filter Tests',
  component: DataTableFacetedFilter,
  parameters: { 
    layout: 'centered',
    docs: {
      description: {
        component: 'Comprehensive tests for DataTableFacetedFilter component functionality',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DataTableFacetedFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

// Test functions
const testInitialState = ({ canvas }: StoryContext) => {
  // Verify initial state - no filters selected
  const statusFilter = canvas.getByRole('button', { name: /status/i });
  const roleFilter = canvas.getByRole('button', { name: /role/i });
  
  expect(statusFilter).toBeInTheDocument();
  expect(roleFilter).toBeInTheDocument();
  
  // Check that no badges are visible initially
  expect(canvas.queryByText('selected')).not.toBeInTheDocument();
  
  // Verify selected values display shows "None"
  expect(canvas.getByTestId('selected-status')).toHaveTextContent('Status: None');
  expect(canvas.getByTestId('selected-role')).toHaveTextContent('Role: None');
};

const testSingleFilterSelection = async ({ canvas }: StoryContext) => {
  // Open status filter
  const statusFilter = canvas.getByRole('button', { name: /status/i });
  await userEvent.click(statusFilter);
  
  // Wait for popover to open
  const popover = await canvas.findByRole('dialog');
  expect(popover).toBeInTheDocument();
  
  // Select "Active" option
  const activeOption = within(popover).getByText('Active');
  await userEvent.click(activeOption);
  
  // Verify selection is reflected in the button
  expect(statusFilter).toHaveTextContent('Active');
  
  // Verify selected values display is updated
  await expect(canvas.getByTestId('selected-status')).toHaveTextContent('Status: active');
  
  // Close popover by clicking outside
  await userEvent.click(canvas.getByText('Data Table Filter Test'));
};

const testMultipleFilterSelection = async ({ canvas }: StoryContext) => {
  // Open status filter again
  const statusFilter = canvas.getByRole('button', { name: /status/i });
  await userEvent.click(statusFilter);
  
  // Wait for popover to open
  const popover = await canvas.findByRole('dialog');
  
  // Select "Pending" option (in addition to "Active")
  const pendingOption = within(popover).getByText('Pending');
  await userEvent.click(pendingOption);
  
  // Verify multiple selections are shown
  expect(statusFilter).toHaveTextContent('Active');
  expect(statusFilter).toHaveTextContent('Pending');
  
  // Verify selected values display shows both
  await expect(canvas.getByTestId('selected-status')).toHaveTextContent('Status: active, pending');
  
  // Close popover
  await userEvent.click(canvas.getByText('Data Table Filter Test'));
};

const testFilterSearch = async ({ canvas }: StoryContext) => {
  // Open role filter
  const roleFilter = canvas.getByRole('button', { name: /role/i });
  await userEvent.click(roleFilter);
  
  // Wait for popover to open
  const popover = await canvas.findByRole('dialog');
  
  // Find and use the search input
  const searchInput = within(popover).getByPlaceholderText('Role');
  await userEvent.type(searchInput, 'admin');
  
  // Verify only "Admin" option is visible
  expect(within(popover).getByText('Admin')).toBeInTheDocument();
  expect(within(popover).queryByText('User')).not.toBeInTheDocument();
  
  // Select the filtered option
  const adminOption = within(popover).getByText('Admin');
  await userEvent.click(adminOption);
  
  // Verify selection
  expect(roleFilter).toHaveTextContent('Admin');
  await expect(canvas.getByTestId('selected-role')).toHaveTextContent('Role: admin');
  
  // Close popover
  await userEvent.click(canvas.getByText('Data Table Filter Test'));
};

const testClearIndividualFilter = async ({ canvas }: StoryContext) => {
  // Open status filter (which should have Active and Pending selected)
  const statusFilter = canvas.getByRole('button', { name: /status/i });
  await userEvent.click(statusFilter);
  
  // Wait for popover to open
  const popover = await canvas.findByRole('dialog');
  
  // Click "Clear filters" option
  const clearButton = within(popover).getByText('Clear filters');
  await userEvent.click(clearButton);
  
  // Verify filter is cleared
  expect(statusFilter).not.toHaveTextContent('Active');
  expect(statusFilter).not.toHaveTextContent('Pending');
  await expect(canvas.getByTestId('selected-status')).toHaveTextContent('Status: None');
  
  // Close popover
  await userEvent.click(canvas.getByText('Data Table Filter Test'));
};

const testClearAllFilters = async ({ canvas }: StoryContext) => {
  // First, set some filters
  const roleFilter = canvas.getByRole('button', { name: /role/i });
  await userEvent.click(roleFilter);
  
  const popover = await canvas.findByRole('dialog');
  const userOption = within(popover).getByText('User');
  await userEvent.click(userOption);
  
  // Close popover
  await userEvent.click(canvas.getByText('Data Table Filter Test'));
  
  // Verify role is selected
  await expect(canvas.getByTestId('selected-role')).toHaveTextContent('Role: user');
  
  // Click clear all button
  const clearAllButton = canvas.getByTestId('clear-all-filters');
  await userEvent.click(clearAllButton);
  
  // Verify all filters are cleared
  await expect(canvas.getByTestId('selected-status')).toHaveTextContent('Status: None');
  await expect(canvas.getByTestId('selected-role')).toHaveTextContent('Role: None');
};

const testFilterBadgeDisplay = async ({ canvas }: StoryContext) => {
  // Test badge display for multiple selections
  const statusFilter = canvas.getByRole('button', { name: /status/i });
  await userEvent.click(statusFilter);
  
  const popover = await canvas.findByRole('dialog');
  
  // Select multiple options to test badge behavior
  const activeOption = within(popover).getByText('Active');
  const pendingOption = within(popover).getByText('Pending');
  const archivedOption = within(popover).getByText('Archived');
  
  await userEvent.click(activeOption);
  await userEvent.click(pendingOption);
  await userEvent.click(archivedOption);
  
  // Close popover
  await userEvent.click(canvas.getByText('Data Table Filter Test'));
  
  // Verify badge shows "3 selected" for multiple items
  expect(statusFilter).toHaveTextContent('3 selected');
  
  // Verify selected values display
  await expect(canvas.getByTestId('selected-status')).toHaveTextContent('Status: active, pending, archived');
};

const testNoResultsState = async ({ canvas }: StoryContext) => {
  // Open role filter
  const roleFilter = canvas.getByRole('button', { name: /role/i });
  await userEvent.click(roleFilter);
  
  const popover = await canvas.findByRole('dialog');
  
  // Search for something that doesn't exist
  const searchInput = within(popover).getByPlaceholderText('Role');
  await userEvent.type(searchInput, 'nonexistent');
  
  // Verify "No results found" message
  expect(within(popover).getByText('No results found.')).toBeInTheDocument();
  
  // Close popover
  await userEvent.click(canvas.getByText('Data Table Filter Test'));
};

export const ComprehensiveFilterTests: Story = {
  render: () => <DataTableFilterTestWrapper />,
  parameters: {
    docs: {
      description: {
        story: 'Comprehensive test suite for DataTableFacetedFilter component covering all major interactions and edge cases.',
      },
    },
  },
  play: async (storyContext) => {
    // Run all test scenarios in sequence
    testInitialState(storyContext);
    await testSingleFilterSelection(storyContext);
    await testMultipleFilterSelection(storyContext);
    await testFilterSearch(storyContext);
    await testClearIndividualFilter(storyContext);
    await testClearAllFilters(storyContext);
    await testFilterBadgeDisplay(storyContext);
    await testNoResultsState(storyContext);
  },
};

// Individual test stories for focused testing
export const InitialState: Story = {
  render: () => <DataTableFilterTestWrapper />,
  play: testInitialState,
};

export const SingleSelection: Story = {
  render: () => <DataTableFilterTestWrapper />,
  play: testSingleFilterSelection,
};

export const MultipleSelection: Story = {
  render: () => <DataTableFilterTestWrapper />,
  play: testMultipleFilterSelection,
};

export const SearchFunctionality: Story = {
  render: () => <DataTableFilterTestWrapper />,
  play: testFilterSearch,
};

export const ClearFilters: Story = {
  render: () => <DataTableFilterTestWrapper />,
  play: testClearIndividualFilter,
};

export const NoResults: Story = {
  render: () => <DataTableFilterTestWrapper />,
  play: testNoResultsState,
};

