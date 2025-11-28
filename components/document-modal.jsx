'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const CATEGORIES = [
  'Personal',
  'Professional',
  'Travel',
  'Financial',
  'Vehicle',
  'Health',
  'Legal',
  'Other',
]

// const TYPES = [
//   'Passport',
//   'Driver License',
//   'Identity Card',
//   'Visa',
//   'License',
//   'Certification',
//   'Insurance',
//   'Registration',
//   'Contract',
//   'Other',
// ]
import { DEFAULT_TYPES } from '../lib/document-types'
export default function DocumentModal({
  isOpen,
  onClose,
  onSave,
  editingDocument,
}) {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    number: '',
    issueDate: '',
    expiryDate: '',
    category: '',
    notes: '',
  })
  const [types, setTypes] = useState([])
   const [loadingTypes, setLoadingTypes] = useState(false)
  const [newType, setNewType] = useState('')
  
   //  fetch types from backend when modal opens
  useEffect(() => {
    if (!isOpen) return

    const fetchTypes = async () => {
      try {
        setLoadingTypes(true)
        const res = await fetch('/api/document-types')
        if (!res.ok) throw new Error('Failed to load types')

        const data = await res.json()
        const names = Array.isArray(data) ? data.map(t => t.name) : []

        setTypes(names.length ? names : DEFAULT_TYPES)
      } catch (err) {
        console.error(err)
        setTypes(DEFAULT_TYPES) // fallback to defaults on error
      } finally {
        setLoadingTypes(false)
      }
    }

    fetchTypes()
  }, [isOpen])
  
  useEffect(() => {
    if (editingDocument) {
      setFormData(editingDocument)
    } else {
      setFormData({
        name: '',
        type: '',
        number: '',
        issueDate: '',
        expiryDate: '',
        category: '',
        notes: '',
      })
    }
  }, [editingDocument, isOpen])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (
      formData.name &&
      formData.type &&
      formData.number &&
      formData.issueDate &&
      formData.expiryDate &&
      formData.category
    ) {
      onSave(formData)
    }
  }

   //  add new type -> save in DB + set in dropdown
  const handleAddType = async () => {
    const value = newType.trim()
    if (!value) return

    try {
      const res = await fetch('/api/document-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: value }),
      })

      if (!res.ok) {
        console.error('Failed to add type')
        return
      }

      const saved = await res.json()
      const typeName = saved.name || value

      setTypes(prev =>
        prev.includes(typeName) ? prev : [...prev, typeName]
      )

      setFormData(prev => ({
        ...prev,
        type: typeName,
      }))

      setNewType('')
    } catch (err) {
      console.error('Error adding type:', err)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingDocument ? 'Edit Document' : 'Add New Document'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Document Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Passport"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Document Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleSelectChange('type', value)}
                disabled={loadingTypes}
              >
                <SelectTrigger>
                  <SelectValue  placeholder={loadingTypes ? 'Loading...' : 'Select type'} />
                </SelectTrigger>
                <SelectContent>
                  {types.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

               <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Add new type (e.g., PAN Card)"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="whitespace-nowrap cursor-pointer"
                  onClick={handleAddType}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>

          {/* Document Number */}
          <div className="space-y-2">
            <Label htmlFor="number">Document Number *</Label>
            <Input
              id="number"
              name="number"
              placeholder="e.g., P123456789"
              value={formData.number}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issueDate">Issue Date *</Label>
              <Input
                id="issueDate"
                name="issueDate"
                type="date"
                value={formData.issueDate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date *</Label>
              <Input
                id="expiryDate"
                name="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleSelectChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Add any additional notes..."
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
            />
          </div>

          {/* Actions */}
          <DialogFooter>
            <Button className="cursor-pointer" type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button className="cursor-pointer" type="submit">
              {editingDocument ? 'Update Document' : 'Add Document'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
