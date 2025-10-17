// app/layout.tsx
import type { Metadata } from "next"
import '../globals.css'

export const metadata: Metadata = {
  title: "ProtectCrochet",
  description: "Dashboard",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}



