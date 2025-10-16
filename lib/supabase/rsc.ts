// /lib/supabase/rsc.ts
import 'server-only'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Cliente para Server Components (RSC).
 * NO modifica cookies (set/remove = no-op) para evitar errores.
 */
export function supabaseRSC() {
  const store = cookies()
  return createServerClient(url, anon, {
    cookies: {
      get(name: string) {
        return store.get(name)?.value
      },
      // Prohibido modificar cookies en RSC -> no-op
      set() {},
      remove() {},
    },
  })
}
