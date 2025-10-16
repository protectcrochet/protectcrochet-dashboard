import './globals.css'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'ProtectCrochet Dashboard',
  description: 'Gestión de casos y monitoreo de patrones',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-950 text-gray-100 min-h-dvh">
        {children}
      </body>
    </html>
  )
}
