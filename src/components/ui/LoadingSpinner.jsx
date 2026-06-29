export default function LoadingSpinner({ fullScreen = false }) {
  const spinner = (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border border-white/[0.15]" />
        <div className="absolute inset-0 rounded-full border-t-2 border-accent animate-spin" />
        <div className="absolute inset-2 rounded-full bg-accent/[0.12]" />
      </div>
      <p className="text-[11px] text-gray-400 tracking-[0.24em] uppercase font-medium">Loading</p>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-bg-primary/95 backdrop-blur-sm">
        {spinner}
      </div>
    )
  }

  return <div className="flex items-center justify-center py-24">{spinner}</div>
}
