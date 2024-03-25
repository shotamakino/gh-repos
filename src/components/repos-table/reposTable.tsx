"use client";

import useRepos, { Repos } from "@/hooks/api/useRepos";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  flexRender,
} from "@tanstack/react-table";
import type { PaginationState, OnChangeFn } from "@tanstack/react-table";

import { useEffect } from "react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import DateCell from "./dateCell";

const columnHelper = createColumnHelper<Repos>();

const columns = [
  columnHelper.accessor("full_name", {
    header: "Repository Name",
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
  }),
  columnHelper.accessor("description", {
    header: "Description",
    cell: (info) => (
      <div className="truncate text-wrap w-48 line-clamp-2">
        {info.getValue()}
      </div>
    ),
  }),
  columnHelper.accessor("pushed_at", {
    header: "Pushed At",
    cell: (info) => <DateCell date={info.getValue()} />,
  }),
  columnHelper.accessor("updated_at", {
    header: "Updated At",
    cell: (info) => <DateCell date={info.getValue()} />,
  }),
  columnHelper.accessor("created_at", {
    header: "Created At",
    cell: (info) => <DateCell date={info.getValue()} />,
  }),
];

export default function ReposTableData() {
  const [data, setData] = useState<Repos[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  });
  const { repos, isLoading } = useRepos({
    name: "npm",
    per_page: pagination.pageSize,
    page: pagination.pageIndex + 1, // REST API for GitHub 1-index
  });

  useEffect(() => {
    setData(repos);
  }, [repos, setData]);

  return (
    <ReposTable
      data={data || []}
      pagination={pagination}
      onPaginationChange={setPagination}
      isDataLoading={isLoading}
    />
  );
}

interface ReposTableProps {
  data: Repos[];
  pagination: PaginationState;
  isDataLoading: boolean;
  onPaginationChange: OnChangeFn<PaginationState>;
}

function ReposTable({
  data,
  pagination,
  onPaginationChange,
  isDataLoading,
}: ReposTableProps) {
  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
    },
    pageCount: -1,
    onPaginationChange,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
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
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
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
