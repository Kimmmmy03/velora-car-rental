import { Search, ChevronDown } from 'lucide-react'
import { CAR_STATUSES } from '@/utils/constants'

const tabs = [
  { value: 'ALL', label: 'All' },
  { value: CAR_STATUSES.AVAILABLE, label: 'Available' },
  { value: CAR_STATUSES.RESERVED, label: 'Reserved' },
  { value: CAR_STATUSES.RENTED, label: 'Rented' },
]

const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'most-popular', label: 'Most Popular (Top 10)' },
]

export default function CarFilter({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  categories,
  categoryFilter,
  onCategoryChange,
  sortBy,
  onSortChange,
}) {
  return (
    <div className="space-y-4 mb-8">
      {/* Search */}
      <div className="relative group">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-accent/70 transition-colors pointer-events-none">
          <Search size={15} />
        </div>
        <input
          placeholder="Search by brand or model…"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-bg-input/90 border border-border-light/80 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-accent/55 focus:bg-bg-tertiary/90 input-glow transition-all"
        />
      </div>

      {/* Status pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-none">
        {tabs.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onStatusChange(value)}
            className={`pill-tab shrink-0 ${statusFilter === value ? 'pill-tab-active' : ''}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Category + Sort dropdowns */}
      <div className="grid grid-cols-2 gap-3">
        {/* Category */}
        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full appearance-none bg-bg-input/90 border border-border-light/80 rounded-2xl pl-4 pr-9 py-2.5 text-sm text-white outline-none focus:border-accent/55 input-glow transition-all cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600">
            <ChevronDown size={14} />
          </div>
        </div>

        {/* Sort By */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full appearance-none bg-bg-input/90 border border-border-light/80 rounded-2xl pl-4 pr-9 py-2.5 text-sm text-white outline-none focus:border-accent/55 input-glow transition-all cursor-pointer"
          >
            {SORT_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600">
            <ChevronDown size={14} />
          </div>
        </div>
      </div>
    </div>
  )
}
