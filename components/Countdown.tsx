'use client'

import { useState, useEffect } from 'react'

const TARGET = new Date('2026-08-08T14:00:00')

function useCountdown() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
    const calc = () => {
      const d = TARGET.getTime() - Date.now()
      if (d <= 0) { setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return }
      setTime({
        days:    Math.floor(d / 86400000),
        hours:   Math.floor((d / 3600000) % 24),
        minutes: Math.floor((d / 60000) % 60),
        seconds: Math.floor((d / 1000) % 60),
      })
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [])
  return { time, mounted }
}

const UNITS = ['Días', 'Horas', 'Min', 'Seg'] as const

/* ── Sobre foto — blanco con sombra fuerte, siempre legible ── */
export default function CountdownOnPhoto() {
  const { time, mounted } = useCountdown()
  if (!mounted) return null
  const vals  = [time.days, time.hours, time.minutes, time.seconds]
  const labels = ['Días', 'Horas', 'Min', 'Seg']
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        /* Fondo semi-transparente detrás del contador para máxima legibilidad */
        background: 'rgba(0,0,0,0.28)',
        backdropFilter: 'blur(6px)',
        borderTop: '1px solid rgba(255,255,255,0.12)',
        padding: 'clamp(8px,2vh,14px) clamp(16px,4vw,32px)',
        gap: 0,
      }}
    >
      {vals.map((v, i) => (
        <div key={labels[i]} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 'clamp(58px,17vw,76px)' }}>
            <span style={{
              fontFamily: 'Cormorant Garamond, serif', fontWeight: 300,
              fontSize: 'clamp(2.2rem, 8vw, 3.5rem)',
              color: '#FFFFFF',
              textShadow: '0 2px 10px rgba(0,0,0,0.6)',
              lineHeight: 1, letterSpacing: '0.02em',
            }}>
              {String(v).padStart(2, '0')}
            </span>
            <span style={{
              fontFamily: 'Josefin Sans, sans-serif', fontWeight: 400,
              fontSize: 'clamp(0.52rem, 1.6vw, 0.65rem)',
              letterSpacing: '0.3em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.75)',
              marginTop: '4px',
            }}>
              {labels[i]}
            </span>
          </div>
          {i < 3 && (
            <span style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(1.2rem, 3.5vw, 1.8rem)',
              color: '#A8C080',
              margin: '0 4px', marginBottom: '16px',
            }}>·</span>
          )}
        </div>
      ))}
    </div>
  )
}

/* ── Sobre fondo claro (ecru/cream) ── */
export function CountdownLight() {
  const { time, mounted } = useCountdown()
  if (!mounted) return null
  const vals = [time.days, time.hours, time.minutes, time.seconds]
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {vals.map((v, i) => (
        <div key={UNITS[i]} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 'clamp(60px,18vw,76px)' }}>
            <span style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 'clamp(2.4rem, 9vw, 3.2rem)', color: 'var(--olive)', lineHeight: 1 }}>
              {String(v).padStart(2, '0')}
            </span>
            <span style={{ fontFamily: 'Josefin Sans, sans-serif', fontWeight: 300, fontSize: 'clamp(0.5rem,1.8vw,0.6rem)', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--sage)', marginTop: '6px' }}>
              {UNITS[i]}
            </span>
          </div>
          {i < 3 && (
            <span style={{ color: 'var(--grullo)', fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.1rem,3.5vw,1.5rem)', margin: '0 4px', marginBottom: '16px', opacity: 0.4 }}>·</span>
          )}
        </div>
      ))}
    </div>
  )
}
