import { supabase } from '@/services/supabaseClient'

function mapUser(row) {
  return {
    userId: row.user_id,
    fullName: row.full_name,
    email: row.email,
    role: row.role,
    phoneNumber: row.phone_number,
    driverLicenseNumber: row.driver_license_number,
  }
}

export async function getUsers() {
  const { data, error } = await supabase.from('users').select('*')
  if (error) throw error
  return data.map(mapUser)
}
