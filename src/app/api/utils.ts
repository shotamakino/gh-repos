
export type QPObj = Record<string, string | string[]>

export const urlSearchParamsToObject = (qp: URLSearchParams) => {
    return [...qp.entries()].reduce<QPObj>((acc, tup) => {
        const [key,] = tup;

        // we use params getAll for each unique key
        // so skip if we've already seen key
        if (acc.hasOwnProperty(key)) {
            return acc
        }

        const vals = qp.getAll(key)
        if (vals.length === 1) { acc[key] = vals[0] }
        else {
            acc[key] = vals
        }
        return acc
    }, {})
}
