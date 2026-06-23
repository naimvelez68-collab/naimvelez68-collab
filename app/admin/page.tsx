'use client'

import { useState, useEffect, useCallback } from 'react'

/* ── Codificación en campos existentes ──────────────────────
   nombre:   "María§Juan Pérez"  → nombre=María, acomp_de=Juan Pérez
   apellido: "García|2|1"        → apellido=García, adultos=2, ninos=1
   Registros de invitados propios (sin §) no se tocan.
──────────────────────────────────────────────────────────── */
const SEP_ACOMP = '§'
const SEP_NUM   = '|'

interface RawConfirmacion {
  id: number
  nombre: string
  apellido: string
  created_at: string
}

interface Fila {
  id: number
  nombre: string
  apellido: string
  adultos: number
  ninos: number
  acompanante_de: string
  created_at: string
}

function decodificar(raw: RawConfirmacion): Fila {
  // Decodificar nombre
  const [nombre, acompanante_de = ''] = raw.nombre.split(SEP_ACOMP)

  // Decodificar apellido
  const parts = raw.apellido.split(SEP_NUM)
  const apellido = parts[0]
  const adultos  = parts.length >= 3 ? Number(parts[1]) : 1
  const ninos    = parts.length >= 3 ? Number(parts[2]) : 0

  return { id: raw.id, nombre, apellido, adultos, ninos, acompanante_de, created_at: raw.created_at }
}

interface FormState {
  nombre: string
  apellido: string
  adultos: number
  ninos: number
  acompanante_de: string
}

const EMPTY: FormState = { nombre: '', apellido: '', adultos: 1, ninos: 0, acompanante_de: '' }

/* ── Estilos ────────────────────────────────────────────── */
const inp: React.CSSProperties = {
  background: 'rgba(255,255,255,0.65)', border: '1px solid rgba(174,163,142,0.45)',
  borderRadius: 0, padding: '8px 10px', fontFamily: 'Josefin Sans, sans-serif',
  fontWeight: 300, fontSize: '0.82rem', color: 'var(--rifle)', outline: 'none', width: '100%',
}
const numInp: React.CSSProperties = { ...inp, width: '64px', textAlign: 'center', padding: '8px 4px' }
const td: React.CSSProperties = {
  padding: '10px 12px', fontFamily: 'Josefin Sans, sans-serif', fontWeight: 300,
  fontSize: '0.8rem', color: 'var(--dark-brown)',
  borderBottom: '1px solid rgba(174,163,142,0.12)', verticalAlign: 'middle',
}
const btnGreen: React.CSSProperties = {
  background: 'var(--olive)', border: 'none', color: '#FAF8F4',
  fontFamily: 'Josefin Sans, sans-serif', fontSize: '0.58rem',
  letterSpacing: '0.1em', padding: '6px 12px', cursor: 'pointer', borderRadius: '2px',
}
const btnOut: React.CSSProperties = {
  background: 'transparent', border: '1px solid rgba(174,163,142,0.45)', color: 'var(--rifle)',
  fontFamily: 'Josefin Sans, sans-serif', fontSize: '0.58rem',
  padding: '6px 10px', cursor: 'pointer', borderRadius: '2px',
}
const lbl: React.CSSProperties = {
  display: 'block', fontFamily: 'Josefin Sans, sans-serif', fontWeight: 400,
  fontSize: '0.52rem', letterSpacing: '0.2em', textTransform: 'uppercase',
  color: 'var(--sage)', marginBottom: '5px',
}

