import { ChevronLeftIcon, ChevronRightIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons';
import { useSearchParams } from 'react-router';
import { Button } from '../button';
import { Select } from '../select';

interface DataTablePaginationProps {
  pageCount: number;
  onPaginationChange?: (pageIndex: number, pageSize: number) => void;
}

export function DataTablePagination({ pageCount, onPaginationChange }: DataTablePaginationProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number.parseInt(searchParams.get('page') || '0', 10);
  const pageSize = Number.parseInt(searchParams.get('pageSize') || '10', 10);

  const updateParams = (newPage: number, newPageSize: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    newParams.set('pageSize', newPageSize.toString());
    setSearchParams(newParams, { replace: true });
    onPaginationChange?.(newPage, newPageSize);
  };

  return (
    <nav
      role="navigation"
      aria-label="Data table pagination"
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-2 py-2"
    >
      <div className="flex-1 text-sm text-muted-foreground">{pageSize} rows per page</div>
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 lg:gap-8">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium whitespace-nowrap">Rows per page</p>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              updateParams(page, Number.parseInt(value));
            }}
            options={[
              { value: '10', label: '10' },
              { value: '20', label: '20' },
              { value: '30', label: '30' },
              { value: '40', label: '40' },
              { value: '50', label: '50' },
            ]}
          />
        </div>
        <div className="flex w-full sm:w-auto justify-center text-sm font-medium">
          Page {page + 1} of {pageCount}
        </div>
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => updateParams(0, pageSize)}
            disabled={page === 0}
            aria-label="Go to first page"
          >
            <span className="sr-only">Go to first page</span>
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => updateParams(page - 1, pageSize)}
            disabled={page === 0}
            aria-label="Go to previous page"
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => updateParams(page + 1, pageSize)}
            disabled={page === pageCount - 1}
            aria-label="Go to next page"
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => updateParams(pageCount - 1, pageSize)}
            disabled={page === pageCount - 1}
            aria-label="Go to last page"
          >
            <span className="sr-only">Go to last page</span>
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
