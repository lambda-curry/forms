# Bazza UI Data Table Filter

A comprehensive, accessible, and performant filtering system for data tables, inspired by Linear's filtering interface.

## Features

- 🎛️ **Multiple Filter Types**: Text, option, date, and number filters
- 🔗 **URL State Synchronization**: Filter state persists across page refreshes
- 📊 **Faceted Filtering**: Dynamic option counts based on current filters
- ⚡ **Client & Server-Side**: Flexible filtering strategies for any dataset size
- ♿ **Accessibility**: Full WCAG 2.1 AA compliance with keyboard navigation and screen reader support
- 🎨 **Modern UI**: Clean, Linear-inspired design with consistent interactions
- 🔧 **TypeScript**: Complete type safety with excellent developer experience
- 📱 **Responsive**: Mobile-friendly interface with touch-optimized interactions

## Quick Start

### Installation

```bash
npm install @lambdacurry/forms
```

### Basic Usage

```typescript
import { DataTableFilter } from '@lambdacurry/forms/ui/data-table-filter';
import { useDataTableFilters } from '@lambdacurry/forms/ui/data-table-filter/hooks/use-data-table-filters';
import { createColumnConfigHelper } from '@lambdacurry/forms/ui/data-table-filter/core/filters';
import { useFilterSync } from '@lambdacurry/forms/ui/utils/use-filter-sync';

// 1. Define your data interface
interface TaskData {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  assignee: string;
  priority: 'low' | 'medium' | 'high';
  createdDate: Date;
  estimatedHours: number;
}

// 2. Configure columns using the fluent API
const dtf = createColumnConfigHelper<TaskData>();

const columnConfigs = [
  dtf
    .text()
    .id('title')
    .accessor((row) => row.title)
    .displayName('Title')
    .icon(TextIcon)
    .build(),
    
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
];

// 3. Use in your component
const MyDataTable = () => {
  const [filters, setFilters] = useFilterSync();

  const {
    columns,
    actions,
    strategy,
    data: filteredData,
  } = useDataTableFilters({
    columnsConfig: columnConfigs,
    filters,
    onFiltersChange: setFilters,
    strategy: 'client',
    data: yourData,
  });

  return (
    <div>
      <DataTableFilter 
        columns={columns} 
        filters={filters} 
        actions={actions} 
        strategy={strategy} 
      />
      {/* Your data table component */}
    </div>
  );
};
```

## Filter Types

### Text Filters

Perfect for searching through string content with partial matching.

```typescript
dtf
  .text()
  .id('title')
  .accessor((row) => row.title)
  .displayName('Task Title')
  .icon(TextIcon)
  .build()
```

**Supported Operators:**
- `contains` - Default operator for text search
- `does not contain` - Exclusion search

### Option Filters

Single or multi-select from predefined options with faceted counts.

```typescript
dtf
  .option()
  .id('status')
  .accessor((row) => row.status)
  .displayName('Status')
  .icon(CheckCircledIcon)
  .options([
    { value: 'active', label: 'Active', icon: CheckIcon },
    { value: 'inactive', label: 'Inactive', icon: XIcon },
  ])
  .build()
```

**Supported Operators:**
- `is` - Single selection (default)
- `is not` - Single exclusion
- `is any of` - Multiple selection
- `is none of` - Multiple exclusion

### Date Filters

Date range and comparison filtering with calendar picker.

```typescript
dtf
  .date()
  .id('createdDate')
  .accessor((row) => row.createdDate)
  .displayName('Created Date')
  .icon(CalendarIcon)
  .build()
```

**Supported Operators:**
- `is` - Exact date match
- `is not` - Date exclusion
- `is before` - Before date
- `is after` - After date
- `is between` - Date range
- `is on or before` - On or before date
- `is on or after` - On or after date

### Number Filters

Numeric range and comparison filtering.

```typescript
dtf
  .number()
  .id('estimatedHours')
  .accessor((row) => row.estimatedHours)
  .displayName('Estimated Hours')
  .icon(HashIcon)
  .build()
```

**Supported Operators:**
- `is` - Exact number match
- `is not` - Number exclusion
- `is less than` - Less than comparison
- `is greater than` - Greater than comparison
- `is between` - Number range
- `is less than or equal to` - Less than or equal
- `is greater than or equal to` - Greater than or equal

## Advanced Configuration

### Faceted Filtering

Enable dynamic option counts that update based on current filters:

```typescript
const facetedCounts = useMemo(() => {
  const counts: Record<string, Map<string, number>> = {};
  
  // Calculate counts for each option column
  columnConfigs
    .filter(col => col.type === 'option')
    .forEach(col => {
      const optionCounts = new Map<string, number>();
      
      col.options?.forEach(option => {
        const count = filteredData.filter(row => 
          col.accessor(row) === option.value
        ).length;
        optionCounts.set(option.value, count);
      });
      
      counts[col.id] = optionCounts;
    });
    
  return counts;
}, [filteredData, columnConfigs]);

const { ... } = useDataTableFilters({
  // ... other props
  faceted: facetedCounts,
});
```

### Server-Side Filtering

For large datasets, delegate filtering to the server:

```typescript
// In your loader function
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const filtersParam = url.searchParams.get('filters');
  
  const filters = filtersParam ? JSON.parse(filtersParam) : [];
  
  // Apply filters to your database query
  const { data, facetedCounts } = await queryWithFilters(filters);
  
  return { data, facetedCounts };
};

// In your component
const { data, facetedCounts } = useLoaderData<typeof loader>();

const { ... } = useDataTableFilters({
  columnsConfig: columnConfigs,
  filters,
  onFiltersChange: setFilters,
  strategy: 'server', // Server-side filtering
  data,
  faceted: facetedCounts,
});
```

