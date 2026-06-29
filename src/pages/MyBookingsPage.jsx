import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CalendarDays } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'
import { getBookingsByUser, cancelBooking } from '@/services/bookingService'
import { BOOKING_STATUSES, CAR_STATUSES } from '@/utils/constants'
import { getAllCars } from '@/services/carService'
import { submitReview } from '@/services/reviewService'
import BookingTable from '@/components/bookings/BookingTable'
import BookingCard from '@/components/bookings/BookingCard'
import ReviewModal from '@/components/bookings/ReviewModal'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import EmptyState from '@/components/ui/EmptyState'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function MyBookingsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelId, setCancelId] = useState(null)
  const [reviewBooking, setReviewBooking] = useState(null)

  const loadData = async () => {
    setLoading(true)
    try {
      const [userBookings, allCars] = await Promise.all([
        getBookingsByUser(user.userId),
        getAllCars(),
      ])
      setBookings(userBookings)
      setCars(allCars)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [user.userId])

  const handleCancel = async () => {
    // Pull the carId from local state so cancelBooking can flip both tables
    // in parallel. We then update local state optimistically for an instant
    // UI refresh (no round-trip reload).
    const target = bookings.find((b) => b.bookingId === cancelId)
    const carId = target?.carId
    try {
      await cancelBooking(cancelId, carId)
      setBookings((prev) =>
        prev.map((b) =>
          b.bookingId === cancelId
            ? { ...b, bookingStatus: BOOKING_STATUSES.CANCELLED }
            : b,
        ),
      )
      if (carId) {
        setCars((prev) =>
          prev.map((c) =>
            c.carId === carId ? { ...c, status: CAR_STATUSES.AVAILABLE } : c,
          ),
        )
      }
      toast.success('Booking cancelled')
    } catch (err) {
      toast.error(err.message)
    }
    setCancelId(null)
  }

  const getCar = (carId) => cars.find((c) => c.carId === carId)

  const handleReview = async (rating, comment) => {
    const reviewedId = reviewBooking.bookingId
    try {
      await submitReview(
        user.userId,
        reviewBooking.carId,
        rating,
        comment,
        reviewedId,
      )
      // Flip hasReviewed locally so the "Leave a Review" button disappears
      // immediately — no refetch needed.
      setBookings((prev) =>
        prev.map((b) =>
          b.bookingId === reviewedId ? { ...b, hasReviewed: true } : b,
        ),
      )
      toast.success('Review submitted — thank you!')
    } catch (err) {
      toast.error(err.message)
      throw err // re-throw so ReviewModal keeps loading=false only on success
    }
  }

  if (loading) return <LoadingSpinner fullScreen />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-accent text-[11px] font-semibold uppercase tracking-[0.3em] mb-2">
              Your History
            </p>
            <h1 className="font-[var(--font-display)] text-3xl font-bold">My Reservations</h1>
            {bookings.length > 0 && (
              <p className="text-gray-500 text-sm mt-1.5">
                {bookings.length} reservation{bookings.length !== 1 ? 's' : ''} total
              </p>
            )}
          </div>
        </div>

        {bookings.length === 0 ? (
            <div className="surface-elevated rounded-3xl overflow-hidden">
            <EmptyState
              icon={CalendarDays}
              title="No reservations yet"
              description="You haven't made any bookings. Browse our fleet and reserve your dream car."
              actionLabel="Browse Fleet"
              onAction={() => navigate('/')}
            />
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block surface-elevated rounded-3xl overflow-hidden">
              <div className="px-5 py-4 border-b border-white/[0.08] flex items-center gap-3">
                <CalendarDays size={16} className="text-accent/60" />
                <h2 className="font-[var(--font-display)] text-base font-semibold text-white">Booking History</h2>
                <span className="ml-auto text-[11px] text-gray-600 bg-white/[0.04] px-3 py-1 rounded-lg">
                  {bookings.length} records
                </span>
              </div>
              <BookingTable
                bookings={bookings}
                cars={cars}
                onCancel={(id) => setCancelId(id)}
                onReview={(booking) => setReviewBooking(booking)}
              />
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {bookings.map((b) => (
                <BookingCard
                  key={b.bookingId}
                  booking={b}
                  car={getCar(b.carId)}
                  onCancel={(id) => setCancelId(id)}
                  onReview={(booking) => setReviewBooking(booking)}
                />
              ))}
            </div>
          </>
        )}
      </motion.div>

      <ConfirmDialog
        isOpen={cancelId !== null}
        onConfirm={handleCancel}
        onCancel={() => setCancelId(null)}
        title="Cancel Reservation"
        message="Are you sure you want to cancel this reservation? This action cannot be undone."
        confirmText="Yes, Cancel"
      />

      <ReviewModal
        isOpen={reviewBooking !== null}
        onClose={() => setReviewBooking(null)}
        onSubmit={handleReview}
        car={reviewBooking ? getCar(reviewBooking.carId) : null}
      />
    </div>
  )
}
