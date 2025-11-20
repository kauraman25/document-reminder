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

const TYPES = [
  'Passport',
  'Driver License',
  'Identity Card',
  'Visa',
  'License',
  'Certification',
  'Insurance',
  'Registration',
  'Contract',
  'Other',
]

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
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {TYPES.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editingDocument ? 'Update Document' : 'Add Document'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
