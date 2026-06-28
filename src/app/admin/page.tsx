'use client'
import { useState } from 'react'
import { StatusBadge } from '@/components/ui/Badge'

const NAV = [
  { id:'overview', icon:'📊', label:'نظرة عامة', section:'main' },
  { id:'orders', icon:'📦', label:'الطلبات', badge:'٧', section:'orders' },
  { id:'queue', icon:'🤖', label:'طابور الإنشاء', badge:'٣', badgeColor:'bg-emerald-500', section:'main' },
  { id:'stories', icon:'📚', label:'القصص', section:'content' },
  { id:'customers', icon:'👥', label:'العملاء', section:'customers' },
  { id:'analytics', icon:'📈', label:'التحليلات', section:'analytics' },
  { id:'coupons', icon:'🎟️', label:'الكوبونات', section:'marketing' },
  { id:'prompts', icon:'🧠', label:'برومبتات AI', section:'settings' },
  { id:'settings', icon:'⚙️', label:'الإعدادات', section:'settings' },
]

const ORDERS = [
  { id:'#٠٠١٢٣', story:'بطل عيد الميلاد', emoji:'🎂', grad:'linear-gradient(135deg,#667EEA,#764BA2)', child:'سارة، ٦ سنوات', customer:'أم سارة', type:'PDF', amount:'٢٩ ر', status:'ready', date:'اليوم' },
  { id:'#٠٠١٢٢', story:'حلم كأس العالم', emoji:'⚽', grad:'linear-gradient(135deg,#F093FB,#F5576C)', child:'محمد، ٩ سنوات', customer:'أبو فهد', type:'طباعة', amount:'٦٩ ر', status:'generating', date:'اليوم' },
  { id:'#٠٠١٢١', story:'رحلة رمضان', emoji:'🕌', grad:'linear-gradient(135deg,#43E97B,#38F9D7)', child:'عمر، ٧ سنوات', customer:'أم عمر', type:'PDF+صوت', amount:'٤٤ ر', status:'qc_review', date:'أمس' },
  { id:'#٠٠١٢٠', story:'رحلة إلى الفضاء', emoji:'🚀', grad:'linear-gradient(135deg,#4FACF7,#00F2FE)', child:'لارا، ٨ سنوات', customer:'أبو لارا', type:'طباعة', amount:'٦٩ ر', status:'shipped', date:'منذ ٣ أيام' },
  { id:'#٠٠١١٩', story:'الأميرة الشجاعة', emoji:'👸', grad:'linear-gradient(135deg,#FA709A,#FEE140)', child:'ريم، ٥ سنوات', customer:'أم ريم', type:'PDF', amount:'٢٩ ر', status:'delivered', date:'منذ أسبوع' },
]

function showToast(msg: string) {
  const t = document.createElement('div')
  t.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm font-semibold px-5 py-3 rounded-full shadow-xl z-50'
  t.textContent = msg
  document.body.appendChild(t)
  setTimeout(() => t.remove(), 3000)
}

const BAR_DATA = [820, 1100, 940, 1380, 1050, 1620, 1240]
const BAR_DAYS = ['أح','اث','ث','أر','خ','ج','س']
const BAR_MAX = Math.max(...BAR_DATA)

