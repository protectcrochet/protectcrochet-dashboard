// /app/api/search/route.ts
import { NextResponse } from 'next/server'

// Mock inicial de búsqueda
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') || ''

  // Simulación de búsqueda manual (futuro scraper IA)
  const mock = [
    {
      title: `Posible coincidencia: ${q}`,
      domain: 'pinterest.com',
      url: 'https://www.pinterest.com/search?q=' + encodeURIComponent(q),
    },
    {
      title: `Patrón parecido en Etsy`,
      domain: 'etsy.com',
      url: 'https://www.etsy.com/search?q=' + encodeURIComponent(q),
    },
    {
      title: `PDF o referencia en Scribd`,
      domain: 'scribd.com',
      url: 'https://www.scribd.com/search?content_type=tops&page=1&query=' + encodeURIComponent(q),
    },
  ]

  return NextResponse.json({ results: mock })
}
    