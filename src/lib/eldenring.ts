// ── ELDEN RING BUILD ENGINE ──────────────────────────────────────────────────
// Pure functions only (no React, no browser APIs) so they can be tested with
// `node --experimental-strip-types scripts/verify-eldenring.mjs`.
//
// WHERE EACH NUMBER COMES FROM (all checked in Oct 2026):
//  - Vigor → HP (1-99), explicit table:    eldenring.wiki.gg/wiki/HP
//  - Mind → FP (1-40), explicit table:     eldenring.wiki.gg/wiki/FP
//    Mind 41-99 is a formula, checked against wiki values at Mind 41, 50, 60,
//    80 and 99 (fandom Mind page) and against the 36-40 rows of the wiki table.
//  - Endurance → Stamina: formula (piecewise straight lines, rounded down).
//    It reproduces every row of the wiki table (Endurance 11-40) and the
//    wiki values at 41, 46, 50, 60, 80, 99. Endurance 8-10 is derived by the
//    same line because the wiki leaves those rows blank.
//  - Endurance → Equip Load (8-99), explicit table: eldenring.wiki.gg/wiki/Equip_Load
//  - Runes per level: formula, checked against the wiki level table
//    (eldenring.wiki.gg/wiki/Level) at levels 1-37, 74, 105 and 138, plus the
//    cumulative totals shown there.
//  - Starting classes: each class's stats add up to (79 + starting level).
//
// Armor and talisman lists come from saved wiki pages (see src/data/eldenringGear.ts).
// Talisman effects are read from the wiki's effect text by parseTalismanEffect().
// NOT INCLUDED YET: weapons, spells, attack rating.

export const STAT_KEYS = [
  'vigor', 'mind', 'endurance', 'strength', 'dexterity', 'intelligence', 'faith', 'arcane',
] as const
export type StatKey = typeof STAT_KEYS[number]
export type Stats = Record<StatKey, number>

export const STAT_LABELS: Record<StatKey, string> = {
  vigor: 'Vigor', mind: 'Mind', endurance: 'Endurance', strength: 'Strength',
  dexterity: 'Dexterity', intelligence: 'Intelligence', faith: 'Faith', arcane: 'Arcane',
}

export const MAX_STAT = 99
export const MAX_LEVEL = 713 // 8 stats at 99 = 792, minus 79

// ── CLASSES ──────────────────────────────────────────────────────────────────
export interface StartingClass { id: string; name: string; level: number; stats: Stats }

function cls(id: string, name: string, level: number, s: number[]): StartingClass {
  return {
    id, name, level,
    stats: {
      vigor: s[0], mind: s[1], endurance: s[2], strength: s[3],
      dexterity: s[4], intelligence: s[5], faith: s[6], arcane: s[7],
    },
  }
}

export const CLASSES: StartingClass[] = [
  cls('vagabond',   'Vagabond',   9,  [15, 10, 11, 14, 13, 9, 9, 7]),
  cls('warrior',    'Warrior',    8,  [11, 12, 11, 10, 16, 10, 8, 9]),
  cls('hero',       'Hero',       7,  [14, 9, 12, 16, 9, 7, 8, 11]),
  cls('bandit',     'Bandit',     5,  [10, 11, 10, 9, 13, 9, 8, 14]),
  cls('astrologer', 'Astrologer', 6,  [9, 15, 9, 8, 12, 16, 7, 9]),
  cls('prophet',    'Prophet',    7,  [10, 14, 8, 11, 10, 7, 16, 10]),
  cls('confessor',  'Confessor',  10, [10, 13, 10, 12, 12, 9, 14, 9]),
  cls('samurai',    'Samurai',    9,  [12, 11, 13, 12, 15, 9, 8, 8]),
  cls('prisoner',   'Prisoner',   9,  [11, 12, 11, 11, 14, 14, 6, 9]),
  cls('wretch',     'Wretch',     1,  [10, 10, 10, 10, 10, 10, 10, 10]),
]

export function getClass(id: string): StartingClass {
  return CLASSES.find(c => c.id === id) ?? CLASSES[CLASSES.length - 1]
}

