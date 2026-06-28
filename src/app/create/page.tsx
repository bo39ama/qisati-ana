'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Button from '@/components/ui/Button'
import { Input, Textarea, Select } from '@/components/ui/Input'
import { useWizardStore } from '@/store/wizard'
import { UPSELL_CONFIG, ILLUSTRATION_STYLE_LABELS, formatPrice } from '@/lib/utils'
import type { IllustrationStyle } from '@/types'

const STORIES = [
  { slug:'birthday-hero', emoji:'🎂', title:'بطل عيد الميلاد', grad:'linear-gradient(160deg,#667EEA,#764BA2)', age:'٣–١٠ سنوات' },
  { slug:'world-cup-dream', emoji:'⚽', title:'حلم كأس العالم', grad:'linear-gradient(160deg,#F093FB,#F5576C)', age:'٤–١٢ سنة' },
  { slug:'space-explorer', emoji:'🚀', title:'رحلة إلى الفضاء', grad:'linear-gradient(160deg,#4FACF7,#00F2FE)', age:'٤–١٠ سنوات' },
  { slug:'ramadan-journey', emoji:'🕌', title:'رحلة رمضان', grad:'linear-gradient(160deg,#43E97B,#38F9D7)', age:'٤–١٢ سنة' },
  { slug:'brave-princess', emoji:'👸', title:'الأميرة الشجاعة', grad:'linear-gradient(160deg,#FA709A,#FEE140)', age:'٣–٩ سنوات' },
  { slug:'first-day-school', emoji:'🏫', title:'أول يوم في المدرسة', grad:'linear-gradient(160deg,#A18CD1,#FBC2EB)', age:'٣–٧ سنوات' },
  { slug:'ocean-kingdom', emoji:'🌊', title:'مملكة المحيط', grad:'linear-gradient(160deg,#FF9A9E,#FECFEF)', age:'٤–١٠ سنوات' },
  { slug:'future-doctor', emoji:'🩺', title:'طبيب المستقبل', grad:'linear-gradient(160deg,#A1C4FD,#C2E9FB)', age:'٣–٨ سنوات' },
  { slug:'eid-champion', emoji:'🌙', title:'بطل العيد', grad:'linear-gradient(160deg,#FDDB92,#D1FDFF)', age:'٣–١٠ سنوات' },
]

const PERSONALITIES = ['مغامر 🦁','شجاع 💪','فضولي 🔍','مبدع 🎨','لطيف ❤️','ذكي 🧠','مرح 😄','هادئ 🌸','قائد 👑']

const STEP_LABELS = ['القصة', 'الأسلوب', 'طفلك', 'معاينة', 'الدفع']

