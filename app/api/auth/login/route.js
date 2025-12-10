// app/api/auth/login/route.js
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'
import { signToken, makeCookieHeader } from '@/lib/auth'

export async function POST(req) {
  try {
    const body = await req.json()
    const { email, password } = body
    if (!email || !password) return NextResponse.json({ message: 'Missing' }, { status: 400 })

    await connectToDatabase()
    const user = await User.findOne({ email })
    if (!user) return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })

    const ok = await user.comparePassword(password)
    if (!ok) return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })

    if (!user.emailVerified) return NextResponse.json({ message: 'Please verify your email before logging in' }, { status: 403 })

    const token = signToken({ sub: user._id.toString(), email: user.email })
    const cookie = makeCookieHeader(token)

    return NextResponse.json(
      { message: 'Logged in', user: { id: user._id.toString(), email: user.email, name: user.name } },
      { status: 200, headers: { 'Set-Cookie': cookie } }
    )
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: 'Login error' }, { status: 500 })
  }
}
