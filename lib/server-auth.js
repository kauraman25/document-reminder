// lib/server-auth.js
import { verifyToken } from './auth'
import { connectToDatabase } from './mongodb'
import User from '@/models/User'

export async function getUserFromRequest(req) {
  let token = null

  // in app route handlers, req.cookies is a RequestCookieStore
  try {
    const cookie = req.cookies?.get?.('token') ?? null
    token = cookie ? cookie.value : (req.cookies?.token ?? null)
  } catch (e) {
    // fallback to header parsing
    const cookieHeader = req.headers?.get?.('cookie') ?? req.headers?.cookie
    if (cookieHeader) {
      const m = cookieHeader.match(/token=([^;]+)/)
      token = m ? m[1] : null
    }
  }

  if (!token) return null
  const payload = verifyToken(token)
  if (!payload || !payload.sub) return null

  await connectToDatabase()
  const user = await User.findById(payload.sub).select('-passwordHash -verificationToken -resetToken')
  return user || null
}
