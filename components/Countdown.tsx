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

/* ── Sobre foto (oscuro sobre imagen clara/sepia) ── */
export default function CountdownOnPhoto() {
  const { time, mounted } = useCountdown()
  if (!mounted) return null
  const vals = [time.days, time.hours, time.minutes, time.seconds]
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {vals.map((v, i) => (
        <div key={UNITS[i]} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 'clamp(52px,16vw,70px)' }}>
            <span style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 'clamp(2rem, 7vw, 3.2rem)', color: '#1C1E0C', lineHeight: 1, letterSpacing: '0.02em' }}>
              {String(v).padStart(2, '0')}
            </span>
            <span style={{ fontFamily: 'Josefin Sans, sans-serif', fontWeight: 300, fontSize: 'clamp(0.48rem,1.6vw,0.58rem)', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(28,30,12,0.5)', marginTop: '5px' }}>
              {UNITS[i]}
            </span>
          </div>
          {i < 3 && (
            <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1rem,3vw,1.4rem)', color: 'var(--thyme)', margin: '0 2px', marginBottom: '14px', opacity: 0.55 }}>·</span>
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
