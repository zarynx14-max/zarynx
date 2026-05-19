'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Monitor, Crosshair, Activity } from 'lucide-react'
import {
  ToolBreadcrumb, ToolHeader,
  ToolExplanation, ToolHowTo, ToolFaq, ToolRelated,
  ToolLayout, ToolSection, SectionLabel,
} from '@/components/tool'

// ── TYPES ─────────────────────────────────────────────────────────────────────

type GameState = 'idle' | 'waiting' | 'ready' | 'result' | 'early'

interface Rating {
  cls:         string
  label:       string
  color:       string
  bgColor:     string
  borderColor: string
}

// ── RATINGS ───────────────────────────────────────────────────────────────────

const RATINGS: Array<{ max: number } & Rating> = [
  { max: 150,      cls: 'superhuman', label: 'Superhuman',     color: '#c084fc', bgColor: 'rgba(192,132,252,0.09)', borderColor: 'rgba(192,132,252,0.35)' },
  { max: 200,      cls: 'lightning',  label: 'Lightning Fast',  color: '#00e5a0', bgColor: 'rgba(0,229,160,0.07)',   borderColor: 'rgba(0,229,160,0.35)'   },
  { max: 250,      cls: 'excellent',  label: 'Excellent',       color: '#60d8fa', bgColor: 'rgba(96,216,250,0.08)',  borderColor: 'rgba(96,216,250,0.35)'  },
  { max: 300,      cls: 'above',      label: 'Above Average',   color: '#7c6dff', bgColor: 'rgba(124,109,255,0.09)', borderColor: 'rgba(124,109,255,0.35)' },
  { max: 400,      cls: 'average',    label: 'Average',         color: '#ffd166', bgColor: 'rgba(255,209,102,0.08)', borderColor: 'rgba(255,209,102,0.35)' },
  { max: 500,      cls: 'below',      label: 'Below Average',   color: '#fb923c', bgColor: 'rgba(251,146,60,0.08)',  borderColor: 'rgba(251,146,60,0.35)'  },
  { max: Infinity, cls: 'slow',       label: 'Slow',            color: '#ff4d6a', bgColor: 'rgba(255,77,106,0.09)',  borderColor: 'rgba(255,77,106,0.35)'  },
]

function getRating(ms: number): Rating {
  return RATINGS.find(r => ms < r.max)!
}

// ── STAT CARD ─────────────────────────────────────────────────────────────────

function StatCard({ label, value, unit, topColor, valColor }: {
  label: string; value: string; unit: string; topColor: string; valColor: string
}) {
  return (
    <div className="relative overflow-hidden rounded-[8px] border border-[var(--border)] p-3"
      style={{ background: `linear-gradient(135deg, ${topColor}0D 0%, var(--bg2) 55%)`, borderColor: `${topColor}55` }}>
      <div className="absolute left-0 right-0 top-0 h-[2px] rounded-t-[8px]" style={{ background: topColor }} />
      <span className="mb-[3px] block text-[9px] font-semibold uppercase tracking-[0.1em] text-[var(--t3)]">{label}</span>
      <span className="block font-mono text-[20px] font-medium leading-none" style={{ color: valColor }}>{value}</span>
      <span className="mt-[2px] block text-[10px] text-[var(--t3)]">{unit}</span>
    </div>
  )
}

// ── DIST BAR ──────────────────────────────────────────────────────────────────

function DistBar({ label, color, count, maxCount }: { label: string; color: string; count: number; maxCount: number }) {
  const pct = maxCount > 0 ? Math.round((count / maxCount) * 100) : 0
  return (
    <div className="flex items-center gap-2 text-[10px]">
      <div className="w-[80px] shrink-0 overflow-hidden text-ellipsis whitespace-nowrap font-mono" style={{ color }}>{label}</div>
      <div className="h-[5px] flex-1 overflow-hidden rounded-full bg-[#1b1d28]">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className="w-5 shrink-0 text-right font-mono" style={{ color: count > 0 ? color : 'var(--t3)' }}>{count}</div>
    </div>
  )
}

