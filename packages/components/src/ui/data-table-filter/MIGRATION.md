# Migration Guide: Bazza UI Data Table Filters

This guide helps you migrate from existing data table filtering implementations to the new Bazza UI Data Table Filter components.

## Overview

The Bazza UI Data Table Filter system provides a modern, Linear-inspired filtering experience with:

- **Unified Filter Interface**: Single component for all filter types
- **URL State Synchronization**: Filter state persists across page refreshes
- **Faceted Filtering**: Dynamic option counts based on current filters
- **Client & Server-Side Support**: Flexible filtering strategies
- **Accessibility**: Full WCAG 2.1 AA compliance
- **TypeScript**: Complete type safety with excellent IntelliSense

## Migration Scenarios

### Scenario 1: From DataTableRouterForm Filters

If you're currently using the `DataTableRouterForm` with custom filter implementations:

#### Before (Legacy Implementation)

```typescript
// Legacy approach with DataTableRouterForm
import { DataTableRouterForm } from '@lambdacurry/forms/remix-hook-form/data-table-router-form';

const columns: ColumnDef<TaskData>[] = [
  {
    accessorKey: 'status',
    header: 'Status',
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'assignee',
    header: 'Assignee',
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
];

// Custom filter UI components
const StatusFilter = ({ column }) => {
  // Custom filter implementation
};

const AssigneeFilter = ({ column }) => {
  // Custom filter implementation
};
```

#### After (Bazza UI Implementation)

```typescript
// New approach with Bazza UI filters
import { DataTableFilter } from '@lambdacurry/forms/ui/data-table-filter';
import { useDataTableFilters } from '@lambdacurry/forms/ui/data-table-filter/hooks/use-data-table-filters';
import { createColumnConfigHelper } from '@lambdacurry/forms/ui/data-table-filter/core/filters';
import { useFilterSync } from '@lambdacurry/forms/ui/utils/use-filter-sync';

// 1. Define column configurations using the fluent API
const dtf = createColumnConfigHelper<TaskData>();

const columnConfigs = [
  dtf
    .option()
    .id('status')
    .accessor((row) => row.status)
    .displayName('Status')
    .icon(CheckCircledIcon)
    .options([
      { value: 'todo', label: 'Todo' },
      { value: 'in-progress', label: 'In Progress' },
      { value: 'done', label: 'Done' },
    ])
    .build(),
  dtf
    .option()
    .id('assignee')
    .accessor((row) => row.assignee)
    .displayName('Assignee')
    .icon(PersonIcon)
    .options([
      { value: 'alice', label: 'Alice' },
      { value: 'bob', label: 'Bob' },
      { value: 'charlie', label: 'Charlie' },
    ])
    .build(),
];

// 2. Use the filter hooks
const MyDataTable = () => {
  const [filters, setFilters] = useFilterSync(); // URL synchronization

  const {
    columns: filterColumns,
    actions,
    strategy,
    data: filteredData, // For client-side filtering
  } = useDataTableFilters({
    columnsConfig: columnConfigs,
    filters,
    onFiltersChange: setFilters,
    strategy: 'client', // or 'server'
    data: yourData,
  });

  // 3. Render the filter interface
  return (
    <div>
      <DataTableFilter 
        columns={filterColumns} 
        filters={filters} 
        actions={actions} 
        strategy={strategy} 
      />
      <DataTable table={table} columns={tableColumns.length} />
    </div>
  );
};
```

### Scenario 2: From Custom Filter Components

If you have custom filter components:

#### Before (Custom Components)

```typescript
// Custom filter components
const CustomTextFilter = ({ value, onChange }) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search..."
    />
  );
};

const CustomSelectFilter = ({ options, value, onChange }) => {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
```

#### After (Bazza UI)

```typescript
// No custom components needed! Use the column configuration
const columnConfigs = [
  dtf
    .text()
    .id('title')
    .accessor((row) => row.title)
    .displayName('Title')
    .icon(TextIcon)
    .build(), // Automatically provides text search

  dtf
    .option()
    .id('category')
    .accessor((row) => row.category)
    .displayName('Category')
    .icon(TagIcon)
    .options(categoryOptions)
    .build(), // Automatically provides select interface
];
```

### Scenario 3: From Manual URL State Management

If you're manually managing filter state in URLs:

#### Before (Manual URL Management)

