
'use client'

import { createAPIURL, fetcher } from '@/hooks/api/utils'
import useSWR from 'swr'

export type UseReposParams = {
    name: string,
    page: number,
    per_page: number,
    type: 'all' | 'member',
    sort: "created" | "updated" | "pushed" | "full_name"
    direction: 'asc' | 'desc'
}

export default function useRepos({
    name,
    page,
    per_page,
    type,
    sort,
    direction
}: UseReposParams) {
    const url = createAPIURL('repos', {
        name,
        page,
        per_page,
        type,
        sort,
        direction
    })
    const { data: result, ...rest } = useSWR('/api/repos', fetcher)

    return {
        user: result,
        ...rest
    }
}
