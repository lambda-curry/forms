'use client';

import type React from 'react';
import { useMemo, useState } from 'react';
import { createColumns } from '../data-table-filter/core/filters';
import { DEFAULT_OPERATORS, determineNewOperator } from '../data-table-filter/core/operators';
import type {
  ColumnConfig,
  ColumnDataType,
  ColumnOption,
  DataTableFilterActions,
  FilterModel,
  FilterStrategy,
  FiltersState,
  NumberColumnIds,
  OptionBasedColumnDataType,
  OptionColumnIds,
} from '../data-table-filter/core/types';
import { addUniq, removeUniq, uniq } from '../data-table-filter/lib/array';
import {
  createDateFilterValue,
  createNumberFilterValue,
  isColumnOptionArray,
  isColumnOptionMap,
  isMinMaxTuple,
} from '../data-table-filter/lib/helpers';

export interface DataTableFiltersOptions<
  TData,
  // biome-ignore lint/suspicious/noExplicitAny: can be any
  TColumns extends readonly ColumnConfig<TData, any, any, any>[],
  TStrategy extends FilterStrategy,
> {
  strategy: TStrategy;
  data: TData[];
  columnsConfig: TColumns;
  defaultFilters?: FiltersState;
  filters?: FiltersState;
  onFiltersChange?: React.Dispatch<React.SetStateAction<FiltersState>>;
  options?: Partial<Record<OptionColumnIds<TColumns>, ColumnOption[] | undefined>>;
  faceted?: Partial<
    | Record<OptionColumnIds<TColumns>, Map<string, number> | undefined>
    | Record<NumberColumnIds<TColumns>, [number, number] | undefined>
  >;
}

export function useDataTableFilters<
  TData,
  // biome-ignore lint/suspicious/noExplicitAny: can be any
  TColumns extends readonly ColumnConfig<TData, any, any, any>[],
  TStrategy extends FilterStrategy,
