import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CalendarDays, ArrowLeft, CheckCircle2, Car } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'
import { getCarById } from '@/services/carService'
import { createBooking, isCarAvailable } from '@/services/bookingService'
import { calculateDays, calculateTotalCost } from '@/utils/bookingCalculations'
import { calculateEffectiveRate } from '@/utils/priceUtils'
import { validateDateRange } from '@/utils/validators'
import { formatCurrency } from '@/utils/formatters'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import BookingPreview from '@/components/bookings/BookingPreview'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

const STEPS = ['Dates', 'Review', 'Done']

export default function BookingPage() {
  const { carId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [car, setCar] = useState(null)
  const [step, setStep] = useState(1)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [days, setDays] = useState(0)
  const [totalCost, setTotalCost] = useState(0)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getCarById(carId)
      .then(setCar)
      .catch(() => {
        toast.error('Vehicle not found')
        navigate('/')
      })
  }, [carId, navigate])

  if (!car) return <LoadingSpinner />

  const handlePreview = async (e) => {
    e.preventDefault()
    const dateError = validateDateRange(startDate, endDate)
    if (dateError) { setError(dateError); return }
    setLoading(true)
    try {
      const available = await isCarAvailable(car.carId, startDate, endDate)
      if (!available) {
        setError('This vehicle is not available for the selected dates')
        return
      }
      const d = calculateDays(startDate, endDate)
      setDays(d)
      // Use the promotion-aware effective rate so promoted cars are actually
      // billed at the discounted price (not the sticker daily rate).
      setTotalCost(calculateTotalCost(calculateEffectiveRate(car), d))
      setError('')
      setStep(2)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await createBooking({ userId: user.userId, carId: car.carId, startDate, endDate, totalCost })
      setStep(3)
      toast.success('Booking confirmed!')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className={`${step === 2 ? 'max-w-4xl' : 'max-w-2xl'} mx-auto px-4 py-12 transition-[max-width] duration-300`}>

        {/* Progress stepper */}
        <div className="flex items-center justify-center mb-12">
          {STEPS.map((label, i) => {
            const s = i + 1
            const done = step > s
            const active = step === s
            return (
              <div key={s} className="flex items-center">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      done
                        ? 'bg-accent/15 text-accent border border-accent/30'
                        : active
                          ? 'bg-accent text-bg-primary shadow-[0_2px_12px_rgba(200,169,126,0.3)]'
                          : 'bg-bg-tertiary text-gray-600 border border-border'
                    }`}
                  >
                    {done ? <CheckCircle2 size={14} /> : s}
                  </div>
                  <span className={`text-[10px] uppercase tracking-wider font-medium transition-colors ${
                    active ? 'text-accent' : done ? 'text-gray-500' : 'text-gray-700'
                  }`}>
                    {label}
                  </span>
                </div>
                {s < STEPS.length && (
                  <div className={`w-14 sm:w-20 h-px mx-3 mb-5 transition-colors duration-300 ${step > s ? 'bg-accent/30' : 'bg-border'}`} />
                )}
              </div>
            )
          })}
        </div>

        <AnimatePresence mode="wait">

          {/* Step 1: Dates */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-[11px] text-gray-600 hover:text-accent transition-colors bg-transparent border-none cursor-pointer uppercase tracking-wider"
              >
                <ArrowLeft size={13} />
                Back to Fleet
              </button>

              {/* Car summary */}
              <div className="surface-card rounded-3xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/[0.07] border border-accent/10 flex items-center justify-center shrink-0">
                  <Car size={20} className="text-accent/70" />
                </div>
                <div className="min-w-0">
                  <h2 className="font-[var(--font-display)] text-lg font-bold text-white truncate">
                    {car.brand} {car.model}
                  </h2>
                  <p className="text-accent text-sm font-semibold mt-0.5">
                    {formatCurrency(car.dailyRate)}<span className="text-gray-600 font-normal">/day</span>
                  </p>
                </div>
              </div>

              {/* Date form */}
              <div className="gradient-border rounded-3xl overflow-hidden">
                <div className="shine-bar" />
                <div className="p-6">
                  <h3 className="font-[var(--font-display)] text-base font-semibold text-gray-200 mb-5">
                    Select Your Dates
                  </h3>
                  <form onSubmit={handlePreview} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Pick-up Date"
                        icon={CalendarDays}
                        type="date"
                        min={today}
                        value={startDate}
                        onChange={(e) => { setStartDate(e.target.value); setError('') }}
                        onClick={(e) => e.target.showPicker && e.target.showPicker()}
                        onFocus={(e) => e.target.showPicker && e.target.showPicker()}
                      />
                      <Input
                        label="Return Date"
                        icon={CalendarDays}
                        type="date"
                        min={startDate || today}
                        value={endDate}
                        onChange={(e) => { setEndDate(e.target.value); setError('') }}
                        onClick={(e) => e.target.showPicker && e.target.showPicker()}
                        onFocus={(e) => e.target.showPicker && e.target.showPicker()}
                      />
                    </div>
                    {error && (
                      <div className="flex items-center gap-2 bg-danger/[0.12] border border-danger/30 rounded-2xl px-4 py-3">
                        <div className="w-1 h-1 rounded-full bg-danger shrink-0" />
                        <p className="text-danger text-sm">{error}</p>
                      </div>
                    )}
                    <Button type="submit" fullWidth size="lg" loading={loading}>
                      Check Availability
                    </Button>
                  </form>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Review */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
              <div>
                <h2 className="font-[var(--font-display)] text-2xl font-bold text-white">Review Booking</h2>
                <p className="text-gray-500 text-sm mt-1">Confirm your reservation details below</p>
              </div>

              <BookingPreview
                car={car}
                startDate={startDate}
                endDate={endDate}
                days={days}
                totalCost={totalCost}
              />

              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="ghost" onClick={() => setStep(1)} fullWidth>
                  Modify Dates
                </Button>
                <Button onClick={handleConfirm} loading={loading} fullWidth size="lg">
                  Confirm Booking
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center space-y-7 py-8"
            >
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 220, delay: 0.15 }}
                className="inline-flex"
              >
                <div className="w-20 h-20 rounded-2xl bg-success/[0.08] border border-success/20 flex items-center justify-center">
                  <CheckCircle2 size={38} className="text-success" />
                </div>
              </motion.div>

              <div className="space-y-3">
                <h2 className="font-[var(--font-display)] text-3xl font-bold text-white">
                  Booking Confirmed
                </h2>
                <p className="text-gray-400 text-base max-w-sm mx-auto leading-relaxed">
                  Your reservation for the <strong className="text-white">{car.brand} {car.model}</strong> has been submitted.
                </p>
                <div className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-xl bg-warning/[0.07] border border-warning/15">
                  <span className="w-1.5 h-1.5 rounded-full bg-warning" />
                  <p className="text-warning text-sm font-medium">Pending admin approval</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button onClick={() => navigate('/my-bookings')}>
                  View My Bookings
                </Button>
                <Button variant="outline" onClick={() => navigate('/')}>
                  Browse More
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