### Custom Icons and Styling

Customize the appearance with your own icons and styles:

```typescript
import { CustomIcon } from './icons';

dtf
  .option()
  .id('priority')
  .accessor((row) => row.priority)
  .displayName('Priority')
  .icon(CustomIcon) // Your custom icon
  .options([
    { 
      value: 'high', 
      label: 'High Priority', 
      icon: <AlertTriangleIcon className="text-red-500" /> 
    },
    { 
      value: 'medium', 
      label: 'Medium Priority', 
      icon: <MinusIcon className="text-yellow-500" /> 
    },
    { 
      value: 'low', 
      label: 'Low Priority', 
      icon: <ArrowDownIcon className="text-green-500" /> 
    },
  ])
  .build()
```

## API Reference

### `useDataTableFilters`

Main hook for filter management.

```typescript
const {
  columns,
  actions,
  strategy,
  data, // Only for client-side filtering
} = useDataTableFilters({
  columnsConfig: DataTableColumnConfig<TData>[],
  filters: FiltersState,
  onFiltersChange: (filters: FiltersState) => void,
  strategy: 'client' | 'server',
  data?: TData[], // Required for client-side filtering
  faceted?: Record<string, Map<string, number>>, // Optional faceted counts
});
```

### `useFilterSync`

Hook for URL state synchronization.

```typescript
const [filters, setFilters] = useFilterSync();
```

### `createColumnConfigHelper`

Fluent API for creating column configurations.

```typescript
const dtf = createColumnConfigHelper<YourDataType>();

// Text column
const textColumn = dtf
  .text()
  .id('fieldName')
  .accessor((row) => row.fieldName)
  .displayName('Display Name')
  .icon(IconComponent)
  .build();

// Option column
const optionColumn = dtf
  .option()
  .id('fieldName')
  .accessor((row) => row.fieldName)
  .displayName('Display Name')
  .icon(IconComponent)
  .options([
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
  ])
  .build();

// Date column
const dateColumn = dtf
  .date()
  .id('fieldName')
  .accessor((row) => row.fieldName)
  .displayName('Display Name')
  .icon(IconComponent)
  .build();

// Number column
const numberColumn = dtf
  .number()
  .id('fieldName')
  .accessor((row) => row.fieldName)
  .displayName('Display Name')
  .icon(IconComponent)
  .build();
```

### `DataTableFilter`

Main filter component.

```typescript
<DataTableFilter 
  columns={Column<TData>[]}
  filters={FiltersState}
  actions={DataTableFilterActions}
  strategy={'client' | 'server'}
/>
```

## Performance Optimization

### Client-Side Filtering

Best for datasets under 10,000 rows:

- ✅ Immediate response
- ✅ No server requests
- ✅ Offline capability
- ❌ Memory usage grows with data size
- ❌ Initial load time increases

### Server-Side Filtering

Required for larger datasets:

- ✅ Constant memory usage
- ✅ Fast initial load
- ✅ Scales to millions of rows
- ❌ Network latency
- ❌ Requires server implementation

### Optimization Tips

1. **Memoize column configs**: Prevent unnecessary re-renders
2. **Debounce text inputs**: Built-in 300ms debouncing
3. **Lazy load options**: Load options asynchronously for large sets
4. **Virtual scrolling**: Use with react-window for large result sets

## Accessibility

The filter system is fully accessible and meets WCAG 2.1 AA standards:

### Keyboard Navigation

- **Tab**: Navigate between interactive elements
- **Enter/Space**: Activate buttons and open dropdowns
- **Arrow Keys**: Navigate within dropdowns and menus
- **Escape**: Close open dropdowns and dialogs

### Screen Reader Support

- **ARIA Labels**: Descriptive labels for all interactive elements
- **ARIA Roles**: Proper semantic roles for complex widgets
- **ARIA States**: Dynamic state announcements (expanded, selected, etc.)
- **Live Regions**: Announcements for filter changes

### Visual Accessibility

- **Color Contrast**: Sufficient contrast ratios (4.5:1 minimum)
- **Focus Indicators**: Visible focus indicators with 3:1 contrast
- **Text Scaling**: Supports 200% zoom without horizontal scrolling
- **Motion**: Respects `prefers-reduced-motion` settings

## Testing

The system includes comprehensive test coverage:

### Unit Tests

- Core utilities (filters, operators, types)
- Custom hooks (useDataTableFilters, useFilterSync, useDebounceCallback)
- Individual components

### Integration Tests

- Complete filter workflows
- URL state synchronization
- Faceted filtering
- Client/server-side filtering scenarios

### Accessibility Tests

- Keyboard navigation
- Screen reader compatibility
- ARIA attributes and roles
- Focus management

### Performance Tests

- Large dataset handling
- Memory usage optimization
- Debouncing effectiveness

## Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+


## Examples

Check out the comprehensive examples in Storybook:

- **Basic Usage**: Simple filter implementation
- **Server-Side Filtering**: Large dataset handling
- **Client-Side Filtering**: Real-time filtering
- **Faceted Filtering**: Dynamic option counts
- **Accessibility**: Keyboard and screen reader testing

## Contributing

We welcome contributions! Please see our contributing guidelines for:

- Code style and conventions
- Testing requirements
- Documentation standards
- Pull request process

## License

MIT License - see LICENSE file for details.

## Support

- **Documentation**: [Storybook Examples](https://your-storybook-url.com)
- **Issues**: [GitHub Issues](https://github.com/lambda-curry/forms/issues)
- **Discussions**: [GitHub Discussions](https://github.com/lambda-curry/forms/discussions)

