-- ================================================================
-- FILE: supabase/migrations/optional_ajustes.sql
-- Ajustes opcionales para defaults y trigger de cases
-- ================================================================

-- Default para status = 'open'
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cases' AND column_name = 'status'
  ) THEN
    EXECUTE 'ALTER TABLE public.cases ALTER COLUMN status SET DEFAULT ''open''';
  END IF;
END $$;

-- Trigger para llenar created_by automáticamente (si se requiere)
-- CREATE OR REPLACE FUNCTION public.trg_fill_cases_user() RETURNS trigger AS $$
-- BEGIN
--   IF NEW.created_by IS NULL THEN NEW.created_by := auth.uid(); END IF;
--   RETURN NEW;
-- END; $$ LANGUAGE plpgsql SECURITY DEFINER;
-- DROP TRIGGER IF EXISTS trg_fill_cases_user ON public.cases;
-- CREATE TRIGGER trg_fill_cases_user BEFORE INSERT ON public.cases FOR EACH ROW EXECUTE FUNCTION public.trg_fill_cases_user();
