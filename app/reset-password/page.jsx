// app/reset-password/page.jsx
import React, { Suspense } from 'react'
import ResetClient from './ResetClient'

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading…</div>}>
      <ResetClient />
    </Suspense>
  )
}
