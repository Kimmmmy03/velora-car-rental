import { CalendarDays, Car, Star } from 'lucide-react'
import StatusBadge from './StatusBadge'
import Button from '@/components/ui/Button'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { BOOKING_STATUSES } from '@/utils/constants'

export default function BookingCard({ booking, car, onCancel, onReview }) {
  // Customers can only cancel while still PENDING — once APPROVED the rental
  // is active, and only an admin can transition it to RETURNED.
  const canCancel = booking.bookingStatus === BOOKING_STATUSES.PENDING
  const canReview =
    booking.bookingStatus === BOOKING_STATUSES.RETURNED && !booking.hasReviewed

  return (
    <div className="surface-card rounded-3xl overflow-hidden">
      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-accent/[0.07] border border-accent/10 flex items-center justify-center shrink-0">
              <Car size={16} className="text-accent/70" />
            </div>
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm truncate">
                {car ? `${car.brand} ${car.model}` : 'Unknown Vehicle'}
              </p>
              <p className="text-gray-600 text-[11px] font-mono mt-0.5">#{booking.bookingId}</p>
            </div>
          </div>
          <StatusBadge status={booking.bookingStatus} />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <CalendarDays size={11} className="text-gray-600" />
              <p className="text-gray-600 text-[10px] uppercase tracking-wider">Pick-up</p>
            </div>
            <p className="text-gray-200 text-sm font-medium">{formatDate(booking.startDate)}</p>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <CalendarDays size={11} className="text-gray-600" />
              <p className="text-gray-600 text-[10px] uppercase tracking-wider">Return</p>
            </div>
            <p className="text-gray-200 text-sm font-medium">{formatDate(booking.endDate)}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
          <div>
            <p className="text-gray-600 text-[10px] uppercase tracking-wider">Total</p>
            <p className="text-accent font-bold text-lg mt-0.5">{formatCurrency(booking.totalCost)}</p>
          </div>
          <div className="flex items-center gap-2">
            {canReview && (
              <Button size="sm" variant="outline" onClick={() => onReview(booking)}>
                <Star size={12} />
                Review
              </Button>
            )}
            {canCancel && (
              <Button size="sm" variant="danger" onClick={() => onCancel(booking.bookingId)}>
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
