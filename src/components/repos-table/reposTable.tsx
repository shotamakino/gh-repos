'use client'

import useRepos, { Repos } from "@/hooks/api/useRepos";
import { useReactTable, getCoreRowModel, getPaginationRowModel, createColumnHelper } from '@tanstack/react-table';
import { useEffect } from "react";
import { useState } from "react";

const columnHelper = createColumnHelper<Repos>()

const columns = [
    columnHelper.accessor('full_name', {
        header: 'Repository Name'
    }),
    columnHelper.accessor('watchers_count', {
        header: 'Watchers'
    }),
    columnHelper.accessor('created_at', {
        header: 'Created At'
    }),
    columnHelper.accessor('updated_at', {
        header: 'Updated At'
    }),
]

export default function ReposTable() {
    const [data, setData] = useState<Repos[]>([])
    const { repos, isLoading } = useRepos({ name: 'npm' })

    useEffect(() => {
        setData(repos)
    }, [repos, setData])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel()
    })

    if (isLoading) return null

    return (<div></div>)
}