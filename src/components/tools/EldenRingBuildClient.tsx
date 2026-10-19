'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { Sword, Shield, Target } from 'lucide-react'
import {
  ToolBreadcrumb, ToolHeader,
  ToolExplanation, ToolHowTo, ToolFaq, ToolRelated,
  ToolLayout, ToolSection, SectionLabel,
} from '@/components/tool'
import {
  type Stats, type StatKey, type BuildState, type TalismanMods,
  STAT_KEYS, STAT_LABELS, MAX_STAT, MAX_LEVEL, CLASSES, SOFT_CAPS, EXAMPLE_SPREADS,
  getClass, classStats, computeBuildWithGear, nextPointGain, meetRequirements,
  rankClasses, rollTypeFor, hpFor, encodeBuild, decodeBuild,
  parseTalismanEffect, talismanFamily,
} from '@/lib/eldenring'
import { ARMOR_ROWS, TALISMAN_ROWS } from '@/data/eldenringGear'

const SAVE_KEY = 'zarynx_er_builds'
const DAMAGE_KEYS = ['strength', 'dexterity', 'intelligence', 'faith', 'arcane'] as const
type DamageKey = typeof DAMAGE_KEYS[number]
type Snap = { classId: string; stats: Stats }
type Saved = { name: string; q: string }

const fmt = (n: number) => n.toLocaleString('en-US')

const SLOT_CODES = ['h', 'c', 'a', 'l'] as const
const SLOT_LABELS = ['Head', 'Chest', 'Arms', 'Legs']
const ARMOR = SLOT_CODES.map(code =>
  ARMOR_ROWS.filter(r => r[1] === code).map(r => ({ name: r[0], weight: r[2], poise: r[3] })).sort((a, b) => a.name.localeCompare(b.name)),
)
const ARMOR_MAP = ARMOR.map(list => new Map(list.map(a => [a.name, a])))
const TALISMANS = TALISMAN_ROWS.map(r => ({
  name: r[0], weight: r[1], effect: r[2], dlc: r[3] === 1,
  family: talismanFamily(r[0]), mods: parseTalismanEffect(r[2]),
})).sort((a, b) => a.name.localeCompare(b.name))
const TAL_MAP = new Map(TALISMANS.map(t => [t.name, t]))

// ── ITEM PICKER (type to search, pick from the list) ────────────────────────
function ItemInput({ id, label, value, options, hint, onChange }: {
  id: string; label: string; value: string; options: string[]; hint?: string; onChange: (v: string) => void
}) {
  const [text, setText] = useState(value)
  useEffect(() => { setText(value) }, [value])
  return (
    <div>
      <label htmlFor={id} className="mb-[4px] block text-[11px] text-[var(--t2)]">{label}</label>
      <input
        id={id} list={`${id}-list`} value={text} placeholder="Type to search..." autoComplete="off"
        onChange={e => {
          setText(e.target.value)
          if (e.target.value === '') onChange('')
          else if (options.includes(e.target.value)) onChange(e.target.value)
        }}
        onBlur={() => { if (text !== value && !options.includes(text)) setText(value) }}
        className="min-h-[44px] w-full rounded-[7px] border border-[var(--border2)] bg-[var(--bg3)] px-3 py-2 text-[12px] text-[var(--t1)]"
      />
      <datalist id={`${id}-list`}>{options.map(o => <option key={o} value={o} />)}</datalist>
      {hint && <p className="mt-[3px] text-[10px] text-[var(--t2)]">{hint}</p>}
    </div>
  )
}

// ── ATTRIBUTE ROW ────────────────────────────────────────────────────────────
function StatRow({ k, value, base, note, onChange }: {
  k: StatKey; value: number; base: number; note: string; onChange: (v: number) => void
}) {
  const [text, setText] = useState(String(value))
  useEffect(() => { setText(String(value)) }, [value])

  function commit(raw: string) {
    const n = parseInt(raw, 10)
    if (Number.isNaN(n)) { setText(String(value)); return }
    const clamped = Math.min(MAX_STAT, Math.max(base, n))
    setText(String(clamped))
    if (clamped !== value) onChange(clamped)
  }

  const caps = SOFT_CAPS[k] ?? []
  return (
    <div className="mb-3">
      <div className="grid grid-cols-[84px_1fr_auto] items-center gap-3">
        <label htmlFor={`er-${k}`} className="text-[12px] text-[var(--t2)]">{STAT_LABELS[k]}</label>
        <div className="relative h-[6px] rounded-[3px] bg-[var(--bg3)]">
          <i className="absolute bottom-0 left-0 top-0 rounded-[3px] bg-[var(--mint)]" style={{ width: `${(value / MAX_STAT) * 100}%` }} />
          {caps.map(c => (
            <b key={c} className="absolute top-[-3px] h-[12px] w-px bg-[var(--t2)]" style={{ left: `${(c / MAX_STAT) * 100}%` }} aria-hidden="true" />
          ))}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => value > base && onChange(value - 1)}
            aria-label={`Decrease ${STAT_LABELS[k]}`}
            className="h-[44px] w-[44px] rounded-[7px] border border-[var(--border2)] bg-[var(--bg3)] text-[16px] text-[var(--t1)] disabled:opacity-40"
            disabled={value <= base}
          >−</button>
          <input
            id={`er-${k}`} type="number" inputMode="numeric" min={base} max={MAX_STAT} value={text}
            onChange={e => {
              setText(e.target.value)
              const n = parseInt(e.target.value, 10)
              if (!Number.isNaN(n) && n >= base && n <= MAX_STAT && n !== value) onChange(n)
            }}
            onBlur={e => commit(e.target.value)}
            className="h-[44px] w-[56px] rounded-[7px] border border-[var(--border2)] bg-[var(--bg3)] px-1 text-center text-[13px] text-[var(--t1)]"
          />
          <button
            onClick={() => value < MAX_STAT && onChange(value + 1)}
            aria-label={`Increase ${STAT_LABELS[k]}`}
            className="h-[44px] w-[44px] rounded-[7px] border border-[var(--border2)] bg-[var(--bg3)] text-[16px] text-[var(--t1)] disabled:opacity-40"
            disabled={value >= MAX_STAT}
          >+</button>
        </div>
      </div>
      <p className="mt-1 pl-[96px] text-[11px] text-[var(--mint)] max-sm:pl-0">{note}</p>
    </div>
  )
}