// ── LEVEL & RUNES ────────────────────────────────────────────────────────────
export function sumStats(s: Stats): number {
  let t = 0
  for (const k of STAT_KEYS) t += s[k]
  return t
}

export function levelOf(s: Stats): number {
  return sumStats(s) - 79
}

/** Runes needed to go from `level` to `level + 1`. */
export function runesForNextLevel(level: number): number {
  if (level < 11) return Math.floor(((level + 81) * (level + 81)) / 10) + 1
  return Math.floor(((level - 6) * (level + 81) * (level + 81)) / 50) + 1
}

/** Total runes to go from `fromLevel` up to `toLevel` (0 if toLevel <= fromLevel). */
export function runesBetween(fromLevel: number, toLevel: number): number {
  let total = 0
  for (let l = fromLevel; l < toLevel; l++) total += runesForNextLevel(l)
  return total
}

// ── HP (Vigor 1-99) ──────────────────────────────────────────────────────────
const HP_TABLE: number[] = [
  300, 304, 312, 322, 334, 347, 362, 378, 396, 414,
  434, 455, 476, 499, 522, 547, 572, 598, 624, 652,
  680, 709, 738, 769, 800, 833, 870, 910, 951, 994,
  1037, 1081, 1125, 1170, 1216, 1262, 1308, 1355, 1402, 1450,
  1476, 1503, 1529, 1555, 1581, 1606, 1631, 1656, 1680, 1704,
  1727, 1750, 1772, 1793, 1814, 1834, 1853, 1871, 1887, 1900,
  1906, 1912, 1918, 1924, 1930, 1936, 1942, 1948, 1954, 1959,
  1965, 1971, 1977, 1982, 1988, 1993, 1999, 2004, 2010, 2015,
  2020, 2026, 2031, 2036, 2041, 2046, 2051, 2056, 2060, 2065,
  2070, 2074, 2078, 2082, 2086, 2090, 2094, 2097, 2100,
]

function clampStat(n: number): number {
  return Math.min(MAX_STAT, Math.max(1, Math.round(n)))
}

export function hpFor(vigor: number): number {
  return HP_TABLE[clampStat(vigor) - 1]
}

// ── FP (Mind 1-99) ───────────────────────────────────────────────────────────
const FP_TABLE_1_TO_40: number[] = [
  40, 43, 46, 49, 52, 55, 58, 62, 75, 78,
  82, 85, 88, 91, 95, 100, 105, 110, 116, 121,
  126, 131, 137, 142, 147, 152, 158, 163, 168, 173,
  179, 184, 189, 194, 200, 207, 214, 221, 228, 235,
]

export function fpFor(mind: number): number {
  const m = clampStat(mind)
  if (m <= 40) return FP_TABLE_1_TO_40[m - 1]
  if (m <= 60) {
    const t = (m - 35) / 25
    return Math.floor(200 + 150 * (1 - Math.pow(1 - t, 1.2)))
  }
  return Math.floor(350 + (100 * (m - 60)) / 39)
}

// ── STAMINA (Endurance 1-99) ─────────────────────────────────────────────────
export function staminaFor(endurance: number): number {
  const e = clampStat(endurance)
  if (e <= 15) return Math.floor(80 + (25 * (e - 1)) / 14)
  if (e <= 30) return Math.floor(105 + (25 * (e - 15)) / 15)
  if (e <= 50) return Math.floor(130 + (25 * (e - 30)) / 20)
  return Math.floor(155 + (15 * (e - 50)) / 49)
}

