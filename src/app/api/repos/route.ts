import { NextRequest } from "next/server"
import { z } from 'zod'

import client from '@/app/api/_clients/github'
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

const UserRepoParams = z.object({
    username: z.string(),
    page: z.optional(z.number()),
    per_page: z.optional(z.number()),
    type: z.optional(z.enum(["all", "member", "owner"])),
    sort: z.optional(z.enum(["created", "updated", "pushed", "full_name"])),
    direction: z.optional(z.enum(["asc", "desc"]))
})

// intersection of UserRepoParams and OrgRepoParams
const UserAndOrgRepoParams = z.object({
    name: z.string(),
    page: z.optional(z.number()),
    per_page: z.optional(z.number()),
    type: z.optional(z.enum(['all', 'member'])),
    sort: z.optional(z.enum(["created", "updated", "pushed", "full_name"])),
    direction: z.optional(z.enum(["asc", "desc"]))
})

const AuthUserRepoParams = z.object({
    visibility: z.optional(z.enum(["all", "public", "private"])),
    affiliation: z.optional(z.enum(["owner", "collaborator", "organization_member"])),
    page: z.optional(z.number()),
    per_page: z.optional(z.number()),
    type: z.optional(z.enum(["all", "public", "private", "member", "owner"])),
    sort: z.optional(z.enum(["created", "updated", "pushed", "full_name"])),
    direction: z.optional(z.enum(["asc", "desc"])),
    since: z.optional(z.coerce.date().transform(val => val.toString())),
    before: z.optional(z.coerce.date().transform(val => val.toString())),
})

const handleOrgRepos = async (params: QPObj) => {
    const result = OrgRepoParams.safeParse(params)

    if (!result.success) {
        return result.error
    }

    const repos = await client.rest.repos.listForOrg(result.data)
    return repos.data
}

const handleUserRepos = async (params: QPObj) => {
    const result = UserRepoParams.safeParse(params)

    if (!result.success) {
        return result.error
    }

    const repos = await client.rest.repos.listForUser(result.data)
    return repos.data
}

const handleRepos = async (params: QPObj) => {
    const result = UserAndOrgRepoParams.safeParse(params)

    if (!result.success) {
        return result.error
    }

    const userRepos = await handleUserRepos({
        username: result.data.name,
        ...params
    })
    const orgRepos = await handleOrgRepos(params)
    return [userRepos, orgRepos]
}

const handleAuthdRepos = async (params: QPObj) => {
    const result = AuthUserRepoParams.safeParse(params)

    if (!result.success) {
        return result.error
    }

    const repos = await client.rest.repos.listForAuthenticatedUser(result.data)
    return repos.data
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
            break;
        case "user":
            result = await handleUserRepos(params)
            break;
        case "me":
            result = await handleAuthdRepos(params)
        default:
            result = await handleRepos(params)
    }
}

