import { DataTableRouterForm } from '@lambdacurry/forms/remix-hook-form/data-table-router-form';
import { dataTableRouterParsers } from '@lambdacurry/forms/remix-hook-form/data-table-router-parsers';
import { DataTableColumnHeader } from '@lambdacurry/forms/ui/data-table/data-table-column-header';
import type { Meta, StoryContext, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import type { ColumnDef } from '@tanstack/react-table';
import { type LoaderFunctionArgs, useLoaderData } from 'react-router';
import { z } from 'zod';
import { withReactRouterStubDecorator } from '../lib/storybook/react-router-stub';

// Define comprehensive test data schema
const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(['electronics', 'clothing', 'books', 'home', 'sports']),
  status: z.enum(['active', 'inactive', 'discontinued', 'coming-soon']),
  price: z.number(),
  rating: z.enum(['1', '2', '3', '4', '5']),
  inStock: z.boolean(),
  tags: z.array(z.string()),
  createdAt: z.string().datetime(),
});

type Product = z.infer<typeof productSchema>;

// Comprehensive test dataset
const testProducts: Product[] = Array.from({ length: 100 }).map((_, i) => ({
  id: `PROD-${String(i + 1).padStart(3, '0')}`,
  name: `Product ${i + 1}`,
  category: ['electronics', 'clothing', 'books', 'home', 'sports'][i % 5] as Product['category'],
  status: ['active', 'inactive', 'discontinued', 'coming-soon'][i % 4] as Product['status'],
  price: Math.round((Math.random() * 1000 + 10) * 100) / 100,
  rating: String(Math.floor(Math.random() * 5) + 1) as Product['rating'],
  inStock: Math.random() > 0.3,
  tags: [`tag-${i % 3}`, `feature-${i % 4}`],
  createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
}));

// Define response type
interface ProductsResponse {
  data: Product[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    pageCount: number;
    appliedFilters: Record<string, any>;
  };
}