// ── EQUIP LOAD (Endurance 8-99) ──────────────────────────────────────────────
const EQUIP_LOAD_FROM_8: number[] = [
  45.0, 46.6, 48.2, 49.8, 51.4, 52.9, 54.5, 56.1, 57.7, 59.3,
  60.9, 62.5, 64.1, 65.6, 67.2, 68.8, 70.4, 72.0, 73.0, 74.1,
  75.2, 76.4, 77.6, 78.9, 80.2, 81.5, 82.8, 84.1, 85.4, 86.8,
  88.1, 89.5, 90.9, 92.3, 93.7, 95.1, 96.5, 97.9, 99.4, 100.8,
  102.2, 103.7, 105.2, 106.6, 108.1, 109.6, 111.0, 112.5, 114.0, 115.5,
  117.0, 118.5, 120.0, 121.0, 122.1, 123.1, 124.1, 125.1, 126.2, 127.2,
  128.2, 129.2, 130.3, 131.3, 132.3, 133.3, 134.4, 135.4, 136.4, 137.4,
  138.5, 139.5, 140.5, 141.5, 142.6, 143.6, 144.6, 145.6, 146.7, 147.7,
  148.7, 149.7, 150.8, 151.8, 152.8, 153.8, 154.9, 155.9, 156.9, 157.9,
  159.0, 160.0,
]

export function equipLoadFor(endurance: number): number {
  const e = Math.max(8, clampStat(endurance))
  return EQUIP_LOAD_FROM_8[e - 8]
}

export type RollType = 'Light' | 'Medium' | 'Heavy' | 'Overloaded'

/** Light under 30%, Medium 30-70%, Heavy 70-100%, Overloaded above 100%. */
export function rollTypeFor(weight: number, maxLoad: number): RollType {
  const pct = (weight / maxLoad) * 100
  if (pct > 100) return 'Overloaded'
  if (pct >= 70) return 'Heavy'
  if (pct >= 30) return 'Medium'
  return 'Light'
}

// ── SOFT CAPS (taken from the wiki pages above) ──────────────────────────────
export const SOFT_CAPS: Partial<Record<StatKey, number[]>> = {
  vigor: [40, 60],
  mind: [15, 35, 60],
  endurance: [15, 25, 30, 50, 60], // stamina: 15/30/50, equip load: 25/60
}

// ── FULL BUILD ───────────────────────────────────────────────────────────────
export interface BuildResult {
  level: number
  totalRunes: number
  nextLevelRunes: number
  hp: number
  fp: number
  stamina: number
  equipLoad: number
}

export function computeBuild(classId: string, s: Stats): BuildResult {
  const c = getClass(classId)
  const level = levelOf(s)
  return {
    level,
    totalRunes: runesBetween(c.level, level),
    nextLevelRunes: runesForNextLevel(level),
    hp: hpFor(s.vigor),
    fp: fpFor(s.mind),
    stamina: staminaFor(s.endurance),
    equipLoad: equipLoadFor(s.endurance),
  }
}

export function classStats(classId: string): Stats {
  return { ...getClass(classId).stats }
}

/** Exact gain from adding one point to a stat (Vigor, Mind, Endurance only). */
export function nextPointGain(key: StatKey, s: Stats): string | null {
  if (s[key] >= MAX_STAT) return null
  if (key === 'vigor') return `+${hpFor(s.vigor + 1) - hpFor(s.vigor)} HP`
  if (key === 'mind') return `+${fpFor(s.mind + 1) - fpFor(s.mind)} FP`
  if (key === 'endurance') {
    const st = staminaFor(s.endurance + 1) - staminaFor(s.endurance)
    const el = Math.round((equipLoadFor(s.endurance + 1) - equipLoadFor(s.endurance)) * 10) / 10
    return `+${st} stamina, +${el} equip load`
  }
  return null
}

// ── OPTIMIZER HELPERS ────────────────────────────────────────────────────────
/** Lowest-level stats that satisfy the requirements, starting from a class. */
export function meetRequirements(classId: string, req: Partial<Stats>): Stats {
  const base = classStats(classId)
  const out = { ...base }
  for (const k of STAT_KEYS) {
    const want = req[k]
    if (typeof want === 'number' && want > out[k]) out[k] = Math.min(MAX_STAT, want)
  }
  return out
}

export interface ClassRanking { cls: StartingClass; level: number; runes: number }

