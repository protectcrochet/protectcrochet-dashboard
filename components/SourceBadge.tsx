// components/SourceBadge.tsx
'use client'

import React from 'react'

type SourceKey =
  | 'etsy'
  | 'pinterest'
  | 'google'
  | 'maxella'
  | 'vk'
  | 'facebook'
  | 'instagram'
  | 'tiktok'
  | 'other'

type Meta = { label: string; color: string }

/**
 * Mapa local de metadatos por fuente.
 * Si más adelante lees desde la vista `v_case_scouts_enriched`,
 * puedes pasar label/color vía props y este mapa quedará como fallback.
 */
const META: Record<SourceKey, Meta> = {
  etsy:       { label: 'Etsy',       color: '#f97316' },
  pinterest:  { label: 'Pinterest',  color: '#e11d48' },
  google:     { label: 'Google',     color: '#3b82f6' },
  maxella:    { label: 'Maxella.ru', color: '#9333ea' },
  vk:         { label: 'VK',         color: '#2563eb' },
  facebook:   { label: 'Facebook',   color: '#1877F2' },
  instagram:  { label: 'Instagram',  color: '#E1306C' },
  tiktok:     { label: 'TikTok',     color: '#000000' },
  other:      { label: 'Otros',      color: '#6b7280' },
}

function getMeta(source: string, fallback?: Partial<Meta>): Meta {
  const key = (source || 'other').toLowerCase() as SourceKey
  const base = META[key] ?? META.other
  return {
    label: fallback?.label ?? base.label,
    color: fallback?.color ?? base.color,
  }
}

export default function SourceBadge({
  source,
  label,
  color,
  className = '',
}: {
  source: string
  label?: string
  color?: string
  className?: string
}) {
  const meta = getMeta(source, { label, color })

  // Estilos simples: píldora con color de fondo custom y texto en blanco/negro según luminosidad.
  const bg = meta.color
  const [r, g, b] = hexToRgb(bg)
  const luminance = 0.2126 * (r / 255) + 0.7152 * (g / 255) + 0.0722 * (b / 255)
  const textClass = luminance > 0.6 ? 'text-black' : 'text-white'
  const borderClass = 'ring-1 ring-black/5'

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${textClass} ${borderClass} ${className}`}
      style={{ backgroundColor: bg }}
      title={meta.label}
    >
      <span className="font-medium capitalize">{meta.label}</span>
    </span>
  )
}

function hexToRgb(hex: string): [number, number, number] {
  const s = hex.replace('#', '')
  const bigint = parseInt(s.length === 3 ? s.split('').map(c => c + c).join('') : s, 16)
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255]
}
