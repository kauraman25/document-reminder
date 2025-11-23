'use client'

import { Badge } from '@/components/ui/badge'
import {
  calculateDaysUntilExpiry,
  getExpiryStatus,
  getExpiryMessage,
} from '@/lib/reminder-utils'

export default function ExpiryBadge({ expiryDate }) {
  // Same logic as reminder summary
  const daysLeft = calculateDaysUntilExpiry(expiryDate)
  const status = getExpiryStatus(daysLeft)
  const label = getExpiryMessage(daysLeft)

  let variant = 'outline'

  if (status === 'expired') {
    variant = 'destructive'
  } else if (status === 'urgent') {
    variant = 'destructive'
  } else if (status === 'soon') {
    variant = 'secondary'
  } else if (status === 'warning') {
    variant = 'outline'
  } else {
    variant = 'outline'
  }

  return (
    <Badge variant={variant} className="w-full py-3 justify-center">
      {label}
    </Badge>
  )
}
