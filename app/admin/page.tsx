'use client'

import { useState, useEffect, useCallback } from 'react'

interface Confirmacion {
  id: number
  nombre: string
  apellido: string
  adultos: number
  ninos: number
  created_at: string
}

interface EditState {
  nombre: string
  apellido: string
  adultos: number
  ninos: number
}

type View = 'login' | 'dashboard'

const input: React.CSSProperties = {
  background: 'rgba(255,255,255,0.6)',
  border: '1px solid rgba(174,163,142,0.4)',
  borderRadius: 0,
  padding: '8px 10px',
  fontFamily: 'Josefin Sans, sans-serif',
  fontWeight: 300,
  fontSize: '0.8rem',
  color: 'var(--rifle)',
  outline: 'none',
  width: '100%',
}

const numInput: React.CSSProperties = {
  ...input,
  width: '56px',
  textAlign: 'center',
  padding: '8px 4px',
}

export default function AdminPage() {
  const [view, setView]               = useState<View>('login')
  const [password, setPassword]       = useState('')
  const [loginError, setLoginError]   = useState('')
  const [loading, setLoading]         = useState(false)
  const [data, setData]               = useState<Confirmacion[]>([])
  const [loadingData, setLoadingData] = useState(false)
  const [editingId, setEditingId]     = useState<number | null>(null)
  const [editState, setEditState]     = useState<EditState>({ nombre: '', apellido: '', adultos: 1, ninos: 0 })
  const [showAdd, setShowAdd]         = useState(false)
  const [addState, setAddState]       = useState<EditState>({ nombre: '', apellido: '', adultos: 1, ninos: 0 })
  const [saving, setSaving]           = useState(false)

  const fetchData = useCallback(async () => {
    setLoadingData(true)
    const res = await fetch('/api/admin/data')
    if (res.status === 401) { setView('login'); setLoadingData(false); return }
    const json = await res.json()
    setData(json.data || [])
    setLoadingData(false)
  }, [])

  useEffect(() => { if (view === 'dashboard') fetchData() }, [view, fetchData])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setLoginError('')
    const res = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) })
    if (!res.ok) { setLoginError('Contraseña incorrecta.'); setLoading(false); return }
    setView('dashboard')
  }

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    setView('login'); setPassword(''); setData([])
  }

  const startEdit = (row: Confirmacion) => {
    setEditingId(row.id)
    setEditState({ nombre: row.nombre, apellido: row.apellido, adultos: row.adultos ?? 1, ninos: row.ninos ?? 0 })
  }

  const saveEdit = async () => {
    if (!editingId) return
    setSaving(true)
    await fetch('/api/admin/update', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editingId, ...editState }) })
    setEditingId(null)
    setSaving(false)
    fetchData()
  }

  const handleDelete = async (id: number, nombre: string) => {
    if (!confirm(`¿Eliminar a ${nombre}?`)) return
    await fetch('/api/admin/delete', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    fetchData()
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!addState.nombre.trim() || !addState.apellido.trim()) return
    setSaving(true)
    await fetch('/api/admin/add', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(addState) })
    setAddState({ nombre: '', apellido: '', adultos: 1, ninos: 0 })
    setShowAdd(false)
    setSaving(false)
    fetchData()
  }

  const exportCSV = () => {
    const headers = ['#', 'Nombre', 'Apellido', 'Adultos', 'Niños', 'Total personas', 'Fecha']
    const rows = data.map((r, i) => [i + 1, r.nombre, r.apellido, r.adultos ?? 1, r.ninos ?? 0, (r.adultos ?? 1) + (r.ninos ?? 0), new Date(r.created_at).toLocaleString('es-MX')])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob)
    a.download = `invitados-naim-sarahi-${new Date().toISOString().slice(0, 10)}.csv`; a.click()
  }

  const totalAdultos = data.reduce((s, r) => s + (r.adultos ?? 1), 0)
  const totalNinos   = data.reduce((s, r) => s + (r.ninos ?? 0), 0)
  const totalPersonas = totalAdultos + totalNinos

  // ── LOGIN ──────────────────────────────────────────────────────
  if (view === 'login') return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--ecru)', padding: '16px' }}>
      <div style={{ width: '100%', maxWidth: '360px', background: 'var(--cream)', border: '1px solid rgba(174,163,142,0.3)', boxShadow: '0 8px 40px rgba(83,88,62,0.10)', padding: '44px 36px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'Josefin Sans, sans-serif', fontWeight: 300, fontSize: '0.56rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--sage)', marginBottom: '12px' }}>Panel Administrativo</p>
        <h1 style={{ fontFamily: 'Pinyon Script, cursive', fontSize: '2.4rem', color: 'var(--rifle)', marginBottom: '28px', lineHeight: 1.2 }}>Naim & Sarahí</h1>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" autoComplete="current-password" style={{ ...input, textAlign: 'center', letterSpacing: '0.1em', padding: '12px' }} />
          {loginError && <p style={{ fontFamily: 'Josefin Sans, sans-serif', fontSize: '0.72rem', color: '#7a3030' }}>{loginError}</p>}
          <button type="submit" disabled={loading} style={{ background: loading ? 'var(--sage)' : 'var(--olive)', border: 'none', color: '#FAF8F4', fontFamily: 'Josefin Sans, sans-serif', fontWeight: 400, fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '14px', cursor: 'pointer' }}>
            {loading ? 'Verificando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </main>
  )

  // ── DASHBOARD ─────────────────────────────────────────────────
  return (
    <main style={{ minHeight: '100vh', background: 'var(--ecru)', padding: 'clamp(16px,4vw,36px)' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <p style={{ fontFamily: 'Josefin Sans, sans-serif', fontWeight: 300, fontSize: '0.56rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--sage)', marginBottom: '4px' }}>Panel Administrativo</p>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontStyle: 'italic', fontSize: 'clamp(1.4rem,4vw,2rem)', color: 'var(--rifle)' }}>Naim & Sarahí · 08 · 08 · 2026</h1>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button onClick={() => setShowAdd(!showAdd)} style={{ background: 'var(--olive)', border: 'none', color: '#FAF8F4', fontFamily: 'Josefin Sans, sans-serif', fontWeight: 400, fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase', padding: '10px 18px', cursor: 'pointer' }}>
            + Agregar invitado
          </button>
          <button onClick={exportCSV} disabled={data.length === 0} style={{ background: 'transparent', border: '1px solid var(--sage)', color: 'var(--rifle)', fontFamily: 'Josefin Sans, sans-serif', fontWeight: 400, fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase', padding: '10px 18px', cursor: 'pointer', opacity: data.length === 0 ? 0.4 : 1 }}>
            Exportar CSV
          </button>
          <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid rgba(83,88,62,0.25)', color: 'var(--rifle)', fontFamily: 'Josefin Sans, sans-serif', fontWeight: 300, fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', padding: '10px 16px', cursor: 'pointer', opacity: 0.55 }}>
            Salir
          </button>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(174,163,142,0.5), transparent)', marginBottom: '22px' }} />

      {/* Contadores */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[
          { label: 'Total personas', value: totalPersonas, color: 'var(--olive)' },
          { label: 'Adultos', value: totalAdultos, color: 'var(--thyme)' },
          { label: 'Niños', value: totalNinos, color: 'var(--sage)' },
          { label: 'Familias / grupos', value: data.length, color: 'var(--grullo)' },
        ].map(c => (
          <div key={c.label} style={{ background: 'var(--cream)', border: '1px solid rgba(174,163,142,0.25)', padding: '16px 22px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: '2.2rem', color: c.color, lineHeight: 1 }}>{loadingData ? '—' : c.value}</span>
            <span style={{ fontFamily: 'Josefin Sans, sans-serif', fontWeight: 300, fontSize: '0.65rem', color: 'var(--dark-brown)', lineHeight: 1.4, maxWidth: '90px' }}>{c.label}</span>
          </div>
        ))}
      </div>

      {/* Formulario agregar */}
      {showAdd && (
        <form onSubmit={handleAdd} style={{ background: 'var(--cream)', border: '1px solid rgba(174,163,142,0.3)', borderLeft: '3px solid var(--olive)', padding: '20px', marginBottom: '20px' }}>
          <p style={{ fontFamily: 'Josefin Sans, sans-serif', fontWeight: 400, fontSize: '0.58rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--olive)', marginBottom: '14px' }}>Agregar invitado manualmente</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto auto', gap: '10px', alignItems: 'end', flexWrap: 'wrap' }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'Josefin Sans, sans-serif', fontSize: '0.54rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--sage)', marginBottom: '4px' }}>Nombre</label>
              <input value={addState.nombre} onChange={e => setAddState(s => ({ ...s, nombre: e.target.value }))} placeholder="Nombre" style={input} required />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'Josefin Sans, sans-serif', fontSize: '0.54rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--sage)', marginBottom: '4px' }}>Apellido</label>
              <input value={addState.apellido} onChange={e => setAddState(s => ({ ...s, apellido: e.target.value }))} placeholder="Apellido" style={input} required />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'Josefin Sans, sans-serif', fontSize: '0.54rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--sage)', marginBottom: '4px' }}>Adultos</label>
              <input type="number" min={0} max={20} value={addState.adultos} onChange={e => setAddState(s => ({ ...s, adultos: Number(e.target.value) }))} style={numInput} />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'Josefin Sans, sans-serif', fontSize: '0.54rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--sage)', marginBottom: '4px' }}>Niños</label>
              <input type="number" min={0} max={20} value={addState.ninos} onChange={e => setAddState(s => ({ ...s, ninos: Number(e.target.value) }))} style={numInput} />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" disabled={saving} style={{ background: 'var(--olive)', border: 'none', color: '#FAF8F4', fontFamily: 'Josefin Sans, sans-serif', fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', padding: '9px 16px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                {saving ? '...' : 'Guardar'}
              </button>
              <button type="button" onClick={() => setShowAdd(false)} style={{ background: 'transparent', border: '1px solid rgba(174,163,142,0.4)', color: 'var(--rifle)', fontFamily: 'Josefin Sans, sans-serif', fontSize: '0.6rem', padding: '9px 12px', cursor: 'pointer' }}>✕</button>
            </div>
          </div>
        </form>
      )}

      {/* Tabla */}
      {loadingData ? (
        <p style={{ fontFamily: 'Josefin Sans, sans-serif', fontWeight: 300, fontSize: '0.8rem', color: 'var(--rifle)', textAlign: 'center', padding: '40px', opacity: 0.5 }}>Cargando...</p>
      ) : data.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px', opacity: 0.4 }}>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: '1.1rem', color: 'var(--rifle)' }}>Aún no hay confirmaciones.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
            <thead>
              <tr>
                {['#', 'Nombre', 'Apellido', 'Adultos', 'Niños', 'Total', 'Registrado', 'Acciones'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 12px', fontFamily: 'Josefin Sans, sans-serif', fontWeight: 400, fontSize: '0.54rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--sage)', borderBottom: '1px solid rgba(174,163,142,0.3)', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={row.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(221,219,215,0.2)' }}>
                  {editingId === row.id ? (
                    <>
                      <td style={td}>{i + 1}</td>
                      <td style={td}><input value={editState.nombre} onChange={e => setEditState(s => ({ ...s, nombre: e.target.value }))} style={input} /></td>
                      <td style={td}><input value={editState.apellido} onChange={e => setEditState(s => ({ ...s, apellido: e.target.value }))} style={input} /></td>
                      <td style={td}><input type="number" min={0} max={20} value={editState.adultos} onChange={e => setEditState(s => ({ ...s, adultos: Number(e.target.value) }))} style={numInput} /></td>
                      <td style={td}><input type="number" min={0} max={20} value={editState.ninos} onChange={e => setEditState(s => ({ ...s, ninos: Number(e.target.value) }))} style={numInput} /></td>
                      <td style={td}>{editState.adultos + editState.ninos}</td>
                      <td style={td}>{new Date(row.created_at).toLocaleDateString('es-MX')}</td>
                      <td style={{ ...td, whiteSpace: 'nowrap' }}>
                        <button onClick={saveEdit} disabled={saving} style={btnGreen}>{saving ? '...' : '✓ Guardar'}</button>
                        <button onClick={() => setEditingId(null)} style={{ ...btnGhost, marginLeft: '6px' }}>✕</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={td}>{i + 1}</td>
                      <td style={{ ...td, fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: '1rem', color: 'var(--rifle)' }}>{row.nombre}</td>
                      <td style={{ ...td, fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: '1rem', color: 'var(--rifle)' }}>{row.apellido}</td>
                      <td style={{ ...td, textAlign: 'center', fontWeight: 400 }}>{row.adultos ?? 1}</td>
                      <td style={{ ...td, textAlign: 'center', fontWeight: 400 }}>{row.ninos ?? 0}</td>
                      <td style={{ ...td, textAlign: 'center', fontWeight: 600, color: 'var(--olive)' }}>{(row.adultos ?? 1) + (row.ninos ?? 0)}</td>
                      <td style={{ ...td, fontSize: '0.7rem', color: 'var(--grullo)' }}>{new Date(row.created_at).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      <td style={{ ...td, whiteSpace: 'nowrap' }}>
                        <button onClick={() => startEdit(row)} style={btnEdit} title="Editar">✏️ Editar</button>
                        <button onClick={() => handleDelete(row.id, row.nombre)} style={{ ...btnGhost, marginLeft: '6px' }} title="Eliminar">🗑️</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <div style={{ width: '60px', height: '1px', background: 'linear-gradient(to right, transparent, var(--grullo), transparent)', margin: '0 auto 10px' }} />
        <p style={{ fontFamily: 'Josefin Sans, sans-serif', fontWeight: 300, fontSize: '0.56rem', letterSpacing: '0.22em', color: 'var(--grullo)' }}>NAIM & SARAHÍ · 08 · 08 · 2026 · IBARRA, ECUADOR</p>
      </div>
    </main>
  )
}

const td: React.CSSProperties = { padding: '10px 12px', fontFamily: 'Josefin Sans, sans-serif', fontWeight: 300, fontSize: '0.8rem', color: 'var(--dark-brown)', borderBottom: '1px solid rgba(174,163,142,0.12)', verticalAlign: 'middle' }
const btnGreen: React.CSSProperties = { background: 'var(--olive)', border: 'none', color: '#FAF8F4', fontFamily: 'Josefin Sans, sans-serif', fontSize: '0.58rem', letterSpacing: '0.12em', padding: '6px 12px', cursor: 'pointer', borderRadius: '2px' }
const btnEdit: React.CSSProperties = { background: 'transparent', border: '1px solid rgba(174,163,142,0.5)', color: 'var(--rifle)', fontFamily: 'Josefin Sans, sans-serif', fontSize: '0.58rem', letterSpacing: '0.1em', padding: '6px 10px', cursor: 'pointer', borderRadius: '2px' }
const btnGhost: React.CSSProperties = { background: 'transparent', border: '1px solid rgba(174,163,142,0.35)', color: 'var(--dark-brown)', fontFamily: 'Josefin Sans, sans-serif', fontSize: '0.58rem', padding: '6px 8px', cursor: 'pointer', borderRadius: '2px', opacity: 0.7 }
