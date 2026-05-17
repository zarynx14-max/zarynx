'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Zap, TrendingUp, Target, RotateCcw, Activity, Timer, Crosshair, Monitor } from 'lucide-react'
import {
  ToolBreadcrumb, ToolHeader,
  ToolExplanation, ToolHowTo, ToolFaq, ToolRelated,
  ToolLayout, ToolSection, SectionLabel,
} from '@/components/tool'

// ── TYPES ────────────────────────────────────────────────────────────────────

type GameState = 'idle' | 'waiting' | 'ready' | 'result' | 'early'

interface Attempt {
  ms: number
  rating: Rating
}

interface Rating {
  label: string
  cls: string
  color: string
  bgColor: string
  borderColor: string
}

// ── RATINGS ──────────────────────────────────────────────────────────────────

const RATINGS: Array<{ max: number } & Rating> = [
  { max: 150,      label: 'Superhuman',    cls: 'superhuman', color: '#c084fc', bgColor: 'rgba(192,132,252,0.09)', borderColor: 'rgba(192,132,252,0.35)' },
  { max: 200,      label: 'Lightning Fast', cls: 'lightning',  color: 'var(--mint)',    bgColor: 'rgba(0,229,160,0.07)',   borderColor: 'rgba(0,229,160,0.35)'   },
  { max: 250,      label: 'Excellent',      cls: 'excellent',  color: '#60d8fa', bgColor: 'rgba(96,216,250,0.08)',  borderColor: 'rgba(96,216,250,0.35)'  },
  { max: 300,      label: 'Above Average',  cls: 'above',      color: 'var(--blue)',    bgColor: 'rgba(80,140,255,0.09)', borderColor: 'rgba(80,140,255,0.35)'  },
  { max: 400,      label: 'Average',        cls: 'average',    color: 'var(--yellow)',  bgColor: 'rgba(255,209,102,0.08)', borderColor: 'rgba(255,209,102,0.35)' },
  { max: 500,      label: 'Below Average',  cls: 'below',      color: '#fb923c', bgColor: 'rgba(251,146,60,0.08)',  borderColor: 'rgba(251,146,60,0.35)'  },
  { max: Infinity, label: 'Slow',           cls: 'slow',       color: 'var(--red)',     bgColor: 'rgba(255,77,106,0.09)',  borderColor: 'rgba(255,77,106,0.35)'  },
]

function getRating(ms: number): Rating {
  return RATINGS.find(r => ms < r.max)!
}

// ── GAUGE HELPERS ─────────────────────────────────────────────────────────────

function getGaugeValues(ms: number) {
  const MIN = 100, MAX = 700
  const pct = Math.min(1, Math.max(0, (ms - MIN) / (MAX - MIN)))
  const arcLen = 236
  const arcOffset = arcLen - arcLen * (1 - pct)
  const arcColor = pct < 0.2 ? '#00e5a0' : pct < 0.45 ? '#ffd166' : '#ff4d6a'
  const needleDeg = -90 + pct * 180
  return { arcOffset, arcColor, needleDeg }
}

// ── STAT CARD ─────────────────────────────────────────────────────────────────

function StatCard({
  label, value, unit, accentColor, topBarColor,
}: {
  label: string
  value: string
  unit: string
  accentColor: string
  topBarColor: string
}) {
  return (
    <div
      className="relative overflow-hidden rounded-[9px] border p-3"
      style={{
        borderColor: accentColor,
        background: `linear-gradient(135deg, ${accentColor.replace(')', ', 0.05)').replace('rgb', 'rgba')} 0%, var(--bg2) 55%)`,
      }}
    >
      {/* top accent bar */}
      <div
        className="absolute left-0 right-0 top-0 h-[2px] rounded-t-[9px]"
        style={{ background: topBarColor }}
      />
      <span className="mb-[3px] block text-[9px] font-semibold uppercase tracking-[0.1em] text-[var(--t3)]">
        {label}
      </span>
      <span className="block font-mono text-[20px] font-medium leading-none" style={{ color: accentColor }}>
        {value}
      </span>
      <span className="mt-[2px] block text-[10px] text-[var(--t3)]">{unit}</span>
    </div>
  )
}

