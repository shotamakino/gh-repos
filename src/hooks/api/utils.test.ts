import { createAPIURL } from "./utils";
import { encodeQP } from './utils'

describe('createAPIURL', () => {
    test('resolves to correct base URL', () => {
        // NODE_ENV set to 'development' by jest
        expect(createAPIURL()).toBe('http://localhost:3000/api')
    })

    test('resolves to correct resource', () => {
        expect(createAPIURL('/me')).toBe('http://localhost:3000/api/me')
    })

    test('resolves to correct resource', () => {
        expect(createAPIURL('/me')).toBe('http://localhost:3000/api/me')
    })

    test('resolves to correct resource with query', () => {
        const today = (new Date()).toISOString()
        expect(createAPIURL('/me', { since: today })).toBe(`http://localhost:3000/api/me?since=${encodeQP(today)}`)
    })

    test('handles undefined parameters', () => {
        const C = null
        expect(createAPIURL('/me', { A: 'value', B: undefined, C })).toBe(`http://localhost:3000/api/me?A=value`)
    })
})
