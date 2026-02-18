import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const createSessionHash = () => {
  if (typeof window === 'undefined') return '000000'
  const existing = window.sessionStorage.getItem('sessionHash')
  if (existing) return existing
  const bytes = new Uint8Array(3)
  if (window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(bytes)
  } else {
    for (let i = 0; i < bytes.length; i += 1) {
      bytes[i] = Math.floor(Math.random() * 256)
    }
  }
  const hash = Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()
  window.sessionStorage.setItem('sessionHash', hash)
  return hash
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [sessionHash] = useState(createSessionHash)

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Deep Compression Suite</p>
          <h1>Ops Console</h1>
        </div>
        <div className="badge-row">
          <span className="badge">Mission: ARES-07</span>
          <span className="badge">Rover: VESTA-3</span>
          <span className="badge badge-mono">Session: {sessionHash}</span>
        </div>
        <nav className="nav">
          <NavLink to="/" end>
            Dashboard
          </NavLink>
          <NavLink to="/compress">Downlink</NavLink>
          <NavLink to="/history">Mission Log</NavLink>
          <NavLink to="/compare">Reconstruction</NavLink>
          <NavLink to="/settings">Link Config</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
      </header>
      <main className="main">{children}</main>
    </div>
  )
}
