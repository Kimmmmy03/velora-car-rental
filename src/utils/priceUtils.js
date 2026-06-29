// Pricing helpers — single source of truth for promotional discounts.
// Import via: `import { calculateEffectiveRate } from '@/utils/priceUtils'`

/**
 * Returns the effective daily rate for a car after applying a promotional
 * discount, or the plain daily rate when the car is not promoted.
 *
 * Rounded to 2 decimal places so it can be used directly in UI + totals
 * without downstream float-drift.
 *
 * @param {{ dailyRate: number, isPromoted?: boolean, discountPercentage?: number }} car
 * @returns {number}
 */
export function calculateEffectiveRate(car) {
  if (!car) return 0
  const rate = Number(car.dailyRate) || 0
  if (!car.isPromoted) return rate
  const pct = Number(car.discountPercentage) || 0
  return parseFloat((rate - rate * (pct / 100)).toFixed(2))
}
