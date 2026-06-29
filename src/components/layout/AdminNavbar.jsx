import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, CalendarDays, LogOut, ShieldCheck, Menu, X } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function AdminNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const links = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/bookings', label: 'Bookings', icon: CalendarDays },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <>
      {/* Top danger accent bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-px bg-gradient-to-r from-transparent via-danger/70 to-transparent" />

      <nav className="fixed top-px left-0 right-0 z-40 glass-dark border-b border-white/[0.09]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">

            {/* Logo with admin badge */}
            <Link to="/admin" className="flex items-center gap-2.5 no-underline shrink-0">
              <div className="w-8 h-8 rounded-xl bg-danger/16 border border-danger/35 flex items-center justify-center">
                <ShieldCheck size={14} className="text-danger/80" />
              </div>
              <span className="font-[var(--font-display)] text-[15px] font-bold text-white tracking-[0.18em]">
                VELORA
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-danger/70 bg-danger/[0.07] border border-danger/15 px-2 py-0.5 rounded-md">
                Admin
              </span>
            </Link>

            {/* Center navigation — desktop */}
            <div className="hidden sm:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
              {links.map(({ to, label, icon: NavIcon }) => (
                <Link
                  key={to}
                  to={to}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors no-underline ${
                    isActive(to)
                      ? 'text-white'
                      : 'text-gray-400 hover:text-gray-100 hover:bg-white/[0.08]'
                  }`}
                >
                  <NavIcon size={14} />
                  {label}
                  {isActive(to) && (
                    <motion.div
                      layoutId="admin-nav-underline"
                      className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-danger/70"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Right: user + logout (desktop) + hamburger (mobile) */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="hidden sm:inline text-sm text-gray-300 mr-1 truncate max-w-[120px]">
                {user?.fullName}
              </span>
              <button
                onClick={handleLogout}
                className="hidden sm:flex w-8 h-8 rounded-xl items-center justify-center text-gray-400 hover:text-danger hover:bg-danger/[0.12] transition-all bg-transparent border-none cursor-pointer"
                title="Sign out"
              >
                <LogOut size={14} />
              </button>
              {/* Mobile hamburger */}
              <button
                className="sm:hidden w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.08] bg-transparent border-none cursor-pointer transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
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
              className="sm:hidden overflow-hidden border-t border-white/[0.08]"
            >
              <div className="px-4 py-3 space-y-1 bg-bg-secondary/95 backdrop-blur-xl">
                {links.map(({ to, label, icon: NavIcon }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm no-underline transition-all ${
                      isActive(to)
                        ? 'text-danger bg-danger/[0.10] border border-danger/25 font-medium'
                        : 'text-gray-400 hover:text-white hover:bg-white/[0.08]'
                    }`}
                  >
                    <NavIcon size={15} />
                    {label}
                  </Link>
                ))}
                <div className="pt-2 mt-1 border-t border-white/[0.08] flex items-center justify-between px-4 py-2">
                  <span className="text-sm text-gray-400 truncate max-w-[160px]">{user?.fullName}</span>
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