export default function AdminPage() {
  const [view,    setView]    = useState<'login' | 'dashboard'>('login')
  const [pass,    setPass]    = useState('')
  const [loginErr,setLoginErr]= useState('')
  const [logging, setLogging] = useState(false)
  const [rows,    setRows]    = useState<Fila[]>([])
  const [loading, setLoading] = useState(false)
  const [saving,  setSaving]  = useState(false)
  const [editId,  setEditId]  = useState<number | null>(null)
  const [editForm,setEditForm]= useState<FormState>(EMPTY)
  const [showAdd, setShowAdd] = useState(false)
  const [addForm, setAddForm] = useState<FormState>(EMPTY)
  const [addErr,  setAddErr]  = useState('')

  // Invitados principales (sin acompañante) para el dropdown
  const principales = rows.filter(r => !r.acompanante_de)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/data')
    if (res.status === 401) { setView('login'); setLoading(false); return }
    const json = await res.json()
    setRows((json.data || []).map(decodificar))
    setLoading(false)
  }, [])

  useEffect(() => { if (view === 'dashboard') fetchData() }, [view, fetchData])

  /* Login */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setLogging(true); setLoginErr('')
    const res = await fetch('/api/admin/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pass }),
    })
    if (!res.ok) { setLoginErr('Contraseña incorrecta.'); setLogging(false); return }
    setView('dashboard')
  }

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    setView('login'); setPass(''); setRows([])
  }

  /* Agregar */
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!addForm.nombre.trim() || !addForm.apellido.trim()) { setAddErr('Nombre y apellido requeridos'); return }
    setSaving(true); setAddErr('')
    const res = await fetch('/api/admin/add', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(addForm),
    })
    const json = await res.json()
    if (!res.ok) { setAddErr(json.error || 'Error al guardar'); setSaving(false); return }
    setAddForm(EMPTY); setShowAdd(false); setSaving(false); fetchData()
  }

  /* Editar */
  const startEdit = (row: Fila) => {
    setEditId(row.id)
    setEditForm({ nombre: row.nombre, apellido: row.apellido, adultos: row.adultos, ninos: row.ninos, acompanante_de: row.acompanante_de })
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
    if (!confirm(`¿Eliminar a ${nombre}?`)) return
    await fetch('/api/admin/delete', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    fetchData()
  }

  /* CSV */
  const exportCSV = () => {
    const h = ['#', 'Nombre', 'Apellido', 'Acompañante de', 'Adultos', 'Niños', 'Total', 'Fecha']
    const r = rows.map((r, i) => [i + 1, r.nombre, r.apellido, r.acompanante_de || '—', r.adultos, r.ninos, r.adultos + r.ninos, new Date(r.created_at).toLocaleString('es-MX')])
    const csv = [h, ...r].map(x => x.join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' }))
    a.download = `invitados-${new Date().toISOString().slice(0, 10)}.csv`; a.click()
  }

  const totA = rows.reduce((s, r) => s + r.adultos, 0)
  const totN = rows.reduce((s, r) => s + r.ninos, 0)

  /* ── LOGIN ────────────────────────────────────────────── */
  if (view === 'login') return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--ecru)', padding: '16px' }}>
      <div style={{ width: '100%', maxWidth: '360px', background: 'var(--cream)', border: '1px solid rgba(174,163,142,0.3)', boxShadow: '0 8px 40px rgba(83,88,62,0.10)', padding: '44px 36px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'Josefin Sans, sans-serif', fontWeight: 300, fontSize: '0.56rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--sage)', marginBottom: '10px' }}>Panel Administrativo</p>
        <h1 style={{ fontFamily: 'Pinyon Script, cursive', fontSize: '2.4rem', color: 'var(--rifle)', marginBottom: '28px' }}>Naim & Sarahí</h1>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Contraseña" style={{ ...inp, textAlign: 'center', padding: '12px' }} />
          {loginErr && <p style={{ fontFamily: 'Josefin Sans, sans-serif', fontSize: '0.72rem', color: '#7a3030' }}>{loginErr}</p>}
          <button type="submit" disabled={logging} style={{ ...btnGreen, padding: '14px', fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            {logging ? 'Verificando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </main>
  )

  /* ── DASHBOARD ────────────────────────────────────────── */
  return (
    <main style={{ minHeight: '100vh', background: 'var(--ecru)', padding: 'clamp(16px,4vw,36px)' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <p style={{ fontFamily: 'Josefin Sans, sans-serif', fontSize: '0.54rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--sage)', marginBottom: '4px' }}>Panel Administrativo</p>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontStyle: 'italic', fontSize: 'clamp(1.4rem,4vw,2rem)', color: 'var(--rifle)' }}>Naim & Sarahí · 08 · 08 · 2026</h1>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button onClick={() => { setShowAdd(!showAdd); setAddErr('') }} style={{ ...btnGreen, padding: '10px 18px', fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>+ Agregar invitado</button>
          <button onClick={exportCSV} disabled={!rows.length} style={{ ...btnOut, padding: '10px 16px', fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', opacity: rows.length ? 1 : 0.4 }}>Exportar CSV</button>
          <button onClick={handleLogout} style={{ ...btnOut, padding: '10px 14px', fontSize: '0.6rem', opacity: 0.55 }}>Salir</button>
        </div>
      </div>

      <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(174,163,142,0.5), transparent)', marginBottom: '20px' }} />

      {/* Contadores */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '22px', flexWrap: 'wrap' }}>
        {[{ label: 'Total personas', value: totA + totN, color: 'var(--olive)' }, { label: 'Adultos', value: totA, color: 'var(--thyme)' }, { label: 'Niños', value: totN, color: 'var(--sage)' }, { label: 'Registros', value: rows.length, color: 'var(--grullo)' }].map(c => (
          <div key={c.label} style={{ background: 'var(--cream)', border: '1px solid rgba(174,163,142,0.25)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: '2rem', color: c.color, lineHeight: 1 }}>{loading ? '—' : c.value}</span>
            <span style={{ fontFamily: 'Josefin Sans, sans-serif', fontWeight: 300, fontSize: '0.62rem', color: 'var(--dark-brown)', lineHeight: 1.4 }}>{c.label}</span>
          </div>
        ))}
      </div>

      {/* Formulario agregar */}
      {showAdd && (
        <form onSubmit={handleAdd} style={{ background: 'var(--cream)', border: '1px solid rgba(174,163,142,0.3)', borderLeft: '3px solid var(--olive)', padding: '20px 22px', marginBottom: '20px' }}>
          <p style={{ fontFamily: 'Josefin Sans, sans-serif', fontWeight: 400, fontSize: '0.56rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--olive)', marginBottom: '16px' }}>Agregar invitado manualmente</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '12px' }}>
            <div><label style={lbl}>Nombre *</label><input value={addForm.nombre} onChange={e => setAddForm(f => ({ ...f, nombre: e.target.value }))} placeholder="Nombre" style={inp} /></div>
            <div><label style={lbl}>Apellido *</label><input value={addForm.apellido} onChange={e => setAddForm(f => ({ ...f, apellido: e.target.value }))} placeholder="Apellido" style={inp} /></div>
            <div><label style={lbl}>Adultos</label><input type="number" min={0} max={20} value={addForm.adultos} onChange={e => setAddForm(f => ({ ...f, adultos: Number(e.target.value) }))} style={numInp} /></div>
            <div><label style={lbl}>Niños</label><input type="number" min={0} max={20} value={addForm.ninos} onChange={e => setAddForm(f => ({ ...f, ninos: Number(e.target.value) }))} style={numInp} /></div>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={lbl}>¿Es acompañante de? — dejar vacío si es invitado principal</label>
            <select value={addForm.acompanante_de} onChange={e => setAddForm(f => ({ ...f, acompanante_de: e.target.value }))} style={{ ...inp, cursor: 'pointer' }}>
              <option value="">— Invitado principal —</option>
              {principales.map(p => <option key={p.id} value={`${p.nombre} ${p.apellido}`}>{p.nombre} {p.apellido}</option>)}
            </select>
          </div>
          {addErr && <p style={{ fontFamily: 'Josefin Sans, sans-serif', fontSize: '0.72rem', color: '#7a3030', marginBottom: '10px' }}>⚠ {addErr}</p>}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit" disabled={saving} style={{ ...btnGreen, padding: '10px 20px', fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>{saving ? 'Guardando...' : '✓ Guardar invitado'}</button>
            <button type="button" onClick={() => { setShowAdd(false); setAddErr('') }} style={{ ...btnOut, padding: '10px 14px' }}>Cancelar</button>
          </div>
        </form>
      )}

      {/* Tabla */}
      {loading ? (
        <p style={{ fontFamily: 'Josefin Sans, sans-serif', fontWeight: 300, fontSize: '0.8rem', color: 'var(--rifle)', textAlign: 'center', padding: '40px', opacity: 0.5 }}>Cargando...</p>
      ) : rows.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px', opacity: 0.4 }}>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: '1.1rem', color: 'var(--rifle)' }}>Aún no hay confirmaciones.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '780px' }}>
            <thead>
              <tr>
                {['#', 'Nombre', 'Apellido', 'Acompañante de', 'Adultos', 'Niños', 'Total', 'Registrado', 'Acciones'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 12px', fontFamily: 'Josefin Sans, sans-serif', fontWeight: 400, fontSize: '0.52rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--sage)', borderBottom: '1px solid rgba(174,163,142,0.3)', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                const esAcomp = !!row.acompanante_de
                return editId === row.id ? (
                  <tr key={row.id} style={{ background: 'rgba(234,215,160,0.12)' }}>
                    <td style={td}>{i + 1}</td>
                    <td style={td}><input value={editForm.nombre} onChange={e => setEditForm(f => ({ ...f, nombre: e.target.value }))} style={inp} /></td>
                    <td style={td}><input value={editForm.apellido} onChange={e => setEditForm(f => ({ ...f, apellido: e.target.value }))} style={inp} /></td>
                    <td style={td}>
                      <select value={editForm.acompanante_de} onChange={e => setEditForm(f => ({ ...f, acompanante_de: e.target.value }))} style={{ ...inp, cursor: 'pointer' }}>
                        <option value="">— Principal —</option>
                        {rows.filter(p => p.id !== row.id && !p.acompanante_de).map(p => <option key={p.id} value={`${p.nombre} ${p.apellido}`}>{p.nombre} {p.apellido}</option>)}
                      </select>
                    </td>
                    <td style={td}><input type="number" min={0} max={20} value={editForm.adultos} onChange={e => setEditForm(f => ({ ...f, adultos: Number(e.target.value) }))} style={numInp} /></td>
                    <td style={td}><input type="number" min={0} max={20} value={editForm.ninos} onChange={e => setEditForm(f => ({ ...f, ninos: Number(e.target.value) }))} style={numInp} /></td>
                    <td style={td}>{editForm.adultos + editForm.ninos}</td>
                    <td style={td}>{new Date(row.created_at).toLocaleDateString('es-MX')}</td>
                    <td style={{ ...td, whiteSpace: 'nowrap' }}>
                      <button onClick={saveEdit} disabled={saving} style={{ ...btnGreen, marginRight: '6px' }}>{saving ? '...' : '✓ Guardar'}</button>
                      <button onClick={() => setEditId(null)} style={btnOut}>✕</button>
                    </td>
                  </tr>
                ) : (
                  <tr key={row.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(221,219,215,0.2)' }}>
                    <td style={td}>{i + 1}</td>
                    <td style={{ ...td, fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: '1rem', color: 'var(--rifle)', paddingLeft: esAcomp ? '28px' : '12px' }}>
                      {esAcomp && <span style={{ color: 'var(--sage)', marginRight: '6px', fontSize: '0.8rem' }}>↳</span>}
                      {row.nombre}
                    </td>
                    <td style={{ ...td, fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: '1rem', color: 'var(--rifle)' }}>{row.apellido}</td>
                    <td style={{ ...td, fontSize: '0.75rem' }}>
                      {row.acompanante_de
                        ? <span style={{ background: 'rgba(100,114,74,0.12)', padding: '3px 8px', border: '1px solid rgba(100,114,74,0.25)', color: 'var(--thyme)', borderRadius: '2px' }}>↳ {row.acompanante_de}</span>
                        : <span style={{ color: 'var(--grullo)', opacity: 0.4 }}>—</span>}
                    </td>
                    <td style={{ ...td, textAlign: 'center' }}>{row.adultos}</td>
                    <td style={{ ...td, textAlign: 'center' }}>{row.ninos}</td>
                    <td style={{ ...td, textAlign: 'center', fontWeight: 600, color: 'var(--olive)' }}>{row.adultos + row.ninos}</td>
                    <td style={{ ...td, fontSize: '0.7rem', color: 'var(--grullo)' }}>{new Date(row.created_at).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td style={{ ...td, whiteSpace: 'nowrap' }}>
                      <button onClick={() => startEdit(row)} style={{ ...btnOut, marginRight: '6px' }}>✏️ Editar</button>
                      <button onClick={() => handleDelete(row.id, row.nombre)} style={{ ...btnOut, opacity: 0.65 }}>🗑️</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <div style={{ width: '60px', height: '1px', background: 'linear-gradient(to right, transparent, var(--grullo), transparent)', margin: '0 auto 10px' }} />
        <p style={{ fontFamily: 'Josefin Sans, sans-serif', fontWeight: 300, fontSize: '0.54rem', letterSpacing: '0.22em', color: 'var(--grullo)' }}>NAIM & SARAHÍ · 08 · 08 · 2026 · IBARRA, ECUADOR</p>
      </div>
    </main>
  )
}
