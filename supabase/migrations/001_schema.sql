-- ═══════════════════════════════════════════════════════════════
-- BODA NAIM & SARAHÍ · Schema de base de datos
-- Ejecutar en: Supabase → SQL Editor → New Query → Run
-- ═══════════════════════════════════════════════════════════════

-- 1. Tabla principal de confirmaciones
CREATE TABLE IF NOT EXISTS public.confirmaciones (
  id          BIGSERIAL PRIMARY KEY,
  nombre      TEXT        NOT NULL CHECK (char_length(nombre) BETWEEN 1 AND 60),
  apellido    TEXT        NOT NULL CHECK (char_length(apellido) BETWEEN 1 AND 60),
  opcion      TEXT        NOT NULL DEFAULT 'quiero_invitacion'
                          CHECK (opcion IN ('quiero_invitacion', 'no_puede_asistir')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Índice para ordenar por fecha (el panel admin lo usa)
CREATE INDEX IF NOT EXISTS idx_confirmaciones_created_at
  ON public.confirmaciones (created_at DESC);

-- 3. Habilitar Row Level Security
ALTER TABLE public.confirmaciones ENABLE ROW LEVEL SECURITY;

-- 4. Política: nadie puede acceder directamente desde el cliente
--    Solo el service_role key del backend puede leer/escribir
CREATE POLICY "Acceso solo desde backend"
  ON public.confirmaciones
  FOR ALL
  USING (false);

-- 5. Vista para estadísticas rápidas (opcional, útil en el admin)
CREATE OR REPLACE VIEW public.resumen_confirmaciones AS
SELECT
  COUNT(*)                                              AS total,
  COUNT(*) FILTER (WHERE opcion = 'quiero_invitacion') AS quieren_invitacion,
  MIN(created_at)                                       AS primera_confirmacion,
  MAX(created_at)                                       AS ultima_confirmacion
FROM public.confirmaciones;
