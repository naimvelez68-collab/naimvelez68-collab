'use client'

import { useState } from 'react'
import Divider from './GoldDivider'

export default function ConfirmForm({ onSuccess }: { onSuccess: () => void }) {
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre.trim() || !apellido.trim()) { setError('Por favor, ingresa tu nombre y apellido.'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/confirm', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nombre, apellido }) })
      if (!res.ok) throw new Error()
      onSuccess()
    } catch {
      setError('Ocurrió un error. Por favor, inténtalo de nuevo.')
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.5)',
    border: '1px solid rgba(174,163,142,0.4)',
    borderRadius: 0,
    padding: '13px 16px',
    fontFamily: 'Cormorant Garamond, serif',
    fontStyle: 'italic',
    fontSize: '1rem',
    color: 'var(--rifle)',
    width: '100%',
    outline: 'none',
    transition: 'border-color 0.3s',
  }

  return (
    <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--ecru)', padding: 'clamp(60px, 10vw, 80px) 16px' }}>
      <div className="animate-envelope w-full" style={{ maxWidth: '380px', background: 'var(--cream)', border: '1px solid rgba(174,163,142,0.3)', boxShadow: '0 12px 56px rgba(83,88,62,0.09)', padding: 'clamp(28px, 9vw, 52px)', textAlign: 'center' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ width: '32px', height: '1px', background: 'linear-gradient(to right, transparent, var(--grullo))' }} />
          <span style={{ color: 'var(--sage)', fontSize: '0.62rem' }}>✦</span>
          <div style={{ width: '32px', height: '1px', background: 'linear-gradient(to left, transparent, var(--grullo))' }} />
        </div>

        <p style={{ fontFamily: 'Josefin Sans, sans-serif', fontWeight: 300, fontSize: '0.52rem', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'var(--sage)', marginBottom: '10px' }}>Confirmación</p>

        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400, fontStyle: 'italic', fontSize: 'clamp(1.2rem, 4vw, 1.6rem)', color: 'var(--rifle)', lineHeight: 1.35, marginBottom: '10px' }}>
          Nos alegra que quieras acompañarnos
        </h2>

        <p style={{ fontFamily: 'Josefin Sans, sans-serif', fontWeight: 300, fontSize: '0.72rem', color: 'var(--dark-brown)', lineHeight: 1.7, marginBottom: '22px', opacity: 0.8 }}>
          Déjanos tu nombre para enviarte la invitación formal.
        </p>

        <Divider />

        <form onSubmit={handleSubmit} style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[{ label: 'Nombre', value: nombre, set: setNombre, ph: 'Tu nombre' }, { label: 'Apellido', value: apellido, set: setApellido, ph: 'Tu apellido' }].map((f) => (
            <div key={f.label} style={{ textAlign: 'left' }}>
              <label style={{ display: 'block', fontFamily: 'Josefin Sans, sans-serif', fontWeight: 400, fontSize: '0.52rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--sage)', marginBottom: '6px' }}>{f.label}</label>
              <input type="text" value={f.value} onChange={(e) => f.set(e.target.value)} placeholder={f.ph} maxLength={60} style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = 'var(--thyme)' }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(174,163,142,0.4)' }}
              />
            </div>
          ))}

          {error && <p style={{ fontFamily: 'Josefin Sans, sans-serif', fontWeight: 300, fontSize: '0.7rem', color: '#7a3030' }}>{error}</p>}

          <button type="submit" disabled={loading} style={{ background: loading ? 'var(--sage)' : 'var(--olive)', border: 'none', color: '#FAF7F2', fontFamily: 'Josefin Sans, sans-serif', fontWeight: 400, fontSize: '0.6rem', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.35s ease', marginTop: '4px' }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = 'var(--moss)' }}
            onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = 'var(--olive)' }}
          >
            {loading ? 'Guardando...' : 'Confirmar mi interés'}
          </button>
        </form>

        <p style={{ fontFamily: 'Pinyon Script, cursive', fontSize: '1.8rem', color: 'var(--rifle)', marginTop: '24px', opacity: 0.55, lineHeight: 1.2 }}>Naim & Sarahí</p>
      </div>
    </section>
  )
}
