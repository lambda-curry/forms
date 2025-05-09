# Data Table Filter Component

This component provides a powerful filtering system for data tables, with support for various filter types, URL synchronization, and real-time data updates.

## Features

- **Filter Types**: Support for text, option, multi-option, number, and date filters
- **URL Synchronization**: Filters are synchronized with URL query parameters for shareable and bookmarkable filter states
- **Real-time Data Updates**: Data is updated in real-time as filters change
- **Faceted Counts**: Display counts for each filter option based on the current data
- **Responsive Design**: Works on both desktop and mobile devices

## Usage

### Basic Usage with `useFilteredData` Hook (Recommended)

The easiest way to use the data table filter is with the `useFilteredData` hook, which handles all the complexity for you:

```tsx
import { useFilteredData } from '@lambdacurry/forms/ui/utils/use-filtered-data';
import { DataTableFilter } from '@lambdacurry/forms/ui/data-table-filter/components/data-table-filter';

function MyDataTable() {
  // Define your column configurations
  const columnsConfig = [
    {
      id: 'status',
      type: 'option',
      displayName: 'Status',
      accessor: (item) => item.status,
      icon: () => null,
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
      ],
    },
    // Add more columns as needed
  ];

  // Use the hook to handle everything
  const {
    filters,
    columns,
    actions,
    data,
    isLoading,
  } = useFilteredData({
    endpoint: '/api/items', // Your API endpoint
    columnsConfig,
    initialData: [], // Optional initial data
  });

  return (
    <div>
      {/* Render the filter component */}
      <DataTableFilter
        columns={columns}
        filters={filters}
        actions={actions}
        strategy="client"
      />

      {/* Render your data table with the filtered data */}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <table>
          {/* Your table implementation */}
        </table>
      )}
    </div>
  );
}
```

### Advanced Usage with Manual Setup

If you need more control, you can set up the filters manually:

```tsx
import { useFilterSync } from '@lambdacurry/forms/ui/utils/use-filter-sync';
import { useDataQuery } from '@lambdacurry/forms/ui/utils/use-issues-query';
import { createColumns } from '@lambdacurry/forms/ui/data-table-filter/core/filters';
import { DataTableFilter } from '@lambdacurry/forms/ui/data-table-filter/components/data-table-filter';

function MyDataTable() {
  // Sync filters with URL
  const [filters, setFilters] = useFilterSync();
  
  // Fetch data with filters
  const { data, isLoading } = useDataQuery('/api/items', filters);
  
  // Define column configurations
  const columnsConfig = [/* your column configs */];
  
  // Create columns with faceted counts
  const columns = useMemo(() => {
    if (!data) return createColumns([], columnsConfig, 'client');
    
    // Apply faceted counts from the API
    const enhancedConfig = columnsConfig.map(config => {
      if (config.type === 'option' && data.facetedCounts?.[config.id]) {
        return {
          ...config,
          facetedOptions: new Map(
            Object.entries(data.facetedCounts[config.id])
              .map(([key, count]) => [key, count])
          )
        };
      }
      return config;
    });
    
    return createColumns(data.data || [], enhancedConfig, 'client');
  }, [data, columnsConfig]);
  
  // Create filter actions
  const actions = useMemo(() => {
    return {
      addFilterValue: (column, values) => {
        // Implementation
      },
      removeFilterValue: (column, values) => {
        // Implementation
      },
      setFilterValue: (column, values) => {
        // Implementation
      },
      setFilterOperator: (columnId, operator) => {
        // Implementation
      },
      removeFilter: (columnId) => {
        // Implementation
      },
      removeAllFilters: () => {
        // Implementation
      }
    };
  }, [setFilters]);

  return (
    <div>
      <DataTableFilter
        columns={columns}
        filters={filters}
        actions={actions}
        strategy="client"
      />
      
      {/* Your table implementation */}
    </div>
  );
}
```

## API Reference

### `DataTableFilter` Component

```tsx
<DataTableFilter
  columns={columns}
  filters={filters}
  actions={actions}
  strategy="client"
  locale="en"
/>
```

#### Props

- `columns`: Array of column definitions with filter options
- `filters`: Current filter state
- `actions`: Object containing filter action functions
- `strategy`: Filter strategy, either "client" or "server"
- `locale`: Optional locale for internationalization (default: "en")

### `useFilteredData` Hook

```tsx
const {
  filters,
  setFilters,
  columns,
  actions,
  data,
  facetedCounts,
  isLoading,
  isError,
  error,
  refetch,
} = useFilteredData({
  endpoint,
  columnsConfig,
  strategy,
  initialData,
  queryOptions,
});
```

#### Parameters

- `endpoint`: API endpoint to fetch data from
- `columnsConfig`: Array of column configurations
- `strategy`: Filter strategy, either "client" or "server" (default: "client")
- `initialData`: Optional initial data to use before API data is loaded
- `queryOptions`: Additional options for the query

#### Returns

- `filters`: Current filter state
- `setFilters`: Function to update filters
- `columns`: Columns with faceted counts
- `actions`: Filter action functions
- `data`: Filtered data
- `facetedCounts`: Counts for each filter option
- `isLoading`: Whether data is currently loading
- `isError`: Whether an error occurred
- `error`: Error object if an error occurred
- `refetch`: Function to manually refetch data

## Server-Side Implementation

For the filters to work correctly with faceted counts, your API should return data in the following format:

```json
{
  "data": [
    // Your data items
  ],
  "facetedCounts": {
    "status": {
      "active": 10,
      "inactive": 5
    },
    "category": {
      "electronics": 7,
      "clothing": 8
    }
  }
}
```

The `facetedCounts` object should contain counts for each filter option, organized by column ID.

## Examples

See the `examples` directory for complete working examples:

- `data-table-filter-example.tsx`: Comprehensive example with API integration
- `simplified-example.tsx`: Simplified example using the `useFilteredData` hook

