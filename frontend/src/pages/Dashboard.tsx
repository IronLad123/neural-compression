import { Link } from 'react-router-dom'
import { useHistoryData } from '../context/HistoryContext'
import type { ApiResult } from '../lib/types'
import { formatBytes, formatNumber, formatDate } from './helpers'

const LINK_KBPS = 256
const ENCODE_MBPS = 4
const DECODE_MBPS = 6

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

const mean = (values: number[]) =>
  values.reduce((sum, value) => sum + value, 0) / (values.length || 1)

const stddev = (values: number[]) => {
  if (values.length <= 1) return 1
  const avg = mean(values)
  const variance =
    values.reduce((sum, value) => sum + (value - avg) ** 2, 0) / values.length
  return Math.sqrt(variance) || 1
}

const formatDuration = (ms: number) => {
  if (ms < 1000) return `${Math.round(ms)} ms`
  const seconds = ms / 1000
  if (seconds < 60) return `${seconds.toFixed(1)} s`
  const minutes = Math.floor(seconds / 60)
  const remainder = Math.round(seconds % 60)
  return `${minutes}m ${remainder}s`
}

const estimateTimeline = (item: ApiResult) => {
  const captureMs = clamp(240 + item.original_size / 5000, 240, 1600)
  const encodeMs = clamp((item.original_size / (ENCODE_MBPS * 1_000_000)) * 1000, 320, 6500)
  const downlinkMs = clamp(
    (item.compressed_size * 8 * 1000) / (LINK_KBPS * 1000),
    900,
    30000
  )
  const decodeMs = clamp((item.compressed_size / (DECODE_MBPS * 1_000_000)) * 1000, 260, 4000)
  const totalMs = captureMs + encodeMs + downlinkMs + decodeMs
  return { captureMs, encodeMs, downlinkMs, decodeMs, totalMs }
}

function Sparkline({ values }: { values: number[] }) {
  if (values.length === 0) return <div className="sparkline empty">—</div>
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1
  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1 || 1)) * 100
      const y = 100 - ((value - min) / range) * 100
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg className="sparkline" viewBox="0 0 100 100" preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="4" />
    </svg>
  )
}

function LineChart({
  values,
  label,
  yLabel,
  xLabel = 'Recent runs',
}: {
  values: number[]
  label: string
  yLabel: string
  xLabel?: string
}) {
  if (values.length < 2) {
    return (
      <div className="chart-card">
        <div className="chart-title">{label}</div>
        <div className="chart-empty">Insufficient data</div>
      </div>
    )
  }
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1
  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 100
      const y = 90 - ((value - min) / range) * 80
      return `${x},${y}`
    })
    .join(' ')

  return (
    <div className="chart-card">
      <div className="chart-title">{label}</div>
      <div className="chart-axis-badges">
        <span className="axis-badge">Y: {yLabel}</span>
        <span className="axis-badge">X: {xLabel}</span>
      </div>
      <svg className="chart" viewBox="0 0 100 100" preserveAspectRatio="none">
        {[25, 50, 75].map((x) => (
          <line key={`vx-${x}`} className="chart-gridline" x1={x} y1="10" x2={x} y2="90" />
        ))}
        {[30, 50, 70].map((y) => (
          <line key={`hy-${y}`} className="chart-gridline" x1="0" y1={y} x2="100" y2={y} />
        ))}
        <line className="chart-axis" x1="0" y1="90" x2="100" y2="90" />
        <line className="chart-axis" x1="0" y1="10" x2="0" y2="90" />
        <polyline className="chart-line" points={points} fill="none" />
        <text className="chart-label y" x="2" y="14">
          {yLabel}
        </text>
        <text className="chart-label x" x="50" y="98">
          {xLabel}
        </text>
      </svg>
      <div className="chart-footer">
        <span>Min: {formatNumber(min, 2)}</span>
        <span>Max: {formatNumber(max, 2)}</span>
      </div>
    </div>
  )
}

