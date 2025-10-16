'use client'

import { useState } from 'react'

export default function UploadHashPage() {
  const [title, setTitle] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [msg, setMsg] = useState<string | null>(null)
  const [hash, setHash] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onCreateAndHash() {
    if (!file) { setMsg('Selecciona una imagen'); return }
    if (!title.trim()) { setMsg('Escribe un título de patrón'); return }

    setMsg(null)
    setHash(null)
    setLoading(true)
    try {
      // 1) crear patrón
      const r1 = await fetch('/api/patterns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title }),
      })
      const j1 = await r1.json()
      if (!j1.ok) { setMsg('⚠️ ' + (j1.message || 'No se pudo crear patrón')); return }
      const patternId = j1.pattern.id as string

      // 2) guardar hash ligado al patrón
      const form = new FormData()
      form.append('file', file)
      form.append('patternId', patternId)

      const r2 = await fetch('/api/hash', { method: 'POST', body: form, credentials: 'include' })
      const j2 = await r2.json()
      if (!j2.ok) { setMsg('⚠️ ' + (j2.message || 'No se pudo guardar hash')); return }

      setHash(j2.hash)
      setMsg('✅ Patrón creado y hash guardado')
    } catch {
      setMsg('⚠️ Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold text-[var(--pc-brand)]">Crear patrón + Guardar hash</h1>

      <label className="block text-sm">Título del patrón</label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Ej.: Muñeca amigurumi graduación"
        className="w-full border border-[var(--pc-border)] rounded-lg p-2 bg-white"
      />

      <label className="block text-sm mt-2">Portada (imagen)</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />

      <button
        onClick={onCreateAndHash}
        disabled={loading}
        className="mt-2 bg-[var(--pc-brand)] text-white px-4 py-2 rounded-lg hover:bg-[var(--pc-brand-dark)] disabled:opacity-60"
      >
        {loading ? 'Procesando…' : 'Crear y guardar hash'}
      </button>

      {msg && <div>{msg}</div>}
      {hash && (
        <div className="text-sm text-[var(--pc-muted)] break-all">
          Hash: <span className="font-mono">{hash}</span>
        </div>
      )}

      <p className="text-sm text-[var(--pc-muted)]">
        Luego puedes comparar en <span className="underline">/detections</span>.
      </p>
    </div>
  )
}
