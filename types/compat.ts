// types/compat.ts
export type PromiseParams<T extends Record<string, string>> = Promise<T>

export type SearchParams = {
  [key: string]: string | string[] | undefined
}
