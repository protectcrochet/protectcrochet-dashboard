'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function DashboardFilters() {
  const router = useRouter();
  const sp = useSearchParams();

  const [q, setQ] = useState(sp.get('q') ?? '');
  const [domain, setDomain] = useState(sp.get('domain') ?? '');
  const [from, setFrom] = useState(sp.get('from') ?? '');
  const [to, setTo] = useState(sp.get('to') ?? '');
  const [size, setSize] = useState(sp.get('size') ?? '10');

  // Mantén inputs sincronizados si vuelven atrás/adelante en el navegador
  useEffect(() => {
    setQ(sp.get('q') ?? '');
    setDomain(sp.get('domain') ?? '');
    setFrom(sp.get('from') ?? '');
    setTo(sp.get('to') ?? '');
    setSize(sp.get('size') ?? '10');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp.toString()]);

  const apply = () => {
    const p = new URLSearchParams(Array.from(sp.entries()));
    if (q) p.set('q', q); else p.delete('q');
    if (domain) p.set('domain', domain); else p.delete('domain');
    if (from) p.set('from', from); else p.delete('from');
    if (to) p.set('to', to); else p.delete('to');
    if (size) p.set('size', size); else p.delete('size');
    p.set('page', '1'); // reset paginación al filtrar
    router.push(`/dashboard?${p.toString()}`);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto auto', gap: 8, marginBottom: 12 }}>
      <input
        value={q} onChange={(e)=>setQ(e.target.value)}
        placeholder="Buscar texto..."
        style={inputStyle}
      />
      <input
        value={domain} onChange={(e)=>setDomain(e.target.value)}
        placeholder="Dominio..."
        style={inputStyle}
      />
      <input
        type="date" value={from} onChange={(e)=>setFrom(e.target.value)}
        style={inputStyle}
      />
      <input
        type="date" value={to} onChange={(e)=>setTo(e.target.value)}
        style={inputStyle}
      />
      <select value={size} onChange={(e)=>setSize(e.target.value)} style={inputStyle}>
        {['10','20','50'].map(n => <option key={n} value={n}>{n}/pág</option>)}
      </select>
      <button type="button" onClick={apply} style={buttonStyle}>Aplicar</button>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  borderRadius: 8,
  border: '1px solid #1f2937',
  background: 'transparent',
  color: '#e5e7eb',
  padding: '8px 10px',
  fontSize: 13,
};

const buttonStyle: React.CSSProperties = {
  borderRadius: 8,
  border: '1px solid #1f2937',
  background: '#111827',
  color: '#fff',
  padding: '8px 12px',
  fontSize: 13,
  display: 'inline-block',
  textDecoration: 'none',
  cursor: 'pointer',
};
