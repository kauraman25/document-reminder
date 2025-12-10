// app/api/auth/signup/route.js
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'
import { randomToken } from '@/lib/random'
import { sendEmail } from '@/lib/email'

export async function POST(req) {
  try {
    const body = await req.json()
    const { email, password, name } = body
    if (!email || !password) return NextResponse.json({ message: 'Missing' }, { status: 400 })

    await connectToDatabase()
    const existing = await User.findOne({ email })
    if (existing) return NextResponse.json({ message: 'Email already in use' }, { status: 400 })

    const passwordHash = await User.hashPassword(password)
    const verificationToken = randomToken(20)

    await User.create({ email, name, passwordHash, verificationToken, emailVerified: false })

    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify?token=${verificationToken}`

    await sendEmail({
      to: email,
      subject: 'Verify your Document Reminder account',
      html: `<p>Hello ${name || ''},</p>
             <p>Please verify your email by clicking the link below:</p>
             <p><a href="${verifyUrl}">verify email</a></p>`,
    })

    return NextResponse.json({ message: 'Signup successful — check your email for verification' }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: 'Error creating user' }, { status: 500 })
  }
}
