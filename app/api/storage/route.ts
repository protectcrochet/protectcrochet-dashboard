import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server'



export async function GET(req: Request) {
  const url = new URL(req.url);
  const bucket = url.searchParams.get('b') || '';
  const name = url.searchParams.get('n') || '';

  if (!bucket || !name) {
    return NextResponse.json({ error: 'missing params' }, { status: 400 });
  }

  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  // Seguridad: el path debe empezar por su uid/
  if (!name.startsWith(`${user.id}/`)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const { data, error } = await sb.storage.from(bucket).createSignedUrl(name, 60);
  if (error || !data) {
    return NextResponse.json({ error: error?.message || 'sign error' }, { status: 500 });
  }
  return NextResponse.redirect(data.signedUrl);
}
