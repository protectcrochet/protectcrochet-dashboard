'use client'
import { useEffect } from 'react'

export default function SessionRefresher() {
  useEffect(() => {
    const run = () => fetch('/api/auth/refresh', { method: 'POST' }).catch(() => {})
    run()
    const id = setInterval(run, 1000 * 60 * 5) // cada 5 minutos
    return () => clearInterval(id)
  }, [])
  return null
}