export default function AdminPage() {
  const [section, setSection] = useState('overview')
  const [modal, setModal] = useState<any>(null)

  return (
    <div className="min-h-screen bg-gray-100 flex" dir="rtl">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-gray-950 min-h-screen fixed top-0 right-0 bottom-0 z-50">
        <div className="p-5 border-b border-white/10">
          <div className="text-lg font-bold text-white">✨ <span className="text-sky-400">قصتي</span> أنا</div>
          <div className="text-xs text-white/30 mt-0.5">لوحة الإدارة</div>
        </div>
        <nav className="p-3 flex-1 overflow-y-auto">
          {['main','orders','customers','analytics','content','marketing','settings'].map(sec => {
            const secNav = NAV.filter(n => n.section === sec)
            if (!secNav.length) return null
            return (
              <div key={sec} className="mb-3">
                {secNav.map(n => (
                  <button key={n.id} onClick={() => setSection(n.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium mb-0.5 transition-all text-right ${section===n.id?'bg-sky-400/15 text-sky-400 border-r-2 border-sky-400':'text-white/50 hover:text-white hover:bg-white/5'}`}>
                    <span className="text-base">{n.icon}</span>
                    <span className="flex-1">{n.label}</span>
                    {n.badge && <span className={`${(n as any).badgeColor || 'bg-orange-500'} text-white text-xs px-1.5 py-0.5 rounded-full leading-none`}>{n.badge}</span>}
                  </button>
                ))}
              </div>
            )
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-purple-500 flex items-center justify-center text-sm">👤</div>
            <div><div className="text-xs font-bold text-white">سوبر أدمن</div></div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 md:mr-56">
        {/* Topbar */}
        <div className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-40">
          <h1 className="font-bold text-gray-900 text-sm">{NAV.find(n=>n.id===section)?.icon} {NAV.find(n=>n.id===section)?.label || 'نظرة عامة'}</h1>
          <div className="flex items-center gap-3">
            <button className="relative text-lg">🔔<span className="absolute -top-0.5 -left-0.5 w-2 h-2 bg-red-500 rounded-full border border-white" /></button>
            <span className="text-xs text-gray-400">سوبر أدمن</span>
          </div>
        </div>

        <div className="p-6">
          {/* OVERVIEW */}
          {section === 'overview' && (
            <div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  ['💰','١٬٢٤٠ ر','الإيرادات اليوم','▲ ١٨٪','text-emerald-500'],
                  ['📦','٤٣','الطلبات اليوم','▲ ٢٢٪','text-emerald-500'],
                  ['📈','٣.٨٪','معدل التحويل','▲ ٠.٣٪','text-emerald-500'],
                  ['🤖','٣','قيد الإنشاء','⏳ جارية','text-orange-500'],
                ].map(([e,n,l,s,sc])=>(
                  <div key={l} className="bg-white rounded-2xl p-5 shadow-sm relative overflow-hidden">
                    <div className="text-2xl opacity-10 absolute left-3 top-3">{e}</div>
                    <div className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2">{l}</div>
                    <div className="text-2xl font-black text-gray-900">{n}</div>
                    <div className={`text-xs font-semibold mt-1 ${sc}`}>{s}</div>
                    <div className="h-1 bg-gray-100 rounded-full mt-3 overflow-hidden"><div className="h-full bg-sky-400 rounded-full" style={{width:'70%'}} /></div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                {/* Chart */}
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900 text-sm">📈 الإيرادات (٧ أيام)</h3>
                    <span className="text-xs text-gray-400">هذا الأسبوع</span>
                  </div>
                  <div className="flex items-end gap-2 h-24">
                    {BAR_DATA.map((v,i)=>(
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className={`w-full rounded-t-lg transition-all ${i===6?'bg-sky-400':'bg-gray-100'}`} style={{height:`${(v/BAR_MAX)*80}px`}} />
                        <span className="text-xs text-gray-400">{BAR_DAYS[i]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Queue */}
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900 text-sm">🤖 طابور الإنشاء</h3>
                    <span className="text-xs bg-sky-50 text-sky-500 font-bold px-2 py-0.5 rounded-full">٣ نشطة</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      {name:'حلم كأس العالم — محمد', sub:'يُنشئ الرسوم... صفحة ٨ من ٢٢', done:false},
                      {name:'الأميرة الشجاعة — لمياء', sub:'يكتب النص...', done:false},
                      {name:'رحلة رمضان — عمر', sub:'جاهز للمراجعة — كتاب مطبوع', done:true},
                    ].map((q,i)=>(
                      <div key={i} className="flex items-center gap-3">
                        {q.done
                          ? <div className="w-7 h-7 bg-emerald-400 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">✓</div>
                          : <div className="w-7 h-7 border-2 border-sky-300 border-t-sky-500 rounded-full animate-spin flex-shrink-0" />
                        }
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-gray-900">{q.name}</div>
                          <div className={`text-xs ${q.done?'text-emerald-500':'text-gray-400'}`}>{q.sub}</div>
                        </div>
                        {q.done && <button onClick={()=>showToast('تمت الموافقة ✅')} className="text-xs bg-emerald-50 text-emerald-600 font-bold px-2.5 py-1 rounded-lg hover:bg-emerald-500 hover:text-white transition-colors">✓ موافقة</button>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent orders */}
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                  <h3 className="font-bold text-gray-900 text-sm">📦 آخر الطلبات</h3>
                  <button onClick={()=>setSection('orders')} className="text-sky-400 text-xs font-semibold">عرض الكل ←</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-xs text-gray-400 font-bold">
                      <tr>{['رقم','القصة','العميل','النوع','المبلغ','الحالة','الإجراء'].map(h=><th key={h} className="px-4 py-2.5 text-right font-semibold">{h}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {ORDERS.slice(0,4).map(o=>(
                        <tr key={o.id} className="hover:bg-gray-50/50">
                          <td className="px-4 py-3 text-xs text-gray-400 font-mono">{o.id}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{background:o.grad}}>{o.emoji}</div>
                              <span className="font-medium text-gray-900 text-xs">{o.story}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-500">{o.customer}</td>
                          <td className="px-4 py-3 text-xs text-gray-500">{o.type}</td>
                          <td className="px-4 py-3 text-xs font-bold text-sky-500">{o.amount}</td>
                          <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              <button onClick={()=>setModal(o)} className="text-xs border border-gray-200 text-gray-500 px-2.5 py-1 rounded-lg hover:border-sky-300">👁</button>
                              {o.status==='qc_review'&&<button onClick={()=>showToast('تمت الموافقة ✅')} className="text-xs bg-emerald-50 text-emerald-600 font-bold px-2.5 py-1 rounded-lg hover:bg-emerald-500 hover:text-white">✓</button>}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ORDERS */}
          {section === 'orders' && (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-center gap-3 flex-wrap">
                  <input placeholder="ابحث..." className="border border-gray-200 rounded-xl px-4 py-2 text-sm flex-1 min-w-48 outline-none focus:border-sky-400" />
                  <select className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none">
                    <option>كل الحالات</option>
                    {['ready','generating','qc_review','shipped','delivered'].map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs text-gray-400 font-semibold">
                    <tr>{['رقم الطلب','القصة','الطفل','العميل','النوع','المبلغ','الحالة','التاريخ','الإجراءات'].map(h=><th key={h} className="px-4 py-2.5 text-right">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {ORDERS.map(o=>(
                      <tr key={o.id} className="hover:bg-gray-50/50">
                        <td className="px-4 py-3 text-xs text-gray-400 font-mono">{o.id}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{background:o.grad}}>{o.emoji}</div>
                            <span className="text-xs font-semibold text-gray-900">{o.story}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">{o.child}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">{o.customer}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">{o.type}</td>
                        <td className="px-4 py-3 text-xs font-bold text-sky-500">{o.amount}</td>
                        <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                        <td className="px-4 py-3 text-xs text-gray-400">{o.date}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button onClick={()=>setModal(o)} className="text-xs border border-gray-200 text-gray-500 px-2.5 py-1.5 rounded-lg hover:border-sky-300">👁 عرض</button>
                            {o.status==='qc_review'&&<button onClick={()=>showToast('تمت الموافقة ✅')} className="text-xs bg-emerald-50 text-emerald-600 font-bold px-2.5 py-1.5 rounded-lg hover:bg-emerald-500 hover:text-white">✓ موافقة</button>}
                            <button onClick={()=>showToast('تم إرسال إشعار 📧')} className="text-xs border border-gray-200 text-gray-500 px-2 py-1.5 rounded-lg hover:border-sky-300">📧</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ANALYTICS */}
          {section === 'analytics' && (
            <div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[['💰','٣١٬٤٨٠ ر','إيرادات الشهر','▲ ٣٤٪'],['📦','١٬٠٨٦','طلبات الشهر','▲ ٢٨٪'],['↩️','١.٢٪','معدل الاسترداد','▼ ٠.٤٪'],['🛒','٢٩ ر','متوسط قيمة الطلب','▲ ١٢٪']].map(([e,n,l,s])=>(
                  <div key={l} className="bg-white rounded-2xl p-5 shadow-sm">
                    <div className="text-xs text-gray-400 mb-2">{l}</div>
                    <div className="text-2xl font-black text-gray-900">{n}</div>
                    <div className="text-xs text-emerald-500 font-semibold mt-1">{s}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <h3 className="font-bold text-gray-900 text-sm mb-4">🏆 أكثر القصص مبيعاً</h3>
                  {[['بطل عيد الميلاد','١٢٨ طلب','٣٧١٢ ر','#667EEA'],['حلم كأس العالم','٩٤ طلب','٢٧٢٦ ر','#F093FB'],['رحلة رمضان','٧٦ طلب','٢٢٠٤ ر','#43E97B']].map(([name,orders,rev,c],i)=>(
                    <div key={name} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
                      <span className="text-xl font-black text-sky-400 w-6">{i+1}</span>
                      <div className="flex-1"><div className="font-semibold text-gray-900 text-sm">{name}</div><div className="text-xs text-gray-400">{orders}</div></div>
                      <span className="font-bold text-emerald-500 text-sm">{rev}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <h3 className="font-bold text-gray-900 text-sm mb-4">🌍 المبيعات حسب الدولة</h3>
                  {[['🇸🇦','السعودية','٦٢٪','١٩٬٥١٨ ر'],['🇦🇪','الإمارات','٢٣٪','٧٬٢٤٠ ر'],['🇰🇼','الكويت','٩٪','٢٬٨٣٣ ر'],['🇶🇦','قطر','٦٪','١٬٨٨٩ ر']].map(([flag,country,pct,rev])=>(
                    <div key={country} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                      <span className="text-xl">{flag}</span>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-900">{country}</div>
                        <div className="h-1.5 bg-gray-100 rounded-full mt-1"><div className="h-full bg-sky-400 rounded-full" style={{width:pct}} /></div>
                      </div>
                      <span className="text-xs font-bold text-gray-600">{rev}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PROMPTS */}
          {section === 'prompts' && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-2">🧠 مدير برومبتات الذكاء الاصطناعي</h3>
              <p className="text-gray-400 text-sm mb-6">عدّل برومبتات إنشاء القصص دون الحاجة لتعديل الكود.</p>
              <div className="grid grid-cols-3 gap-5">
                <div className="col-span-1">
                  <div className="text-xs font-bold text-gray-500 uppercase mb-3">القصص</div>
                  <div className="space-y-1">
                    {[['🎂','بطل عيد الميلاد',true],['⚽','حلم كأس العالم',false],['🕌','رحلة رمضان',false],['🚀','رحلة إلى الفضاء',false]].map(([e,n,a])=>(
                      <button key={n as string} className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all text-right ${a?'bg-sky-50 text-sky-500 font-semibold':'text-gray-500 hover:bg-gray-50'}`}>
                        <span>{e}</span>{n}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase block mb-2">برومبت إنشاء النص (عربي)</label>
                  <textarea className="w-full h-40 p-3 border-2 border-gray-200 rounded-xl text-xs font-mono text-gray-700 outline-none focus:border-sky-400 resize-y" defaultValue={`اكتب قصة أطفال عربية جميلة بعنوان "بطل عيد الميلاد" \nلطفل يُدعى [CHILD_NAME]، عمره [AGE]، [GENDER].\nشخصيته: [PERSONALITY].\nالقصة يجب أن تكون:\n- ٢٠ صفحة تقريباً\n- لغة عربية فصيحة مبسطة\n- اسم الطفل يظهر في كل صفحة`} />
                  <div className="flex gap-2 mt-3">
                    <button onClick={()=>showToast('تم حفظ البرومبت ✅')} className="bg-sky-400 text-white text-sm font-bold px-4 py-2 rounded-lg">💾 حفظ</button>
                    <button onClick={()=>showToast('جاري الاختبار...')} className="border border-gray-200 text-gray-600 text-sm font-semibold px-4 py-2 rounded-lg hover:border-sky-300">▶ اختبار</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Placeholder for other sections */}
          {['stories','customers','coupons','queue','settings'].includes(section) && (
            <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
              <div className="text-4xl mb-3">{NAV.find(n=>n.id===section)?.icon}</div>
              <h3 className="font-bold text-gray-900 mb-2">{NAV.find(n=>n.id===section)?.label}</h3>
              <p className="text-gray-400 text-sm">هذا القسم جاهز — يتصل بـ Supabase عند ربط قاعدة البيانات.</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={()=>setModal(null)}>
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl" onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">تفاصيل الطلب {modal.id}</h3>
              <button onClick={()=>setModal(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="p-5 grid grid-cols-2 gap-4 text-sm">
              {[['القصة',modal.story],['الطفل',modal.child],['العميل',modal.customer],['النوع',modal.type],['المبلغ',modal.amount],['التاريخ',modal.date]].map(([l,v])=>(
                <div key={l}><div className="text-gray-400 text-xs mb-1">{l}</div><div className="font-semibold text-gray-900">{v}</div></div>
              ))}
              <div className="col-span-2"><div className="text-gray-400 text-xs mb-1">الحالة</div><StatusBadge status={modal.status} /></div>
            </div>
            <div className="flex gap-3 p-5 pt-0">
              <button onClick={()=>{showToast('تم إرسال إشعار 📧');setModal(null)}} className="flex-1 bg-sky-400 text-white font-bold py-2.5 rounded-xl text-sm">📧 إشعار العميل</button>
              <button onClick={()=>setModal(null)} className="flex-1 bg-gray-100 text-gray-600 font-semibold py-2.5 rounded-xl text-sm">إغلاق</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
