// app/api/patterns/[id]/cases/route.ts
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// Tipos del contexto del handler
type RouteContext = {
  params: { id: string }
}

// POST /api/patterns/:id/cases
export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const { id } = context.params

    // Si necesitas leer body, descomenta y valida:
    // const body = await req.json() as {
    //   scoutId?: string
    //   url?: string
    //   domain?: string
    //   note?: string
    // }

    // TODO: aquí iría tu lógica real (Supabase, etc.)
    return NextResponse.json(
      { ok: true, message: 'case created (stub)', patternId: id },
      { status: 201 }
    )
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ ok: false, error: msg }, { status: 400 })
  }
}
