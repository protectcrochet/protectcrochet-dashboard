// /app/api/patterns/route.ts
import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const { title, coverUrl } = await req.json()
    if (!title || typeof title !== 'string') {
      return NextResponse.json({ ok: false, message: 'Falta title' }, { status: 400 })
    }

    const sb = await supabaseServer()
    const { data, error } = await sb
      .from('patterns')
      .insert({ title, cover_url: coverUrl ?? null })
      .select('id, title, cover_url')
      .single()

    if (error) {
      return NextResponse.json({ ok: false, message: error.message }, { status: 400 })
    }
    return NextResponse.json({ ok: true, pattern: data })
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message || 'Error' }, { status: 500 })
  }
}
