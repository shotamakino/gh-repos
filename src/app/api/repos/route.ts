import { NextRequest } from "next/server"
import { z } from 'zod'

import client from '@/app/api/_clients/github'
import { urlSearchParamsToObject } from "@api/utils"
import { transform } from './transforms'

import type { QPObj } from "@api/utils"

const buildGitHubQuery = (params: z.infer<typeof UserAndOrgRepoParams>) => {
    const q = `user:${params.name} org:${params.name}`

    return Object.entries(params).reduce((acc, [key, val]) => {
        switch (key) {
            case 'textIn': 
                const searchVal = params['text']
                // we know val here will be a string
                // because of validation
                acc = `${searchVal} in:${(val as string).toLowerCase()}` + acc 
                break
            case 'archived':
                acc = acc + `archived:${val}`
                break
            case 'language':
                acc = acc + `language:${val}`
                break
        }
        return acc
    }, q)
}

const UserAndOrgRepoParams = z.object({
    name: z.string().trim(),
    textIn: z.optional(z.enum(['name', 'description', 'topics', 'readme'])),
    text: z.optional(z.string()),
    language: z.optional(z.string()),
    archived: z.optional(z.coerce.boolean()),
    page: z.optional(z.coerce.number()),
    per_page: z.optional(z.coerce.number()),
    sort: z.optional(z.enum(["stars", "updated", "forks", "help-wanted-issues"])),
    order: z.optional(z.enum(["asc", "desc"]))
}).refine(input => {
    // requires text if textIn is defined and vice versa 
    if (input.textIn === undefined && input.text !== undefined) return false
    if (input.textIn !== undefined && input.text === undefined) return false
    return true
})

const handleRepos = async (params: QPObj) => {
    const result = UserAndOrgRepoParams.safeParse(params)

    if (!result.success) {
        return { success: false, errors: result.error }
    }

    const q = buildGitHubQuery(result.data)

    const { name: _, ...rest } = result.data

    const repos = await client.rest.search.repos({
        q,
        ...rest
    })

    console.log(repos)

    return { success: true, data: repos?.data?.items, totalCount: repos?.data?.total_count  }
}

/**
 * GET /api/repos route handler
 */
export async function GET(req: NextRequest) {
    const qp = req.nextUrl.searchParams
    const params = urlSearchParamsToObject(qp)

    const { success, data, errors, totalCount } = await handleRepos(params)
    if (!success) {
        return Response.json({ errors }, { status: 400 })
    }

    return Response.json({
        data: transform['default'](data || []),
        totalCount
    })
}

