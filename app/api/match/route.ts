import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'
import { generateImageHash, compareHashes } from '@/lib/imageHash'

const THRESHOLD = 0.8 // 80%

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const file = form.get('file') as File | null
    if (!file) {
      return NextResponse.json({ ok: false, message: 'Falta archivo' }, { status: 400 })
    }

    const buf = Buffer.from(await file.arrayBuffer())
    const queryHash = await generateImageHash(buf)

    const sb = await supabaseServer()
    const { data: rows, error } = await sb
      .from('pattern_hashes')
      .select('id, pattern_id, hash, created_at')
      .limit(1000)

    if (error) {
      return NextResponse.json({ ok: false, message: error.message }, { status: 400 })
    }

    const matches = (rows || [])
      .map((r) => ({
        id: r.id,
        pattern_id: r.pattern_id,
        created_at: r.created_at,
        similarity: compareHashes(queryHash, r.hash),
      }))
      .filter((m) => m.similarity >= THRESHOLD)
      .sort((a, b) => b.similarity - a.similarity)

    return NextResponse.json({ ok: true, matches, threshold: THRESHOLD })
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message || 'Error' }, { status: 500 })
  }
}