// ── TREND CHART (Chart.js via canvas) ─────────────────────────────────────────

function TrendChart({ attempts }: { attempts: number[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef  = useRef<unknown>(null)

  useEffect(() => {
    if (attempts.length < 2) return
    if (!canvasRef.current) return

    // Dynamically import Chart.js to avoid SSR issues
    import('chart.js/auto').then(({ default: Chart }) => {
      if (chartRef.current) {
        (chartRef.current as InstanceType<typeof Chart>).destroy()
        chartRef.current = null
      }

      const ctx    = canvasRef.current!.getContext('2d')!
      const avg    = Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length)
      const r      = getRating(avg)
      const labels = attempts.map((_, i) => `#${i + 1}`)
      const colors = attempts.map(ms => getRating(ms).color)

      const grad = ctx.createLinearGradient(0, 0, 0, 180)
      grad.addColorStop(0, 'rgba(0,229,160,0.18)')
      grad.addColorStop(1, 'rgba(0,229,160,0.00)')

      const avgLinePlugin = {
        id: 'avgLine',
        afterDraw(chart: unknown) {
          const c = chart as { ctx: CanvasRenderingContext2D; chartArea: { left: number; right: number }; scales: { y: { getPixelForValue: (v: number) => number } } }
          const { ctx: c2d, chartArea: { left, right }, scales: { y } } = c
          const yPos = y.getPixelForValue(avg)
          c2d.save()
          c2d.beginPath()
          c2d.setLineDash([5, 4])
          c2d.moveTo(left, yPos)
          c2d.lineTo(right, yPos)
          c2d.strokeStyle = 'rgba(255,209,102,0.5)'
          c2d.lineWidth = 1.4
          c2d.stroke()
          c2d.setLineDash([])
          c2d.font = '10px DM Mono,monospace'
          c2d.fillStyle = 'rgba(255,209,102,0.65)'
          c2d.fillText(`avg ${avg}ms — ${r.label}`, right - 120, yPos - 5)
          c2d.restore()
        }
      }

      chartRef.current = new Chart(ctx, {
        type: 'line',
        plugins: [avgLinePlugin],
        data: {
          labels,
          datasets: [{
            data: attempts,
            borderColor: '#00e5a0',
            backgroundColor: grad,
            borderWidth: 2.2,
            pointBackgroundColor: colors,
            pointBorderColor: 'transparent',
            pointRadius: 5,
            pointHoverRadius: 7,
            tension: 0.38,
            fill: true,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 380 },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#14161e',
              borderColor: '#22253a',
              borderWidth: 1,
              titleColor: '#5c6080',
              bodyColor: '#eef0f8',
              bodyFont: { family: 'DM Mono', size: 12 },
              callbacks: {
                label: (ctx: import('chart.js').TooltipItem<'line'>) => {
                  const ms = ctx.parsed.y as number
                  return ` ${ms}ms — ${getRating(ms).label}`
                }
              }
            }
          },
          scales: {
            x: {
              grid: { color: 'rgba(34,37,58,0.8)' },
              ticks: { color: '#5c6080', font: { family: 'DM Mono', size: 9 } },
              border: { color: '#22253a' }
            },
            y: {
              grid: { color: 'rgba(34,37,58,0.8)' },
              ticks: { color: '#5c6080', font: { family: 'DM Mono', size: 9 }, callback: (v: unknown) => `${v}ms` },
              border: { color: '#22253a' }
            }
          }
        }
      })
    })

    return () => {
      if (chartRef.current) {
        (chartRef.current as { destroy: () => void }).destroy()
        chartRef.current = null
      }
    }
  }, [attempts])

  if (attempts.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-10 opacity-50">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5c6080" strokeWidth="1.8" strokeLinecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
        <p className="text-[12px] text-[var(--t3)]">Complete 2+ attempts to see your trend</p>
      </div>
    )
  }

  return (
    <div className="relative" style={{ height: 190 }}>
      <canvas ref={canvasRef} />
    </div>
  )
}

