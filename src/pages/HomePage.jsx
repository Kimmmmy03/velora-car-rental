import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronDown, Car, Shield, Clock, Star, Zap } from 'lucide-react'
import toast from 'react-hot-toast'
import { getAllCars } from '@/services/carService'
import { getAllBookings } from '@/services/bookingService'
import { getCategories } from '@/services/categoryService'
import CarGrid from '@/components/cars/CarGrid'
import CarFilter from '@/components/cars/CarFilter'
import EmptyState from '@/components/ui/EmptyState'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Button from '@/components/ui/Button'

export default function HomePage() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [sortBy, setSortBy] = useState('default')
  const [bookingCounts, setBookingCounts] = useState(null)
  const [categories, setCategories] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    getAllCars()
      .then(setCars)
      .catch(() => toast.error('Failed to load fleet'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    getCategories()
      .then((cats) => setCategories(cats.map((c) => c.name)))
      .catch(() => toast.error('Failed to load categories'))
  }, [])

  // Lazy-load booking counts only when Most Popular sort is selected
  useEffect(() => {
    if (sortBy !== 'most-popular' || bookingCounts !== null) return
    getAllBookings()
      .then((bookings) => {
        const counts = {}
        bookings.forEach((b) => {
          counts[b.carId] = (counts[b.carId] || 0) + 1
        })
        setBookingCounts(counts)
      })
      .catch(() => toast.error('Failed to load popularity data'))
  }, [sortBy, bookingCounts])

  const displayedCars = (() => {
    // 1. Filter
    let result = cars.filter((car) => {
      const matchesSearch =
        !searchTerm ||
        `${car.brand} ${car.model}`.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'ALL' || car.status === statusFilter
      const matchesCategory = !categoryFilter || car.category === categoryFilter
      return matchesSearch && matchesStatus && matchesCategory
    })

    // 2. Sort
    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => a.dailyRate - b.dailyRate)
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => b.dailyRate - a.dailyRate)
    } else if (sortBy === 'most-popular' && bookingCounts !== null) {
      result = [...result].sort(
        (a, b) => (bookingCounts[b.carId] || 0) - (bookingCounts[a.carId] || 0)
      )
      result = result.slice(0, 10)
    }

    return result
  })()

  const handleBook = (carId) => navigate(`/booking/${carId}`)
  const handleClearFilters = () => {
    setSearchTerm('')
    setStatusFilter('ALL')
    setCategoryFilter('')
    setSortBy('default')
  }

  const scrollToFleet = () => {
    document.getElementById('fleet')?.scrollIntoView({ behavior: 'smooth' })
  }

  const stats = [
    { value: '50+', label: 'Vehicles' },
    { value: '100%', label: 'Insured' },
    { value: '24/7', label: 'Support' },
    { value: '5★', label: 'Service' },
  ]

  const features = [
    { icon: Shield, label: 'Fully Insured', desc: 'Every vehicle covered' },
    { icon: Clock, label: '24/7 Support', desc: 'Always here for you' },
    { icon: Star, label: 'Premium Fleet', desc: 'World\'s finest cars' },
    { icon: Zap, label: 'Instant Booking', desc: 'Reserve in minutes' },
  ]

  return (
    <div>
      {/* ─── Hero ─── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
        {/* Backgrounds */}
        <div className="absolute inset-0 bg-bg-primary" />
        <div className="absolute inset-0 pattern-dots opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(200,169,126,0.07),transparent)]" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-bg-primary to-transparent" />

        {/* Content */}
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.08] border border-white/[0.15] backdrop-blur-xl">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="text-[11px] text-gray-400 font-medium uppercase tracking-widest">
                Premium Car Rental — Est. 2024
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h1 className="font-[var(--font-display)] text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
                Drive the{' '}
                <em className="text-gradient-accent not-italic">Extraordinary</em>
              </h1>
              <p className="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
                Discover our curated collection of the world&apos;s finest automobiles.
                Your journey to excellence begins here.
              </p>
            </div>

            {/* Stats strip */}
            <div className="flex items-center justify-center gap-8 sm:gap-12 bg-white/[0.04] border border-white/[0.1] rounded-3xl px-6 py-4 backdrop-blur-xl">
              {stats.map(({ value, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.07 }}
                  className="text-center"
                >
                  <p className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold text-accent leading-none">
                    {value}
                  </p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">{label}</p>
                </motion.div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" onClick={scrollToFleet}>
                Explore Fleet
              </Button>
              <Button size="lg" variant="outline" onClick={scrollToFleet}>
                View All Cars
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.button
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-accent/40 hover:text-accent/70 transition-colors bg-transparent border-none cursor-pointer"
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          onClick={scrollToFleet}
        >
          <ChevronDown size={24} />
        </motion.button>
      </section>

      {/* ─── Features strip ─── */}
      <section className="border-y border-white/[0.08] bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, label, desc }, i) => (
              <div
                key={label}
                className={`flex items-center gap-4 px-6 py-6 border-white/[0.05]
                  ${i % 2 === 0 ? 'border-r' : ''}
                  ${i < 2 ? 'border-b lg:border-b-0' : ''}
                  ${i < features.length - 1 ? 'lg:border-r' : ''}
                `}
              >
                <div className="w-10 h-10 rounded-xl bg-accent/[0.07] border border-accent/10 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-accent/80" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{label}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Fleet ─── */}
      <section id="fleet" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-accent text-[11px] font-semibold uppercase tracking-[0.3em] mb-2">
                Our Collection
              </p>
              <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl font-bold">
                Exclusive Fleet
              </h2>
              <p className="text-gray-500 text-sm mt-2">
                {cars.length} vehicles available for reservation
              </p>
            </div>
            {displayedCars.length > 0 && displayedCars.length !== cars.length && (
              <p className="text-gray-600 text-sm">
                Showing <span className="text-accent font-medium">{displayedCars.length}</span> results
              </p>
            )}
          </div>

          <CarFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            categories={categories}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          {loading ? (
            <LoadingSpinner />
          ) : sortBy === 'most-popular' && bookingCounts === null ? (
            <LoadingSpinner />
          ) : displayedCars.length > 0 ? (
            <CarGrid cars={displayedCars} onBook={handleBook} />
          ) : (
            <EmptyState
              icon={Car}
              title="No vehicles found"
              description="Try adjusting your search or filter to discover available vehicles."
              actionLabel="Clear filters"
              onAction={handleClearFilters}
            />
          )}
        </motion.div>
      </section>
    </div>
  )
}
