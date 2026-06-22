import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function DELETE(req: NextRequest) {
  if (req.cookies.get('admin_auth')?.value !== 'true')
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 })

  const { error } = await getSupabaseAdmin()
    .from('confirmaciones')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 })
  return NextResponse.json({ success: true })
}
