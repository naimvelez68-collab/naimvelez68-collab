import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

const SEP = '§'

export async function PUT(req: NextRequest) {
  if (req.cookies.get('admin_auth')?.value !== 'true')
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id, nombre, apellido, adultos, ninos, acompanante_de } = await req.json()
  if (!id || !nombre?.trim() || !apellido?.trim())
    return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })

  const nombreGuardado = acompanante_de?.trim()
    ? `${nombre.trim()}${SEP}${acompanante_de.trim()}`
    : nombre.trim()

  const ad = Number(adultos) >= 0 ? Number(adultos) : 1
  const ni = Number(ninos)   >= 0 ? Number(ninos)   : 0
  const apellidoGuardado = (ad !== 1 || ni !== 0)
    ? `${apellido.trim()}|${ad}|${ni}`
    : apellido.trim()

  const { error } = await getSupabaseAdmin()
    .from('confirmaciones')
    .update({ nombre: nombreGuardado, apellido: apellidoGuardado })
    .eq('id', id)

  if (error) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}
