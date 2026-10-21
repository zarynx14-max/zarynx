'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronRight, Copy, Share2 } from 'lucide-react'
import { SENS_GAMES, findGame } from '@/data/sensitivityGames'
import {
  CM_PER_INCH, edpi, inchesPer360, cmPer360, sensForNewDpi, roundTo, dpiForTarget, sensForTarget,
  percentFaster, percentLessTravel, padFit, ppi, pixelSizeMm, encodeState, decodeState,
} from '@/lib/dpi'

const SAVE_KEY = 'zarynx_dpi_setups'
const DPI_PRESETS = [400, 800, 1600, 3200]
const QUICK_GAMES = ['valorant', 'cs2', 'apex', 'fortnite', 'ow2']
const RES_PRESETS: [number, number][] = [[1920, 1080], [2560, 1440], [3840, 2160]]

type Saved = { name: string; gameId: string; dpi: number; sens: number }

const lbl = 'mb-[6px] block text-[11px] font-medium uppercase tracking-[0.05em] text-[var(--t3)]'
const inp = 'min-h-[44px] w-full rounded-[9px] border border-[var(--border)] bg-[var(--bg3)] px-3 py-[11px] text-[14px] text-[var(--t1)] outline-none transition-colors focus:border-[var(--mint)]'
const card = 'rounded-[14px] border border-[var(--border)] bg-[var(--bg2)] p-5'
const chipBase = 'min-h-[40px] rounded-[7px] border px-[12px] py-[8px] text-[12px] transition-all'
const chipOn = 'border-[var(--mint)] bg-[rgba(0,229,160,0.08)] text-[var(--t1)]'
const chipOff = 'border-[var(--border)] bg-[var(--bg3)] text-[var(--t3)] hover:text-[var(--t1)]'
const btnGhost = 'min-h-[36px] rounded-[8px] border border-[var(--border)] bg-[var(--bg3)] px-[12px] py-[7px] text-[12px] text-[var(--t2)] transition-colors hover:text-[var(--t1)] disabled:opacity-40'
const btnMint = 'flex min-h-[44px] items-center justify-center gap-[6px] rounded-[8px] border border-[rgba(0,229,160,0.25)] bg-[rgba(0,229,160,0.06)] px-[14px] py-[9px] text-[12px] text-[var(--mint)] transition-colors hover:bg-[rgba(0,229,160,0.12)]'

const num = (t: string) => { const n = parseFloat(t); return Number.isFinite(n) ? n : 0 }
const clean = (n: number, d = 5) => String(Number(n.toFixed(d)))
const fmtSens = (n: number) => (n > 0 ? clean(n) : '—')
const f1 = (n: number) => (n > 0 ? n.toFixed(1) : '—')

// ── small building blocks ────────────────────────────────────────────────────
function NumberField({ id, label, text, onText, step, min = 0, hint }: {
  id: string; label: string; text: string; onText: (t: string) => void; step: number; min?: number; hint?: string
}) {
  const v = num(text)
  const invalid = text.trim() !== '' && !(v > 0)
  function bump(dir: 1 | -1) {
    const next = Math.max(min, Number(((v || 0) + dir * step).toFixed(5)))
    onText(clean(next))
  }
  return (
    <div>
      <label htmlFor={id} className={lbl}>{label}</label>
      <div className="flex gap-[6px]">
        <button type="button" onClick={() => bump(-1)} aria-label={`Decrease ${label}`} className="h-[44px] w-[44px] shrink-0 rounded-[9px] border border-[var(--border)] bg-[var(--bg3)] text-[18px] text-[var(--t2)] hover:border-[var(--mint)] hover:text-[var(--mint)]">−</button>
        <input
          id={id} type="number" inputMode="decimal" step="any" value={text}
          onChange={e => onText(e.target.value)} aria-invalid={invalid}
          className={inp + ' text-center font-mono ' + (invalid ? 'border-[#FF8A80]' : '')}
        />
        <button type="button" onClick={() => bump(1)} aria-label={`Increase ${label}`} className="h-[44px] w-[44px] shrink-0 rounded-[9px] border border-[var(--border)] bg-[var(--bg3)] text-[18px] text-[var(--t2)] hover:border-[var(--mint)] hover:text-[var(--mint)]">+</button>
      </div>
      {invalid && <p className="mt-1 text-[11px] text-[#FF8A80]" role="alert">Enter a number above 0.</p>}
      {!invalid && hint && <p className="mt-1 text-[11px] text-[var(--t3)]">{hint}</p>}
    </div>
  )
}

