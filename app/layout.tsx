import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Naim & Sarahí · Save the Date · 08 · 08 · 2026',
  description: 'Con mucha alegría queremos que guardes esta fecha especial. Ibarra, Ecuador · 08 · 08 · 2026',
  openGraph: {
    title: 'Naim & Sarahí · Save the Date',
    description: '"Ponme como un sello sobre tu corazón." — Cantares 8:6',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Save the Date — Naim & Sarahí · 08 · 08 · 2026',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Naim & Sarahí · Save the Date',
    description: '"Ponme como un sello sobre tu corazón." — Cantares 8:6',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-full" style={{ background: 'var(--ecru)' }}>
        {children}
      </body>
    </html>
  )
}
