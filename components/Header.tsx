'use client'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-gray-950/60 bg-gray-950/80 border-b border-gray-800">
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          className="md:hidden rounded-lg border border-gray-800 px-3 py-2 text-sm"
          onClick={() => alert('Puedes implementar un drawer para móviles si lo deseas')}
        >
          Menú
        </button>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/dashboard" className="rounded-lg border border-gray-800 px-3 py-2 text-sm hover:bg-gray-900">Inicio</Link>
          <Link href="/dashboard/staff" className="rounded-lg border border-gray-800 px-3 py-2 text-sm hover:bg-gray-900">Staff</Link>
        </div>
      </div>
    </header>
  )
}
