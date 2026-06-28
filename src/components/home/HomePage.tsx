'use client'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/home/Hero'
import Link from 'next/link'

const steps = [
  { n: '١', emoji: '📚', title: 'اختر القصة', desc: 'تصفح مكتبتنا من القصص — عيد ميلاد، رمضان، مغامرة، فضاء وأكثر.', color: 'from-sky-400 to-blue-500' },
  { n: '٢', emoji: '✏️', title: 'أدخل تفاصيل طفلك', desc: 'الاسم، العمر، الشخصية — وأي تفاصيل تجعل القصة فريدة.', color: 'from-emerald-400 to-green-500' },
  { n: '٣', emoji: '💳', title: 'ادفع بأمان', desc: 'مدى، Apple Pay، Visa. دفع مشفر في أقل من دقيقة.', color: 'from-orange-400 to-pink-500' },
  { n: '٤', emoji: '🎁', title: 'استلم فوراً', desc: 'PDF في ٣ دقائق، أو كتاب مطبوع فاخر بالشحن.', color: 'from-purple-400 to-violet-600' },
]

const features = [
  { emoji: '🤖', title: 'ذكاء اصطناعي يفهم العربية', desc: 'قصص بالعربية الفصحى الجميلة — إبداع أصيل لا ترجمة.', bg: 'bg-sky-50' },
  { emoji: '⚡', title: 'تسليم فوري في ٣ دقائق', desc: 'PDF جاهز للطباعة فور اكتمال الدفع.', bg: 'bg-emerald-50' },
  { emoji: '🎨', title: 'رسوم احترافية ٦ أنماط', desc: 'من الألوان المائية إلى ثلاثي الأبعاد.', bg: 'bg-orange-50' },
  { emoji: '🔒', title: 'خصوصية طفلك محمية', desc: 'صوره تُحذف تلقائياً خلال ٢٤ ساعة.', bg: 'bg-purple-50' },
  { emoji: '💝', title: 'مخصصة ١٠٠٪', desc: 'الاسم والشخصية والحلم — كل تفصيل في القصة.', bg: 'bg-pink-50' },
  { emoji: '📦', title: 'كتاب مطبوع فاخر', desc: 'هدية تبقى في المكتبة وتُقرأ مرات لا تُعدّ.', bg: 'bg-yellow-50' },
]

const stories = [
  { emoji:'🎂', title:'بطل عيد الميلاد', grad:'linear-gradient(160deg,#667EEA,#764BA2)', slug:'birthday-hero' },
  { emoji:'⚽', title:'حلم كأس العالم', grad:'linear-gradient(160deg,#F093FB,#F5576C)', slug:'world-cup-dream' },
  { emoji:'🚀', title:'رحلة إلى الفضاء', grad:'linear-gradient(160deg,#4FACF7,#00F2FE)', slug:'space-explorer' },
  { emoji:'🕌', title:'رحلة رمضان', grad:'linear-gradient(160deg,#43E97B,#38F9D7)', slug:'ramadan-journey' },
  { emoji:'👸', title:'الأميرة الشجاعة', grad:'linear-gradient(160deg,#FA709A,#FEE140)', slug:'brave-princess' },
  { emoji:'🏫', title:'أول يوم مدرسة', grad:'linear-gradient(160deg,#A18CD1,#FBC2EB)', slug:'first-day-school' },
  { emoji:'🌊', title:'مملكة المحيط', grad:'linear-gradient(160deg,#FF9A9E,#FECFEF)', slug:'ocean-kingdom' },
  { emoji:'🩺', title:'طبيب المستقبل', grad:'linear-gradient(160deg,#A1C4FD,#C2E9FB)', slug:'future-doctor' },
]

const reviews = [
  { text: 'أبكت ابنتي من الفرح لما رأت اسمها بطلة القصة! أجمل هدية في عيد ميلادها.', name: 'أم يارا', loc: 'الرياض • ابنتها ٦ سنوات', emoji: '👩' },
  { text: 'سريعة جداً! طفلي يطلب نقرأها كل ليلة قبل النوم.', name: 'أبو فهد', loc: 'جدة • ولده ٨ سنوات', emoji: '👨' },
  { text: 'اشتريت لأولادي الثلاثة. كل واحد قصته الخاصة. ما في هدية أفضل والله.', name: 'أم عمر وعلي وسارة', loc: 'دبي • باقة العائلة', emoji: '👩' },
  { text: 'الكتاب المطبوع وصل بجودة ممتازة. طفلي يحمله معه كل مكان.', name: 'أبو خالد', loc: 'الكويت', emoji: '👨' },
  { text: 'قصة رمضان علّمت ابنتي قيم الصيام بطريقة محببة.', name: 'أم ريم', loc: 'القاهرة', emoji: '👩' },
]

