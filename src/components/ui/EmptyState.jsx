import Button from './Button'

export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      {Icon && (
        <div className="relative mb-6">
          <div className="w-18 h-18 rounded-3xl bg-white/[0.06] border border-white/[0.12] flex items-center justify-center backdrop-blur-md">
            <Icon size={30} className="text-accent/80" strokeWidth={1.5} />
          </div>
          <div className="absolute inset-0 rounded-3xl bg-accent/[0.08] blur-xl" />
        </div>
      )}
      <h3 className="font-[var(--font-display)] text-2xl text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm max-w-sm mb-7 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