/** Level and runes for every class if you want at least these stats. */
export function rankClasses(target: Partial<Stats>): ClassRanking[] {
  return CLASSES.map(c => {
    const s = meetRequirements(c.id, target)
    const level = levelOf(s)
    return { cls: c, level, runes: runesBetween(c.level, level) }
  }).sort((a, b) => a.level - b.level || a.cls.level - b.cls.level)
}

// ── EXAMPLE SPREADS ──────────────────────────────────────────────────────────
// Plain starting-point stat targets, NOT guaranteed optimal for any weapon.
export const EXAMPLE_SPREADS: { id: string; name: string; note: string; target: Stats }[] = [
  { id: 'strength', name: 'Strength melee', note: 'Heavy weapons: Vigor 40, Strength 50.',
    target: { vigor: 40, mind: 12, endurance: 25, strength: 50, dexterity: 14, intelligence: 9, faith: 9, arcane: 9 } },
  { id: 'dexterity', name: 'Dexterity melee', note: 'Fast weapons: Vigor 40, Dexterity 50.',
    target: { vigor: 40, mind: 12, endurance: 25, strength: 12, dexterity: 50, intelligence: 9, faith: 8, arcane: 9 } },
  { id: 'intelligence', name: 'Intelligence caster', note: 'Sorceries: Mind 25, Intelligence 60.',
    target: { vigor: 40, mind: 25, endurance: 20, strength: 10, dexterity: 18, intelligence: 60, faith: 7, arcane: 9 } },
  { id: 'faith', name: 'Faith caster', note: 'Incantations: Mind 25, Faith 60.',
    target: { vigor: 40, mind: 25, endurance: 20, strength: 12, dexterity: 12, intelligence: 7, faith: 60, arcane: 9 } },
]

// ── TALISMANS ────────────────────────────────────────────────────────────────
// Percent values are plain numbers (6 means +6%). Different talisman families
// multiply with each other (Fextralife: Erdtree's Favor stacks multiplicatively
// with the amber medallions and Arsenal Charm; at 99 Vigor/Endurance the +2
// Favor adds exactly 84 HP, 17 stamina and 12.8 equip load, which this matches).
export interface TalismanMods {
  hp?: number
  fp?: number
  stamina?: number
  equip?: number
  stats?: Partial<Stats>
}

const STAT_WORDS: Record<string, StatKey> = {
  vigor: 'vigor', mind: 'mind', endurance: 'endurance', strength: 'strength',
  dexterity: 'dexterity', intelligence: 'intelligence', faith: 'faith', arcane: 'arcane',
}

export function parseTalismanEffect(effect: string): TalismanMods | null {
  const mods: TalismanMods = {}
  let m = effect.match(/Raises maximum HP \(([\d.]+)%\), Stamina \(([\d.]+)%\), and Equip Load \(([\d.]+)%\)/i)
  if (m) { mods.hp = Number(m[1]); mods.stamina = Number(m[2]); mods.equip = Number(m[3]) }
  m = effect.match(/maximum HP by ([\d.]+)%/i); if (m) mods.hp = Number(m[1])
  m = effect.match(/maximum HP is reduced by ([\d.]+)%/i); if (m) mods.hp = -Number(m[1])
  m = effect.match(/maximum FP by ([\d.]+)%/i); if (m) mods.fp = Number(m[1])
  m = effect.match(/maximum stamina by ([\d.]+)%/i); if (m) mods.stamina = Number(m[1])
  m = effect.match(/maximum Equip(?:ment)? Load by ([\d.]+)%/i); if (m) mods.equip = Number(m[1])
  m = effect.match(/Raises ([A-Za-z, ]+?)\s*(?:by|\+)\s*(\d+)/i)
  if (m) {
    const words = m[1].split(/,|\band\b/).map(w => w.trim().toLowerCase()).filter(Boolean)
    if (words.length > 0 && words.every(w => w in STAT_WORDS)) {
      mods.stats = {}
      for (const w of words) mods.stats[STAT_WORDS[w]] = Number(m[2])
    }
  }
  return Object.keys(mods).length ? mods : null
}