const faqs = [
  { q: 'كيف تُنشأ القصة بسرعة؟', a: 'نستخدم أحدث تقنيات الذكاء الاصطناعي لكتابة القصة وإنشاء الرسومات. العملية تستغرق ٢–٥ دقائق.' },
  { q: 'هل صور طفلي آمنة؟', a: 'نعم، تُشفَّر وتُحذف خلال ٢٤ ساعة. لا تُستخدم لأي غرض آخر أبداً.' },
  { q: 'ما الفرق بين PDF والكتاب المطبوع؟', a: 'PDF تحصل عليه فوراً. الكتاب المطبوع يصلك ٥–٧ أيام بغلاف فاخر.' },
  { q: 'ماذا لو لم تعجبني القصة؟', a: 'نعيد إنشاءها مجاناً أو نُعيد لك المبلغ كاملاً بدون أسئلة.' },
  { q: 'هل تتوفر القصص باللغة الإنجليزية؟', a: 'نعم! تختار اللغة عند إنشاء القصة — عربية أو إنجليزية.' },
]

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />

        {/* TRUST BAR */}
        <div className="bg-gray-900 py-3 px-5">
          <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-5">
            {['🔒 دفع آمن ١٠٠٪','🖼️ صور طفلك تُحذف بعد الإنشاء','⚡ PDF فوري في ٣ دقائق','💝 ضمان الرضا'].map(t=>(
              <span key={t} className="text-gray-300 text-xs font-medium">{t}</span>
            ))}
          </div>
        </div>

        {/* HOW IT WORKS */}
        <section id="how" className="py-20 bg-amber-50/50 px-5">
          <div className="max-w-5xl mx-auto text-center">
            <span className="text-xs font-bold tracking-widest uppercase text-sky-400 block mb-3">كيف يعمل</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">٤ خطوات بسيطة وقصة لا تُنسى 🌈</h2>
            <p className="text-gray-400 mb-12 max-w-md mx-auto">لا حاجة لخبرة تقنية — فقط اسم طفلك وبضع دقائق.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {steps.map((s,i)=>(
                <div key={i} className="bg-white rounded-3xl p-6 shadow-sm text-center hover:-translate-y-1 transition-transform">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${s.color} text-white font-black text-sm flex items-center justify-center mx-auto mb-3`}>{s.n}</div>
                  <div className="text-3xl mb-2">{s.emoji}</div>
                  <div className="font-bold text-gray-900 text-sm mb-1">{s.title}</div>
                  <div className="text-gray-400 text-xs leading-relaxed">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STORIES */}
        <section id="stories" className="py-20 px-5 bg-white">
          <div className="max-w-5xl mx-auto">
            <span className="text-xs font-bold tracking-widest uppercase text-sky-400 block mb-3">مكتبة القصص</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">اختر قصة طفلك المفضلة ✨</h2>
            <p className="text-gray-400 mb-10 max-w-lg">كل قصة مكتوبة بالعربية بأسلوب جميل وتتضمن اسم طفلك وشخصيته.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {stories.map((s,i)=>(
                <Link href={`/create?story=${s.slug}`} key={i} className="no-underline group">
                  <div className="bg-white rounded-3xl overflow-hidden border-2 border-transparent shadow-sm group-hover:-translate-y-1.5 group-hover:shadow-xl group-hover:border-sky-200 transition-all">
                    <div className="h-40 flex items-center justify-center text-5xl" style={{background:s.grad}}>{s.emoji}</div>
                    <div className="p-4">
                      <div className="font-bold text-gray-900 text-sm mb-3">{s.title}</div>
                      <div className="flex items-center justify-between">
                        <span className="font-black text-sky-500 text-sm">٢٩ ريال</span>
                        <span className="bg-sky-50 text-sky-500 text-xs font-bold px-3 py-1 rounded-full">اختر ←</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/stories">
                <button className="border-2 border-gray-200 text-gray-600 font-bold px-6 py-3 rounded-full hover:border-sky-400 hover:text-sky-500 transition-all">عرض جميع القصص ←</button>
              </Link>
            </div>
          </div>
        </section>

        {/* BUNDLE */}
        <section className="py-16 px-5 bg-gradient-to-br from-purple-50 to-sky-50">
          <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">وفّر ٣٥٪</span>
              <h3 className="text-2xl font-bold text-gray-900 mt-3 mb-2">باقة العائلة 👨‍👩‍👧‍👦</h3>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed">٣ قصص مخصصة لأطفالك — كل واحد يحصل على قصة باسمه.</p>
              <ul className="space-y-2 mb-6">
                {['٣ قصص PDF جاهزة فوراً','مخصصة لكل طفل باسمه','شهادة إهداء مجانية'].map(i=>(
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700"><span className="text-emerald-500 font-bold">✓</span>{i}</li>
                ))}
              </ul>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-gray-400 line-through text-sm">٨٧ ريال</span>
                <span className="text-3xl font-black text-sky-500">٥٩ ريال</span>
              </div>
              <Link href="/create?bundle=true">
                <button className="bg-gradient-to-r from-sky-400 to-blue-500 text-white font-bold px-6 py-3 rounded-full shadow-lg hover:-translate-y-0.5 transition-all">اطلب باقة العائلة ←</button>
              </Link>
            </div>
            <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-purple-50 to-sky-50 rounded-2xl h-44">
              <div className="text-center"><div className="text-5xl mb-2">📚✨📖</div><div className="text-sm text-gray-400">٣ قصص لكل عائلة</div></div>
            </div>
          </div>
        </section>

        {/* WHY US */}
        <section id="why" className="py-20 px-5 bg-sky-50/30">
          <div className="max-w-5xl mx-auto">
            <span className="text-xs font-bold tracking-widest uppercase text-sky-400 block mb-3">لماذا قصتي أنا</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10">ليست مجرد قصة — هي ذكرى للأبد 💙</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {features.map((f,i)=>(
                <div key={i} className="bg-white rounded-3xl p-7 shadow-sm hover:-translate-y-1 transition-transform">
                  <div className={`w-14 h-14 rounded-2xl ${f.bg} flex items-center justify-center text-2xl mb-4`}>{f.emoji}</div>
                  <h4 className="font-bold text-gray-900 mb-2">{f.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section className="py-20 bg-white overflow-hidden">
          <div className="max-w-5xl mx-auto px-5 mb-8">
            <span className="text-xs font-bold tracking-widest uppercase text-sky-400 block mb-3">آراء الآباء</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">ماذا يقول الآباء؟ 🥰</h2>
          </div>
          <div className="overflow-hidden">
            <div className="flex gap-5 w-max" style={{animation:'scrollTrack 30s linear infinite'}}>
              {[...reviews,...reviews].map((r,i)=>(
                <div key={i} className="w-72 flex-shrink-0 bg-gray-50 border border-gray-100 rounded-3xl p-6">
                  <div className="text-yellow-400 text-sm mb-3">★★★★★</div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-4 italic">"{r.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-purple-500 flex items-center justify-center text-lg">{r.emoji}</div>
                    <div>
                      <div className="font-bold text-gray-900 text-sm">{r.name}</div>
                      <div className="text-gray-400 text-xs">{r.loc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <style jsx>{`@keyframes scrollTrack{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-20 px-5 bg-amber-50/30">
          <div className="max-w-2xl mx-auto">
            <span className="text-xs font-bold tracking-widest uppercase text-sky-400 block mb-3">أسئلة شائعة</span>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">كل ما تريد معرفته 💬</h2>
            <div className="space-y-3">
              {faqs.map((f,i)=>(
                <details key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden group">
                  <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-gray-900 text-sm list-none">
                    {f.q}
                    <span className="w-7 h-7 rounded-full bg-sky-50 text-sky-400 flex items-center justify-center text-sm font-bold group-open:bg-sky-400 group-open:text-white transition-all flex-shrink-0 mr-3">+</span>
                  </summary>
                  <div className="px-5 pb-5 text-sm text-gray-500 leading-relaxed">{f.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section id="create" className="py-24 px-5 text-white text-center relative overflow-hidden" style={{background:'linear-gradient(135deg,#1A1A2E,#16213E)'}}>
          <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(ellipse at 30% 50%,rgba(79,172,247,0.15),transparent 60%),radial-gradient(ellipse at 70% 50%,rgba(167,139,250,0.12),transparent 60%)'}} />
          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="text-5xl mb-5">🌟</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">جاهز تُسعد طفلك اليوم؟</h2>
            <p className="text-gray-300 mb-8 leading-relaxed">في أقل من ٤ دقائق، يصبح طفلك بطل قصته الخاصة.</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/create"><button className="bg-white text-gray-900 font-bold px-8 py-4 rounded-full shadow-xl hover:-translate-y-0.5 transition-all">✨ ابدأ قصتك الآن</button></Link>
              <Link href="/stories"><button className="border-2 border-white/30 text-white font-semibold px-6 py-4 rounded-full hover:border-white transition-all">📚 تصفح القصص</button></Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
