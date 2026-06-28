import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

const SECRET = process.env.RSVP_WEBHOOK_SECRET ?? 'boda-naim-sarahi-2026'

// Returns all confirmed main guests — called by the wedding planner for full sync
export async function GET(req: NextRequest) {
  if (req.headers.get('x-webhook-secret') !== SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await getSupabaseAdmin()
    .from('confirmaciones')
    .select('nombre, apellido')
    .eq('opcion', 'quiero_invitacion')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Exclude companions (raw nombre contains § = encoded as "nombre§acompañante-de")
  const mainGuests = (data ?? [])
    .filter((r) => !r.nombre.includes('§'))
    .map((r) => ({
      nombre:   r.nombre.trim(),
      apellido: r.apellido.split('|')[0].trim(),
    }))

  return NextResponse.json({ guests: mainGuests, total: mainGuests.length })
}
