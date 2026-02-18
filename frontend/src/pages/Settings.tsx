import { useState } from 'react'
import { useApiBase } from '../context/ApiContext'
import { useHistoryData } from '../context/HistoryContext'
import { fetchHistory, sanitizeBase } from '../lib/api'

export default function Settings() {
  const { base, setBase } = useApiBase()
  const { autoRefresh, refreshInterval, setAutoRefresh, setRefreshInterval } =
    useHistoryData()
  const [value, setValue] = useState(base)
  const [status, setStatus] = useState<string | null>(null)

  const save = async () => {
    const next = sanitizeBase(value)
    setBase(next)
    try {
      await fetchHistory(next)
      setStatus('Connection OK')
    } catch {
      setStatus('Saved, but could not reach API')
    }
  }

  return (
    <div className="page">
      <section className="panel" data-label="Connection">
        <div className="panel-title">
          <div>
            <h2>Settings</h2>
            <p>Configure API connection for the backend.</p>
          </div>
        </div>

        <label className="file-label">
          API Base URL
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="http://localhost:8000"
          />
        </label>

        <div className="action-row">
          <button className="cta" type="button" onClick={save}>
            Save & Test
          </button>
          {status && <span className="status-pill">{status}</span>}
        </div>
      </section>

      <section className="panel" data-label="Sync">
        <div className="panel-title">
          <div>
            <h2>Live sync</h2>
            <p>Auto-refresh history and metrics.</p>
          </div>
        </div>
        <label className="toggle">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
          />
          Enable auto-refresh
        </label>
        <label className="file-label">
          Refresh interval (seconds)
          <select
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
          >
            <option value={10000}>10</option>
            <option value={20000}>20</option>
            <option value={30000}>30</option>
            <option value={60000}>60</option>
          </select>
        </label>
      </section>
    </div>
  )
}
