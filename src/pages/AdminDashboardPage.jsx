import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, CalendarDays, Car, TrendingUp, DollarSign, Tag } from 'lucide-react'
import toast from 'react-hot-toast'
import { getAllCars, addCar, updateCar, deleteCar } from '@/services/carService'
import { getAllBookings } from '@/services/bookingService'
import { getCategories } from '@/services/categoryService'
import { formatCurrency } from '@/utils/formatters'
import { calculateEffectiveRate } from '@/utils/priceUtils'
import { CAR_STATUSES, BOOKING_STATUSES } from '@/utils/constants'
import CarForm from '@/components/cars/CarForm'
import CategoryManagerModal from '@/components/cars/CategoryManagerModal'
import StatCard from '@/components/ui/StatCard'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import ConfirmDialog from '@/components/ui/ConfirmDialog'


const statusDot = (status) => ({
  [CAR_STATUSES.AVAILABLE]: 'bg-success',
  [CAR_STATUSES.RESERVED]:  'bg-warning',
  [CAR_STATUSES.RENTED]:    'bg-danger',
}[status] || 'bg-gray-500')

export default function AdminDashboardPage() {
  const [cars, setCars] = useState([])
  const [categoryOptions, setCategoryOptions] = useState([])  // string[] for CarForm dropdowns
  const [loading, setLoading] = useState(true)
  const [editCar, setEditCar] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [stats, setStats] = useState({ totalCars: 0, available: 0, bookings: 0, revenue: 0 })

  const loadCategories = async () => {
    try {
      const cats = await getCategories()
      setCategoryOptions(cats.map((c) => c.name))
    } catch (err) {
      toast.error(err.message || 'Failed to load categories')
    }
  }

  const loadCars = async () => {
    setLoading(true)
    try {
      const [allCars, bookings] = await Promise.all([getAllCars(), getAllBookings()])
      setCars(allCars)
      const revenue = bookings
        .filter((b) => [BOOKING_STATUSES.APPROVED, BOOKING_STATUSES.RETURNED].includes(b.bookingStatus))
        .reduce((sum, b) => sum + b.totalCost, 0)
      setStats({
        totalCars: allCars.length,
        available: allCars.filter((c) => c.status === CAR_STATUSES.AVAILABLE).length,
        bookings: bookings.length,
        revenue,
      })
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCars()
    loadCategories()
  }, [])

  const handleAdd = async (formData) => {
    try {
      await addCar(formData)
      toast.success('Vehicle added to fleet')
      await loadCars()
    } catch (err) { toast.error(err.message) }
  }

  const handleUpdate = async (formData) => {
    try {
      const updated = await updateCar(editCar.carId, formData)
      // Patch local state immediately so the edited fields (including status)
      // reflect without waiting on a refetch. Preserve review aggregates since
      // updateCar's returned row doesn't include them.
      setCars((prev) =>
        prev.map((c) =>
          c.carId === updated.carId
            ? {
                ...c,
                brand: updated.brand,
                model: updated.model,
                licensePlate: updated.licensePlate,
                dailyRate: updated.dailyRate,
                status: updated.status,
                imageUrl: updated.imageUrl,
                category: updated.category,
                isPromoted: updated.isPromoted,
                discountPercentage: updated.discountPercentage,
              }
            : c,
        ),
      )
      toast.success('Vehicle updated')
      setShowEditModal(false)
      setEditCar(null)
    } catch (err) { toast.error(err.message) }
  }

  const handleDelete = async () => {
    try {
      await deleteCar(deleteId)
      toast.success('Vehicle removed')
      await loadCars()
    } catch (err) { toast.error(err.message) }
    setDeleteId(null)
  }

  const openEdit = (car) => { setEditCar(car); setShowEditModal(true) }

  const statCards = [
    { label: 'Total Fleet',  value: stats.totalCars,             icon: Car,        color: 'text-accent' },
    { label: 'Available',    value: stats.available,             icon: TrendingUp, color: 'text-success' },
    { label: 'Bookings',     value: stats.bookings,              icon: CalendarDays, color: 'text-info' },
    { label: 'Revenue',      value: formatCurrency(stats.revenue), icon: DollarSign, color: 'text-accent' },
  ]

  if (loading) return <LoadingSpinner fullScreen />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-danger text-[11px] font-semibold uppercase tracking-[0.3em] mb-2">
              Fleet Management
            </p>
            <h1 className="font-[var(--font-display)] text-3xl font-bold">Dashboard</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCategoryModal(true)}
            >
              <Tag size={13} />
              Manage Categories
            </Button>
            <Link to="/admin/bookings">
              <Button variant="outline" size="sm">
                <CalendarDays size={13} />
                Manage Bookings
              </Button>
            </Link>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map(({ label, value, icon, color }, i) => (
            <StatCard
              key={label}
              label={label}
              value={value}
              icon={icon}
              color={color}
              delay={i * 0.07}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">

          {/* Add Vehicle form */}
          <div className="lg:col-span-1">
            <div className="gradient-border rounded-3xl overflow-hidden sticky top-24">
              <div className="shine-bar" />
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-accent/[0.07] border border-accent/10 flex items-center justify-center">
                    <Plus size={15} className="text-accent/70" />
                  </div>
                  <h2 className="font-[var(--font-display)] text-base font-semibold text-white">Add Vehicle</h2>
                </div>
                <CarForm categories={categoryOptions} onSubmit={handleAdd} />
              </div>
            </div>
          </div>

          {/* Fleet table */}
          <div className="lg:col-span-2">
            <div className="surface-elevated rounded-3xl overflow-hidden">
              <div className="px-5 py-4 border-b border-white/[0.08] flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/[0.07] border border-accent/10 flex items-center justify-center">
                  <Car size={14} className="text-accent/70" />
                </div>
                <h2 className="font-[var(--font-display)] text-base font-semibold text-white">Fleet Inventory</h2>
                <span className="ml-auto text-[11px] text-gray-600 bg-white/[0.04] px-3 py-1 rounded-lg">
                  {cars.length} vehicles
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.04]">
                      {['ID', 'Vehicle', 'License', 'Rate', 'Status', ''].map((h, i) => (
                        <th key={h + i} className={`py-3 px-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest ${i === 5 ? 'text-right' : 'text-left'}`}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cars.map((car) => (
                      <tr key={car.carId} className="border-b border-white/[0.03] hover:bg-white/[0.015] transition-colors">
                        <td className="py-3.5 px-4 text-gray-600 font-mono text-xs">#{car.carId}</td>
                        <td className="py-3.5 px-4">
                          <p className="text-white font-medium text-sm">{car.brand}</p>
                          <p className="text-gray-600 text-xs mt-0.5">{car.model}</p>
                          {car.category && (
                            <span className="inline-block mt-1 px-1.5 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.08] text-gray-500 text-[9px] font-semibold uppercase tracking-wider">
                              {car.category}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-gray-500 text-xs font-mono">{car.licensePlate}</td>
                        <td className="py-3.5 px-4">
                          {car.isPromoted ? (
                            <>
                              <p className="line-through text-gray-500 text-sm">{formatCurrency(car.dailyRate)}</p>
                              <p className="text-green-400 font-bold text-sm">{formatCurrency(calculateEffectiveRate(car))}</p>
                              <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded-md bg-success/[0.1] border border-success/25 text-success text-[9px] font-bold uppercase tracking-wider">
                                -{car.discountPercentage}% off
                              </span>
                            </>
                          ) : (
                            <p className="text-accent font-semibold text-sm">{formatCurrency(car.dailyRate)}</p>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                            <span className={`w-1.5 h-1.5 rounded-full ${statusDot(car.status)}`} />
                            {car.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex justify-end gap-0.5">
                            <button
                              onClick={() => openEdit(car)}
                              className="p-2 text-gray-600 hover:text-accent hover:bg-accent/[0.07] rounded-lg transition-all bg-transparent border-none cursor-pointer"
                              title="Edit"
                            >
                              <Pencil size={13} />
                            </button>
                            <button
                              onClick={() => setDeleteId(car.carId)}
                              className="p-2 text-gray-600 hover:text-danger hover:bg-danger/[0.07] rounded-lg transition-all bg-transparent border-none cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {cars.length === 0 && (
                <div className="py-14 text-center text-gray-600 text-sm">
                  No vehicles yet. Add one using the form.
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <Modal
        isOpen={showEditModal}
        onClose={() => { setShowEditModal(false); setEditCar(null) }}
        title="Edit Vehicle"
      >
        {editCar && (
          <CarForm
            car={editCar}
            categories={categoryOptions}
            onSubmit={handleUpdate}
            onCancel={() => { setShowEditModal(false); setEditCar(null) }}
          />
        )}
      </Modal>

      <ConfirmDialog
        isOpen={deleteId !== null}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        title="Remove Vehicle"
        message="Are you sure you want to remove this vehicle from the fleet? This cannot be undone."
        confirmText="Yes, Remove"
      />

      <CategoryManagerModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onChange={loadCategories}
      />
    </div>
  )
}
