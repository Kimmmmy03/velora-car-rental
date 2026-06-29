import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, CalendarDays, Clock, CheckCircle2, RotateCcw } from 'lucide-react'
import toast from 'react-hot-toast'
import { getAllBookings, updateBookingStatus, CAR_STATUS_FOR_BOOKING } from '@/services/bookingService'
import { getAllCars } from '@/services/carService'
import { getUsers } from '@/services/userService'
import { BOOKING_STATUSES } from '@/utils/constants'
import BookingTable from '@/components/bookings/BookingTable'
import StatCard from '@/components/ui/StatCard'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import EmptyState from '@/components/ui/EmptyState'
import Button from '@/components/ui/Button'


export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([])
  const [cars, setCars] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    try {
      const [allBookings, allCars, allUsers] = await Promise.all([
        getAllBookings(),
        getAllCars(),
        getUsers(),
      ])
      setBookings(allBookings)
      setCars(allCars)
      setUsers(allUsers)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const handleAction = async (bookingId, status, label) => {
    // Look up carId from current state so we can flip both tables in parallel
    // and update the local UI optimistically (no refetch needed).
    const target = bookings.find((b) => b.bookingId === bookingId)
    const carId = target?.carId
    try {
      await updateBookingStatus(bookingId, status, carId)
      // Instant UI sync: update booking row locally...
      setBookings((prev) =>
        prev.map((b) => (b.bookingId === bookingId ? { ...b, bookingStatus: status } : b)),
      )
      // ...and mirror the car status transition locally too.
      const newCarStatus = CAR_STATUS_FOR_BOOKING[status]
      if (newCarStatus && carId) {
        setCars((prev) =>
          prev.map((c) => (c.carId === carId ? { ...c, status: newCarStatus } : c)),
        )
      }
      toast.success(`Booking #${bookingId} ${label.toLowerCase()}`)
    } catch (err) {
      toast.error(err.message)
    }
  }

  const pending  = bookings.filter((b) => b.bookingStatus === BOOKING_STATUSES.PENDING).length
  const approved = bookings.filter((b) => b.bookingStatus === BOOKING_STATUSES.APPROVED).length
  const returned = bookings.filter((b) => b.bookingStatus === BOOKING_STATUSES.RETURNED).length

  const miniStats = [
    { label: 'Pending',  value: pending,  icon: Clock,        color: 'text-warning' },
    { label: 'Active',   value: approved, icon: CheckCircle2, color: 'text-success' },
    { label: 'Returned', value: returned, icon: RotateCcw,    color: 'text-info'    },
  ]

  if (loading) return <LoadingSpinner fullScreen />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-danger text-[11px] font-semibold uppercase tracking-[0.3em] mb-2">
              Booking Management
            </p>
            <h1 className="font-[var(--font-display)] text-3xl font-bold">Booking Requests</h1>
            <p className="text-gray-500 text-sm mt-1.5">
              {bookings.length} total booking{bookings.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link to="/admin">
            <Button variant="ghost" size="sm">
              <ArrowLeft size={13} />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {miniStats.map(({ label, value, icon, color }, i) => (
            <StatCard key={label} label={label} value={value} icon={icon} color={color} delay={i * 0.07} layout="inline" />
          ))}
        </div>

        {/* Table */}
        {bookings.length === 0 ? (
          <div className="surface-elevated rounded-3xl overflow-hidden">
            <EmptyState
              icon={CalendarDays}
              title="No bookings yet"
              description="No booking requests have been made. They will appear here when customers reserve vehicles."
            />
          </div>
        ) : (
          <div className="surface-elevated rounded-3xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.08] flex items-center gap-3">
              <CalendarDays size={15} className="text-accent/60" />
              <h2 className="font-[var(--font-display)] text-base font-semibold text-white">All Bookings</h2>
              <span className="ml-auto text-[11px] text-gray-600 bg-white/[0.04] px-3 py-1 rounded-lg">
                {bookings.length} records
              </span>
            </div>
            <BookingTable
              bookings={bookings}
              cars={cars}
              users={users}
              isAdmin
              onApprove={(id) => handleAction(id, BOOKING_STATUSES.APPROVED, 'Approved')}
              onReject={(id)  => handleAction(id, BOOKING_STATUSES.REJECTED,  'Rejected')}
              onReturn={(id)  => handleAction(id, BOOKING_STATUSES.RETURNED,  'Returned')}
            />
          </div>
        )}
      </motion.div>
    </div>
  )
}
