// /types/case-scouts.ts

export type ScoutSource =
  | 'etsy'
  | 'pinterest'
  | 'google'
  | 'maxella'
  | 'other'
  | 'vk'
  | 'facebook'
  | 'instagram'
  | 'tiktok'

export type ScoutStatus = 'new' | 'promoted' | 'ignored' | 'created_case'

export interface CaseScout {
  id: string
  account_id: string
  user_id: string
  keyword: string
  source: ScoutSource
  url?: string | null
  title?: string | null
  snapshot_url?: string | null
  status: ScoutStatus
  created_at: string
}

