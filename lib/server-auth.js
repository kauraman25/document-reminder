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
  let payload
  try {
    // support both sync and async verifyToken implementations
    payload = await Promise.resolve(verifyToken(token))
  } catch (err) {
    // token invalid/expired/forged
    console.warn('token verification failed:', err?.message || err)
    return null
  }  if (!payload || !payload.sub) return null

   try {
    await connectToDatabase()
    const user = await User.findById(payload.sub)
      .select('-passwordHash -verificationToken -resetToken')
      .lean()

    if (!user) return null

    return {
      id: String(user._id),
      email: user.email,
      name: user.name,

    }
  } catch (err) {
    console.error('getUserFromRequest DB error:', err)
    return null
  }
}
