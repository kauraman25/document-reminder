'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import DocumentForm from '@/components/document-form'

export default function EditDocumentPage() {
  const { id } = useParams()
  const router = useRouter()
  const [document, setDocument] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const res = await fetch(`/api/documents/${id}`)
        if (!res.ok) {
          console.error('Failed to fetch document')
          return
        }
        const data = await res.json()
        setDocument(data)
      } catch (err) {
        console.error('Error fetching document:', err)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchDocument()
  }, [id])

  const handleUpdate = async (formData) => {
    try {
      const res = await fetch(`/api/documents/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        console.error('Failed to update document')
        return
      }

      await res.json()
      router.push('/')
    } catch (err) {
      console.error('Error updating document:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <p className="text-muted-foreground">Loading document...</p>
        </div>
      </div>
    )
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <p className="text-destructive">Document not found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Edit Document</h1>
        <DocumentForm
          initialData={document}
          onSubmit={handleUpdate}
          submitLabel="Update Document"
        />
      </div>
    </div>
  )
}
