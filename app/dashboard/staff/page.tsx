import { supabaseServer } from '@/lib/supabase/server'

export default async function StaffPage() {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser().catch(() => ({ data: { user: null } }))

  return (
    <main className="min-h-dvh p-8">
      <h1 className="text-2xl font-bold mb-4">Staff</h1>
      <p className="text-gray-300">
        Hola {user?.email ?? 'visitante'}, esta es la sección del staff de ProtectCrochet.
      </p>
    </main>
  )
}

