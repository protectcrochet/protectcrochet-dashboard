// /middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// middleware.ts — temporal para descartar bloqueos
export function middleware() {
  return Response.next();
}
export const config = { matcher: [] };


