import { useState } from 'react'
import { Star } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'

export default function ReviewModal({ isOpen, onClose, onSubmit, car }) {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  const handleClose = () => {
    setRating(0)
    setHovered(0)
    setComment('')
    onClose()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (rating === 0) return
    setLoading(true)
    try {
      await onSubmit(rating, comment.trim())
      handleClose()
    } finally {
      setLoading(false)
    }
  }

  const displayRating = hovered || rating

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Leave a Review"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {car && (
          <p className="text-gray-400 text-sm">
            Rating your experience with the{' '}
            <span className="text-white font-medium">{car.brand} {car.model}</span>
          </p>
        )}

        {/* Star rating */}
        <div className="space-y-2">
          <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
            Rating <span className="text-danger">*</span>
          </label>
          <div
            className="flex items-center gap-1.5"
            onMouseLeave={() => setHovered(0)}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHovered(star)}
                className="p-1 bg-transparent border-none cursor-pointer transition-transform hover:scale-110 active:scale-95"
                aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
              >
                <Star
                  size={28}
                  className={`transition-colors ${
                    star <= displayRating ? 'text-accent' : 'text-gray-700'
                  }`}
                  fill={star <= displayRating ? 'currentColor' : 'none'}
                />
              </button>
            ))}
            {displayRating > 0 && (
              <span className="ml-2 text-sm text-gray-500">
                {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][displayRating]}
              </span>
            )}
          </div>
          {rating === 0 && (
            <p className="text-[11px] text-gray-600">Select a star rating to continue</p>
          )}
        </div>

        {/* Comment */}
        <div className="space-y-2">
          <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
            Comment <span className="text-gray-700">(optional)</span>
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience…"
            rows={3}
            maxLength={500}
            className="w-full bg-bg-input/90 border border-border-light/80 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-accent/55 input-glow transition-all resize-none"
          />
          {comment.length > 0 && (
            <p className="text-[11px] text-gray-700 text-right">{comment.length}/500</p>
          )}
        </div>

        <div className="flex gap-3 pt-1">
          <Button type="submit" fullWidth loading={loading} disabled={rating === 0}>
            Submit Review
          </Button>
          <Button variant="ghost" onClick={handleClose} fullWidth>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  )
}
