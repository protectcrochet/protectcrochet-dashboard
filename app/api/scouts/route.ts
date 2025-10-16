// /app/api/scouts/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { url, title, source, patternId } = await req.json()
    if (!url || !source) {
      return NextResponse.json({ ok: false, message: 'Faltan campos' }, { status: 400 })
    }

    const sb = await supabaseServer()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) return NextResponse.json({ ok:false, message:'NO_AUTH' }, { status:401 })

    // (DEV) obtener/crear account y membresía si no existe
    let accountId: string | null = null
    const { data: member } = await sb.from('members')
      .select('account_id').eq('user_id', user.id).maybeSingle()

    if (member?.account_id) {
      accountId = member.account_id
    } else {
      const { data: acc } = await sb.from('accounts')
        .insert({ name: `Workspace de ${user.email?.split('@')[0] || 'usuario'}` })
        .select('id').single()
      accountId = acc?.id ?? null
      if (!accountId) return NextResponse.json({ ok:false, message:'NO_ACCOUNT' }, { status:400 })
      await sb.from('members').insert({ account_id: accountId, user_id: user.id, role: 'owner' })
    }

    const { error } = await sb.from('case_scouts').insert({
      account_id: accountId,
      created_by: user.id,
      pattern_id: patternId ?? null,
      url, source, title: title ?? null, status: 'new',
    })
    if (error) return NextResponse.json({ ok:false, message: error.message }, { status:400 })

    return NextResponse.json({ ok:true })
  } catch (e:any) {
    return NextResponse.json({ ok:false, message: e?.message || 'Error' }, { status:500 })
  }
}
