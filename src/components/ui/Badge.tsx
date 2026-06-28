import { cn } from '@/lib/utils'
import { ORDER_STATUS_LABELS } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'green' | 'blue' | 'orange' | 'red' | 'purple' | 'gray'
  className?: string
}

const variantMap: Record<string, string> = {
  green:  'bg-emerald-50 text-emerald-700',
  blue:   'bg-sky-50 text-sky-700',
  orange: 'bg-orange-50 text-orange-700',
  red:    'bg-red-50 text-red-600',
  purple: 'bg-purple-50 text-purple-700',
  gray:   'bg-gray-100 text-gray-600',
}

export function Badge({ children, variant = 'gray', className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold', variantMap[variant], className)}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {children}
    </span>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const info = ORDER_STATUS_LABELS[status]
  if (!info) return <Badge variant="gray">{status}</Badge>
  return <Badge variant={info.color as any}>{info.ar}</Badge>
}
