'use client'

import { useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase/browser'

const supabase = supabaseBrowser()

async function sha256File(file: File): Promise<string> {
  const buf = await file.arrayBuffer()
  const digest = await crypto.subtle.digest('SHA-256', buf)
  const arr = Array.from(new Uint8Array(digest))
  return arr.map(b => b.toString(16).padStart(2, '0')).join('')
}
function sanitizeName(name: string) {
  return name.trim().replace(/\s+/g, '-').slice(0, 64)
}

export default function UploadPage() {
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string>('')

  async function ensureAccountForUser(user: { id: string; email: string | null }) {
    const prof = await supabase
      .from('profiles')
      .select('account_id')
      .eq('id', user.id)
      .maybeSingle()

    if (prof.data?.account_id) return prof.data.account_id

    // Crea una cuenta simple si no existe
    const name = (user.email && user.email.split('@')[0]) || `cuenta-${user.id.slice(0,6)}`
    let acc = await supabase.from('accounts').insert({ name }).select('id').single()
    if (acc.error) {
      const alt = await supabase.from('accounts').select('id').order('created_at', { ascending: false }).limit(1).maybeSingle()
      if (!alt.data) throw new Error('No se pudo crear/obtener account')
      acc = { data: alt.data } as any
    }
    const up = await supabase
      .from('profiles')
      .upsert({ id: user.id, email: user.email, account_id: acc.data!.id })
      .select('account_id')
      .single()
    if (up.error) throw up.error
    return up.data!.account_id
  }

  async function onUpload(files: FileList | null) {
    if (!files?.length) return
    setBusy(true); setMsg('Subiendo…')

    const { data: { user }, error: authErr } = await supabase.auth.getUser()
    if (authErr || !user) { setBusy(false); setMsg('Debes iniciar sesión.'); return }

    const accountId = await ensureAccountForUser(user)
    const file = files[0]
    const hash = await sha256File(file)
    const filename = sanitizeName(file.name)

    // (Opcional) subir a storage
    // await supabase.storage.from('patterns').upload(`${user.id}/${filename}`, file)

    const { data: patt, error: pattErr } = await supabase
      .from('patterns')
      .insert({ account_id: accountId, title: filename })
      .select('id')
      .single()
    if (pattErr) { setBusy(false); setMsg('Error creando patrón'); return }

    await supabase.from('pattern_hashes').insert({ pattern_id: patt.id, algo: 'sha256', value: hash })

    setBusy(false)
    setMsg(`Listo: patrón ${patt.id} creado (hash ${hash.slice(0,8)}…)`)
  }

  return (
    <div className="max-w-xl mx-auto bg-white border rounded-2xl p-6">
      <h1 className="text-xl font-semibold mb-4">Subir patrón</h1>
      <input type="file" onChange={(e) => onUpload(e.target.files)} disabled={busy} className="block w-full border rounded-lg p-3" accept="image/*,application/pdf" />
      <p className="mt-3 text-sm text-gray-600">{msg}</p>
    </div>
  )
}
