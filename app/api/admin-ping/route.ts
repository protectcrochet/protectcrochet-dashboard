import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'



export async function GET() {
  try {
    const sb = await supabaseServer()
    const { count, error } = await sb
      .from('cases')
      .select('id', { count: 'exact', head: true })

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }
    return NextResponse.json({ ok: true, casesCount: count ?? 0 })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}
