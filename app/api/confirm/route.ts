import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { notifyPlanner } from '@/lib/notify-planner'

export async function POST(req: NextRequest) {
  try {
    const { nombre, apellido } = await req.json()

    if (!nombre?.trim() || !apellido?.trim()) {
      return NextResponse.json({ error: 'Nombre y apellido son requeridos' }, { status: 400 })
    }

    const { error } = await getSupabaseAdmin()
      .from('confirmaciones')
      .insert([
        {
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          opcion: 'quiero_invitacion',
          created_at: new Date().toISOString(),
        },
      ])

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Error al guardar' }, { status: 500 })
    }

    // Notify wedding planner in background (fire-and-forget)
    notifyPlanner(nombre.trim(), apellido.trim())

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
