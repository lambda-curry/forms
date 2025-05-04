import { type ColumnDef, type RowData } from '@tanstack/react-table';
import { type LucideIcon } from 'lucide-react';

/**
 * The types of data that can be filtered.
 */
export type ColumnDataType =
  | 'text'       /* Text data */
  | 'number'     /* Numerical data */
  | 'date'       /* Dates */
  | 'option'     /* Single-valued option (e.g. status) */
  | 'multiOption'; /* Multi-valued option (e.g. labels) */

/**
 * The operators that can be used for filtering.
 */
export type FilterOperator =
  | 'eq'        /* Equals */
  | 'neq'       /* Not equals */
  | 'gt'        /* Greater than */
  | 'gte'       /* Greater than or equal */
  | 'lt'        /* Less than */
  | 'lte'       /* Less than or equal */
  | 'contains'  /* Contains */
  | 'startsWith' /* Starts with */
  | 'endsWith'  /* Ends with */
  | 'between'   /* Between */
  | 'in'        /* In */
  | 'nin'       /* Not in */
  | 'empty'     /* Empty */
  | 'nempty';   /* Not empty */

/**
 * Helper type to get the element type of an array.
 */
export type ElementType<T> = T extends (infer U)[] ? U : T;

/**
 * Represents an option for a column.
 */
export interface ColumnOption {
  /**
   * The label to display for the option.
   */
  label: string;
  
  /**
   * The internal value of the option.
   */
  value: string;
  
  /**
   * An optional icon to display next to the label.
   */
  icon?: React.ReactElement | React.ComponentType<{ className?: string }>;
}

/**
 * Metadata for a column.
 */
export interface ColumnMeta<TData extends RowData, TValue> {
  /**
   * The display name of the column.
   */
  displayName: string;
  
  /**
   * The column icon.
   */
  icon: LucideIcon;
  
  /**
   * The data type of the column.
   */
  type: ColumnDataType;
  
  /**
   * An optional list of options for the column.
   * This is used for columns with type 'option' or 'multiOption'.
   * If the options are known ahead of time, they can be defined here.
   * Otherwise, they will be dynamically generated based on the data.
   */
  options?: ColumnOption[];
  
  /**
   * An optional function to transform columns with type 'option' or 'multiOption'.
   * This is used to convert each raw option into a ColumnOption.
   */
  transformOptionFn?: (
    value: ElementType<NonNullable<TValue>>,
  ) => ColumnOption;
  
  /**
   * An optional "soft" max for the range slider.
   * This is used for columns with type 'number'.
   */
  max?: number;
}

/**
 * The value of a filter.
 */
export interface FilterValue {
  /**
   * The operator to use for filtering.
   */
  operator: FilterOperator;
  
  /**
   * The values to filter by.
   */
  values: any;
  
  /**
   * The metadata for the column being filtered.
   */
  columnMeta?: ColumnMeta<any, any>;
}

/**
 * A filter for a column.
 */
export interface ColumnFilter {
  /**
   * The ID of the column to filter.
   */
  id: string;
  
  /**
   * The filter value.
   */
  value: FilterValue;
}

/**
 * The state of the data table filter.
 */
export type DataTableFilterState = ColumnFilter[];

/**
 * Helper function to define column metadata.
 */
export function defineMeta<TData extends RowData, TValue>(
  property: keyof TData,
  meta: ColumnMeta<TData, TValue>
): ColumnMeta<TData, TValue> {
  return meta;
}

/**
 * Filter functions for different column types.
 */
export function filterFn<TData extends RowData>(type: ColumnDataType) {
  return (
    row: any,
    columnId: string,
    filterValue: FilterValue
  ): boolean => {
    if (!filterValue) return true;
    
    const { operator, values } = filterValue;
    const value = row.getValue(columnId);
    
    if (value === undefined || value === null) {
      return operator === 'empty';
    }
    
    switch (type) {
      case 'text':
        return filterText(value, operator, values);
      
      case 'number':
        return filterNumber(value, operator, values);
      
      case 'date':
        return filterDate(value, operator, values);
      
      case 'option':
        return filterOption(value, operator, values);
      
      case 'multiOption':
        return filterMultiOption(value, operator, values);
      
      default:
        return true;
    }
  };
}

