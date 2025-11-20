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

export default function DocumentReminderApp() {
  const { theme } = useTheme()
  const [documents, setDocuments] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDocument, setEditingDocument] = useState(null)

  useEffect(() => {
    setDocuments(DUMMY_DOCUMENTS)
  }, [])

  const handleAddDocument = () => {
    setEditingDocument(null)
    setIsModalOpen(true)
  }

  const handleEditDocument = (doc) => {
    setEditingDocument(doc)
    setIsModalOpen(true)
  }

  const handleDeleteDocument = (id) => {
    setDocuments(documents.filter(doc => doc.id !== id))
  }

  const handleSaveDocument = (formData) => {
    if (editingDocument) {
      setDocuments(documents.map(doc =>
        doc.id === editingDocument.id ? { ...formData, id: doc.id } : doc
      ))
    } else {
      const newDocument = {
        ...formData,
        id: Date.now().toString(),
      }
      setDocuments([...documents, newDocument])
    }
    setIsModalOpen(false)
    setEditingDocument(null)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingDocument(null)
  }

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
            className="gap-2"
          >
            <Plus size={20} />
            Add Document
          </Button>
        </div>

        <ReminderSummary documents={documents} />

        <DocumentList
          documents={documents}
          onEdit={handleEditDocument}
          onDelete={handleDeleteDocument}
        />
      </div>

      <DocumentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveDocument}
        editingDocument={editingDocument}
      />
    </div>
  )
}
