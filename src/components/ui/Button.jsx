import { motion } from 'framer-motion'

const variants = {
  primary: 'bg-accent text-bg-primary hover:bg-accent-hover font-semibold shadow-[0_10px_28px_rgba(200,169,126,0.35)] btn-glow',
  danger: 'bg-danger/90 text-white hover:bg-danger font-semibold shadow-[0_8px_22px_rgba(239,68,68,0.28)]',
  success: 'bg-success/90 text-white hover:bg-success font-semibold shadow-[0_8px_22px_rgba(34,197,94,0.26)]',
  ghost: 'bg-transparent text-gray-300 hover:text-white hover:bg-white/[0.09] border border-white/[0.06] btn-expand',
  outline: 'bg-transparent border border-accent/40 text-accent hover:bg-accent/[0.12] hover:border-accent/70 btn-expand',
}

const sizes = {
  sm: 'px-4 py-2 text-xs rounded-xl',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-7 py-3 text-sm rounded-2xl',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { y: -1 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.97 } : {}}
      className={`
        inline-flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer tracking-wide border border-transparent
        ${variants[variant]} ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed saturate-50' : ''}
        ${className}
      `}
    >
      {loading && (
        <svg className="animate-spin h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </motion.button>
  )
}
