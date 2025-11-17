import { flexRender, type Table as TableType } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../table';
import { cn } from '../utils';
import { DataTablePagination } from './data-table-pagination';

interface DataTableProps<TData> {
  table: TableType<TData>;
  columns: number;
  onPaginationChange?: (pageIndex: number, pageSize: number) => void;
  pageCount?: number;
  className?: string;
}

export function DataTable<TData>({
  table,
  columns,
  onPaginationChange,
  pageCount = 1,
  className,
}: DataTableProps<TData>) {
  return (
    <div className={cn('space-y-4 h-full [--lc-datatable-pagination-height:140px] sm:[--lc-datatable-pagination-height:96px]', className)}>
      <div className="rounded-md border flex flex-col max-h-[calc(100%-var(--lc-datatable-pagination-height,140px)-1rem)] sm:max-h-[calc(100%-var(--lc-datatable-pagination-height,96px)-1rem)] overflow-hidden">
        <Table className="[&>div]:h-full [&>div>table]:h-full">
          <TableHeader className="sticky top-0 z-10 bg-background">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className={cn(!table.getRowModel().rows?.length && 'min-h-[calc(100%-3rem)]')}>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="h-full">
                <TableCell colSpan={columns} className="h-full text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination pageCount={pageCount} onPaginationChange={onPaginationChange} />
    </div>
  );
}
