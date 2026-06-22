# Inicio rápido — Boda Naim & Sarahí

## Orden de configuración recomendado

```
1. Supabase  →  2. GitHub  →  3. Vercel  →  4. N8N (Railway)
```

---

## Paso 1 — Supabase (base de datos)
📄 Ver guía completa: `docs/01-SUPABASE.md`

- [ ] Crear proyecto en supabase.com
- [ ] Ejecutar `supabase/migrations/001_schema.sql`
- [ ] Copiar las 3 claves API al archivo `.env.local`

## Paso 2 — GitHub (código)
📄 Ver guía completa: `docs/02-GITHUB-VERCEL.md`

- [ ] `git init && git add . && git commit -m "Boda Naim & Sarahí"`
- [ ] Crear repositorio privado en github.com
- [ ] `git push`

## Paso 3 — Vercel (hosting público)
📄 Ver guía completa: `docs/02-GITHUB-VERCEL.md`

- [ ] Importar repo en vercel.com
- [ ] Agregar las 4 variables de entorno
- [ ] Deploy → obtener URL pública

## Paso 4 — N8N en Railway (notificaciones)
📄 Ver guía completa: `docs/03-N8N-RAILWAY.md`

- [ ] Crear proyecto N8N en railway.app
- [ ] Importar `n8n/workflow-notificacion.json`
- [ ] Configurar credenciales de email
- [ ] Ejecutar `supabase/migrations/002_webhook_n8n.sql` con la URL de N8N

---

## Accesos importantes

| Recurso | URL / Dato |
|---|---|
| **Página pública** | `https://tu-dominio.vercel.app` |
| **Panel admin** | `https://tu-dominio.vercel.app/admin` |
| **Contraseña admin** | `CONATO2519` |
| **Supabase** | `https://supabase.com/dashboard` |
| **N8N** | `https://TU-APP.up.railway.app` |
| **Local** | `http://localhost:3000` |

---

## Ver registros de invitados

**Desde el panel admin** (recomendado):
```
https://tu-dominio.vercel.app/admin
→ contraseña: CONATO2519
```

**Desde Supabase** (directo):
```sql
SELECT nombre, apellido, created_at
FROM confirmaciones
ORDER BY created_at DESC;
```

**Exportar a CSV**: botón en el panel admin ✓
