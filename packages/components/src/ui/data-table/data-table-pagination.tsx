import { ChevronLeftIcon, ChevronRightIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons';
import { parseAsInteger, useQueryState } from 'nuqs';
import { Button } from '../button';
import { Select } from '../select';

interface DataTablePaginationProps {
  pageCount: number;
  onPaginationChange?: (pageIndex: number, pageSize: number) => void;
}

export function DataTablePagination({ pageCount, onPaginationChange }: DataTablePaginationProps) {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(0));
  const [pageSize, setPageSize] = useQueryState('pageSize', parseAsInteger.withDefault(10));

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">{pageSize} rows per page</div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={pageSize.toString()}
            onValueChange={async (value) => {
              await setPageSize(Number.parseInt(value));
              onPaginationChange?.(page, Number.parseInt(value));
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
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {page + 1} of {pageCount}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={async () => {
              await setPage(0);
              onPaginationChange?.(0, pageSize);
            }}
            disabled={page === 0}
          >
            <span className="sr-only">Go to first page</span>
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={async () => {
              await setPage(page - 1);
              onPaginationChange?.(page - 1, pageSize);
            }}
            disabled={page === 0}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={async () => {
              await setPage(page + 1);
              onPaginationChange?.(page + 1, pageSize);
            }}
            disabled={page === pageCount - 1}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={async () => {
              await setPage(pageCount - 1);
              onPaginationChange?.(pageCount - 1, pageSize);
            }}
            disabled={page === pageCount - 1}
          >
            <span className="sr-only">Go to last page</span>
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
