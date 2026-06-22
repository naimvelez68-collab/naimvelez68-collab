# Boda Naim & Sarahí — Instrucciones de configuración

## 1. Configurar Supabase (base de datos)

1. Ve a https://supabase.com y crea una cuenta gratuita
2. Crea un nuevo proyecto (guarda la contraseña del proyecto)
3. Espera a que el proyecto termine de inicializarse
4. Ve a **SQL Editor** y ejecuta este script:

```sql
create table confirmaciones (
  id bigserial primary key,
  nombre text not null,
  apellido text not null,
  opcion text not null default 'quiero_invitacion',
  created_at timestamptz not null default now()
);

-- Solo el backend puede leer/escribir (sin acceso público)
alter table confirmaciones enable row level security;

-- Política: nadie puede acceder directamente desde el frontend
-- (solo el service_role key del backend puede escribir)
create policy "service_role_only" on confirmaciones
  for all
  using (false);
```

5. Ve a **Project Settings → API** y copia:
   - `Project URL` → es tu NEXT_PUBLIC_SUPABASE_URL
   - `anon public` key → es tu NEXT_PUBLIC_SUPABASE_ANON_KEY
   - `service_role` key → es tu SUPABASE_SERVICE_ROLE_KEY (¡nunca la expongas!)

---

## 2. Configurar variables de entorno

Abre el archivo `.env.local` en la raíz del proyecto y reemplaza los valores:

```
NEXT_PUBLIC_SUPABASE_URL=https://tuproyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
ADMIN_PASSWORD=CONATO2519
```

---

## 3. Agregar la música

1. Descarga un archivo MP3 de música instrumental de boda (piano, cuerdas)
   - Sitio recomendado: https://pixabay.com/music/ → buscar "wedding piano"
2. Renómbralo exactamente como `music.mp3`
3. Colócalo en la carpeta `public/` del proyecto

---

## 4. Probar localmente

```bash
npm run dev
```

Abre http://localhost:3000 en tu navegador.

---

## 5. Desplegar en Vercel

### Opción A: Desde la terminal (más rápido)

```bash
npm install -g vercel
vercel
```

Sigue las instrucciones en pantalla. Cuando pregunte por variables de entorno, agrégalas.

### Opción B: Desde vercel.com (interfaz)

1. Ve a https://vercel.com y crea una cuenta
2. Conecta tu repositorio de GitHub (primero sube el proyecto a GitHub)
3. En Vercel, importa el proyecto
4. En la sección **Environment Variables**, agrega:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_PASSWORD`
5. Haz clic en Deploy

---

## 6. Subir a GitHub (si usas Opción B)

```bash
git init
git add .
git commit -m "Boda Naim & Sarahí - Save the Date"
git remote add origin https://github.com/tu-usuario/tu-repo.git
git push -u origin main
```

**IMPORTANTE:** El archivo `.env.local` NO se sube a GitHub (ya está en .gitignore).

---

## 7. Acceder al panel de administración

Una vez desplegado, ve a:

```
https://tu-dominio.vercel.app/admin
```

Contraseña: `CONATO2519`

En el panel verás:
- Contador de confirmaciones
- Tabla con nombre, apellido y fecha
- Botón para exportar CSV

---

## 8. Seguridad

- La contraseña NUNCA aparece en el código del navegador
- Se valida desde el servidor (API Route)
- La base de datos tiene Row Level Security activada
- Solo el `service_role` key (que solo está en el servidor) puede leer/escribir
- La sesión admin dura 8 horas y se maneja con cookie httpOnly

---

## 9. Estructura del proyecto

```
boda-naim-sarahi/
├── app/
│   ├── page.tsx          ← Página principal (hero + flujo)
│   ├── layout.tsx        ← Layout global
│   ├── globals.css       ← Estilos globales
│   ├── admin/
│   │   └── page.tsx      ← Panel administrativo
│   └── api/
│       ├── confirm/      ← Guarda confirmaciones
│       └── admin/
│           ├── login/    ← Valida contraseña admin
│           ├── logout/   ← Cierra sesión admin
│           └── data/     ← Retorna lista de confirmados
├── components/
│   ├── ConfirmForm.tsx
│   ├── DeclineMessage.tsx
│   ├── ThankYouMessage.tsx
│   ├── MusicButton.tsx
│   ├── WaxSeal.tsx
│   └── GoldDivider.tsx
├── lib/
│   └── supabase.ts       ← Cliente Supabase
├── public/
│   ├── couple.jpg        ← Foto de la pareja
│   └── music.mp3         ← (agregar manualmente)
└── .env.local            ← Variables de entorno (NO subir a git)
```
