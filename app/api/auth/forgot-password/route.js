// app/api/auth/forgot-password/route.js
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'
import { randomToken } from '@/lib/random'
import { sendEmail } from '@/lib/email'

export async function POST(req) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ message: 'Missing' }, { status: 400 })

    await connectToDatabase()
    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ message: 'If that email exists, a reset link has been sent' })
    }

    const token = randomToken(24)
    user.resetToken = { token, expiresAt: new Date(Date.now() + 1000 * 60 * 60) } // 1 hour
    await user.save()

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`
    await sendEmail({ to: user.email, subject: 'Password reset', html: `<p>Reset: <a href="${resetUrl}">Reset password</a></p>` })

    return NextResponse.json({ message: 'If that email exists, a reset link has been sent' })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: 'Error' }, { status: 500 })
  }
}
