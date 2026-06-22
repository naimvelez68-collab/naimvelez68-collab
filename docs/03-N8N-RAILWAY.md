# N8N en Railway — Notificaciones automáticas

## ¿Para qué sirve N8N aquí?

Cuando alguien confirme "Quiero mi invitación", N8N:
- ✅ Envía un **email automático** a los novios
- ✅ Puede enviar un **mensaje de WhatsApp** (si configuras Twilio o WhatsApp Business)
- ✅ Registra todo en un log

---

## 1. Desplegar N8N en Railway

1. Ve a **https://railway.app** → "New Project"
2. Busca la plantilla **N8N** y selecciónala
3. Configura estas variables de entorno en Railway:

| Variable | Valor |
|---|---|
| `N8N_BASIC_AUTH_ACTIVE` | `true` |
| `N8N_BASIC_AUTH_USER` | `admin` |
| `N8N_BASIC_AUTH_PASSWORD` | Elige una contraseña segura |
| `N8N_HOST` | Tu dominio de Railway (lo da Railway automáticamente) |
| `WEBHOOK_URL` | `https://TU-APP.up.railway.app/` |

4. Deploy → en ~3 minutos tendrás N8N corriendo

---

## 2. Importar el workflow

1. Abre N8N en tu URL de Railway
2. Ve a **Workflows → Import from File**
3. Selecciona el archivo `n8n/workflow-notificacion.json`
4. El workflow se importa listo

---

## 3. Configurar credenciales de email en N8N

1. En N8N → **Credentials → New**
2. Selecciona "Email (SMTP)"
3. Llena los datos de Gmail:
   - Host: `smtp.gmail.com`
   - Port: `587`
   - User: tu correo Gmail
   - Password: [App Password de Gmail](https://myaccount.google.com/apppasswords)
4. Guarda y asigna al nodo "Email a los novios"

---

## 4. Conectar Supabase con N8N

1. Copia la URL del webhook de N8N:
   `https://TU-APP.up.railway.app/webhook/boda-confirmacion`
2. Abre Supabase → SQL Editor
3. En el archivo `002_webhook_n8n.sql`, reemplaza la URL del webhook
4. Ejecuta el SQL → listo

---

## 5. Probar el flujo completo

1. Abre `http://localhost:3000`
2. Haz clic en "Abrir nuestra fecha" → "Quiero mi invitación"
3. Llena el formulario con un nombre de prueba
4. Revisa tu correo → deberías recibir la notificación ✓
5. Revisa el panel admin → deberías ver el registro ✓

---

## Flujo completo del sistema

```
Invitado confirma
      ↓
Next.js API Route (/api/confirm)
      ↓
Supabase (guarda el registro)
      ↓
Trigger SQL → Webhook HTTP
      ↓
N8N en Railway (recibe el evento)
      ↓
Email automático a los novios
      ↓
Panel /admin (los novios ven el registro)
```
