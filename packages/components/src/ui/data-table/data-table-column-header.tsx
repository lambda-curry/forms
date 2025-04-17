import type { Column } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown, EyeOff } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

import { Button } from '../button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../dropdown-menu';

interface DataTableColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({ column, title }: DataTableColumnHeaderProps<TData, TValue>) {
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get('sortField');
  const order = searchParams.get('sortOrder') || 'asc';
  const isSorted = sort === column.id;

  const handleSort = () => {
    const newParams = new URLSearchParams(searchParams);
    
    if (isSorted) {
      if (order === 'asc') {
        newParams.set('sortOrder', 'desc');
        column.toggleSorting(true);
      } else {
        newParams.delete('sortField');
        newParams.set('sortOrder', 'asc');
        column.toggleSorting(false);
      }
    } else {
      newParams.set('sortField', column.id);
      newParams.set('sortOrder', 'asc');
      column.toggleSorting(false);
    }
    
    setSearchParams(newParams, { replace: true });
  };

  if (!column.getCanSort()) {
    return <div className="text-left">{title}</div>;
  }

  return (
    <div className="flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="-ml-3 h-10 data-[state=open]:bg-accent">
            <span>{title}</span>
            {isSorted ? (
              order === 'desc' ? (
                <ArrowDown className="ml-2 h-4 w-4" />
              ) : (
                <ArrowUp className="ml-2 h-4 w-4" />
              )
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={handleSort}>
            <ArrowUpDown className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Sort
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <EyeOff className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
