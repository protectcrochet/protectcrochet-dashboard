// /lib/supabase.ts
import 'server-only'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Para Server Components (RSC) – SOLO lectura de cookies.
 * Evitamos modificar cookies para no disparar:
 * "Cookies can only be modified in a Server Action or Route Handler".
 */
export function supabaseServerRSC() {
  const store = cookies()
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return store.get(name)?.value
      },
      set() {
        /* no-op en RSC */
      },
      remove() {
        /* no-op en RSC */
      },
    },
  })
}

/**
 * Para Server Actions y Route Handlers – lectura + escritura de cookies.
 * Úsalo en archivos con `'use server'` o en `/app/api/...`.
 */
export function supabaseServerAction() {
  const store = cookies()
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return store.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        store.set(name, value, options)
      },
      remove(name: string, options: any) {
        store.set(name, '', { ...options, maxAge: 0 })
      },
    },
  })
}

// Client-side (opcional)
export function supabaseBrowser() {
  return createClient(supabaseUrl, supabaseAnonKey)
}
