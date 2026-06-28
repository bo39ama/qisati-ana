'use client'
import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'white' | 'mint' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, fullWidth, children, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 font-bold rounded-full transition-all duration-200 cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed select-none'

    const variants: Record<string, string> = {
      primary: 'bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-lg shadow-sky-400/30 hover:-translate-y-0.5 hover:shadow-xl',
      secondary: 'bg-white text-gray-700 border-2 border-gray-200 hover:border-sky-400 hover:-translate-y-0.5',
      ghost: 'bg-transparent text-white border-2 border-white/30 hover:border-white',
      white: 'bg-white text-gray-900 shadow-lg hover:-translate-y-0.5 hover:shadow-xl',
      mint: 'bg-gradient-to-r from-emerald-400 to-green-500 text-white shadow-lg shadow-emerald-400/30 hover:-translate-y-0.5',
      danger: 'bg-red-500 text-white hover:bg-red-600',
    }

    const sizes: Record<string, string> = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    }

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant] ?? '', sizes[size] ?? '', fullWidth ? 'w-full' : '', className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? <span className="inline-block animate-spin">⏳</span> : children}
      </button>
    )
  }
)
Button.displayName = 'Button'
export default Button
