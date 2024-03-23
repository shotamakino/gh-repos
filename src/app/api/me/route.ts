import { NextRequest } from 'next/server'
import client from '@api/clients/github'

export async function GET(req: NextRequest) {
    const user = await client.rest.users.getAuthenticated()
    return Response.json(user)
}