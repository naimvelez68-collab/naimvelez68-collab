# Pasos para publicar la página — Solo necesitas hacer esto

## ANTES DE EMPEZAR: Crea estas 3 cuentas (todas gratis)
- **GitHub**: https://github.com → Sign up → usa asherlegalbranding@gmail.com
- **Supabase**: https://supabase.com → Sign up with GitHub
- **Vercel**: https://vercel.com → Sign up with GitHub

---

## PASO 1 — Supabase (base de datos) · 5 minutos

1. Entra a https://supabase.com → "New project"
2. Nombre: `boda-naim-sarahi` · Elige una contraseña · clic en "Create new project"
3. Espera 2 minutos a que cargue
4. Ve a **SQL Editor** (menú izquierdo)
5. Clic en **"New query"**
6. Copia TODO el texto de la carpeta `supabase/migrations/001_schema.sql` y pégalo ahí
7. Clic en **"Run"** → debe decir "Success"
8. Ve a **Project Settings → API** (ícono de engranaje)
9. Copia estos 3 datos en un bloc de notas:
   - `Project URL` (empieza con https://...)
   - `anon public` key (texto largo)
   - `service_role` key (texto largo, ¡mantén este secreto!)

---

## PASO 2 — Actualizar el archivo de claves · 2 minutos

Abre el archivo `.env.local` que está en esta carpeta y reemplaza:
```
NEXT_PUBLIC_SUPABASE_URL=PEGA_AQUI_TU_PROJECT_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=PEGA_AQUI_TU_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=PEGA_AQUI_TU_SERVICE_ROLE_KEY
ADMIN_PASSWORD=CONATO2519
```

---

## PASO 3 — Subir a GitHub · 3 minutos

1. Entra a https://github.com → clic en **"+"** (esquina superior derecha) → "New repository"
2. Nombre: `naim-sarahi-save-the-date`
3. Selecciona **Private** (para que nadie más vea el código)
4. Clic en **"Create repository"**
5. GitHub te mostrará comandos. Copia la URL que termina en `.git`
   Ejemplo: `https://github.com/TU-USUARIO/naim-sarahi-save-the-date.git`
6. Abre la terminal en esta carpeta y ejecuta:

```
git remote add origin https://github.com/TU-USUARIO/naim-sarahi-save-the-date.git
git push -u origin main
```

---

## PASO 4 — Publicar en Vercel · 5 minutos

1. Entra a https://vercel.com → "Add New..." → "Project"
2. Busca tu repositorio `naim-sarahi-save-the-date` → clic en "Import"
3. Antes de hacer Deploy, ve a **"Environment Variables"** y agrega:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Tu Project URL de Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Tu anon key de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Tu service role key de Supabase |
| `ADMIN_PASSWORD` | `CONATO2519` |

4. Clic en **"Deploy"** → espera 2 minutos
5. ¡Listo! Vercel te da una URL pública tipo `naim-sarahi.vercel.app`

---

## Resultado final

- 🌐 **Página pública** para invitados: `https://naim-sarahi.vercel.app`
- 🔐 **Panel admin** (ver quién se registró): `https://naim-sarahi.vercel.app/admin`
- 🔑 **Contraseña del panel**: `CONATO2519`

---

## Si algo no funciona

Escríbeme qué paso te falló y lo resolvemos.
