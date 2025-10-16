import { supabaseServer } from '@/lib/supabase/server';
import SearchBox from './_components/SearchBox';

export const revalidate = 0; // datos frescos

export default async function CasesPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string; status?: string; from?: string; to?: string };
}) {
  const sb = supabaseServer();

  const q = (searchParams.q ?? '').slice(0, 120); // saneo
  const page = Math.max(1, Number(searchParams.page ?? 1));
  const limit = 20;
  const offset = (page - 1) * limit;

  // 🧠 Opción A: tu RPC existente
  const { data: rows, error } = await sb.rpc('get_cases_page', {
    q,
    p_status: searchParams.status ?? null,
    p_from: searchParams.from ?? null,
    p_to: searchParams.to ?? null,
    p_limit: limit,
    p_offset: offset,
  });

  if (error) {
    // Muestra un fallback amable
    return <div className="p-6 text-red-500">Error cargando casos: {error.message}</div>;
  }

  return (
    <main className="p-6 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Casos</h1>
        <SearchBox />
      </div>

      <p className="text-sm text-gray-500">
        {q ? <>Mostrando resultados para <b>“{q}”</b></> : 'Todos los casos'}
      </p>

      <ul className="divide-y rounded-lg border">
        {(rows ?? []).map((c: any) => (
          <li key={c.id} className="p-3">
            <a href={`/dashboard/cases/${c.id}`} className="font-medium hover:underline">
              {c.title || 'Caso sin título'}
            </a>
            <div className="text-xs text-gray-500">
              {c.domain} • {c.status} • {new Date(c.created_at).toLocaleDateString()}
            </div>
          </li>
        ))}
      </ul>

      {/* Controles de paginación mínimos */}
      <div className="flex gap-2 pt-2">
        <a
          href={`?${new URLSearchParams({ ...searchParams as any, page: String(Math.max(1, page - 1)) })}`}
          className="rounded border px-3 py-1 text-sm"
        >Anterior</a>
        <a
          href={`?${new URLSearchParams({ ...searchParams as any, page: String(page + 1) })}`}
          className="rounded border px-3 py-1 text-sm"
        >Siguiente</a>
      </div>
    </main>
  );
}
