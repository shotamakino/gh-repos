
export type QPObj = Record<string, string | string[]>

export const urlSearchParamsToObject = (qp: URLSearchParams) => {
    return [...qp.entries()].reduce<QPObj>((acc, tup) => {
        const [key,] = tup;

        // we use params getAll for each unique key
        // so skip if we've already seen key
        if (acc.hasOwnProperty(key)) {
            return acc
        }

        acc[key] = qp.getAll(key)
        return acc
    }, {})
}