// ── DIST BAR ──────────────────────────────────────────────────────────────────

function DistBar({ label, color, count, maxCount }: { label: string; color: string; count: number; maxCount: number }) {
  const pct = maxCount > 0 ? Math.round((count / maxCount) * 100) : 0
  return (
    <div className="flex items-center gap-2 text-[10px]">
      <div className="w-[72px] shrink-0 overflow-hidden text-ellipsis whitespace-nowrap font-mono" style={{ color }}>
        {label}
      </div>
      <div className="h-[5px] flex-1 overflow-hidden rounded-full bg-[var(--bg4,#1b1d28)]">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <div className="w-4 shrink-0 text-right font-mono" style={{ color }}>
        {count}
      </div>
    </div>
  )
}

// ── HISTORY ITEM ──────────────────────────────────────────────────────────────

function HistoryItem({ attempt, index, total, avg, maxMs, isNew }: {
  attempt: Attempt; index: number; total: number; avg: number; maxMs: number; isNew: boolean
}) {
  const num = total - index
  const diff = attempt.ms - avg
  const dStr = diff === 0 ? '±0ms' : diff > 0 ? `+${diff}ms` : `${diff}ms`
  const dCol = diff <= 0 ? '#00e5a0' : '#5c6080'
  const barW = Math.round((attempt.ms / maxMs) * 100)

  return (
    <div
      className={`flex min-h-[46px] shrink-0 items-center gap-[10px] rounded-[8px] border px-3 py-[9px] ${
        isNew ? 'border-[var(--border2)] bg-[var(--bg3)]' : 'border-[var(--border)] bg-[var(--bg2)]'
      }`}
      style={{ animation: isNew ? 'zarynx-slidein 0.2s ease-out' : 'none' }}
    >
      <span className="w-[18px] shrink-0 text-[10px] text-[var(--t3)]">#{num}</span>
      <span className="flex-1 font-mono text-[14px] font-medium" style={{ color: attempt.rating.color }}>
        {attempt.ms}ms
      </span>
      <div className="h-[4px] w-[40px] shrink-0 overflow-hidden rounded-full bg-[var(--bg4,#1b1d28)]">
        <div className="h-full rounded-full" style={{ width: `${barW}%`, background: attempt.rating.color }} />
      </div>
      <span
        className="shrink-0 rounded-full border px-2 py-[2px] text-[9px] font-semibold uppercase tracking-[0.06em]"
        style={{ color: attempt.rating.color, borderColor: attempt.rating.borderColor, background: attempt.rating.bgColor }}
      >
        {attempt.rating.label}
      </span>
      <span className="hidden w-[48px] shrink-0 text-right font-mono text-[10px] sm:block" style={{ color: dCol }}>
        {dStr}
      </span>
    </div>
  )
}

// ── MINI TREND SPARKLINE ──────────────────────────────────────────────────────

function Sparkline({ attempts }: { attempts: Attempt[] }) {
  if (attempts.length < 2) return null
  const values = attempts.map(a => a.ms)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const W = 600, H = 80
  const PAD = 10
  const pts = values.map((v, i) => {
    const x = PAD + (i / (values.length - 1)) * (W - PAD * 2)
    const y = PAD + (1 - (v - min) / range) * (H - PAD * 2)
    return { x, y, v }
  })
  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaD = `${pathD} L ${W - PAD} ${H} L ${PAD} ${H} Z`
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 80 }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00e5a0" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#00e5a0" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#sparkGrad)" />
      <path d={pathD} fill="none" stroke="#00e5a0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="5" fill={getRating(p.v).color} stroke="#0D0F14" strokeWidth="1.5" />
      ))}
    </svg>
  )
}

