import { DataTableFacetedFilter } from '@lambdacurry/forms/ui/data-table/data-table-faceted-filter';
import { Button } from '@lambdacurry/forms/ui/button';
import type { Meta, StoryContext, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';

// Test data for various scenarios
const emptyOptions: { label: string; value: string }[] = [];

const singleOption = [
  { label: 'Only Option', value: 'only' },
];

const manyOptions = Array.from({ length: 20 }, (_, i) => ({
  label: `Option ${i + 1}`,
  value: `option-${i + 1}`,
}));

const optionsWithSpecialCharacters = [
  { label: 'Option with "quotes"', value: 'quotes' },
  { label: 'Option with <tags>', value: 'tags' },
  { label: 'Option with & ampersand', value: 'ampersand' },
  { label: 'Option with émojis 🚀', value: 'emoji' },
  { label: 'Very long option name that might overflow the container and cause layout issues', value: 'long' },
];

// Edge case test component
const FilterEdgeCasesTestWrapper = () => {
  const [emptyValues, setEmptyValues] = useState<string[]>([]);
  const [singleValues, setSingleValues] = useState<string[]>([]);
  const [manyValues, setManyValues] = useState<string[]>([]);
  const [specialValues, setSpecialValues] = useState<string[]>([]);
  const [disabledValues, setDisabledValues] = useState<string[]>(['option-1']);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-lg font-semibold">Filter Components Edge Cases Test</h2>
      
      {/* Empty options test */}
      <div className="space-y-2">
        <h3 className="font-medium">Empty Options Filter</h3>
        <DataTableFacetedFilter
          title="Empty Filter"
          options={emptyOptions}
          selectedValues={emptyValues}
          onValuesChange={setEmptyValues}
        />
        <div data-testid="empty-selected" className="text-sm text-gray-600">
          Selected: {emptyValues.join(', ') || 'None'}
        </div>
      </div>

      {/* Single option test */}
      <div className="space-y-2">
        <h3 className="font-medium">Single Option Filter</h3>
        <DataTableFacetedFilter
          title="Single Filter"
          options={singleOption}
          selectedValues={singleValues}
          onValuesChange={setSingleValues}
        />
        <div data-testid="single-selected" className="text-sm text-gray-600">
          Selected: {singleValues.join(', ') || 'None'}
        </div>
      </div>

      {/* Many options test */}
      <div className="space-y-2">
        <h3 className="font-medium">Many Options Filter (20 items)</h3>
        <DataTableFacetedFilter
          title="Many Options"
          options={manyOptions}
          selectedValues={manyValues}
          onValuesChange={setManyValues}
        />
        <div data-testid="many-selected" className="text-sm text-gray-600">
          Selected: {manyValues.length} items
        </div>
      </div>

      {/* Special characters test */}
      <div className="space-y-2">
        <h3 className="font-medium">Special Characters Filter</h3>
        <DataTableFacetedFilter
          title="Special Chars"
          options={optionsWithSpecialCharacters}
          selectedValues={specialValues}
          onValuesChange={setSpecialValues}
        />
        <div data-testid="special-selected" className="text-sm text-gray-600">
          Selected: {specialValues.join(', ') || 'None'}
        </div>
      </div>

      {/* Pre-selected values test */}
      <div className="space-y-2">
        <h3 className="font-medium">Pre-selected Values Filter</h3>
        <DataTableFacetedFilter
          title="Pre-selected"
          options={manyOptions.slice(0, 5)}
          selectedValues={disabledValues}
          onValuesChange={setDisabledValues}
        />
        <div data-testid="preselected-selected" className="text-sm text-gray-600">
          Selected: {disabledValues.join(', ') || 'None'}
        </div>
      </div>

      {/* Reset all button */}
      <Button 
        onClick={() => {
          setEmptyValues([]);
          setSingleValues([]);
          setManyValues([]);
          setSpecialValues([]);
          setDisabledValues([]);
        }}
        data-testid="reset-all"
        variant="outline"
      >
        Reset All Filters
      </Button>
    </div>
  );
};