```typescript
const [filters, setFilters] = useState([]);

// Manual URL synchronization
useEffect(() => {
  const params = new URLSearchParams(location.search);
  const filtersParam = params.get('filters');
  if (filtersParam) {
    try {
      setFilters(JSON.parse(filtersParam));
    } catch (error) {
      console.error('Invalid filters in URL');
    }
  }
}, [location.search]);

const updateFilters = (newFilters) => {
  setFilters(newFilters);
  const params = new URLSearchParams(location.search);
  if (newFilters.length > 0) {
    params.set('filters', JSON.stringify(newFilters));
  } else {
    params.delete('filters');
  }
  navigate(`${location.pathname}?${params.toString()}`, { replace: true });
};
```

#### After (Automatic URL Sync)

```typescript
// Automatic URL synchronization
const [filters, setFilters] = useFilterSync(); // That's it!
```

## Step-by-Step Migration Process

### Step 1: Install Dependencies

Ensure you have the latest version of `@lambdacurry/forms`:

```bash
npm install @lambdacurry/forms@latest
```

### Step 2: Update Imports

Replace your existing filter imports:

```typescript
// Remove old imports
// import { DataTableRouterForm } from '@lambdacurry/forms/remix-hook-form/data-table-router-form';

// Add new imports
import { DataTableFilter } from '@lambdacurry/forms/ui/data-table-filter';
import { useDataTableFilters } from '@lambdacurry/forms/ui/data-table-filter/hooks/use-data-table-filters';
import { createColumnConfigHelper } from '@lambdacurry/forms/ui/data-table-filter/core/filters';
import { useFilterSync } from '@lambdacurry/forms/ui/utils/use-filter-sync';
```

### Step 3: Define Column Configurations

Create column configurations using the fluent API:

```typescript
interface YourDataType {
  // Define your data interface
}

const dtf = createColumnConfigHelper<YourDataType>();

const columnConfigs = [
  // Text columns
  dtf
    .text()
    .id('searchableField')
    .accessor((row) => row.searchableField)
    .displayName('Searchable Field')
    .icon(TextIcon)
    .build(),

  // Option columns (single select)
  dtf
    .option()
    .id('statusField')
    .accessor((row) => row.statusField)
    .displayName('Status')
    .icon(CheckIcon)
    .options([
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
    ])
    .build(),

  // Number columns
  dtf
    .number()
    .id('numericField')
    .accessor((row) => row.numericField)
    .displayName('Numeric Field')
    .icon(HashIcon)
    .build(),

  // Date columns
  dtf
    .date()
    .id('dateField')
    .accessor((row) => row.dateField)
    .displayName('Date Field')
    .icon(CalendarIcon)
    .build(),
];
```

### Step 4: Update Component Implementation

Replace your existing filter implementation:

```typescript
const YourDataTableComponent = () => {
  // 1. Set up filter state with URL synchronization
  const [filters, setFilters] = useFilterSync();

  // 2. Configure the filter system
  const {
    columns: filterColumns,
    actions,
    strategy,
    data: filteredData, // Only for client-side filtering
  } = useDataTableFilters({
    columnsConfig: columnConfigs,
    filters,
    onFiltersChange: setFilters,
    strategy: 'client', // or 'server' for server-side filtering
    data: yourRawData, // Your original data
    faceted: facetedCounts, // Optional: for faceted filtering
  });

  // 3. Set up your table (existing TanStack Table setup)
  const table = useReactTable({
    data: strategy === 'client' ? filteredData : yourServerFilteredData,
    columns: yourTableColumns,
    // ... other table configuration
  });

  // 4. Render the filter interface and table
  return (
    <div>
      <DataTableFilter 
        columns={filterColumns} 
        filters={filters} 
        actions={actions} 
        strategy={strategy} 
      />
      <DataTable table={table} columns={yourTableColumns.length} />
    </div>
  );
};
```

### Step 5: Handle Server-Side Filtering (Optional)

If you need server-side filtering:

```typescript
// In your loader function (React Router) or API endpoint
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const filtersParam = url.searchParams.get('filters');
  
  let filters = [];
  if (filtersParam) {
    try {
      filters = JSON.parse(filtersParam);
    } catch (error) {
      console.error('Invalid filters:', error);
    }
  }

  // Apply filters to your data query
  const filteredData = await applyFiltersToQuery(filters);
  
  return {
    data: filteredData,
    facetedCounts: await calculateFacetedCounts(filters),
  };
};

// In your component
const { data, facetedCounts } = useLoaderData<typeof loader>();

const {
  columns: filterColumns,
  actions,
  strategy,
} = useDataTableFilters({
  columnsConfig: columnConfigs,
  filters,
  onFiltersChange: setFilters,
  strategy: 'server',
  data, // Server-filtered data
  faceted: facetedCounts,
});
```

