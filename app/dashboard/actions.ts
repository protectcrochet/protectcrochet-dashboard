// /app/dashboard/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAction } from '@/lib/supabase/action'

type CaseStatus = 'new' | 'in_progress' | 'closed'

type ActionResult<T = unknown> =
  | { ok: true; data?: T; message?: string }
  | { ok: false; error: string }

async function assertStaff() {
  const sb = supabaseAction()
  const { data: role, error } = await sb.rpc('get_my_role')
  if (error) return { ok: false as const, error: 'No se pudo verificar el rol.' }
  if (role !== 'staff' && role !== 'admin') {
    return { ok: false as const, error: 'Acceso denegado (solo Staff/Admin).' }
  }
  return { ok: true as const, sb }
}

/**
 * Promueve un scout a caso:
 * - Verifica rol (staff/admin)
 * - Lee el scout
 * - Determina patternId (formData.patternId o scout.pattern_id)
 * - Crea el caso
 * - Inserta evidencia inicial (url/domain) si existe
 * - Marca promoted_at (idempotente)
 */
export async function promoteScoutAction(
  _prevState: unknown,
  formData: FormData
): Promise<ActionResult<{ caseId: string }>> {
  const check = await assertStaff()
  if (!check.ok) return check
  const sb = check.sb

  const scoutId = String(formData.get('scoutId') ?? '').trim()
  const patternIdFromForm = String(formData.get('patternId') ?? '').trim()

  if (!scoutId) return { ok: false, error: 'Falta scoutId.' }

  const { data: scout, error: scoutErr } = await sb
    .from('case_scouts')
    .select('id, title, url, domain, promoted_at, pattern_id')
    .eq('id', scoutId)
    .single()

  if (scoutErr || !scout) return { ok: false, error: 'Scout no encontrado.' }
  if (scout.promoted_at) return { ok: false, error: 'Este scout ya fue promovido.' }

  const finalPatternId = patternIdFromForm || scout.pattern_id || ''
  if (!finalPatternId) return { ok: false, error: 'Falta patternId.' }

  const title =
    scout.title?.trim()
      ? `Infracción en ${scout.domain ?? 'sitio'} — ${scout.title}`
      : `Infracción en ${scout.domain ?? 'sitio'} — Detección`

  const { data: newCase, error: caseErr } = await sb
    .from('cases')
    .insert({ title, status: 'new', pattern_id: finalPatternId })
    .select('id')
    .single()

  if (caseErr || !newCase) return { ok: false, error: 'No se pudo crear el caso.' }

  // Evidencia inicial (best-effort)
  if (scout.url || scout.domain) {
    const { error: evErr } = await sb.from('cases_evidence').insert({
      case_id: newCase.id,
      kind: 'url',
      url: scout.url ?? null,
      domain: scout.domain ?? null,
      note: 'Evidencia inicial desde Scout',
    })
    if (evErr) {
      // No bloqueamos el flujo si la evidencia falla
      console.warn('[cases_evidence] insert error:', evErr.message)
    }
  }

  // Marcamos promoted_at de forma idempotente
  const { error: upErr } = await sb
    .from('case_scouts')
    .update({ promoted_at: new Date().toISOString() })
    .eq('id', scout.id)
    .is('promoted_at', null)

  if (upErr) {
    console.warn('[case_scouts] promoted_at update error:', upErr.message)
  }

  revalidatePath('/dashboard/staff')
  return { ok: true, data: { caseId: newCase.id }, message: 'Scout promovido a caso.' }
}

/**
 * Cambia el estatus de un caso (solo Staff/Admin)
 */
export async function changeCaseStatusAction(
  _prevState: unknown,
  formData: FormData
): Promise<ActionResult> {
  const check = await assertStaff()
  if (!check.ok) return check
  const sb = check.sb

  const caseId = String(formData.get('caseId') ?? '').trim()
  const status = String(formData.get('status') ?? 'new').trim() as CaseStatus

  if (!caseId) return { ok: false, error: 'Falta caseId.' }
  if (!['new', 'in_progress', 'closed'].includes(status)) {
    return { ok: false, error: 'Estatus inválido.' }
  }

  const { error } = await sb.from('cases').update({ status }).eq('id', caseId)
  if (error) return { ok: false, error: 'No se pudo actualizar el estatus.' }

  revalidatePath('/dashboard/staff')
  return { ok: true, message: 'Estatus actualizado.' }
}
