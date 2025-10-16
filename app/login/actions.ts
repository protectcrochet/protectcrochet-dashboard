'use server';
import { supabaseServer } from '@/lib/supabase/server'

export async function sendMagicLink(email: string) {
  const sb = await supabaseServer()
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/auth/callback` },
  });
  if (error) return { ok: false, message: error.message };
  return { ok: true, message: 'Revisa tu correo para continuar.' };
}