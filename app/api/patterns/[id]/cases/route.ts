// app/api/patterns/[id]/cases/route.ts
import { NextResponse } from 'next/server'
// Si tienes este helper, úsalo. Si no, cambia por tu forma de crear el client.
// import { supabaseServer } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'

/**
 * ⚠️ IMPORTANTE:
 * - Nada de código en top-level que ejecute queries.
 * - Solo exportar los handlers (GET/POST).
 * - No uses ninguna variable llamada "cat".
 */

// ✅ Crea el cliente dentro de la función (evita ejecuciones en import)
function supabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(url, anon, { auth: { persistSession: false } })
}

// GET /api/patterns/[id]/cases
export async function GET(
  _req: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params
    if (!id) {
      return NextResponse.json({ error: 'Missing pattern id' }, { status: 400 })
    }

    const sb = supabaseServer()
    const { data, error } = await sb
      .from('cases')
      .select('*')
      .eq('pattern_id', id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, items: data ?? [] })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Unexpected error' }, { status: 500 })
  }
}

// (Opcional) POST /api/patterns/[id]/cases
export async function POST(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params
    const body = await req.json() as { title?: string; domain?: string }

    if (!id) {
      return NextResponse.json({ error: 'Missing pattern id' }, { status: 400 })
    }

    const sb = supabaseServer()
    const { data, error } = await sb
      .from('cases')
      .insert({
        pattern_id: id,
        title: body?.title ?? 'Caso sin título',
        domain: body?.domain ?? null,
      })
      .select('*')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, item: data }, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Unexpected error' }, { status: 500 })
  }
}
