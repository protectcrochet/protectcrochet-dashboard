import { supabaseServer } from '@/lib/supabase/server'
import Link from 'next/link';

type PatternRow = {
  id: string;
  title: string;
  created_at: string | null;
  pdf_path: string | null;
  cover_path: string | null;
  owner_id: string | null;
};

export const revalidate = 0; // siempre fresco durante dev

export default async function PatternsPage() {
  const sb = await supabaseServer()

  // Usuario actual
  const { data: userData } = await sb.auth.getUser();
  const uid = userData?.user?.id;

  // Traer últimos patrones del usuario (o de su cuenta por RLS)
  const { data: rows, error } = await sb
    .from('patterns')
    .select('id, title, created_at, pdf_path, cover_path, owner_id')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    return <div className="p-6 text-red-600">Error al cargar patrones: {error.message}</div>;
  }

  async function signedUrlOrNull(path: string | null) {
    if (!path) return null;
    const { data, error: signErr } = await sb.storage
      .from('patterns')
      .createSignedUrl(path, 60 * 10); // 10 min
    if (signErr || !data?.signedUrl) return null;
    return data.signedUrl;
  }

  // Firmar URLs en paralelo (server)
  const signed = await Promise.all(
    (rows ?? []).map(async (r) => {
      const pdfUrl = await signedUrlOrNull(r.pdf_path);
      const coverUrl = await signedUrlOrNull(r.cover_path);
      return { ...r, pdfUrl, coverUrl };
    })
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Mis patrones</h1>
        <Link href="/patterns/upload" className="rounded-lg px-4 py-2 border">
          Subir patrón
        </Link>
      </div>

      {signed.length === 0 ? (
        <p className="text-slate-600">Aún no hay patrones. Sube el primero ✨</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {signed.map((r) => (
            <li key={r.id} className="border rounded-lg overflow-hidden">
              {r.coverUrl ? (
                <img src={r.coverUrl} alt={r.title} className="w-full h-40 object-cover" />
              ) : (
                <div className="w-full h-40 bg-slate-100 flex items-center justify-center text-slate-400">
                  Sin portada
                </div>
              )}
              <div className="p-4 space-y-2">
                <h3 className="font-medium line-clamp-1">{r.title}</h3>
                <p className="text-xs text-slate-500">
                  {r.created_at ? new Date(r.created_at).toLocaleString() : '—'}
                </p>
                <div className="flex gap-2">
                  <Link
                    href={`/patterns/${r.id}`}
                    className="text-sm underline underline-offset-4"
                  >
                    Ver
                  </Link>
                  {r.pdfUrl && (
                    <a
                      href={r.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm underline underline-offset-4"
                    >
                      PDF
                    </a>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
