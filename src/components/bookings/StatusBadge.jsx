import { BOOKING_STATUSES } from '@/utils/constants'

const statusConfig = {
  [BOOKING_STATUSES.PENDING]:   { bg: 'bg-warning/[0.08]',  text: 'text-warning',  border: 'border-warning/15',  dot: 'bg-warning'  },
  [BOOKING_STATUSES.APPROVED]:  { bg: 'bg-success/[0.08]',  text: 'text-success',  border: 'border-success/15',  dot: 'bg-success'  },
  [BOOKING_STATUSES.REJECTED]:  { bg: 'bg-danger/[0.08]',   text: 'text-danger',   border: 'border-danger/15',   dot: 'bg-danger'   },
  [BOOKING_STATUSES.RETURNED]:  { bg: 'bg-info/[0.08]',     text: 'text-info',     border: 'border-info/15',     dot: 'bg-info'     },
  [BOOKING_STATUSES.CANCELLED]: { bg: 'bg-white/[0.03]',    text: 'text-gray-500', border: 'border-border',      dot: 'bg-gray-600' },
}

export default function StatusBadge({ status }) {
  const cfg = statusConfig[status] || statusConfig[BOOKING_STATUSES.CANCELLED]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-semibold uppercase tracking-wider ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} shrink-0`} />
      {status}
    </span>
  )
}
