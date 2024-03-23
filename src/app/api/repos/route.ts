import { NextRequest } from "next/server"
import { z } from 'zod'
import { wrap } from '@typeschema/zod'

import client from '@api/clients/github'
import { urlSearchParamsToObject } from "@api/utils"

import type { QPObj } from "@api/utils"

// Validation Schemas
const OrgRepoParams = z.object({
    org: z.string(),
    page: z.optional(z.number()),
    per_page: z.optional(z.number()),
    type: z.optional(z.enum(["all", "public", "private", "forks", "sources", "member"])),
    sort: z.optional(z.enum(["created", "updated", "pushed", "full_name"])),
    direction: z.optional(z.enum(["asc", "desc"]))
})

const handleOrgRepos = async (params: QPObj) => {
    const result = OrgRepoParams.safeParse(params)

    if (!result.success) {
        return result.error
    }

    const repos = await client.rest.repos.listForOrg(result.data)
    return repos
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

    let result;
    switch (params.scope) {
        case "org":
            result = await handleOrgRepos(params)
    }
}

