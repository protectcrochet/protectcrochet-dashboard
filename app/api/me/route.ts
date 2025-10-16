// /app/api/me/route.ts
import { NextResponse } from 'next/server'
import { supabaseAction } from '@/lib/supabase/action'

export async function GET() {
  const sb = supabaseAction()

  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ user: null, role: null }, { status: 200 })

  // 1) Intentar vía RPC
  const rpc = await sb.rpc('get_my_role').catch(() => ({ data: null as any }))
  let role = rpc?.data ?? null

  // 2) Fallback vía join profiles -> accounts
  if (!role) {
    const { data: prof } = await sb
      .from('profiles')
      .select('account_id')
      .eq('id', user.id)
      .maybeSingle()

    if (prof?.account_id) {
      const { data: acc } = await sb
        .from('accounts')
        .select('role')
        .eq('id', prof.account_id)
        .maybeSingle()
      role = acc?.role ?? null
    }
  }

  return NextResponse.json({ user, role }, { status: 200 })
}
