// app/api/auth/reset-password/route.js
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'

export async function POST(req) {
  try {
    const { token, newPassword } = await req.json()
    if (!token || !newPassword) return NextResponse.json({ message: 'Missing' }, { status: 400 })

    await connectToDatabase()
    const user = await User.findOne({ 'resetToken.token': token })
    if (!user) return NextResponse.json({ message: 'Invalid or expired token' }, { status: 400 })

   const expiresAt = user.resetToken?.expiresAt
    if (!expiresAt || new Date(expiresAt) < new Date()) {
      return NextResponse.json({ message: 'Token expired' }, { status: 400 })
    }
    user.passwordHash = await User.hashPassword(newPassword)
    user.resetToken = undefined
    await user.save()

    return NextResponse.json({ message: 'Password reset successful' })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: 'Error' }, { status: 500 })
  }
}
