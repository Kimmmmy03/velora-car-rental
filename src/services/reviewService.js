import { supabase } from '@/services/supabaseClient'

export async function submitReview(userId, carId, rating, comment, bookingId) {
  const { error: insertError } = await supabase.from('reviews').insert({
    user_id: userId,
    car_id: carId,
    rating,
    comment: comment || null,
  })
  if (insertError) throw insertError

  // Mark the booking as reviewed so the UI can hide the "Leave a Review" action.
  if (bookingId) {
    const { error: updateError } = await supabase
      .from('bookings')
      .update({ has_reviewed: true })
      .eq('booking_id', bookingId)
    if (updateError) throw updateError
  }
}