function ScatterChart({
  points,
  label,
  xLabel,
  yLabel,
}: {
  points: { x: number; y: number }[]
  label: string
  xLabel: string
  yLabel: string
}) {
  if (points.length === 0) {
    return (
      <div className="chart-card">
        <div className="chart-title">{label}</div>
        <div className="chart-empty">No data available</div>
      </div>
    )
  }
  const xs = points.map((p) => p.x)
  const ys = points.map((p) => p.y)
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)
  const rangeX = maxX - minX || 1
  const rangeY = maxY - minY || 1

  return (
    <div className="chart-card">
      <div className="chart-title">{label}</div>
      <div className="chart-axis-badges">
        <span className="axis-badge">Y: {yLabel}</span>
        <span className="axis-badge">X: {xLabel}</span>
      </div>
      <svg className="chart" viewBox="0 0 100 100" preserveAspectRatio="none">
        {[25, 50, 75].map((x) => (
          <line key={`vx-${x}`} className="chart-gridline" x1={x} y1="10" x2={x} y2="90" />
        ))}
        {[30, 50, 70].map((y) => (
          <line key={`hy-${y}`} className="chart-gridline" x1="0" y1={y} x2="100" y2={y} />
        ))}
        <line className="chart-axis" x1="0" y1="90" x2="100" y2="90" />
        <line className="chart-axis" x1="0" y1="10" x2="0" y2="90" />
        {points.map((point, index) => {
          const cx = ((point.x - minX) / rangeX) * 100
          const cy = 90 - ((point.y - minY) / rangeY) * 80
          return <circle key={index} className="chart-dot" cx={cx} cy={cy} r={2.5} />
        })}
        <text className="chart-label y" x="2" y="14">
          {yLabel}
        </text>
        <text className="chart-label x" x="50" y="98">
          {xLabel}
        </text>
      </svg>
      <div className="chart-footer">
        <span>BPP {formatNumber(minX, 2)} → {formatNumber(maxX, 2)}</span>
        <span>PSNR {formatNumber(minY, 1)} → {formatNumber(maxY, 1)}</span>
      </div>
    </div>
  )
}

