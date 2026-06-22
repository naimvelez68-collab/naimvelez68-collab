-- ═══════════════════════════════════════════════════════════════
-- WEBHOOK hacia N8N — se ejecuta DESPUÉS de 001_schema.sql
-- Ejecutar en: Supabase → SQL Editor → New Query → Run
--
-- Este trigger llama al webhook de N8N cada vez que alguien
-- confirma "Quiero mi invitación", para que N8N envíe
-- una notificación automática a los novios.
-- ═══════════════════════════════════════════════════════════════

-- Habilitar extensión HTTP (necesaria para llamar al webhook)
CREATE EXTENSION IF NOT EXISTS http WITH SCHEMA extensions;

-- Función que dispara el webhook a N8N
CREATE OR REPLACE FUNCTION public.notificar_n8n()
RETURNS TRIGGER AS $$
DECLARE
  payload JSONB;
BEGIN
  -- Solo notifica cuando alguien quiere la invitación
  IF NEW.opcion = 'quiero_invitacion' THEN
    payload := jsonb_build_object(
      'evento',    'nueva_confirmacion',
      'id',        NEW.id,
      'nombre',    NEW.nombre,
      'apellido',  NEW.apellido,
      'fecha',     NEW.created_at,
      'total',     (SELECT COUNT(*) FROM public.confirmaciones WHERE opcion = 'quiero_invitacion')
    );

    -- Llamada HTTP POST al webhook de N8N
    -- REEMPLAZA esta URL con la URL real de tu webhook en N8N
    PERFORM extensions.http_post(
      'https://TU-N8N-EN-RAILWAY.up.railway.app/webhook/boda-confirmacion',
      payload::text,
      'application/json'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger que se activa en cada INSERT
DROP TRIGGER IF EXISTS trigger_notificar_n8n ON public.confirmaciones;
CREATE TRIGGER trigger_notificar_n8n
  AFTER INSERT ON public.confirmaciones
  FOR EACH ROW
  EXECUTE FUNCTION public.notificar_n8n();
