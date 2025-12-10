// app/api/auth/verify/route.js
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'

export async function GET(req) {
  try {
    const url = new URL(req.url)
    const token = url.searchParams.get('token')
    if (!token) return NextResponse.json({ message: 'Missing token' }, { status: 400 })

    await connectToDatabase()
    const user = await User.findOne({ verificationToken: token })
    if (!user) return NextResponse.json({ message: 'Invalid token' }, { status: 400 })

    user.emailVerified = true
    user.verificationToken = undefined
    await user.save()

    // redirect to a frontend success page
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/verify-success`)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: 'Verification failed' }, { status: 500 })
  }
}