function ParetoChart({
  points,
  label,
  xLabel,
  yLabel,
}: {
  points: { x: number; y: number; id: string }[]
  label: string
  xLabel: string
  yLabel: string
}) {
  if (points.length === 0) {
    return (
      <div className="chart-card">
        <div className="chart-title">{label}</div>
        <div className="chart-empty">No data available</div>
      </div>
    )
  }

  const xs = points.map((p) => p.x)
  const ys = points.map((p) => p.y)
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)
  const rangeX = maxX - minX || 1
  const rangeY = maxY - minY || 1

  const sorted = [...points].sort((a, b) => b.x - a.x || b.y - a.y)
  const pareto: { x: number; y: number; id: string }[] = []
  let bestY = -Infinity
  for (const point of sorted) {
    if (point.y >= bestY) {
      pareto.push(point)
      bestY = point.y
    }
  }
  const paretoSorted = [...pareto].sort((a, b) => a.x - b.x)
  const paretoLine = paretoSorted
    .map((point) => {
      const cx = ((point.x - minX) / rangeX) * 100
      const cy = 90 - ((point.y - minY) / rangeY) * 80
      return `${cx},${cy}`
    })
    .join(' ')

  return (
    <div className="chart-card">
      <div className="chart-title">{label}</div>
      <div className="chart-axis-badges">
        <span className="axis-badge">Y: {yLabel}</span>
        <span className="axis-badge">X: {xLabel}</span>
      </div>
      <svg className="chart" viewBox="0 0 100 100" preserveAspectRatio="none">
        {[25, 50, 75].map((x) => (
          <line key={`vx-${x}`} className="chart-gridline" x1={x} y1="10" x2={x} y2="90" />
        ))}
        {[30, 50, 70].map((y) => (
          <line key={`hy-${y}`} className="chart-gridline" x1="0" y1={y} x2="100" y2={y} />
        ))}
        <line className="chart-axis" x1="0" y1="90" x2="100" y2="90" />
        <line className="chart-axis" x1="0" y1="10" x2="0" y2="90" />
        {paretoLine.length > 0 && (
          <polyline className="chart-line pareto-line" points={paretoLine} fill="none" />
        )}
        {points.map((point) => {
          const cx = ((point.x - minX) / rangeX) * 100
          const cy = 90 - ((point.y - minY) / rangeY) * 80
          const isPareto = pareto.some((p) => p.id === point.id)
          return (
            <circle
              key={point.id}
              className={`chart-dot ${isPareto ? 'pareto' : ''}`}
              cx={cx}
              cy={cy}
              r={isPareto ? 3.6 : 2.5}
            />
          )
        })}
        <text className="chart-label y" x="2" y="14">
          {yLabel}
        </text>
        <text className="chart-label x" x="50" y="98">
          {xLabel}
        </text>
      </svg>
      <div className="chart-footer">
        <span>Ratio {formatNumber(minX, 2)} → {formatNumber(maxX, 2)}</span>
        <span>PSNR {formatNumber(minY, 1)} → {formatNumber(maxY, 1)}</span>
      </div>
      <div className="chart-legend">
        <span className="legend-dot" /> Pareto‑optimal runs
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { items } = useHistoryData()

  const total = items.length
  const avgRatio =
    items.reduce((sum, item) => sum + (item.ratio || 0), 0) / (total || 1)
  const avgBpp =
    items.reduce((sum, item) => sum + (item.bpp || 0), 0) / (total || 1)
  const bestPsnr = items.reduce(
    (best, item) => (item.psnr && item.psnr > best ? item.psnr : best),
    0
  )
  const latest = items[0]
  const lastTen = items.slice(0, 10).reverse()
  const ratioSeries = lastTen.map((item) => item.ratio || 0)
  const psnrSeries = lastTen.map((item) => item.psnr || 0)
  const bppSeries = lastTen.map((item) => item.bpp || 0)
  const recentRuns = items.slice(0, 20).reverse()
  const ratioTrend = recentRuns.map((item) => item.ratio || 0)
  const psnrTrend = recentRuns.map((item) => item.psnr || 0)
  const bppTrend = recentRuns.map((item) => item.bpp || 0)
  const rateDistortionPoints = recentRuns
    .filter((item) => item.psnr !== null && item.bpp !== null)
    .map((item) => ({ x: item.bpp || 0, y: item.psnr || 0 }))
  const paretoPoints = recentRuns
    .filter((item) => item.psnr !== null)
    .map((item) => ({
      id: item.id,
      x: item.ratio || 0,
      y: item.psnr || 0,
    }))
  const anomalyCandidates = items.filter((item) => item.psnr !== null)
  const ratioValues = anomalyCandidates.map((item) => item.ratio || 0)
  const psnrValues = anomalyCandidates.map((item) => item.psnr || 0)
  const ratioMean = mean(ratioValues)
  const psnrMean = mean(psnrValues)
  const ratioStd = stddev(ratioValues)
  const psnrStd = stddev(psnrValues)
  const anomalies = anomalyCandidates
    .map((item) => {
      const ratioZ = (item.ratio - ratioMean) / ratioStd
      const psnrZ = ((item.psnr ?? 0) - psnrMean) / psnrStd
      const score = ratioZ - psnrZ
      return { item, ratioZ, psnrZ, score }
    })
    .filter((entry) => entry.ratioZ > 0.8 && entry.psnrZ < -0.4 && entry.score > 1.2)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
  const timelineRuns = items.slice(0, 5)

  return (
    <div className="page">
      <section className="card-grid">
        <div className="card">
          <span>Total downlinks</span>
          <strong>{total}</strong>
        </div>
        <div className="card">
          <span>Average ratio</span>
          <strong>{formatNumber(avgRatio, 2)}x</strong>
          <Sparkline values={ratioSeries} />
        </div>
        <div className="card">
          <span>Average bits / pixel</span>
          <strong>{formatNumber(avgBpp, 3)}</strong>
          <Sparkline values={bppSeries} />
        </div>
        <div className="card">
          <span>Best PSNR</span>
          <strong>{formatNumber(bestPsnr, 2)}</strong>
          <Sparkline values={psnrSeries} />
        </div>
      </section>

      <section className="panel" data-label="Latest Transmission">
        <div className="panel-title">
          <div>
          <h2>Latest run</h2>
          <p>Most recent compression output.</p>
          </div>
          <Link className="link-button" to="/history">
            View all
          </Link>
        </div>

        {!latest && <div className="empty">No transmissions yet.</div>}

        {latest && (
          <div className="latest-grid">
            <div>
              <span>Filename</span>
              <strong>{latest.filename ?? latest.id}</strong>
            </div>
            <div>
              <span>Created</span>
              <strong>{formatDate(latest.created_at)}</strong>
            </div>
            <div>
              <span>Original size</span>
              <strong>{formatBytes(latest.original_size)}</strong>
            </div>
            <div>
              <span>Compressed size</span>
              <strong>{formatBytes(latest.compressed_size)}</strong>
            </div>
            <div>
              <span>Ratio</span>
              <strong>{latest.ratio}x</strong>
            </div>
            <div>
              <span>PSNR / SSIM</span>
              <strong>
                {formatNumber(latest.psnr, 2)} / {formatNumber(latest.ssim, 3)}
              </strong>
            </div>
          </div>
        )}
      </section>

      <div className="section-divider" />

      <section className="panel scan-panel" data-label="Analytics">
        <div className="panel-title">
          <div>
            <h2>Visual analytics</h2>
            <p>Trends and rate-distortion behavior.</p>
          </div>
        </div>
        <div className="chart-grid">
          <LineChart label="Compression ratio trend" values={ratioTrend} yLabel="Ratio (x)" />
          <LineChart label="PSNR trend" values={psnrTrend} yLabel="PSNR (dB)" />
          <LineChart label="BPP trend" values={bppTrend} yLabel="BPP" />
          <ScatterChart
            label="Rate–distortion (BPP vs PSNR)"
            points={rateDistortionPoints}
            xLabel="BPP"
            yLabel="PSNR (dB)"
          />
          <ParetoChart
            label="Pareto frontier (Ratio vs PSNR)"
            points={paretoPoints}
            xLabel="Ratio (x)"
            yLabel="PSNR (dB)"
          />
        </div>
      </section>

      <div className="section-divider" />

      <section className="panel" data-label="Quality Control">
        <div className="panel-title">
          <div>
            <h2>Anomaly detection</h2>
            <p>Flags runs with high compression but low reconstruction quality.</p>
          </div>
        </div>
        {anomalyCandidates.length === 0 && (
          <div className="empty">No quality metrics available yet.</div>
        )}
        {anomalyCandidates.length > 0 && (
          <>
            <div className="anomaly-baseline">
              Baseline: {formatNumber(ratioMean, 2)}x ratio · {formatNumber(psnrMean, 1)} PSNR
            </div>
            {anomalies.length === 0 ? (
              <div className="empty">No anomalies detected in the current window.</div>
            ) : (
              <div className="anomaly-table">
                {anomalies.map((entry) => (
                  <div className="anomaly-row" key={entry.item.id}>
                    <div>
                      <strong>{entry.item.filename ?? entry.item.id}</strong>
                      <span>{formatDate(entry.item.created_at)}</span>
                      <div className="anomaly-reason">
                        Reason: Ratio {entry.ratioZ >= 0 ? '↑' : '↓'}{' '}
                        {formatNumber(Math.abs(entry.ratioZ), 1)}σ · PSNR{' '}
                        {entry.psnrZ >= 0 ? '↑' : '↓'} {formatNumber(Math.abs(entry.psnrZ), 1)}σ
                      </div>
                    </div>
                    <div>
                      <span>Ratio</span>
                      <strong>{formatNumber(entry.item.ratio, 2)}x</strong>
                    </div>
                    <div>
                      <span>PSNR</span>
                      <strong>{formatNumber(entry.item.psnr ?? 0, 1)}</strong>
                    </div>
                    <div>
                      <span>Risk index</span>
                      <strong className="anomaly-score">{formatNumber(entry.score, 2)}</strong>
                    </div>
                    <div className="row-actions">
                      <Link className="link-button" to="/compare">
                        Inspect
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      <div className="section-divider" />

      <section className="panel" data-label="Link Timing">
        <div className="panel-title">
          <div>
            <h2>Mission timeline</h2>
            <p>Estimated capture → encode → downlink → decode timing per transmission.</p>
          </div>
        </div>
        {timelineRuns.length === 0 && <div className="empty">No transmissions yet.</div>}
        {timelineRuns.length > 0 && (
          <div className="timeline">
            {timelineRuns.map((item) => {
              const { captureMs, encodeMs, downlinkMs, decodeMs, totalMs } =
                estimateTimeline(item)
              const capturePct = (captureMs / totalMs) * 100
              const encodePct = (encodeMs / totalMs) * 100
              const downlinkPct = (downlinkMs / totalMs) * 100
              const decodePct = (decodeMs / totalMs) * 100
              return (
                <div className="timeline-row" key={item.id}>
                  <div className="timeline-meta">
                    <strong>{item.filename ?? item.id}</strong>
                    <span>{formatDate(item.created_at)}</span>
                  </div>
                  <div className="timeline-bar" aria-label="Transmission timeline">
                    <div
                      className="timeline-seg capture"
                      style={{ width: `${capturePct}%` }}
                      data-tooltip={`Capture ${formatDuration(captureMs)}`}
                    />
                    <div
                      className="timeline-seg encode"
                      style={{ width: `${encodePct}%` }}
                      data-tooltip={`Encode ${formatDuration(encodeMs)}`}
                    />
                    <div
                      className="timeline-seg downlink"
                      style={{ width: `${downlinkPct}%` }}
                      data-tooltip={`Downlink ${formatDuration(downlinkMs)}`}
                    />
                    <div
                      className="timeline-seg decode"
                      style={{ width: `${decodePct}%` }}
                      data-tooltip={`Decode ${formatDuration(decodeMs)}`}
                    />
                  </div>
                  <div className="timeline-details">
                    Capture {formatDuration(captureMs)} · Encode {formatDuration(encodeMs)} ·
                    Downlink {formatDuration(downlinkMs)} · Decode {formatDuration(decodeMs)} ·
                    Total {formatDuration(totalMs)}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      <div className="section-divider" />

      <section className="panel actions" data-label="Command Actions">
        <h2>Quick actions</h2>
        <div className="action-row">
          <Link className="link-button" to="/compress">
            Start new compression
          </Link>
          <Link className="link-button" to="/compare">
            Compare results
          </Link>
          <Link className="link-button" to="/settings">
            Configure API
          </Link>
        </div>
      </section>
    </div>
  )
}
