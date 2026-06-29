export default function Input({
  label,
  error,
  icon: Icon,
  className = '',
  type,
  ...props
}) {
  const isDate = type === 'date'
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 z-0 text-gray-600 group-focus-within:text-accent/70 transition-colors duration-200 pointer-events-none">
            <Icon size={15} />
          </div>
        )}
        <input
          type={type}
          className={`
            relative z-10 w-full bg-bg-input/90 border rounded-2xl pr-4 py-3 text-sm text-white
            placeholder:text-gray-500 outline-none transition-all duration-200
            focus:bg-bg-tertiary/90 focus:border-accent/55 input-glow
            [color-scheme:dark]
            ${isDate ? 'cursor-pointer' : ''}
            [&::-webkit-calendar-picker-indicator]:absolute
            [&::-webkit-calendar-picker-indicator]:inset-0
            [&::-webkit-calendar-picker-indicator]:w-full
            [&::-webkit-calendar-picker-indicator]:h-full
            [&::-webkit-calendar-picker-indicator]:m-0
            [&::-webkit-calendar-picker-indicator]:p-0
            [&::-webkit-calendar-picker-indicator]:opacity-0
            [&::-webkit-calendar-picker-indicator]:cursor-pointer
            ${Icon ? 'pl-11' : 'pl-4'}
            ${error
              ? 'border-danger/45 focus:border-danger/65'
              : 'border-border-light/80 focus:border-accent/55'
            }
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-[11px] text-danger/90 flex items-center gap-1.5 mt-1">
          <span className="w-1 h-1 rounded-full bg-danger flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
}
