import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { supabaseServer } from '@/lib/supabase/server'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import SessionRefresher from '@/app/dashboard/SessionRefresher'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const sb = await supabaseServer()

  // 🔹 Obtener el rol actual del usuario autenticado
  let role: string | null = null
  try {
    const { data, error } = await sb.rpc('get_my_role_text')
    if (!error) role = (data as any) ?? null
  } catch {
    role = null
  }

  // 🔹 Solo 'staff' o 'admin' pueden acceder al dashboard
  const isStaff = role === 'staff' || role === 'admin'
  if (!isStaff) {
    redirect('/') // 👈 redirige automáticamente al home
  }

  // 🔹 Layout principal del dashboard
  return (
    <section className="min-h-dvh grid md:grid-cols-[260px_1fr] bg-gray-950 text-gray-100">
      <Sidebar />
      <div className="flex flex-col">
        <Header />
        {/* Refresca sesión automáticamente cada 5 minutos */}
        <SessionRefresher />
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </section>
  )
}