// ── GAUGE ─────────────────────────────────────────────────────────────────────

function Gauge({ ms }: { ms: number | null }) {
  if (ms == null) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-8 opacity-50">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5c6080" strokeWidth="1.8" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        <p className="text-[12px] text-[var(--t3)]">Run a test to see your speed gauge</p>
      </div>
    )
  }
  const r      = getRating(ms)
  const MIN    = 100, MAX = 700
  const pct    = Math.min(1, Math.max(0, (ms - MIN) / (MAX - MIN)))
  const arcLen = 236
  const offset = arcLen - arcLen * (1 - pct)
  const arcCol = pct < 0.2 ? '#00e5a0' : pct < 0.45 ? '#ffd166' : '#ff4d6a'
  const deg    = -90 + pct * 180

  return (
    <div className="flex flex-col items-center gap-1 pt-2">
      <svg viewBox="0 0 180 100" className="w-[160px] overflow-visible">
        <defs>
          <linearGradient id="gaugeGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#00e5a0" />
            <stop offset="40%"  stopColor="#ffd166" />
            <stop offset="100%" stopColor="#ff4d6a" />
          </linearGradient>
        </defs>
        <path d="M 15 90 A 75 75 0 0 1 165 90" fill="none" stroke="#1b1d28" strokeWidth="12" strokeLinecap="round" />
        <path d="M 15 90 A 75 75 0 0 1 165 90" fill="none" stroke="url(#gaugeGrad2)" strokeWidth="12" strokeLinecap="round" opacity="0.2" />
        <path d="M 15 90 A 75 75 0 0 1 165 90" fill="none" stroke={arcCol} strokeWidth="12" strokeLinecap="round"
          strokeDasharray={arcLen} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset .6s cubic-bezier(.34,1.2,.64,1), stroke .4s' }} />
        {/* needle — use SVG transform attribute, NOT CSS transform */}
        <g transform={`rotate(${deg}, 90, 90)`}>
          <line x1="90" y1="90" x2="90" y2="24" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
        </g>
        <circle cx="90" cy="90" r="4.5" fill="#fff" opacity="0.9" />
        <text x="13"  y="106" fill="#5c6080" fontSize="9" fontFamily="DM Mono,monospace">150</text>
        <text x="153" y="106" fill="#5c6080" fontSize="9" fontFamily="DM Mono,monospace" textAnchor="end">600+</text>
      </svg>
      <div className="font-mono text-[28px] font-medium leading-none" style={{ color: r.color }}>{ms}</div>
      <div className="font-mono text-[10px] text-[var(--t3)]">ms</div>
      <div
        className="mt-1 inline-flex items-center gap-[5px] rounded-full border px-3 py-[3px] text-[10px] font-semibold uppercase tracking-[0.07em]"
        style={{ color: r.color, borderColor: r.borderColor, background: r.bgColor }}
      >
        <span className="h-[6px] w-[6px] rounded-full" style={{ background: r.color }} />
        {r.label}
      </div>
    </div>
  )
}

// ── PAGE ──────────────────────────────────────────────────────────────────────

