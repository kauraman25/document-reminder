'use client'

// import { useState, useEffect } from 'react'
import DocumentReminderApp from '@/components/document-reminder-app'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Home() {
  const router = useRouter()
  const [checkedAuth, setCheckedAuth] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() =>{
     const controller = new AbortController()
    let redirected = false
    const check = async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include', signal: controller.signal })
        if (!res.ok) {
          setIsAuthenticated(false)
           if (!redirected) {
            redirected = true
            router.replace('/login')
          }
          return
        } 
        const body = await res.json()
        if (body?.user) {
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
           if (!redirected) {
            redirected = true
            router.replace('/login')
          }
        }
      } catch (err) {
        if (err.name === 'AbortError') {
          // fetch was aborted on unmount — silently ignore
          return
        }
        console.error('Error checking auth status:', err)
        setIsAuthenticated(false)
        if (!redirected) {
          redirected = true
          router.replace('/login')
        }
      } finally {
        setCheckedAuth(true)
      }
    }
    check()
    return () => {controller.abort() }
  },[router])

  if (!checkedAuth) {
    return (
       <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Checking authentication…</p>
      </div>
    )
  }

  if (isAuthenticated) {
    return <DocumentReminderApp />
  }
  return (
    
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Redirecting to login…</p>
    </div>
    
  )
}
