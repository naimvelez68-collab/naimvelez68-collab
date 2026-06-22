# GitHub + Vercel — Deploy automático

## 1. Subir el proyecto a GitHub

En tu terminal, dentro de la carpeta del proyecto:

```bash
git init
git add .
git commit -m "Boda Naim & Sarahí — Save the Date"
```

Luego en **github.com**:
1. "New repository" → nombre: `boda-naim-sarahi` → **Private** ✓
2. Copia los comandos que GitHub te da y ejecútalos en tu terminal

---

## 2. Conectar con Vercel

### Opción A — Desde vercel.com (más fácil)

1. Ve a **https://vercel.com** → "Add New Project"
2. Importa el repositorio `boda-naim-sarahi` desde GitHub
3. En **Environment Variables**, agrega las 4 variables:

| Nombre | Valor |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Tu URL de Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Tu anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Tu service role key |
| `ADMIN_PASSWORD` | `CONATO2519` |

4. Haz clic en **Deploy** → en 2 minutos tendrás la URL pública

### Opción B — GitHub Actions automático

1. En Vercel → Settings → Tokens → "Create Token" → cópialo
2. En tu repo de GitHub → Settings → Secrets and variables → Actions:
   - `VERCEL_TOKEN` = el token de Vercel
   - `VERCEL_ORG_ID` = en Vercel → Settings → General → "Team ID"
   - `VERCEL_PROJECT_ID` = en Vercel → tu proyecto → Settings → General → "Project ID"
3. A partir de ahora, cada `git push` a `main` despliega automáticamente ✓

---

## 3. Configurar dominio personalizado (opcional)

En Vercel → tu proyecto → **Domains**:
- Agrega tu dominio, ej: `naim-sarahi.com`
- Vercel te da los DNS records para configurar en tu registrador

---

## 4. Ver quiénes se registran

- **URL pública**: `https://tu-dominio.vercel.app/admin`
- **Contraseña**: `CONATO2519`
- Los invitados que confirmen aparecen en tiempo real
