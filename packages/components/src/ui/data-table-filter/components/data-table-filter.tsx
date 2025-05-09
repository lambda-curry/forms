import type { Column, DataTableFilterActions, FilterOperators, FilterStrategy, FiltersState } from '../core/types';
import type { Locale } from '../lib/i18n';
import { ActiveFilters, ActiveFiltersMobileContainer } from './active-filters';
import { FilterActions } from './filter-actions';
import { FilterSelector } from './filter-selector';

interface DataTableFilterProps<TData> {
  columns: Column<TData>[];
  filters: FiltersState;
  actions: DataTableFilterActions;
  strategy: FilterStrategy;
  locale?: Locale;
}

// Define default operators based on column type
const defaultOperatorMap: Record<string, FilterOperators> = {
  option: 'is any of' as unknown as FilterOperators, // Use double assertion
  text: 'contains' as unknown as FilterOperators, // Use double assertion
  date: 'is' as unknown as FilterOperators, // Use double assertion
  number: 'eq' as unknown as FilterOperators, // Use double assertion
};

export function DataTableFilter<TData>({
  columns,
  filters,
  actions,
  strategy,
  locale = 'en',
}: DataTableFilterProps<TData>) {
  return (
    <div className="flex w-full items-start justify-between gap-2">
      {/* Left Group: Selector + Desktop Active Filters */}
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <FilterSelector columns={columns} filters={filters} actions={actions} strategy={strategy} locale={locale} />

        {/* Desktop Active Filters: Hidden below md */}
        <div className="hidden md:flex">
          <ActiveFilters columns={columns} filters={filters} actions={actions} strategy={strategy} locale={locale} />
        </div>
      </div>

      {/* Right Group: Actions + Mobile Active Filters */}
      <div className="flex items-center gap-2">
        {/* Filter Actions (Always visible, but maybe redundant now?) */}
        <FilterActions hasFilters={filters.length > 0} actions={actions} locale={locale} />

        {/* Mobile Active Filters Container: Visible below md */}
        <div className="flex md:hidden">
          <ActiveFiltersMobileContainer>
            <ActiveFilters columns={columns} filters={filters} actions={actions} strategy={strategy} locale={locale} />
          </ActiveFiltersMobileContainer>
        </div>
      </div>
    </div>
  );
}
