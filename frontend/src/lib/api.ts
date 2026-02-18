import type { ApiResult, HistoryResponse } from './types'

export const DEFAULT_API_BASE = 'http://localhost:8000'

export const normalizeHistory = (data: HistoryResponse): ApiResult[] => {
  if (Array.isArray(data)) return data
  return Object.entries(data || {}).map(([id, record]) => ({
    id,
    ...record,
  }))
}

export const sanitizeBase = (value: string) => value.replace(/\/+$/, '')

export async function fetchHistory(base: string): Promise<ApiResult[]> {
  const res = await fetch(`${base}/history`)
  if (!res.ok) throw new Error('Failed to load history')
  const data = (await res.json()) as HistoryResponse
  return normalizeHistory(data)
}

export async function compressImage(
  base: string,
  file: File,
  level: number
): Promise<ApiResult> {
  const form = new FormData()
  form.append('file', file)
  form.append('level', String(level))

  const res = await fetch(`${base}/compress`, {
    method: 'POST',
    body: form,
  })

  if (!res.ok) {
    const msg = await res.text()
    throw new Error(msg || 'Compression failed')
  }

  return (await res.json()) as ApiResult
}

export async function deleteResult(base: string, id: string) {
  await fetch(`${base}/result/${id}`, { method: 'DELETE' })
}
