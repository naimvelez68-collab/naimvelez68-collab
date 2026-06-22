import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Naim & Sarahí · 08 · 08 · 2026',
  description: 'Save the Date — Naim & Sarahí. Guarda esta fecha especial.',
  openGraph: {
    title: 'Naim & Sarahí · Save the Date',
    description: '"Ponme como un sello sobre tu corazón." — Cantares 8:6',
    type: 'website',
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
