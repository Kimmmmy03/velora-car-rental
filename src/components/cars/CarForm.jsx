import { useState, useRef } from 'react'
import { Car, Hash, DollarSign, Tag, ChevronDown, Percent, UploadCloud, X } from 'lucide-react'
import toast from 'react-hot-toast'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { validateRequired, validateDailyRate } from '@/utils/validators'
import { CAR_STATUSES } from '@/utils/constants'
import { uploadCarImage } from '@/services/carService'

export default function CarForm({ car = null, categories = [], onSubmit, onCancel }) {
  const isEdit = !!car
  const [form, setForm] = useState({
    brand: car?.brand || '',
    model: car?.model || '',
    licensePlate: car?.licensePlate || '',
    dailyRate: car?.dailyRate?.toString() || '',
    status: car?.status || CAR_STATUSES.AVAILABLE,
    category: car?.category || '',
    isPromoted: car?.isPromoted ?? false,
    discountPercentage: car?.discountPercentage?.toString() || '0',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  // Image state — file takes priority over the existing URL when set
  const existingImageUrl = car?.imageUrl || ''
  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(existingImageUrl)
  const fileInputRef = useRef(null)

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    // Revoke previous blob URL to avoid memory leaks
    if (previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl)
    setImageFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const clearImage = (e) => {
    e.stopPropagation()
    if (previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl)
    setImageFile(null)
    setPreviewUrl('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const togglePromoted = () => {
    setForm((prev) => ({
      ...prev,
      isPromoted: !prev.isPromoted,
      discountPercentage: prev.isPromoted ? '0' : prev.discountPercentage,
    }))
  }

  const validate = () => {
    const newErrors = {}
    newErrors.brand = validateRequired(form.brand, 'Brand')
    newErrors.model = validateRequired(form.model, 'Model')
    newErrors.licensePlate = validateRequired(form.licensePlate, 'License plate')
    newErrors.dailyRate = validateDailyRate(form.dailyRate)
    if (form.isPromoted) {
      const pct = parseInt(form.discountPercentage)
      if (isNaN(pct) || pct < 1 || pct > 100) {
        newErrors.discountPercentage = 'Discount must be between 1 and 100'
      }
    }
    const filtered = Object.fromEntries(Object.entries(newErrors).filter(([, v]) => v))
    setErrors(filtered)
    return Object.keys(filtered).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      let imageUrl = existingImageUrl
      if (imageFile) {
        try {
          imageUrl = await uploadCarImage(imageFile)
        } catch {
          toast.error('Image upload failed. Please try again.')
          return
        }
      }
      await onSubmit({ ...form, imageUrl })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-h-[calc(90vh-8rem)] overflow-y-auto pr-2"
    >
      <Input
        label="Brand"
        icon={Car}
        placeholder="e.g. Porsche"
        value={form.brand}
        onChange={handleChange('brand')}
        error={errors.brand}
      />
      <Input
        label="Model"
        icon={Tag}
        placeholder="e.g. 911 GT3"
        value={form.model}
        onChange={handleChange('model')}
        error={errors.model}
      />
      <Input
        label="License Plate"
        icon={Hash}
        placeholder="e.g. WKL 911"
        value={form.licensePlate}
        onChange={handleChange('licensePlate')}
        error={errors.licensePlate}
      />
      <Input
        label="Daily Rate (RM)"
        icon={DollarSign}
        type="number"
        step="0.01"
        placeholder="e.g. 2500.00"
        value={form.dailyRate}
        onChange={handleChange('dailyRate')}
        error={errors.dailyRate}
      />

      {/* Image upload */}
      <div className="space-y-2">
        <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
          Vehicle Image
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <div
          onClick={() => fileInputRef.current?.click()}
          className="relative w-full rounded-2xl border border-dashed border-border-light/80 bg-bg-input/90 overflow-hidden cursor-pointer group transition-all hover:border-accent/40 hover:bg-bg-input"
        >
          {previewUrl ? (
            <>
              <img
                src={previewUrl}
                alt="Vehicle preview"
                className="w-full h-40 object-cover"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <UploadCloud size={18} className="text-white" />
                <span className="text-white text-sm font-medium">Change image</span>
              </div>
              {/* Clear button */}
              <button
                type="button"
                onClick={clearImage}
                className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-colors border-none cursor-pointer"
                title="Remove image"
              >
                <X size={13} />
              </button>
              {/* New file badge */}
              {imageFile && (
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-accent/80 backdrop-blur-sm text-[10px] font-semibold text-white uppercase tracking-wider">
                  New
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 py-8 text-gray-600 group-hover:text-gray-400 transition-colors">
              <UploadCloud size={22} strokeWidth={1.5} />
              <p className="text-xs">Click to upload an image</p>
              <p className="text-[10px] text-gray-700">PNG, JPG, WEBP up to 10 MB</p>
            </div>
          )}
        </div>
        {imageFile && (
          <p className="text-[11px] text-gray-600 truncate px-1">{imageFile.name}</p>
        )}
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
          Category
        </label>
        <div className="relative">
          <select
            value={form.category}
            onChange={handleChange('category')}
            className="w-full appearance-none bg-bg-input/90 border border-border-light/80 rounded-2xl pl-4 pr-10 py-3 text-sm text-white outline-none focus:border-accent/55 input-glow transition-all cursor-pointer"
          >
            <option value="">— Select category —</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600">
            <ChevronDown size={15} />
          </div>
        </div>
      </div>

      {/* Is Promoted toggle */}
      <div className="flex flex-row items-center justify-between gap-4 p-4 border border-white/10 rounded-xl bg-white/5 w-full overflow-hidden">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-300">Promoted</p>
          <p className="text-gray-600 text-xs mt-0.5 truncate">Highlight with special pricing</p>
        </div>
        <button
          type="button"
          onClick={togglePromoted}
          aria-pressed={form.isPromoted}
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none ${
            form.isPromoted ? 'bg-accent' : 'bg-white/20'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${
              form.isPromoted ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Discount Percentage — only visible when promoted.
          min="0" so HTML5 validation never blocks submission when the value
          is briefly 0 (e.g. right after toggling Promoted on). Our custom
          validate() enforces the real 1–100 rule with an inline error. */}
      {form.isPromoted && (
        <Input
          label="Discount Percentage"
          icon={Percent}
          type="number"
          min="0"
          max="100"
          placeholder="e.g. 15"
          value={form.discountPercentage}
          onChange={handleChange('discountPercentage')}
          error={errors.discountPercentage}
        />
      )}

      {/* Status — edit mode only */}
      {isEdit && (
        <div className="space-y-2">
          <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Status</label>
          <div className="relative">
            <select
              value={form.status}
              onChange={handleChange('status')}
              className="w-full appearance-none bg-bg-input/90 border border-border-light/80 rounded-2xl pl-4 pr-10 py-3 text-sm text-white outline-none focus:border-accent/55 input-glow transition-all cursor-pointer"
            >
              {Object.values(CAR_STATUSES).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600">
              <ChevronDown size={15} />
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-3">
        <Button type="submit" fullWidth loading={loading}>
          {isEdit ? 'Update Vehicle' : 'Add to Fleet'}
        </Button>
        {onCancel && (
          <Button variant="ghost" onClick={onCancel} fullWidth>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