function Tile({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="min-w-[90px] flex-1 rounded-[8px] bg-[var(--bg3)] p-3">
      <small className="mb-[2px] block text-[11px] text-[var(--t2)]">{label}</small>
      <strong className={`font-medium ${accent ? 'text-[24px] text-[var(--mint)]' : 'text-[17px] text-[var(--t1)]'}`}>{value}</strong>
    </div>
  )
}

const btnGhost = 'rounded-full border border-[var(--border2)] px-[14px] py-[8px] text-[11px] text-[var(--t2)] disabled:opacity-40'
const btnSecondary = 'rounded-[7px] border border-[var(--border2)] px-[14px] py-[10px] text-[12px] font-medium text-[var(--t1)] disabled:opacity-40'
const btnPrimary = 'rounded-[7px] bg-[var(--mint)] px-[16px] py-[11px] text-[13px] font-medium text-[#0D0F14]'
const fieldCls = 'min-h-[44px] w-full rounded-[7px] border border-[var(--border2)] bg-[var(--bg3)] px-3 py-2 text-[12px] text-[var(--t1)]'

// ── PAGE ─────────────────────────────────────────────────────────────────────
export default function EldenRingBuildClient() {
  const [snap, setSnap] = useState<Snap>({ classId: 'samurai', stats: classStats('samurai') })
  const [past, setPast] = useState<Snap[]>([])
  const [future, setFuture] = useState<Snap[]>([])
  const [gearText, setGearText] = useState('')
  const [armorSel, setArmorSel] = useState<string[]>(['', '', '', ''])
  const [talSel, setTalSel] = useState<string[]>(['', '', '', ''])
  const [talError, setTalError] = useState('')
  const [targetText, setTargetText] = useState('')
  const [req, setReq] = useState<Record<DamageKey, string>>({ strength: '', dexterity: '', intelligence: '', faith: '', arcane: '' })
  const [saved, setSaved] = useState<Saved[]>([])
  const [saveName, setSaveName] = useState('')
  const [compareIdx, setCompareIdx] = useState<number | null>(null)
  const [importText, setImportText] = useState('')
  const [importError, setImportError] = useState('')
  const [copied, setCopied] = useState<'' | 'link' | 'text'>('')
  const loaded = useRef(false)

  const cls = getClass(snap.classId)
  const gearWeight = Math.max(0, parseFloat(gearText) || 0)
  const targetLevel = (() => {
    const n = parseInt(targetText, 10)
    return Number.isFinite(n) && n >= 1 && n <= MAX_LEVEL ? n : null
  })()

  function commit(next: Snap) {
    setPast(p => [...p.slice(-49), snap])
    setFuture([])
    setSnap(next)
  }
  function undo() {
    if (!past.length) return
    setFuture(f => [snap, ...f])
    setSnap(past[past.length - 1])
    setPast(past.slice(0, -1))
  }
  function redo() {
    if (!future.length) return
    setPast(p => [...p, snap])
    setSnap(future[0])
    setFuture(future.slice(1))
  }

  function setStat(k: StatKey, v: number) { commit({ ...snap, stats: { ...snap.stats, [k]: v } }) }

  function changeClass(id: string) {
    const base = classStats(id)
    const stats = {} as Stats
    STAT_KEYS.forEach(k => { stats[k] = Math.max(base[k], snap.stats[k]) })
    commit({ classId: id, stats })
  }

  function setTal(i: number, name: string) {
    if (name) {
      const fam = TAL_MAP.get(name)?.family
      const clash = talSel.findIndex((n, j) => j !== i && n && TAL_MAP.get(n)?.family === fam)
      if (clash >= 0) { setTalError(`${name} and ${talSel[clash]} are versions of the same talisman, so only one can be equipped.`); return }
    }
    setTalError('')
    setTalSel(t => t.map((x, j) => (j === i ? name : x)))
  }
  function setArmor(i: number, name: string) { setArmorSel(a => a.map((x, j) => (j === i ? name : x))) }

  function resetBuild() { commit({ classId: snap.classId, stats: classStats(snap.classId) }) }

  // load from URL + saved builds
  useEffect(() => {
    try {
      const d = decodeBuild(window.location.search)
      if (d) {
        setSnap({ classId: d.classId, stats: d.stats })
        if (d.gearWeight) setGearText(String(d.gearWeight))
        if (d.targetLevel) setTargetText(String(d.targetLevel))
        setArmorSel(d.armor.map((n, i) => (ARMOR_MAP[i].has(n) ? n : '')))
        setTalSel(d.talismans.map(n => (TAL_MAP.has(n) ? n : '')))
      }
      const raw = localStorage.getItem(SAVE_KEY)
      if (raw) setSaved(JSON.parse(raw))
    } catch { /* ignore */ }
    loaded.current = true
  }, [])

  // keep the URL in sync so the address bar is always a share link
  useEffect(() => {
    if (!loaded.current) return
    try {
      const q = encodeBuild({ classId: snap.classId, stats: snap.stats, gearWeight, targetLevel, armor: armorSel, talismans: talSel })
      window.history.replaceState(null, '', `${window.location.pathname}?${q}`)
    } catch { /* ignore */ }
  }, [snap, gearWeight, targetLevel, armorSel, talSel])

  function persist(next: Saved[]) {
    setSaved(next)
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(next)) } catch { /* ignore */ }
  }

  const state: BuildState = { classId: snap.classId, stats: snap.stats, gearWeight, targetLevel, armor: armorSel, talismans: talSel }
  const equippedTals = talSel.map(n => TAL_MAP.get(n)).filter((t): t is NonNullable<typeof t> => !!t)
  const mods = useMemo(() => equippedTals.map(t => t.mods).filter((m): m is TalismanMods => !!m), [talSel]) // eslint-disable-line react-hooks/exhaustive-deps
  const build = useMemo(() => computeBuildWithGear(snap.classId, snap.stats, mods), [snap, mods])
  const eff = build.effective
  const armorPieces = armorSel.map((n, i) => ARMOR_MAP[i].get(n))
  const armorWeight = armorPieces.reduce((t, a) => t + (a?.weight ?? 0), 0)
  const talWeight = equippedTals.reduce((t, x) => t + x.weight, 0)
  const poiseTotal = armorPieces.reduce((t, a) => t + (a?.poise ?? 0), 0)
  const poiseUnknown = armorPieces.some(a => a && a.poise === null)
  const totalWeight = Math.round((armorWeight + talWeight + gearWeight) * 10) / 10
  const rankings = useMemo(() => rankClasses(snap.stats), [snap.stats])
  const best = rankings[0]
  const current = rankings.find(r => r.cls.id === snap.classId) ?? rankings[0]
  const levelsSaved = current.level - best.level

  const reqNums: Partial<Stats> = {}
  DAMAGE_KEYS.forEach(k => {
    const n = parseInt(req[k], 10)
    if (Number.isFinite(n) && n > 0) reqNums[k] = Math.min(MAX_STAT, n)
  })
  const hasReq = Object.keys(reqNums).length > 0
  const unmet = DAMAGE_KEYS.filter(k => (reqNums[k] ?? 0) > eff[k])
  const pointsMissing = unmet.reduce((t, k) => t + ((reqNums[k] ?? 0) - eff[k]), 0)

  function optimizeKeepClass() {
    if (!hasReq) return
    commit({ classId: snap.classId, stats: meetRequirements(snap.classId, reqNums) })
  }
  function optimizeBestClass() {
    if (!hasReq) return
    const top = rankClasses(reqNums)[0]
    commit({ classId: top.cls.id, stats: meetRequirements(top.cls.id, reqNums) })
  }
  function applySpread(target: Stats) {
    const top = rankClasses(target)[0]
    commit({ classId: top.cls.id, stats: meetRequirements(top.cls.id, target) })
  }

  const maxLoad = build.equipLoad
  const loadPct = totalWeight > 0 ? (totalWeight / maxLoad) * 100 : 0
  const roll = totalWeight > 0 ? rollTypeFor(totalWeight, maxLoad) : null
  const spareBeforeHeavy = totalWeight > 0 ? Math.round((maxLoad * 0.7 - totalWeight) * 10) / 10 : null

  const levelsLeft = targetLevel ? targetLevel - build.level : null

  function shareLink() {
    return `${window.location.origin}${window.location.pathname}?${encodeBuild(state)}`
  }
  function copy(kind: 'link' | 'text') {
    const text = kind === 'link' ? shareLink() : [
      `Elden Ring build (${cls.name} start, level ${build.level})`,
      STAT_KEYS.map(k => `${STAT_LABELS[k]} ${snap.stats[k]}`).join(' · '),
      `HP ${fmt(build.hp)} · FP ${fmt(build.fp)} · Stamina ${build.stamina} · Equip load ${totalWeight.toFixed(1)} / ${maxLoad.toFixed(1)}`,
      armorSel.some(Boolean) ? `Armor: ${armorSel.filter(Boolean).join(', ')}` : '',
      talSel.some(Boolean) ? `Talismans: ${talSel.filter(Boolean).join(', ')}` : '',
      `Runes needed: ${fmt(build.totalRunes)}`,
      shareLink(),
    ].filter(Boolean).join('\n')
    navigator.clipboard.writeText(text).catch(() => {})
    setCopied(kind)
    setTimeout(() => setCopied(''), 2000)
  }

  function handleSave() {
    const name = saveName.trim() || `Build ${saved.length + 1}`
    persist([{ name, q: encodeBuild(state) }, ...saved].slice(0, 20))
    setSaveName('')
  }
  function loadSaved(q: string) {
    const d = decodeBuild(q)
    if (!d) return
    commit({ classId: d.classId, stats: d.stats })
    setGearText(d.gearWeight ? String(d.gearWeight) : '')
    setTargetText(d.targetLevel ? String(d.targetLevel) : '')
    setArmorSel(d.armor.map((n, i) => (ARMOR_MAP[i].has(n) ? n : '')))
    setTalSel(d.talismans.map(n => (TAL_MAP.has(n) ? n : '')))
  }
  function handleImport() {
    const d = decodeBuild(importText.trim())
    if (!d) { setImportError('Could not read that link. Paste a full Zarynx build link.'); return }
    setImportError('')
    loadSaved(encodeBuild(d))
    setImportText('')
  }

  const cmp = compareIdx !== null && saved[compareIdx] ? (() => {
    const d = decodeBuild(saved[compareIdx].q)
    return d ? { name: saved[compareIdx].name, b: computeBuildWithGear(d.classId, d.stats, d.talismans.map(n => TAL_MAP.get(n)?.mods).filter((m): m is TalismanMods => !!m)), cls: getClass(d.classId).name } : null
  })() : null

  // suggestions (all computed from the verified tables)
  const tips: string[] = []
  const v = snap.stats.vigor
  if (v < 40) tips.push(`Vigor ${v} gives ${fmt(hpFor(v))} HP. Vigor 40 gives ${fmt(hpFor(40))} HP, and these are the biggest gains per point.`)
  else if (v < 60) tips.push(`Vigor is past the first soft cap (40). Each point now gives about ${hpFor(Math.min(99, v + 1)) - hpFor(v)} HP.`)
  else tips.push(`Vigor is past 60. Each point now gives only ${hpFor(Math.min(99, v + 1)) - hpFor(v)} HP.`)
  if (levelsSaved > 0) tips.push(`${best.cls.name} start saves ${levelsSaved} level${levelsSaved === 1 ? '' : 's'} (${fmt(current.runes - best.runes)} runes) for these stats.`)
  else tips.push(`${cls.name} is already the lowest-level start for these stats.`)
  if (hasReq) tips.push(unmet.length === 0 ? 'Your stats meet every requirement you entered.' : `You are ${pointsMissing} point${pointsMissing === 1 ? '' : 's'} short of the weapon requirements you entered.`)
  if (spareBeforeHeavy !== null) tips.push(spareBeforeHeavy >= 0 ? `You can add ${spareBeforeHeavy} more weight before your roll becomes Heavy.` : `You are ${Math.abs(spareBeforeHeavy)} over the Medium roll limit (70%).`)

  return (
    <>
      <ToolBreadcrumb toolName="Elden Ring Build Optimizer" toolSlug="elden-ring-build-optimizer" />

      <ToolHeader
        name="Elden Ring Build Optimizer"
        description="Find the best starting class and the lowest level for your weapon's requirements. Pick armor and talismans to see exact HP, FP, stamina, equip load and rune costs."
        categoryLabel="Build Tools"
        categoryColor="mint"
        typeLabel="Optimizer"
        typeColor="blue"
        updatedAt="Oct 2026"
        usersPerMonth="New"
      />

      <ToolLayout wide>
        <ToolSection>
          {/* TOOLBAR */}
          <div className="mb-3 flex flex-wrap items-center justify-between gap-[10px]">
            <span className="text-[12px] text-[var(--t2)]">
              <span className="mr-[6px] inline-block h-[6px] w-[6px] rounded-full bg-[var(--mint)]" />
              The address bar always holds a share link for this build.
            </span>
            <div className="flex flex-wrap gap-2">
              <button onClick={undo} disabled={!past.length} className={btnGhost}>Undo</button>
              <button onClick={redo} disabled={!future.length} className={btnGhost}>Redo</button>
              <button onClick={resetBuild} className={btnGhost}>Reset</button>
            </div>
          </div>

          {/* GOAL BAR */}
          <div className="mb-5 rounded-[10px] border border-[var(--border)] bg-[var(--bg2)] p-[18px]">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1.1fr_2.6fr_0.8fr] md:items-end">
              <div>
                <label htmlFor="er-class" className="mb-[6px] block text-[12px] text-[var(--t2)]">Starting class</label>
                <select id="er-class" value={snap.classId} onChange={e => changeClass(e.target.value)} className={fieldCls}>
                  {CLASSES.map(c => <option key={c.id} value={c.id}>{c.name} (level {c.level})</option>)}
                </select>
              </div>
              <div>
                <span className="mb-[6px] block text-[12px] text-[var(--t2)]">Weapon requirements (type what your weapon asks for)</span>
                <div className="grid grid-cols-5 gap-2">
                  {DAMAGE_KEYS.map(k => (
                    <div key={k}>
                      <label htmlFor={`req-${k}`} className="mb-[2px] block text-[10px] text-[var(--t2)]">{STAT_LABELS[k].slice(0, 3)}</label>
                      <input
                        id={`req-${k}`} type="number" inputMode="numeric" min={0} max={MAX_STAT} placeholder="0"
                        value={req[k]} onChange={e => setReq(r => ({ ...r, [k]: e.target.value }))}
                        className={fieldCls + ' px-2 text-center'}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="er-target" className="mb-[6px] block text-[12px] text-[var(--t2)]">Target level</label>
                <input id="er-target" type="number" inputMode="numeric" min={1} max={MAX_LEVEL} placeholder="Any" value={targetText} onChange={e => setTargetText(e.target.value)} className={fieldCls} />
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button onClick={optimizeBestClass} disabled={!hasReq} className={btnPrimary + ' disabled:opacity-40'}>Optimize (best class)</button>
              <button onClick={optimizeKeepClass} disabled={!hasReq} className={btnSecondary}>Optimize (keep {cls.name})</button>
              <span className="text-[11px] text-[var(--t2)]">Sets every stat to the lowest level that meets the requirements.</span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-[12px] text-[var(--t2)]">Level target</span>
              {[60, 90, 125, 150].map(n => (
                <button key={n} onClick={() => setTargetText(String(n))} className={btnGhost}>{n}</button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-[18px] lg:flex-row lg:items-start">
            {/* MAIN COLUMN */}
            <div className="flex min-w-0 flex-1 flex-col gap-[18px]">

              <section className="rounded-[10px] border border-[var(--border)] bg-[var(--bg2)] p-[18px]" aria-labelledby="er-attr">
                <h2 id="er-attr" className="mb-[14px] text-[14px] font-medium text-[var(--t1)]">Attributes</h2>

                {targetLevel && levelsLeft !== null && (
                  <div className="mb-4 rounded-[8px] bg-[var(--bg3)] p-3">
                    <div className="mb-2 flex flex-wrap justify-between gap-2 text-[12px]">
                      <span>Level <strong className="text-[var(--mint)]">{build.level}</strong> of target {targetLevel}</span>
                      <span className="text-[var(--t2)]">
                        {levelsLeft > 0 ? `${levelsLeft} point${levelsLeft === 1 ? '' : 's'} left to spend` : levelsLeft === 0 ? 'On target' : `${-levelsLeft} over target`}
                      </span>
                    </div>
                    <div className="relative h-[8px] rounded-[4px] bg-[var(--bg2)]">
                      <i className="absolute bottom-0 left-0 top-0 rounded-[4px] bg-[var(--mint)]" style={{ width: `${Math.min(100, (build.level / targetLevel) * 100)}%` }} />
                    </div>
                  </div>
                )}

                {STAT_KEYS.map(k => {
                  let note: string
                  const bonus = eff[k] - snap.stats[k]
                  if (k === 'vigor' || k === 'mind' || k === 'endurance') {
                    if (snap.stats[k] >= MAX_STAT) note = 'At maximum'
                    else if (eff[k] >= MAX_STAT) note = 'No gain: talisman bonus already reaches 99'
                    else {
                      const up = computeBuildWithGear(snap.classId, { ...snap.stats, [k]: snap.stats[k] + 1 }, mods)
                      if (k === 'vigor') note = `Next point: +${fmt(up.hp - build.hp)} HP`
                      else if (k === 'mind') note = `Next point: +${fmt(up.fp - build.fp)} FP`
                      else note = `Next point: +${up.stamina - build.stamina} stamina, +${(Math.round((up.equipLoad - build.equipLoad) * 10) / 10).toFixed(1)} equip load`
                    }
                  } else {
                    const want = reqNums[k as DamageKey]
                    note = want
                      ? (eff[k] >= want ? `Meets weapon requirement (${want})` : `Weapon needs ${want}, ${want - eff[k]} more`)
                      : 'Attack gain depends on your weapon'
                  }
                  if (bonus > 0) note = `+${bonus} from talismans (counts as ${eff[k]}). ${note}`
                  return <StatRow key={k} k={k} value={snap.stats[k]} base={cls.stats[k]} note={note} onChange={v2 => setStat(k, v2)} />
                })}
                <p className="mb-1 text-[11px] leading-[1.5] text-[var(--t2)]">
                  Tick marks show the soft caps from the game&apos;s HP, FP, stamina and equip-load tables. Damage stats have no ticks because their caps depend on the weapon.
                </p>
              </section>

              <section className="rounded-[10px] border border-[var(--border)] bg-[var(--bg2)] p-[18px]" aria-labelledby="er-class-h">
                <h2 id="er-class-h" className="mb-1 text-[14px] font-medium text-[var(--t1)]">Best starting class for these stats</h2>
                <p className="mb-3 text-[12px] text-[var(--t2)]">Exact level and runes for each class if you want at least the stats above.</p>
                <div className="flex flex-col gap-2">
                  {rankings.map((r, i) => (
                    <button
                      key={r.cls.id}
                      onClick={() => r.cls.id !== snap.classId && changeClass(r.cls.id)}
                      aria-pressed={r.cls.id === snap.classId}
                      className={`flex min-h-[44px] items-center justify-between rounded-[8px] border px-3 py-2 text-left text-[12px] ${r.cls.id === snap.classId ? 'border-[var(--mint)] bg-[rgba(0,229,160,0.08)]' : 'border-[var(--border)] bg-[var(--bg3)]'}`}
                    >
                      <span className="text-[var(--t1)]">{r.cls.name}{i === 0 && <span className="ml-2 rounded-[4px] bg-[rgba(0,229,160,0.1)] px-[7px] py-[2px] text-[10px] text-[var(--mint)]">Lowest level</span>}</span>
                      <span className="text-[var(--t2)]">Level {r.level} · {fmt(r.runes)} runes</span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="rounded-[10px] border border-[var(--border)] bg-[var(--bg2)] p-[18px]" aria-labelledby="er-gear">
                <h2 id="er-gear" className="mb-1 text-[14px] font-medium text-[var(--t1)]">Armor and talismans</h2>
                <p className="mb-3 text-[12px] text-[var(--t2)]">Type a name and pick it from the list. Weights add to your equip load, and talismans change your stats.</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {SLOT_LABELS.map((label, i) => {
                    const piece = armorPieces[i]
                    return (
                      <ItemInput
                        key={label} id={`er-armor-${i}`} label={label} value={armorSel[i]}
                        options={ARMOR[i].map(a => a.name)}
                        hint={piece ? `Weight ${piece.weight}, poise ${piece.poise ?? 'unknown'}` : `${ARMOR[i].length} pieces`}
                        onChange={v2 => setArmor(i, v2)}
                      />
                    )
                  })}
                </div>
                <h3 className="mb-2 mt-4 text-[12px] text-[var(--t2)]">Talismans (4 slots)</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {[0, 1, 2, 3].map(i => {
                    const t = TAL_MAP.get(talSel[i])
                    return (
                      <ItemInput
                        key={i} id={`er-tal-${i}`} label={`Slot ${i + 1}`} value={talSel[i]}
                        options={TALISMANS.map(x => x.name)}
                        hint={t ? `Weight ${t.weight}${t.dlc ? ' · Shadow of the Erdtree' : ''}. ${t.effect}` : `${TALISMANS.length} talismans`}
                        onChange={v2 => setTal(i, v2)}
                      />
                    )
                  })}
                </div>
                {talError && <p className="mt-2 text-[11px] text-[#FF8A80]">{talError}</p>}
                <p className="mt-3 text-[11px] leading-[1.5] text-[var(--t2)]">
                  Weapons, shields, spells and attack rating are not in this version yet. Type their combined weight in the results panel.
                </p>
              </section>

              <section className="rounded-[10px] border border-[var(--border)] bg-[var(--bg2)] p-[18px]" aria-labelledby="er-saved">
                <h2 id="er-saved" className="mb-3 text-[14px] font-medium text-[var(--t1)]">Saved builds and import</h2>
                <div className="flex gap-2">
                  <input type="text" value={saveName} onChange={e => setSaveName(e.target.value)} placeholder="Name this build" aria-label="Build name" className={fieldCls} />
                  <button onClick={handleSave} className={btnSecondary + ' shrink-0'}>Save</button>
                </div>
                <div className="mt-2 flex gap-2">
                  <input type="text" value={importText} onChange={e => setImportText(e.target.value)} placeholder="Paste a build link to load it" aria-label="Import a build link" className={fieldCls} />
                  <button onClick={handleImport} className={btnSecondary + ' shrink-0'}>Load</button>
                </div>
                {importError && <p className="mt-1 text-[11px] text-[#FF8A80]">{importError}</p>}
                {saved.length > 0 && (
                  <div className="mt-3 flex flex-col gap-2">
                    {saved.map((s, i) => (
                      <div key={i} className="flex flex-wrap items-center justify-between gap-2 rounded-[8px] bg-[var(--bg3)] px-3 py-2">
                        <span className="min-w-0 truncate text-[12px] text-[var(--t1)]">{s.name}</span>
                        <div className="flex shrink-0 gap-2">
                          <button onClick={() => loadSaved(s.q)} className={btnGhost}>Load</button>
                          <button onClick={() => setCompareIdx(compareIdx === i ? null : i)} aria-pressed={compareIdx === i} className={btnGhost}>Compare</button>
                          <button onClick={() => { persist(saved.filter((_, n) => n !== i)); if (compareIdx === i) setCompareIdx(null) }} className={btnGhost + ' text-[#FF8A80]'}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <p className="mt-2 text-[10px] text-[var(--t2)]">Saved builds stay in this browser only.</p>

                {cmp && (
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full min-w-[340px] text-[12px]">
                      <caption className="mb-2 text-left text-[12px] text-[var(--t2)]">Current build vs {cmp.name} ({cmp.cls})</caption>
                      <thead><tr className="text-left text-[var(--t2)]"><th className="py-1 font-normal">Stat</th><th className="py-1 font-normal">Current</th><th className="py-1 font-normal">{cmp.name}</th><th className="py-1 font-normal">Difference</th></tr></thead>
                      <tbody>
                        {([
                          ['Level', build.level, cmp.b.level],
                          ['Runes needed', build.totalRunes, cmp.b.totalRunes],
                          ['HP', build.hp, cmp.b.hp],
                          ['FP', build.fp, cmp.b.fp],
                          ['Stamina', build.stamina, cmp.b.stamina],
                          ['Equip load', build.equipLoad, cmp.b.equipLoad],
                        ] as [string, number, number][]).map(([label, a, b]) => {
                          const d = Math.round((a - b) * 10) / 10
                          return (
                            <tr key={label} className="border-t border-[var(--border)]">
                              <td className="py-[6px] text-[var(--t2)]">{label}</td>
                              <td className="py-[6px] text-[var(--t1)]">{fmt(a)}</td>
                              <td className="py-[6px] text-[var(--t1)]">{fmt(b)}</td>
                              <td className="py-[6px] text-[var(--t2)]">{d > 0 ? '+' : ''}{fmt(d)}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </div>

            {/* RESULTS (sticky on desktop) */}
            <aside className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--bg2)] p-[18px] lg:sticky lg:top-4 lg:w-[340px] lg:shrink-0" aria-labelledby="er-res">
              <h2 id="er-res" className="mb-[14px] text-[14px] font-medium text-[var(--t1)]">Results</h2>
              <div className="mb-[10px] flex flex-wrap gap-[10px]">
                <Tile label="Level" value={String(build.level)} accent />
                <Tile label={`Runes from ${cls.name} start`} value={fmt(build.totalRunes)} />
              </div>
              <p className="mb-[10px] text-[11px] text-[var(--t2)]">Next level costs {fmt(build.nextLevelRunes)} runes.</p>
              <div className="mb-[14px] flex flex-wrap gap-[10px]">
                <Tile label="HP" value={fmt(build.hp)} />
                <Tile label="FP" value={fmt(build.fp)} />
                <Tile label="Stamina" value={String(build.stamina)} />
              </div>

              <label htmlFor="er-weight" className="mb-[6px] block text-[12px] text-[var(--t2)]">Weapons and other gear weight (type it in)</label>
              <input id="er-weight" type="number" inputMode="decimal" min={0} step={0.1} placeholder="0.0" value={gearText} onChange={e => setGearText(e.target.value)} className={fieldCls + ' mb-3'} />

              <div className="mb-[6px] flex justify-between text-[12px]">
                <span className="text-[var(--t2)]">Equip load</span>
                <span className="text-[var(--t1)]">{totalWeight.toFixed(1)} / {maxLoad.toFixed(1)}{roll && <span className="ml-2 text-[var(--blue)]">{roll} roll</span>}</span>
              </div>
              <div className="relative flex h-[8px] overflow-hidden rounded-[4px]" role="img" aria-label={roll ? `${roll} roll, ${loadPct.toFixed(1)} percent of equip load` : 'Equip load'}>
                <span style={{ width: '30%', background: 'var(--mint)' }} />
                <span style={{ width: '40%', background: 'var(--blue)' }} />
                <span style={{ width: '30%', background: 'var(--orange)' }} />
              </div>
              <div className="relative h-[10px]">
                {totalWeight > 0 && <span className="absolute top-[2px] h-[10px] w-[2px] bg-[var(--t1)]" style={{ left: `${Math.min(100, loadPct)}%` }} />}
              </div>
              <div className="mb-[6px] flex justify-between text-[10px] text-[var(--t2)]"><span>Light (under 30%)</span><span>Medium (to 70%)</span><span>Heavy</span></div>
              <p className="mb-[14px] text-[11px] text-[var(--t2)]">
                Armor {armorWeight.toFixed(1)} + talismans {talWeight.toFixed(1)} + other {gearWeight.toFixed(1)}. Armor poise {poiseTotal}{poiseUnknown ? ' (some pieces unknown)' : ''}.
              </p>

              <h3 className="mb-1 text-[13px] font-medium text-[var(--t1)]">Suggestions</h3>
              <div>
                {tips.map((t, i) => (
                  <div key={i} className="flex gap-[10px] border-t border-[var(--border)] py-[10px] text-[12px] leading-[1.55] text-[var(--t2)]">
                    <span className="mt-[6px] h-[6px] w-[6px] shrink-0 rounded-full bg-[var(--mint)]" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button onClick={() => copy('link')} className={btnPrimary + ' flex-1'}>{copied === 'link' ? 'Copied!' : 'Copy share link'}</button>
                <button onClick={() => copy('text')} className={btnSecondary + ' flex-1'}>{copied === 'text' ? 'Copied!' : 'Copy as text'}</button>
              </div>
            </aside>
          </div>
        </ToolSection>

        {/* EXAMPLE SPREADS */}
        <ToolSection>
          <SectionLabel>Start from an example spread</SectionLabel>
          <div className="grid grid-cols-1 gap-[10px] sm:grid-cols-2 lg:grid-cols-4">
            {EXAMPLE_SPREADS.map(s => (
              <button key={s.id} onClick={() => applySpread(s.target)} className="min-h-[44px] rounded-[10px] border border-[var(--border)] bg-[var(--bg2)] p-4 text-left hover:border-[var(--border2)]">
                <p className="text-[13px] font-medium text-[var(--t1)]">{s.name}</p>
                <p className="mt-1 text-[11px] leading-[1.5] text-[var(--t2)]">{s.note}</p>
              </button>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-[var(--t2)]">Example spreads are simple starting points. They pick the lowest-level class for you and are not tuned for any specific weapon.</p>
        </ToolSection>

        <ToolSection>
          <ToolExplanation
            title="How the numbers are calculated"
            paragraphs={[
              'Your level is the total of your eight attributes minus 79. Every class starts with a different spread, so the same final stats cost a different amount of runes depending on where you begin. The class finder above does that math for all ten classes.',
              'HP, FP, stamina and equip load come from the game\'s own tables, so the gain for the next point is exact. Rune costs use the game\'s level formula, checked against the published level table.',
            ]}
            cards={[
              { icon: Sword, iconBg: 'rgba(0,229,160,0.1)', iconColor: 'var(--mint)', title: 'Requirements first', body: 'Type what your weapon needs and get the lowest level that meets it.' },
              { icon: Shield, iconBg: 'rgba(80,140,255,0.1)', iconColor: 'var(--blue)', title: 'Exact survivability', body: 'HP, FP, stamina and equip load for every stat value from 1 to 99.' },
              { icon: Target, iconBg: 'rgba(255,120,64,0.1)', iconColor: 'var(--orange)', title: 'Best class', body: 'See level and runes for all ten starting classes side by side.' },
            ]}
          />
        </ToolSection>

        <ToolSection>
          <ToolHowTo
            steps={[
              { title: 'Pick a class and add requirements', description: 'Choose a starting class, then type the stats your weapon asks for. Press Optimize to get the lowest level that meets them.' },
              { title: 'Adjust the rest', description: 'Add Vigor, Mind and Endurance. Each row shows exactly what the next point gives you.' },
              { title: 'Share or save', description: 'Copy the share link, copy a text summary for Discord, or save the build in your browser and compare it later.' },
            ]}
          />
        </ToolSection>

        <ToolSection last>
          <ToolFaq
            items={[
              { question: 'Does this include weapons and attack rating?', answer: 'Not yet. Armor (weight and poise) and talismans (weight and stat effects) are included. Weapons, shields, spells and attack rating are planned. For now, type the weapon requirements and the combined weapon weight yourself.' },
              { question: 'How do talismans change the numbers?', answer: 'Stat talismans like Radagon\'s Soreseal raise the attribute used for HP, FP, stamina, equip load and weapon requirements, but not your level. Percent talismans (HP, FP, stamina, equip load) multiply with each other. Different versions of the same talisman cannot be equipped together.' },
              { question: 'Is the armor list complete?', answer: 'It has 705 pieces, including Shadow of the Erdtree. A few pieces are missing because the source page had broken data for them. We would rather leave a piece out than show a wrong weight.' },
              { question: 'How are rune costs calculated?', answer: 'We use the game\'s level-up formula. It matches the published level table, for example 673 runes from level 1 to 2 and 1,038 runes from level 12 to 13.' },
              { question: 'Why do the soft cap ticks only show on three stats?', answer: 'HP, FP, stamina and equip load have published tables with clear soft caps. Attack from Strength, Dexterity, Intelligence, Faith and Arcane depends on the weapon, so we do not draw a cap that would be wrong for many weapons.' },
              { question: 'What does Optimize do?', answer: 'It sets each attribute to the higher of your class\'s starting value and the requirement you typed, which is the lowest level that can use the weapon. "Best class" also picks the class that makes this cheapest.' },
              { question: 'Where do saved builds go?', answer: 'They are stored in your browser only, so they will not appear on another device. Use the share link to move a build between devices.' },
            ]}
          />
        </ToolSection>

        <div className="h-[72px] md:hidden" aria-hidden="true" />
      </ToolLayout>

      {/* MOBILE SUMMARY BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center gap-4 border-t border-[var(--border2)] bg-[var(--bg2)] px-4 py-[10px] md:hidden">
        <div className="flex-1"><span className="block text-[11px] text-[var(--t2)]">Level</span><strong className="text-[18px] text-[var(--mint)]">{build.level}</strong></div>
        <div className="flex-1"><span className="block text-[11px] text-[var(--t2)]">Runes</span><strong className="text-[15px] text-[var(--t1)]">{fmt(build.totalRunes)}</strong></div>
        <button onClick={() => copy('link')} className={btnPrimary + ' min-h-[44px]'}>{copied === 'link' ? 'Copied!' : 'Share'}</button>
      </div>

      <ToolRelated
        tools={[
          { name: 'Valorant Crosshair Generator', description: 'Build and copy a Valorant crosshair code', slug: 'valorant-crosshair-generator', icon: Target, iconBg: 'rgba(0,229,160,0.1)', iconColor: 'var(--mint)' },
          { name: 'PC Bottleneck Calculator', description: 'Find your CPU/GPU bottleneck', slug: 'pc-bottleneck-calculator', icon: Shield, iconBg: 'rgba(80,140,255,0.1)', iconColor: 'var(--blue)' },
          { name: 'Reaction Speed Test', description: 'Test and track your reaction time', slug: 'reaction-speed-test', icon: Sword, iconBg: 'rgba(255,120,64,0.1)', iconColor: 'var(--orange)' },
        ]}
      />
    </>
  )
}
