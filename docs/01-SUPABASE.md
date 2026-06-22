# Supabase — Configuración de base de datos

## 1. Crear proyecto en Supabase

1. Ve a **https://supabase.com** → "New project"
2. Nombre del proyecto: `boda-naim-sarahi`
3. Contraseña de base de datos: guárdala bien
4. Región: elige la más cercana (US East o similar)
5. Espera ~2 minutos a que el proyecto se inicialice

---

## 2. Ejecutar el schema

1. Ve a **SQL Editor** → "New query"
2. Copia y pega el contenido de `supabase/migrations/001_schema.sql`
3. Haz clic en **Run**
4. Deberías ver: "Success. No rows returned"

---

## 3. Obtener las claves API

Ve a **Project Settings → API**:

| Variable | Dónde encontrarla |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | "Project URL" |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | "anon public" key |
| `SUPABASE_SERVICE_ROLE_KEY` | "service_role" key ⚠️ nunca expongas esta |

Copia estos 3 valores al archivo `.env.local`.

---

## 4. Configurar webhook para N8N (opcional)

Si ya tienes N8N corriendo en Railway:

1. Ejecuta `supabase/migrations/002_webhook_n8n.sql` en SQL Editor
2. Reemplaza la URL del webhook con la de tu instancia de N8N
3. Haz clic en **Run**

---

## 5. Ver registros en tiempo real

- **Panel admin**: ve a `http://localhost:3000/admin` (contraseña: `CONATO2519`)
- **Supabase directo**: Table Editor → `confirmaciones`
- **SQL rápido**: `SELECT * FROM confirmaciones ORDER BY created_at DESC;`