// Helper functions for filtering different data types
function filterText(value: string, operator: FilterOperator, filterValue: any): boolean {
  const stringValue = String(value).toLowerCase();
  const filterString = String(filterValue).toLowerCase();
  
  switch (operator) {
    case 'eq':
      return stringValue === filterString;
    case 'neq':
      return stringValue !== filterString;
    case 'contains':
      return stringValue.includes(filterString);
    case 'startsWith':
      return stringValue.startsWith(filterString);
    case 'endsWith':
      return stringValue.endsWith(filterString);
    case 'empty':
      return stringValue === '';
    case 'nempty':
      return stringValue !== '';
    default:
      return true;
  }
}

function filterNumber(value: number, operator: FilterOperator, filterValue: any): boolean {
  const numValue = Number(value);
  
  switch (operator) {
    case 'eq':
      return numValue === Number(filterValue);
    case 'neq':
      return numValue !== Number(filterValue);
    case 'gt':
      return numValue > Number(filterValue);
    case 'gte':
      return numValue >= Number(filterValue);
    case 'lt':
      return numValue < Number(filterValue);
    case 'lte':
      return numValue <= Number(filterValue);
    case 'between':
      return numValue >= Number(filterValue[0]) && numValue <= Number(filterValue[1]);
    case 'empty':
      return isNaN(numValue);
    case 'nempty':
      return !isNaN(numValue);
    default:
      return true;
  }
}

function filterDate(value: Date | string, operator: FilterOperator, filterValue: any): boolean {
  const dateValue = value instanceof Date ? value : new Date(value);
  const filterDate = filterValue instanceof Date ? filterValue : new Date(filterValue);
  
  if (isNaN(dateValue.getTime())) {
    return operator === 'empty';
  }
  
  switch (operator) {
    case 'eq':
      return dateValue.toDateString() === filterDate.toDateString();
    case 'neq':
      return dateValue.toDateString() !== filterDate.toDateString();
    case 'gt':
      return dateValue > filterDate;
    case 'gte':
      return dateValue >= filterDate;
    case 'lt':
      return dateValue < filterDate;
    case 'lte':
      return dateValue <= filterDate;
    case 'between':
      const startDate = filterValue[0] instanceof Date ? filterValue[0] : new Date(filterValue[0]);
      const endDate = filterValue[1] instanceof Date ? filterValue[1] : new Date(filterValue[1]);
      return dateValue >= startDate && dateValue <= endDate;
    case 'empty':
      return isNaN(dateValue.getTime());
    case 'nempty':
      return !isNaN(dateValue.getTime());
    default:
      return true;
  }
}

function filterOption(value: string, operator: FilterOperator, filterValue: any): boolean {
  switch (operator) {
    case 'eq':
      return value === filterValue;
    case 'neq':
      return value !== filterValue;
    case 'in':
      return Array.isArray(filterValue) ? filterValue.includes(value) : false;
    case 'nin':
      return Array.isArray(filterValue) ? !filterValue.includes(value) : true;
    case 'empty':
      return value === '' || value === undefined || value === null;
    case 'nempty':
      return value !== '' && value !== undefined && value !== null;
    default:
      return true;
  }
}

function filterMultiOption(value: string[], operator: FilterOperator, filterValue: any): boolean {
  if (!Array.isArray(value)) {
    return operator === 'empty';
  }
  
  switch (operator) {
    case 'eq':
      return value.includes(filterValue);
    case 'neq':
      return !value.includes(filterValue);
    case 'in':
      return Array.isArray(filterValue) ? filterValue.some(v => value.includes(v)) : false;
    case 'nin':
      return Array.isArray(filterValue) ? !filterValue.some(v => value.includes(v)) : true;
    case 'empty':
      return value.length === 0;
    case 'nempty':
      return value.length > 0;
    default:
      return true;
  }
}

