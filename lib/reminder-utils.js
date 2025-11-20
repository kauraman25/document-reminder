// Utility functions for calculating document expiry reminders

export const calculateDaysUntilExpiry = (expiryDate) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const expiry = new Date(expiryDate)
  expiry.setHours(0, 0, 0, 0)
  
  const timeDiff = expiry.getTime() - today.getTime()
  const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24))
  
  return daysLeft
}

export const getExpiryStatus = (daysLeft) => {
  if (daysLeft < 0) return 'expired'
  // Treat documents expiring today as urgent so they are included in the
  // `urgent` array used by the UI. Returning 'today' previously caused
  // summary['today'] to be undefined and `.push` to fail.
  if (daysLeft <= 2) return 'urgent'
  // Consider items expiring within two weeks as "soon" (priority)
  if (daysLeft <= 14) return 'soon'
  if (daysLeft <= 30) return 'warning'
  return 'safe'
}

export const getExpiryMessage = (daysLeft) => {
  if (daysLeft < 0) return `Expired ${Math.abs(daysLeft)} days ago`
  if (daysLeft === 0) return 'Expires today'
  if (daysLeft === 1) return '1 day left'
  // For the next two weeks, show days left (more precise)
  if (daysLeft <= 14) return `${daysLeft} days left`
  if (daysLeft <= 30) return `${Math.ceil(daysLeft / 7)} weeks left`
  if (daysLeft <= 365) return `${Math.ceil(daysLeft / 30)} months left`
  return `${Math.ceil(daysLeft / 365)} years left`
}

export const calculateReminderSummary = (documents) => {
  const summary = {
    expired: [],
    urgent: [],
    soon: [],
    warning: [],
    safe: []
  }

  // Defensive: if documents isn't an array, return empty summary
  if (!Array.isArray(documents)) return summary

  documents.forEach(doc => {
    // Guard against missing doc or missing expiryDate
    if (!doc || !doc.expiryDate) {
      summary.safe.push({
        ...doc,
        daysLeft: null,
        status: 'safe'
      })
      return
    }

    const daysLeft = calculateDaysUntilExpiry(doc.expiryDate)
    const status = getExpiryStatus(daysLeft)

    // Ensure the summary bucket exists (extra safety)
    if (!Array.isArray(summary[status])) {
      summary[status] = []
    }

    summary[status].push({
      ...doc,
      daysLeft,
      status
    })
  })

  return summary
}

export const generateReminderText = (summary) => {
  const parts = []

  if (summary.expired.length > 0) {
    parts.push(`${summary.expired.length} document${summary.expired.length !== 1 ? 's' : ''} expired`)
  }

  if (summary.urgent.length > 0) {
    parts.push(`${summary.urgent.length} document${summary.urgent.length !== 1 ? 's' : ''} expiring soon (0-2 days)`)
  }

  if (summary.soon.length > 0) {
    parts.push(`${summary.soon.length} document${summary.soon.length !== 1 ? 's' : ''} expiring this week`)
  }

  if (summary.warning.length > 0) {
    parts.push(`${summary.warning.length} document${summary.warning.length !== 1 ? 's' : ''} expiring within a month`)
  }

  return parts.length > 0 ? parts.join(' • ') : 'All documents are up to date'
}
