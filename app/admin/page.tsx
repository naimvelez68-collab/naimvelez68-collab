'use client'

import { useState, useEffect, useCallback } from 'react'

interface Confirmacion {
  id: number
  nombre: string
  apellido: string
  created_at: string
}

type View = 'login' | 'dashboard'

export default function AdminPage() {
  const [view, setView] = useState<View>('login')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<Confirmacion[]>([])
  const [loadingData, setLoadingData] = useState(false)

  const fetchData = useCallback(async () => {
    setLoadingData(true)
    try {
      const res = await fetch('/api/admin/data')
      if (res.status === 401) { setView('login'); return }
      const json = await res.json()
      setData(json.data || [])
    } catch {
      setError('Error al cargar los datos.')
    } finally {
      setLoadingData(false)
    }
  }, [])

  useEffect(() => {
    if (view === 'dashboard') fetchData()
  }, [view, fetchData])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) { setError('Contraseña incorrecta.'); setLoading(false); return }
      setView('dashboard')
    } catch {
      setError('Error de conexión.')
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    setView('login'); setPassword(''); setData([])
  }

  const exportCSV = () => {
    const headers = ['#', 'Nombre', 'Apellido', 'Fecha de confirmación']
    const rows = data.map((r, i) => [i + 1, r.nombre, r.apellido, new Date(r.created_at).toLocaleString('es-MX')])
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `confirmaciones-naim-sarahi-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (view === 'login') {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--ivory)', padding: '16px' }}>
        <div style={{ width: '100%', maxWidth: '380px', background: 'linear-gradient(160deg, #FDFBF6 0%, #F8F5EE 60%, #F0EAD8 100%)', border: '1px solid rgba(174,163,142,0.35)', boxShadow: '0 8px 40px rgba(83,88,62,0.10)', padding: '48px 40px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400, fontSize: '0.58rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--sage)', marginBottom: '16px' }}>
            Panel Administrativo
          </p>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontStyle: 'italic', fontSize: '1.75rem', color: 'var(--rifle)', marginBottom: '32px' }}>
            Naim & Sarahí
          </h1>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña de acceso"
              autoComplete="current-password"
              style={{ background: 'rgba(255,255,255,0.55)', border: '1px solid rgba(174,163,142,0.4)', borderRadius: 0, padding: '12px 16px', fontFamily: 'Montserrat, sans-serif', fontWeight: 300, fontSize: '0.875rem', color: 'var(--dark-brown)', width: '100%', outline: 'none', textAlign: 'center', letterSpacing: '0.1em' }}
            />
            {error && <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300, fontSize: '0.72rem', color: '#7a3030' }}>{error}</p>}
            <button
              type="submit"
              disabled={loading}
              style={{ background: loading ? 'var(--sage)' : 'var(--fern)', border: 'none', color: '#F8F5EE', fontFamily: 'Montserrat, sans-serif', fontWeight: 400, fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '14px', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease' }}
            >
              {loading ? 'Verificando...' : 'Ingresar'}
            </button>
          </form>
        </div>
      </main>
    )
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--ivory)', padding: 'clamp(16px, 4vw, 40px)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400, fontSize: '0.58rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--sage)', marginBottom: '4px' }}>
            Panel Administrativo
          </p>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontStyle: 'italic', fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: 'var(--rifle)' }}>
            Naim & Sarahí · 08 · 08 · 2026
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={exportCSV}
            disabled={data.length === 0}
            style={{ background: 'transparent', border: '1px solid var(--sage)', color: 'var(--rifle)', fontFamily: 'Montserrat, sans-serif', fontWeight: 400, fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', padding: '10px 20px', cursor: data.length === 0 ? 'not-allowed' : 'pointer', opacity: data.length === 0 ? 0.4 : 1, transition: 'all 0.3s' }}
          >
            Exportar CSV
          </button>
          <button
            onClick={handleLogout}
            style={{ background: 'transparent', border: '1px solid rgba(83,88,62,0.25)', color: 'var(--rifle)', fontFamily: 'Montserrat, sans-serif', fontWeight: 300, fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '10px 20px', cursor: 'pointer', transition: 'all 0.3s', opacity: 0.6 }}
          >
            Salir
          </button>
        </div>
      </div>

      {/* Divider */}
      <div style={{ width: '100%', height: '1px', background: 'linear-gradient(to right, transparent, rgba(174,163,142,0.5), transparent)', marginBottom: '28px' }} />

      {/* Counter */}
      <div style={{ background: 'linear-gradient(135deg, #F8F5EE, #DDDBD7)', border: '1px solid rgba(174,163,142,0.3)', padding: '20px 24px', marginBottom: '28px', display: 'inline-flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400, fontSize: '2.5rem', color: 'var(--fern)', lineHeight: 1 }}>
          {loadingData ? '—' : data.length}
        </span>
        <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300, fontSize: '0.72rem', color: 'var(--dark-brown)', lineHeight: 1.5, maxWidth: '180px' }}>
          {data.length === 1 ? 'persona desea recibir su invitación' : 'personas desean recibir su invitación'}
        </span>
      </div>

      {/* Table */}
      {loadingData ? (
        <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300, fontSize: '0.8rem', color: 'var(--rifle)', textAlign: 'center', padding: '40px', opacity: 0.5 }}>
          Cargando registros...
        </p>
      ) : data.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px', opacity: 0.4 }}>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: '1.1rem', color: 'var(--rifle)' }}>
            Aún no hay confirmaciones registradas.
          </p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['#', 'Nombre', 'Apellido', 'Fecha de confirmación'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontFamily: 'Montserrat, sans-serif', fontWeight: 400, fontSize: '0.56rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--sage)', borderBottom: '1px solid rgba(174,163,142,0.3)', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={row.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(221,219,215,0.25)' }}>
                  <td style={td}>{i + 1}</td>
                  <td style={{ ...td, fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: '1rem', color: 'var(--rifle)' }}>{row.nombre}</td>
                  <td style={{ ...td, fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: '1rem', color: 'var(--rifle)' }}>{row.apellido}</td>
                  <td style={{ ...td, fontSize: '0.7rem', color: 'var(--grullo)' }}>
                    {new Date(row.created_at).toLocaleString('es-MX', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: '48px', textAlign: 'center' }}>
        <div style={{ width: '60px', height: '1px', background: 'linear-gradient(to right, transparent, var(--grullo), transparent)', margin: '0 auto 10px' }} />
        <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300, fontSize: '0.58rem', letterSpacing: '0.22em', color: 'var(--grullo)' }}>
          NAIM & SARAHÍ · 08 · 08 · 2026
        </p>
      </div>
    </main>
  )
}

const td: React.CSSProperties = {
  padding: '14px 16px',
  fontFamily: 'Montserrat, sans-serif',
  fontWeight: 300,
  fontSize: '0.8rem',
  color: 'var(--dark-brown)',
  borderBottom: '1px solid rgba(174,163,142,0.12)',
  verticalAlign: 'middle',
}
