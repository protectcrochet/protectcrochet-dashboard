'use client';

import { useEffect, useState } from 'react';
import { supabaseServer } from '@/lib/supabase/server'

const supabase = getBrowserClient();

export default function TestPage() {
  const [message, setMessage] = useState('Conectando...');

  useEffect(() => {
    const testConnection = async () => {
      const { data, error } = await supabase.from('profiles').select('*').limit(1);
      if (error) {
        setMessage('❌ Error: ' + error.message);
      } else {
        setMessage('✅ Conectado a Supabase. Ejemplo: ' + JSON.stringify(data));
      }
    };

    testConnection();
  }, []);

  return (
    <main style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Prueba de conexión a Supabase</h1>
      <p>{message}</p>
    </main>
  );
}