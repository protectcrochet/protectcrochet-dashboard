// app/api/patterns/[id]/cases/route.ts
import { NextRequest, NextResponse } from "next/server"

// ✅ En Next 15, tipa el 2º argumento INLINE con { params: { ... } }
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // const body = await req.json() as {
    //   scoutId?: string
    //   url?: string
    //   domain?: string
    //   note?: string
    // }

    // TODO: lógica real (DB/Supabase/etc.)
    return NextResponse.json({ ok: true, patternId: id }, { status: 201 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ ok: false, error: msg }, { status: 400 })
  }
}
