
'use client'

import { createAPIURL, fetcher } from '@/hooks/api/utils'
import useSWR from 'swr'



export type UseReposParams = {
    name: string,
    page?: number,
    per_page?: number,
    type?: 'all' | 'member',
    sort?: "created" | "updated" | "pushed" | "full_name"
    direction?: 'asc' | 'desc'
}

export type Repos = {
    full_name: string,
    description: string,
    url: string,
    stars_count: number,
    watchers_count: number,
    open_issues_count: number,
    pushed_at: string,
    created_at: string,
    updated_at: string,
    archived: boolean,
}

export default function useRepos({
    name,
    page,
    per_page,
    type,
    sort,
    direction
}: UseReposParams): { repos: Repos[], isLoading: boolean } {
    const url = createAPIURL('repos', {
        name,
        page,
        per_page,
        type,
        sort,
        direction
    })
    const { data: result, ...rest } = useSWR(url, fetcher)
    return {
        repos: result?.data,
        ...rest
    }
}