const meta: Meta<typeof DataTableFacetedFilter> = {
  title: 'Data Table/Filter Edge Cases',
  component: DataTableFacetedFilter,
  parameters: { 
    layout: 'centered',
    docs: {
      description: {
        component: 'Edge case testing for DataTableFacetedFilter component including empty options, special characters, and performance scenarios',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DataTableFacetedFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

// Test functions for edge cases
const testEmptyOptionsFilter = async ({ canvas }: StoryContext) => {
  // Test filter with no options
  const emptyFilter = canvas.getByRole('button', { name: /empty filter/i });
  await userEvent.click(emptyFilter);
  
  // Wait for popover to open
  const popover = await canvas.findByRole('dialog');
  expect(popover).toBeInTheDocument();
  
  // Verify "No results found" message is shown
  expect(within(popover).getByText('No results found.')).toBeInTheDocument();
  
  // Close popover
  await userEvent.click(canvas.getByText('Filter Components Edge Cases Test'));
  
  // Verify no selection is possible
  expect(canvas.getByTestId('empty-selected')).toHaveTextContent('Selected: None');
};

const testSingleOptionFilter = async ({ canvas }: StoryContext) => {
  // Test filter with only one option
  const singleFilter = canvas.getByRole('button', { name: /single filter/i });
  await userEvent.click(singleFilter);
  
  const popover = await canvas.findByRole('dialog');
  
  // Verify only one option is available
  const onlyOption = within(popover).getByText('Only Option');
  expect(onlyOption).toBeInTheDocument();
  
  // Select the only option
  await userEvent.click(onlyOption);
  
  // Close popover
  await userEvent.click(canvas.getByText('Filter Components Edge Cases Test'));
  
  // Verify selection
  expect(canvas.getByTestId('single-selected')).toHaveTextContent('Selected: only');
  expect(singleFilter).toHaveTextContent('Only Option');
};

const testManyOptionsFilter = async ({ canvas }: StoryContext) => {
  // Test filter with many options (performance and scrolling)
  const manyFilter = canvas.getByRole('button', { name: /many options/i });
  await userEvent.click(manyFilter);
  
  const popover = await canvas.findByRole('dialog');
  
  // Verify multiple options are available
  expect(within(popover).getByText('Option 1')).toBeInTheDocument();
  expect(within(popover).getByText('Option 20')).toBeInTheDocument();
  
  // Select multiple options
  const option1 = within(popover).getByText('Option 1');
  const option5 = within(popover).getByText('Option 5');
  const option10 = within(popover).getByText('Option 10');
  
  await userEvent.click(option1);
  await userEvent.click(option5);
  await userEvent.click(option10);
  
  // Close popover
  await userEvent.click(canvas.getByText('Filter Components Edge Cases Test'));
  
  // Verify multiple selections
  expect(canvas.getByTestId('many-selected')).toHaveTextContent('Selected: 3 items');
  expect(manyFilter).toHaveTextContent('3 selected');
};

const testSpecialCharactersFilter = async ({ canvas }: StoryContext) => {
  // Test filter with special characters in options
  const specialFilter = canvas.getByRole('button', { name: /special chars/i });
  await userEvent.click(specialFilter);
  
  const popover = await canvas.findByRole('dialog');
  
  // Verify special character options are rendered correctly
  expect(within(popover).getByText('Option with "quotes"')).toBeInTheDocument();
  expect(within(popover).getByText('Option with <tags>')).toBeInTheDocument();
  expect(within(popover).getByText('Option with & ampersand')).toBeInTheDocument();
  expect(within(popover).getByText('Option with émojis 🚀')).toBeInTheDocument();
  
  // Select option with quotes
  const quotesOption = within(popover).getByText('Option with "quotes"');
  await userEvent.click(quotesOption);
  
  // Close popover
  await userEvent.click(canvas.getByText('Filter Components Edge Cases Test'));
  
  // Verify selection with special characters
  expect(canvas.getByTestId('special-selected')).toHaveTextContent('Selected: quotes');
  expect(specialFilter).toHaveTextContent('Option with "quotes"');
};

const testPreselectedValues = async ({ canvas }: StoryContext) => {
  // Test filter with pre-selected values
  const preselectedFilter = canvas.getByRole('button', { name: /pre-selected/i });
  
  // Verify initial state shows pre-selected value
  expect(preselectedFilter).toHaveTextContent('Option 1');
  expect(canvas.getByTestId('preselected-selected')).toHaveTextContent('Selected: option-1');
  
  // Open filter to modify selection
  await userEvent.click(preselectedFilter);
  
  const popover = await canvas.findByRole('dialog');
  
  // Add another selection
  const option2 = within(popover).getByText('Option 2');
  await userEvent.click(option2);
  
  // Close popover
  await userEvent.click(canvas.getByText('Filter Components Edge Cases Test'));
  
  // Verify multiple selections
  expect(preselectedFilter).toHaveTextContent('2 selected');
};

const testFilterSearch = async ({ canvas }: StoryContext) => {
  // Test search functionality with many options
  const manyFilter = canvas.getByRole('button', { name: /many options/i });
  await userEvent.click(manyFilter);
  
  const popover = await canvas.findByRole('dialog');
  
  // Use search to filter options
  const searchInput = within(popover).getByPlaceholderText('Many Options');
  await userEvent.type(searchInput, '1');
  
  // Verify filtered results (should show Option 1, Option 10, Option 11, etc.)
  expect(within(popover).getByText('Option 1')).toBeInTheDocument();
  expect(within(popover).getByText('Option 10')).toBeInTheDocument();
  expect(within(popover).queryByText('Option 2')).not.toBeInTheDocument();
  
  // Clear search
  await userEvent.clear(searchInput);
  
  // Verify all options are visible again
  expect(within(popover).getByText('Option 2')).toBeInTheDocument();
  
  // Close popover
  await userEvent.click(canvas.getByText('Filter Components Edge Cases Test'));
};

const testFilterClearWithManySelections = async ({ canvas }: StoryContext) => {
  // First, select many options
  const manyFilter = canvas.getByRole('button', { name: /many options/i });
  await userEvent.click(manyFilter);
  
  const popover = await canvas.findByRole('dialog');
  
  // Select multiple options
  for (let i = 1; i <= 5; i++) {
    const option = within(popover).getByText(`Option ${i}`);
    await userEvent.click(option);
  }
  
  // Verify selections
  expect(manyFilter).toHaveTextContent('5 selected');
  
  // Clear all selections
  const clearButton = within(popover).getByText('Clear filters');
  await userEvent.click(clearButton);
  
  // Close popover
  await userEvent.click(canvas.getByText('Filter Components Edge Cases Test'));
  
  // Verify all selections are cleared
  expect(canvas.getByTestId('many-selected')).toHaveTextContent('Selected: 0 items');
  expect(manyFilter).not.toHaveTextContent('selected');
};

const testResetAllFilters = async ({ canvas }: StoryContext) => {
  // Reset all filters using the reset button
  const resetButton = canvas.getByTestId('reset-all');
  await userEvent.click(resetButton);
  
  // Verify all filters are reset
  expect(canvas.getByTestId('empty-selected')).toHaveTextContent('Selected: None');
  expect(canvas.getByTestId('single-selected')).toHaveTextContent('Selected: None');
  expect(canvas.getByTestId('many-selected')).toHaveTextContent('Selected: 0 items');
  expect(canvas.getByTestId('special-selected')).toHaveTextContent('Selected: None');
  expect(canvas.getByTestId('preselected-selected')).toHaveTextContent('Selected: None');
};

const testLongOptionNameHandling = async ({ canvas }: StoryContext) => {
  // Test how long option names are handled
  const specialFilter = canvas.getByRole('button', { name: /special chars/i });
  await userEvent.click(specialFilter);
  
  const popover = await canvas.findByRole('dialog');
  
  // Find and select the very long option
  const longOption = within(popover).getByText(/Very long option name that might overflow/);
  expect(longOption).toBeInTheDocument();
  
  await userEvent.click(longOption);
  
  // Close popover
  await userEvent.click(canvas.getByText('Filter Components Edge Cases Test'));
  
  // Verify the long option is selected and displayed appropriately
  expect(canvas.getByTestId('special-selected')).toHaveTextContent('Selected: long');
  
  // The button should handle long text gracefully (might be truncated)
  expect(specialFilter).toBeInTheDocument();
};

export const ComprehensiveEdgeCaseTests: Story = {
  render: () => <FilterEdgeCasesTestWrapper />,
  parameters: {
    docs: {
      description: {
        story: 'Comprehensive edge case testing for filter components including empty options, special characters, performance scenarios, and error states.',
      },
    },
  },
  play: async (storyContext) => {
    // Run all edge case tests in sequence
    await testEmptyOptionsFilter(storyContext);
    await testSingleOptionFilter(storyContext);
    await testManyOptionsFilter(storyContext);
    await testSpecialCharactersFilter(storyContext);
    await testPreselectedValues(storyContext);
    await testFilterSearch(storyContext);
    await testFilterClearWithManySelections(storyContext);
    await testLongOptionNameHandling(storyContext);
    await testResetAllFilters(storyContext);
  },
};

// Individual test stories for focused testing
export const EmptyOptions: Story = {
  render: () => <FilterEdgeCasesTestWrapper />,
  play: testEmptyOptionsFilter,
};

export const SingleOption: Story = {
  render: () => <FilterEdgeCasesTestWrapper />,
  play: testSingleOptionFilter,
};

export const ManyOptions: Story = {
  render: () => <FilterEdgeCasesTestWrapper />,
  play: testManyOptionsFilter,
};

export const SpecialCharacters: Story = {
  render: () => <FilterEdgeCasesTestWrapper />,
  play: testSpecialCharactersFilter,
};

export const PreselectedValues: Story = {
  render: () => <FilterEdgeCasesTestWrapper />,
  play: testPreselectedValues,
};

export const SearchFunctionality: Story = {
  render: () => <FilterEdgeCasesTestWrapper />,
  play: testFilterSearch,
};

export const ClearManySelections: Story = {
  render: () => <FilterEdgeCasesTestWrapper />,
  play: testFilterClearWithManySelections,
};

export const LongOptionNames: Story = {
  render: () => <FilterEdgeCasesTestWrapper />,
  play: testLongOptionNameHandling,
};

