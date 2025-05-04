# Data Table Filter

This is an enhanced data table filter component for the forms repository, based on the bazza/ui canary branch implementation. It adds client-side filtering with a clean, modern UI inspired by Linear.

## Features

- Complete refactoring with a new API structure
- Internationalization (i18n) support
- Quick Search Filters for option and multiOption columns
- Number Filtering Overhaul with range slider support
- UI improvements and performance enhancements
- Comprehensive filtering capabilities for different data types

## API

The new API structure requires different props:

```tsx
<DataTableFilter
  columns={columns}
  filters={filters}
  actions={{
    onFiltersChange: setFilters
  }}
  locale="en"
  strategy="tanstack-table"
/>
```

### Props

- `columns`: The columns to filter on.
- `filters`: The current filter state.
- `actions`: Actions to perform when filters change.
  - `onFiltersChange`: Callback function to update the filter state.
- `locale`: The locale to use for translations (default: 'en').
- `strategy`: The strategy to use for filtering (default: 'tanstack-table').
- `table`: Optional table instance for backward compatibility.

## Column Configuration

To make a column filterable, you need to:

1. Use the `filterFn` function for filtering.
2. Add the `meta` property using the `defineMeta` helper function.

```tsx
import { defineMeta, filterFn } from '@lambda-curry/components/ui/data-table-filter';

const columns: ColumnDef<YourDataType>[] = [
  {
    accessorKey: 'status',
    header: 'Status',
    filterFn: filterFn('option'),
    meta: defineMeta('status', {
      displayName: 'Status',
      type: 'option',
      icon: CircleDotDashedIcon,
      options: STATUS_OPTIONS,
    }),
  },
  // ... other columns
];
```

### Column Meta Properties

- `displayName`: The display name for the column.
- `icon`: The icon for the column.
- `type`: The data type of the column (text, number, date, option, multiOption).
- `options`: An optional list of options for option and multiOption columns.
- `transformOptionFn`: An optional function to transform column values into options.
- `max`: An optional "soft" maximum value for the range slider when filtering on a number column.

## Supported Column Types

- `text`: Text data with operators like contains, starts with, ends with, etc.
- `number`: Numerical data with operators like equals, greater than, less than, between, etc.
- `date`: Dates with operators like equals, greater than, less than, between, etc.
- `option`: Single-valued option (e.g., status) with operators like equals, not equals, etc.
- `multiOption`: Multi-valued option (e.g., labels) with operators like is any of, is none of, etc.

## Internationalization

The component supports internationalization through the `locale` prop. Currently supported locales:

- English (en)
- Spanish (es)
- French (fr)
- German (de)

You can add more locales by extending the translations object in the `i18n.ts` file.

## Usage Example

```tsx
import * as React from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import {
  DataTableFilter,
  defineMeta,
  filterFn,
  type DataTableFilterState,
} from '@lambda-curry/components/ui/data-table-filter';

// Define your columns with proper metadata
const columns: ColumnDef<YourDataType>[] = [
  // ... your columns
];

export default function YourComponent() {
  const [filters, setFilters] = React.useState<DataTableFilterState>([]);
  
  // Create table instance
  const table = useReactTable({
    // ... your table configuration
    state: {
      columnFilters: filters.map((filter) => ({
        id: filter.id,
        value: filter.value.values,
      })),
    },
    filterFns: {
      text: filterFn('text'),
      number: filterFn('number'),
      date: filterFn('date'),
      option: filterFn('option'),
      multiOption: filterFn('multiOption'),
    },
  });
  
  return (
    <div>
      <DataTableFilter
        columns={columns}
        filters={filters}
        actions={{
          onFiltersChange: setFilters,
        }}
        locale="en"
        strategy="tanstack-table"
      />
      
      {/* Your table component */}
    </div>
  );
}
```

## Migration Guide

If you're migrating from the old DataTableFacetedFilter component, you'll need to:

1. Update your column definitions to include the `meta` property using the `defineMeta` helper.
2. Use the `filterFn` function for filtering.
3. Manage filter state with useState or a state management library.
4. Replace the old DataTableFacetedFilter component with the new DataTableFilter component.

### Old API

```tsx
<DataTableFacetedFilter
  column={tableColumn}
  title={column.title}
  options={column.options}
/>
```

### New API

```tsx
<DataTableFilter
  columns={columns}
  filters={filters}
  actions={{
    onFiltersChange: setFilters
  }}
  locale="en"
  strategy="tanstack-table"
/>
```

