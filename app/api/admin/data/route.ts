import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const authCookie = req.cookies.get('admin_auth')

  if (!authCookie || authCookie.value !== 'true') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { data, error } = await getSupabaseAdmin()
    .from('confirmaciones')
    .select('id, nombre, apellido, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: 'Error al obtener datos' }, { status: 500 })
  }

  return NextResponse.json({ data })
}
