'use client'

import { useState, useEffect, useCallback } from 'react'

interface Confirmacion {
  id: number
  nombre: string
  apellido: string
  adultos: number
  ninos: number
  acompanante_de: string | null
  created_at: string
}

interface FormState {
  nombre: string
  apellido: string
  adultos: number
  ninos: number
  acompanante_de: string
}

const EMPTY: FormState = { nombre: '', apellido: '', adultos: 1, ninos: 0, acompanante_de: '' }

/* ── Estilos reutilizables ─────────────────────────────────── */
const inp: React.CSSProperties = {
  background: 'rgba(255,255,255,0.65)',
  border: '1px solid rgba(174,163,142,0.45)',
  borderRadius: 0, padding: '8px 10px',
  fontFamily: 'Josefin Sans, sans-serif', fontWeight: 300,
  fontSize: '0.82rem', color: 'var(--rifle)',
  outline: 'none', width: '100%',
}
const numInp: React.CSSProperties = { ...inp, width: '60px', textAlign: 'center', padding: '8px 4px' }
const td: React.CSSProperties = {
  padding: '10px 12px', fontFamily: 'Josefin Sans, sans-serif',
  fontWeight: 300, fontSize: '0.8rem', color: 'var(--dark-brown)',
  borderBottom: '1px solid rgba(174,163,142,0.12)', verticalAlign: 'middle',
}
const btnGreen: React.CSSProperties = {
  background: 'var(--olive)', border: 'none', color: '#FAF8F4',
  fontFamily: 'Josefin Sans, sans-serif', fontSize: '0.58rem',
  letterSpacing: '0.1em', padding: '6px 12px', cursor: 'pointer', borderRadius: '2px',
}
const btnOutline: React.CSSProperties = {
  background: 'transparent', border: '1px solid rgba(174,163,142,0.45)',
  color: 'var(--rifle)', fontFamily: 'Josefin Sans, sans-serif',
  fontSize: '0.58rem', padding: '6px 10px', cursor: 'pointer', borderRadius: '2px',
}