export default function ReactionTesterPage() {
  const [gameState, setGameState] = useState<GameState>('idle')
  const [attempts,  setAttempts]  = useState<number[]>([])
  const [lastMs,    setLastMs]    = useState<number | null>(null)

  const waitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const startTimeRef = useRef<number>(0)

  const total = attempts.length
  const best  = total ? Math.min(...attempts) : null
  const worst = total ? Math.max(...attempts) : null
  const avg   = total ? Math.round(attempts.reduce((s, a) => s + a, 0) / total) : null
  const maxMs = worst ?? 1

  const buckets = RATINGS.map(r => ({
    ...r,
    count: attempts.filter(ms => getRating(ms).cls === r.cls).length,
  }))
  const maxBucketCount = Math.max(...buckets.map(b => b.count), 1)

  const goWaiting = useCallback(() => {
    if (waitTimerRef.current) clearTimeout(waitTimerRef.current)
    setGameState('waiting')
    waitTimerRef.current = setTimeout(() => {
      startTimeRef.current = performance.now()
      setGameState('ready')
    }, 1000 + Math.random() * 4000)
  }, [])

  const goIdle = useCallback(() => {
    if (waitTimerRef.current) clearTimeout(waitTimerRef.current)
    setGameState('idle')
  }, [])

  const handlePress = useCallback(() => {
    if (gameState === 'idle' || gameState === 'result' || gameState === 'early') {
      goWaiting()
    } else if (gameState === 'waiting') {
      if (waitTimerRef.current) clearTimeout(waitTimerRef.current)
      setGameState('early')
      setTimeout(goIdle, 1500)
    } else if (gameState === 'ready') {
      const ms = Math.round(performance.now() - startTimeRef.current)
      setLastMs(ms)
      setAttempts(prev => [...prev, ms])
      setGameState('result')
    }
  }, [gameState, goWaiting, goIdle])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ') { e.preventDefault(); handlePress() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handlePress])

  useEffect(() => () => { if (waitTimerRef.current) clearTimeout(waitTimerRef.current) }, [])

  const resetAll = () => { goIdle(); setAttempts([]); setLastMs(null) }

  const lastRating = lastMs != null ? getRating(lastMs) : null

  // Zone styles per state
  const zoneStyle: Record<GameState, { bg: string; border: string }> = {
    idle:    { bg: 'var(--bg2)',  border: 'rgba(255,255,255,0.07)' },
    waiting: { bg: 'var(--bg2)', border: 'rgba(255,255,255,0.07)' },
    ready:   { bg: '#002918',    border: '#00e5a0' },
    result:  { bg: 'var(--bg2)', border: 'rgba(255,255,255,0.07)' },
    early:   { bg: '#180008',    border: '#ff4d6a' },
  }
  const zs = zoneStyle[gameState]

  return (
    <>
      <style>{`
        @keyframes zarynx-blink   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.3;transform:scale(.6)} }
        @keyframes zarynx-breathe { 0%,100%{opacity:.35} 50%{opacity:1} }
        @keyframes zarynx-popin   { 0%{transform:scale(.75);opacity:.2} 100%{transform:scale(1);opacity:1} }
        @keyframes zarynx-shake   { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-9px)} 40%{transform:translateX(9px)} 60%{transform:translateX(-5px)} 80%{transform:translateX(5px)} }
        @keyframes zarynx-slidein { 0%{opacity:0;transform:translateY(-4px)} 100%{opacity:1;transform:translateY(0)} }
        @keyframes zarynx-dotpop  { 0%,80%,100%{transform:scale(.55);background:#2c2f4a} 40%{transform:scale(1.1);background:#5c6080} }
        .zd { width:9px;height:9px;border-radius:50%;background:#2c2f4a;animation:zarynx-dotpop 1.4s ease-in-out infinite }
        .zd:nth-child(2){animation-delay:.2s}
        .zd:nth-child(3){animation-delay:.4s}
      `}</style>

      <ToolBreadcrumb toolName="Reaction Speed Tester" toolSlug="reaction-speed-test" />

      <ToolHeader
        name="Reaction Speed Tester"
        description="Measure your reaction time in milliseconds. Tap or press Space the instant the screen turns green — track your best, average, and improvement over time."
        categoryLabel="Reaction Tool"
        categoryColor="mint"
        typeLabel="Gaming Tools"
        typeColor="blue"
        updatedAt="May 2026"
        usersPerMonth="25,000+"
      />

      <ToolLayout wide>

        {/* STATS */}
        <ToolSection>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <StatCard label="Best"     value={best  != null ? String(best)  : '—'} unit="milliseconds" topColor="#00e5a0" valColor="#00e5a0" />
            <StatCard label="Average"  value={avg   != null ? String(avg)   : '—'} unit="milliseconds" topColor="#ffd166" valColor="#ffd166" />
            <StatCard label="Worst"    value={worst != null ? String(worst) : '—'} unit="milliseconds" topColor="#ff4d6a" valColor="#ff4d6a" />
            <StatCard label="Attempts" value={String(total)}                        unit="total"        topColor="#7c6dff" valColor="#7c6dff" />
          </div>
        </ToolSection>

        {/* TEST ZONE */}
        <ToolSection>
          <SectionLabel>Click the zone to start</SectionLabel>
          <div
            role="button" tabIndex={0}
            aria-label="Reaction test zone"
            onClick={handlePress}
            onKeyDown={e => { if (e.code === 'Space') { e.preventDefault(); handlePress() } }}
            onTouchEnd={e => { e.preventDefault(); handlePress() }}
            className="mb-3 flex min-h-[220px] cursor-pointer select-none items-center justify-center rounded-xl border-2 outline-none transition-colors sm:min-h-[260px]"
            style={{ background: zs.bg, borderColor: zs.border, WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
          >
            {gameState === 'idle' && (
              <div className="flex flex-col items-center gap-3 px-6 text-center">
                <p className="text-[20px] font-bold text-[var(--t2)]">Ready to test?</p>
                <p className="text-[13px] text-[var(--t3)]">Tap the zone or press Spacebar to begin</p>
                <div className="hidden items-center gap-2 text-[12px] text-[var(--t3)] sm:flex">
                  <span className="rounded-[5px] border border-[#2c2f4a] bg-[#1b1d28] px-[10px] pb-[3px] pt-[1px] font-mono text-[11px]" style={{ borderBottom: '3px solid #2c2f4a' }}>Space</span>
                  <span>or click anywhere</span>
                </div>
              </div>
            )}
            {gameState === 'waiting' && (
              <div className="flex flex-col items-center gap-3 text-center">
                <p className="text-[18px] font-bold text-[var(--t3)]" style={{ animation: 'zarynx-breathe 1.8s ease-in-out infinite' }}>Wait for green...</p>
                <div className="flex gap-2"><span className="zd" /><span className="zd" /><span className="zd" /></div>
                <p className="text-[13px] text-[var(--t3)]">Don&apos;t tap yet!</p>
              </div>
            )}
            {gameState === 'ready' && (
              <div className="flex flex-col items-center gap-1 text-center">
                <p className="font-bold leading-none text-[var(--mint)]" style={{ fontSize: 'clamp(52px,15vw,90px)', animation: 'zarynx-popin .12s cubic-bezier(.34,1.56,.64,1)' }}>GO!</p>
                <p className="text-[14px]" style={{ color: '#00e5a0', opacity: 0.7 }}>Tap now!</p>
              </div>
            )}
            {gameState === 'early' && (
              <div className="flex flex-col items-center gap-2 px-6 text-center">
                <p className="font-bold" style={{ fontSize: 'clamp(24px,7vw,44px)', color: '#ff4d6a', animation: 'zarynx-shake .32s ease-out' }}>Too Early!</p>
                <p className="text-[13px]" style={{ color: '#ff4d6a', opacity: 0.75 }}>Wait for the green screen first</p>
              </div>
            )}
            {gameState === 'result' && lastMs != null && lastRating != null && (
              <div className="flex flex-col items-center gap-1 text-center">
                <span
                  className="font-mono font-medium leading-none"
                  style={{ fontSize: 'clamp(52px,13vw,88px)', color: lastRating.color, animation: 'zarynx-popin .2s cubic-bezier(.34,1.56,.64,1)', letterSpacing: '-.03em' }}
                >
                  {lastMs}
                </span>
                <span className="font-mono text-[13px] tracking-[.05em] text-[var(--t3)]">milliseconds</span>
                <span
                  className="mt-1 inline-flex items-center gap-[5px] rounded-full border px-[13px] py-[4px] text-[11px] font-semibold uppercase tracking-[0.07em]"
                  style={{ color: lastRating.color, borderColor: lastRating.borderColor, background: lastRating.bgColor }}
                >
                  <span className="inline-block h-[7px] w-[7px] rounded-full" style={{ background: lastRating.color }} />
                  {lastRating.label}
                </span>
                <span className="mt-1 text-[12px] text-[var(--t3)]">Tap or press Space to try again</span>
              </div>
            )}
          </div>
        </ToolSection>

        {/* CHARTS */}
        <ToolSection>

          {/* Trend — full width using Chart.js */}
          <div className="mb-3 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg2)] p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--t3)]">Reaction Time Trend</p>
              {avg != null && (
                <span
                  className="inline-flex items-center gap-1 rounded-full border px-2 py-[2px] text-[9px] font-semibold"
                  style={{ color: getRating(avg).color, borderColor: getRating(avg).borderColor, background: getRating(avg).bgColor }}
                >
                  {getRating(avg).label}
                </span>
              )}
            </div>
            <TrendChart attempts={attempts} />
          </div>

          {/* Gauge + Distribution side by side */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg2)] p-4">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--t3)]">Latest Speed</p>
              <Gauge ms={lastMs} />
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg2)] p-4">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--t3)]">
                Rating Distribution
                {total > 0 && <span className="ml-2 font-normal text-[var(--t2)]">{total} attempt{total !== 1 ? 's' : ''}</span>}
              </p>
              <div className="flex flex-col gap-[8px]">
                {buckets.map(b => (
                  <DistBar key={b.cls} label={b.label} color={b.color} count={b.count} maxCount={maxBucketCount} />
                ))}
              </div>
              {total === 0 && <p className="mt-3 text-center text-[11px] text-[var(--t3)] opacity-50">Run attempts to fill the chart</p>}
            </div>
          </div>
        </ToolSection>

        {/* HISTORY */}
        <ToolSection>
          <div className="mb-3 flex items-center justify-between">
            <SectionLabel>Attempt History</SectionLabel>
            <button
              onClick={resetAll}
              className="flex items-center gap-[6px] rounded-[8px] border px-[13px] py-[6px] text-[12px] font-semibold text-white transition-all hover:border-[rgba(255,77,106,0.9)]"
              style={{ background: 'rgba(255,77,106,0.16)', borderColor: 'rgba(255,77,106,0.5)' }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ff4d6a" strokeWidth="2" strokeLinecap="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/></svg>
              Reset All
            </button>
          </div>
          <p className="mb-2 text-[11px] text-[var(--t3)]">
            {total === 0 ? 'No attempts yet' : <><span className="font-mono font-medium text-[var(--mint)]">{total}</span> attempt{total !== 1 ? 's' : ''} recorded · newest first</>}
          </p>
          {total === 0 ? (
            <p className="py-3 text-[12px] text-[var(--t3)]">Start the test above to record attempts.</p>
          ) : (
            <div className="flex flex-col gap-[5px] overflow-y-auto rounded-[8px] pr-[2px]" style={{ maxHeight: `calc(6 * 50px + 5 * 5px)`, scrollbarWidth: 'thin' }}>
              {[...attempts].reverse().map((ms, i) => {
                const r    = getRating(ms)
                const num  = total - i
                const avgV = avg!
                const diff = ms - avgV
                const dStr = diff === 0 ? '±0ms' : diff > 0 ? `+${diff}ms` : `${diff}ms`
                const dCol = diff <= 0 ? '#00e5a0' : '#5c6080'
                const barW = Math.round((ms / maxMs) * 100)
                return (
                  <div
                    key={attempts.length - 1 - i}
                    className={`flex min-h-[46px] shrink-0 items-center gap-[10px] rounded-[8px] border px-3 py-[9px] ${i === 0 ? 'border-[#2c2f4a] bg-[var(--bg3)]' : 'border-[var(--border)] bg-[var(--bg2)]'}`}
                    style={{ animation: i === 0 ? 'zarynx-slidein 0.2s ease-out' : 'none' }}
                  >
                    <span className="w-[22px] shrink-0 text-[10px] text-[var(--t3)]">#{num}</span>
                    <span className="flex-1 font-mono text-[14px] font-medium" style={{ color: r.color }}>{ms}ms</span>
                    <div className="h-[4px] w-[40px] shrink-0 overflow-hidden rounded-full bg-[#1b1d28]">
                      <div className="h-full rounded-full" style={{ width: `${barW}%`, background: r.color }} />
                    </div>
                    <span
                      className="shrink-0 rounded-full border px-2 py-[2px] text-[9px] font-semibold uppercase tracking-[0.06em]"
                      style={{ color: r.color, borderColor: r.borderColor, background: r.bgColor }}
                    >
                      {r.label}
                    </span>
                    <span className="hidden w-[48px] shrink-0 text-right font-mono text-[10px] sm:block" style={{ color: dCol }}>{dStr}</span>
                  </div>
                )
              })}
            </div>
          )}
        </ToolSection>

        {/* RATING TABLE */}
        <ToolSection>
          <SectionLabel>Rating Guide</SectionLabel>
          <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg2)]">
            <table className="w-full border-collapse text-[12px]">
              <thead>
                <tr>
                  <th className="border-b border-[var(--border)] px-[13px] py-[9px] text-left text-[9px] font-semibold uppercase tracking-[.1em] text-[var(--t3)]">Time</th>
                  <th className="border-b border-[var(--border)] px-[13px] py-[9px] text-left text-[9px] font-semibold uppercase tracking-[.1em] text-[var(--t3)]">Rating</th>
                  <th className="hidden border-b border-[var(--border)] px-[13px] py-[9px] text-left text-[9px] font-semibold uppercase tracking-[.1em] text-[var(--t3)] sm:table-cell">What it means</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { time: '<150ms',    r: RATINGS[0], meaning: 'Likely anticipating — or a bot!' },
                  { time: '150–200ms', r: RATINGS[1], meaning: 'Top 1% of human reactions' },
                  { time: '200–250ms', r: RATINGS[2], meaning: 'Elite gamer territory' },
                  { time: '250–300ms', r: RATINGS[3], meaning: 'Faster than most players' },
                  { time: '300–400ms', r: RATINGS[4], meaning: 'Typical human reaction time' },
                  { time: '400–500ms', r: RATINGS[5], meaning: 'Room to improve with practice' },
                  { time: '>500ms',    r: RATINGS[6], meaning: 'Keep practicing!' },
                ].map(({ time, r, meaning }, i, arr) => (
                  <tr key={time} className="hover:bg-[var(--bg3)]">
                    <td className={`px-[13px] py-[9px] font-mono text-[var(--t2)] ${i < arr.length - 1 ? 'border-b border-[var(--border)]' : ''}`}>{time}</td>
                    <td className={`px-[13px] py-[9px] ${i < arr.length - 1 ? 'border-b border-[var(--border)]' : ''}`}>
                      <span className="inline-flex items-center gap-[5px] rounded-full border px-[9px] py-[2px] text-[10px] font-semibold uppercase tracking-[.06em]"
                        style={{ color: r.color, borderColor: r.borderColor, background: r.bgColor }}>
                        <span className="inline-block h-[5px] w-[5px] rounded-full" style={{ background: r.color }} />
                        {r.label}
                      </span>
                    </td>
                    <td className={`hidden px-[13px] py-[9px] text-[var(--t2)] sm:table-cell ${i < arr.length - 1 ? 'border-b border-[var(--border)]' : ''}`}>{meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ToolSection>

        {/* EXPLANATION */}
        <ToolSection>
          <ToolExplanation
            title="What is reaction time and why does it matter for gaming?"
            paragraphs={[
              "Reaction time is the delay between a stimulus appearing and you responding to it. In gaming, this translates directly to whether you get the first shot off, dodge an attack in time, or react to an enemy push before it's too late.",
              "The average human visual reaction time is around 250ms. Elite gamers typically score between 150–220ms thanks to a combination of genetics, training, and environmental factors like monitor refresh rate and input lag.",
            ]}
            cards={[
              { icon: Activity, iconBg: 'rgba(0,229,160,0.1)', iconColor: 'var(--mint)', title: 'Visual reaction', body: 'Light hits your retina, travels to your brain, and triggers a motor response. This is the baseline your score measures.' },
              { icon: Activity, iconBg: 'rgba(80,140,255,0.1)', iconColor: 'var(--blue)', title: 'Average is 250ms', body: 'Most people react between 200–300ms. Elite FPS players often score 150–200ms. Under 150ms usually means anticipation.' },
              { icon: Activity, iconBg: 'rgba(255,209,102,0.1)', iconColor: '#ffd166', title: 'Training helps', body: 'Consistent practice can shave 20–40ms off your average over weeks. Sleep and hydration also have measurable effects.' },
            ]}
            secondTitle="How to improve your reaction time"
            secondParagraphs={["Practice regularly — 10–15 minutes a day is more effective than occasional long sessions. Make sure your monitor runs at 144Hz or higher. Stay hydrated and well-rested, as fatigue significantly increases reaction time."]}
          />
        </ToolSection>

        <ToolSection>
          <ToolHowTo steps={[
            { title: 'Start the test',   description: 'Tap the green zone or press Spacebar to begin. A random 1–5 second wait begins immediately.' },
            { title: 'Wait for green',   description: "Don't tap during the Wait phase — reacting early counts as a failed attempt." },
            { title: 'React instantly',  description: 'The moment the screen turns green and shows GO!, tap or press Space as fast as you can.' },
            { title: 'Track progress',   description: 'Complete multiple attempts to see your best, average, and trend over time.' },
          ]} />
        </ToolSection>

        <ToolSection>
          <ToolFaq items={[
            { question: 'What is a good reaction time for gaming?', answer: 'For casual gaming, anything under 300ms is fine. Competitive gamers aim for 200–250ms. Elite FPS players often score 150–200ms.' },
            { question: 'Why do my results vary between attempts?', answer: 'Human reaction time naturally varies by 30–80ms between attempts. Your average over 10+ attempts is much more meaningful than any single result.' },
            { question: "Does my monitor's refresh rate affect the test?", answer: 'Yes. A 60Hz monitor adds up to 16.7ms of display lag, while 144Hz adds only ~7ms. Higher refresh rates give lower absolute scores.' },
            { question: 'Can I improve my reaction time?', answer: 'Yes, within limits. Consistent practice can reduce your average by 20–40ms over weeks. Sleep quality and hydration also have measurable short-term effects.' },
            { question: 'Is Spacebar or click more accurate?', answer: 'Clicking a mouse button is typically 5–15ms faster than pressing a key due to shorter travel and lighter actuation force.' },
            { question: 'What is a Superhuman score under 150ms?', answer: 'Scores below 150ms almost always indicate anticipation rather than pure reaction. True visual-motor reaction cannot physically be below ~120ms.' },
          ]} />
        </ToolSection>

      </ToolLayout>

      <ToolRelated tools={[
        { name: 'PC Bottleneck Calculator', description: 'Find out if your CPU or GPU is holding back your gaming performance', slug: 'pc-bottleneck-calculator', icon: Monitor,   iconBg: 'rgba(255,120,64,0.1)', iconColor: 'var(--orange)' },
        { name: 'Sensitivity Converter',    description: 'Convert your mouse sensitivity across CS2, Valorant, Apex and more',   slug: 'sensitivity-converter',    icon: Crosshair, iconBg: 'rgba(0,229,160,0.1)',  iconColor: 'var(--mint)'   },
        { name: 'FPS Benchmark Tool',       description: 'Estimate your expected FPS across popular games and settings',          slug: 'fps-benchmark',            icon: Activity,  iconBg: 'rgba(80,140,255,0.1)', iconColor: 'var(--blue)'   },
      ]} />
    </>
  )
}
