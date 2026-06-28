import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'قصتي أنا — كل طفل يستحق أن يكون بطل قصته',
    template: '%s | قصتي أنا',
  },
  description: 'حوّل اسم طفلك وشخصيته وأحلامه إلى قصة مصورة رائعة مخصصة له — تسليم فوري أو كتاب مطبوع فاخر.',
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    url: 'https://qisatiana.com',
    siteName: 'قصتي أنا',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased" style={{fontFamily:"'IBM Plex Sans Arabic', Arial, sans-serif"}}>
        {children}
      </body>
    </html>
  )
}