function Unit({ value, onChange, label }: { value: 'cm' | 'in'; onChange: (v: 'cm' | 'in') => void; label: string }) {
  return (
    <div role="group" aria-label={label} className="flex">
      {(['cm', 'in'] as const).map((u, i) => (
        <button
          key={u} type="button" onClick={() => onChange(u)} aria-pressed={value === u}
          className={`min-h-[36px] border px-3 text-[12px] ${i === 0 ? 'rounded-l-[7px]' : 'rounded-r-[7px] border-l-0'} ${value === u ? 'border-[var(--mint)] bg-[rgba(0,229,160,0.08)] text-[var(--mint)]' : 'border-[var(--border)] text-[var(--t3)]'}`}
        >{u === 'in' ? 'inches' : 'cm'}</button>
      ))}
    </div>
  )
}

function Collapsible({ id, title, sub, children }: { id: string; title: string; sub: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  return (
    <section id={id} className={card}>
      <button type="button" onClick={() => setOpen(o => !o)} aria-expanded={open} className="flex min-h-[44px] w-full items-center justify-between gap-3 text-left">
        <span>
          <span className="block text-[14px] font-medium text-[var(--t1)]">{title}</span>
          <span className="mt-[2px] block text-[12px] text-[var(--t3)]">{sub}</span>
        </span>
        <ChevronRight size={16} className={`shrink-0 text-[var(--t3)] transition-transform ${open ? 'rotate-90' : ''}`} />
      </button>
      {open && <div className="mt-4">{children}</div>}
    </section>
  )
}

function Row({ k, v, accent }: { k: string; v: React.ReactNode; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between border-t border-[var(--border)] py-[9px] text-[12px]">
      <span className="text-[var(--t3)]">{k}</span>
      <span className={`font-mono ${accent ? 'text-[var(--mint)]' : 'text-[var(--t1)]'}`}>{v}</span>
    </div>
  )
}

// ── PAGE ─────────────────────────────────────────────────────────────────────
export function DpiCalculatorClient() {
  const [gameId, setGameId] = useState('valorant')
  const [dpiText, setDpiText] = useState('800')
  const [sensText, setSensText] = useState('0.35')
  const [padText, setPadText] = useState('45')
  const [padUnit, setPadUnit] = useState<'cm' | 'in'>('cm')
  const [unit, setUnit] = useState<'cm' | 'in'>('cm')
  const [saved, setSaved] = useState<Saved[]>([])
  const [saveName, setSaveName] = useState('')
  const [compareIdx, setCompareIdx] = useState<number | null>(null)
  const [toast, setToast] = useState('')
  // secondary calculators
  const [toDpiText, setToDpiText] = useState('1600')
  const [decimals, setDecimals] = useState(2)
  const [targetText, setTargetText] = useState('40')
  const [bDpiText, setBDpiText] = useState('1600')
  const [bSensText, setBSensText] = useState('0.2')
  const [resW, setResW] = useState('2560')
  const [resH, setResH] = useState('1440')
  const [diag, setDiag] = useState('27')
  const loaded = useRef(false)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const game = findGame(gameId)
  const dpi = num(dpiText)
  const sens = num(sensText)
  const padRaw = num(padText)
  const padCm = padRaw > 0 ? (padUnit === 'cm' ? padRaw : padRaw * CM_PER_INCH) : 0

  // load from the address bar and from saved setups
  useEffect(() => {
    try {
      const d = decodeState(window.location.search, SENS_GAMES.map(g => g.id))
      if (d) {
        setGameId(d.gameId); setDpiText(clean(d.dpi)); setSensText(clean(d.sens))
        if (d.padCm > 0) { setPadUnit('cm'); setPadText(clean(d.padCm, 2)) }
      }
      const raw = localStorage.getItem(SAVE_KEY)
      if (raw) setSaved(JSON.parse(raw))
    } catch { /* ignore */ }
    loaded.current = true
  }, [])

  // keep the address bar as a share link
  useEffect(() => {
    if (!loaded.current || !(dpi > 0) || !(sens > 0)) return
    try {
      window.history.replaceState(null, '', `${window.location.pathname}?${encodeState({ gameId, dpi, sens, padCm })}`)
    } catch { /* ignore */ }
  }, [gameId, dpi, sens, padCm])

  function say(msg: string) {
    setToast(msg)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 2200)
  }

  const r = useMemo(() => {
    const cm = cmPer360(dpi, sens, game.yaw)
    return { cm, inch: inchesPer360(dpi, sens, game.yaw), e: edpi(dpi, sens) }
  }, [dpi, sens, game])
  const show = (cm: number) => (unit === 'cm' ? f1(cm) : cm > 0 ? (cm / CM_PER_INCH).toFixed(2) : '—')
  const fit = padCm > 0 && r.cm > 0 ? padFit(r.cm, padCm) : null

  const saveCm = (s: Saved) => cmPer360(s.dpi, s.sens, findGame(s.gameId).yaw)
  const cmp = compareIdx !== null && saved[compareIdx] ? saved[compareIdx] : null

  function persist(next: Saved[]) {
    setSaved(next)
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(next)) } catch { /* ignore */ }
  }
  function saveCurrent() {
    if (!(dpi > 0) || !(sens > 0)) { say('Enter a valid DPI and sensitivity first'); return }
    const name = saveName.trim() || `${game.name} ${saved.length + 1}`
    persist([{ name, gameId, dpi, sens }, ...saved].slice(0, 20))
    setSaveName(''); say('Setup saved in this browser')
  }
  function loadSaved(s: Saved) { setGameId(s.gameId); setDpiText(clean(s.dpi)); setSensText(clean(s.sens)) }
  function reset() { setGameId('valorant'); setDpiText('800'); setSensText('0.35'); setPadText('45'); setPadUnit('cm') }

  function link() { return `${window.location.origin}${window.location.pathname}?${encodeState({ gameId, dpi, sens, padCm })}` }
  function copyLink() { navigator.clipboard?.writeText(link()).catch(() => {}); say('Link copied to clipboard') }
  function copyText() {
    const t = `${game.name}: ${clean(dpi)} DPI × ${clean(sens)} = ${Math.round(r.e)} eDPI, ${f1(r.cm)} cm (${r.inch.toFixed(2)} in) per 360°\n${link()}`
    navigator.clipboard?.writeText(t).catch(() => {}); say('Results copied as text')
  }
  async function share() {
    const text = `${game.name}: ${Math.round(r.e)} eDPI, ${f1(r.cm)} cm per 360°`
    if (navigator.share) { try { await navigator.share({ title: 'DPI & eDPI Calculator', text, url: link() }) } catch { /* cancelled */ } }
    else { navigator.clipboard?.writeText(`${text} ${link()}`).catch(() => {}); say('Link copied to clipboard') }
  }

  // same feel table
  const feelDpis = useMemo(() => {
    const set = new Set(DPI_PRESETS); if (dpi > 0) set.add(dpi)
    return Array.from(set).sort((a, b) => a - b)
  }, [dpi])

  // Change DPI card
  const toDpi = num(toDpiText)
  const exactNew = sensForNewDpi(sens, dpi, toDpi)
  const roundedNew = roundTo(exactNew, decimals)
  const roundErr = exactNew > 0 ? (roundedNew / exactNew - 1) * 100 : 0

  // Find DPI card
  const target = num(targetText)
  const needDpi = dpiForTarget(target, sens, game.yaw)
  const needSens = sensForTarget(target, dpi, game.yaw)

  // Compare card
  const bCm = cmPer360(num(bDpiText), num(bSensText), game.yaw)
  const bFaster = percentFaster(r.cm, bCm)
  const bTravel = percentLessTravel(r.cm, bCm)

  // Screen PPI card
  const p = ppi(num(resW), num(resH), num(diag))

  // pad bar scale
  const scaleMax = Math.max(padCm, r.cm) * 1.08 || 1

  return (
    <div>
      <nav aria-label="Jump to a calculator" className="sticky top-[53px] z-40 -mt-2 mb-4 flex gap-2 overflow-x-auto bg-[var(--bg)] py-2">
        {[['main', 'Calculator'], ['saved', 'Saved setups'], ['change', 'Change DPI'], ['find', 'Find DPI'], ['compare', 'Compare'], ['ppi', 'Screen PPI']].map(([id, label]) => (
          <a key={id} href={`#${id}`} className="min-h-[40px] shrink-0 rounded-full border border-[var(--border)] bg-[var(--bg3)] px-[14px] py-[9px] text-[12px] text-[var(--t2)] hover:text-[var(--t1)]">{label}</a>
        ))}
      </nav>

      <div id="main" className="flex flex-col gap-5 lg:flex-row lg:items-start">
        {/* INPUTS */}
        <section className={card + ' min-w-0 flex-1'} aria-labelledby="dpi-in">
          <div className="mb-1 flex items-center justify-between gap-3">
            <h2 id="dpi-in" className="text-[14px] font-medium text-[var(--t1)]">Your setup</h2>
            <button type="button" onClick={reset} className={btnGhost}>Reset</button>
          </div>
          <p className="mb-4 text-[12px] text-[var(--t3)]">Results update as you type or tap.</p>

          <div className="mb-4">
            <span className={lbl} id="dpi-game">Game</span>
            <div role="group" aria-labelledby="dpi-game" className="flex flex-wrap gap-2">
              {QUICK_GAMES.map(id => (
                <button key={id} type="button" onClick={() => setGameId(id)} aria-pressed={gameId === id} className={`${chipBase} ${gameId === id ? chipOn : chipOff}`}>{findGame(id).name}</button>
              ))}
            </div>
            <label htmlFor="dpi-more" className={lbl + ' mt-3'}>More games</label>
            <select id="dpi-more" value={gameId} onChange={e => setGameId(e.target.value)} className={inp}>
              {SENS_GAMES.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
            <p className="mt-1 text-[11px] text-[var(--t3)]">{game.name} turns {game.yaw} degrees per mouse count at sensitivity 1.</p>
          </div>

          <div className="mb-4">
            <NumberField id="dpi-dpi" label="Mouse DPI" text={dpiText} onText={setDpiText} step={50} min={50} />
            <div className="mt-2 flex flex-wrap gap-[6px]">
              {DPI_PRESETS.map(pr => (
                <button key={pr} type="button" onClick={() => setDpiText(String(pr))} aria-pressed={dpi === pr} className={`${chipBase} ${dpi === pr ? chipOn : chipOff}`}>{pr}</button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <NumberField id="dpi-sens" label="In-game sensitivity" text={sensText} onText={setSensText} step={0.01} min={0.001} />
            <label htmlFor="dpi-sens-range" className="mt-3 block text-[11px] text-[var(--t3)]">Fine tune</label>
            <input
              id="dpi-sens-range" type="range" min={0.01} max={5} step={0.005} value={Math.min(5, Math.max(0.01, sens || 0.01))}
              onChange={e => setSensText(clean(parseFloat(e.target.value)))}
              className="h-1 w-full cursor-pointer appearance-none rounded-full bg-[var(--bg3)] accent-[var(--mint)]"
            />
            <div className="mt-1 flex justify-between text-[10px] text-[var(--t3)]"><span>0.01</span><span>5</span></div>
          </div>

          <div>
            <div className="mb-[6px] flex items-center justify-between gap-2">
              <label htmlFor="dpi-pad" className="text-[11px] font-medium uppercase tracking-[0.05em] text-[var(--t3)]">Mouse pad width (optional)</label>
              <Unit value={padUnit} onChange={setPadUnit} label="Mouse pad unit" />
            </div>
            <input id="dpi-pad" type="number" inputMode="decimal" step="any" value={padText} onChange={e => setPadText(e.target.value)} className={inp} placeholder="Leave empty to skip" />
          </div>

          <details className="mt-5 rounded-[9px] bg-[var(--bg3)] px-4">
            <summary className="flex min-h-[44px] cursor-pointer items-center text-[13px] font-medium text-[var(--t1)]">Where do I find my DPI and sensitivity?</summary>
            <div className="pb-4 text-[12px] leading-[1.7] text-[var(--t3)]">
              <p className="mb-2"><strong className="font-medium text-[var(--t1)]">DPI:</strong> open your mouse&apos;s software, or check the DPI button on the mouse. The number it shows is your DPI.</p>
              <p><strong className="font-medium text-[var(--t1)]">Sensitivity:</strong> open the game&apos;s settings and find the mouse or controls page. Copy the sensitivity number exactly, including the decimals.</p>
            </div>
          </details>
        </section>

        {/* RESULTS */}
        <aside className={card + ' w-full lg:sticky lg:top-[68px] lg:w-[400px] lg:shrink-0'} aria-labelledby="dpi-res">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 id="dpi-res" className="text-[14px] font-medium text-[var(--t1)]">Results</h2>
            <Unit value={unit} onChange={setUnit} label="Result unit" />
          </div>
          <div className="grid grid-cols-2 gap-[10px]">
            {[
              ['eDPI', r.e > 0 ? String(Math.round(r.e)) : '—', true, ''],
              ['Distance for 360°', show(r.cm), false, unit],
              ['Distance for 180°', show(r.cm / 2), false, unit],
              ['Distance for 90°', show(r.cm / 4), false, unit],
            ].map(([k, v, accent, u]) => (
              <div key={String(k)} className="rounded-[10px] bg-[var(--bg3)] p-[14px]">
                <div className="text-[11px] text-[var(--t3)]">{k}</div>
                <div className={`mt-[3px] font-mono text-[22px] font-medium ${accent ? 'text-[var(--mint)]' : 'text-[var(--t1)]'}`}>{v}{u && v !== '—' && <span className="ml-1 text-[11px] text-[var(--t3)]">{u === 'in' ? 'in' : 'cm'}</span>}</div>
              </div>
            ))}
          </div>

          <div className="mt-3 rounded-[10px] bg-[var(--bg3)] p-[14px]">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-[12px]">
              <span className="text-[var(--t3)]">Mouse pad check</span>
              {fit && (
                <span className={`rounded-[5px] px-[9px] py-[3px] text-[11px] font-medium ${fit.fits360 ? 'bg-[rgba(0,229,160,0.12)] text-[var(--mint)]' : fit.fits180 ? 'bg-[rgba(255,120,64,0.12)] text-[var(--orange)]' : 'bg-[rgba(255,138,128,0.12)] text-[#FF8A80]'}`}>
                  {fit.fits360 ? 'Full turn fits' : fit.fits180 ? '180° fits, 360° does not' : '180° does not fit'}
                </span>
              )}
            </div>
            {fit ? (
              <>
                <div className="relative h-[34px]">
                  <div className="absolute top-[10px] h-[14px] rounded-[4px] bg-[var(--border2)]" style={{ left: 0, width: `${(padCm / scaleMax) * 100}%` }} aria-hidden="true" />
                  <div className="absolute top-[2px] h-[30px] w-[2px] bg-[var(--blue)]" style={{ left: `${(r.cm / 2 / scaleMax) * 100}%` }} aria-hidden="true" />
                  <div className="absolute top-[2px] h-[30px] w-[2px] bg-[var(--orange)]" style={{ left: `${Math.min(99, (r.cm / scaleMax) * 100)}%` }} aria-hidden="true" />
                </div>
                <div className="mt-1 flex justify-between text-[10px] text-[var(--t3)]">
                  <span>0</span><span className="text-[var(--blue)]">180° at {show(r.cm / 2)}</span><span className="text-[var(--orange)]">360° at {show(r.cm)}</span>
                </div>
                <p className="mt-2 text-[11px] leading-[1.5] text-[var(--t3)]">
                  {fit.fits360
                    ? `A full turn uses ${show(r.cm)} ${unit} of your ${show(padCm)} ${unit} pad.`
                    : fit.fits180
                      ? `A 180° turn leaves ${show(fit.spare180)} ${unit} to spare. A full 360° needs ${show(fit.over360)} ${unit} more than your pad, so you would lift and reset the mouse.`
                      : `Even a 180° turn is ${show(-fit.spare180)} ${unit} wider than your pad.`}
                </p>
              </>
            ) : (
              <p className="text-[11px] leading-[1.5] text-[var(--t3)]">Enter your mouse pad width to see whether a turn fits.</p>
            )}
          </div>

          {cmp && r.cm > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2 rounded-[10px] bg-[var(--bg3)] px-3 py-[10px] text-[12px]">
              <span className="min-w-[150px] flex-1 text-[var(--t3)]">Compared with your saved <strong className="font-medium text-[var(--t1)]">{cmp.name}</strong></span>
              {(() => {
                const fa = percentFaster(saveCm(cmp), r.cm), lt = percentLessTravel(saveCm(cmp), r.cm)
                return (
                  <>
                    <span className="rounded-[5px] bg-[rgba(0,229,160,0.1)] px-[9px] py-[3px] text-[11px] text-[var(--mint)]">{Math.abs(fa).toFixed(1)}% {fa >= 0 ? 'faster' : 'slower'}</span>
                    <span className="rounded-[5px] bg-[rgba(80,140,255,0.1)] px-[9px] py-[3px] text-[11px] text-[var(--blue)]">{Math.abs(lt).toFixed(1)}% {lt >= 0 ? 'less' : 'more'} travel</span>
                  </>
                )
              })()}
            </div>
          )}

          <h3 className="mb-1 mt-5 text-[14px] font-medium text-[var(--t1)]">Same feel at other DPI</h3>
          <p className="mb-2 text-[12px] text-[var(--t3)]">Sensitivity that keeps {f1(r.cm)} cm per 360. Tap Apply to switch.</p>
          {feelDpis.map(d => {
            const s = sensForNewDpi(sens, dpi, d)
            const current = d === dpi
            return (
              <div key={d} className="flex items-center justify-between border-t border-[var(--border)] py-[6px] text-[12px]">
                <span className="text-[var(--t3)]">{d} DPI{current ? ' (current)' : ''}</span>
                <span className="flex items-center gap-2">
                  <span className={`font-mono ${current ? 'text-[var(--mint)]' : 'text-[var(--t1)]'}`}>{fmtSens(s)}</span>
                  <button type="button" disabled={current} onClick={() => { setDpiText(String(d)); setSensText(clean(s)) }} className={btnGhost}>{current ? 'Current' : 'Apply'}</button>
                </span>
              </div>
            )
          })}

          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            <button type="button" onClick={copyLink} className={btnMint}><Copy size={12} />Copy link</button>
            <button type="button" onClick={copyText} className={btnGhost + ' min-h-[44px]'}>Copy as text</button>
            <button type="button" onClick={share} className={btnGhost + ' flex min-h-[44px] items-center justify-center gap-[6px]'}><Share2 size={12} />Share</button>
          </div>
          <div role="status" aria-live="polite" className="mt-3 min-h-[40px]">
            {toast && <span className="inline-flex items-center gap-2 rounded-[8px] border border-[var(--mint)] bg-[var(--bg3)] px-[14px] py-[9px] text-[12px] text-[var(--t1)]"><span className="text-[var(--mint)]" aria-hidden="true">✓</span>{toast}</span>}
          </div>
        </aside>
      </div>

      {/* SAVED SETUPS */}
      <section id="saved" className={card + ' mt-5'} aria-labelledby="dpi-saved">
        <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
          <h2 id="dpi-saved" className="text-[14px] font-medium text-[var(--t1)]">Saved setups</h2>
          <span className="text-[11px] text-[var(--t3)]">Stored in this browser only</span>
        </div>
        <p className="mb-3 text-[12px] text-[var(--t3)]">Save the settings you use and compare any of them with your current setup.</p>
        <div className="mb-3 flex gap-2">
          <label htmlFor="dpi-save-name" className="sr-only">Setup name</label>
          <input id="dpi-save-name" type="text" value={saveName} onChange={e => setSaveName(e.target.value)} placeholder="Name this setup, for example Valorant main" className={inp} />
          <button type="button" onClick={saveCurrent} className={btnGhost + ' min-h-[44px] shrink-0'}>Save current</button>
        </div>
        {saved.length === 0 && <p className="text-[12px] text-[var(--t3)]">Nothing saved yet.</p>}
        <div className="flex flex-col gap-2">
          {saved.map((s, i) => (
            <div key={i} className="flex flex-wrap items-center justify-between gap-2 rounded-[10px] bg-[var(--bg3)] px-3 py-[10px]">
              <div className="min-w-0">
                <div className="truncate text-[13px] font-medium text-[var(--t1)]">{s.name}</div>
                <div className="text-[11px] text-[var(--t3)]">{findGame(s.gameId).name} · {clean(s.dpi)} DPI × {clean(s.sens)} · eDPI {Math.round(s.dpi * s.sens)} · {f1(saveCm(s))} cm</div>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => loadSaved(s)} className={btnGhost}>Load</button>
                <button type="button" onClick={() => setCompareIdx(compareIdx === i ? null : i)} aria-pressed={compareIdx === i} className={btnGhost + (compareIdx === i ? ' !border-[var(--mint)] !text-[var(--mint)]' : '')}>{compareIdx === i ? 'Comparing' : 'Compare'}</button>
                <button type="button" onClick={() => { persist(saved.filter((_, n) => n !== i)); if (compareIdx === i) setCompareIdx(null) }} className={btnGhost + ' !text-[#FF8A80]'}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MORE CALCULATORS */}
      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <Collapsible id="change" title="Change DPI, keep the same feel" sub="Switching mouse or DPI? Get the sensitivity that keeps your turn distance.">
          <p className="mb-3 text-[12px] text-[var(--t3)]">From: <span className="font-mono text-[var(--t2)]">{clean(dpi)} DPI × {clean(sens)}</span> in {game.name} (your setup above)</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="to-dpi" className={lbl}>To DPI</label>
              <input id="to-dpi" type="number" inputMode="decimal" value={toDpiText} onChange={e => setToDpiText(e.target.value)} className={inp} />
            </div>
            <div>
              <label htmlFor="dec" className={lbl}>Game accepts</label>
              <select id="dec" value={decimals} onChange={e => setDecimals(Number(e.target.value))} className={inp}>
                {[2, 3, 4, 5].map(n => <option key={n} value={n}>{n} decimals</option>)}
              </select>
            </div>
          </div>
          <div className="mt-3 rounded-[10px] bg-[var(--bg3)] p-[14px]">
            <div className="text-[11px] text-[var(--t3)]">New sensitivity</div>
            <div className="font-mono text-[26px] font-medium text-[var(--mint)]">{fmtSens(exactNew)}</div>
          </div>
          {exactNew > 0 && (
            <p className="mt-2 text-[11px] leading-[1.5] text-[var(--t3)]">
              {Math.abs(roundErr) < 0.005
                ? `With ${decimals} decimals you get exactly ${fmtSens(roundedNew)}.`
                : `Your game only takes ${decimals} decimals, so ${fmtSens(roundedNew)} is the closest. That turns ${Math.abs(roundErr).toFixed(1)}% ${roundErr >= 0 ? 'faster' : 'slower'} than before.`}
            </p>
          )}
        </Collapsible>

        <Collapsible id="find" title="Find the DPI for a target cm per 360" sub="Know the distance you want? Get the DPI or sensitivity that gives it.">
          <label htmlFor="target" className={lbl}>Target cm per 360</label>
          <input id="target" type="number" inputMode="decimal" value={targetText} onChange={e => setTargetText(e.target.value)} className={inp} />
          <div className="mt-3 grid grid-cols-2 gap-[10px]">
            <div className="rounded-[10px] bg-[var(--bg3)] p-[14px]"><div className="text-[11px] text-[var(--t3)]">DPI (keep sens {clean(sens)})</div><div className="font-mono text-[22px] font-medium text-[var(--mint)]">{needDpi > 0 ? Math.round(needDpi) : '—'}</div></div>
            <div className="rounded-[10px] bg-[var(--bg3)] p-[14px]"><div className="text-[11px] text-[var(--t3)]">Sens (keep {clean(dpi)} DPI)</div><div className="font-mono text-[22px] font-medium text-[var(--mint)]">{needSens > 0 ? clean(needSens, 3) : '—'}</div></div>
          </div>
          <p className="mt-2 text-[11px] leading-[1.5] text-[var(--t3)]">Most mice only offer set DPI steps, so the sensitivity answer is usually the easier one to use. Uses {game.name} and the values above.</p>
        </Collapsible>

        <Collapsible id="compare" title="Compare two setups" sub="See how much faster one setup turns than another.">
          <p className="mb-3 text-[12px] text-[var(--t3)]">Setup A is your setup above: <span className="font-mono text-[var(--t2)]">{clean(dpi)} DPI × {clean(sens)}</span></p>
          <div className="grid grid-cols-2 gap-3">
            <div><label htmlFor="b-dpi" className={lbl}>Setup B: DPI</label><input id="b-dpi" type="number" inputMode="decimal" value={bDpiText} onChange={e => setBDpiText(e.target.value)} className={inp} /></div>
            <div><label htmlFor="b-sens" className={lbl}>Setup B: sensitivity</label><input id="b-sens" type="number" inputMode="decimal" step="any" value={bSensText} onChange={e => setBSensText(e.target.value)} className={inp} /></div>
          </div>
          <div className="mt-3">
            <Row k="A: eDPI and distance" v={`${r.e > 0 ? Math.round(r.e) : '—'} · ${f1(r.cm)} cm`} />
            <Row k="B: eDPI and distance" v={`${edpi(num(bDpiText), num(bSensText)) > 0 ? Math.round(edpi(num(bDpiText), num(bSensText))) : '—'} · ${f1(bCm)} cm`} />
          </div>
          {r.cm > 0 && bCm > 0 && (
            <div className="mt-3 rounded-[10px] bg-[var(--bg3)] p-[14px]">
              <div className="text-[16px] font-medium text-[var(--mint)]">B turns {Math.abs(bFaster).toFixed(1)}% {bFaster >= 0 ? 'faster' : 'slower'}</div>
              <p className="mt-1 text-[11px] text-[var(--t3)]">It needs {Math.abs(bTravel).toFixed(1)}% {bTravel >= 0 ? 'less' : 'more'} hand travel for a full turn.</p>
            </div>
          )}
        </Collapsible>

        <Collapsible id="ppi" title="Screen PPI (monitor DPI)" sub="Pixels per inch from your resolution and screen size.">
          <div className="grid grid-cols-2 gap-3">
            <div><label htmlFor="res-w" className={lbl}>Width (px)</label><input id="res-w" type="number" inputMode="numeric" value={resW} onChange={e => setResW(e.target.value)} className={inp} /></div>
            <div><label htmlFor="res-h" className={lbl}>Height (px)</label><input id="res-h" type="number" inputMode="numeric" value={resH} onChange={e => setResH(e.target.value)} className={inp} /></div>
          </div>
          <div className="mt-2 flex flex-wrap gap-[6px]">
            {RES_PRESETS.map(([w, h]) => (
              <button key={w} type="button" onClick={() => { setResW(String(w)); setResH(String(h)) }} aria-pressed={num(resW) === w && num(resH) === h} className={`${chipBase} ${num(resW) === w && num(resH) === h ? chipOn : chipOff}`}>{w}×{h}</button>
            ))}
          </div>
          <label htmlFor="diag" className={lbl + ' mt-3'}>Screen diagonal (inches)</label>
          <input id="diag" type="number" inputMode="decimal" step="any" value={diag} onChange={e => setDiag(e.target.value)} className={inp} />
          <div className="mt-3 rounded-[10px] bg-[var(--bg3)] p-[14px]">
            <div className="text-[11px] text-[var(--t3)]">Pixels per inch</div>
            <div className="font-mono text-[26px] font-medium text-[var(--mint)]">{p > 0 ? p.toFixed(1) : '—'}</div>
          </div>
          {p > 0 && <p className="mt-2 text-[11px] text-[var(--t3)]">Each pixel is about {pixelSizeMm(p).toFixed(3)} mm wide.</p>}
        </Collapsible>
      </div>

      {/* HOW THE NUMBERS WORK */}
      <section className={card + ' mt-5'} aria-labelledby="dpi-how">
        <h2 id="dpi-how" className="mb-2 text-[14px] font-medium text-[var(--t1)]">The formulas</h2>
        <p className="mb-3 text-[12px] leading-[1.7] text-[var(--t3)]">Yaw is how many degrees one mouse count turns you at sensitivity 1. It differs between games, which is why cm per 360 is the fair way to compare them.</p>
        {['eDPI = DPI × sensitivity', 'inches per 360 = 360 ÷ (yaw × DPI × sensitivity)', 'cm per 360 = inches per 360 × 2.54'].map(f => (
          <div key={f} className="mb-2 overflow-x-auto rounded-[8px] bg-[var(--bg3)] px-[14px] py-[10px] font-mono text-[12px] text-[var(--t1)]">{f}</div>
        ))}
      </section>

      {/* mobile summary bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center gap-4 border-t border-[var(--border2)] bg-[var(--bg2)] px-4 py-[10px] md:hidden">
        <div className="flex-1"><span className="block text-[11px] text-[var(--t3)]">eDPI</span><strong className="font-mono text-[18px] text-[var(--mint)]">{r.e > 0 ? Math.round(r.e) : '—'}</strong></div>
        <div className="flex-1"><span className="block text-[11px] text-[var(--t3)]">{unit === 'cm' ? 'cm' : 'in'} per 360</span><strong className="font-mono text-[18px] text-[var(--t1)]">{show(r.cm)}</strong></div>
        <button type="button" onClick={copyLink} className="min-h-[44px] rounded-[8px] bg-[var(--mint)] px-4 text-[13px] font-medium text-[#0D0F14]">Copy link</button>
      </div>
      <div className="h-[72px] md:hidden" aria-hidden="true" />
    </div>
  )
}
