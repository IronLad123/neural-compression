import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ApiResult } from '../lib/types'
import { fetchHistory } from '../lib/api'
import { useApiBase } from './ApiContext'

type Status = {
  state: 'idle' | 'loading' | 'connected' | 'error'
  latencyMs: number | null
  lastSync: string | null
}

type ContextValue = {
  items: ApiResult[]
  refresh: () => Promise<void>
  add: (item: ApiResult) => void
  remove: (id: string) => void
  status: Status
  autoRefresh: boolean
  refreshInterval: number
  setAutoRefresh: (value: boolean) => void
  setRefreshInterval: (value: number) => void
}

const HistoryContext = createContext({
  items: [] as ApiResult[],
  refresh: async () => {},
  add: (_: ApiResult) => {},
  remove: (_: string) => {},
  status: { state: 'idle', latencyMs: null, lastSync: null } as Status,
  autoRefresh: false,
  refreshInterval: 30000,
  setAutoRefresh: (_: boolean) => {},
  setRefreshInterval: (_: number) => {},
} as ContextValue)

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const { base } = useApiBase()
  const [items, setItems] = useState<ApiResult[]>([])
  const [status, setStatus] = useState<Status>({
    state: 'idle',
    latencyMs: null,
    lastSync: null,
  })
  const [autoRefresh, setAutoRefreshState] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.localStorage.getItem('autoRefresh') === 'true'
  })
  const [refreshInterval, setRefreshIntervalState] = useState(() => {
    if (typeof window === 'undefined') return 30000
    const stored = Number(window.localStorage.getItem('refreshInterval'))
    return Number.isNaN(stored) || stored <= 0 ? 30000 : stored
  })

  const refresh = useCallback(async () => {
    try {
      setStatus((prev) => ({ ...prev, state: 'loading' }))
      const start = performance.now()
      const data = await fetchHistory(base)
      setItems(data)
      const elapsed = Math.round(performance.now() - start)
      setStatus({
        state: 'connected',
        latencyMs: elapsed,
        lastSync: new Date().toISOString(),
      })
    } catch {
      setStatus((prev) => ({
        ...prev,
        state: 'error',
        latencyMs: null,
      }))
    }
  }, [base])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    if (!autoRefresh) return
    const interval = setInterval(() => {
      refresh()
    }, refreshInterval)
    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, refresh])

  const add = useCallback((item: ApiResult) => {
    setItems((prev) => [item, ...prev.filter((r) => r.id !== item.id)])
  }, [])

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const setAutoRefresh = (value: boolean) => {
    setAutoRefreshState(value)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('autoRefresh', String(value))
    }
  }

  const setRefreshInterval = (value: number) => {
    const next = Math.max(5000, value)
    setRefreshIntervalState(next)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('refreshInterval', String(next))
    }
  }

  const value = useMemo(
    () => ({
      items,
      refresh,
      add,
      remove,
      status,
      autoRefresh,
      refreshInterval,
      setAutoRefresh,
      setRefreshInterval,
    }),
    [items, refresh, add, remove, status, autoRefresh, refreshInterval]
  )

  return <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>
}

export function useHistoryData() {
  return useContext(HistoryContext)
}
