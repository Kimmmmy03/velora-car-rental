import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, Lock, Phone, CreditCard, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import {
  validateRequired,
  validateEmail,
  validatePassword,
  validatePhone,
  validateLicense,
} from '@/utils/validators'

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    driverLicenseNumber: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }))
    if (errors[field]) setErrors((p) => ({ ...p, [field]: null }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {
      fullName: validateRequired(form.fullName, 'Full name'),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      phoneNumber: validatePhone(form.phoneNumber),
      driverLicenseNumber: validateLicense(form.driverLicenseNumber),
    }
    const filtered = Object.fromEntries(Object.entries(newErrors).filter(([, v]) => v))
    setErrors(filtered)
    if (Object.keys(filtered).length > 0) return

    setLoading(true)
    try {
      await register(form)
      toast.success('Registration successful!')
      navigate('/login', { state: { registered: true } })
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-bg-primary">
      <div className="absolute inset-0 pattern-dots opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(200,169,126,0.05),transparent_55%)]" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-7 space-y-3">
          <div className="w-11 h-11 rounded-2xl bg-accent flex items-center justify-center shadow-[0_4px_20px_rgba(200,169,126,0.35)] glow-pulse">
            <span className="text-bg-primary font-black text-base">V</span>
          </div>
          <div className="text-center">
            <h1 className="font-[var(--font-display)] text-xl font-bold text-gradient-accent tracking-[0.12em]">
              VELORA
            </h1>
            <p className="text-gray-600 text-[11px] uppercase tracking-[0.3em] mt-0.5">Premium Car Rental</p>
          </div>
        </div>

        {/* Card */}
        <div className="gradient-border rounded-3xl overflow-hidden">
          <div className="shine-bar" />
          <div className="p-8 space-y-6">
            <div>
              <h2 className="font-[var(--font-display)] text-xl font-bold text-white">Create account</h2>
              <p className="text-gray-500 text-sm mt-1">Join Velora and start your journey</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                icon={User}
                placeholder="John Doe"
                value={form.fullName}
                onChange={handleChange('fullName')}
                error={errors.fullName}
              />
              <Input
                label="Email Address"
                icon={Mail}
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange('email')}
                error={errors.email}
              />
              <Input
                label="Password"
                icon={Lock}
                type="password"
                placeholder="Minimum 6 characters"
                value={form.password}
                onChange={handleChange('password')}
                error={errors.password}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Phone"
                  icon={Phone}
                  placeholder="+601xxxxxxxx"
                  value={form.phoneNumber}
                  onChange={handleChange('phoneNumber')}
                  error={errors.phoneNumber}
                />
                <Input
                  label="License No."
                  icon={CreditCard}
                  placeholder="License ID"
                  value={form.driverLicenseNumber}
                  onChange={handleChange('driverLicenseNumber')}
                  error={errors.driverLicenseNumber}
                />
              </div>
              <Button type="submit" fullWidth loading={loading} size="lg" className="mt-1">
                Create Account
                <ArrowRight size={15} />
              </Button>
            </form>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-accent hover:text-accent-light transition-colors font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
