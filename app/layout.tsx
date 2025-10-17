import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "ProtectCrochet Dashboard",
  description:
    "Plataforma para proteger patrones de crochet — Registro, monitoreo y reportes automáticos de infracciones.",
  keywords: [
    "ProtectCrochet",
    "crochet patterns",
    "copyright",
    "supabase",
    "nextjs",
  ],
  authors: [{ name: "Krosha Team" }],
}

/**
 * Root layout principal de ProtectCrochet
 * Aplica estilos globales y define la estructura base.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Meta viewport para móviles */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Puedes agregar favicon o fuentes aquí */}
        <link rel="icon" href="/favicon.ico" />
      </head>

      <body className="min-h-screen bg-gray-50 text-gray-800 antialiased selection:bg-gray-200 selection:text-gray-900">
        {/* Navbar o Header global opcional */}
        <header className="w-full border-b border-gray-200 bg-white/70 backdrop-blur-sm sticky top-0 z-50">
          <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
            <h1 className="text-xl font-bold text-gray-900">
              ProtectCrochet<span className="text-indigo-600">.io</span>
            </h1>
            <nav className="space-x-4 text-sm font-medium text-gray-600">
              <a href="/" className="hover:text-indigo-600 transition">
                Inicio
              </a>
              <a href="/dashboard" className="hover:text-indigo-600 transition">
                Dashboard
              </a>
              <a href="/patterns" className="hover:text-indigo-600 transition">
                Patrones
              </a>
              <a href="/cases" className="hover:text-indigo-600 transition">
                Casos
              </a>
            </nav>
          </div>
        </header>

        {/* Contenido dinámico */}
        <main className="mx-auto max-w-6xl p-6">{children}</main>

        {/* Footer global */}
        <footer className="mt-10 border-t border-gray-200 bg-white/50 py-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} ProtectCrochet — Todos los derechos
          reservados.
        </footer>
      </body>
    </html>
  )
}

