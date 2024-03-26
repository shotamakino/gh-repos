import ReposTable from "./ReposTable";
import { useState, useEffect, useMemo } from "react";
import { useDebounce } from "use-debounce";
import { PaginationState, SortingState } from "@tanstack/react-table";

import useRepos, { Repos } from "@/hooks/api/useRepos";
import type { UseReposParams } from "@/hooks/api/useRepos";
import { useFilterForm } from "./filter-form/FormContext";

const sortingToQueryString = (
  sorting: SortingState
): [UseReposParams["sort"]?, UseReposParams["order"]?] => {
  const sortBy = sorting[0]; // we just ignore the rest (this should never be length >1)

  return [
    {
      stars_count: "stars",
      updated_at: "updated",
      open_issues_count: "help-wanted-issues",
      forks_count: "forks",
    }[sortBy?.id] as UseReposParams["sort"],
    (sortBy?.desc !== undefined
      ? sortBy.desc
        ? "desc"
        : "asc"
      : undefined) as UseReposParams["order"],
  ];
};

export default function ReposTableData() {
  const { filters } = useFilterForm();

  const [data, setData] = useState<Repos[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [sort, order] = useMemo(() => sortingToQueryString(sorting), [sorting]);
  const { repos, isLoading } = useRepos({
    name: filters?.name ?? "",
    textIn:
      filters?.textIn?.text === undefined ? undefined : filters?.textIn?.in,
    text: filters?.textIn?.text ?? undefined,
    language: filters?.language ?? undefined,
    archived: filters?.archived,
    sort,
    order,
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
      sorting={sorting}
      onSortingChange={setSorting}
    />
  );
}
