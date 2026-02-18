import { useEffect, useMemo, useState } from 'react'
import { useApiBase } from '../context/ApiContext'
import { useHistoryData } from '../context/HistoryContext'
import { formatNumber } from './helpers'

export default function Compare() {
  const { base } = useApiBase()
  const { items } = useHistoryData()
  const [selectedId, setSelectedId] = useState(items[0]?.id ?? '')
  const [compare, setCompare] = useState(50)

  const selected = useMemo(() => {
    if (!items.length) return null
    return items.find((item) => item.id === selectedId) ?? items[0]
  }, [items, selectedId])

  useEffect(() => {
    if (!selectedId && items.length > 0) {
      setSelectedId(items[0].id)
    }
  }, [items, selectedId])

  const originalUrl = selected?.original_available
    ? `${base}/artifact/${selected.id}/original`
    : null
  const resultUrl = selected ? `${base}/result/${selected.id}` : null

  return (
    <div className="page">
      <section className="panel scan-panel" data-label="Reconstruction">
        <div className="panel-title">
          <div>
            <h2>Reconstruction</h2>
            <p>Side-by-side original vs decoded output.</p>
          </div>
        </div>

        {items.length === 0 && (
          <div className="empty">No transmissions available yet.</div>
        )}

        {items.length > 0 && (
          <div className="compare-controls">
            <label>
              Select transmission
              <select value={selected?.id ?? ''} onChange={(e) => setSelectedId(e.target.value)}>
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.filename ?? item.id}
                  </option>
                ))}
              </select>
            </label>

            {selected && (
              <div className="compare-metrics">
                <span>PSNR: {formatNumber(selected.psnr, 2)}</span>
                <span>SSIM: {formatNumber(selected.ssim, 3)}</span>
                <span>Ratio: {selected.ratio}x</span>
              </div>
            )}
          </div>
        )}

        {originalUrl && resultUrl && (
          <div className="compare">
            <div className="compare-labels">
              <span>Original</span>
              <span>Reconstructed</span>
            </div>
            <div className="compare-frame">
              <img className="compare-base" src={originalUrl} alt="Original" />
              <div className="compare-overlay" style={{ width: `${compare}%` }}>
                <img src={resultUrl} alt="Reconstruction" />
              </div>
              <div className="compare-handle" style={{ left: `${compare}%` }} />
            </div>
            <input
              className="compare-slider"
              type="range"
              min={0}
              max={100}
              value={compare}
              onChange={(e) => setCompare(Number(e.target.value))}
            />
          </div>
        )}

        {!originalUrl && items.length > 0 && (
          <div className="empty">Original image not available for this entry.</div>
        )}
      </section>
    </div>
  )
}
