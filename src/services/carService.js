import { supabase } from '@/services/supabaseClient'
import { CAR_STATUSES } from '@/utils/constants'

// Maps a Supabase row (snake_case columns) to the camelCase shape used throughout the app.
function mapCar(row) {
  const rawReviews = row.reviews ?? []
  const averageRating =
    rawReviews.length > 0
      ? Math.round((rawReviews.reduce((sum, r) => sum + r.rating, 0) / rawReviews.length) * 10) / 10
      : 0

  // Flatten the joined reviewer record so UI code stays snake-case-free.
  const reviews = rawReviews.map((r) => ({
    rating: r.rating,
    comment: r.comment ?? '',
    createdAt: r.created_at,
    reviewerName: r.users?.full_name ?? 'Anonymous',
  }))

  return {
    carId: row.car_id,
    brand: row.brand,
    model: row.model,
    licensePlate: row.license_plate,
    dailyRate: parseFloat(row.daily_rate),
    status: row.status,
    imageUrl: row.image_url ?? '',
    category: row.category ?? '',
    isPromoted: row.is_promoted ?? false,
    discountPercentage: row.discount_percentage ?? 0,
    averageRating,
    reviewCount: rawReviews.length,
    reviews,
  }
}

const CAR_REVIEW_SELECT = '*, reviews(rating, comment, created_at, users(full_name))'

export async function getAllCars() {
  const { data, error } = await supabase
    .from('cars')
    .select(CAR_REVIEW_SELECT)
    .order('car_id')
  if (error) throw error
  return data.map(mapCar)
}

export async function getAvailableCars() {
  const { data, error } = await supabase
    .from('cars')
    .select(CAR_REVIEW_SELECT)
    .eq('status', CAR_STATUSES.AVAILABLE)
    .order('car_id')
  if (error) throw error
  return data.map(mapCar)
}

export async function getCarById(carId) {
  const { data, error } = await supabase
    .from('cars')
    .select(CAR_REVIEW_SELECT)
    .eq('car_id', carId)
    .single()
  if (error) throw error
  return mapCar(data)
}

export async function addCar({ brand, model, licensePlate, dailyRate, imageUrl, category, status, isPromoted, discountPercentage }) {
  const promoted = isPromoted ?? false
  const { data, error } = await supabase
    .from('cars')
    .insert({
      brand,
      model,
      license_plate: licensePlate,
      daily_rate: parseFloat(dailyRate),
      image_url: imageUrl || '',
      category: category || null,
      status: status || CAR_STATUSES.AVAILABLE,
      is_promoted: promoted,
      discount_percentage: promoted ? (parseInt(discountPercentage) || 0) : 0,
    })
    .select()
    .single()
  if (error) throw error
  return mapCar(data)
}

export async function updateCar(carId, carData) {
  const promoted = carData.isPromoted ?? false
  const { data, error } = await supabase
    .from('cars')
    .update({
      brand: carData.brand,
      model: carData.model,
      license_plate: carData.licensePlate,
      daily_rate: parseFloat(carData.dailyRate),
      image_url: carData.imageUrl ?? '',
      category: carData.category || null,
      // Include status in the payload — previously omitted, so the Status
      // dropdown in the edit form never persisted (the DB kept the old value).
      status: carData.status,
      is_promoted: promoted,
      discount_percentage: promoted ? (parseInt(carData.discountPercentage) || 0) : 0,
    })
    .eq('car_id', carId)
    .select()
    .single()
  if (error) throw error
  return mapCar(data)
}

export async function deleteCar(carId) {
  const { error } = await supabase.from('cars').delete().eq('car_id', carId)
  if (error) throw error
}

export async function uploadCarImage(file) {
  const ext = file.name.split('.').pop()
  const fileName = `${Date.now()}-${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from('car-images').upload(fileName, file)
  if (error) throw error
  const { data } = supabase.storage.from('car-images').getPublicUrl(fileName)
  return data.publicUrl
}

export async function updateCarStatus(carId, status) {
  const { error } = await supabase
    .from('cars')
    .update({ status })
    .eq('car_id', carId)
  if (error) throw error
}
