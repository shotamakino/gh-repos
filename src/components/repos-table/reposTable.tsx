"use client";

import useRepos, { Repos } from "@/hooks/api/useRepos";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  flexRender,
} from "@tanstack/react-table";
import type {
  PaginationState,
  OnChangeFn,
  SortingState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import DateCell from "./DateCell";
import {
  CaretDownIcon,
  CaretSortIcon,
  CaretUpIcon,
} from "@radix-ui/react-icons";

const columnHelper = createColumnHelper<Repos>();

const columns = [
  columnHelper.accessor("full_name", {
    header: "Repository Name",
    enableSorting: false,
    cell: (info) => (
      <Button
        variant="link"
        onClick={() => window.open(info.row.original.url, "_blank")}
      >
        {info.getValue()}
      </Button>
    ),
  }),
  columnHelper.accessor("watchers_count", {
    header: "Watchers",
    enableSorting: false,
  }),
  columnHelper.accessor("description", {
    header: "Description",
    enableSorting: false,
    cell: (info) => (
      <div className="truncate text-wrap w-48 line-clamp-2">
        {info.getValue()}
      </div>
    ),
  }),
  columnHelper.accessor("open_issues_count", {
    header: "Open Issues",
    enableSorting: false,
  }),
  columnHelper.accessor("stars_count", {
    header: "Stars",
    enableSorting: true,
  }),
  columnHelper.accessor("forks_count", {
    header: "Forks",
    enableSorting: true,
  }),
  columnHelper.accessor("pushed_at", {
    header: "Pushed At",
    enableSorting: false,
    cell: (info) => <DateCell date={info.getValue()} />,
  }),
  columnHelper.accessor("updated_at", {
    header: "Updated At",
    enableSorting: true,
    cell: (info) => <DateCell date={info.getValue()} />,
  }),
];

interface ReposTableProps {
  data: Repos[];
  pagination: PaginationState;
  isDataLoading: boolean;
  onPaginationChange: OnChangeFn<PaginationState>;
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
}

export default function ReposTable({
  data,
  pagination,
  onPaginationChange,
  isDataLoading,
  sorting,
  onSortingChange,
}: ReposTableProps) {
  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
      sorting,
    },
    pageCount: -1,
    onPaginationChange,
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    enableMultiSort: false,
  });

  return (
    <div className="flex-col w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div
                          onClick={header.column.getToggleSortingHandler()}
                          className="flex"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}

                          {header.column.getCanSort() ? (
                            header.column.getIsSorted() ? (
                              {
                                asc: (
                                  <CaretUpIcon className="w-4 h-4 opacity-50" />
                                ),
                                desc: (
                                  <CaretDownIcon className="w-4 h-4 opacity-50" />
                                ),
                              }[header.column.getIsSorted().toString()] ?? null
                            ) : (
                              <CaretSortIcon className="w-4 h-4 opacity-50" />
                            )
                          ) : null}
                        </div>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isDataLoading || table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
