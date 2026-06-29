export default function Footer() {
  return (
    <footer className="mt-auto">
      <div className="section-shine" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">

          {/* Brand */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center shadow-[0_12px_30px_rgba(200,169,126,0.3)]">
                <span className="text-bg-primary font-black text-[11px]">V</span>
              </div>
              <span className="font-[var(--font-display)] text-[15px] font-bold text-white tracking-[0.18em]">
                VELORA
              </span>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed max-w-[280px]">
              Premium automotive experiences for those who demand the extraordinary.
            </p>
          </div>

          {/* Right */}
          <div className="flex flex-col items-start sm:items-end gap-1.5">
            <p className="text-gray-500 text-xs">
              &copy; {new Date().getFullYear()} Velora Premium Rentals
            </p>
            <p className="text-gray-700 text-[10px] uppercase tracking-widest">
              All rights reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
