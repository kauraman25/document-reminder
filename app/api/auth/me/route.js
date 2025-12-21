// app/api/auth/me/route.js
import { NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/server-auth'

export async function GET(req) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401, headers: { 'Cache-Control': 'no-store' } })
    return NextResponse.json({ user: { id: user._id.toString(), email: user.email, name: user.name } }, { status: 200, headers: { 'Cache-Control': 'no-store' } })
  } catch (err) {
    console.error('me error', err)
    return NextResponse.json({ message: 'Error' }, { status: 500 })
  }
}
