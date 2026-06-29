import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '@/services/supabaseClient'
import * as authService from '@/services/authService'
import { ROLES } from '@/utils/constants'

const AuthContext = createContext(null)

/**
 * Fetches the public user profile from public.users using the Supabase auth
 * user's UUID. Returns the camelCase-mapped profile, or null if not found.
 */
async function fetchProfile(authUser) {
  if (!authUser) return null
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', authUser.id)
    .single()
  if (error || !data) return null
  return {
    userId: data.user_id,
    fullName: data.full_name,
    email: data.email,
    role: data.role,
    phoneNumber: data.phone_number,
    driverLicenseNumber: data.driver_license_number,
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Restore any existing session on mount, then clear the loading gate.
    supabase.auth.getSession().then(({ data: { session } }) => {
      fetchProfile(session?.user ?? null).then((profile) => {
        setUser(profile)
        setLoading(false)
      })
    })

    // Keep user state in sync for all subsequent auth events
    // (sign-in, sign-out, token refresh, etc.).
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      fetchProfile(session?.user ?? null).then(setUser)
    })

    return () => subscription.unsubscribe()
  }, [])

  /**
   * Signs in and returns the app profile so the caller can immediately
   * navigate to the right page without waiting for the auth state listener.
   */
  const login = async (email, password) => {
    const authUser = await authService.login(email, password)
    const profile = await fetchProfile(authUser)
    setUser(profile)
    return profile
  }

  /**
   * Creates a Supabase Auth account and inserts the public profile row.
   * Does not sign the user in — the caller should redirect to /login.
   */
  const register = async (formData) => {
    await authService.register(formData)
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === ROLES.ADMIN,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