// ── PAGE ──────────────────────────────────────────────────────────────────────

export default function ReactionTesterPage() {
  const [gameState, setGameState]   = useState<GameState>('idle')
  const [attempts, setAttempts]     = useState<Attempt[]>([])
  const [lastMs, setLastMs]         = useState<number | null>(null)

  const waitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const startTimeRef = useRef<number>(0)

  // Derived stats
  const total   = attempts.length
  const best    = total ? Math.min(...attempts.map(a => a.ms)) : null
  const worst   = total ? Math.max(...attempts.map(a => a.ms)) : null
  const avg     = total ? Math.round(attempts.reduce((s, a) => s + a.ms, 0) / total) : null
  const maxMs   = worst ?? 1

  // Distribution buckets
  const buckets = RATINGS.map(r => ({
    ...r,
    count: attempts.filter(a => a.rating.cls === r.cls).length,
  }))
  const maxBucketCount = Math.max(...buckets.map(b => b.count), 1)

  // ── State machine ──
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
      setTimeout(goIdle, 1600)
    } else if (gameState === 'ready') {
      const ms = Math.round(performance.now() - startTimeRef.current)
      const rating = getRating(ms)
      setLastMs(ms)
      setAttempts(prev => [...prev, { ms, rating }])
      setGameState('result')
    }
  }, [gameState, goWaiting, goIdle])

  // Keyboard support
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault()
        handlePress()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handlePress])

  // Cleanup timer on unmount
  useEffect(() => () => { if (waitTimerRef.current) clearTimeout(waitTimerRef.current) }, [])

  const resetAll = () => {
    goIdle()
    setAttempts([])
    setLastMs(null)
  }

  // ── Zone appearance ──
  const zoneStyles: Record<GameState, { bg: string; border: string }> = {
    idle:    { bg: 'var(--bg2)',  border: 'var(--border)'  },
    waiting: { bg: 'var(--bg2)', border: 'var(--border)'  },
    ready:   { bg: '#002918',    border: 'var(--mint)'    },
    result:  { bg: 'var(--bg2)', border: 'var(--border)'  },
    early:   { bg: '#180008',    border: '#ff4d6a'        },
  }
  const zs = zoneStyles[gameState]

  const lastRating = lastMs != null ? getRating(lastMs) : null
  const gaugeData  = lastMs != null ? getGaugeValues(lastMs) : null

  return (
    <>
      <style>{`
        @keyframes zarynx-blink   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.3;transform:scale(.6)} }
        @keyframes zarynx-breathe { 0%,100%{opacity:.35} 50%{opacity:1} }
        @keyframes zarynx-popin   { 0%{transform:scale(.75);opacity:.2} 100%{transform:scale(1);opacity:1} }
        @keyframes zarynx-shake   { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-9px)} 40%{transform:translateX(9px)} 60%{transform:translateX(-5px)} 80%{transform:translateX(5px)} }
        @keyframes zarynx-slidein { 0%{opacity:0;transform:translateY(-4px)} 100%{opacity:1;transform:translateY(0)} }
        @keyframes zarynx-dotpop  { 0%,80%,100%{transform:scale(.55)} 40%{transform:scale(1.1)} }
        .zarynx-dot { width:9px;height:9px;border-radius:50%;animation:zarynx-dotpop 1.4s ease-in-out infinite; background:var(--border2,#2c2f4a) }
        .zarynx-dot:nth-child(2){animation-delay:.2s}
        .zarynx-dot:nth-child(3){animation-delay:.4s}
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

        {/* ── STATS ROW ─────────────────────────────────────────────────── */}
        <ToolSection>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <StatCard
              label="Best"
              value={best != null ? String(best) : '—'}
              unit="milliseconds"
              accentColor="rgba(0,229,160,0.7)"
              topBarColor="var(--mint)"
            />
            <StatCard
              label="Average"
              value={avg != null ? String(avg) : '—'}
              unit="milliseconds"
              accentColor="rgba(255,209,102,0.7)"
              topBarColor="#ffd166"
            />
            <StatCard
              label="Worst"
              value={worst != null ? String(worst) : '—'}
              unit="milliseconds"
              accentColor="rgba(255,77,106,0.7)"
              topBarColor="#ff4d6a"
            />
            <StatCard
              label="Attempts"
              value={String(total)}
              unit="total"
              accentColor="rgba(124,109,255,0.7)"
              topBarColor="#7c6dff"
            />
          </div>
        </ToolSection>

        {/* ── TEST ZONE ─────────────────────────────────────────────────── */}
        <ToolSection>
          <SectionLabel>Click the zone to start</SectionLabel>

          {/* Zone */}
          <div
            role="button"
            tabIndex={0}
            aria-label="Reaction test zone. Tap or press Space to begin."
            onClick={handlePress}
            onKeyDown={e => { if (e.code === 'Space') { e.preventDefault(); handlePress() } }}
            onTouchEnd={e => { e.preventDefault(); handlePress() }}
            className="mb-3 flex min-h-[200px] cursor-pointer select-none items-center justify-center rounded-xl border-2 outline-none transition-colors sm:min-h-[240px]"
            style={{
              background: zs.bg,
              borderColor: zs.border,
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation',
            }}
          >
            {/* IDLE */}
            {gameState === 'idle' && (
              <div className="flex flex-col items-center gap-2 px-6 text-center">
                <p className="font-[var(--fh,sans-serif)] text-[20px] font-bold text-[var(--t2)]">
                  Ready to test?
                </p>
                <p className="text-[13px] text-[var(--t3)]">Tap the zone or press Spacebar to begin</p>
                <div className="hidden items-center gap-2 text-[12px] text-[var(--t3)] sm:flex">
                  <span className="rounded-[5px] border border-[var(--border2)] bg-[var(--bg4,#1b1d28)] px-[10px] pb-[3px] pt-[1px] font-mono text-[11px] text-[var(--t2)]" style={{ borderBottom: '3px solid var(--border2)' }}>
                    Space
                  </span>
                  <span>or click anywhere on the zone</span>
                </div>
                {/* Mobile tap button */}
                <div
                  className="mt-2 flex items-center gap-2 rounded-[10px] border-[1.5px] px-7 py-3 font-bold text-[16px] text-[var(--mint)] sm:hidden"
                  style={{ background: 'rgba(0,229,160,0.1)', borderColor: 'rgba(0,229,160,0.4)' }}
                >
                  <Timer size={16} />
                  Tap to Start
                </div>
              </div>
            )}

            {/* WAITING */}
            {gameState === 'waiting' && (
              <div className="flex flex-col items-center gap-3 text-center">
                <p
                  className="font-bold text-[18px] text-[var(--t3)]"
                  style={{ animation: 'zarynx-breathe 1.8s ease-in-out infinite' }}
                >
                  Wait for green...
                </p>
                <div className="flex gap-2">
                  <div className="zarynx-dot" />
                  <div className="zarynx-dot" />
                  <div className="zarynx-dot" />
                </div>
                <p className="text-[13px] text-[var(--t3)]">Don&apos;t tap yet!</p>
              </div>
            )}

            {/* READY (GO!) */}
            {gameState === 'ready' && (
              <div className="flex flex-col items-center gap-1 text-center">
                <p
                  className="font-bold leading-none text-[var(--mint)]"
                  style={{ fontSize: 'clamp(52px,15vw,90px)', animation: 'zarynx-popin .12s cubic-bezier(.34,1.56,.64,1)' }}
                >
                  GO!
                </p>
                <p className="text-[14px] text-[var(--mint)]" style={{ opacity: 0.7 }}>Tap now!</p>
              </div>
            )}

            {/* TOO EARLY */}
            {gameState === 'early' && (
              <div className="flex flex-col items-center gap-1 text-center px-6">
                <p
                  className="font-bold text-[#ff4d6a]"
                  style={{ fontSize: 'clamp(22px,7vw,42px)', animation: 'zarynx-shake .32s ease-out' }}
                >
                  Too Early!
                </p>
                <p className="text-[13px] text-[#ff4d6a]" style={{ opacity: 0.75 }}>
                  Wait for the green screen first
                </p>
              </div>
            )}

            {/* RESULT */}
            {gameState === 'result' && lastMs != null && lastRating != null && (
              <div className="flex flex-col items-center gap-1 text-center">
                <span
                  className="font-mono font-medium leading-none"
                  style={{
                    fontSize: 'clamp(52px,13vw,84px)',
                    color: lastRating.color,
                    animation: 'zarynx-popin .2s cubic-bezier(.34,1.56,.64,1)',
                    letterSpacing: '-.03em',
                  }}
                >
                  {lastMs}
                </span>
                <span className="font-mono text-[13px] tracking-[.05em] text-[var(--t3)]">milliseconds</span>
                <span
                  className="mt-1 flex items-center gap-[5px] rounded-full border px-[13px] py-[4px] text-[11px] font-semibold uppercase tracking-[0.07em]"
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

        {/* ── CHARTS GRID ───────────────────────────────────────────────── */}
        <ToolSection>

          {/* Trend sparkline — full width */}
          <div className="mb-3 rounded-xl border border-[var(--border)] bg-[var(--bg2)] p-4">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--t3)]">
              Reaction Time Trend
              {avg != null && (
                <span
                  className="ml-2 rounded-full border px-2 py-[1px] font-semibold"
                  style={{ color: getRating(avg).color, borderColor: getRating(avg).borderColor, background: getRating(avg).bgColor }}
                >
                  avg {avg}ms — {getRating(avg).label}
                </span>
              )}
            </p>
            {attempts.length < 2 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-6 opacity-50">
                <TrendingUp size={28} className="text-[var(--t3)]" strokeWidth={1.5} />
                <p className="text-[12px] text-[var(--t3)]">Complete 2+ attempts to see your trend</p>
              </div>
            ) : (
              <div className="w-full overflow-hidden rounded-lg">
                <Sparkline attempts={attempts} />
              </div>
            )}
          </div>

          {/* Speed Gauge + Distribution side by side */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

            {/* Speed Gauge */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg2)] p-4">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--t3)]">Latest Speed</p>
              {gaugeData == null || lastMs == null ? (
                <div className="flex flex-col items-center justify-center gap-2 py-6 opacity-50">
                  <Zap size={28} className="text-[var(--t3)]" strokeWidth={1.5} />
                  <p className="text-[12px] text-[var(--t3)]">Run a test to see your speed gauge</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <svg viewBox="0 0 200 115" className="w-full max-w-[200px] overflow-visible">
                    <defs>
                      <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#00e5a0" />
                        <stop offset="40%" stopColor="#ffd166" />
                        <stop offset="100%" stopColor="#ff4d6a" />
                      </linearGradient>
                    </defs>
                    {/* Track */}
                    <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#1b1d28" strokeWidth="14" strokeLinecap="round" />
                    {/* Full gradient track faint */}
                    <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="url(#gaugeGrad)" strokeWidth="14" strokeLinecap="round" opacity="0.15" />
                    {/* Active arc */}
                    <path
                      d="M 20 100 A 80 80 0 0 1 180 100"
                      fill="none"
                      stroke={gaugeData.arcColor}
                      strokeWidth="14"
                      strokeLinecap="round"
                      strokeDasharray="251"
                      strokeDashoffset={251 - 251 * (1 - Math.min(1, Math.max(0, (lastMs - 100) / 600)))}
                      style={{ transition: 'stroke-dashoffset .6s cubic-bezier(.34,1.2,.64,1), stroke .4s' }}
                    />
                    {/* Needle */}
                    <line
                      x1="100" y1="100" x2="100" y2="30"
                      stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round"
                      transform={`rotate(${-90 + Math.min(1, Math.max(0, (lastMs - 100) / 600)) * 180}, 100, 100)`}
                    />
                    <circle cx="100" cy="100" r="5" fill="#ffffff" opacity="0.9" />
                    {/* Labels */}
                    <text x="18" y="118" fill="#5c6080" fontSize="9" fontFamily="monospace">100ms</text>
                    <text x="182" y="118" fill="#5c6080" fontSize="9" fontFamily="monospace" textAnchor="end">700ms</text>
                    <text x="100" y="88" fill="#5c6080" fontSize="8" fontFamily="monospace" textAnchor="middle">avg</text>
                  </svg>
                  <div className="font-mono text-[30px] font-medium leading-none" style={{ color: lastRating!.color }}>
                    {lastMs}<span className="text-[14px] text-[var(--t3)] ml-1">ms</span>
                  </div>
                  <div
                    className="rounded-full border px-3 py-[3px] text-[10px] font-semibold uppercase tracking-[.07em]"
                    style={{ color: lastRating!.color, borderColor: lastRating!.borderColor, background: lastRating!.bgColor }}
                  >
                    {lastRating!.label}
                  </div>
                </div>
              )}
            </div>

            {/* Distribution — always show all buckets, zero ones are just empty bars */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg2)] p-4">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--t3)]">
                Rating Distribution
                {total > 0 && <span className="ml-2 text-[var(--t2)]">{total} attempt{total !== 1 ? 's' : ''}</span>}
              </p>
              <div className="flex flex-col gap-[8px]">
                {buckets.map(b => (
                  <div key={b.cls} className="flex items-center gap-2 text-[11px]">
                    <div className="w-[80px] shrink-0 truncate font-mono text-[10px]" style={{ color: b.color }}>
                      {b.label}
                    </div>
                    <div className="h-[6px] flex-1 overflow-hidden rounded-full bg-[#1b1d28]">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: total > 0 ? `${Math.round((b.count / maxBucketCount) * 100)}%` : '0%', background: b.color }}
                      />
                    </div>
                    <div className="w-5 shrink-0 text-right font-mono text-[10px]" style={{ color: b.count > 0 ? b.color : 'var(--t3)' }}>
                      {b.count}
                    </div>
                  </div>
                ))}
              </div>
              {total === 0 && (
                <p className="mt-3 text-center text-[11px] text-[var(--t3)] opacity-60">Run attempts to fill the chart</p>
              )}
            </div>
          </div>
        </ToolSection>

        {/* ── HISTORY ───────────────────────────────────────────────────── */}
        <ToolSection>
          <div className="mb-3 flex items-center justify-between">
            <SectionLabel>Attempt History</SectionLabel>
            <button
              onClick={resetAll}
              className="flex items-center gap-[6px] rounded-[8px] border px-[13px] py-[6px] text-[12px] font-semibold text-white transition-all hover:border-[rgba(255,77,106,0.9)] hover:shadow-[0_0_16px_rgba(255,77,106,0.25)]"
              style={{ background: 'rgba(255,77,106,0.16)', borderColor: 'rgba(255,77,106,0.5)' }}
            >
              <RotateCcw size={12} className="text-[#ff4d6a]" strokeWidth={2} />
              Reset All
            </button>
          </div>

          <p className="mb-2 text-[11px] text-[var(--t3)]">
            {total === 0
              ? 'No attempts yet'
              : <><span className="font-mono font-medium text-[var(--mint)]">{total}</span> attempt{total !== 1 ? 's' : ''} recorded · newest first</>
            }
          </p>

          {total === 0 ? (
            <p className="py-3 text-[12px] text-[var(--t3)]">Start the test above to record attempts.</p>
          ) : (
            <div
              className="flex flex-col gap-[5px] overflow-y-auto rounded-[8px] pr-[2px]"
              style={{
                maxHeight: `calc(6 * 50px + 5 * 5px)`,
                scrollbarWidth: 'thin',
              }}
            >
              {[...attempts].reverse().map((attempt, i) => (
                <HistoryItem
                  key={attempts.length - 1 - i}
                  attempt={attempt}
                  index={i}
                  total={total}
                  avg={avg!}
                  maxMs={maxMs}
                  isNew={i === 0}
                />
              ))}
            </div>
          )}
        </ToolSection>

        {/* ── RATING TABLE ──────────────────────────────────────────────── */}
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
                    <td className={`px-[13px] py-[9px] font-mono text-[var(--t2)] ${i < arr.length - 1 ? 'border-b border-[var(--border)]' : ''}`}>
                      {time}
                    </td>
                    <td className={`px-[13px] py-[9px] ${i < arr.length - 1 ? 'border-b border-[var(--border)]' : ''}`}>
                      <span
                        className="inline-flex items-center gap-[5px] rounded-full border px-[9px] py-[2px] text-[10px] font-semibold uppercase tracking-[.06em]"
                        style={{ color: r.color, borderColor: r.borderColor, background: r.bgColor }}
                      >
                        <span className="inline-block h-[5px] w-[5px] rounded-full" style={{ background: r.color }} />
                        {r.label}
                      </span>
                    </td>
                    <td className={`hidden px-[13px] py-[9px] text-[var(--t2)] sm:table-cell ${i < arr.length - 1 ? 'border-b border-[var(--border)]' : ''}`}>
                      {meaning}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ToolSection>

        {/* ── EXPLANATION ───────────────────────────────────────────────── */}
        <ToolSection>
          <ToolExplanation
            title="What is reaction time and why does it matter for gaming?"
            paragraphs={[
              'Reaction time is the delay between a stimulus appearing and you responding to it. In gaming, this translates directly to whether you get the first shot off, dodge an attack in time, or react to an enemy push before it\'s too late. Even a 50ms advantage can be the difference between winning and losing a close gunfight.',
              'The average human visual reaction time is around 250ms. Elite gamers typically score between 150–220ms thanks to a combination of genetics, training, and environmental factors like monitor refresh rate and input lag.',
            ]}
            cards={[
              {
                icon: Activity,
                iconBg: 'rgba(0,229,160,0.1)',
                iconColor: 'var(--mint)',
                title: 'Visual reaction',
                body: 'Light hits your retina, travels to your brain, and triggers a motor response. This is the baseline your score measures — no prediction allowed.',
              },
              {
                icon: Timer,
                iconBg: 'rgba(80,140,255,0.1)',
                iconColor: 'var(--blue)',
                title: 'Average is 250ms',
                body: 'Most people react between 200–300ms. Scores under 200ms are in elite territory. Under 150ms usually means the stimulus was anticipated.',
              },
              {
                icon: Zap,
                iconBg: 'rgba(255,209,102,0.1)',
                iconColor: '#ffd166',
                title: 'Training helps',
                body: 'Consistent practice can shave 20–40ms off your average over weeks. Hydration, sleep, and caffeine also have measurable effects on reaction speed.',
              },
            ]}
            secondTitle="How to improve your reaction time"
            secondParagraphs={[
              'Practice regularly — 10–15 minutes a day on this test or aim-training software is more effective than occasional long sessions. Make sure your monitor runs at 144Hz or higher, as higher refresh rates reduce visual latency. Stay hydrated and well-rested, as fatigue significantly increases reaction time. Avoid testing right after waking up or during a slump — results can vary by 30–50ms throughout the day.',
            ]}
          />
        </ToolSection>

        {/* ── HOW TO USE ────────────────────────────────────────────────── */}
        <ToolSection>
          <ToolHowTo
            steps={[
              {
                title: 'Start the test',
                description: 'Tap the green zone or press Spacebar to begin. A random 1–5 second wait begins immediately.',
              },
              {
                title: 'Wait for green',
                description: 'Don\'t tap during the "Wait for green" phase — reacting early counts as a failed attempt and you\'ll have to start over.',
              },
              {
                title: 'React instantly',
                description: 'The moment the screen turns green and shows "GO!", tap or press Space as fast as you can. Your time in milliseconds is recorded.',
              },
              {
                title: 'Track your progress',
                description: 'Complete multiple attempts to see your best, average, and trend over time. More attempts give a more accurate picture of your true reaction speed.',
              },
            ]}
          />
        </ToolSection>

        {/* ── FAQ ───────────────────────────────────────────────────────── */}
        <ToolSection last>
          <ToolFaq
            items={[
              {
                question: 'What is a good reaction time for gaming?',
                answer: 'For casual gaming, anything under 300ms is perfectly fine. Competitive gamers typically aim for 200–250ms. Elite FPS players often score 150–200ms. Anything under 150ms is likely due to anticipation rather than pure reaction.',
              },
              {
                question: 'Why do my results vary so much between attempts?',
                answer: 'Human reaction time naturally varies by 30–80ms between attempts due to factors like attention, blink timing, and neural variability. This is completely normal. Your average over 10+ attempts is much more meaningful than any single result.',
              },
              {
                question: 'Does my monitor\'s refresh rate affect the test?',
                answer: 'Yes. A 60Hz monitor can add up to 16.7ms of display lag, while a 144Hz monitor adds only ~7ms. At 240Hz it\'s under 4ms. The test measures from when the color change is rendered, so your display speed does affect your absolute score.',
              },
              {
                question: 'Can I improve my reaction time with practice?',
                answer: 'Yes, but within limits set by your nervous system and biology. Consistent practice can reduce your average by 20–40ms over weeks. Aim trainers, this test, and rhythm games all help. Sleep quality, hydration, and caffeine also have measurable short-term effects.',
              },
              {
                question: 'Is the Spacebar or click more accurate?',
                answer: 'Clicking a mouse button is typically 5–15ms faster than pressing a keyboard key due to the shorter travel distance and lighter actuation force. For the most consistent results, use the same input method across sessions.',
              },
              {
                question: 'What is a "Superhuman" score under 150ms?',
                answer: 'Scores below 150ms almost always indicate that the user was anticipating the green flash rather than purely reacting to it. True visual-motor reaction time cannot physically be below ~120ms for healthy adults — the neural signal takes that long to travel from eye to hand.',
              },
            ]}
          />
        </ToolSection>

      </ToolLayout>

      {/* ── RELATED TOOLS ─────────────────────────────────────────────── */}
      <ToolRelated
        tools={[
          {
            name: 'PC Bottleneck Calculator',
            description: 'Find out if your CPU or GPU is holding back your gaming performance',
            slug: 'pc-bottleneck-calculator',
            icon: Monitor,
            iconBg: 'rgba(255,120,64,0.1)',
            iconColor: 'var(--orange)',
          },
          {
            name: 'Sensitivity Converter',
            description: 'Convert your mouse sensitivity across CS2, Valorant, Apex and more',
            slug: 'sensitivity-converter',
            icon: Crosshair,
            iconBg: 'rgba(0,229,160,0.1)',
            iconColor: 'var(--mint)',
          },
          {
            name: 'FPS Benchmark Tool',
            description: 'Estimate your expected FPS across popular games and settings',
            slug: 'fps-benchmark',
            icon: Activity,
            iconBg: 'rgba(80,140,255,0.1)',
            iconColor: 'var(--blue)',
          },
        ]}
      />
    </>
  )
}
