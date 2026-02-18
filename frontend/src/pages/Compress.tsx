import { useState } from 'react'
import { compressImage } from '../lib/api'
import type { ApiResult } from '../lib/types'
import { useApiBase } from '../context/ApiContext'
import { useHistoryData } from '../context/HistoryContext'
import { formatBytes, formatNumber } from './helpers'

const LEVEL_MIN = 2
const LEVEL_MAX = 256
const PRESETS = [
  { label: 'Low', value: 4 },
  { label: 'Balanced', value: 16 },
  { label: 'High', value: 64 },
  { label: 'Ultra', value: 128 },
]

type QueueItem = {
  id: string
  file: File
  status: 'queued' | 'uploading' | 'done' | 'error'
  error?: string
}

const createId = () =>
  `local-${Date.now()}-${Math.random().toString(16).slice(2)}`

const clampLevel = (value: number) =>
  Math.min(LEVEL_MAX, Math.max(LEVEL_MIN, Math.round(value || LEVEL_MIN)))

export default function Compress() {
  const { base } = useApiBase()
  const { add } = useHistoryData()
  const [level, setLevel] = useState(16)
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 0 })
  const [lastResult, setLastResult] = useState<ApiResult | null>(null)

  const handleFiles = (files: FileList | null) => {
    if (!files) return
    const items = Array.from(files).map((file) => ({
      id: createId(),
      file,
      status: file.type.startsWith('image/') ? 'queued' : 'error',
      error: file.type.startsWith('image/') ? undefined : 'Unsupported file type',
    }))
    setQueue((prev) => [...prev, ...items])
  }

  const updateItem = (id: string, patch: Partial<QueueItem>) => {
    setQueue((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }

  const processQueue = async () => {
    const pending = queue.filter((item) => item.status === 'queued')
    if (!pending.length) return

    setProcessing(true)
    setProgress({ current: 0, total: pending.length })

    let index = 0
    for (const item of pending) {
      index += 1
      setProgress({ current: index, total: pending.length })
      updateItem(item.id, { status: 'uploading' })

      try {
        const data = await compressImage(base, item.file, level)
        updateItem(item.id, { status: 'done' })
        add(data)
        setLastResult(data)
      } catch (err) {
        updateItem(item.id, {
          status: 'error',
          error: err instanceof Error ? err.message : 'Upload failed',
        })
      }
    }

    setProcessing(false)
  }

  const progressPercent =
    progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0

  return (
    <div className="page">
      <div className="grid two-column">
        <section className="panel" data-label="Queue Control">
        <div className="panel-title">
          <div>
            <h2>Downlink Queue</h2>
            <p>Batch upload enabled. Sequential processing.</p>
          </div>
          <span className="pill">Level {level}</span>
        </div>

        <div className="preset-row">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              className={`preset ${level === preset.value ? 'active' : ''}`}
              onClick={() => setLevel(preset.value)}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="level-controls">
          <input
            type="range"
            min={LEVEL_MIN}
            max={LEVEL_MAX}
            value={level}
            onChange={(e) => setLevel(clampLevel(Number(e.target.value)))}
          />
          <input
            type="number"
            min={LEVEL_MIN}
            max={LEVEL_MAX}
            value={level}
            onChange={(e) => setLevel(clampLevel(Number(e.target.value)))}
          />
        </div>

        <label className="file-label">
          Upload rover frames
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              handleFiles(e.target.files)
              e.currentTarget.value = ''
            }}
          />
        </label>

        <div className="queue">
          {queue.length === 0 && (
            <div className="empty">No files queued yet.</div>
          )}
          {queue.map((item) => (
            <div className="queue-item" key={item.id}>
              <div>
                <strong>{item.file.name}</strong>
                <span>{formatBytes(item.file.size)}</span>
              </div>
              <div className={`status ${item.status}`}>{item.status}</div>
              {item.error && <p className="queue-error">{item.error}</p>}
            </div>
          ))}
        </div>

        <button className="cta" type="button" onClick={processQueue} disabled={processing}>
          {processing ? 'Compressing...' : 'Compress queued images'}
        </button>

        {processing && (
          <div className="progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>
            <span>
              Processing {progress.current} / {progress.total}
            </span>
          </div>
        )}
        </section>

        <section className="panel scan-panel" data-label="Result Telemetry">
        <div className="panel-title">
          <div>
            <h2>Latest result</h2>
            <p>Metrics from the most recent upload.</p>
          </div>
        </div>

        {!lastResult && <div className="empty">No results yet.</div>}

        {lastResult && (
          <div className="stats">
            <div>
              <span>Original</span>
              <strong>{formatBytes(lastResult.original_size)}</strong>
            </div>
            <div>
              <span>Compressed</span>
              <strong>{formatBytes(lastResult.compressed_size)}</strong>
            </div>
            <div>
              <span>Ratio</span>
              <strong>{lastResult.ratio}x</strong>
            </div>
            <div>
              <span>Bits / pixel</span>
              <strong>{formatNumber(lastResult.bpp, 3)}</strong>
            </div>
          </div>
        )}
        </section>
      </div>
    </div>
  )
}
