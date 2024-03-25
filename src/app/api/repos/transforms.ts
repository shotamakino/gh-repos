import client from '@api/_clients/github'

import type { Scope } from './route'

// dynamically resolve return type from github client that
// we actually use because might run into complications of 
// OAS version types, etc
type OrgRepoData = Awaited<ReturnType<typeof client.rest.repos.listForOrg>>['data']

const filterOrgRepoData = (data: OrgRepoData[number]) => {
    return {
        full_name: data.full_name,
        description: data.description,
        url: data.html_url,
        stars_count: data.stargazers_count,
        watchers_count: data.watchers_count,
        open_issues_count: data.open_issues,
        pushed_at: data.pushed_at,
        created_at: data.created_at,
        updated_at: data.updated_at,
        archived: data.archived,
    }
}

type UserRepoData = Awaited<ReturnType<typeof client.rest.repos.listForUser>>['data']

const filterUserRepoData = (data: UserRepoData[number]) => {
    return {
        full_name: data.full_name,
        description: data.description,
        url: data.html_url,
        stars_count: data.stargazers_count,
        watchers_count: data.watchers_count,
        open_issues_count: data.open_issues,
        pushed_at: data.pushed_at,
        created_at: data.created_at,
        updated_at: data.updated_at,
        archived: data.archived,
    }
}

type AuthdUserRepoData = Awaited<ReturnType<typeof client.rest.repos.listForAuthenticatedUser>>['data']

const filterAuthdUserRepoData = (data: AuthdUserRepoData[number]) => {
    return {
        full_name: data.full_name,
        description: data.description,
        url: data.html_url,
        stars_count: data.stargazers_count,
        watchers_count: data.watchers_count,
        open_issues_count: data.open_issues,
        pushed_at: data.pushed_at,
        created_at: data.created_at,
        updated_at: data.updated_at,
        archived: data.archived,
    }
}


type RepoData = Awaited<ReturnType<typeof client.rest.search.repos>>['data']['items']

const filterRepoData = (data: RepoData[number]) => {
    return {
        full_name: data.full_name,
        description: data.description,
        url: data.html_url,
        stars_count: data.stargazers_count,
        watchers_count: data.watchers_count,
        open_issues_count: data.open_issues,
        pushed_at: data.pushed_at,
        created_at: data.created_at,
        updated_at: data.updated_at,
        archived: data.archived,
    }
}

export const transform = {
    'user': (data: UserRepoData) => data.map(d => filterUserRepoData(d)),
    'org': (data: OrgRepoData) => data.map(d => filterOrgRepoData(d)),
    'me': (data: AuthdUserRepoData) => data.map(d => filterAuthdUserRepoData(d)),
    'default': (data: RepoData) => data.map(d => filterRepoData(d)),
}