-- Agregar columnas de acompañantes a la tabla confirmaciones
-- Ejecutar en: Supabase → SQL Editor → New Query → Run

ALTER TABLE public.confirmaciones
  ADD COLUMN IF NOT EXISTS adultos INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS ninos   INTEGER NOT NULL DEFAULT 0;
