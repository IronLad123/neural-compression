import { createContext, useContext, useMemo, useState } from 'react'
import { DEFAULT_API_BASE, sanitizeBase } from '../lib/api'

const ApiContext = createContext({
  base: DEFAULT_API_BASE,
  setBase: (_: string) => {},
})

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const [base, setBaseState] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT_API_BASE
    const stored = window.localStorage.getItem('apiBase')
    return stored ? sanitizeBase(stored) : DEFAULT_API_BASE
  })

  const setBase = (value: string) => {
    const next = sanitizeBase(value || DEFAULT_API_BASE)
    setBaseState(next)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('apiBase', next)
    }
  }

  const value = useMemo(() => ({ base, setBase }), [base])

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>
}

export function useApiBase() {
  return useContext(ApiContext)
}
