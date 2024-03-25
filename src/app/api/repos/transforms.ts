import client from '@api/_clients/github'

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
    'default': (data: RepoData) => data.map(d => filterRepoData(d)),
}