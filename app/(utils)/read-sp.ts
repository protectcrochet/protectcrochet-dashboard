// /app/(utils)/read-sp.ts
export type SPObj = Record<string, string | string[] | undefined>

export async function readSearchParams(
  sp: SPObj | Promise<SPObj> | undefined
): Promise<SPObj> {
  const anySp = sp as any
  return typeof anySp?.then === 'function' ? await anySp : (anySp ?? {})
}

export function pick(sp: SPObj, key: string): string {
  const v = sp[key]
  return Array.isArray(v) ? String(v[0] ?? '') : String(v ?? '')
}

