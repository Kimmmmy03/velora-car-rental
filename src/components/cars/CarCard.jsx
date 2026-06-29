import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Car, ArrowRight, Star, Eye } from 'lucide-react'
import { formatCurrency } from '@/utils/formatters'
import { calculateEffectiveRate } from '@/utils/priceUtils'
import { CAR_STATUSES } from '@/utils/constants'
import Button from '@/components/ui/Button'
import CarDetailsModal from '@/components/cars/CarDetailsModal'

const statusStyles = {
  [CAR_STATUSES.AVAILABLE]: 'bg-success/15 text-success border-success/20',
  [CAR_STATUSES.RESERVED]:  'bg-warning/15 text-warning border-warning/20',
  [CAR_STATUSES.RENTED]:    'bg-danger/15 text-danger border-danger/20',
}

export default function CarCard({ car, onBook }) {
  const isAvailable = car.status === CAR_STATUSES.AVAILABLE
  const cardRef = useRef(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect()
    cardRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
    cardRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
  }

  // Effective daily rate after applying discount (promotion-aware).
  const effectiveRate = calculateEffectiveRate(car)

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className="surface-card rounded-3xl overflow-hidden group"
    >
      {/* Image — clickable to open details */}
      <button
        type="button"
        onClick={() => setDetailsOpen(true)}
        aria-label={`View details for ${car.brand} ${car.model}`}
        className="relative h-52 w-full overflow-hidden bg-bg-secondary block p-0 border-none cursor-pointer group/image"
      >
        {car.imageUrl ? (
          <img
            src={car.imageUrl}
            alt={`${car.brand} ${car.model}`}
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
        ) : null}
        <div
          className={`${car.imageUrl ? 'hidden' : 'flex'} w-full h-full items-center justify-center bg-gradient-to-br from-bg-tertiary to-bg-secondary`}
        >
          <Car size={36} className="text-gray-800" strokeWidth={1.5} />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/70 via-transparent to-transparent" />

        {/* Hover hint — view details */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 bg-black/30">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-white text-[11px] font-semibold uppercase tracking-wider">
            <Eye size={12} />
            View Details
          </span>
        </div>

        {/* PROMO badge — top left */}
        {car.isPromoted && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-success/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider shadow-lg">
              {car.discountPercentage}% OFF
            </span>
          </div>
        )}

        {/* Status badge — top right */}
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${statusStyles[car.status] || 'bg-gray-800 text-gray-400 border-gray-700'}`}>
            <span className="w-1 h-1 rounded-full bg-current" />
            {car.status}
          </span>
        </div>

        {/* License plate — bottom left */}
        <div className="absolute bottom-2.5 left-3.5">
          <p className="text-white/50 text-[10px] uppercase tracking-widest font-mono">
            {car.licensePlate}
          </p>
        </div>
      </button>

      {/* Info */}
      <div className="p-5">
        <div className="mb-4">
          <h3 className="font-[var(--font-display)] text-lg font-semibold text-white leading-tight">
            {car.brand}
          </h3>
          <p className="text-gray-400 text-sm mt-0.5">{car.model}</p>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {car.category && (
              <span className="inline-block px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/[0.1] text-gray-500 text-[10px] font-semibold uppercase tracking-wider">
                {car.category}
              </span>
            )}
            {car.averageRating > 0 && (
              <button
                type="button"
                onClick={() => setDetailsOpen(true)}
                aria-label={`View details and ${car.reviewCount} review${car.reviewCount !== 1 ? 's' : ''}`}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/[0.1] cursor-pointer hover:bg-white/[0.1] hover:border-accent/30 transition-colors"
              >
                <Star size={10} className="text-accent" fill="currentColor" />
                <span className="text-gray-300 text-[10px] font-semibold">{car.averageRating.toFixed(1)}</span>
                <span className="text-gray-600 text-[10px]">({car.reviewCount})</span>
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setDetailsOpen(true)}
            className="inline-flex items-center gap-1 mt-2.5 text-accent hover:text-accent-hover text-[11px] font-semibold uppercase tracking-wider bg-transparent border-none p-0 cursor-pointer transition-colors"
          >
            <Eye size={11} />
            View Details
          </button>
        </div>

        <div className="flex items-center justify-between pt-3.5 border-t border-white/[0.05]">
          <div>
            {car.isPromoted ? (
              <>
                <p className="line-through text-gray-500 text-sm">{formatCurrency(car.dailyRate)}</p>
                <p className="text-green-400 text-xl font-bold tracking-tight">{formatCurrency(effectiveRate)}</p>
                <p className="text-gray-700 text-[10px] uppercase tracking-wider mt-0.5">/ day</p>
              </>
            ) : (
              <>
                <p className="text-accent text-xl font-bold tracking-tight">{formatCurrency(car.dailyRate)}</p>
                <p className="text-gray-700 text-[10px] uppercase tracking-wider mt-0.5">/ day</p>
              </>
            )}
          </div>
          {isAvailable ? (
            <Button size="sm" onClick={() => onBook(car.carId)}>
              Reserve
              <ArrowRight size={13} />
            </Button>
          ) : (
            <span className="text-[11px] text-gray-600 italic px-3 py-1.5 rounded-lg bg-white/[0.02] border border-border/50">
              Unavailable
            </span>
          )}
        </div>
      </div>

      <CarDetailsModal
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        car={car}
        onBook={onBook}
      />
    </motion.div>
  )
}