/** Variants of one talisman (for example +1, +2, +3) cannot be equipped together. */
export function talismanFamily(name: string): string {
  const n = name.replace(/\s*\+\d+$/, '').trim()
  const map: Record<string, string> = {
    "Great-Jar's Arsenal": 'Arsenal Charm',
    "Radagon's Soreseal": "Radagon's Scarseal",
    "Marika's Soreseal": "Marika's Scarseal",
  }
  return map[n] ?? n
}

/** Attribute values after talisman bonuses (an attribute cannot go above 99). */
export function effectiveStats(base: Stats, mods: TalismanMods[]): Stats {
  const out = { ...base }
  for (const m of mods) {
    if (!m.stats) continue
    for (const k of STAT_KEYS) {
      const add = m.stats[k]
      if (add) out[k] = Math.min(MAX_STAT, out[k] + add)
    }
  }
  return out
}

export interface GearBuildResult extends BuildResult { effective: Stats }

/** Level and runes use your real attributes; HP, FP, stamina and equip load use attributes plus talismans. */
export function computeBuildWithGear(classId: string, base: Stats, mods: TalismanMods[]): GearBuildResult {
  const plain = computeBuild(classId, base)
  const eff = effectiveStats(base, mods)
  const mult = (pick: (m: TalismanMods) => number | undefined) =>
    mods.reduce((t, m) => t * (1 + (pick(m) ?? 0) / 100), 1)
  const EPS = 1e-9
  return {
    ...plain,
    effective: eff,
    hp: Math.floor(hpFor(eff.vigor) * mult(m => m.hp) + EPS),
    fp: Math.floor(fpFor(eff.mind) * mult(m => m.fp) + EPS),
    stamina: Math.floor(staminaFor(eff.endurance) * mult(m => m.stamina) + EPS),
    equipLoad: Math.round(equipLoadFor(eff.endurance) * mult(m => m.equip) * 10) / 10,
  }
}

// ── SHARE LINKS ──────────────────────────────────────────────────────────────
export interface BuildState {
  classId: string
  stats: Stats
  gearWeight: number          // weapons, shields and anything else typed in by hand
  targetLevel: number | null
  armor: string[]             // head, chest, arms, legs ('' = empty)
  talismans: string[]         // up to 4 ('' = empty)
}

export function encodeBuild(b: BuildState): string {
  const p = new URLSearchParams()
  p.set('c', b.classId)
  p.set('s', STAT_KEYS.map(k => b.stats[k]).join(','))
  if (b.gearWeight > 0) p.set('w', String(b.gearWeight))
  if (b.targetLevel) p.set('t', String(b.targetLevel))
  if (b.armor.some(Boolean)) p.set('a', b.armor.join('~'))
  if (b.talismans.some(Boolean)) p.set('tl', b.talismans.join('~'))
  return p.toString()
}

export function decodeBuild(query: string): BuildState | null {
  const q = query.includes('?') ? query.slice(query.indexOf('?') + 1) : query
  const p = new URLSearchParams(q.replace(/^#/, ''))
  const c = p.get('c')
  const s = p.get('s')
  if (!c || !s) return null
  const cl = CLASSES.find(x => x.id === c)
  const nums = s.split(',').map(Number)
  if (!cl || nums.length !== 8 || nums.some(n => !Number.isFinite(n))) return null
  const stats = {} as Stats
  STAT_KEYS.forEach((k, i) => {
    stats[k] = Math.min(MAX_STAT, Math.max(cl.stats[k], Math.round(nums[i])))
  })
  const w = Number(p.get('w') ?? 0)
  const t = Number(p.get('t') ?? 0)
  const armor = (p.get('a') ?? '').split('~')
  const tal = (p.get('tl') ?? '').split('~')
  return {
    classId: cl.id,
    stats,
    gearWeight: Number.isFinite(w) && w > 0 ? w : 0,
    targetLevel: Number.isFinite(t) && t >= 1 && t <= MAX_LEVEL ? Math.round(t) : null,
    armor: [0, 1, 2, 3].map(i => armor[i] ?? ''),
    talismans: [0, 1, 2, 3].map(i => tal[i] ?? ''),
  }
}
