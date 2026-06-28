'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Button from '@/components/ui/Button'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const links = [
    { href: '/stories', label: 'القصص' },
    { href: '/#how', label: 'كيف يعمل' },
    { href: '/#why', label: 'مميزاتنا' },
    { href: '/faq', label: 'الأسئلة' },
  ]

  return (
    <nav className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-white/80 backdrop-blur-sm'}`}>
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gray-900 no-underline">
          <span>✨</span>
          <span><span className="text-sky-400">قصتي</span> أنا</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-7 list-none">
          {links.map(l => (
            <li key={l.href}>
              <Link href={l.href} className={`text-sm font-medium no-underline transition-colors ${pathname === l.href ? 'text-sky-400' : 'text-gray-500 hover:text-sky-400'}`}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-sky-400 no-underline font-medium">
            حسابي
          </Link>
          <Link href="/create">
            <Button size="sm">✨ ابدأ القصة</Button>
          </Link>
        </div>

        {/* Mobile menu btn */}
        <button className="md:hidden text-2xl text-gray-700" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-5 py-4 flex flex-col gap-3">
          {links.map(l => (
            <Link key={l.href} href={l.href} className="text-gray-700 font-medium no-underline py-2" onClick={() => setMenuOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Link href="/create" onClick={() => setMenuOpen(false)}>
            <Button fullWidth>✨ ابدأ القصة</Button>
          </Link>
        </div>
      )}
    </nav>
  )
}
