import { useMemo, useState } from 'react'
import { useApiBase } from '../context/ApiContext'
import { useHistoryData } from '../context/HistoryContext'
import { deleteResult } from '../lib/api'
import { formatBytes, formatDate } from './helpers'

export default function History() {
  const { base } = useApiBase()
  const { items, remove } = useHistoryData()
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query) return items
    const q = query.toLowerCase()
    return items.filter(
      (item) =>
        item.filename?.toLowerCase().includes(q) || item.id.toLowerCase().includes(q)
    )
  }, [items, query])

  const handleDelete = async (id: string) => {
    await deleteResult(base, id)
    remove(id)
  }

  return (
    <div className="page">
      <section className="panel" data-label="Archive">
        <div className="panel-title">
          <div>
            <h2>Mission Log</h2>
            <p>Search, review, and download past downlinks.</p>
          </div>
        </div>

        <input
          className="search"
          placeholder="Search by filename or id"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {filtered.length === 0 && <div className="empty">No matching records.</div>}

        <div className="history-table">
          {filtered.map((item) => (
            <div className="history-row" key={item.id}>
              <div>
                <strong>{item.filename ?? item.id}</strong>
                <span>{formatDate(item.created_at)}</span>
              </div>
              <div>
                <span>Level</span>
                <strong>{item.level}</strong>
              </div>
              <div>
                <span>Ratio</span>
                <strong>{item.ratio}x</strong>
              </div>
              <div>
                <span>Compressed</span>
                <strong>{formatBytes(item.compressed_size)}</strong>
              </div>
              <div className="row-actions">
                <a href={`${base}/result/${item.id}`} download>
                  Reconstruction
                </a>
                <a href={`${base}/artifact/${item.id}/latents`} download>
                  Latents
                </a>
                <button type="button" onClick={() => handleDelete(item.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