>({
  strategy,
  data,
  columnsConfig,
  defaultFilters,
  filters: externalFilters,
  onFiltersChange,
  options,
  faceted,
}: DataTableFiltersOptions<TData, TColumns, TStrategy>) {
  const [internalFilters, setInternalFilters] = useState<FiltersState>(defaultFilters ?? []);

  if ((externalFilters && !onFiltersChange) || (!externalFilters && onFiltersChange)) {
    throw new Error('If using controlled state, you must specify both filters and onFiltersChange.');
  }

  const filters = externalFilters ?? internalFilters;
  const setFilters = onFiltersChange ?? setInternalFilters;

  // Convert ColumnConfig to Column, applying options and faceted options if provided
  const columns = useMemo(() => {
    const enhancedConfigs = columnsConfig.map((config) => {
      let final = config;

      // Set options, if exists
      if (options && (config.type === 'option' || config.type === 'multiOption')) {
        const optionsInput = options[config.id as OptionColumnIds<TColumns>];
        if (!(optionsInput && isColumnOptionArray(optionsInput))) return config;

        final = { ...final, options: optionsInput };
      }

      // Set faceted options, if exists
      if (faceted instanceof Map && (config.type === 'option' || config.type === 'multiOption')) {
        const potentialMapForColumn = faceted.get(config.id as OptionColumnIds<TColumns>);
        if (potentialMapForColumn && isColumnOptionMap(potentialMapForColumn)) {
          final = { ...final, facetedOptions: potentialMapForColumn };
        } else {
          // If faceted is a Map but the entry for this column isn't a Map or doesn't exist, return original config.
          return config;
        }
      } else if (config.type === 'option' || config.type === 'multiOption') {
        // If faceted is not a Map (or not provided) but it's an option column, return original config.
        return config;
      }

      // Set faceted min/max values, if exists
      if (faceted instanceof Map && config.type === 'number') {
        const potentialTupleForColumn = faceted.get(config.id as NumberColumnIds<TColumns>);
        if (potentialTupleForColumn && isMinMaxTuple(potentialTupleForColumn)) {
          final = {
            ...final,
            min: potentialTupleForColumn[0],
            max: potentialTupleForColumn[1],
          };
        } else {
          // If faceted is a Map but the entry for this column isn't a tuple or doesn't exist, return original config.
          return config;
        }
      } else if (config.type === 'number') {
        // If faceted is not a Map (or not provided) but it's a number column, return original config.
        return config;
      }

      return final;
    });

    // --- MODIFIED DEBUG LOG HERE ---
    console.log('[useDataTableFilters] Inspecting enhancedConfigs before passing to createColumns:');
    enhancedConfigs.forEach((config, index) => {
      console.log(`  [Enhanced Config Index: ${index}, ID: ${config.id}]`, config);
      if (config.facetedOptions instanceof Map) {
        console.log(`    ↳ Faceted Options (Map entries):`, Array.from(config.facetedOptions.entries()));
      } else {
        console.log(`    ↳ Faceted Options:`, config.facetedOptions); // Log it directly if not a map, to see what it is
      }
    });
    // --- END DEBUG LOG ---

    return createColumns(data, enhancedConfigs, strategy);
  }, [data, columnsConfig, options, faceted, strategy]);

  const actions: DataTableFilterActions = useMemo(
    () => ({
      addFilterValue<TData, TType extends OptionBasedColumnDataType>(
        column: ColumnConfig<TData, TType>,
        values: FilterModel<TType>['values'],
      ) {
        if (column.type === 'option') {
          setFilters((prev) => {
            const filter = prev.find((f) => f.columnId === column.id);
            const isColumnFiltered = filter && filter.values.length > 0;
            if (!isColumnFiltered) {
              return [
                ...prev,
                {
                  columnId: column.id,
                  type: column.type,
                  operator:
                    values.length > 1 ? DEFAULT_OPERATORS[column.type].multiple : DEFAULT_OPERATORS[column.type].single,
                  values,
                },
              ];
            }
            const oldValues = filter.values;
            const newValues = addUniq(filter.values, values);
            const newOperator = determineNewOperator('option', oldValues, newValues, filter.operator);
            return prev.map((f) =>
              f.columnId === column.id
                ? {
                    columnId: column.id,
                    type: column.type,
                    operator: newOperator,
                    values: newValues,
                  }
                : f,
            );
          });
          return;
        }
        if (column.type === 'multiOption') {
          setFilters((prev) => {
            const filter = prev.find((f) => f.columnId === column.id);
            const isColumnFiltered = filter && filter.values.length > 0;
            if (!isColumnFiltered) {
              return [
                ...prev,
                {
                  columnId: column.id,
                  type: column.type,
                  operator:
                    values.length > 1 ? DEFAULT_OPERATORS[column.type].multiple : DEFAULT_OPERATORS[column.type].single,
                  values,
                },
              ];
            }
            const oldValues = filter.values;
            const newValues = addUniq(filter.values, values);
            const newOperator = determineNewOperator('multiOption', oldValues, newValues, filter.operator);
            if (newValues.length === 0) {
              return prev.filter((f) => f.columnId !== column.id);
            }
            return prev.map((f) =>
              f.columnId === column.id
                ? {
                    columnId: column.id,
                    type: column.type,
                    operator: newOperator,
                    values: newValues,
                  }
                : f,
            );
          });
          return;
        }
        throw new Error('[data-table-filter] addFilterValue() is only supported for option columns');
      },
      removeFilterValue<TData, TType extends OptionBasedColumnDataType>(
        column: ColumnConfig<TData, TType>,
        value: FilterModel<TType>['values'],
      ) {
        if (column.type === 'option') {
          setFilters((prev) => {
            const filter = prev.find((f) => f.columnId === column.id);
            const isColumnFiltered = filter && filter.values.length > 0;
            if (!isColumnFiltered) {
              return [...prev];
            }
            const newValues = removeUniq(filter.values, value);
            const oldValues = filter.values;
            const newOperator = determineNewOperator('option', oldValues, newValues, filter.operator);
            if (newValues.length === 0) {
              return prev.filter((f) => f.columnId !== column.id);
            }
            return prev.map((f) =>
              f.columnId === column.id
                ? {
                    columnId: column.id,
                    type: column.type,
                    operator: newOperator,
                    values: newValues,
                  }
                : f,
            );
          });
          return;
        }
        if (column.type === 'multiOption') {
          setFilters((prev) => {
            const filter = prev.find((f) => f.columnId === column.id);
            const isColumnFiltered = filter && filter.values.length > 0;
            if (!isColumnFiltered) {
              return [...prev];
            }
            const newValues = removeUniq(filter.values, value);
            const oldValues = filter.values;
            const newOperator = determineNewOperator('multiOption', oldValues, newValues, filter.operator);
            if (newValues.length === 0) {
              return prev.filter((f) => f.columnId !== column.id);
            }
            return prev.map((f) =>
              f.columnId === column.id
                ? {
                    columnId: column.id,
                    type: column.type,
                    operator: newOperator,
                    values: newValues,
                  }
                : f,
            );
          });
          return;
        }
        throw new Error('[data-table-filter] removeFilterValue() is only supported for option columns');
      },
      setFilterValue<TData, TType extends ColumnDataType>(
        column: ColumnConfig<TData, TType>,
        values: FilterModel<TType>['values'],
      ) {
        setFilters((prev) => {
          const filter = prev.find((f) => f.columnId === column.id);
          const isColumnFiltered = filter && filter.values.length > 0;
          const newValues =
            column.type === 'number'
              ? createNumberFilterValue(values as number[])
              : column.type === 'date'
                ? createDateFilterValue(values as [Date, Date] | [Date] | [] | undefined)
                : uniq(values);
          if (newValues.length === 0) return prev;
          if (!isColumnFiltered) {
            return [
              ...prev,
              {
                columnId: column.id,
                type: column.type,
                operator:
                  values.length > 1 ? DEFAULT_OPERATORS[column.type].multiple : DEFAULT_OPERATORS[column.type].single,
                values: newValues,
              },
            ];
          }
          const oldValues = filter.values;
          const newOperator = determineNewOperator(column.type, oldValues, newValues, filter.operator);
          const newFilter = {
            columnId: column.id,
            type: column.type,
            operator: newOperator,
            values: newValues as FilterModel<TType>['values'],
          } satisfies FilterModel<TType>;
          return prev.map((f) => (f.columnId === column.id ? newFilter : f));
        });
      },
      setFilterOperator<TType extends ColumnDataType>(columnId: string, operator: FilterModel<TType>['operator']) {
        setFilters((prev) => prev.map((f) => (f.columnId === columnId ? { ...f, operator } : f)));
      },
      removeFilter(columnId: string) {
        setFilters((prev) => prev.filter((f) => f.columnId !== columnId));
      },
      removeAllFilters() {
        setFilters([]);
      },
    }),
    [setFilters],
  );

  return { columns, filters, actions, strategy }; // columns is Column<TData>[]
}
