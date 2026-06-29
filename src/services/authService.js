import { supabase } from '@/services/supabaseClient'
import { ROLES } from '@/utils/constants'

/**
 * Signs the user in with email + password via Supabase Auth.
 * Returns the raw Supabase auth user on success; throws on failure.
 */
export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data.user
}

/**
 * Creates a Supabase Auth account, then inserts the public profile row
 * (full_name, role, phone_number, driver_license_number) into public.users.
 * Throws if either step fails.
 */
export async function register({ fullName, email, password, phoneNumber, driverLicenseNumber }) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error

  const { error: profileError } = await supabase
    .from('users')
    .insert({
      user_id: data.user.id,
      full_name: fullName,
      email,
      role: ROLES.CUSTOMER,
      phone_number: phoneNumber,
      driver_license_number: driverLicenseNumber,
    })
  if (profileError) {
    console.error('DB Insert Error:', profileError)
    // Clean up the orphaned auth account so the user can retry with the same email
    await supabase.auth.admin.deleteUser(data.user.id).catch(() => {})
    throw profileError
  }
}

/**
 * Signs the current user out via Supabase Auth.
 */
export async function logout() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
