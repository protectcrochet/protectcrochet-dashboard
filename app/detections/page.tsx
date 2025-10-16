'use client'
import { useState } from 'react'

type Match = {
  id: string
  pattern_id: string | null
  created_at: string | null
  similarity: number
}

export default function DetectionsPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [msg, setMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    setMsg(null)
    setMatches([])
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/match', { method: 'POST', body: form })
      const json = await res.json()
      if (!json.ok) setMsg(`⚠️ ${json.message || 'Error al comparar'}`)
      else setMatches(json.matches || [])
    } catch (e) {
      setMsg('⚠️ Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-[var(--pc-brand)]">
        Detección visual
      </h1>

      <div className="space-y-2">
        <input type="file" accept="image/*" onChange={onUpload} />
        <p className="text-sm text-[var(--pc-muted)]">
          Sube una portada para ver coincidencias con tu biblioteca.
        </p>
      </div>

      {loading && <div>Analizando imagen…</div>}
      {msg && <div className="text-red-600">{msg}</div>}

      {matches.length > 0 ? (
        <div className="space-y-2">
          {matches.map((m) => (
            <div key={m.id} className="border border-[var(--pc-border)] rounded-lg p-3 bg-white flex justify-between">
              <div>
                <div className="text-sm">pattern_id: {m.pattern_id ?? '—'}</div>
                <div className="text-xs text-[var(--pc-muted)]">
                  {m.created_at ? new Date(m.created_at).toLocaleString() : '—'}
                </div>
              </div>
              <div className="text-sm font-medium">
                {(m.similarity * 100).toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && <div className="text-[var(--pc-muted)]">No hay coincidencias.</div>
      )}
    </div>
  )
}
