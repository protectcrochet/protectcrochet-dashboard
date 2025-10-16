import { cookies } from 'next/headers'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function supabaseServer() {
  const store = await cookies()

  // Snapshot para lecturas en RSC (evita cookies().get(...) en render)
  const snapshot = new Map<string, string>()
  for (const c of store.getAll()) snapshot.set(c.name, c.value)

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return snapshot.get(name)
        },
        set(_name: string, _value: string, _options: CookieOptions) {},
        remove(_name: string, _options: CookieOptions) {},
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      global: {
        headers: { 'x-client-info': 'protectcrochet-dashboard/next15' },
      },
    }
  )
}


