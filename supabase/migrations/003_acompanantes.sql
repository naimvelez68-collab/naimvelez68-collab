-- ═══════════════════════════════════════════════════════════════
-- EJECUTAR EN SUPABASE → SQL Editor → New Query → Run
-- ═══════════════════════════════════════════════════════════════

-- Agregar columnas de acompañantes (si no existen)
ALTER TABLE public.confirmaciones
  ADD COLUMN IF NOT EXISTS adultos         INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS ninos           INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS acompanante_de  TEXT    DEFAULT NULL;

-- Actualizar registros existentes con valores por defecto
UPDATE public.confirmaciones
SET adultos = 1 WHERE adultos IS NULL;

UPDATE public.confirmaciones
SET ninos = 0 WHERE ninos IS NULL;
