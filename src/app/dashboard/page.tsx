'use client'
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import { StatusBadge } from '@/components/ui/Badge'

const NAV = [
  { id: 'overview', icon: '🏠', label: 'الرئيسية' },
  { id: 'orders',   icon: '📦', label: 'طلباتي', badge: '٢' },
  { id: 'stories',  icon: '📚', label: 'قصصي' },
  { id: 'profile',  icon: '👤', label: 'حسابي' },
  { id: 'refer',    icon: '🎁', label: 'أحضر صديقاً' },
]

const ORDERS = [
  { id:'#٠٠١٢٣', story:'بطل عيد الميلاد', emoji:'🎂', grad:'linear-gradient(135deg,#667EEA,#764BA2)', child:'سارة • ٦ سنوات', type:'PDF', amount:'٢٩ ريال', status:'ready', date:'اليوم', canDownload:true },
  { id:'#٠٠١٢٢', story:'رحلة إلى الفضاء', emoji:'🚀', grad:'linear-gradient(135deg,#4FACF7,#00F2FE)', child:'محمد • ٨ سنوات', type:'مطبوع', amount:'٦٩ ريال', status:'shipped', date:'منذ ٣ أيام', canDownload:false },
  { id:'#٠٠١٢١', story:'رحلة رمضان', emoji:'🕌', grad:'linear-gradient(135deg,#43E97B,#38F9D7)', child:'سارة • ٦ سنوات', type:'PDF + صوت', amount:'٤٤ ريال', status:'ready', date:'منذ أسبوع', canDownload:true },
  { id:'#٠٠١٢٠', story:'الأميرة الشجاعة', emoji:'👸', grad:'linear-gradient(135deg,#FA709A,#FEE140)', child:'سارة • ٦ سنوات', type:'PDF', amount:'٢٩ ريال', status:'delivered', date:'منذ شهر', canDownload:true },
]

function toast(msg: string) {
  const t = document.createElement('div')
  t.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm font-semibold px-5 py-3 rounded-full shadow-xl z-50 transition-all'
  t.textContent = msg
  document.body.appendChild(t)
  setTimeout(() => t.remove(), 3000)
}

