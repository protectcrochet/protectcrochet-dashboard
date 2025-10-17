import { NextResponse, type NextRequest } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'
import z from 'zod'

const BodySchema = z.object({
  scoutId: z.string().uuid().optional(),
  url: z.string().url().optional(),
  domain: z.string().optional(),
  note: z.string().optional()
})

export async function POST(
  req: NextRequest,
  context: { params: { id: string } }   // ✅ firma válida para el 2º argumento
) {
  const { id: patternId } = context.params
  const body = BodySchema.parse(await req.json())
  const sb = supabaseServer()

  // crea el caso
  const { data: createdCase, error } = await sb
    .from('cases')
    .insert({
      account_id: (await sb.auth.getUser()).data.user?.id, // ajusta si usas otra FK
      pattern_id: patternId,
      title: 'Caso sin título',
      status: 'open'
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  // evidencia opcional
  if (body.url || body.domain || body.note || body.scoutId) {
    const { error: evErr } = await sb.from('case_evidences').insert({
      case_id: createdCase.id,
      source_url: body.url ?? null,
      source_domain: (body.domain ?? (body.url ? new URL(body.url).hostname.replace(/^www\./, '') : null)) ?? null,
      note: body.note ?? null,
      scout_id: body.scoutId ?? null
    })

    if (evErr) {
      return NextResponse.json(
        { case: createdCase, warning: 'Case created but evidence insert failed', detail: evErr.message },
        { status: 201 }
      )
    }
  }

  return NextResponse.json({ case: createdCase, message: '✅ Caso creado' }, { status: 201 })
}
