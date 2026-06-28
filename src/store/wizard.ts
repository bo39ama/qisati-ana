import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Story, ChildInfo, IllustrationStyle, ProductType, Language, Upsell } from '@/types'

interface WizardStore {
  // Step
  step: number
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void

  // Story selection
  selectedStory: Story | null
  setSelectedStory: (story: Story) => void

  // Style
  illustrationStyle: IllustrationStyle
  setIllustrationStyle: (style: IllustrationStyle) => void

  // Child info
  childInfo: Partial<ChildInfo>
  setChildInfo: (info: Partial<ChildInfo>) => void
  updateChildInfo: (key: keyof ChildInfo, value: any) => void

  // Product
  productType: ProductType
  setProductType: (type: ProductType) => void

  // Language
  language: Language
  setLanguage: (lang: Language) => void

  // Upsells
  upsells: Upsell[]
  toggleUpsell: (upsell: Upsell) => void

  // Coupon
  couponCode: string
  couponDiscount: number
  setCoupon: (code: string, discount: number) => void

  // Computed
  getTotal: () => number
  getBasePrice: () => number

  // Reset
  reset: () => void
}

const initialState = {
  step: 1,
  selectedStory: null,
  illustrationStyle: 'watercolor' as IllustrationStyle,
  childInfo: {},
  productType: 'pdf' as ProductType,
  language: 'ar' as Language,
  upsells: [],
  couponCode: '',
  couponDiscount: 0,
}

export const useWizardStore = create<WizardStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setStep: (step) => set({ step }),
      nextStep: () => set((s) => ({ step: Math.min(s.step + 1, 5) })),
      prevStep: () => set((s) => ({ step: Math.max(s.step - 1, 1) })),

      setSelectedStory: (story) => set({ selectedStory: story }),

      setIllustrationStyle: (illustrationStyle) => set({ illustrationStyle }),

      setChildInfo: (info) => set({ childInfo: info }),
      updateChildInfo: (key, value) =>
        set((s) => ({ childInfo: { ...s.childInfo, [key]: value } })),

      setProductType: (productType) => set({ productType }),

      setLanguage: (language) => set({ language }),

      toggleUpsell: (upsell) =>
        set((s) => {
          const exists = s.upsells.find((u) => u.type === upsell.type)
          return {
            upsells: exists
              ? s.upsells.filter((u) => u.type !== upsell.type)
              : [...s.upsells, upsell],
          }
        }),

      setCoupon: (couponCode, couponDiscount) => set({ couponCode, couponDiscount }),

      getBasePrice: () => {
        const { selectedStory, productType } = get()
        if (!selectedStory) return 0
        const base = selectedStory.price_sar
        return productType === 'print' ? base + 40 : base
      },

      getTotal: () => {
        const { upsells, couponDiscount } = get()
        const base = get().getBasePrice()
        const upsellTotal = upsells.reduce((sum, u) => sum + u.price, 0)
        return Math.max(0, base + upsellTotal - couponDiscount)
      },

      reset: () => set(initialState),
    }),
    {
      name: 'qisati-wizard',
      partialize: (state) => ({
        selectedStory: state.selectedStory,
        illustrationStyle: state.illustrationStyle,
        childInfo: state.childInfo,
        productType: state.productType,
        language: state.language,
      }),
    }
  )
)
