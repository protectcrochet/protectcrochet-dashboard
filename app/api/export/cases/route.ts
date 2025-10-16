import { NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Pequeña utilidad CSV (incluye BOM para Excel)
function toCSV(rows: any[], headers: string[]) {
  const escape = (v: any) => {
    const s = v == null ? '' : String(v)
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const head = headers.join(',')
  const body = rows.map(r => headers.map(h => escape(r[h])).join(',')).join('\n')
  // BOM para que Excel detecte UTF-8
  return '\uFEFF' + head + '\n' + body + '\n'
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const status = url.searchParams.get('status')?.trim() || null
  const q = url.searchParams.get('q')?.trim() || null
  const from = url.searchParams.get('from') || null  // YYYY-MM-DD
  const to = url.searchParams.get('to') || null      // YYYY-MM-DD
  const limit = Math.min(Number(url.searchParams.get('limit') ?? 5000), 5000)
  const offset = Math.max(Number(url.searchParams.get('offset') ?? 0), 0)

  const store = await cookies()
  const snapshot = new Map<string, string>()
  for (const c of store.getAll()) snapshot.set(c.name, c.value)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return snapshot.get(name) },
        set(_name: string, _value: string, _opts: CookieOptions) {},
        remove(_name: string, _opts: CookieOptions) {},
      },
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    }
  )

  // Reutilizamos la RPC de página para traer filas ya filtradas (RLS incluido)
  const { data, error } = await supabase.rpc('get_cases_page', {
    p_status: status,
    p_q: q,
    p_from: from,
    p_to: to,
    p_limit: limit,
    p_offset: offset,
  })

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 })
  }

  const rows = Array.isArray(data) ? data : []
  const headers = ['id', 'title', 'status', 'domain', 'created_at']
  const csv = toCSV(rows, headers)

  const filename = `cases_${new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-')}.csv`
  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  })
}
