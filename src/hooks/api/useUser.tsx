'use client'

import { fetcher } from '@/hooks/api/utils'
import useSWR from 'swr'
import { createAPIURL } from '@/hooks/api/utils'

export default function useUser() {
    const url = createAPIURL('me')
    const { data: result, ...rest } = useSWR(url, fetcher)

    return {
        user: result,
        ...rest
    }
}