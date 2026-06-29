import { differenceInCalendarDays } from 'date-fns'
import { BOOKING_STATUSES } from './constants'

export function calculateDays(startDate, endDate) {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate
  const days = differenceInCalendarDays(end, start)
  return days < 1 ? 1 : days
}

export function calculateTotalCost(dailyRate, days) {
  return parseFloat((dailyRate * days).toFixed(2))
}

export function isDateOverlap(existingStart, existingEnd, newStart, newEnd) {
  const eStart = new Date(existingStart)
  const eEnd = new Date(existingEnd)
  const nStart = new Date(newStart)
  const nEnd = new Date(newEnd)
  return eStart <= nEnd && eEnd >= nStart
}

export function isCarAvailableForDates(carId, startDate, endDate, bookings) {
  const activeBookings = bookings.filter(
    (b) =>
      String(b.carId) === String(carId) &&
      b.bookingStatus !== BOOKING_STATUSES.CANCELLED &&
      b.bookingStatus !== BOOKING_STATUSES.REJECTED &&
      b.bookingStatus !== BOOKING_STATUSES.RETURNED
  )
  return !activeBookings.some((b) => isDateOverlap(b.startDate, b.endDate, startDate, endDate))
}
