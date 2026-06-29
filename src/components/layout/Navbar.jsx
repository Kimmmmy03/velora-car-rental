import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Car, CalendarDays, LogOut } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const links = [
    { to: '/', label: 'Fleet', icon: Car },
    { to: '/my-bookings', label: 'My Bookings', icon: CalendarDays },
  ]

  const isActive = (path) => location.pathname === path

  const initials = user?.fullName
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U'

  return (
    <>
      {/* Top micro-accent line */}
      <div className="fixed top-0 left-0 right-0 z-50 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" />

      <nav className="fixed top-px left-0 right-0 z-40 glass-dark border-b border-white/[0.09]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 no-underline shrink-0">
              <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center shadow-[0_10px_30px_rgba(200,169,126,0.45)] glow-pulse">
                <span className="text-bg-primary font-black text-[11px]">V</span>
              </div>
              <span className="font-[var(--font-display)] text-base font-bold text-white tracking-[0.18em]">
                VELORA
              </span>
            </Link>

            {/* Center navigation — desktop */}
            <div className="hidden md:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
              {links.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors no-underline rounded-lg ${
                    isActive(to)
                      ? 'text-white'
                      : 'text-gray-400 hover:text-gray-100 hover:bg-white/[0.09]'
                  }`}
                >
                  {label}
                  {isActive(to) && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-accent"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Right: user info + logout — desktop */}
            <div className="hidden md:flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/[0.08] border border-white/[0.14]">
                <div className="w-6 h-6 rounded-full bg-accent/15 border border-accent/25 flex items-center justify-center shrink-0">
                  <span className="text-accent font-bold" style={{ fontSize: '10px' }}>{initials}</span>
                </div>
                <span className="text-sm text-gray-300 max-w-[100px] truncate">
                  {user?.fullName?.split(' ')[0]}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-danger hover:bg-danger/[0.13] transition-all bg-transparent border-none cursor-pointer"
                title="Sign out"
              >
                <LogOut size={14} />
              </button>
            </div>

            {/* Hamburger — mobile */}
            <button
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.08] bg-transparent border-none cursor-pointer transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-white/[0.08]"
            >
              <div className="px-4 py-3 space-y-1 bg-bg-secondary/95 backdrop-blur-xl">
                {links.map(({ to, label, icon: NavIcon }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm no-underline transition-all ${
                      isActive(to)
                        ? 'text-accent bg-accent/[0.14] border border-accent/30 font-medium'
                        : 'text-gray-400 hover:text-white hover:bg-white/[0.08]'
                    }`}
                  >
                    <NavIcon size={15} />
                    {label}
                  </Link>
                ))}
                <div className="pt-2 mt-1 border-t border-white/[0.08] flex items-center justify-between px-4 py-2">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-6 h-6 rounded-full bg-accent/15 border border-accent/25 flex items-center justify-center">
                      <span className="text-accent font-bold" style={{ fontSize: '10px' }}>{initials}</span>
                    </div>
                    <span className="truncate max-w-[140px]">{user?.fullName}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 text-xs text-danger/70 hover:text-danger bg-transparent border-none cursor-pointer transition-colors px-2 py-1 rounded-lg hover:bg-danger/[0.12]"
                  >
                    <LogOut size={13} />
                    Sign out
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  )
}
