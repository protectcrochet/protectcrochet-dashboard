// /lib/supabase/action.ts
import 'server-only'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!url || !anon) {
  throw new Error('Faltan NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

/**
 * Cliente para Server Actions y Route Handlers (/app/api/*).
 * Aquí SÍ podemos set/remove cookies.
 */
export function supabaseAction() {
  const store = cookies()
  return createServerClient(url, anon, {
    cookies: {
      get(name: string) { return store.get(name)?.value },
      set(name: string, value: string, options: any) { store.set(name, value, options) },
      remove(name: string, options: any) { store.set(name, '', { ...options, maxAge: 0 }) },
    },
  })
}
