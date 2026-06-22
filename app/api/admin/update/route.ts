import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function PUT(req: NextRequest) {
  if (req.cookies.get('admin_auth')?.value !== 'true')
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id, nombre, apellido, adultos, ninos, acompanante_de } = await req.json()
  if (!id || !nombre?.trim() || !apellido?.trim())
    return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })

  const { error } = await getSupabaseAdmin()
    .from('confirmaciones')
    .update({
      nombre:          nombre.trim(),
      apellido:        apellido.trim(),
      adultos:         Number(adultos) >= 0 ? Number(adultos) : 1,
      ninos:           Number(ninos)   >= 0 ? Number(ninos)   : 0,
      acompanante_de:  acompanante_de?.trim() || null,
    })
    .eq('id', id)

  if (error) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}
