const PLANNER_WEBHOOK = 'https://naim-sarahi-wedding-planner.vercel.app/api/rsvp-webhook'
const SECRET = process.env.RSVP_WEBHOOK_SECRET ?? 'boda-naim-sarahi-2026'

export async function notifyPlanner(nombre: string, apellido: string) {
  try {
    await fetch(PLANNER_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-webhook-secret': SECRET },
      body: JSON.stringify({ nombre, apellido }),
    })
  } catch (e) {
    console.warn('[planner-notify] failed:', e)
  }
}
