import { useRef } from 'react'
import { motion } from 'framer-motion'

/**
 * Reusable stat card with a mouse-spotlight effect.
 *
 * layout="stacked"  (default) — icon on top, value and label below
 * layout="inline"             — icon and text side by side
 */
export default function StatCard({ label, value, icon: Icon, color, delay = 0, layout = 'stacked' }) {
  const ref = useRef(null)

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect()
    ref.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
    ref.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
  }

  if (layout === 'inline') {
    return (
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="surface-card rounded-3xl p-5 flex items-center gap-4"
      >
        <div className={`w-11 h-11 rounded-xl bg-white/[0.04] border border-white/[0.05] flex items-center justify-center shrink-0 ${color}`}>
          <Icon size={18} />
        </div>
        <div>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-gray-600 text-[10px] uppercase tracking-wider mt-0.5">{label}</p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="surface-card rounded-3xl p-5"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.05] flex items-center justify-center ${color}`}>
          <Icon size={18} />
        </div>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-gray-600 text-[10px] mt-1 uppercase tracking-wider">{label}</p>
    </motion.div>
  )
}
