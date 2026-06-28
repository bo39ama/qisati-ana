// ─── Database Types ──────────────────────────────────────────────────────────

export type Language = 'ar' | 'en'
export type Gender = 'male' | 'female'
export type ProductType = 'pdf' | 'print' | 'bundle'
export type OrderStatus = 'pending' | 'generating' | 'qc_review' | 'ready' | 'shipped' | 'delivered' | 'refunded'
export type IllustrationStyle = 'watercolor' | '3d' | 'classic' | 'soft_cartoon' | 'fantasy' | 'comic'
export type StoryCategory = 'celebrations' | 'islamic' | 'adventure' | 'sports' | 'educational' | 'character' | 'fantasy' | 'custom'
export type UserRole = 'customer' | 'admin' | 'operations' | 'content' | 'finance'

// ─── Story ───────────────────────────────────────────────────────────────────

export interface Story {
  id: string
  slug: string
  title_ar: string
  title_en: string
  description_ar: string
  description_en: string
  category: StoryCategory
  emoji: string
  cover_gradient: string
  age_min: number
  age_max: number
  page_count: number
  price_sar: number
  price_aed: number
  price_kwd: number
  price_usd: number
  available_styles: IllustrationStyle[]
  is_active: boolean
  is_featured: boolean
  order_count: number
  rating_avg: number
  rating_count: number
  text_prompt_ar?: string
  text_prompt_en?: string
  created_at: string
}

// ─── Child Info ───────────────────────────────────────────────────────────────

export interface ChildInfo {
  name: string
  age: number
  gender: Gender
  personality: string[]
  favorite_animal?: string
  favorite_color?: string
  favorite_hobby?: string
  dream_job?: string
  dedication_message?: string
  photo_url?: string
}

// ─── Order ───────────────────────────────────────────────────────────────────

export interface Order {
  id: string
  order_number: string
  user_id: string
  story_id: string
  story?: Story
  product_type: ProductType
  illustration_style: IllustrationStyle
  language: Language
  child_info: ChildInfo
  upsells: Upsell[]
  subtotal: number
  discount: number
  total: number
  currency: string
  coupon_code?: string
  status: OrderStatus
  pdf_url?: string
  audio_url?: string
  video_url?: string
  tracking_number?: string
  shipping_address?: ShippingAddress
  notes?: string
  created_at: string
  updated_at: string
}

export interface Upsell {
  type: 'audio' | 'video' | 'coloring_book' | 'poster' | 'extra_copy'
  price: number
  status?: 'pending' | 'ready'
  url?: string
}

export interface ShippingAddress {
  full_name: string
  phone: string
  address_line_1: string
  city: string
  country: string
  postal_code?: string
}

// ─── User ────────────────────────────────────────────────────────────────────

export interface User {
  id: string
  email: string
  full_name?: string
  phone?: string
  country?: string
  language: Language
  role: UserRole
  total_orders: number
  total_spent: number
  referral_code: string
  referral_count: number
  created_at: string
}

// ─── Review ──────────────────────────────────────────────────────────────────

export interface Review {
  id: string
  order_id: string
  user_id: string
  story_id: string
  rating: number
  text: string
  child_name?: string
  child_age?: number
  country?: string
  is_approved: boolean
  created_at: string
}

// ─── Coupon ──────────────────────────────────────────────────────────────────

export interface Coupon {
  id: string
  code: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  min_order_value?: number
  usage_limit?: number
  used_count: number
  expires_at?: string
  is_active: boolean
}

// ─── Wizard State ─────────────────────────────────────────────────────────────

export interface WizardState {
  step: number
  story: Story | null
  style: IllustrationStyle
  childInfo: Partial<ChildInfo>
  productType: ProductType
  upsells: Upsell[]
  language: Language
  couponCode: string
  couponDiscount: number
  total: number
}

// ─── Admin Analytics ──────────────────────────────────────────────────────────

export interface DailyRevenue {
  date: string
  revenue: number
  orders: number
}

export interface Analytics {
  revenue_today: number
  revenue_month: number
  orders_today: number
  orders_month: number
  conversion_rate: number
  refund_rate: number
  avg_order_value: number
  top_stories: { story_id: string; title: string; count: number; revenue: number }[]
  revenue_by_country: { country: string; revenue: number; percentage: number }[]
  daily_revenue: DailyRevenue[]
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface GenerationStatus {
  order_id: string
  status: 'queued' | 'writing' | 'illustrating' | 'assembling' | 'ready' | 'failed'
  progress: number
  current_step: string
  pdf_url?: string
}
