import { format, parseISO } from 'date-fns'

export function formatCurrency(amount) {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  return `RM ${num.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function formatDate(date) {
  if (!date) return '-'
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'dd MMM yyyy')
}

export function formatDateRange(start, end) {
  return `${formatDate(start)} - ${formatDate(end)}`
}

export function formatDateTime(date) {
  if (!date) return '-'
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'dd MMM yyyy, hh:mm a')
}
