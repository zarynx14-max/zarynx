'use client'

import { useMemo, useState } from 'react'
import { ArrowLeftRight, ChevronRight, Copy, Share2 } from 'lucide-react'
import { SENS_GAMES, findGame, cmPer360, convertSens } from '@/data/sensitivityGames'

const DPI_PRESETS = [400, 800, 1600, 3200]

export function SensitivityConverterClient() {
  const [fromId, setFromId] = useState('cs2')
  const [toId, setToId] = useState('valorant')
  const [sens, setSens] = useState(1.5)
  const [dpi, setDpi] = useState(800)
  const [advOpen, setAdvOpen] = useState(false)
  const [dpiTarget, setDpiTarget] = useState(800)
  const [copied, setCopied] = useState(false)

  const from = findGame(fromId)
  const to = findGame(toId)
  const effectiveTargetDpi = advOpen ? dpiTarget : dpi

  const result = useMemo(() => {
    const targetSens = convertSens(sens, dpi, effectiveTargetDpi, from.yaw, to.yaw)
    const cm360Source = cmPer360(sens, dpi, from.yaw)
    const cm360Target = cmPer360(targetSens, effectiveTargetDpi, to.yaw)
    const edpiSource = dpi * sens
    const edpiTarget = effectiveTargetDpi * targetSens
    return { targetSens, cm360Source, cm360Target, edpiSource, edpiTarget }
  }, [sens, dpi, effectiveTargetDpi, from, to])

  const tableRows = useMemo(() => {
    return SENS_GAMES
      .map(g => ({ game: g, sens: convertSens(sens, dpi, dpi, from.yaw, g.yaw) }))
      .sort((a, b) => a.sens - b.sens)
  }, [sens, dpi, from])

  function formatSens(v: number) {
    return v < 0.01 ? v.toFixed(5) : v.toFixed(3)
  }

  function handleSwap() {
    setFromId(toId)
    setToId(fromId)
  }

  function handleCopy() {
    const text = `${from.name} \u2192 ${to.name}: ${formatSens(result.targetSens)} sens (${sens} @ ${dpi} DPI) \u2014 zarynx.com/tools/sensitivity-converter`
    navigator.clipboard?.writeText(text).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  async function handleShare() {
    const text = `My ${to.name} sensitivity is ${formatSens(result.targetSens)} (converted from ${from.name}) \u2014 check yours on Zarynx`
    const url = 'https://zarynx.com/tools/sensitivity-converter'
    if (navigator.share) {
      try { await navigator.share({ title: 'Sensitivity Converter', text, url }) } catch { /* user cancelled */ }
    } else {
      navigator.clipboard?.writeText(`${text} ${url}`).catch(() => {})
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  const padSize = Math.max(56, Math.min(112, result.cm360Source * 1.5))

  return (
    <div>
      {/* Converter card */}
      <div className="rounded-[14px] border border-[var(--border)] bg-[var(--bg2)] p-5">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label className="mb-[6px] block text-[11px] font-medium uppercase tracking-[0.05em] text-[var(--t3)]">
              Current game
            </label>
            <select
              value={fromId}
              onChange={e => setFromId(e.target.value)}
              className="w-full rounded-[9px] border border-[var(--border)] bg-[var(--bg3)] px-3 py-[11px] text-[14px] text-[var(--t1)] outline-none transition-colors focus:border-[var(--mint)]"
            >
              {SENS_GAMES.map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleSwap}
            title="Swap games"
            className="flex h-[42px] w-[42px] flex-shrink-0 items-center justify-center rounded-[9px] border border-[var(--border)] bg-[var(--bg3)] text-[var(--t2)] transition-all hover:border-[var(--mint)] hover:bg-[rgba(0,229,160,0.08)] hover:text-[var(--mint)]"
          >
            <ArrowLeftRight size={16} />
          </button>
          <div className="flex-1">
            <label className="mb-[6px] block text-[11px] font-medium uppercase tracking-[0.05em] text-[var(--t3)]">
              Convert to
            </label>
            <select
              value={toId}
              onChange={e => setToId(e.target.value)}
              className="w-full rounded-[9px] border border-[var(--border)] bg-[var(--bg3)] px-3 py-[11px] text-[14px] text-[var(--t1)] outline-none transition-colors focus:border-[var(--mint)]"
            >
              {SENS_GAMES.map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Sensitivity slider */}
        <div className="mt-4">
          <div className="mb-2 flex items-baseline justify-between">
            <label className="text-[11px] font-medium uppercase tracking-[0.05em] text-[var(--t3)]">
              Your sensitivity
            </label>
            <span className="font-mono text-[13px] font-medium text-[var(--mint)]">{sens.toFixed(3)}</span>
          </div>
          <input
            type="range"
            min={0.01}
            max={10}
            step={0.001}
            value={Math.min(sens, 10)}
            onChange={e => setSens(parseFloat(e.target.value))}
            className="h-1 w-full cursor-pointer appearance-none rounded-full bg-[var(--bg3)] accent-[var(--mint)]"
          />
        </div>

        <div className="mt-4 flex gap-3">
          <div className="flex-1">
            <label className="mb-[6px] block text-[11px] font-medium uppercase tracking-[0.05em] text-[var(--t3)]">
              Exact sensitivity
            </label>
            <input
              type="number"
              step={0.001}
              value={sens}
              onChange={e => setSens(parseFloat(e.target.value) || 0)}
              className="w-full rounded-[9px] border border-[var(--border)] bg-[var(--bg3)] px-3 py-[11px] text-[14px] text-[var(--t1)] outline-none transition-colors focus:border-[var(--mint)]"
            />
          </div>
          <div className="flex-1">
            <label className="mb-[6px] block text-[11px] font-medium uppercase tracking-[0.05em] text-[var(--t3)]">
              Mouse DPI
            </label>
            <input
              type="number"
              step={1}
              value={dpi}
              onChange={e => setDpi(parseFloat(e.target.value) || 0)}
              className="w-full rounded-[9px] border border-[var(--border)] bg-[var(--bg3)] px-3 py-[11px] text-[14px] text-[var(--t1)] outline-none transition-colors focus:border-[var(--mint)]"
            />
          </div>
        </div>

        <div className="mt-2 flex gap-[6px]">
          {DPI_PRESETS.map(p => (
            <button
              key={p}
              onClick={() => setDpi(p)}
              className={`rounded-[7px] border px-[11px] py-[5px] text-[11px] transition-all ${
                dpi === p
                  ? 'border-[var(--mint)] bg-[rgba(0,229,160,0.08)] text-[var(--t1)]'
                  : 'border-[var(--border)] bg-[var(--bg3)] text-[var(--t3)] hover:text-[var(--t1)]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Advanced */}
        <button
          onClick={() => setAdvOpen(o => !o)}
          className="mt-4 flex items-center gap-[6px] text-[12px] text-[var(--t3)] transition-colors hover:text-[var(--t2)]"
        >
          <ChevronRight size={12} className={`transition-transform ${advOpen ? 'rotate-90' : ''}`} />
          Advanced &mdash; different DPI on target game
        </button>
        {advOpen && (
          <div className="mt-3 border-t border-[var(--border)] pt-3">
            <label className="mb-[6px] block text-[11px] font-medium uppercase tracking-[0.05em] text-[var(--t3)]">
              Target game DPI
            </label>
            <input
              type="number"
              step={1}
              value={dpiTarget}
              onChange={e => setDpiTarget(parseFloat(e.target.value) || 0)}
              className="w-full rounded-[9px] border border-[var(--border)] bg-[var(--bg3)] px-3 py-[11px] text-[14px] text-[var(--t1)] outline-none transition-colors focus:border-[var(--mint)] sm:w-1/2"
            />
          </div>
        )}
      </div>

      {/* Result card */}
      <div className="mt-5 overflow-hidden rounded-[14px] border border-[var(--border)] bg-[var(--bg2)]">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--border)] p-5">
          <div>
            <div className="font-mono text-[42px] font-medium leading-none text-[var(--mint)] sm:text-[46px]">
              {formatSens(result.targetSens)}
            </div>
            <div className="mt-2 text-[12px] text-[var(--t3)]">{to.name} sensitivity</div>
          </div>
          <div className="flex items-center gap-[6px] whitespace-nowrap rounded-full border border-[var(--border)] bg-[var(--bg3)] px-3 py-[6px] text-[12px] text-[var(--t2)]">
            {from.name} <span className="text-[var(--mint)]">&rarr;</span> {to.name}
          </div>
        </div>

        <div className="flex flex-wrap gap-6 border-b border-[var(--border)] px-5 py-4">
          <div>
            <div className="text-[11px] text-[var(--t3)]">cm/360</div>
            <div className="mt-[3px] font-mono text-[16px] font-medium text-[var(--t1)]">{result.cm360Source.toFixed(1)} cm</div>
          </div>
          <div>
            <div className="text-[11px] text-[var(--t3)]">eDPI (source)</div>
            <div className="mt-[3px] font-mono text-[16px] font-medium text-[var(--t1)]">{Math.round(result.edpiSource)}</div>
          </div>
          <div>
            <div className="text-[11px] text-[var(--t3)]">eDPI (target)</div>
            <div className="mt-[3px] font-mono text-[16px] font-medium text-[var(--t1)]">{Math.round(result.edpiTarget)}</div>
          </div>
          <div>
            <div className="text-[11px] text-[var(--t3)]">Mouse travel</div>
            <div className="mt-[3px] font-mono text-[16px] font-medium text-[var(--t1)]">{(result.cm360Source / 2.54).toFixed(1)} in</div>
          </div>
        </div>

        {/* Mousepad visual */}
        <div className="border-b border-[var(--border)] p-5">
          <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.05em] text-[var(--t3)]">
            Physical mouse movement for a 360&deg; turn
          </div>
          <div className="flex items-center justify-center gap-6">
            <div className="text-center">
              <div
                className="mx-auto mb-[10px] flex items-center justify-center rounded-[10px] border border-dashed border-[var(--border2)] bg-white/[0.02] transition-all duration-300"
                style={{ width: padSize, height: padSize }}
              >
                <div
                  className="rounded-full border-2 border-[var(--mint)] transition-all duration-300"
                  style={{ width: padSize * 0.78, height: padSize * 0.78 }}
                />
              </div>
              <div className="text-[11px] text-[var(--t3)]">{from.name}</div>
              <div className="text-[13px] font-medium text-[var(--t1)]">{result.cm360Source.toFixed(1)} cm/360</div>
            </div>
            <div className="text-[11px] text-[var(--t3)]">=</div>
            <div className="text-center">
              <div
                className="mx-auto mb-[10px] flex items-center justify-center rounded-[10px] border border-dashed border-[var(--border2)] bg-white/[0.02] transition-all duration-300"
                style={{ width: padSize, height: padSize }}
              >
                <div
                  className="rounded-full border-2 border-[var(--mint)] transition-all duration-300"
                  style={{ width: padSize * 0.78, height: padSize * 0.78 }}
                />
              </div>
              <div className="text-[11px] text-[var(--t3)]">{to.name}</div>
              <div className="text-[13px] font-medium text-[var(--t1)]">{result.cm360Target.toFixed(1)} cm/360</div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 p-4">
          <button
            onClick={handleCopy}
            className="flex items-center gap-[6px] rounded-[8px] border border-[rgba(0,229,160,0.25)] bg-[rgba(0,229,160,0.06)] px-[14px] py-[9px] text-[12px] text-[var(--mint)] transition-colors hover:bg-[rgba(0,229,160,0.12)]"
          >
            <Copy size={12} />
            {copied ? 'Copied!' : 'Copy result'}
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-[6px] rounded-[8px] border border-[var(--border)] bg-[var(--bg3)] px-[14px] py-[9px] text-[12px] text-[var(--t2)] transition-colors hover:text-[var(--t1)]"
          >
            <Share2 size={12} />
            Share
          </button>
        </div>
      </div>

      {/* Comparison table */}
      <div className="mt-5 overflow-hidden rounded-[14px] border border-[var(--border)] bg-[var(--bg2)]">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <h3 className="text-[14px] font-medium text-[var(--t1)]">Your sensitivity across all games</h3>
          <span className="text-[11px] text-[var(--t3)]">matched to same cm/360</span>
        </div>
        <div>
          {tableRows.map(row => {
            const isHi = row.game.id === fromId || row.game.id === toId
            return (
              <div
                key={row.game.id}
                className={`grid grid-cols-[1fr_90px] items-center gap-2 border-b border-[var(--border)] px-5 py-3 text-[13px] last:border-b-0 sm:grid-cols-[1fr_90px_90px] ${
                  isHi ? 'bg-[rgba(0,229,160,0.05)]' : ''
                }`}
              >
                <div className="flex items-center gap-2 text-[var(--t1)]">
                  <span
                    className={`inline-block h-[6px] w-[6px] flex-shrink-0 rounded-full ${
                      isHi ? 'bg-[var(--mint)] shadow-[0_0_6px_rgba(0,229,160,0.6)]' : 'bg-[var(--border2)]'
                    }`}
                  />
                  {row.game.name}
                </div>
                <div className="text-right font-mono text-[var(--t1)]">{formatSens(row.sens)}</div>
                <div className="hidden text-right font-mono text-[12px] text-[var(--t3)] sm:block">
                  {result.cm360Source.toFixed(1)} cm
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
