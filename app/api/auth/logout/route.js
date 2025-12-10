// app/api/auth/logout/route.js
import { NextResponse } from 'next/server'
import { clearCookieHeader } from '@/lib/auth'

export async function POST() {
  const cookie = clearCookieHeader()
  return NextResponse.json({ message: 'Logged out' }, { status: 200, headers: { 'Set-Cookie': cookie } })
}