export default function DashboardPage() {
  const [section, setSection] = useState('overview')

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-56 bg-gray-900 min-h-screen fixed top-16 right-0 bottom-0 z-30">
          <div className="p-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-purple-500 flex items-center justify-center text-lg">👩</div>
              <div>
                <div className="text-sm font-bold text-white">أم سارة</div>
                <div className="text-xs text-white/40">sara@gmail.com</div>
              </div>
            </div>
          </div>
          <nav className="p-3 flex-1">
            {NAV.map(n => (
              <button key={n.id} onClick={() => setSection(n.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-1 transition-all text-right ${section===n.id?'bg-sky-400/20 text-sky-400':'text-white/60 hover:text-white hover:bg-white/5'}`}>
                <span>{n.icon}</span>
                <span className="flex-1">{n.label}</span>
                {n.badge && <span className="bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full">{n.badge}</span>}
              </button>
            ))}
          </nav>
          <div className="p-4 border-t border-white/10">
            <a href="/" className="text-white/40 text-xs flex items-center gap-2 hover:text-white/60">← الموقع الرئيسي</a>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 md:mr-56">
          {/* Topbar */}
          <div className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between sticky top-16 z-20">
            <h1 className="font-bold text-gray-900">{NAV.find(n=>n.id===section)?.icon} {NAV.find(n=>n.id===section)?.label}</h1>
            <button onClick={()=>window.location.href='/create'} className="bg-gradient-to-r from-sky-400 to-blue-500 text-white text-sm font-bold px-4 py-2 rounded-full">✨ قصة جديدة</button>
          </div>

          <div className="p-6">
            {/* OVERVIEW */}
            {section === 'overview' && (
              <div>
                {/* Welcome banner */}
                <div className="bg-gray-900 rounded-3xl p-6 mb-6 flex items-center justify-between" style={{background:'linear-gradient(135deg,#1A1A2E,#16213E)'}}>
                  <div>
                    <h2 className="text-white text-xl font-bold mb-1">أهلاً أم سارة! 👋</h2>
                    <p className="text-white/60 text-sm mb-4">لديك طلب جاهز للتحميل</p>
                    <button onClick={()=>setSection('orders')} className="bg-gradient-to-r from-sky-400 to-blue-500 text-white text-sm font-bold px-5 py-2.5 rounded-full">📥 تحميل القصة</button>
                  </div>
                  <div className="text-5xl hidden sm:block">📚✨</div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[['📚','٥','قصص اشتريتها','bg-sky-50'],['⬇️','٣','جاهزة للتحميل','bg-emerald-50'],['🚚','١','قيد التوصيل','bg-orange-50'],['⭐','٤.٩','تقييمك','bg-purple-50']].map(([e,n,l,bg])=>(
                    <div key={l} className={`${bg} rounded-2xl p-4 flex items-center gap-3`}>
                      <div className="text-2xl">{e}</div>
                      <div><div className="text-2xl font-black text-gray-900">{n}</div><div className="text-xs text-gray-400">{l}</div></div>
                    </div>
                  ))}
                </div>

                {/* Recent */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900 text-sm">📦 آخر الطلبات</h3>
                    <button onClick={()=>setSection('orders')} className="text-sky-400 text-xs font-semibold">عرض الكل ←</button>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {ORDERS.slice(0,3).map(o=>(
                      <div key={o.id} className="flex items-center gap-4 p-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{background:o.grad}}>{o.emoji}</div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 text-sm">{o.story}</div>
                          <div className="text-xs text-gray-400">لـ {o.child}</div>
                        </div>
                        <StatusBadge status={o.status} />
                        {o.canDownload && (
                          <button onClick={()=>toast('جاري التحميل... ⬇️')} className="bg-sky-50 text-sky-500 text-xs font-bold px-3 py-1.5 rounded-full hover:bg-sky-500 hover:text-white transition-colors">⬇️</button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ORDERS */}
            {section === 'orders' && (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">جميع الطلبات ({ORDERS.length})</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 text-xs text-gray-400 font-bold">
                      <tr>
                        {['رقم الطلب','القصة','النوع','المبلغ','الحالة','التاريخ','الإجراء'].map(h=>(
                          <th key={h} className="px-4 py-3 text-right">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {ORDERS.map(o=>(
                        <tr key={o.id} className="hover:bg-gray-50/50">
                          <td className="px-4 py-4 text-xs text-gray-400 font-mono">{o.id}</td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0" style={{background:o.grad}}>{o.emoji}</div>
                              <div><div className="text-sm font-semibold text-gray-900">{o.story}</div><div className="text-xs text-gray-400">{o.child}</div></div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500">{o.type}</td>
                          <td className="px-4 py-4 text-sm font-bold text-sky-500">{o.amount}</td>
                          <td className="px-4 py-4"><StatusBadge status={o.status} /></td>
                          <td className="px-4 py-4 text-xs text-gray-400">{o.date}</td>
                          <td className="px-4 py-4">
                            <div className="flex gap-1">
                              {o.canDownload && <button onClick={()=>toast('جاري التحميل ⬇️')} className="text-xs bg-sky-400 text-white px-3 py-1.5 rounded-full font-bold hover:bg-blue-500 transition-colors">⬇️ تحميل</button>}
                              {o.status==='shipped' && <button onClick={()=>toast('رقم التتبع: SA1234567890')} className="text-xs border border-gray-200 text-gray-500 px-3 py-1.5 rounded-full hover:border-sky-300">🔍</button>}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* STORIES */}
            {section === 'stories' && (
              <div className="bg-white rounded-2xl shadow-sm p-5">
                <div className="flex items-center justify-between mb-5 border-b pb-4">
                  <h3 className="font-bold text-gray-900">قصصي (٤ قصص)</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {ORDERS.filter(o=>o.canDownload).map(o=>(
                    <div key={o.id} className="border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-sky-200 hover:-translate-y-1 transition-all">
                      <div className="h-28 flex items-center justify-center text-4xl" style={{background:o.grad}}>{o.emoji}</div>
                      <div className="p-4">
                        <div className="font-bold text-gray-900 text-sm mb-1">{o.story}</div>
                        <div className="text-xs text-gray-400 mb-3">لـ {o.child} • {o.date}</div>
                        <div className="flex gap-2">
                          <button onClick={()=>toast('جاري التحميل ⬇️')} className="flex-1 bg-sky-50 text-sky-500 text-xs font-bold py-2 rounded-lg hover:bg-sky-500 hover:text-white transition-colors">⬇️ تحميل</button>
                          <button onClick={()=>toast('تم نسخ رابط المشاركة!')} className="flex-1 border border-gray-200 text-gray-500 text-xs font-bold py-2 rounded-lg hover:border-sky-300">📤 شارك</button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Add new */}
                  <a href="/create" className="no-underline border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-8 min-h-[180px] hover:border-sky-300 hover:bg-sky-50/30 transition-all group">
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">✨</div>
                    <div className="text-sm font-semibold text-gray-400 group-hover:text-sky-500">قصة جديدة</div>
                  </a>
                </div>
              </div>
            )}

            {/* PROFILE */}
            {section === 'profile' && (
              <div className="space-y-5">
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="font-bold text-gray-900 mb-5 pb-3 border-b">معلومات حسابي</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[['الاسم الكامل','نورة أحمد','text'],['البريد الإلكتروني','sara.mom@gmail.com','email'],['رقم الجوال','+966 55 123 4567','tel'],['الدولة','','select']].map(([l,v,t])=>(
                      <div key={l} className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-gray-800">{l}</label>
                        {t==='select'?(
                          <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-sky-400">
                            <option>المملكة العربية السعودية 🇸🇦</option>
                            <option>الإمارات 🇦🇪</option>
                            <option>الكويت 🇰🇼</option>
                          </select>
                        ):(
                          <input type={t} defaultValue={v} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-sky-400" />
                        )}
                      </div>
                    ))}
                  </div>
                  <button onClick={()=>toast('تم حفظ التغييرات ✅')} className="mt-5 bg-gradient-to-r from-sky-400 to-blue-500 text-white font-bold px-6 py-2.5 rounded-full">حفظ التغييرات</button>
                </div>
              </div>
            )}

            {/* REFER */}
            {section === 'refer' && (
              <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">احضري صديقة وكسبي قصة مجانية</h3>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">شاركي رابطك مع الأصدقاء. عندما يشتري أي شخص قصته الأولى، تحصلين على قصة مجانية!</p>
                <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3 max-w-sm mx-auto mb-5">
                  <span className="flex-1 text-sm font-semibold text-gray-700 ltr text-right">qisatiana.com/ref/NOURA2026</span>
                  <button onClick={()=>toast('تم نسخ رابطك! 🔗')} className="bg-sky-400 text-white text-sm font-bold px-4 py-2 rounded-lg">نسخ</button>
                </div>
                <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
                  {[['٣','أصدقاء دعوتهم','bg-sky-50 text-sky-600'],['١','اشترى منهم','bg-emerald-50 text-emerald-600'],['١','قصة مكسوبة','bg-orange-50 text-orange-600']].map(([n,l,c])=>(
                    <div key={l} className={`${c} rounded-2xl p-4`}>
                      <div className="text-2xl font-black">{n}</div>
                      <div className="text-xs mt-1">{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