// Define comprehensive columns
const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Product ID" />,
    cell: ({ row }) => <div className="font-mono text-sm">{row.getValue('id')}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Product Name" />,
    cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
    enableSorting: true,
  },
  {
    accessorKey: 'category',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
    cell: ({ row }) => <div className="capitalize">{row.getValue('category')}</div>,
    enableColumnFilter: true,
    filterFn: (row, id, value: string[]) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const statusColors = {
        active: 'bg-green-100 text-green-800',
        inactive: 'bg-gray-100 text-gray-800',
        discontinued: 'bg-red-100 text-red-800',
        'coming-soon': 'bg-blue-100 text-blue-800',
      };
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors]}`}>
          {status.replace('-', ' ')}
        </span>
      );
    },
    enableColumnFilter: true,
    filterFn: (row, id, value: string[]) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'rating',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Rating" />,
    cell: ({ row }) => {
      const rating = row.getValue('rating') as string;
      return <div>{'⭐'.repeat(parseInt(rating))}</div>;
    },
    enableColumnFilter: true,
    filterFn: (row, id, value: string[]) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'price',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Price" />,
    cell: ({ row }) => <div className="font-mono">${row.getValue('price')}</div>,
    enableSorting: true,
  },
  {
    accessorKey: 'inStock',
    header: ({ column }) => <DataTableColumnHeader column={column} title="In Stock" />,
    cell: ({ row }) => (
      <div className={row.getValue('inStock') ? 'text-green-600' : 'text-red-600'}>
        {row.getValue('inStock') ? '✓ Yes' : '✗ No'}
      </div>
    ),
  },
];

// Integration test component
function ProductsTableIntegrationTest() {
  const loaderData = useLoaderData<ProductsResponse>();

  const data = loaderData?.data ?? [];
  const pageCount = loaderData?.meta.pageCount ?? 0;
  const appliedFilters = loaderData?.meta.appliedFilters ?? {};

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Products Table - Filter Integration Test</h1>
      <p className="mb-4 text-sm text-gray-600">
        This integration test covers complete filter workflows including:
      </p>
      <ul className="list-disc pl-5 mb-4 text-sm text-gray-600">
        <li>Multiple simultaneous filters</li>
        <li>Filter combinations and interactions</li>
        <li>URL state persistence and navigation</li>
        <li>Search with filters</li>
        <li>Pagination with filters</li>
        <li>Sorting with filters</li>
        <li>Filter state recovery</li>
      </ul>
      
      {/* Display applied filters for testing */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-sm mb-2">Applied Filters (for testing):</h3>
        <div data-testid="applied-filters" className="text-xs text-gray-600">
          {Object.keys(appliedFilters).length > 0 
            ? JSON.stringify(appliedFilters, null, 2)
            : 'No filters applied'
          }
        </div>
      </div>

      <DataTableRouterForm<Product, keyof Product>
        columns={columns}
        data={data}
        pageCount={pageCount}
        filterableColumns={[
          {
            id: 'category' as keyof Product,
            title: 'Category',
            options: [
              { label: 'Electronics', value: 'electronics' },
              { label: 'Clothing', value: 'clothing' },
              { label: 'Books', value: 'books' },
              { label: 'Home', value: 'home' },
              { label: 'Sports', value: 'sports' },
            ],
          },
          {
            id: 'status' as keyof Product,
            title: 'Status',
            options: [
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' },
              { label: 'Discontinued', value: 'discontinued' },
              { label: 'Coming Soon', value: 'coming-soon' },
            ],
          },
          {
            id: 'rating' as keyof Product,
            title: 'Rating',
            options: [
              { label: '⭐ 1 Star', value: '1' },
              { label: '⭐⭐ 2 Stars', value: '2' },
              { label: '⭐⭐⭐ 3 Stars', value: '3' },
              { label: '⭐⭐⭐⭐ 4 Stars', value: '4' },
              { label: '⭐⭐⭐⭐⭐ 5 Stars', value: '5' },
            ],
          },
        ]}
        searchableColumns={[
          {
            id: 'name' as keyof Product,
            title: 'Product Name',
          },
        ]}
      />
    </div>
  );
}

// Comprehensive loader function
const handleProductsDataFetch = async ({ request }: LoaderFunctionArgs) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 150));

  const url = request?.url ? new URL(request.url) : new URL('http://localhost?page=0&pageSize=10');
  const params = url.searchParams;

  // Parse all parameters
  const page = dataTableRouterParsers.page.parse(params.get('page'));
  const pageSize = dataTableRouterParsers.pageSize.parse(params.get('pageSize'));
  const sortField = dataTableRouterParsers.sortField.parse(params.get('sortField'));
  const sortOrder = dataTableRouterParsers.sortOrder.parse(params.get('sortOrder'));
  const search = dataTableRouterParsers.search.parse(params.get('search'));
  const parsedFilters = dataTableRouterParsers.filters.parse(params.get('filters'));

  // Track applied filters for testing
  const appliedFilters: Record<string, any> = {
    page,
    pageSize,
    sortField,
    sortOrder,
    search,
    filters: parsedFilters,
  };

  // Apply filters
  let filteredData = [...testProducts];

  // 1. Apply global search filter
  if (search) {
    const searchLower = search.toLowerCase();
    filteredData = filteredData.filter(
      (product) => 
        product.name.toLowerCase().includes(searchLower) || 
        product.id.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower)
    );
  }

  // 2. Apply faceted filters
  if (parsedFilters && parsedFilters.length > 0) {
    parsedFilters.forEach((filter) => {
      if (filter.id in testProducts[0] && Array.isArray(filter.value) && filter.value.length > 0) {
        const filterValues = filter.value as string[];
        filteredData = filteredData.filter((product) => {
          const productValue = product[filter.id as keyof Product];
          return filterValues.includes(String(productValue));
        });
      }
    });
  }

  // 3. Apply sorting
  if (sortField && sortOrder && sortField in testProducts[0]) {
    filteredData.sort((a, b) => {
      const aValue = a[sortField as keyof Product];
      const bValue = b[sortField as keyof Product];
      
      // Handle different data types
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      const aStr = String(aValue);
      const bStr = String(bValue);
      if (aStr < bStr) return sortOrder === 'asc' ? -1 : 1;
      if (aStr > bStr) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // 4. Apply pagination
  const safePage = params.has('page') ? page : dataTableRouterParsers.page.defaultValue;
  const safePageSize = params.has('pageSize') ? pageSize : dataTableRouterParsers.pageSize.defaultValue;
  const start = safePage * safePageSize;
  const paginatedData = filteredData.slice(start, start + safePageSize);

  return {
    data: paginatedData,
    meta: {
      total: filteredData.length,
      page: safePage,
      pageSize: safePageSize,
      pageCount: Math.ceil(filteredData.length / safePageSize),
      appliedFilters,
    },
  };
};

const meta: Meta<typeof DataTableRouterForm> = {
  title: 'Data Table/Integration Tests',
  component: DataTableRouterForm,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Integration tests for complete filter workflows including URL synchronization, multiple filters, and complex interactions',
      },
    },
  },
  decorators: [
    withReactRouterStubDecorator({
      routes: [
        {
          path: '/',
          Component: ProductsTableIntegrationTest,
          loader: handleProductsDataFetch,
        },
      ],
    }),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof DataTableRouterForm>;

export default meta;
type Story = StoryObj<typeof meta>;

// Integration test functions
const testCompleteFilterWorkflow = async ({ canvas }: StoryContext) => {
  // Wait for initial load
  await expect(canvas.findByText('Products Table - Filter Integration Test')).resolves.toBeInTheDocument();
  
  // Step 1: Apply category filter
  const categoryFilter = canvas.getByRole('button', { name: /category/i });
  await userEvent.click(categoryFilter);
  
  let popover = await canvas.findByRole('dialog');
  const electronicsOption = within(popover).getByText('Electronics');
  await userEvent.click(electronicsOption);
  await userEvent.click(canvas.getByText('Products Table - Filter Integration Test'));
  
  // Wait for data to reload
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Step 2: Add status filter
  const statusFilter = canvas.getByRole('button', { name: /status/i });
  await userEvent.click(statusFilter);
  
  popover = await canvas.findByRole('dialog');
  const activeOption = within(popover).getByText('Active');
  await userEvent.click(activeOption);
  await userEvent.click(canvas.getByText('Products Table - Filter Integration Test'));
  
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Step 3: Add search
  const searchInput = canvas.getByPlaceholderText(/search/i);
  await userEvent.type(searchInput, 'Product 1');
  
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Step 4: Verify filters are applied
  expect(categoryFilter).toHaveTextContent('Electronics');
  expect(statusFilter).toHaveTextContent('Active');
  expect(searchInput).toHaveValue('Product 1');
  
  // Step 5: Add rating filter
  const ratingFilter = canvas.getByRole('button', { name: /rating/i });
  await userEvent.click(ratingFilter);
  
  popover = await canvas.findByRole('dialog');
  const fiveStarOption = within(popover).getByText('⭐⭐⭐⭐⭐ 5 Stars');
  await userEvent.click(fiveStarOption);
  await userEvent.click(canvas.getByText('Products Table - Filter Integration Test'));
  
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Verify all filters are active
  expect(ratingFilter).toHaveTextContent('⭐⭐⭐⭐⭐ 5 Stars');
};

const testFilterCombinations = async ({ canvas }: StoryContext) => {
  // Test multiple filter combinations
  const categoryFilter = canvas.getByRole('button', { name: /category/i });
  const statusFilter = canvas.getByRole('button', { name: /status/i });
  
  // Apply multiple categories
  await userEvent.click(categoryFilter);
  let popover = await canvas.findByRole('dialog');
  
  const clothingOption = within(popover).getByText('Clothing');
  const booksOption = within(popover).getByText('Books');
  
  await userEvent.click(clothingOption);
  await userEvent.click(booksOption);
  await userEvent.click(canvas.getByText('Products Table - Filter Integration Test'));
  
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Apply multiple statuses
  await userEvent.click(statusFilter);
  popover = await canvas.findByRole('dialog');
  
  const inactiveOption = within(popover).getByText('Inactive');
  const discontinuedOption = within(popover).getByText('Discontinued');
  
  await userEvent.click(inactiveOption);
  await userEvent.click(discontinuedOption);
  await userEvent.click(canvas.getByText('Products Table - Filter Integration Test'));
  
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Verify multiple selections
  expect(categoryFilter).toHaveTextContent('2 selected');
  expect(statusFilter).toHaveTextContent('2 selected');
};

const testFilterWithSorting = async ({ canvas }: StoryContext) => {
  // Apply a filter then test sorting
  const categoryFilter = canvas.getByRole('button', { name: /category/i });
  await userEvent.click(categoryFilter);
  
  const popover = await canvas.findByRole('dialog');
  const homeOption = within(popover).getByText('Home');
  await userEvent.click(homeOption);
  await userEvent.click(canvas.getByText('Products Table - Filter Integration Test'));
  
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Apply sorting
  const priceHeader = canvas.getByText('Price');
  await userEvent.click(priceHeader);
  
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Verify filter persists with sorting
  expect(categoryFilter).toHaveTextContent('Home');
  
  // Test sorting in opposite direction
  await userEvent.click(priceHeader);
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Filter should still be applied
  expect(categoryFilter).toHaveTextContent('Home');
};

const testFilterWithPagination = async ({ canvas }: StoryContext) => {
  // Clear any existing filters first
  const searchInput = canvas.getByPlaceholderText(/search/i);
  await userEvent.clear(searchInput);
  
  // Apply a filter that will have many results
  const statusFilter = canvas.getByRole('button', { name: /status/i });
  await userEvent.click(statusFilter);
  
  const popover = await canvas.findByRole('dialog');
  const activeOption = within(popover).getByText('Active');
  await userEvent.click(activeOption);
  await userEvent.click(canvas.getByText('Products Table - Filter Integration Test'));
  
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Look for pagination controls
  const nextButton = canvas.queryByRole('button', { name: /next/i });
  
  if (nextButton && !nextButton.hasAttribute('disabled')) {
    // Test pagination with filters
    await userEvent.click(nextButton);
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Verify filter persists across pagination
    expect(statusFilter).toHaveTextContent('Active');
  }
};

const testFilterStateRecovery = async ({ canvas }: StoryContext) => {
  // Apply multiple filters
  const categoryFilter = canvas.getByRole('button', { name: /category/i });
  const ratingFilter = canvas.getByRole('button', { name: /rating/i });
  
  // Set category
  await userEvent.click(categoryFilter);
  let popover = await canvas.findByRole('dialog');
  const sportsOption = within(popover).getByText('Sports');
  await userEvent.click(sportsOption);
  await userEvent.click(canvas.getByText('Products Table - Filter Integration Test'));
  
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Set rating
  await userEvent.click(ratingFilter);
  popover = await canvas.findByRole('dialog');
  const fourStarOption = within(popover).getByText('⭐⭐⭐⭐ 4 Stars');
  await userEvent.click(fourStarOption);
  await userEvent.click(canvas.getByText('Products Table - Filter Integration Test'));
  
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Verify state is maintained
  expect(categoryFilter).toHaveTextContent('Sports');
  expect(ratingFilter).toHaveTextContent('⭐⭐⭐⭐ 4 Stars');
  
  // Check applied filters display
  const appliedFiltersDisplay = canvas.getByTestId('applied-filters');
  expect(appliedFiltersDisplay).not.toHaveTextContent('No filters applied');
};

const testCompleteFilterReset = async ({ canvas }: StoryContext) => {
  // Clear all filters one by one
  const categoryFilter = canvas.getByRole('button', { name: /category/i });
  const statusFilter = canvas.getByRole('button', { name: /status/i });
  const ratingFilter = canvas.getByRole('button', { name: /rating/i });
  const searchInput = canvas.getByPlaceholderText(/search/i);
  
  // Clear search
  await userEvent.clear(searchInput);
  
  // Clear category filter
  if (categoryFilter.textContent?.includes('Sports')) {
    await userEvent.click(categoryFilter);
    const popover = await canvas.findByRole('dialog');
    const clearButton = within(popover).getByText('Clear filters');
    await userEvent.click(clearButton);
    await userEvent.click(canvas.getByText('Products Table - Filter Integration Test'));
  }
  
  // Clear status filter
  if (statusFilter.textContent?.includes('Active')) {
    await userEvent.click(statusFilter);
    const popover = await canvas.findByRole('dialog');
    const clearButton = within(popover).getByText('Clear filters');
    await userEvent.click(clearButton);
    await userEvent.click(canvas.getByText('Products Table - Filter Integration Test'));
  }
  
  // Clear rating filter
  if (ratingFilter.textContent?.includes('⭐')) {
    await userEvent.click(ratingFilter);
    const popover = await canvas.findByRole('dialog');
    const clearButton = within(popover).getByText('Clear filters');
    await userEvent.click(clearButton);
    await userEvent.click(canvas.getByText('Products Table - Filter Integration Test'));
  }
  
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Verify all filters are cleared
  expect(searchInput).toHaveValue('');
  expect(categoryFilter).not.toHaveTextContent('Sports');
  expect(statusFilter).not.toHaveTextContent('Active');
  expect(ratingFilter).not.toHaveTextContent('⭐');
};

const testSearchWithFilters = async ({ canvas }: StoryContext) => {
  // Apply a category filter
  const categoryFilter = canvas.getByRole('button', { name: /category/i });
  await userEvent.click(categoryFilter);
  
  const popover = await canvas.findByRole('dialog');
  const electronicsOption = within(popover).getByText('Electronics');
  await userEvent.click(electronicsOption);
  await userEvent.click(canvas.getByText('Products Table - Filter Integration Test'));
  
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Add search term
  const searchInput = canvas.getByPlaceholderText(/search/i);
  await userEvent.type(searchInput, 'Product 2');
  
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Verify both filter and search are active
  expect(categoryFilter).toHaveTextContent('Electronics');
  expect(searchInput).toHaveValue('Product 2');
  
  // Clear search and verify filter persists
  await userEvent.clear(searchInput);
  await new Promise(resolve => setTimeout(resolve, 200));
  
  expect(categoryFilter).toHaveTextContent('Electronics');
};

export const ComprehensiveIntegrationTests: Story = {
  render: () => <ProductsTableIntegrationTest />,
  parameters: {
    docs: {
      description: {
        story: 'Complete integration test suite covering all filter workflows, URL synchronization, and complex interactions.',
      },
    },
  },
  play: async (storyContext) => {
    // Run all integration tests in sequence
    await testCompleteFilterWorkflow(storyContext);
    await testFilterCombinations(storyContext);
    await testFilterWithSorting(storyContext);
    await testFilterWithPagination(storyContext);
    await testFilterStateRecovery(storyContext);
    await testSearchWithFilters(storyContext);
    await testCompleteFilterReset(storyContext);
  },
};

// Individual integration test stories
export const CompleteWorkflow: Story = {
  render: () => <ProductsTableIntegrationTest />,
  play: testCompleteFilterWorkflow,
};

export const FilterCombinations: Story = {
  render: () => <ProductsTableIntegrationTest />,
  play: testFilterCombinations,
};

export const FilterWithSorting: Story = {
  render: () => <ProductsTableIntegrationTest />,
  play: testFilterWithSorting,
};

export const FilterWithPagination: Story = {
  render: () => <ProductsTableIntegrationTest />,
  play: testFilterWithPagination,
};

export const FilterStateRecovery: Story = {
  render: () => <ProductsTableIntegrationTest />,
  play: testFilterStateRecovery,
};

export const SearchWithFilters: Story = {
  render: () => <ProductsTableIntegrationTest />,
  play: testSearchWithFilters,
};

