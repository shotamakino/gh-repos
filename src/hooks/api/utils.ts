
type FetchParams = Parameters<typeof fetch>

export const fetcher = (...args: FetchParams) => fetch(...args).then(res => res.json())