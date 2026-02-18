export function formatBytes(bytes: number) {
  if (!bytes && bytes !== 0) return '—'
  const units = ['B', 'KB', 'MB', 'GB']
  let idx = 0
  let val = bytes
  while (val >= 1024 && idx < units.length - 1) {
    val /= 1024
    idx += 1
  }
  return `${val.toFixed(val >= 10 || idx === 0 ? 0 : 2)} ${units[idx]}`
}

export function formatNumber(value: number | null | undefined, digits = 2) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—'
  return value.toFixed(digits)
}

export function formatDate(value?: string) {
  if (!value) return 'Unknown'
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? 'Unknown' : d.toLocaleString()
}
