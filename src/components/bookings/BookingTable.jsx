import { Star } from 'lucide-react'
import StatusBadge from './StatusBadge'
import Button from '@/components/ui/Button'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { BOOKING_STATUSES } from '@/utils/constants'

export default function BookingTable({
  bookings,
  cars,
  users,
  isAdmin = false,
  onCancel,
  onApprove,
  onReject,
  onReturn,
  onReview,
}) {
  const getCar = (carId) => cars?.find((c) => c.carId === carId)
  const getUser = (userId) => users?.find((u) => u.userId === userId)

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/[0.05]">
            <th className="text-left py-3 px-5 text-[10px] font-bold text-gray-600 uppercase tracking-widest">ID</th>
            {isAdmin && (
              <th className="text-left py-3 px-5 text-[10px] font-bold text-gray-600 uppercase tracking-widest">Customer</th>
            )}
            <th className="text-left py-3 px-5 text-[10px] font-bold text-gray-600 uppercase tracking-widest">Vehicle</th>
            <th className="text-left py-3 px-5 text-[10px] font-bold text-gray-600 uppercase tracking-widest">Schedule</th>
            <th className="text-left py-3 px-5 text-[10px] font-bold text-gray-600 uppercase tracking-widest">Total</th>
            <th className="text-left py-3 px-5 text-[10px] font-bold text-gray-600 uppercase tracking-widest">Status</th>
            <th className="text-right py-3 px-5 text-[10px] font-bold text-gray-600 uppercase tracking-widest">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => {
            const car = getCar(booking.carId)
            const user = isAdmin ? getUser(booking.userId) : null
            return (
              <tr
                key={booking.bookingId}
                className="border-b border-white/[0.03] hover:bg-white/[0.015] transition-colors group"
              >
                <td className="py-4 px-5 text-gray-600 font-mono text-xs">
                  #{booking.bookingId}
                </td>
                {isAdmin && (
                  <td className="py-4 px-5">
                    <p className="text-gray-200 text-sm font-medium">{user?.fullName || 'Unknown'}</p>
                    <p className="text-gray-600 text-xs mt-0.5">{user?.email}</p>
                  </td>
                )}
                <td className="py-4 px-5">
                  <p className="text-white text-sm font-medium">
                    {car ? `${car.brand} ${car.model}` : 'Unknown'}
                  </p>
                </td>
                <td className="py-4 px-5">
                  <p className="text-gray-300 text-xs">{formatDate(booking.startDate)}</p>
                  <p className="text-gray-600 text-xs mt-0.5">→ {formatDate(booking.endDate)}</p>
                </td>
                <td className="py-4 px-5">
                  <p className="text-accent font-semibold text-sm">{formatCurrency(booking.totalCost)}</p>
                </td>
                <td className="py-4 px-5">
                  <StatusBadge status={booking.bookingStatus} />
                </td>
                <td className="py-4 px-5 text-right">
                  <div className="flex justify-end gap-2">
                    {isAdmin ? (
                      <>
                        {booking.bookingStatus === BOOKING_STATUSES.PENDING && (
                          <>
                            <Button size="sm" variant="success" onClick={() => onApprove(booking.bookingId)}>
                              Approve
                            </Button>
                            <Button size="sm" variant="danger" onClick={() => onReject(booking.bookingId)}>
                              Reject
                            </Button>
                          </>
                        )}
                        {booking.bookingStatus === BOOKING_STATUSES.APPROVED && (
                          <Button size="sm" variant="outline" onClick={() => onReturn(booking.bookingId)}>
                            Mark Returned
                          </Button>
                        )}
                        {[BOOKING_STATUSES.REJECTED, BOOKING_STATUSES.RETURNED, BOOKING_STATUSES.CANCELLED].includes(booking.bookingStatus) && (
                          <span className="text-gray-700 text-xs px-2">—</span>
                        )}
                      </>
                    ) : (
                      <>
                        {booking.bookingStatus === BOOKING_STATUSES.RETURNED && !booking.hasReviewed && (
                          <Button size="sm" variant="outline" onClick={() => onReview(booking)}>
                            <Star size={12} />
                            Review
                          </Button>
                        )}
                        {booking.bookingStatus === BOOKING_STATUSES.PENDING && (
                          <Button size="sm" variant="danger" onClick={() => onCancel(booking.bookingId)}>
                            Cancel
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
