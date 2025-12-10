// lib/random.js
import crypto from 'crypto'
export function randomToken(len = 24) {
  return crypto.randomBytes(len).toString('hex')
}
