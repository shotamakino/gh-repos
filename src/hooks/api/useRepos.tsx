"use client";

import { createAPIURL, fetcher } from "@/hooks/api/utils";
import useSWR from "swr";

export type UseReposParams = {
  name: string;
  textIn?: "name" | "description" | "topics" | "readme";
  text?: string;
  language?: string;
  archived?: boolean;
  page?: number;
  per_page?: number;
  type?: "all" | "member";
  sort?: "stars" | "forks" | "help-wanted-issues" | "updated";
  order?: "asc" | "desc";
};

export type Repos = {
  full_name: string;
  description: string;
  url: string;
  stars_count: number;
  watchers_count: number;
  open_issues_count: number;
  forks_count: number;
  pushed_at: string;
  created_at: string;
  updated_at: string;
  archived: boolean;
};

export default function useRepos({
  name,
  textIn,
  text,
  language,
  archived,
  page,
  per_page,
  type,
  sort,
  order,
}: UseReposParams): { repos: Repos[]; isLoading: boolean } {
  const url = createAPIURL("repos", {
    name,
    textIn,
    text,
    language,
    archived,
    page,
    per_page,
    type,
    sort,
    order,
  });
  console.log(url);
  const { data: result, ...rest } = useSWR(!!name ? url : null, fetcher);
  return {
    repos: result?.data,
    ...rest,
  };
}
