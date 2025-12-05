'use client'

import { useRouter } from 'next/navigation'
import DocumentForm from '@/components/document-form'
import Head from 'next/head'
import Header from '@/components/header'
export default function NewDocumentPage() {
  const router = useRouter()

  const handleCreate = async (formData) => {
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        console.error('Failed to create document')
        return
      }

      await res.json()
      router.push('/')      // back to main list
    } catch (err) {
      console.error('Error creating document:', err)
    }
  }

  return (
    <>
    <Header/>
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl text-center  font-bold mb-8">Add New Document</h1>
        <DocumentForm onSubmit={handleCreate} submitLabel="Add Document" />
      </div>
    </div>
    </>
  )
}
