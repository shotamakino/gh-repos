import { NextRequest } from "next/server"
import { z } from 'zod'

import client from '@/app/api/_clients/github'
import { urlSearchParamsToObject } from "@api/utils"
import { transform } from './transforms'

import type { QPObj } from "@api/utils"

// Validation Schemas
// intersection of UserRepoParams and OrgRepoParams
const UserAndOrgRepoParams = z.object({
    name: z.string(),
    page: z.optional(z.coerce.number()),
    per_page: z.optional(z.coerce.number()),
    sort: z.optional(z.enum(["stars", "updated", "forks", "help-wanted-issues"])),
    order: z.optional(z.enum(["asc", "desc"]))
})

const handleRepos = async (params: QPObj) => {
    const result = UserAndOrgRepoParams.safeParse(params)

    if (!result.success) {
        return { success: false, errors: result.error }
    }

    const q = `user:${result.data.name} org:${result.data.name}`

    const repos = await client.rest.search.repos({
        q,
        ...result.data
    })

    return { success: true, data: repos?.data?.items, pageInfo: repos?.data?.total_count  }
}

/**
 * GET /api/repos route handler
 * 
 * Utilizes the following API endpoints from GitHub REST API:
 * - `GET /user/repos`
 * - `GET /users/{username}/repos`
 * - `GET /orgs/{org}/repos`
 * The `username` and `org` scoped endpoints have the following
 * query parameters available: 
 * - `type` = 'all' | 'owner' | 'public' | 'private' | 'member' 
 * - `sort` = 'created' | 'updated' | 'pushed' | 'full_name'
 * - `direction` = 'asc' | 'desc'
 * - `per_page`
 * - `page`
 *   Whereas the authenticated user scoped endpoint
 *   additionally has:
 * - `visibility`
 * - `affiliation`
 * - `since`
 * - `before`
 * We also add custom flags in the query params to distinguish
 * between org repos from user repos queries
 */
export async function GET(req: NextRequest) {
    const qp = req.nextUrl.searchParams
    const params = urlSearchParamsToObject(qp)

    const { success, data, errors, pageInfo } = await handleRepos(params)
    if (!success) {
        return Response.json({ errors }, { status: 400 })
    }

    return Response.json({
        data: transform['default'](data || [])
    })
}

