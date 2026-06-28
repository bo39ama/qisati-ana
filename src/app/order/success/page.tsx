'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'

export default function OrderSuccessPage() {
  const [progress, setProgress] = useState(0)
  const [label, setLabel] = useState('يبدأ الإنشاء...')

  useEffect(() => {
    const steps = [
      { p: 15, l: 'يكتب الذكاء الاصطناعي قصتك...' },
      { p: 40, l: 'يُنشئ الرسوم والمشاهد...' },
      { p: 65, l: 'يُضيف اسم طفلك للقصة...' },
      { p: 85, l: 'يُجمّع صفحات القصة...' },
      { p: 100, l: '✅ قصتك جاهزة! تحقق من بريدك الإلكتروني' },
    ]
    let i = 0
    const run = () => {
      if (i < steps.length) {
        setProgress(steps[i].p)
        setLabel(steps[i].l)
        i++
        setTimeout(run, 1300)
      }
    }
    setTimeout(run, 600)
  }, [])

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-sky-50 flex items-center justify-center pt-16 px-5">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center">
          <div className="text-6xl mb-4 animate-bounce">🎉</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">قصتك في الطريق!</h1>
          <p className="text-gray-400 leading-relaxed mb-8">
            جاري إنشاء قصة طفلك الآن بالذكاء الاصطناعي.<br />
            ستصلك على بريدك خلال <strong className="text-gray-700">٣–٥ دقائق</strong> فقط 🚀
          </p>

          {/* Progress */}
          <div className="bg-emerald-50 rounded-2xl p-5 mb-8 text-right">
            <div className="text-xs text-emerald-700 font-semibold mb-2">⏳ التقدم الآن</div>
            <div className="h-2 bg-emerald-100 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-emerald-400 rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
            </div>
            <div className="text-xs text-emerald-600">{label}</div>
          </div>

          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/dashboard">
              <button className="bg-gradient-to-r from-sky-400 to-blue-500 text-white font-bold px-6 py-3 rounded-full shadow-lg hover:-translate-y-0.5 transition-all">
                📥 لوحة تحكمي
              </button>
            </Link>
            <button className="border-2 border-gray-200 text-gray-600 font-semibold px-5 py-3 rounded-full hover:border-sky-300 transition-all">
              📤 مشاركة
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
