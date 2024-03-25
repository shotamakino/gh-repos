'use client'

import useRepos from "@/hooks/api/useRepos";
import { useReactTable, getCoreRowModel, getPaginationRowModel, createColumnHelper } from '@tanstack/react-table';



const columnHelper = createColumnHelper()

const columns = [
    columnHelper.accessor('')
]

export default function ReposTable() {
    useReactTable({ data, columns })

}