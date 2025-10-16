// ================================================================
// FILE: app/api/patterns/[id]/cases/route.ts
// Next 15: await supabaseServer() + title NOT NULL
// ================================================================
import { NextResponse } from 'next/server'
import z from 'zod'
import { supabaseServer } from '@/lib/supabase/server'


const BodySchema = z.object({
  scoutId: z.string().uuid().optional(),
  url: z.string().url().optional(),
  domain: z.string().optional(),
  note: z.string().optional(),
})

function buildCaseTitle(url?: string | null, domain?: string | null) {
  const ts = new Date().toLocaleString('es-MX')
  if (domain) return `Detección en ${domain} — ${ts}`
  if (url) {
    try {
      const host = new URL(url).hostname
      return `Detección en ${host} — ${ts}`
    } catch {
      return `Detección — ${ts}`
    }
  }
  return `Detección — ${ts}`
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const sb = await supabaseServer()

  const { data: { user }, error: authErr } = await sb.auth.getUser()
  if (authErr || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: z.infer<typeof BodySchema>
  try {
    body = BodySchema.parse(await req.json())
  } catch (e: any) {
    return NextResponse.json({ error: 'Invalid body', detail: e?.message }, { status: 400 })
  }

  const patternId = params.id
  if (!patternId) return NextResponse.json({ error: 'Missing pattern id' }, { status: 400 })

  let resolvedUrl = body.url ?? undefined
  let resolvedDomain = body.domain ?? undefined

  if (body.scoutId) {
    const { data: scout, error: scoutErr } = await sb
      .from('case_scouts')
      .select('*')
      .eq('id', body.scoutId)
      .single()

    if (scoutErr || !scout) return NextResponse.json({ error: 'Scout not found' }, { status: 404 })
    if (scout.pattern_id && scout.pattern_id !== patternId)
      return NextResponse.json({ error: 'Scout belongs to a different pattern' }, { status: 400 })

    resolvedUrl = resolvedUrl ?? scout.url ?? undefined
    resolvedDomain = resolvedDomain ?? scout.domain ?? undefined
  }

  const title = buildCaseTitle(resolvedUrl ?? null, resolvedDomain ?? null)

  const { data: createdCase, error: caseErr } = await sb
    .from('cases')
    .insert({ pattern_id: patternId, title, status: 'open' })
    .select('*')
    .single()

  if (caseErr || !createdCase) {
    return NextResponse.json({ error: 'Failed to create case', detail: caseErr?.message }, { status: 500 })
  }

  if (resolvedUrl) {
    const { error: evErr } = await sb
      .from('cases_evidence')
      .insert({
        case_id: createdCase.id,
        evidence_type: 'url',
        url: resolvedUrl,
        source_domain: resolvedDomain ?? null,
        note: body.note ?? null,
      })
    if (evErr) {
      return NextResponse.json({
        case: createdCase,
        warning: 'Case created but evidence insert failed',
        detail: evErr.message,
      }, { status: 201 })
    }
  }

  return NextResponse.json({ case: createdCase, message: '✅ Caso creado correctamente' }, { status: 201 })
}
