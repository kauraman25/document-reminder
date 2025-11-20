'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import ExpiryBadge from './expiry-badge'
import { Edit2, Trash2 } from 'lucide-react'

export default function DocumentCard({
  document,
  onEdit,
  onDelete,
}) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground truncate">
              {document.name}
            </h3>
            <p className="text-sm text-muted-foreground">{document.type}</p>
          </div>
          <Badge variant="outline" className="whitespace-nowrap">
            {document.category}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Document Details */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Document #</span>
            <span className="font-mono text-foreground">{document.number}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Issued</span>
            <span className="text-foreground">
              {new Date(document.issueDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Expires</span>
            <span className="text-foreground font-semibold">
              {new Date(document.expiryDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Expiry Status Badge */}
        <div>
          <ExpiryBadge expiryDate={document.expiryDate} />
        </div>

        {/* Notes */}
        {document.notes && (
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground">{document.notes}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(document)}
            className="flex-1 gap-1"
          >
            <Edit2 size={16} />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(document.id)}
            className="flex-1 gap-1"
          >
            <Trash2 size={16} />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
