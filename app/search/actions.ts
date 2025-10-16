// app/search/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { supabaseServer } from '@/lib/supabase'
import type { ScoutSource } from '@/types/case-scouts'

export async function saveScoutAction(formData: FormData) {
  const keyword = String(formData.get('keyword') || '').trim()
  const source = String(formData.get('source') || 'other').trim() as ScoutSource
  const url = String(formData.get('url') || '').trim()
  const title = String(formData.get('title') || '').trim()
  const snapshot_url = String(formData.get('snapshot_url') || '').trim()

  if (!keyword) {
    return { ok: false, message: '⚠️ Falta keyword' }
  }

  const sb = await supabaseServer()

  const { data: { user }, error: userErr } = await sb.auth.getUser()
  if (userErr || !user) {
    return { ok: false, message: '⚠️ Debes iniciar sesión para guardar búsquedas.' }
  }

  // Obtener account_id del perfil
  const { data: profile, error: pErr } = await sb
    .from('profiles')
    .select('account_id')
    .eq('id', user.id)
    .single()

  if (pErr || !profile?.account_id) {
    return { ok: false, message: '⚠️ No se encontró cuenta vinculada.' }
  }

  const payload = {
    account_id: profile.account_id,
    user_id: user.id,
    created_by: user.id,            // 👈 agregado
    keyword,
    source,
    url: url || null,
    title: title || null,
    snapshot_url: snapshot_url || null,
    status: 'new' as const,
  }

  const { error: insErr } = await sb.from('case_scouts').insert(payload)
  if (insErr) {
    return { ok: false, message: `❌ Error: ${insErr.message}` }
  }

  revalidatePath('/dashboard')
  revalidatePath('/search')

  return { ok: true, message: '✅ Guardado en Scout correctamente.' }
}
