// app/search/page.tsx
'use client'

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { saveScoutAction } from './actions'
import type { ScoutSource } from '@/types/case-scouts'

type Item = {
  title: string
  url: string
  source: ScoutSource
  snapshot_url?: string
}

function mockResults(q: string): Item[] {
  const base = encodeURIComponent(q.toLowerCase().trim() || 'pattern')

  // Helper: búsqueda pública vía Google limitada a un dominio
  const g = (site: string) =>
    `https://www.google.com/search?q=site:${encodeURIComponent(site)}+${base}`

  return [
    // Fuentes existentes
    { title: `${q} – listado en Etsy`,         url: `https://www.etsy.com/search?q=${base}`,             source: 'etsy' },
    { title: `${q} – pines en Pinterest`,      url: `https://www.pinterest.com/search/pins/?q=${base}`,  source: 'pinterest' },
    { title: `${q} – resultados (Google)`,     url: `https://www.google.com/search?q=${base}`,           source: 'google' },
    { title: `${q} – posible en Maxella`,      url: `https://maxella.ru/?s=${base}`,                     source: 'maxella' },

    // Nuevas redes
    { title: `${q} – resultados en VK`,        url: g('vk.com'),        source: 'vk' },
    { title: `${q} – resultados en Facebook`,  url: g('facebook.com'),  source: 'facebook' },
    { title: `${q} – resultados en Instagram`, url: g('instagram.com'), source: 'instagram' },
    { title: `${q} – resultados en TikTok`,    url: g('tiktok.com'),    source: 'tiktok' },

    // Catch-all
    { title: `${q} – adicionales`,             url: `https://example.com/search?q=${base}`,              source: 'other' },
  ]
}

function ResultCard({ item, keyword }: { item: Item; keyword: string }) {
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSave(formData: FormData) {
    setPending(true)
    setStatus(null)
    try {
      const res = await saveScoutAction(formData)
      setStatus({ ok: !!res?.ok, message: res?.message || (res?.ok ? 'Guardado' : 'Error') })
    } catch (e: any) {
      setStatus({ ok: false, message: e?.message || 'Error desconocido' })
    } finally {
      setPending(false)
      // ocultar mensaje tras unos segundos
      setTimeout(() => setStatus(null), 3500)
    }
  }

  return (
    <div className="rounded-2xl border p-4 space-y-2">
      <div className="font-medium">{item.title}</div>
      <a href={item.url} target="_blank" className="underline text-sm">
        {item.url}
      </a>

      <form action={handleSave} className="pt-2 space-y-1">
        <input type="hidden" name="keyword" value={keyword} />
        <input type="hidden" name="source" value={item.source} />
        <input type="hidden" name="url" value={item.url} />
        <input type="hidden" name="title" value={item.title} />
        <input type="hidden" name="snapshot_url" value={item.snapshot_url || ''} />
        <button
          disabled={pending}
          className="rounded-xl border px-3 py-1 text-sm hover:bg-slate-50 disabled:opacity-60"
        >
          {pending ? 'Guardando…' : 'Guardar en Scout'}
        </button>
      </form>

      {status && (
        <div className={`text-xs pt-1 ${status.ok ? 'text-green-600' : 'text-red-600'}`}>
          {status.message}
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const q = (searchParams.get('q') || '').toString().trim()
  const results = useMemo(() => (q ? mockResults(q) : []), [q])

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Buscar patrones / posibles coincidencias</h1>

      {/* Formulario de búsqueda (GET para ?q=) */}
      <form method="GET" className="flex gap-2">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Ej. Rapunzel amigurumi pattern"
          className="w-full rounded-xl border px-3 py-2"
        />
        <button className="rounded-xl border px-4 py-2 hover:bg-slate-50">Buscar</button>
      </form>

      {/* Listado */}
      {q ? (
        <div className="space-y-3">
          <div className="text-sm text-slate-600">
            Resultados para: <span className="font-medium">{q}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {results.map((item, idx) => (
              <ResultCard key={`${item.source}-${idx}`} item={item} keyword={q} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-sm text-slate-500">
          Escribe una palabra clave y presiona <b>Buscar</b> para ver resultados.
        </div>
      )}
    </div>
  )
}
