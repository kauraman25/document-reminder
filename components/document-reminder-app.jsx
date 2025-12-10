'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import Header from './header'
import DocumentList from './document-list'
import DocumentModal from './document-modal'
import ReminderSummary from './reminder-summary'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { DUMMY_DOCUMENTS } from '@/lib/dummy-data'
import { useRouter } from 'next/navigation'

export default function DocumentReminderApp() {
  const { theme } = useTheme()
  const router = useRouter()
  const [documents, setDocuments] = useState([])
  // const [isModalOpen, setIsModalOpen] = useState(false)
  // const [editingDocument, setEditingDocument] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
   const fetchDocuments = async () => {
      try {
        setIsLoading(true)
        const res = await fetch('/api/documents', {credentials: 'include'})
        if (!res.ok) {
          console.error('Failed to fetch documents')
          return
        }

        const data = await res.json()
        setDocuments(data)
      } catch (err) {
        console.error('Error fetching documents:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDocuments()
  }, [])

  const handleAddDocument = () => {
    router.push('/documents/new')
  }

  const handleEditDocument = (doc) => {
    router.push(`/documents/${doc.id}`)
  }

  const handleDeleteDocument = async (id) => {
    try {
      const res = await fetch(`/api/documents/${id}`, {
        method: 'DELETE', credentials: 'include'
      })

      if (!res.ok) {
        console.error('Failed to delete document')
        return
      }

      setDocuments(prev => prev.filter(doc => doc.id !== id))
    } catch (err) {
      console.error('Error deleting document:', err)
    }
  }

  // const handleSaveDocument = async (formData) => {
  //   try {
  //     if (editingDocument) {
  //       const res = await fetch(`/api/documents/${editingDocument.id}`, {
  //         method: 'PUT',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify(formData),
  //       })

  //       if (!res.ok) {
  //         console.error('Failed to update document')
  //         return
  //       }

  //       const updated = await res.json()

  //       setDocuments(prev =>
  //         prev.map(doc => (doc.id === editingDocument.id ? updated : doc))
  //       )
  //     } else {
  //       const res = await fetch('/api/documents', {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify(formData),
  //       })

  //       if (!res.ok) {
  //         console.error('Failed to create document')
  //         return
  //       }

  //       const created = await res.json()
  //       setDocuments(prev => [...prev, created])
  //     }

  //     setIsModalOpen(false)
  //     setEditingDocument(null)
  //   } catch (err) {
  //     console.error('Error saving document:', err)
  //   }
  // }

  // const handleCloseModal = () => {
  //   setIsModalOpen(false)
  //   setEditingDocument(null)
  // }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Document Management
            </h1>
            <p className="text-muted-foreground">
              Track and manage your important documents with expiry reminders
            </p>
          </div>
          <Button
            onClick={handleAddDocument}
            className="gap-2 cursor-pointer"
          >
            <Plus size={20} />
            Add Document
          </Button>
        </div>
{isLoading && (
          <p className="text-muted-foreground mb-4">Loading documents...</p>
        )}
        <ReminderSummary documents={documents} />

        <DocumentList
          documents={documents}
          onEdit={handleEditDocument}
          onDelete={handleDeleteDocument}
        />
      </div>

      {/* <DocumentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveDocument}
        editingDocument={editingDocument}
      /> */}
    </div>
  )
}
