import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'
import { ROLES } from '@/utils/constants'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { validateEmail, validatePassword } from '@/utils/validators'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const fromRegister = location.state?.registered

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}
    newErrors.email = validateEmail(email)
    newErrors.password = validatePassword(password)
    const filtered = Object.fromEntries(Object.entries(newErrors).filter(([, v]) => v))
    setErrors(filtered)
    if (Object.keys(filtered).length > 0) return

    setLoading(true)
    try {
      const user = await login(email, password)
      toast.success(`Welcome back, ${user.fullName}`)
      navigate(user.role === ROLES.ADMIN ? '/admin' : '/')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-bg-primary">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[40%] relative flex-col justify-between p-12 overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-bg-secondary via-bg-primary to-bg-primary" />
        <div className="absolute inset-0 pattern-dots opacity-60" />
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-white/[0.05] to-transparent" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-accent/[0.04] blur-3xl" />

        {/* Brand */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shadow-[0_2px_12px_rgba(200,169,126,0.35)]">
            <span className="text-bg-primary font-black text-xs">V</span>
          </div>
          <span className="font-[var(--font-display)] text-base font-bold text-white tracking-[0.18em]">
            VELORA
          </span>
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/[0.08] border border-accent/15">
            <Sparkles size={12} className="text-accent" />
            <span className="text-accent text-[11px] font-medium tracking-wider uppercase">Premium Fleet</span>
          </div>
          <h2 className="font-[var(--font-display)] text-3xl font-bold text-white leading-[1.2]">
            Drive the<br />
            <span className="text-gradient-accent">Extraordinary</span>
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed max-w-[280px]">
            Access our curated collection of the world&apos;s finest automobiles.
            An elevated experience awaits.
          </p>
          <div className="flex items-center gap-6 pt-2">
            {[['50+', 'Vehicles'], ['100%', 'Insured'], ['24/7', 'Support']].map(([num, label]) => (
              <div key={label} className="space-y-0.5">
                <p className="font-[var(--font-display)] text-xl font-bold text-accent">{num}</p>
                <p className="text-gray-600 text-[11px] uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10">
          <p className="text-gray-700 text-xs">&copy; {new Date().getFullYear()} Velora Premium Rentals</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="absolute inset-0 lg:hidden">
          <div className="absolute inset-0 pattern-dots opacity-30" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(200,169,126,0.05),transparent_60%)]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex flex-col items-center mb-8 space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-accent flex items-center justify-center shadow-[0_4px_20px_rgba(200,169,126,0.35)] glow-pulse">
              <span className="text-bg-primary font-black text-base">V</span>
            </div>
            <h1 className="font-[var(--font-display)] text-2xl font-bold text-gradient-accent tracking-[0.1em]">
              VELORA
            </h1>
          </div>

          {/* Form card */}
          <div className="gradient-border rounded-3xl overflow-hidden">
            <div className="shine-bar" />
            <div className="p-8 space-y-6">
              <div>
                <h2 className="font-[var(--font-display)] text-xl font-bold text-white">Welcome back</h2>
                <p className="text-gray-500 text-sm mt-1">Sign in to your account to continue</p>
              </div>

              {fromRegister && (
                <div className="flex items-center gap-2.5 bg-success/[0.12] border border-success/30 rounded-2xl px-4 py-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-success shrink-0" />
                  <p className="text-success text-sm">Account created — please sign in.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Email address"
                  icon={Mail}
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errors.email) setErrors((p) => ({ ...p, email: null }))
                  }}
                  error={errors.email}
                />
                <Input
                  label="Password"
                  icon={Lock}
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (errors.password) setErrors((p) => ({ ...p, password: null }))
                  }}
                  error={errors.password}
                />
                <Button type="submit" fullWidth loading={loading} size="lg" className="mt-1">
                  Sign In
                  <ArrowRight size={15} />
                </Button>
              </form>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border/60" />
                <span className="text-[11px] text-gray-700 uppercase tracking-wider">or</span>
                <div className="flex-1 h-px bg-border/60" />
              </div>

              <p className="text-center text-sm text-gray-500">
                New to Velora?{' '}
                <Link to="/register" className="text-accent hover:text-accent-light transition-colors font-medium">
                  Create an account
                </Link>
              </p>

              <div className="pt-1 border-t border-border/40">
                <p className="text-[11px] text-gray-700 text-center leading-relaxed">
                  Demo &mdash; admin@velora.com / admin123 &bull; john@example.com / password123
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
