import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Star,
  MessageSquare,
  X,
  Car as CarIcon,
  Tag,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { calculateEffectiveRate } from '@/utils/priceUtils'
import { CAR_STATUSES } from '@/utils/constants'
import Button from '@/components/ui/Button'

const statusStyles = {
  [CAR_STATUSES.AVAILABLE]: 'bg-success/15 text-success border-success/20',
  [CAR_STATUSES.RESERVED]:  'bg-warning/15 text-warning border-warning/20',
  [CAR_STATUSES.RENTED]:    'bg-danger/15 text-danger border-danger/20',
}

function StarRow({ rating, size = 13 }) {
  return (
    <div className="flex items-center gap-0.5 shrink-0">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={s <= rating ? 'text-accent' : 'text-gray-700'}
          fill={s <= rating ? 'currentColor' : 'none'}
        />
      ))}
    </div>
  )
}

export default function CarDetailsModal({ isOpen, onClose, car, onBook }) {
  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!car) return null

  const reviews = car.reviews ?? []
  const sorted = [...reviews].sort((a, b) => {
    const aT = a.createdAt ? new Date(a.createdAt).getTime() : 0
    const bT = b.createdAt ? new Date(b.createdAt).getTime() : 0
    return bT - aT
  })

  const count = sorted.length
  const avg = car.averageRating ?? 0
  const isAvailable = car.status === CAR_STATUSES.AVAILABLE
  const effectiveRate = calculateEffectiveRate(car)

  const handleReserve = () => {
    onClose()
    onBook?.(car.carId)
  }

  const overlay = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="car-details-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Details for ${car.brand} ${car.model}`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl max-h-[90vh] flex flex-col gradient-border rounded-3xl shadow-[0_36px_90px_rgba(0,0,0,0.65)] overflow-hidden bg-bg-primary"
          >
            <div className="shine-bar" />

            {/* Close button (floating) */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close details"
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-xl flex items-center justify-center text-white hover:text-white bg-black/40 hover:bg-black/60 backdrop-blur-md transition-all border-none cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto">
              {/* Hero image */}
              <div className="relative h-64 sm:h-72 bg-bg-secondary overflow-hidden">
                {car.imageUrl ? (
                  <img
                    src={car.imageUrl}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                ) : null}
                <div
                  className={`${car.imageUrl ? 'hidden' : 'flex'} w-full h-full items-center justify-center bg-gradient-to-br from-bg-tertiary to-bg-secondary`}
                >
                  <CarIcon size={48} className="text-gray-800" strokeWidth={1.5} />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/40 to-transparent" />

                {/* Badges */}
                {car.isPromoted && (
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-success/85 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider shadow-lg">
                      <Sparkles size={11} />
                      {car.discountPercentage}% OFF
                    </span>
                  </div>
                )}

                <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-accent text-[10px] font-semibold uppercase tracking-[0.3em]">
                      {car.category || 'Vehicle'}
                    </p>
                    <h2 className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold text-white mt-1 truncate">
                      {car.brand} <span className="text-gray-300 font-normal">{car.model}</span>
                    </h2>
                    <p className="text-white/40 text-xs uppercase tracking-widest font-mono mt-1">
                      {car.licensePlate}
                    </p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shrink-0 ${statusStyles[car.status] || 'bg-gray-800 text-gray-400 border-gray-700'}`}>
                    <span className="w-1 h-1 rounded-full bg-current" />
                    {car.status}
                  </span>
                </div>
              </div>

              {/* Details grid */}
              <div className="px-6 py-5 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Price */}
                  <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4">
                    <p className="text-gray-600 text-[10px] uppercase tracking-wider mb-1.5">Daily Rate</p>
                    {car.isPromoted ? (
                      <>
                        <p className="line-through text-gray-500 text-sm">{formatCurrency(car.dailyRate)}</p>
                        <p className="text-green-400 text-xl font-bold tracking-tight">{formatCurrency(effectiveRate)}</p>
                      </>
                    ) : (
                      <p className="text-accent text-xl font-bold tracking-tight">{formatCurrency(car.dailyRate)}</p>
                    )}
                  </div>

                  {/* Category */}
                  <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4">
                    <p className="text-gray-600 text-[10px] uppercase tracking-wider mb-1.5">Category</p>
                    <div className="flex items-center gap-1.5">
                      <Tag size={13} className="text-accent/70" />
                      <p className="text-gray-200 text-sm font-medium truncate">
                        {car.category || '—'}
                      </p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4">
                    <p className="text-gray-600 text-[10px] uppercase tracking-wider mb-1.5">Rating</p>
                    {count > 0 ? (
                      <div className="flex items-center gap-2">
                        <StarRow rating={Math.round(avg)} size={12} />
                        <span className="text-gray-200 text-sm font-semibold">{avg.toFixed(1)}</span>
                        <span className="text-gray-600 text-xs">({count})</span>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm italic">No ratings yet</p>
                    )}
                  </div>
                </div>

                {/* Reserve CTA */}
                {isAvailable && onBook && (
                  <div className="flex items-center justify-between gap-4 bg-accent/[0.06] border border-accent/20 rounded-2xl px-5 py-4">
                    <div className="min-w-0">
                      <p className="text-white text-sm font-semibold">Ready to drive?</p>
                      <p className="text-gray-500 text-xs mt-0.5">Pick your dates and reserve instantly.</p>
                    </div>
                    <Button size="sm" onClick={handleReserve}>
                      Reserve
                      <ArrowRight size={13} />
                    </Button>
                  </div>
                )}

                {/* Reviews */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-[var(--font-display)] text-sm font-semibold text-white uppercase tracking-wider">
                      Reviews
                    </h3>
                    {count > 0 && (
                      <span className="text-gray-600 text-[11px]">
                        {count} review{count !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  {count === 0 ? (
                    <div className="py-8 flex flex-col items-center text-center gap-3 bg-white/[0.02] border border-white/[0.04] rounded-2xl">
                      <div className="w-11 h-11 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                        <MessageSquare size={16} className="text-gray-600" />
                      </div>
                      <div>
                        <p className="text-gray-300 text-sm font-medium">No reviews yet</p>
                        <p className="text-gray-600 text-xs mt-1">
                          Be the first to share your experience.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {sorted.map((r, idx) => (
                        <div
                          key={idx}
                          className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4"
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="min-w-0">
                              <p className="text-white text-sm font-medium truncate">
                                {r.reviewerName}
                              </p>
                              <p className="text-gray-600 text-[11px] mt-0.5">
                                {formatDate(r.createdAt)}
                              </p>
                            </div>
                            <StarRow rating={r.rating} />
                          </div>
                          {r.comment && (
                            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                              {r.comment}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  if (typeof document === 'undefined') return null
  return createPortal(overlay, document.body)
}
