'use client'

import { useState, useEffect, useMemo } from 'react'
import { Crosshair, Target, Gamepad2 } from 'lucide-react'
import {
  ToolBreadcrumb, ToolHeader,
  ToolExplanation, ToolHowTo, ToolFaq, ToolRelated,
  ToolLayout, ToolSection, SectionLabel,
} from '@/components/tool'
import {
  type CrosshairSettings, COLOR_PRESETS, defaultSettings,
  encodeCrosshair, decodeCrosshair,
} from '@/lib/crosshair'
import {
  STYLE_PRESETS, FUN_PRESETS, MAP_BACKGROUNDS, type CrosshairPreset,
} from '@/data/crosshairPresets'

const SAVE_KEY = 'zarynx_saved_crosshairs'
const RESOLUTIONS = ['1920×1080', '2560×1440', '3840×2160', '4:3 Stretched'] as const
type Resolution = typeof RESOLUTIONS[number]

// ── LIVE PREVIEW ──────────────────────────────────────────────────────────

function colorOf(s: CrosshairSettings) {
  return s.useCustomColor ? s.customColor : COLOR_PRESETS[s.colorIndex]?.hex ?? '#00E5A0'
}

function CrosshairPreview({
  settings, resolution, motionTest,
}: { settings: CrosshairSettings; resolution: Resolution; motionTest: boolean }) {
  const color = colorOf(settings)
  const cx = 100, cy = 62.5
  const scaleX = resolution === '4:3 Stretched' ? 1.28 : 1

  const inner = settings.innerLinesEnabled ? {
    off: settings.innerLineOffset * 0.8,
    len: settings.innerLineLength * 0.8,
    w: Math.max(1, settings.innerLineThickness * 0.7),
    op: settings.innerLineOpacity,
  } : null

  const outer = settings.outerLinesEnabled ? {
    off: settings.outerLineOffset * 0.8,
    len: settings.outerLineLength * 0.8,
    w: Math.max(1, settings.outerLineThickness * 0.7),
    op: settings.outerLineOpacity,
  } : null

  const dotR = settings.centerDotEnabled ? Math.max(1, settings.centerDotSize * 0.9) : 0

  function linesFor(g: { off: number; len: number; w: number; op: number }, outline: boolean) {
    const segs = [
      [cx - g.off - g.len, cy, cx - g.off, cy],           // left
      [cx + g.off, cy, cx + g.off + g.len, cy],            // right
      [cx, cy - g.off - g.len, cx, cy - g.off],            // up
      [cx, cy + g.off, cx, cy + g.off + g.len],            // down
    ]
    return segs.map((p, i) => (
      <line
        key={i}
        x1={p[0]} y1={p[1]} x2={p[2]} y2={p[3]}
        stroke={outline ? '#000000' : color}
        strokeOpacity={outline ? Math.min(0.85, settings.outlineOpacity) : g.op}
        strokeWidth={outline ? g.w + settings.outlineThickness * 1.3 : g.w}
        strokeLinecap="butt"
      />
    ))
  }

  return (
    <div
      style={{
        background: '#05060a', borderRadius: 8, position: 'relative',
        aspectRatio: '16/10', overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes xh-drift { 0%,100% { left: 20%; } 50% { left: 70%; } }
        @keyframes xh-smoke { 0%,100% { opacity: 0; } 50% { opacity: 1; } }
        .xh-silhouette { position:absolute; top:50%; width:9px; height:20px; border-radius:4px 4px 2px 2px;
          background:rgba(240,242,248,0.55); transform:translateY(-50%); animation: xh-drift 4s ease-in-out infinite; }
        .xh-smoke { position:absolute; inset:0; background:radial-gradient(circle at 30% 60%,rgba(200,210,220,0.18),transparent 55%);
          animation: xh-smoke 4s ease-in-out infinite; }
      `}</style>

      {motionTest && (
        <>
          <div className="xh-silhouette" aria-hidden="true" />
          <div className="xh-smoke" aria-hidden="true" />
        </>
      )}

      <svg
        viewBox="0 0 200 125"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', transform: `scaleX(${scaleX})` }}
        role="img"
        aria-label="Live crosshair preview"
      >
        {inner && linesFor(inner, true)}
        {outer && linesFor(outer, true)}
        {dotR > 0 && (
          <circle cx={cx} cy={cy} r={dotR + settings.outlineThickness} fill="#000000" fillOpacity={Math.min(0.85, settings.outlineOpacity)} />
        )}
        {inner && linesFor(inner, false)}
        {outer && linesFor(outer, false)}
        {dotR > 0 && <circle cx={cx} cy={cy} r={dotR} fill={color} fillOpacity={settings.centerDotOpacity} />}
      </svg>
    </div>
  )
}

// ── SMALL CONTROL PIECES ─────────────────────────────────────────────────

function ToggleRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="mb-1 flex items-center justify-between">
      <span className="text-[12px] text-[var(--t2)]">{label}</span>
      <button
        onClick={() => onChange(!value)}
        aria-pressed={value}
        className={`rounded-[7px] border px-[12px] py-[6px] text-[11px] font-medium transition-colors ${
          value
            ? 'border-[var(--mint)] bg-[rgba(0,229,160,0.1)] text-[var(--mint)]'
            : 'border-[var(--border2)] bg-transparent text-[var(--t2)]'
        }`}
      >
        {value ? 'On' : 'Off'}
      </button>
    </div>
  )
}

function SliderRow({ label, value, min, max, step = 1, onChange }: {
  label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void
}) {
  return (
    <div className="mb-2">
      <div className="mb-1 flex justify-between text-[11px] text-[var(--t3)]">
        <span>{label}</span><span className="text-[var(--t2)]">{value}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full accent-[var(--mint)]"
        aria-label={label}
      />
    </div>
  )
}

// ── PAGE ──────────────────────────────────────────────────────────────────

export default function CrosshairGeneratorClient() {
  const [mode, setMode] = useState<'primary' | 'ads'>('primary')
  const [useSeparateAds, setUseSeparateAds] = useState(false)
  const [primary, setPrimary] = useState<CrosshairSettings>(defaultSettings())
  const [ads, setAds] = useState<CrosshairSettings>(defaultSettings())
  const [resolution, setResolution] = useState<Resolution>('1920×1080')
  const [mapId, setMapId] = useState('ascent')
  const [motionTest, setMotionTest] = useState(false)
  const [pasteValue, setPasteValue] = useState('')
  const [pasteError, setPasteError] = useState('')
  const [copied, setCopied] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'pro' | 'fun'>('all')
  const [saveName, setSaveName] = useState('')
  const [saved, setSaved] = useState<{ name: string; code: string }[]>([])

  const current = mode === 'primary' ? primary : ads
  const setCurrent = mode === 'primary' ? setPrimary : setAds

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVE_KEY)
      if (raw) setSaved(JSON.parse(raw))
    } catch { /* localStorage unavailable — ignore */ }
  }, [])

  function persistSaved(next: { name: string; code: string }[]) {
    setSaved(next)
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(next)) } catch { /* ignore */ }
  }

  function update(partial: Partial<CrosshairSettings>) {
    setCurrent(prev => ({ ...prev, ...partial }))
  }

  const code = useMemo(
    () => encodeCrosshair(primary, ads, useSeparateAds),
    [primary, ads, useSeparateAds],
  )

  function handleCopy() {
    navigator.clipboard.writeText(code).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleRandom() {
    const r = (min: number, max: number) => Math.round(min + Math.random() * (max - min))
    update({
      colorIndex: r(0, 7),
      useCustomColor: false,
      outlineEnabled: Math.random() > 0.3,
      outlineThickness: r(1, 3),
      centerDotEnabled: Math.random() > 0.5,
      centerDotSize: r(1, 4),
      innerLinesEnabled: Math.random() > 0.2,
      innerLineLength: r(2, 12),
      innerLineOffset: r(0, 8),
      innerLineThickness: r(1, 4),
      outerLinesEnabled: Math.random() > 0.6,
      outerLineLength: r(2, 10),
      outerLineOffset: r(6, 16),
      outerLineThickness: r(1, 4),
    })
  }

  function handlePaste() {
    const decoded = decodeCrosshair(pasteValue)
    if (!decoded) { setPasteError('Could not read that code — check it and try again.'); return }
    setPasteError('')
    setPrimary(decoded.primary)
    if (decoded.ads) { setAds(decoded.ads); setUseSeparateAds(true) }
    setPasteValue('')
  }

  function applyPreset(preset: CrosshairPreset) {
    setCurrent({ ...preset.settings })
  }

  function handleSave() {
    const name = saveName.trim() || `Crosshair ${saved.length + 1}`
    persistSaved([{ name, code }, ...saved].slice(0, 20))
    setSaveName('')
  }

  function loadSaved(c: string) {
    const decoded = decodeCrosshair(c)
    if (!decoded) return
    setPrimary(decoded.primary)
    if (decoded.ads) { setAds(decoded.ads); setUseSeparateAds(true) } else { setUseSeparateAds(false) }
  }

  function removeSaved(i: number) {
    persistSaved(saved.filter((_, idx) => idx !== i))
  }

  const presets = useMemo(() => {
    const all = [...STYLE_PRESETS.map(p => ({ ...p, tag: 'pro' as const })), ...FUN_PRESETS.map(p => ({ ...p, tag: 'fun' as const }))]
    return all.filter(p =>
      (filter === 'all' || p.tag === filter) &&
      (search.trim() === '' || p.name.toLowerCase().includes(search.toLowerCase())),
    )
  }, [search, filter])

  const map = MAP_BACKGROUNDS.find(m => m.id === mapId) ?? MAP_BACKGROUNDS[0]

  return (
    <>
      <ToolBreadcrumb toolName="Valorant Crosshair Generator" toolSlug="valorant-crosshair-generator" />

      <ToolHeader
        name="Valorant Crosshair Generator"
        description="Build an exact Valorant crosshair, test it on different map tones and resolutions, start from a style preset, then copy the code straight into your game."
        categoryLabel="Customization"
        categoryColor="mint"
        typeLabel="Game Tools"
        typeColor="blue"
        updatedAt="Oct 2026"
        usersPerMonth="New"
      />

      <ToolLayout wide>

        {/* Mode + random/paste */}
        <ToolSection>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-[10px]">
            <div className="flex gap-2">
              <button
                onClick={() => setMode('primary')}
                aria-pressed={mode === 'primary'}
                className={`rounded-[7px] border px-[14px] py-[9px] text-[12px] font-medium ${mode === 'primary' ? 'border-[var(--mint)] bg-[rgba(0,229,160,0.1)] text-[var(--mint)]' : 'border-[var(--border2)] text-[var(--t2)]'}`}
              >
                Primary
              </button>
              <button
                onClick={() => { setMode('ads'); setUseSeparateAds(true) }}
                aria-pressed={mode === 'ads'}
                className={`rounded-[7px] border px-[14px] py-[9px] text-[12px] font-medium ${mode === 'ads' ? 'border-[var(--mint)] bg-[rgba(0,229,160,0.1)] text-[var(--mint)]' : 'border-[var(--border2)] text-[var(--t2)]'}`}
              >
                ADS / Sniper
              </button>
            </div>
            <div className="flex gap-2">
              <button onClick={handleRandom} className="rounded-full border border-[var(--border2)] px-[14px] py-[7px] text-[11px] text-[var(--t2)]">↺ Random</button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.1fr_1fr]">

            {/* PREVIEW */}
            <div className="rounded-[10px] border border-[var(--border)] bg-[var(--bg2)] p-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[12px] text-[var(--t2)]">Live Preview</span>
                <select
                  value={resolution}
                  onChange={e => setResolution(e.target.value as Resolution)}
                  className="rounded-[7px] border border-[var(--border2)] bg-[var(--bg3)] px-[10px] py-[6px] text-[11px] text-[var(--t1)]"
                  aria-label="Preview resolution"
                >
                  {RESOLUTIONS.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>

              <div style={{ background: map.gradient, borderRadius: 10, padding: 1 }}>
                <CrosshairPreview settings={current} resolution={resolution} motionTest={motionTest} />
              </div>
              <p className="mt-2 text-[10px] leading-[1.5] text-[var(--t3)]">
                {resolution === '4:3 Stretched'
                  ? 'Stretched resolutions widen the UI, which visibly stretches the crosshair too.'
                  : 'Valorant renders the crosshair at a fixed UI scale, so it looks the same at 1080p, 1440p and 4K — only stretched resolutions change it.'}
              </p>

              <div className="mt-3 flex flex-wrap gap-[6px]">
                {MAP_BACKGROUNDS.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setMapId(m.id)}
                    aria-pressed={mapId === m.id}
                    className={`rounded-full border px-[12px] py-[6px] text-[11px] ${mapId === m.id ? 'border-[var(--blue)] bg-[rgba(80,140,255,0.1)] text-[var(--blue)]' : 'border-[var(--border2)] text-[var(--t2)]'}`}
                  >
                    {m.name}
                  </button>
                ))}
                <button
                  onClick={() => setMotionTest(v => !v)}
                  aria-pressed={motionTest}
                  className={`rounded-full border px-[12px] py-[6px] text-[11px] ${motionTest ? 'border-[var(--orange)] bg-[rgba(255,120,64,0.1)] text-[var(--orange)]' : 'border-[var(--border2)] text-[var(--t2)]'}`}
                >
                  ▶ Motion Test
                </button>
              </div>
              <p className="mt-1 text-[10px] text-[var(--t3)]">Motion test simulates a moving target and smoke — not real game footage.</p>

              {/* Code box */}
              <div className="mt-4 border-t border-[var(--border)] pt-4">
                <label htmlFor="xh-code" className="mb-[6px] block text-[12px] text-[var(--t2)]">Crosshair Code</label>
                <div className="flex gap-2">
                  <input
                    id="xh-code" type="text" readOnly value={code}
                    className="min-w-0 flex-1 rounded-[7px] border border-[var(--border2)] bg-[var(--bg3)] px-[12px] py-[9px] font-mono text-[11px] text-[var(--t1)]"
                  />
                  <button onClick={handleCopy} className="shrink-0 rounded-[7px] bg-[var(--mint)] px-[16px] py-[9px] text-[12px] font-medium text-[#0D0F14]">
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>

                <div className="mt-3 flex gap-2">
                  <input
                    type="text" value={pasteValue} onChange={e => setPasteValue(e.target.value)}
                    placeholder="Paste an existing code to edit it"
                    className="min-w-0 flex-1 rounded-[7px] border border-[var(--border2)] bg-[var(--bg3)] px-[12px] py-[9px] text-[11px] text-[var(--t1)]"
                  />
                  <button onClick={handlePaste} className="shrink-0 rounded-[7px] border border-[var(--border2)] px-[14px] py-[9px] text-[12px] text-[var(--t2)]">Load</button>
                </div>
                {pasteError && <p className="mt-1 text-[11px] text-[#FF8A80]">{pasteError}</p>}

                <div className="mt-3 flex gap-2">
                  <input
                    type="text" value={saveName} onChange={e => setSaveName(e.target.value)}
                    placeholder="Name this crosshair"
                    className="min-w-0 flex-1 rounded-[7px] border border-[var(--border2)] bg-[var(--bg3)] px-[12px] py-[9px] text-[11px] text-[var(--t1)]"
                  />
                  <button onClick={handleSave} className="shrink-0 rounded-[7px] border border-[var(--border2)] px-[14px] py-[9px] text-[12px] text-[var(--t2)]">★ Save</button>
                </div>
              </div>
            </div>

            {/* CONTROLS */}
            <div className="rounded-[10px] border border-[var(--border)] bg-[var(--bg2)] p-5">
              <div className="mb-4">
                <span className="mb-2 block text-[12px] text-[var(--t2)]">Color</span>
                <div className="flex flex-wrap items-center gap-[8px]">
                  {COLOR_PRESETS.map((c, i) => (
                    <button
                      key={c.hex}
                      onClick={() => update({ useCustomColor: false, colorIndex: i })}
                      aria-label={c.name}
                      aria-pressed={!current.useCustomColor && current.colorIndex === i}
                      className="h-[26px] w-[26px] rounded-full border-2"
                      style={{ background: c.hex, borderColor: !current.useCustomColor && current.colorIndex === i ? 'var(--t1)' : 'transparent' }}
                    />
                  ))}
                  <label htmlFor="xh-hex" className="text-[11px] text-[var(--t3)]">Custom</label>
                  <input
                    id="xh-hex" type="text" value={current.customColor}
                    onChange={e => update({ useCustomColor: true, customColor: e.target.value })}
                    className="w-[84px] rounded-[7px] border border-[var(--border2)] bg-[var(--bg3)] px-[8px] py-[6px] text-[11px] text-[var(--t1)]"
                  />
                </div>
              </div>

              <div className="mb-4 border-t border-[var(--border)] pt-3">
                <ToggleRow label="Outlines" value={current.outlineEnabled} onChange={v => update({ outlineEnabled: v })} />
                {current.outlineEnabled && (
                  <>
                    <SliderRow label="Outline opacity" value={current.outlineOpacity} min={0} max={1} step={0.05} onChange={v => update({ outlineOpacity: v })} />
                    <SliderRow label="Outline thickness" value={current.outlineThickness} min={1} max={4} onChange={v => update({ outlineThickness: v })} />
                  </>
                )}
              </div>

              <div className="mb-4 border-t border-[var(--border)] pt-3">
                <ToggleRow label="Center Dot" value={current.centerDotEnabled} onChange={v => update({ centerDotEnabled: v })} />
                {current.centerDotEnabled && (
                  <>
                    <SliderRow label="Dot size" value={current.centerDotSize} min={1} max={6} onChange={v => update({ centerDotSize: v })} />
                    <SliderRow label="Dot opacity" value={current.centerDotOpacity} min={0} max={1} step={0.05} onChange={v => update({ centerDotOpacity: v })} />
                  </>
                )}
              </div>

              <div className="mb-4 border-t border-[var(--border)] pt-3">
                <ToggleRow label="Inner Lines" value={current.innerLinesEnabled} onChange={v => update({ innerLinesEnabled: v })} />
                {current.innerLinesEnabled && (
                  <>
                    <SliderRow label="Length" value={current.innerLineLength} min={1} max={20} onChange={v => update({ innerLineLength: v })} />
                    <SliderRow label="Thickness" value={current.innerLineThickness} min={1} max={10} onChange={v => update({ innerLineThickness: v })} />
                    <SliderRow label="Offset" value={current.innerLineOffset} min={0} max={20} onChange={v => update({ innerLineOffset: v })} />
                    <div className="mt-2 flex gap-4">
                      <label className="flex items-center gap-[6px] text-[11px] text-[var(--t2)]">
                        <input type="checkbox" checked={current.innerLineMovementError} onChange={e => update({ innerLineMovementError: e.target.checked })} />
                        Movement Error
                      </label>
                      <label className="flex items-center gap-[6px] text-[11px] text-[var(--t2)]">
                        <input type="checkbox" checked={current.innerLineFiringError} onChange={e => update({ innerLineFiringError: e.target.checked })} />
                        Firing Error
                      </label>
                    </div>
                  </>
                )}
              </div>

              <div className="mb-4 border-t border-[var(--border)] pt-3">
                <ToggleRow label="Outer Lines" value={current.outerLinesEnabled} onChange={v => update({ outerLinesEnabled: v })} />
                {current.outerLinesEnabled && (
                  <>
                    <SliderRow label="Length" value={current.outerLineLength} min={1} max={20} onChange={v => update({ outerLineLength: v })} />
                    <SliderRow label="Thickness" value={current.outerLineThickness} min={1} max={10} onChange={v => update({ outerLineThickness: v })} />
                    <SliderRow label="Offset" value={current.outerLineOffset} min={0} max={30} onChange={v => update({ outerLineOffset: v })} />
                    <div className="mt-2 flex gap-4">
                      <label className="flex items-center gap-[6px] text-[11px] text-[var(--t2)]">
                        <input type="checkbox" checked={current.outerLineMovementError} onChange={e => update({ outerLineMovementError: e.target.checked })} />
                        Movement Error
                      </label>
                      <label className="flex items-center gap-[6px] text-[11px] text-[var(--t2)]">
                        <input type="checkbox" checked={current.outerLineFiringError} onChange={e => update({ outerLineFiringError: e.target.checked })} />
                        Firing Error
                      </label>
                    </div>
                  </>
                )}
              </div>

              <div className="border-t border-[var(--border)] pt-3">
                <ToggleRow label="Fade with Firing Error" value={current.fadeWithFiringError} onChange={v => update({ fadeWithFiringError: v })} />
              </div>
            </div>
          </div>
        </ToolSection>

        {/* PRESETS */}
        <ToolSection>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-[10px]">
            <SectionLabel>Style Presets</SectionLabel>
            <div className="flex flex-wrap gap-2">
              <input
                type="search" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search presets..."
                className="w-[170px] rounded-[7px] border border-[var(--border2)] bg-[var(--bg3)] px-[10px] py-[7px] text-[11px] text-[var(--t1)]"
                aria-label="Search presets"
              />
              {(['all', 'pro', 'fun'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  aria-pressed={filter === f}
                  className={`rounded-full border px-[12px] py-[7px] text-[11px] capitalize ${filter === f ? 'border-[var(--blue)] bg-[rgba(80,140,255,0.1)] text-[var(--blue)]' : 'border-[var(--border2)] text-[var(--t2)]'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-[10px] sm:grid-cols-2 lg:grid-cols-4">
            {presets.map(p => (
              <button
                key={p.id}
                onClick={() => applyPreset(p)}
                className="rounded-[10px] border border-[var(--border)] bg-[var(--bg2)] p-3 text-left transition-colors hover:border-[var(--border2)]"
              >
                <div className="mb-2 flex aspect-[16/10] items-center justify-center rounded-[8px] bg-[#05060a]">
                  <CrosshairPreview settings={p.settings} resolution="1920×1080" motionTest={false} />
                </div>
                <p className="text-[12px] font-medium text-[var(--t1)]">{p.name}</p>
                <p className="mt-[2px] text-[11px] leading-[1.4] text-[var(--t3)]">{p.note}</p>
              </button>
            ))}
            {presets.length === 0 && (
              <p className="text-[12px] text-[var(--t3)]">No presets match that search.</p>
            )}
          </div>
        </ToolSection>

        {/* SAVED */}
        {saved.length > 0 && (
          <ToolSection>
            <SectionLabel>My Saved Crosshairs</SectionLabel>
            <div className="flex flex-col gap-[8px]">
              {saved.map((s, i) => (
                <div key={i} className="flex items-center justify-between rounded-[8px] border border-[var(--border)] bg-[var(--bg2)] px-[14px] py-[10px]">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] text-[var(--t1)]">{s.name}</p>
                    <p className="truncate font-mono text-[10px] text-[var(--t3)]">{s.code}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button onClick={() => loadSaved(s.code)} className="rounded-[6px] border border-[var(--border2)] px-[10px] py-[6px] text-[11px] text-[var(--t2)]">Load</button>
                    <button onClick={() => removeSaved(i)} className="rounded-[6px] border border-[var(--border2)] px-[10px] py-[6px] text-[11px] text-[#FF8A80]">Delete</button>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-2 text-[10px] text-[var(--t3)]">Saved crosshairs live in this browser only — nothing is sent to a server yet.</p>
          </ToolSection>
        )}

        {/* EXPLANATION */}
        <ToolSection>
          <ToolExplanation
            title="What makes a good Valorant crosshair?"
            paragraphs={[
              'A good crosshair stays visible against every map without covering up enemies at a distance. High-contrast colors like mint green, cyan, and white are popular because they stand out from most map textures — muted browns and grays tend to blend in.',
              'Beyond visibility, it comes down to personal preference: some players prefer a single dot for precision, others prefer the classic four-line cross because it is easier to find in the middle of a fast fight. Try a few style presets above and see what tracks naturally for you.',
            ]}
            cards={[
              { icon: Crosshair, iconBg: 'rgba(0,229,160,0.1)', iconColor: 'var(--mint)', title: 'Dot-only', body: 'Minimal clutter, favored for precision-focused aim styles.' },
              { icon: Target,    iconBg: 'rgba(80,140,255,0.1)', iconColor: 'var(--blue)', title: 'Classic cross', body: 'Four short lines — the most common competitive shape.' },
              { icon: Gamepad2,  iconBg: 'rgba(255,120,64,0.1)', iconColor: 'var(--orange)', title: 'Full cross', body: 'Inner and outer lines together for a larger, bolder reticle.' },
            ]}
          />
        </ToolSection>

        {/* HOW TO */}
        <ToolSection>
          <ToolHowTo
            steps={[
              { title: 'Build your crosshair', description: 'Adjust color, outlines, center dot and line settings — or start from a style preset above.' },
              { title: 'Test it', description: 'Switch map tones, try a stretched resolution, and run the motion test to check visibility before committing.' },
              { title: 'Copy and import', description: 'Copy the code, then in Valorant go to Settings → Crosshair → Import Profile Code and paste it in.' },
            ]}
          />
        </ToolSection>

        {/* FAQ */}
        <ToolSection last>
          <ToolFaq
            items={[
              { question: 'Does the crosshair code work for both Primary and ADS?', answer: 'Yes — toggle to the "ADS / Sniper" mode above to build a separate crosshair for aim-down-sights. If you never switch modes, only your Primary crosshair is exported.' },
              { question: 'Why does my crosshair look the same at 1080p, 1440p and 4K?', answer: 'Valorant renders the crosshair at a fixed UI scale regardless of resolution, so it visually stays the same size. Only stretched resolutions (like 4:3) actually distort it, which you can preview above.' },
              { question: 'Are the pro-style presets exact pro player settings?', answer: 'No — they are common playstyle archetypes (small dot, classic cross, minimalist, etc.), not verified codes copied from a specific player. We will add sourced, verified pro codes in a future update.' },
              { question: 'Where are my saved crosshairs stored?', answer: 'Saved crosshairs are stored in your browser only (localStorage), so they will not appear on another device yet. A full account-based crosshair library is planned.' },
              { question: 'My pasted code did not load correctly — why?', answer: 'Codes from other generators sometimes use slightly different key formats. We ignore anything we do not recognize rather than failing outright, but a few settings may not carry over perfectly — tweak them manually after pasting.' },
            ]}
          />
        </ToolSection>

      </ToolLayout>

      <ToolRelated
        tools={[
          { name: 'Sensitivity Converter', description: 'Convert sens across CS2, Valorant and more', slug: 'sensitivity-converter', icon: Crosshair, iconBg: 'rgba(0,229,160,0.1)', iconColor: 'var(--mint)' },
          { name: 'PC Bottleneck Calculator', description: 'Find your CPU/GPU bottleneck', slug: 'pc-bottleneck-calculator', icon: Target, iconBg: 'rgba(80,140,255,0.1)', iconColor: 'var(--blue)' },
          { name: 'Reaction Speed Test', description: 'Test and track your reaction time', slug: 'reaction-speed-test', icon: Gamepad2, iconBg: 'rgba(255,120,64,0.1)', iconColor: 'var(--orange)' },
        ]}
      />
    </>
  )
}
