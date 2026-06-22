import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  if (req.cookies.get('admin_auth')?.value !== 'true')
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { nombre, apellido, adultos, ninos } = await req.json()
  if (!nombre?.trim() || !apellido?.trim())
    return NextResponse.json({ error: 'Nombre y apellido requeridos' }, { status: 400 })

  const { error } = await getSupabaseAdmin()
    .from('confirmaciones')
    .insert([{
      nombre:   nombre.trim(),
      apellido: apellido.trim(),
      adultos:  Number(adultos) || 1,
      ninos:    Number(ninos)   || 0,
      opcion:   'quiero_invitacion',
    }])

  if (error) return NextResponse.json({ error: 'Error al agregar' }, { status: 500 })
  return NextResponse.json({ success: true })
}
