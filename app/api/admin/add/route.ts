import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { notifyPlanner } from '@/lib/notify-planner'

// Separador especial para codificar "acompañante de" en el campo nombre
// Usamos § (U+00A7) que nunca aparece en nombres reales
const SEP = '§'

export async function POST(req: NextRequest) {
  if (req.cookies.get('admin_auth')?.value !== 'true')
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { nombre, apellido, adultos, ninos, acompanante_de } = await req.json()
  if (!nombre?.trim() || !apellido?.trim())
    return NextResponse.json({ error: 'Nombre y apellido requeridos' }, { status: 400 })

  // Si tiene acompañante_de, lo codificamos en el nombre usando §
  // Ejemplo: "María§Juan Pérez" significa "María, acompañante de Juan Pérez"
  const nombreGuardado = acompanante_de?.trim()
    ? `${nombre.trim()}${SEP}${acompanante_de.trim()}`
    : nombre.trim()

  // Guardar adultos y niños en el apellido con separador si vienen con valores distintos
  // Formato: "García|2|1" = apellido García, 2 adultos, 1 niño
  // Solo codificamos si los valores no son los defaults (1 adulto, 0 niños)
  const ad = Number(adultos) >= 0 ? Number(adultos) : 1
  const ni = Number(ninos)   >= 0 ? Number(ninos)   : 0
  const apellidoGuardado = (ad !== 1 || ni !== 0)
    ? `${apellido.trim()}|${ad}|${ni}`
    : apellido.trim()

  const { error } = await getSupabaseAdmin()
    .from('confirmaciones')
    .insert([{
      nombre:    nombreGuardado,
      apellido:  apellidoGuardado,
      opcion:   'quiero_invitacion',
    }])

  if (error) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Only notify planner for main guests (not companions)
  if (!acompanante_de?.trim()) {
    notifyPlanner(nombre.trim(), apellido.trim())
  }

  return NextResponse.json({ success: true })
}
