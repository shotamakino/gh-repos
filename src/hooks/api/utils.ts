import { encode } from 'punycode'
import joinPath from 'url-join'

type FetchParams = Parameters<typeof fetch>

/**
 * Fetches the url for the API server
 * @returns the url string of the api server
 */
export const resolveAPIHost = () => {
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
        return 'http://localhost:3000'
    }

    if (!process.env.API_HOST) {
        throw new Error('requires GitHub Personal Access Token to be specified in environment variable GH_PAT')
    }

    return process.env.API_HOST
}

/**
 * Inconsistencies in implementation of JS encodedURIComponent
 * https://stackoverflow.com/a/62969380
 * @param qp 
 * @returns 
 */
export const encodeQP = (qp: string) => {
    return encodeURIComponent(qp).replace(/[!'()*]/g, function (c) {
        return '%' + c.charCodeAt(0).toString(16).toUpperCase()
    })
}

/**
 * Utilized by SWR library to build a value for its internal cache.
 * Use apiFetcher if you're querying from the API server
 * @param args 
 * @returns 
 */
export const fetcher = (...args: FetchParams) => fetch(...args).then(res => res.json())

export type QueryParams = Record<string, string | string[] | number | number[]>

/**
 * Helper for constructing arbitrary URLs with parameters.
 * If you require to resolve to the API server, use
 * createAPIURL instead. Convention is to denote arrays with
 * multiple of the same query param keys
 * @param baseURL a URL object resolving to the base url to
 * construct the whole url as in JS notation to URL constructor.
 * @param relative a string containing any relative paths to resolve
 * to.
 * @returns a string of the whole URL.
 */
export const createURL = (baseURL: URL, relative: string = '') => (params: QueryParams) => {
    const url = new URL(relative, baseURL)

    url.search = Object.entries(params).map(([key, val]) => {
        if (Array.isArray(val)) {
            return val.map(v => {
                `${encodeQP(key)}=${encodeQP(v.toString())}`
            }).join('&')
        } else {
            return `${encodeQP(key)}=${encodeQP(val.toString())}`
        }
    }).join('&')

    return url.href
}

/**
 * Creates the full url for with the resource
 * path and the query params. Use this with SWR in order
 * to create a consistent key that will be queried by SWR
 * @param path 
 * @param params 
 * @returns 
 */
export const createAPIURL = (path: string = '', params: QueryParams = {}) => {
    const p = joinPath('api', path)
    const base = new URL(resolveAPIHost())
    return createURL(base, p)(params)
}