'use client'

import { useState, useEffect } from 'react'
import { ThemeProvider } from 'next-themes'
import DocumentReminderApp from '@/components/document-reminder-app'

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <DocumentReminderApp />
    </ThemeProvider>
  )
}
