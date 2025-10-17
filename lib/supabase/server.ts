// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies, headers } from 'next/headers'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Para Server Actions y Route Handlers (pueden escribir cookies).
 */
export function supabaseServer() {
  const cookieStore = cookies()
  return createServerClient(SUPABASE_URL, SUPABASE_ANON, {
    cookies: {
      get: (name: string) => cookieStore.get(name)?.value,
      set: (name: string, value: string, options: any) =>
        cookieStore.set({ name, value, ...options }),
      remove: (name: string, options: any) =>
        cookieStore.set({ name, value: '', ...options })
    },
    headers: {
      // útil si quieres propagar auth de SSR a API
      'x-forwarded-host': headers().get('host') ?? ''
    }
  })
}

/**
 * Para Server Components (RSC): SOLO lectura de cookies (no escribir).
 * Evita el error “Cookies can only be modified in a Server Action or Route Handler”.
 */
export function supabaseServerRSC() {
  const cookieStore = cookies()
  return createServerClient(SUPABASE_URL, SUPABASE_ANON, {
    cookies: {
      get: (name: string) => cookieStore.get(name)?.value,
      // set/remove vacíos para impedir escrituras en RSC
      set: () => {},
      remove: () => {}
    }
  })
}




