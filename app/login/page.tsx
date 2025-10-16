// /app/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseServer } from '@/lib/supabase/server'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function onLogin(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    setLoading(true)
    try {
      const sb = supabaseBrowser()
      const { error } = await sb.auth.signInWithPassword({ email, password })
      if (error) setMsg('⚠️ ' + (error.message || 'No se pudo iniciar sesión'))
      else { setMsg('✅ Sesión iniciada'); router.push('/search') }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-[var(--pc-bg)] p-4">
      <form onSubmit={onLogin} className="bg-white border border-[var(--pc-border)] p-6 rounded-2xl w-full max-w-sm space-y-3">
        <h1 className="text-xl font-semibold text-[var(--pc-brand)]">Inicia sesión</h1>
        <input className="w-full p-3 border border-[var(--pc-border)] rounded-lg"
               type="email" placeholder="tu@email.com" required
               value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input className="w-full p-3 border border-[var(--pc-border)] rounded-lg"
               type="password" placeholder="••••••••" required
               value={password} onChange={(e)=>setPassword(e.target.value)} />
        <button disabled={loading} className="w-full p-3 rounded-lg bg-[var(--pc-brand)] text-white">
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
        {msg && <div className="text-sm">{msg}</div>}
      </form>
    </div>
  )
}
