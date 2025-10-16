1) Backup your repo (optional)
2) Extract at repo root: unzip -o protectcrochet_patch.zip -d .
3) npm install && npm run build
4) Replace each stub with the real implementation.


# Sprint 3 – Alertas de Follow-up

## Edge Function `followup-notifier`
Ruta: `supabase/functions/followup-notifier/index.ts`

### Variables de entorno requeridas
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `NOTIFY_FROM` (opcional)
- `NOTIFY_REPLY_TO` (opcional)

### Deploy y programación (desde CLI de Supabase)
```
supabase functions deploy followup-notifier
supabase functions serve followup-notifier --no-verify-jwt # para test local
```
Programación (Scheduler desde Dashboard → Scheduled Functions):
- **Function**: `followup-notifier`
- **Cron**: cada 30 min (ej: `*/30 * * * *`)

## Acción manual desde el dashboard
- `sendManualReminder(caseId)` en `app/cases/actions.ts`
- Botón en detalle del caso: `components/RemindNowButton.tsx`