export default function AdminPage() {
  const [view, setView]         = useState<'login' | 'dashboard'>('login')
  const [password, setPassword] = useState('')
  const [loginErr, setLoginErr] = useState('')
  const [logging, setLogging]   = useState(false)
  const [data, setData]         = useState<Confirmacion[]>([])
  const [loading, setLoading]   = useState(false)
  const [saving, setSaving]     = useState(false)
  const [editId, setEditId]     = useState<number | null>(null)
  const [editForm, setEditForm] = useState<FormState>(EMPTY)
  const [showAdd, setShowAdd]   = useState(false)
  const [addForm, setAddForm]   = useState<FormState>(EMPTY)
  const [addError, setAddError] = useState('')

  /* Lista de personas principales (sin acompañante) para el dropdown */
  const principales = data.filter(r => !r.acompanante_de)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/data')
    if (res.status === 401) { setView('login'); setLoading(false); return }
    const json = await res.json()
    setData(json.data || [])
    setLoading(false)
  }, [])

  useEffect(() => { if (view === 'dashboard') fetchData() }, [view, fetchData])

  /* Login */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setLogging(true); setLoginErr('')
    const res = await fetch('/api/admin/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (!res.ok) { setLoginErr('Contraseña incorrecta.'); setLogging(false); return }
    setView('dashboard')
  }

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    setView('login'); setPassword(''); setData([])
  }

  /* Agregar */
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!addForm.nombre.trim() || !addForm.apellido.trim()) { setAddError('Nombre y apellido son requeridos'); return }
    setSaving(true); setAddError('')
    const res = await fetch('/api/admin/add', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(addForm),
    })
    const json = await res.json()
    if (!res.ok) { setAddError(json.error || 'Error al guardar'); setSaving(false); return }
    setAddForm(EMPTY); setShowAdd(false); setSaving(false); fetchData()
  }

  /* Editar */
  const startEdit = (row: Confirmacion) => {
    setEditId(row.id)
    setEditForm({
      nombre: row.nombre, apellido: row.apellido,
      adultos: row.adultos ?? 1, ninos: row.ninos ?? 0,
      acompanante_de: row.acompanante_de ?? '',
    })
  }

  const saveEdit = async () => {
    if (!editId) return; setSaving(true)
    await fetch('/api/admin/update', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editId, ...editForm }),
    })
    setEditId(null); setSaving(false); fetchData()
  }

  /* Eliminar */
  const handleDelete = async (id: number, nombre: string) => {
    if (!confirm(`¿Eliminar a ${nombre}? Esta acción no se puede deshacer.`)) return
    await fetch('/api/admin/delete', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    fetchData()
  }

  /* Exportar CSV */
  const exportCSV = () => {
    const headers = ['#', 'Nombre', 'Apellido', 'Acompañante de', 'Adultos', 'Niños', 'Total', 'Fecha']
    const rows = data.map((r, i) => [
      i + 1, r.nombre, r.apellido, r.acompanante_de || '—',
      r.adultos ?? 1, r.ninos ?? 0,
      (r.adultos ?? 1) + (r.ninos ?? 0),
      new Date(r.created_at).toLocaleString('es-MX'),
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' }))
    a.download = `invitados-${new Date().toISOString().slice(0, 10)}.csv`; a.click()
  }

  /* Totales */
  const totAdultos  = data.reduce((s, r) => s + (r.adultos ?? 1), 0)
  const totNinos    = data.reduce((s, r) => s + (r.ninos ?? 0), 0)
  const totPersonas = totAdultos + totNinos

  /* ── LOGIN ────────────────────────────────────────────────── */
  if (view === 'login') return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--ecru)', padding: '16px' }}>
      <div style={{ width: '100%', maxWidth: '360px', background: 'var(--cream)', border: '1px solid rgba(174,163,142,0.3)', boxShadow: '0 8px 40px rgba(83,88,62,0.10)', padding: '44px 36px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'Josefin Sans, sans-serif', fontWeight: 300, fontSize: '0.56rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--sage)', marginBottom: '10px' }}>Panel Administrativo</p>
        <h1 style={{ fontFamily: 'Pinyon Script, cursive', fontSize: '2.4rem', color: 'var(--rifle)', marginBottom: '28px' }}>Naim & Sarahí</h1>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" style={{ ...inp, textAlign: 'center', padding: '12px' }} />
          {loginErr && <p style={{ fontFamily: 'Josefin Sans, sans-serif', fontSize: '0.72rem', color: '#7a3030' }}>{loginErr}</p>}
          <button type="submit" disabled={logging} style={{ ...btnGreen, padding: '14px', fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            {logging ? 'Verificando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </main>
  )

  /* ── DASHBOARD ────────────────────────────────────────────── */
  return (
    <main style={{ minHeight: '100vh', background: 'var(--ecru)', padding: 'clamp(16px,4vw,36px)' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <p style={{ fontFamily: 'Josefin Sans, sans-serif', fontSize: '0.54rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--sage)', marginBottom: '4px' }}>Panel Administrativo</p>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontStyle: 'italic', fontSize: 'clamp(1.4rem,4vw,2rem)', color: 'var(--rifle)' }}>Naim & Sarahí · 08 · 08 · 2026</h1>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button onClick={() => { setShowAdd(!showAdd); setAddError('') }} style={{ ...btnGreen, padding: '10px 18px', fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            + Agregar invitado
          </button>
          <button onClick={exportCSV} disabled={!data.length} style={{ ...btnOutline, padding: '10px 16px', fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', opacity: data.length ? 1 : 0.4 }}>
            Exportar CSV
          </button>
          <button onClick={handleLogout} style={{ ...btnOutline, padding: '10px 14px', fontSize: '0.6rem', opacity: 0.55 }}>
            Salir
          </button>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(174,163,142,0.5), transparent)', marginBottom: '20px' }} />

      {/* Contadores */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '22px', flexWrap: 'wrap' }}>
        {[
          { label: 'Total personas', value: totPersonas, color: 'var(--olive)' },
          { label: 'Adultos', value: totAdultos, color: 'var(--thyme)' },
          { label: 'Niños', value: totNinos, color: 'var(--sage)' },
          { label: 'Registros', value: data.length, color: 'var(--grullo)' },
        ].map(c => (
          <div key={c.label} style={{ background: 'var(--cream)', border: '1px solid rgba(174,163,142,0.25)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: '2rem', color: c.color, lineHeight: 1 }}>{loading ? '—' : c.value}</span>
            <span style={{ fontFamily: 'Josefin Sans, sans-serif', fontWeight: 300, fontSize: '0.62rem', color: 'var(--dark-brown)', lineHeight: 1.4 }}>{c.label}</span>
          </div>
        ))}
      </div>

      {/* ── FORMULARIO AGREGAR ─────────────────────────────────── */}
      {showAdd && (
        <form onSubmit={handleAdd}
          style={{ background: 'var(--cream)', border: '1px solid rgba(174,163,142,0.3)', borderLeft: '3px solid var(--olive)', padding: '20px 22px', marginBottom: '20px' }}
        >
          <p style={{ fontFamily: 'Josefin Sans, sans-serif', fontWeight: 400, fontSize: '0.56rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--olive)', marginBottom: '16px' }}>
            Agregar invitado manualmente
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '12px' }}>
            {/* Nombre */}
            <div>
              <label style={lbl}>Nombre *</label>
              <input value={addForm.nombre} onChange={e => setAddForm(f => ({ ...f, nombre: e.target.value }))} placeholder="Nombre" style={inp} />
            </div>
            {/* Apellido */}
            <div>
              <label style={lbl}>Apellido *</label>
              <input value={addForm.apellido} onChange={e => setAddForm(f => ({ ...f, apellido: e.target.value }))} placeholder="Apellido" style={inp} />
            </div>
            {/* Adultos */}
            <div>
              <label style={lbl}>Adultos</label>
              <input type="number" min={0} max={20} value={addForm.adultos} onChange={e => setAddForm(f => ({ ...f, adultos: Number(e.target.value) }))} style={numInp} />
            </div>
            {/* Niños */}
            <div>
              <label style={lbl}>Niños</label>
              <input type="number" min={0} max={20} value={addForm.ninos} onChange={e => setAddForm(f => ({ ...f, ninos: Number(e.target.value) }))} style={numInp} />
            </div>
          </div>

          {/* Acompañante de */}
          <div style={{ marginBottom: '16px' }}>
            <label style={lbl}>¿Es acompañante de? (dejar vacío si es invitado principal)</label>
            <select
              value={addForm.acompanante_de}
              onChange={e => setAddForm(f => ({ ...f, acompanante_de: e.target.value }))}
              style={{ ...inp, cursor: 'pointer' }}
            >
              <option value="">— Invitado principal —</option>
              {principales.map(p => (
                <option key={p.id} value={`${p.nombre} ${p.apellido}`}>
                  {p.nombre} {p.apellido}
                </option>
              ))}
            </select>
          </div>

          {addError && (
            <p style={{ fontFamily: 'Josefin Sans, sans-serif', fontSize: '0.72rem', color: '#7a3030', marginBottom: '10px' }}>
              ⚠ {addError}
            </p>
          )}

          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit" disabled={saving} style={{ ...btnGreen, padding: '10px 20px', fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              {saving ? 'Guardando...' : '✓ Guardar invitado'}
            </button>
            <button type="button" onClick={() => { setShowAdd(false); setAddError('') }} style={{ ...btnOutline, padding: '10px 14px' }}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* ── TABLA ─────────────────────────────────────────────── */}
      {loading ? (
        <p style={{ fontFamily: 'Josefin Sans, sans-serif', fontWeight: 300, fontSize: '0.8rem', color: 'var(--rifle)', textAlign: 'center', padding: '40px', opacity: 0.5 }}>
          Cargando...
        </p>
      ) : data.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px', opacity: 0.4 }}>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: '1.1rem', color: 'var(--rifle)' }}>
            Aún no hay confirmaciones.
          </p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '780px' }}>
            <thead>
              <tr>
                {['#', 'Nombre', 'Apellido', 'Acompañante de', 'Adultos', 'Niños', 'Total', 'Registrado', 'Acciones'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 12px', fontFamily: 'Josefin Sans, sans-serif', fontWeight: 400, fontSize: '0.52rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--sage)', borderBottom: '1px solid rgba(174,163,142,0.3)', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => {
                const esAcomp = !!row.acompanante_de
                return editId === row.id ? (
                  /* ── FILA EN EDICIÓN ── */
                  <tr key={row.id} style={{ background: 'rgba(234,215,160,0.12)' }}>
                    <td style={td}>{i + 1}</td>
                    <td style={td}><input value={editForm.nombre} onChange={e => setEditForm(f => ({ ...f, nombre: e.target.value }))} style={inp} /></td>
                    <td style={td}><input value={editForm.apellido} onChange={e => setEditForm(f => ({ ...f, apellido: e.target.value }))} style={inp} /></td>
                    <td style={td}>
                      <select value={editForm.acompanante_de} onChange={e => setEditForm(f => ({ ...f, acompanante_de: e.target.value }))} style={{ ...inp, cursor: 'pointer' }}>
                        <option value="">— Principal —</option>
                        {principales.filter(p => p.id !== row.id).map(p => (
                          <option key={p.id} value={`${p.nombre} ${p.apellido}`}>{p.nombre} {p.apellido}</option>
                        ))}
                      </select>
                    </td>
                    <td style={td}><input type="number" min={0} max={20} value={editForm.adultos} onChange={e => setEditForm(f => ({ ...f, adultos: Number(e.target.value) }))} style={numInp} /></td>
                    <td style={td}><input type="number" min={0} max={20} value={editForm.ninos} onChange={e => setEditForm(f => ({ ...f, ninos: Number(e.target.value) }))} style={numInp} /></td>
                    <td style={td}>{editForm.adultos + editForm.ninos}</td>
                    <td style={td}>{new Date(row.created_at).toLocaleDateString('es-MX')}</td>
                    <td style={{ ...td, whiteSpace: 'nowrap' }}>
                      <button onClick={saveEdit} disabled={saving} style={{ ...btnGreen, marginRight: '6px' }}>{saving ? '...' : '✓ Guardar'}</button>
                      <button onClick={() => setEditId(null)} style={btnOutline}>✕</button>
                    </td>
                  </tr>
                ) : (
                  /* ── FILA NORMAL ── */
                  <tr key={row.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(221,219,215,0.2)' }}>
                    <td style={td}>{i + 1}</td>
                    <td style={{ ...td, fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: '1rem', color: 'var(--rifle)', paddingLeft: esAcomp ? '24px' : '12px' }}>
                      {esAcomp && <span style={{ color: 'var(--sage)', marginRight: '6px', fontSize: '0.75rem' }}>↳</span>}
                      {row.nombre}
                    </td>
                    <td style={{ ...td, fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: '1rem', color: 'var(--rifle)' }}>{row.apellido}</td>
                    <td style={{ ...td, fontSize: '0.75rem', color: esAcomp ? 'var(--thyme)' : 'var(--grullo)' }}>
                      {row.acompanante_de
                        ? <span style={{ background: 'rgba(100,114,74,0.12)', padding: '2px 8px', borderRadius: '2px', border: '1px solid rgba(100,114,74,0.25)' }}>↳ {row.acompanante_de}</span>
                        : <span style={{ opacity: 0.4 }}>—</span>
                      }
                    </td>
                    <td style={{ ...td, textAlign: 'center' }}>{row.adultos ?? 1}</td>
                    <td style={{ ...td, textAlign: 'center' }}>{row.ninos ?? 0}</td>
                    <td style={{ ...td, textAlign: 'center', fontWeight: 600, color: 'var(--olive)' }}>{(row.adultos ?? 1) + (row.ninos ?? 0)}</td>
                    <td style={{ ...td, fontSize: '0.7rem', color: 'var(--grullo)' }}>{new Date(row.created_at).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td style={{ ...td, whiteSpace: 'nowrap' }}>
                      <button onClick={() => startEdit(row)} style={{ ...btnOutline, marginRight: '6px' }}>✏️ Editar</button>
                      <button onClick={() => handleDelete(row.id, row.nombre)} style={{ ...btnOutline, opacity: 0.65 }}>🗑️</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <div style={{ width: '60px', height: '1px', background: 'linear-gradient(to right, transparent, var(--grullo), transparent)', margin: '0 auto 10px' }} />
        <p style={{ fontFamily: 'Josefin Sans, sans-serif', fontWeight: 300, fontSize: '0.54rem', letterSpacing: '0.22em', color: 'var(--grullo)' }}>
          NAIM & SARAHÍ · 08 · 08 · 2026 · IBARRA, ECUADOR
        </p>
      </div>
    </main>
  )
}

const lbl: React.CSSProperties = {
  display: 'block', fontFamily: 'Josefin Sans, sans-serif', fontWeight: 400,
  fontSize: '0.52rem', letterSpacing: '0.2em', textTransform: 'uppercase',
  color: 'var(--sage)', marginBottom: '5px',
}
