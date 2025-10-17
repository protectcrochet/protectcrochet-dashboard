import { NextResponse } from "next/server"

export async function POST(req: Request, context) {
  const id = context?.params?.id
  // const body = await req.json().catch(() => null)

  // TODO: lógica real (DB/Supabase/etc.)
  return NextResponse.json({ ok: true, patternId: id }, { status: 201 })
}
