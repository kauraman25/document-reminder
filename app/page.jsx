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
    let mounted = true
    const check = async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' })
        if (!mounted) return
        if (!res.ok) {
          setIsAuthenticated(false)
          router.push('/login')
          return
        } 
        const body = await res.json()
        if (body?.user) {
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
          router.push('/login')
        }
      } catch (err) {
        console.error('Error checking auth status:', err)
        setIsAuthenticated(false)
        router.push('/login')
      } finally {
        if (mounted) setCheckedAuth(true)
      }
    }
    check()
    return () => { mounted = false }
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
    
      null
    
  )
}
