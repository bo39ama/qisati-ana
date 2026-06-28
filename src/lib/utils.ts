import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Language } from '@/types'

// ─── Class merger ─────────────────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Price formatter ──────────────────────────────────────────────────────────
export function formatPrice(amount: number, currency = 'SAR', lang: Language = 'ar'): string {
  const symbols: Record<string, string> = {
    SAR: lang === 'ar' ? 'ريال' : 'SAR',
    AED: lang === 'ar' ? 'درهم' : 'AED',
    KWD: lang === 'ar' ? 'دينار' : 'KWD',
    USD: '$',
  }
  const symbol = symbols[currency] || currency
  if (lang === 'ar') return `${amount} ${symbol}`
  return `${symbol}${amount}`
}

// ─── Date formatter ───────────────────────────────────────────────────────────
export function formatDate(date: string | Date, lang: Language = 'ar'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// ─── Order status labels ──────────────────────────────────────────────────────
export const ORDER_STATUS_LABELS: Record<string, { ar: string; en: string; color: string }> = {
  pending:    { ar: 'في الانتظار',      en: 'Pending',     color: 'orange' },
  generating: { ar: 'قيد الإنشاء',     en: 'Generating',  color: 'blue'   },
  qc_review:  { ar: 'مراجعة الجودة',   en: 'QC Review',   color: 'purple' },
  ready:      { ar: 'جاهز',            en: 'Ready',       color: 'green'  },
  shipped:    { ar: 'تم الشحن',         en: 'Shipped',     color: 'blue'   },
  delivered:  { ar: 'تم التوصيل',       en: 'Delivered',   color: 'green'  },
  refunded:   { ar: 'مسترجع',           en: 'Refunded',    color: 'red'    },
}

export const ILLUSTRATION_STYLE_LABELS: Record<string, { ar: string; en: string; emoji: string }> = {
  watercolor:   { ar: 'ألوان مائية',     en: 'Watercolor',     emoji: '🖌️' },
  '3d':         { ar: 'ثلاثي الأبعاد',  en: '3D Style',       emoji: '✨' },
  classic:      { ar: 'كلاسيكي',        en: 'Classic',         emoji: '📖' },
  soft_cartoon: { ar: 'كرتون ناعم',     en: 'Soft Cartoon',    emoji: '🌈' },
  fantasy:      { ar: 'فانتازيا',       en: 'Fantasy',         emoji: '🔮' },
  comic:        { ar: 'كوميك',          en: 'Comic',           emoji: '💥' },
}

export const PRODUCT_TYPE_LABELS: Record<string, { ar: string; en: string }> = {
  pdf:   { ar: 'PDF رقمي',          en: 'Digital PDF'    },
  print: { ar: 'كتاب مطبوع',       en: 'Printed Book'   },
  bundle:{ ar: 'PDF + مطبوع',      en: 'PDF + Print'    },
}

// ─── Upsell config ────────────────────────────────────────────────────────────
export const UPSELL_CONFIG = [
  { type: 'audio',         emoji: '🎙️', ar: 'رواية صوتية',     en: 'Audio Narration',  price: 15 },
  { type: 'video',         emoji: '🎬', ar: 'فيديو متحرك',     en: 'Animated Video',   price: 20 },
  { type: 'coloring_book', emoji: '🖍️', ar: 'كتاب تلوين',      en: 'Coloring Book',    price: 10 },
  { type: 'poster',        emoji: '🖼️', ar: 'ملصق شخصي A3',   en: 'Personalized Poster', price: 25 },
] as const

// ─── Slug generator ───────────────────────────────────────────────────────────
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/--+/g, '-')
    .trim()
}

// ─── Truncate ─────────────────────────────────────────────────────────────────
export function truncate(str: string, length: number): string {
  return str.length > length ? str.substring(0, length) + '...' : str
}
