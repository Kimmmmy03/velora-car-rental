import { supabase } from '@/services/supabaseClient'
import { BOOKING_STATUSES, CAR_STATUSES } from '@/utils/constants'
import { isDateOverlap } from '@/utils/bookingCalculations'
import { updateCarStatus } from '@/services/carService'

// ---------------------------------------------------------------------------
// State machine: booking status → required car status.
// Exported so UIs can mirror car-row updates locally without refetching.
// ---------------------------------------------------------------------------
//   PENDING   → RESERVED   (created by customer, not yet approved)
//   APPROVED  → RENTED     (admin approved, car is out)
//   RETURNED  → AVAILABLE  (admin marked returned)
//   REJECTED  → AVAILABLE  (admin rejected)
//   CANCELLED → AVAILABLE  (customer cancelled)
export const CAR_STATUS_FOR_BOOKING = {
  [BOOKING_STATUSES.PENDING]:   CAR_STATUSES.RESERVED,
  [BOOKING_STATUSES.APPROVED]:  CAR_STATUSES.RENTED,
  [BOOKING_STATUSES.RETURNED]:  CAR_STATUSES.AVAILABLE,
  [BOOKING_STATUSES.REJECTED]:  CAR_STATUSES.AVAILABLE,
  [BOOKING_STATUSES.CANCELLED]: CAR_STATUSES.AVAILABLE,
}

// Maps a Supabase row (snake_case columns) to the camelCase shape used throughout the app.
function mapBooking(row) {
  return {
    bookingId: row.booking_id,
    userId: row.user_id,
    carId: row.car_id,
    startDate: row.start_date,
    endDate: row.end_date,
    totalCost: parseFloat(row.total_cost),
    bookingStatus: row.booking_status,
    hasReviewed: row.has_reviewed ?? false,
    createdAt: row.created_at,
  }
}

export async function isCarAvailable(carId, startDate, endDate) {
  // Fetch only the active (PENDING or APPROVED) bookings for this car, then
  // check for date overlap client-side using the existing utility.
  const { data, error } = await supabase
    .from('bookings')
    .select('start_date, end_date')
    .eq('car_id', carId)
    .in('booking_status', [BOOKING_STATUSES.PENDING, BOOKING_STATUSES.APPROVED])
  if (error) throw error
  return !data.some((b) => isDateOverlap(b.start_date, b.end_date, startDate, endDate))
}

export async function createBooking({ userId, carId, startDate, endDate, totalCost }) {
  const available = await isCarAvailable(carId, startDate, endDate)
  if (!available) throw new Error('This car is not available for the selected dates')

  // Insert booking (PENDING) + flip car to RESERVED in parallel.
  // Previously the car status was never updated at creation time, leaving a
  // PENDING booking against an "AVAILABLE" car — a classic state-drift bug.
  const [bookingResult, carResult] = await Promise.all([
    supabase
      .from('bookings')
      .insert({
        user_id: userId,
        car_id: carId,
        start_date: startDate,
        end_date: endDate,
        total_cost: parseFloat(totalCost),
        booking_status: BOOKING_STATUSES.PENDING,
      })
      .select()
      .single(),
    supabase
      .from('cars')
      .update({ status: CAR_STATUSES.RESERVED })
      .eq('car_id', carId),
  ])
  if (bookingResult.error) throw bookingResult.error
  if (carResult.error) throw carResult.error
  return mapBooking(bookingResult.data)
}

export async function getBookingsByUser(userId) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data.map(mapBooking)
}

export async function getAllBookings() {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data.map(mapBooking)
}

/**
 * Cancel a booking and flip the car back to AVAILABLE.
 * `carId` is optional — if supplied, both updates run in parallel via
 * Promise.all. Otherwise we derive it from the returned booking row and
 * update the car afterwards.
 */
export async function cancelBooking(bookingId, carId = null) {
  if (carId) {
    const [bookingResult, carResult] = await Promise.all([
      supabase
        .from('bookings')
        .update({ booking_status: BOOKING_STATUSES.CANCELLED })
        .eq('booking_id', bookingId)
        .select()
        .single(),
      supabase
        .from('cars')
        .update({ status: CAR_STATUSES.AVAILABLE })
        .eq('car_id', carId),
    ])
    if (bookingResult.error) throw bookingResult.error
    if (carResult.error) throw carResult.error
    return mapBooking(bookingResult.data)
  }

  // Fallback: fetch the booking first to learn carId, then update the car.
  const { data, error } = await supabase
    .from('bookings')
    .update({ booking_status: BOOKING_STATUSES.CANCELLED })
    .eq('booking_id', bookingId)
    .select()
    .single()
  if (error) throw error
  const booking = mapBooking(data)
  await updateCarStatus(booking.carId, CAR_STATUSES.AVAILABLE)
  return booking
}

/**
 * Generic admin booking transition (APPROVED / REJECTED / RETURNED).
 * `carId` is optional — if supplied, the booking + car updates run in
 * parallel. Otherwise we fall back to a sequential lookup.
 */
export async function updateBookingStatus(bookingId, newStatus, carId = null) {
  const newCarStatus = CAR_STATUS_FOR_BOOKING[newStatus]

  if (carId && newCarStatus) {
    const [bookingResult, carResult] = await Promise.all([
      supabase
        .from('bookings')
        .update({ booking_status: newStatus })
        .eq('booking_id', bookingId)
        .select()
        .single(),
      supabase
        .from('cars')
        .update({ status: newCarStatus })
        .eq('car_id', carId),
    ])
    if (bookingResult.error) throw bookingResult.error
    if (carResult.error) throw carResult.error
    return mapBooking(bookingResult.data)
  }

  // Fallback: single booking update; chain car update if needed.
  const { data, error } = await supabase
    .from('bookings')
    .update({ booking_status: newStatus })
    .eq('booking_id', bookingId)
    .select()
    .single()
  if (error) throw error
  const booking = mapBooking(data)
  if (newCarStatus) await updateCarStatus(booking.carId, newCarStatus)
  return booking
}
