import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-gray-900 text-white pt-14 pb-8">
      <div className="max-w-6xl mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="text-xl font-bold mb-3">✨ <span className="text-sky-400">قصتي</span> أنا</div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              نحوّل أحلام أطفالك إلى قصص سحرية مخصصة — بالذكاء الاصطناعي وبالعربية الجميلة.
            </p>
            <div className="flex flex-wrap gap-2">
              {['🇸🇦 مدى', 'Apple Pay', 'Visa', '🇰🇼 KNET'].map(m => (
                <span key={m} className="bg-white/10 text-xs px-2.5 py-1 rounded-lg">{m}</span>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold mb-4 text-sm">القصص</h4>
            <ul className="space-y-2.5 list-none">
              {[['قصص عيد الميلاد', '/stories?cat=celebrations'], ['قصص رمضان', '/stories?cat=islamic'], ['قصص المغامرة', '/stories?cat=adventure'], ['جميع القصص', '/stories']].map(([l, h]) => (
                <li key={h}><Link href={h} className="text-gray-400 text-sm no-underline hover:text-sky-400 transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-sm">الشركة</h4>
            <ul className="space-y-2.5 list-none">
              {[['من نحن', '/about'], ['كيف يعمل', '/#how'], ['المدونة', '/blog'], ['تواصل معنا', '/contact']].map(([l, h]) => (
                <li key={h}><Link href={h} className="text-gray-400 text-sm no-underline hover:text-sky-400 transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-sm">المساعدة</h4>
            <ul className="space-y-2.5 list-none">
              {[['الأسئلة الشائعة', '/faq'], ['سياسة الاسترداد', '/refund'], ['سياسة الخصوصية', '/privacy'], ['الشروط والأحكام', '/terms']].map(([l, h]) => (
                <li key={h}><Link href={h} className="text-gray-400 text-sm no-underline hover:text-sky-400 transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex items-center justify-between flex-wrap gap-4">
          <span className="text-gray-500 text-xs">© {year} قصتي أنا. جميع الحقوق محفوظة.</span>
          <div className="flex gap-3">
            {['𝕏', '📷', '📘', '▶'].map(s => (
              <button key={s} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm hover:bg-sky-400 transition-colors">{s}</button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