export default function CreatePage() {
  const router = useRouter()
  const store = useWizardStore()
  const [loading, setLoading] = useState(false)
  const [selectedStorySlug, setSelectedStorySlug] = useState<string | null>(null)

  const step = store.step
  const total = store.getTotal()

  const selectedStory = STORIES.find(s => s.slug === selectedStorySlug)

  function selectStory(slug: string) {
    setSelectedStorySlug(slug)
    store.setSelectedStory({ id: slug, slug, title_ar: STORIES.find(s=>s.slug===slug)?.title || '', price_sar: 29 } as any)
    store.setStep(1) // stay, just enable next
  }

  async function handleCheckout() {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          total: store.getTotal(),
          currency: 'SAR',
          email: 'guest@example.com', // collect from form
          items: [{ name: selectedStory?.title || 'قصة' }],
          order_meta: {
            story_id: selectedStorySlug,
            product_type: store.productType,
            illustration_style: store.illustrationStyle,
            language: store.language,
            child_info: store.childInfo,
            upsells: store.upsells,
          }
        })
      })
      const data = await res.json()
      if (data.checkout_url) window.location.href = data.checkout_url
    } catch {
      alert('حدث خطأ، يرجى المحاولة مرة أخرى')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-16">
        {/* Progress */}
        <div className="bg-white border-b border-gray-100 px-5 py-3 sticky top-16 z-40">
          <div className="max-w-3xl mx-auto flex items-center gap-2">
            {STEP_LABELS.map((label, i) => (
              <div key={i} className="flex items-center gap-1 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${step === i ? 'bg-sky-400 text-white ring-4 ring-sky-100' : step > i ? 'bg-emerald-400 text-white' : 'bg-gray-100 text-gray-400'}`}>
                  {step > i ? '✓' : i + 1}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${step === i ? 'text-sky-500' : 'text-gray-400'}`}>{label}</span>
                {i < 4 && <div className={`flex-1 h-0.5 mx-1 ${step > i ? 'bg-emerald-300' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-5 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main */}
          <div className="md:col-span-2">
            {/* STEP 0: Choose Story */}
            {step === 0 && (
              <div className="bg-white rounded-3xl p-6 shadow-sm">
                <div className="text-3xl mb-2">📚</div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">اختر قصة طفلك</h2>
                <p className="text-gray-400 text-sm mb-6">كل قصة مكتوبة بالعربية وتتضمن اسم طفلك وشخصيته</p>
                <div className="grid grid-cols-3 gap-3">
                  {STORIES.map(s => (
                    <div key={s.slug} onClick={() => selectStory(s.slug)}
                      className={`rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${selectedStorySlug === s.slug ? 'border-sky-400 ring-2 ring-sky-100' : 'border-transparent hover:border-sky-200'}`}>
                      <div className="h-24 flex items-center justify-center text-3xl relative" style={{background:s.grad}}>
                        {s.slug === selectedStorySlug && <div className="absolute top-1.5 left-1.5 w-5 h-5 bg-sky-400 rounded-full flex items-center justify-center text-white text-xs">✓</div>}
                        {s.emoji}
                      </div>
                      <div className="p-2.5 bg-white">
                        <div className="text-xs font-bold text-gray-900">{s.title}</div>
                        <div className="text-xs text-gray-400">{s.age}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-6">
                  <Button onClick={() => store.setStep(1)} disabled={!selectedStorySlug}>التالي — اختر الأسلوب ←</Button>
                </div>
              </div>
            )}

            {/* STEP 1: Illustration Style */}
            {step === 1 && (
              <div className="bg-white rounded-3xl p-6 shadow-sm">
                <div className="text-3xl mb-2">🎨</div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">اختر أسلوب الرسوم</h2>
                <p className="text-gray-400 text-sm mb-6">كل أسلوب يعطي القصة طابعاً مختلفاً</p>
                <div className="grid grid-cols-3 gap-3">
                  {(Object.entries(ILLUSTRATION_STYLE_LABELS) as [IllustrationStyle, any][]).map(([key, val]) => (
                    <button key={key} onClick={() => store.setIllustrationStyle(key)}
                      className={`p-4 rounded-2xl border-2 text-center transition-all ${store.illustrationStyle === key ? 'border-sky-400 bg-sky-50' : 'border-gray-200 bg-white hover:border-sky-200'}`}>
                      <div className="text-2xl mb-1">{val.emoji}</div>
                      <div className="text-sm font-bold text-gray-900">{val.ar}</div>
                    </button>
                  ))}
                </div>
                <div className="flex justify-between mt-6">
                  <Button variant="secondary" onClick={() => store.setStep(0)}>← السابق</Button>
                  <Button onClick={() => store.setStep(2)}>التالي — بيانات طفلك ←</Button>
                </div>
              </div>
            )}

            {/* STEP 2: Child Info */}
            {step === 2 && (
              <div className="bg-white rounded-3xl p-6 shadow-sm">
                <div className="text-3xl mb-2">👶</div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">بيانات طفلك</h2>
                <p className="text-gray-400 text-sm mb-6">كلما أضفت تفاصيل أكثر، كانت القصة أجمل</p>

                {/* Gender */}
                <div className="mb-5">
                  <label className="text-sm font-semibold text-gray-800 block mb-2">جنس الطفل <span className="text-orange-500">*</span></label>
                  <div className="grid grid-cols-2 gap-3">
                    {[{v:'male',l:'ولد',e:'👦'},{v:'female',l:'بنت',e:'👧'}].map(g=>(
                      <button key={g.v} onClick={()=>store.updateChildInfo('gender', g.v as any)}
                        className={`p-3 rounded-xl border-2 text-center transition-all ${store.childInfo.gender===g.v?'border-sky-400 bg-sky-50':'border-gray-200 hover:border-sky-200'}`}>
                        <div className="text-xl mb-1">{g.e}</div>
                        <div className="text-sm font-bold">{g.l}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Input label="اسم الطفل" required placeholder="سارة، محمد، ليلى..."
                    value={store.childInfo.name || ''}
                    onChange={e=>store.updateChildInfo('name', e.target.value)} />
                  <Select label="العمر" required value={store.childInfo.age || ''}
                    onChange={e=>store.updateChildInfo('age', Number(e.target.value))}>
                    <option value="">اختر</option>
                    {[3,4,5,6,7,8,9,10,11,12].map(a=><option key={a} value={a}>{a} سنوات</option>)}
                  </Select>
                </div>

                <div className="mb-4">
                  <label className="text-sm font-semibold text-gray-800 block mb-2">الشخصية <span className="text-orange-500">*</span></label>
                  <div className="flex flex-wrap gap-2">
                    {PERSONALITIES.map(p=>(
                      <button key={p} onClick={()=>{
                        const cur = store.childInfo.personality || []
                        store.updateChildInfo('personality', cur.includes(p) ? cur.filter(x=>x!==p) : [...cur,p])
                      }}
                        className={`px-3 py-1.5 rounded-full border-2 text-xs font-semibold transition-all ${(store.childInfo.personality||[]).includes(p)?'bg-sky-400 border-sky-400 text-white':'border-gray-200 text-gray-600 hover:border-sky-200'}`}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Input label="الحيوان المفضل" placeholder="أسد، دلفين..."
                    value={store.childInfo.favorite_animal || ''}
                    onChange={e=>store.updateChildInfo('favorite_animal',e.target.value)} />
                  <Input label="حلمه المستقبلي" placeholder="طيار، طبيبة..."
                    value={store.childInfo.dream_job || ''}
                    onChange={e=>store.updateChildInfo('dream_job',e.target.value)} />
                </div>

                <Textarea label="رسالة إهداء" placeholder="اكتب رسالة من القلب لطفلك..."
                  value={store.childInfo.dedication_message || ''}
                  onChange={e=>store.updateChildInfo('dedication_message',e.target.value)}
                  hint='مثال: "إلى أميرتي سارة — أنت بطلة قصتي الحقيقية."' />

                {/* Product type */}
                <div className="mt-5">
                  <label className="text-sm font-semibold text-gray-800 block mb-2">نوع المنتج <span className="text-orange-500">*</span></label>
                  <div className="grid grid-cols-2 gap-3">
                    {[{v:'pdf',e:'📄',l:'PDF رقمي',p:'٢٩ ريال — فوري'},{v:'print',e:'📚',l:'كتاب مطبوع',p:'٦٩ ريال — ٥–٧ أيام'}].map(p=>(
                      <button key={p.v} onClick={()=>store.setProductType(p.v as any)}
                        className={`p-4 rounded-xl border-2 text-right flex items-center gap-3 transition-all ${store.productType===p.v?'border-sky-400 bg-sky-50':'border-gray-200 hover:border-sky-200'}`}>
                        <span className="text-2xl">{p.e}</span>
                        <div><div className="text-sm font-bold text-gray-900">{p.l}</div><div className="text-xs text-sky-500 font-semibold">{p.p}</div></div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <Button variant="secondary" onClick={() => store.setStep(1)}>← السابق</Button>
                  <Button onClick={() => store.setStep(3)} disabled={!store.childInfo.name || !store.childInfo.age}>معاينة القصة ←</Button>
                </div>
              </div>
            )}

            {/* STEP 3: Preview */}
            {step === 3 && (
              <div className="bg-white rounded-3xl p-6 shadow-sm">
                <div className="text-3xl mb-2">👀</div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">معاينة قصتك</h2>
                <p className="text-gray-400 text-sm mb-6">إليك نظرة على أول صفحات قصة <strong>{store.childInfo.name}</strong></p>

                {/* Book preview */}
                <div className="rounded-2xl p-6 text-center text-white mb-5" style={{background: selectedStory?.grad || 'linear-gradient(160deg,#667EEA,#764BA2)'}}>
                  <div className="text-5xl mb-2">{selectedStory?.emoji}</div>
                  <div className="font-bold text-lg">{selectedStory?.title}</div>
                  <div className="opacity-70 text-sm mt-1">قصة خاصة لـ {store.childInfo.name} • {store.childInfo.age} سنوات</div>
                  <div className="grid grid-cols-3 gap-3 mt-5">
                    {[['صفحة ١','🌟'],['صفحة ٢','🎈'],['صفحة ٣','🔒']].map(([p,e],i)=>(
                      <div key={i} className="bg-white rounded-xl p-3 relative" style={{opacity:i===2?0.5:1}}>
                        {i===2&&<div className="absolute inset-0 flex items-center justify-center text-xs text-gray-500 font-medium">بعد الشراء</div>}
                        <div className="text-xs text-gray-400 mb-1">{p}</div>
                        {[100,80,90].map((w,j)=><div key={j} className="h-1.5 bg-gray-100 rounded-full mb-1" style={{width:`${w}%`}}/>)}
                        <div className="text-lg mt-1">{e}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upsells */}
                <h3 className="font-bold text-gray-900 text-sm mb-3">أضف مميزات إضافية ✨</h3>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {UPSELL_CONFIG.map(u=>{
                    const active = store.upsells.find(x=>x.type===u.type)
                    return (
                      <button key={u.type} onClick={()=>store.toggleUpsell({type:u.type,price:u.price})}
                        className={`p-3 rounded-xl border-2 flex items-center gap-3 text-right transition-all ${active?'border-sky-400 bg-sky-50':'border-gray-200 hover:border-sky-200'}`}>
                        <span className="text-xl">{u.emoji}</span>
                        <div className="flex-1"><div className="text-sm font-bold text-gray-900">{u.ar}</div><div className="text-xs text-sky-500 font-semibold">+ {u.price} ريال</div></div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs text-white ${active?'bg-sky-400 border-sky-400':'border-gray-300'}`}>{active&&'✓'}</div>
                      </button>
                    )
                  })}
                </div>

                <div className="flex justify-between">
                  <Button variant="secondary" onClick={() => store.setStep(2)}>← تعديل</Button>
                  <Button onClick={() => store.setStep(4)}>التالي — الدفع ←</Button>
                </div>
              </div>
            )}

            {/* STEP 4: Checkout */}
            {step === 4 && (
              <div className="bg-white rounded-3xl p-6 shadow-sm">
                <div className="text-3xl mb-2">💳</div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">إتمام الطلب</h2>
                <p className="text-gray-400 text-sm mb-6">خطوة أخيرة — ادفع بأمان واستلم قصتك فوراً</p>

                {/* Payment methods */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[['📱','Apple Pay'],['🇸🇦','مدى'],['💳','Visa / MC']].map(([e,l])=>(
                    <div key={l} className="border-2 border-gray-200 rounded-xl p-3 text-center cursor-pointer hover:border-sky-300 transition-all first:border-sky-400 first:bg-sky-50">
                      <div className="text-xl mb-1">{e}</div>
                      <div className="text-xs font-semibold text-gray-700">{l}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 mb-5">
                  <Input label="البريد الإلكتروني" type="email" required placeholder="example@email.com" />
                  <Input label="الاسم الكامل" required placeholder="اسمك الكامل" />
                </div>

                {/* Summary */}
                <div className="bg-gray-50 rounded-2xl p-4 mb-5">
                  <div className="flex justify-between text-sm text-gray-500 mb-1"><span>القصة</span><span>{formatPrice(store.productType==='print'?69:29,'SAR')}</span></div>
                  {store.upsells.map(u=><div key={u.type} className="flex justify-between text-sm text-gray-500 mb-1"><span>{u.type}</span><span>+{u.price} ريال</span></div>)}
                  <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-200 mt-2"><span>الإجمالي</span><span className="text-sky-500 text-lg">{formatPrice(total,'SAR')}</span></div>
                </div>

                <div className="flex flex-wrap gap-2 mb-5">
                  {['🔒 دفع مشفر','⚡ تسليم فوري','💝 ضمان الرضا','🗑️ صورك تُحذف'].map(t=>(
                    <span key={t} className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full">{t}</span>
                  ))}
                </div>

                <Button fullWidth size="lg" variant="mint" loading={loading} onClick={handleCheckout}>
                  🎉 ادفع الآن وابدأ المغامرة!
                </Button>

                <div className="mt-4">
                  <Button variant="secondary" onClick={() => store.setStep(3)}>← مراجعة الطلب</Button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="hidden md:block">
            <div className="bg-white rounded-3xl p-5 shadow-sm sticky top-32">
              <h3 className="font-bold text-gray-900 text-sm mb-4">📋 ملخص طلبك</h3>
              {selectedStory ? (
                <div className="border-2 border-sky-100 rounded-2xl overflow-hidden mb-4">
                  <div className="h-16 flex items-center justify-center text-3xl" style={{background:selectedStory.grad}}>{selectedStory.emoji}</div>
                  <div className="p-3">
                    <div className="text-sm font-bold text-gray-900">{selectedStory.title}</div>
                    <div className="text-xs text-sky-500 font-semibold mt-0.5">٢٩ ريال</div>
                  </div>
                </div>
              ) : (
                <div className="h-24 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 text-sm mb-4">لم تختر قصة بعد</div>
              )}
              <div className="space-y-1.5 text-xs text-gray-500 mb-4">
                <div>🎨 الأسلوب: <strong>{ILLUSTRATION_STYLE_LABELS[store.illustrationStyle]?.ar}</strong></div>
                {store.childInfo.name && <div>👶 الطفل: <strong>{store.childInfo.name} {store.childInfo.age && `(${store.childInfo.age} سنوات)`}</strong></div>}
                <div>📦 النوع: <strong>{store.productType === 'print' ? 'كتاب مطبوع' : 'PDF رقمي'}</strong></div>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-400">المجموع</span>
                <span className="font-black text-sky-500">{total > 0 ? formatPrice(total,'SAR') : '—'}</span>
              </div>
              <div className="bg-emerald-50 text-emerald-700 text-xs p-3 rounded-xl mt-3 space-y-1 leading-relaxed">
                <div>✅ ضمان الرضا الكامل</div>
                <div>⚡ PDF جاهز في ٣ دقائق</div>
                <div>🔒 دفعك آمن ومشفر</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
