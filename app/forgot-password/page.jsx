'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ForgotPage() {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState(null)

  const handle = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    const b = await res.json()
    setMsg(b?.message || 'Check your email')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Forgot Password</CardTitle>
          <CardDescription>
            Enter your registered email and we will send you a reset link.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {msg && (
            <Alert className="mb-4">
              <AlertDescription>{msg}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handle} className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input 
                type="email"
                placeholder="example@email.com"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full">
              Send Reset Link
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
