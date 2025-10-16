import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const {
    status = null,
    q = null,
    from = null,
    to = null,
    limit = 20,
    page = 1,
  } = body ?? {}

  const store = await cookies()
  const snapshot = new Map<string, string>()
  for (const c of store.getAll()) snapshot.set(c.name, c.value)

  // Supabase server client con snapshot + escritura en la respuesta si fuera necesario
  const res = NextResponse.json({ ok: true }) // respuesta dummy temporal (no la usaremos)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return snapshot.get(name) },
        set() {},
        remove() {},
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  )

  const offset = Math.max(0, (Number(page) - 1) * Number(limit))

  const [list, count] = await Promise.all([
    supabase.rpc('get_cases_page', {
      p_status: status,
      p_q: q,
      p_from: from,
      p_to: to,
      p_limit: limit,
      p_offset: offset,
    }),
    supabase.rpc('get_cases_count', {
      p_status: status,
      p_q: q,
      p_from: from,
      p_to: to,
    }),
  ])

  if (list.error) {
    return NextResponse.json({ ok: false, error: list.error.message }, { status: 400 })
  }
  if (count.error) {
    return NextResponse.json({ ok: false, error: count.error.message }, { status: 400 })
  }

  return NextResponse.json({
    ok: true,
    rows: list.data ?? [],
    total: Number(count.data ?? 0),
    page: Number(page),
    limit: Number(limit),
  })
}

