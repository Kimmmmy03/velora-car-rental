import { Car, CalendarDays, Clock } from 'lucide-react'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { calculateEffectiveRate } from '@/utils/priceUtils'

export default function BookingPreview({ car, startDate, endDate, days, totalCost }) {
  // --- Pricing breakdown variables ---
  const effectiveRate = calculateEffectiveRate(car)
  const originalTotal = parseFloat((car.dailyRate * days).toFixed(2))
  const discountedTotal = parseFloat((effectiveRate * days).toFixed(2))
  const discountAmount = parseFloat((originalTotal - discountedTotal).toFixed(2))
  const isPromoted = !!car.isPromoted

  // Left-column reservation details (price-free)
  const details = [
    { icon: Car,          label: 'Vehicle',  value: `${car.brand} ${car.model}` },
    { icon: CalendarDays, label: 'Pick-up',  value: formatDate(startDate) },
    { icon: CalendarDays, label: 'Return',   value: formatDate(endDate) },
    { icon: Clock,        label: 'Duration', value: `${days} day${days !== 1 ? 's' : ''}` },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* LEFT — Reservation Details */}
      <div className="surface-elevated rounded-3xl overflow-hidden">
        <div className="shine-bar" />
        <div className="p-6 h-full flex flex-col">
          <h3 className="text-[11px] font-bold text-gray-600 uppercase tracking-widest mb-5">
            Reservation Details
          </h3>

          <div className="space-y-1 flex-1">
            {details.map(({ icon: ItemIcon, label, value }) => (
              <div
                key={label}
                className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-0"
              >
                <div className="flex items-center gap-3">
                  <ItemIcon size={14} className="text-gray-700 shrink-0" />
                  <span className="text-sm text-gray-500">{label}</span>
                </div>
                <span className="text-sm text-gray-200 font-medium text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT — Price Breakdown */}
      <div className="surface-elevated rounded-3xl overflow-hidden">
        <div className="shine-bar" />
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[11px] font-bold text-gray-600 uppercase tracking-widest">
              Price Breakdown
            </h3>
            {isPromoted && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-success/[0.1] border border-success/25 text-success text-[9px] font-bold uppercase tracking-wider">
                {car.discountPercentage}% off
              </span>
            )}
          </div>

          <div className="flex-1 flex flex-col">
            {/* Row 1 — Base price */}
            <div className="flex items-start justify-between py-2.5">
              <div>
                <p className="text-sm text-gray-400">
                  {formatCurrency(car.dailyRate)} × {days} day{days !== 1 ? 's' : ''}
                </p>
                <p className="text-gray-600 text-[11px] mt-0.5">Base price</p>
              </div>
              <p className={`text-sm font-medium text-right ${isPromoted ? 'line-through text-gray-500' : 'text-gray-200'}`}>
                {formatCurrency(originalTotal)}
              </p>
            </div>

            {/* Row 2 — Conditional discount */}
            {isPromoted && (
              <div className="flex items-start justify-between py-2.5">
                <div>
                  <p className="text-sm text-gray-400">
                    Promotion Discount ({car.discountPercentage}%)
                  </p>
                  <p className="text-gray-600 text-[11px] mt-0.5">Applied automatically</p>
                </div>
                <p className="text-sm font-semibold text-green-400 text-right">
                  - {formatCurrency(discountAmount)}
                </p>
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-white/10 my-4" />

            {/* Final row — Total */}
            <div className="flex items-end justify-between mt-auto">
              <div>
                <p className="text-[11px] text-gray-500 uppercase tracking-wider">Total Amount</p>
                <p className="text-gray-600 text-xs mt-0.5">Pending admin approval</p>
              </div>
              <p className="font-[var(--font-display)] text-3xl font-bold text-accent tracking-tight">
                {formatCurrency(totalCost)}
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
