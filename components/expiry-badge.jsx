'use client'

import { Badge } from '@/components/ui/badge'

export default function ExpiryBadge({ expiryDate }) {
  const today = new Date()
  const expiry = new Date(expiryDate)
  const daysLeft = Math.floor((expiry - today) / (1000 * 60 * 60 * 24))
  const weeksLeft = Math.floor(daysLeft / 7)
  const monthsLeft = Math.floor(daysLeft / 30)

  let status = 'active'
  let label = ''
  let variant = 'default'

  if (daysLeft < 0) {
    status = 'expired'
    label = 'Expired'
    variant = 'destructive'
  } else if (daysLeft === 0) {
    status = 'expiring-today'
    label = 'Expiring Today'
    variant = 'destructive'
  } else if (daysLeft <= 7) {
    status = 'critical'
    label = `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`
    variant = 'destructive'
  } else if (daysLeft <= 14) {
    status = 'warning'
    label = `2 weeks left`
    variant = 'secondary'
  } else if (daysLeft <= 30) {
    status = 'warning'
    label = `${weeksLeft} week${weeksLeft !== 1 ? 's' : ''} left`
    variant = 'secondary'
  } else if (monthsLeft <= 4) {
    status = 'caution'
    label = `${monthsLeft} month${monthsLeft !== 1 ? 's' : ''} left`
    variant = 'outline'
  } else {
    status = 'active'
    label = `${monthsLeft} months left`
    variant = 'outline'
  }

  return (
    <Badge variant={variant} className="w-full py-3 justify-center">
      {label}
    </Badge>
  )
}
