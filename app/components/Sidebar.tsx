'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const links = [
    { href: '/dashboard', label: 'Resumen' },
    { href: '/dashboard/cases', label: 'Casos' },
    { href: '/dashboard/staff', label: 'Staff' },
  ]

  return (
    <>
      {/* 🔹 Sidebar fijo (escritorio) */}
      <aside className="hidden md:flex md:flex-col md:w-64 border-r border-gray-800 bg-gray-950 text-gray-100">
        <div className="p-4 font-bold text-lg border-b border-gray-800">
          ProtectCrochet
          <div className="text-xs text-gray-500 font-normal">Dashboard</div>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1">
          {links.map(({ href, label }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 text-xs text-gray-500 border-t border-gray-800">
          © {new Date().getFullYear()} ProtectCrochet
        </div>
      </aside>

      {/* 🔹 Sidebar móvil (toggle con menú hamburguesa) */}
      <div className="md:hidden fixed top-3 left-3 z-50">
        <button
          onClick={() => setOpen((v) => !v)}
          className="p-2 rounded-md bg-gray-900 text-gray-100 border border-gray-800 hover:bg-gray-800"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-40 bg-black/60" onClick={() => setOpen(false)}>
          <aside
            className="absolute top-0 left-0 h-full w-64 bg-gray-950 border-r border-gray-800 p-4 flex flex-col text-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-lg">ProtectCrochet</span>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-md text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="flex-1 flex flex-col gap-1">
              {links.map(({ href, label }) => {
                const active = pathname === href
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                      active
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                    }`}
                  >
                    {label}
                  </Link>
                )
              })}
            </nav>

            <div className="text-xs text-gray-500 mt-auto border-t border-gray-800 pt-4">
              © {new Date().getFullYear()} ProtectCrochet
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
