import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'
import { generateImageHash } from '@/lib/imageHash'

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const file = form.get('file') as File | null
    const patternId = form.get('patternId') as string | null

    if (!file) {
      return NextResponse.json({ ok: false, message: 'Falta archivo' }, { status: 400 })
    }

    const buf = Buffer.from(await file.arrayBuffer())
    const hash = await generateImageHash(buf)

    const sb = await supabaseServer()
    const { error } = await sb.from('pattern_hashes').insert({
      pattern_id: patternId ?? null,
      hash,
    })

    if (error) {
      return NextResponse.json({ ok: false, message: error.message }, { status: 400 })
    }
    return NextResponse.json({ ok: true, hash })
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message || 'Error' }, { status: 500 })
  }
}
