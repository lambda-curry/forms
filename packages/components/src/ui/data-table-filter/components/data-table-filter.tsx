'use client'

import type {
  Column,
  DataTableFilterActions,
  FilterStrategy,
  FiltersState,
} from '../core/types'
import type { Locale } from '../lib/i18n'
import { ActiveFilters, ActiveFiltersMobileContainer } from './active-filters'
import { FilterActions } from './filter-actions'
import { FilterSelector } from './filter-selector'

interface DataTableFilterProps<TData> {
  columns: Column<TData>[]
  filters: FiltersState
  actions: DataTableFilterActions
  strategy: FilterStrategy
  locale?: Locale
}

export function DataTableFilter<TData>({
  columns,
  filters,
  actions,
  strategy,
  locale = 'en',
}: DataTableFilterProps<TData>) {
  return (
    <div className="flex w-full items-start justify-between gap-2">
      <div className="flex flex-1 w-full gap-2 md:flex-wrap">
        <div className="flex md:hidden gap-1">
          <FilterSelector
            columns={columns}
            filters={filters}
            actions={actions}
            strategy={strategy}
            locale={locale}
          />
          <FilterActions
            hasFilters={filters.length > 0}
            actions={actions}
            locale={locale}
          />
        </div>
        <div className="hidden md:flex md:flex-wrap gap-2 w-full">
          <FilterSelector
            columns={columns}
            filters={filters}
            actions={actions}
            strategy={strategy}
            locale={locale}
          />
          <ActiveFilters
            columns={columns}
            filters={filters}
            actions={actions}
            strategy={strategy}
            locale={locale}
          />
        </div>
      </div>
      <div className="hidden md:block">
        <FilterActions
          hasFilters={filters.length > 0}
          actions={actions}
          locale={locale}
        />
      </div>
      <div className="md:hidden">
        <ActiveFiltersMobileContainer>
          <ActiveFilters
            columns={columns}
            filters={filters}
            actions={actions}
            strategy={strategy}
            locale={locale}
          />
        </ActiveFiltersMobileContainer>
      </div>
    </div>
  )
}
