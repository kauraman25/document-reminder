// Functions for calculating expiry days and reminder text

export function calculateDaysLeft(expiryDate) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const expiry = new Date(expiryDate)
  expiry.setHours(0, 0, 0, 0)
  
  const diffTime = expiry - today
  const daysLeft = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  return daysLeft
}

export function calculateReminderText(expiryDate) {
  const daysLeft = calculateDaysLeft(expiryDate)

  if (daysLeft < 0) {
    return 'EXPIRED'
  } else if (daysLeft === 0) {
    return 'EXPIRES TODAY'
  } else if (daysLeft === 1) {
    return '1 day left'
  } else if (daysLeft <= 14) {
    return `${daysLeft} days left`
  } else if (daysLeft <= 28) {
    const weeks = Math.floor(daysLeft / 7)
    const days = daysLeft % 7
    if (days === 0) {
      return `${weeks} week${weeks > 1 ? 's' : ''} left`
    }
    return `${weeks} week${weeks > 1 ? 's' : ''} ${days} day${days > 1 ? 's' : ''} left`
  } else {
    const weeks = Math.floor(daysLeft / 7)
    return `${weeks} weeks left`
  }
}

export function getStatusColor(expiryDate) {
  const daysLeft = calculateDaysLeft(expiryDate)

  if (daysLeft < 0) {
    return 'bg-destructive/20 text-destructive'
  } else if (daysLeft <= 14) {
    return 'bg-destructive/20 text-destructive'
  } else if (daysLeft <= 28) {
    return 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
  } else if (daysLeft <= 60) {
    return 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
  } else {
    return 'bg-green-500/20 text-green-600 dark:text-green-400'
  }
}
