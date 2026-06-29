import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary px-4">
      <div className="absolute inset-0 pattern-dots opacity-25" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(200,169,126,0.04),transparent)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative text-center space-y-7 gradient-border rounded-3xl px-10 py-12"
      >
        <div className="space-y-2">
          <h1 className="font-[var(--font-display)] text-[8rem] sm:text-[10rem] font-bold leading-none text-gradient-accent">
            404
          </h1>
          <div className="section-shine w-48 mx-auto" />
        </div>

        <div className="space-y-2">
          <p className="text-white text-xl font-semibold">Page not found</p>
          <p className="text-gray-400 text-sm max-w-xs mx-auto leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <Button onClick={() => navigate('/')} variant="outline" size="lg">
          <ArrowLeft size={15} />
          Back to Home
        </Button>
      </motion.div>
    </div>
  )
}
