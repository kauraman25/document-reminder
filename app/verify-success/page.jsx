'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function VerifySuccess() {
  const router = useRouter()

  useEffect(() => {
    // redirect to login with a query param so login page can show a success message
    const t = setTimeout(() => {
      router.replace('/login?verified=1')
    }, 2000)

    return () => clearTimeout(t)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-lg w-full text-center">
        <h2 className="text-2xl font-semibold mb-3">Email verified</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Your email has been verified. Redirecting to the login page…
        </p>
        <p className="text-xs text-muted-foreground">If you are not redirected, <a href="/login" className="text-primary underline">click here to log in</a>.</p>
      </div>
    </div>
  )
}
