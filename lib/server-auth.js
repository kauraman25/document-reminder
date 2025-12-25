// lib/server-auth.js
import { verifyToken } from './auth'
import { connectToDatabase } from './mongodb'
import User from '@/models/User'

export async function getUserFromRequest(req) {
  let token = null

  try {
    const cookie = req.cookies?.get?.('token')
    token = cookie?.value
  } catch {
    const cookieHeader = req.headers?.get?.('cookie')
    if (cookieHeader) {
      const m = cookieHeader.match(/token=([^;]+)/)
      token = m?.[1]
    }
  }

  if (!token) return null

  const payload = verifyToken(token)
  if (!payload?.sub) return null

  await connectToDatabase()

  const user = await User.findById(payload.sub)
    .select('-passwordHash -verificationToken -resetToken')

  return user || null   // ✅ full mongoose document
}
