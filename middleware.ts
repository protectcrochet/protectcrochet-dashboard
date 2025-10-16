// /middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  // Si usas cookies de Supabase, puedes revisar la presence del token
  // Aquí dejamos un guard simple por ruta.
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    // Deja pasar; el componente server hará redirect si no hay user
    return NextResponse.next()
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}

