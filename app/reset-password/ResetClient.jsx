// app/reset-password/ResetClient.jsx
'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff } from "lucide-react"

export default function ResetClient() {
  const params = useSearchParams()
  const token = params?.get('token') || ''
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState(null)
  const [variant, setVariant] = useState('info')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handle = async (e) => {
    e.preventDefault()
    if (password.length < 6) {
      setMsg('Password must be at least 6 characters')
      setVariant('destructive')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password })
      })
      const b = await res.json()
      setMsg(b?.message || (res.ok ? 'Password reset successful' : 'Unable to reset password'))
      setVariant(res.ok ? 'success' : 'destructive')

      if (res.ok) router.push('/login')
    } catch (err) {
      console.error(err)
      setMsg('An error occurred. Please try again.')
      setVariant('destructive')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Reset Password</CardTitle>
          <CardDescription>Set a new password for your account.</CardDescription>
        </CardHeader>

        <CardContent>
          {msg && (
            <Alert className="mb-4" variant={variant}>
              <AlertDescription>{msg}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handle} className="space-y-4">
            <div className="space-y-2 relative">
              <Label>New Password</Label>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter new password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(s => !s)}
                className="absolute right-3 top-[58px] inline-flex items-center justify-center rounded text-sm p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              <p className="text-sm text-muted-foreground mt-1">Password should be at least 6 characters.</p>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Resetting…' : 'Reset Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
