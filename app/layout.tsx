import type { Metadata } from 'next'
import './globals.css'

const siteUrl = 'https://velezguevara-boda.vercel.app'
const ogImage = `${siteUrl}/og.jpg`

export const metadata: Metadata = {
  title: 'Naim & Sarahí · Save the Date · 08 · 08 · 2026',
  description: 'Con mucha alegría queremos que guardes esta fecha especial. Ibarra, Ecuador · 08 · 08 · 2026',
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: 'Naim & Sarahí · Save the Date',
    description: '"Ponme como un sello sobre tu corazón." — Cantares 8:6',
    type: 'website',
    url: siteUrl,
    images: [
      {
        url: ogImage,
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
    images: [ogImage],
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
