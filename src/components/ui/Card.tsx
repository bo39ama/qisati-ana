import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function Card({ children, className, hover, padding = 'md' }: CardProps) {
  const pads = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' }
  return (
    <div className={cn(
      'bg-white rounded-3xl shadow-sm border border-gray-100',
      pads[padding],
      hover && 'transition-all duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer',
      className
    )}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-center justify-between pb-4 mb-4 border-b border-gray-100', className)}>
      {children}
    </div>
  )
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-xs font-bold tracking-widest uppercase text-sky-400 mb-3">
      {children}
    </span>
  )
}

export function SectionTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={cn('text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4', className)}>
      {children}
    </h2>
  )
}
