import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'
import { randomToken } from '@/lib/random'
import { sendEmail } from '@/lib/email'

export async function POST(req) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ message: 'Email required' }, { status: 400 })

    await connectToDatabase()
    const user = await User.findOne({ email })

    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 })
    if (user.emailVerified) return NextResponse.json({ message: 'Already verified' }, { status: 400 })

    const token = randomToken(20)
    user.verificationToken = token
    await user.save()

    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify?token=${token}`

    await sendEmail({
      to: email,
      subject: 'Verify your Document Reminder account',
      html: `<p>Click to verify: <a href="${verifyUrl}">verify email</a></p>`
    })

    return NextResponse.json({ message: 'Verification email resent' }, { status: 200 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ message: 'Error' }, { status: 500 })
  }
}
