// /app/components/MobileSidebar.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV } from './Sidebar'

export default function MobileSidebar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // cierra el drawer al navegar
  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <>
      {/* Top bar móvil */}
      <header className="md:hidden sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-[var(--pc-border)]">
        <div className="max-w-6xl mx-auto h-14 px-4 flex items-center justify-between">
          <button
            aria-label="Abrir menú"
            onClick={() => setOpen(true)}
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[var(--pc-border)]"
          >
            {/* ícono hamburguesa */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          <Link href="/dashboard" className="font-semibold text-[var(--pc-brand)]">
            ProtectCrochet
          </Link>

          <div className="w-10" /> {/* spacer */}
        </div>
      </header>

      {/* Overlay + Drawer */}
      <div
        role="presentation"
        aria-hidden={!open}
        onClick={() => setOpen(false)}
        className={[
          'md:hidden fixed inset-0 z-40 transition-opacity',
          open ? 'opacity-100 pointer-events-auto bg-black/40' : 'opacity-0 pointer-events-none',
        ].join(' ')}
      />

      <aside
        className={[
          'md:hidden fixed z-50 top-0 left-0 h-full w-80 bg-white border-r border-[var(--pc-border)]',
          'transition-transform duration-300 ease-out',
          open ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
        aria-modal="true"
        role="dialog"
      >
        <div className="p-4 border-b border-[var(--pc-border)] flex items-center justify-between">
          <div className="font-semibold text-[var(--pc-brand)]">Menú</div>
          <button
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--pc-border)]"
          >
            {/* ícono cerrar */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {NAV.map((item) => {
            const active =
              pathname === item.href || (pathname?.startsWith(item.href + '/') ?? false)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  'block px-3 py-2 rounded-lg border transition',
                  active
                    ? 'bg-[var(--pc-surface-2)] border-[var(--pc-brand)] text-[var(--pc-brand-dark)]'
                    : 'bg-white border-[var(--pc-border)] hover:bg-[var(--pc-surface)]',
                ].join(' ')}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto px-4 py-3 text-xs text-[var(--pc-muted)]">
          © {new Date().getFullYear()} ProtectCrochet
        </div>
      </aside>
    </>
  )
}
