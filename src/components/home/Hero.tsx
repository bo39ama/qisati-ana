'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function Hero() {
  const [count, setCount] = useState(12)
  const nums = [9, 11, 12, 14, 10, 13, 15, 11]
  let ni = 0

  useEffect(() => {
    const t = setInterval(() => {
      ni = (ni + 1) % nums.length
      setCount(nums[ni])
    }, 4000)
    return () => clearInterval(t)
  }, [])

  return (
    <section className="min-h-screen bg-gradient-to-br from-amber-50 via-sky-50 to-purple-50 flex items-center pt-20 pb-16 relative overflow-hidden">
      {/* BG shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-96 h-96 rounded-full bg-sky-400/15 -top-24 -right-20 animate-float" />
        <div className="absolute w-64 h-64 rounded-full bg-pink-400/15 bottom-16 right-10 animate-float" style={{animationDelay:'2s'}} />
        <div className="absolute w-48 h-48 rounded-full bg-yellow-400/15 top-1/3 left-16 animate-float" style={{animationDelay:'4s'}} />
        {/* Stars */}
        {['top-[22%] right-[18%]','top-[40%] left-[8%]','bottom-[28%] left-[22%]','top-[12%] left-[38%]'].map((pos, i) => (
          <span key={i} className={`absolute text-xl animate-sparkle ${pos}`} style={{animationDelay:`${i*0.8}s`}}>{'✨⭐🌟💫'[i]}</span>
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-5 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Text */}
          <div className="animate-fade-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white border border-sky-200 rounded-full px-4 py-2 text-xs font-bold text-sky-500 mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-dot" />
              أكثر من ١٢٬٠٠٠ قصة أُنشئت هذا الشهر
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-5">
              كل طفل يستحق<br />
              أن يكون{' '}
              <span className="bg-gradient-to-r from-sky-400 to-purple-500 bg-clip-text text-transparent">
                بطل قصته
              </span>{' '}
              <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                الخاصة
              </span>
            </h1>

            <p className="text-gray-500 text-lg leading-relaxed mb-8">
              حوّل اسم طفلك وشخصيته وأحلامه إلى قصة مصورة رائعة —<br className="hidden md:block" />
              مخصصة له وحده، تصلك في دقائق.
            </p>

            <div className="flex gap-3 flex-wrap mb-10">
              <Link href="/create">
                <Button size="lg">✨ ابدأ قصتك الآن</Button>
              </Link>
              <button className="inline-flex items-center gap-3 bg-white text-gray-800 px-6 py-4 rounded-full border-2 border-gray-200 font-bold hover:border-sky-400 transition-all">
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white text-xs">▶</span>
                شاهد كيف يعمل
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-6 items-center">
              {[['٥٠٬٠٠٠+', 'قصة مُسلَّمة'], ['٤.٩ ★', 'تقييم الآباء'], ['٣ دقائق', 'وقت الإنشاء']].map(([num, label], i) => (
                <div key={i} className={`text-center ${i > 0 ? 'border-r border-gray-200 pr-6' : ''}`}>
                  <div className="text-xl font-bold text-gray-900">{num}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="relative flex justify-center">
            <div className="relative w-80 h-80">
              {/* Main book card */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 bg-white rounded-3xl shadow-2xl overflow-hidden z-10">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-center text-white">
                  <div className="text-5xl mb-2">🚀</div>
                  <div className="font-bold">محمد وغزو الفضاء</div>
                  <div className="text-xs opacity-70 mt-1">قصة خاصة لـ محمد • ٧ سنوات</div>
                </div>
                <div className="p-4 space-y-2">
                  {[100, 85, 95, 70].map((w, i) => (
                    <div key={i} className="h-2 bg-gray-100 rounded-full" style={{width:`${w}%`}} />
                  ))}
                </div>
              </div>

              {/* Floating cards */}
              <div className="absolute top-2 -right-4 bg-white rounded-2xl p-3 shadow-lg z-20 animate-float">
                <div className="text-xl">🎉</div>
                <div className="text-xs font-bold text-gray-800 mt-1">جاهزة في ٣ دقائق</div>
                <div className="text-xs text-gray-400">تسليم فوري</div>
              </div>

              <div className="absolute bottom-8 -left-6 bg-white rounded-2xl p-3 shadow-lg z-20 animate-float" style={{animationDelay:'2s'}}>
                <div className="text-xl">💖</div>
                <div className="text-xs font-bold text-gray-800 mt-1">أم سارة:</div>
                <div className="text-xs text-gray-400">طفلتي بكت من الفرح!</div>
              </div>

              <div className="absolute top-[45%] -left-10 bg-white rounded-2xl p-3 shadow-lg z-20 animate-float" style={{animationDelay:'1s'}}>
                <div className="text-xl">🌍</div>
                <div className="text-xs font-bold text-gray-800 mt-1">+١٢ دولة عربية</div>
                <div className="text-xs text-gray-400">توصيل مطبوع</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live counter */}
      <div className="fixed bottom-6 left-6 z-50 bg-white rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3 animate-slide-up hidden md:flex">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse-dot" />
        <span className="text-xs text-gray-700"><strong className="text-sky-500">{count}</strong> عائلة تُنشئ قصة الآن 🎉</span>
      </div>
    </section>
  )
}
