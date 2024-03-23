'use client'

import { fetcher } from '@/hooks/api/utils'
import useSWR from 'swr'

export default function useUser() {
    const { data: result } = useSWR('/api/me', fetcher)

    return {
        user: result.data,
        ...result
    }
}