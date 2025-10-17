import { NextResponse } from "next/server"

export async function POST(req: Request, context) {
  const id = context?.params?.id
  return NextResponse.json({ ok: true, patternId: id }, { status: 201 })
}
