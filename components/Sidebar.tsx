'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/dashboard', label: 'Resumen' },
  { href: '/dashboard/staff', label: 'Staff' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex md:flex-col border-r border-gray-800 bg-gray-950/40">
      <div className="p-5 border-b border-gray-800">
        <Link href="/" className="font-bold text-lg">ProtectCrochet</Link>
        <p className="text-xs text-gray-400">Dashboard</p>
      </div>
      <nav className="p-2">
        {links.map((l) => {
          const active = pathname === l.href
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`block rounded-xl px-3 py-2 text-sm my-1 transition-colors ${
                active ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-900'
              }`}
            >
              {l.label}
            </Link>
          )
        })}
      </nav>
      <div className="mt-auto p-4 text-xs text-gray-500">v0.1.0</div>
    </aside>
  )
}
