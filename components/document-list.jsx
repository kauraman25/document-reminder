'use client'

import { useState } from 'react'
import DocumentCard from './document-card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export default function DocumentList({
  documents,
  onEdit,
  onDelete,
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [sortBy, setSortBy] = useState('expiry')

  const categories = ['all', ...new Set(documents.map(doc => doc.category))]

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.number.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      filterCategory === 'all' || doc.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    if (sortBy === 'expiry') {
      return new Date(a.expiryDate) - new Date(b.expiryDate)
    } else if (sortBy === 'name') {
      return a.name.localeCompare(b.name)
    } else if (sortBy === 'category') {
      return a.category.localeCompare(b.category)
    }
    return 0
  })

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="expiry">Sort by Expiry Date</SelectItem>
            <SelectItem value="name">Sort by Name</SelectItem>
            <SelectItem value="category">Sort by Category</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Document Grid */}
      {sortedDocuments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedDocuments.map(doc => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No documents found</p>
        </div>
      )}
    </div>
  )
}