## Breaking Changes

### Removed Features

1. **DataTableRouterForm**: Replaced with `DataTableFilter` + `useDataTableFilters`
2. **Custom filterFn**: Replaced with column configuration
3. **Manual URL management**: Replaced with `useFilterSync`

### Changed APIs

1. **Filter State Format**: New filter state structure (see types)
2. **Column Definition**: New fluent API for column configuration
3. **Event Handlers**: New action-based API

## Common Migration Issues

### Issue 1: TypeScript Errors

**Problem**: TypeScript errors with new types

**Solution**: Update your data interface and use the column config helper:

```typescript
// Ensure your data interface is properly typed
interface MyData {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}

// Use the typed helper
const dtf = createColumnConfigHelper<MyData>();
```

### Issue 2: Filter State Not Persisting

**Problem**: Filters reset on page refresh

**Solution**: Ensure you're using `useFilterSync`:

```typescript
// Wrong
const [filters, setFilters] = useState([]);

// Correct
const [filters, setFilters] = useFilterSync();
```

### Issue 3: Faceted Counts Not Working

**Problem**: Option counts not showing

**Solution**: Provide faceted counts to the hook:

```typescript
const facetedCounts = useMemo(() => {
  // Calculate counts for each option
  const counts = {};
  // ... calculation logic
  return counts;
}, [data, filters]);

const { ... } = useDataTableFilters({
  // ... other props
  faceted: facetedCounts,
});
```

## Performance Considerations

### Client-Side vs Server-Side

- **Client-Side**: Best for datasets < 10,000 rows
- **Server-Side**: Required for larger datasets

### Optimization Tips

1. **Memoize column configs**: Use `useMemo` for column configurations
2. **Debounce text filters**: Built-in debouncing for text inputs
3. **Lazy load options**: Use async option loading for large option sets

## Testing Your Migration

### Checklist

- [ ] All filter types work correctly
- [ ] URL state synchronization works
- [ ] Filter state persists on page refresh
- [ ] Faceted counts update correctly
- [ ] Accessibility features work (keyboard navigation, screen readers)
- [ ] Performance is acceptable for your dataset size
- [ ] TypeScript compilation succeeds without errors

### Test Cases

1. **Basic Filtering**: Apply each filter type individually
2. **Multiple Filters**: Apply multiple filters simultaneously
3. **URL Persistence**: Refresh page with active filters
4. **Clear Filters**: Remove individual and all filters
5. **Faceted Filtering**: Verify option counts update correctly

## Getting Help

If you encounter issues during migration:

1. **Check the Examples**: Review the Storybook stories for complete examples
2. **TypeScript Errors**: Ensure your data interfaces are properly typed
3. **Performance Issues**: Consider switching to server-side filtering
4. **Accessibility**: Test with keyboard navigation and screen readers

## Example: Complete Migration

Here's a complete before/after example:

### Before

```typescript
// Legacy implementation
const TaskTable = () => {
  const [filters, setFilters] = useState({});
  
  const filteredData = useMemo(() => {
    return data.filter(item => {
      if (filters.status && !filters.status.includes(item.status)) {
        return false;
      }
      if (filters.assignee && !filters.assignee.includes(item.assignee)) {
        return false;
      }
      return true;
    });
  }, [data, filters]);

  return (
    <div>
      <div className="filters">
        <StatusFilter value={filters.status} onChange={(value) => setFilters(prev => ({ ...prev, status: value }))} />
        <AssigneeFilter value={filters.assignee} onChange={(value) => setFilters(prev => ({ ...prev, assignee: value }))} />
      </div>
      <DataTable data={filteredData} columns={columns} />
    </div>
  );
};
```

### After

```typescript
// New Bazza UI implementation
const TaskTable = () => {
  const [filters, setFilters] = useFilterSync();

  const {
    columns: filterColumns,
    actions,
    strategy,
    data: filteredData,
  } = useDataTableFilters({
    columnsConfig: columnConfigs,
    filters,
    onFiltersChange: setFilters,
    strategy: 'client',
    data,
  });

  const table = useReactTable({
    data: filteredData,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <DataTableFilter 
        columns={filterColumns} 
        filters={filters} 
        actions={actions} 
        strategy={strategy} 
      />
      <DataTable table={table} columns={tableColumns.length} />
    </div>
  );
};
```

The new implementation provides:
- ✅ Automatic URL synchronization
- ✅ Consistent filter UI
- ✅ Better TypeScript support
- ✅ Accessibility features
- ✅ Faceted filtering support
- ✅ Less boilerplate code

