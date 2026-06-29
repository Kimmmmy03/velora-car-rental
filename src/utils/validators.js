export function validateRequired(value, fieldName) {
  if (!value || !value.toString().trim()) {
    return `${fieldName} is required`
  }
  return null
}

export function validateEmail(email) {
  if (!email || !email.trim()) return 'Email is required'
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!re.test(email)) return 'Please enter a valid email address'
  return null
}

export function validatePassword(password) {
  if (!password) return 'Password is required'
  if (password.length < 6) return 'Password must be at least 6 characters'
  return null
}

export function validatePhone(phone) {
  if (!phone || !phone.trim()) return 'Phone number is required'
  const re = /^(\+?6?0)[0-9]{1,2}[- ]?[0-9]{7,8}$/
  if (!re.test(phone.replace(/\s/g, ''))) return 'Please enter a valid Malaysian phone number'
  return null
}

export function validateLicense(license) {
  if (!license || !license.trim()) return 'Driver license number is required'
  if (license.trim().length < 3) return 'Please enter a valid license number'
  return null
}

export function validateDateRange(startDate, endDate) {
  if (!startDate) return 'Pick-up date is required'
  if (!endDate) return 'Return date is required'

  const start = new Date(startDate)
  const end = new Date(endDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (start < today) return 'Pick-up date cannot be in the past'
  if (end <= start) return 'Return date must be after pick-up date'
  return null
}

export function validateDailyRate(rate) {
  if (!rate) return 'Daily rate is required'
  const num = parseFloat(rate)
  if (isNaN(num) || num <= 0) return 'Daily rate must be a positive number'
  return null
}
