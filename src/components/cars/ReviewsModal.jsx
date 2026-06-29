import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, MessageSquare, X } from 'lucide-react'
import { formatDate } from '@/utils/formatters'

// Renders five star icons, filling `rating` of them.
function StarRow({ rating }) {
  return (
    <div className="flex items-center gap-0.5 shrink-0">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={13}
          className={s <= rating ? 'text-accent' : 'text-gray-700'}
          fill={s <= rating ? 'currentColor' : 'none'}
        />
      ))}
    </div>
  )
}

export default function ReviewsModal({ isOpen, onClose, car, reviews = [] }) {
  // Lock body scroll while the overlay is open.
  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [isOpen])

  // Close on Escape.
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  // Newest first — Supabase doesn't guarantee order on nested selects.
  const sorted = [...reviews].sort((a, b) => {
    const aT = a.createdAt ? new Date(a.createdAt).getTime() : 0
    const bT = b.createdAt ? new Date(b.createdAt).getTime() : 0
    return bT - aT
  })

  const title = car ? `${car.brand} ${car.model}` : 'Reviews'
  const count = sorted.length
  const avg =
    count > 0
      ? Math.round((sorted.reduce((s, r) => s + r.rating, 0) / count) * 10) / 10
      : 0

  const overlay = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="reviews-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Reviews for ${title}`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[85vh] flex flex-col gradient-border rounded-3xl shadow-[0_36px_90px_rgba(0,0,0,0.65)] overflow-hidden bg-bg-primary"
          >
            <div className="shine-bar" />

            {/* Header */}
            <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-white/[0.06] shrink-0">
              <div className="min-w-0">
                <p className="text-accent text-[10px] font-semibold uppercase tracking-[0.3em]">
                  Reviews
                </p>
                <h3 className="font-[var(--font-display)] text-lg font-semibold text-white mt-1 truncate">
                  {title}
                </h3>
                {count > 0 && (
                  <div className="flex items-center gap-2 mt-1.5">
                    <StarRow rating={Math.round(avg)} />
                    <span className="text-gray-400 text-xs">
                      {avg.toFixed(1)} · {count} review{count !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close reviews"
                className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/[0.1] transition-all bg-transparent border-none cursor-pointer shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {count === 0 ? (
                <div className="py-10 flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                    <MessageSquare size={18} className="text-gray-600" />
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  // Portal out of CarCard — its motion transform creates a containing block
  // that would otherwise trap our fixed overlay inside the card.
  if (typeof document === 'undefined') return null
  return createPortal(overlay, document.body)
}
