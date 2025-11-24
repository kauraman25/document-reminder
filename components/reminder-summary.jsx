import { AlertCircle, CheckCircle } from 'lucide-react'
import { calculateReminderSummary, getExpiryMessage } from '@/lib/reminder-utils'

export default function ReminderSummary({ documents }) {
 
  if (!documents || documents.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 p-5 mb-6">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          <p className="font-medium mb-1">No documents found</p>
          <p>
            Add your first document to start tracking expiry reminders here.
          </p>
        </div>
      </div>
    )
  }
 
  const summary = calculateReminderSummary(documents)

  // Counts and prioritization
  const expiredCount = Array.isArray(summary.expired) ? summary.expired.length : 0

  // Flatten all summary items safely
  const allItems = Object.keys(summary).reduce((acc, key) => {
    const arr = Array.isArray(summary[key]) ? summary[key] : []
    return acc.concat(arr)
  }, [])

  // Expiring items (non-expired) sorted by soonest
  const expiringItems = allItems
    .filter(i => typeof i.daysLeft === 'number' && i.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft)

  // Show banner if anything is expired or any items are expiring
  const hasExpiringDocuments = expiredCount > 0 || expiringItems.length > 0

  if (hasExpiringDocuments) {
    return (
      <div className="rounded-lg bg-red-900/40 dark:bg-red-950/50 border border-red-700/50 dark:border-red-800/60 p-5 mb-6">
        <div className="flex items-start gap-4">
          <AlertCircle className="h-7 w-7 text-red-600 dark:text-red-500 shrink-0 mt-1" />
          <div className="flex-1 min-w-0">
              <h3 className="font-bold text-red-700 dark:text-red-400 text-lg">
                {expiringItems.length} document expiring soon • {expiredCount} document expired
              </h3>
              <div className="text-sm text-red-700/85 dark:text-red-400/85 mt-1.5">
                {expiringItems.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1">
                    {expiringItems.slice(0, 5).map((doc) => (
                      <li key={doc.id}>
                        {doc.name || doc.number || doc.id} — {getExpiryMessage(doc.daysLeft)}
                      </li>
                    ))}
                    {expiringItems.length > 5 ? <li>and {expiringItems.length - 5} more...</li> : null}
                  </ul>
                ) : (
                  <p>There are {expiredCount} expired document{expiredCount !== 1 ? 's' : ''}.</p>
                )}
              </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg bg-green-900/20 dark:bg-green-950/30 border border-green-700/30 dark:border-green-800/40 p-5 mb-6">
      <div className="flex items-start gap-4">
  <CheckCircle className="h-7 w-7 text-green-600 dark:text-green-500 shrink-0 mt-1" />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-green-700 dark:text-green-400 text-lg">
            All clear
          </h3>
          <p className="text-sm text-green-700/85 dark:text-green-400/85 mt-1.5">
            All your documents are up to date and no expiries coming soon
          </p>
        </div>
      </div>
    </div>
  )
}
