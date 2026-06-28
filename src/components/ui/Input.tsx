import { cn } from '@/lib/utils'
import { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, forwardRef } from 'react'

const base = 'w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-arabic text-sm text-gray-900 bg-white outline-none transition-all duration-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/10 placeholder:text-gray-400 disabled:opacity-50 disabled:bg-gray-50'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
  required?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hint, error, required, id, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-gray-800">
          {label} {required && <span className="text-orange-500">*</span>}
        </label>
      )}
      <input ref={ref} id={id} className={cn(base, error && 'border-red-400 focus:border-red-400', className)} {...props} />
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
)
Input.displayName = 'Input'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  hint?: string
}
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, hint, id, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={id} className="text-sm font-semibold text-gray-800">{label}</label>}
      <textarea ref={ref} id={id} className={cn(base, 'resize-y min-h-[80px]', className)} {...props} />
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  )
)
Textarea.displayName = 'Textarea'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  required?: boolean
}
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, required, id, children, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-gray-800">
          {label} {required && <span className="text-orange-500">*</span>}
        </label>
      )}
      <select ref={ref} id={id} className={cn(base, 'appearance-none cursor-pointer', className)} {...props}>
        {children}
      </select>
    </div>
  )
)
Select.displayName = 'Select'
