// /app/scouts/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { supabaseServer } from '@/lib/supabase/server'

function domainFromUrl(raw?: string | null) {
  try {
    if (!raw) return null
    const u = new URL(raw)
    return u.hostname.replace(/^www\./, '')
  } catch { return null }
}

export async function convertScout(formData: FormData) {
  const scoutId = String(formData.get('scoutId') || '')
  if (!scoutId) return

  const sb = await supabaseServer()

  // 1) obtener scout
  const { data: scout, error: e1 } = await sb
    .from('case_scouts')
    .select('id, account_id, created_by, title, url, source, status')
    .eq('id', scoutId)
    .single()

  if (e1 || !scout) {
    console.error('convertScout: no scout', e1?.message)
    return
  }

  // 2) asegurar account
  let accountId = scout.account_id as string | null
  if (!accountId) {
    const { data: { user } } = await sb.auth.getUser()
    if (!user) return
    const { data: member } = await sb
      .from('members')
      .select('account_id')
      .eq('user_id', user.id)
      .maybeSingle()
    accountId = member?.account_id ?? null
  }
  if (!accountId) return

  // 3) crear case (ajusta campos según tu tabla)
  const insert = {
    account_id: accountId,
    created_by: scout.created_by ?? null,
    title: scout.title ?? 'Caso desde scouting',
    url: scout.url ?? null,
    domain: domainFromUrl(scout.url),
    status: 'open',
    priority: 'medium',
  } as any

  const { data: inserted, error: e2 } = await sb
    .from('cases')
    .insert(insert)
    .select('id')
    .single()

  if (e2) {
    console.error('convertScout: insert case error', e2.message)
    return
  }

  // 4) marcar scout como revisado y vincular
  await sb
    .from('case_scouts')
    .update({ status: 'reviewed', linked_case_id: inserted.id })
    .eq('id', scoutId)

  revalidatePath('/scouts')
  revalidatePath('/dashboard')
}
