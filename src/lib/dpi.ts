// ── DPI / eDPI / cm-per-360 MATH ─────────────────────────────────────────────
// Pure functions (no React, no imports) so they can be tested with
// `node --experimental-strip-types scripts/verify-dpi.mjs`.
//
//   eDPI             = DPI × sensitivity
//   inches per 360   = 360 ÷ (yaw × DPI × sensitivity)
//   cm per 360       = inches per 360 × 2.54
//
// "yaw" is the degrees one mouse count turns you at sensitivity 1. Yaw values
// live in src/data/sensitivityGames.ts (shared with the Sensitivity Converter).

export const CM_PER_INCH = 2.54

const bad = (...n: number[]) => n.some(x => !Number.isFinite(x) || x <= 0)

export function edpi(dpi: number, sens: number): number {
  return bad(dpi, sens) ? 0 : dpi * sens
}

export function inchesPer360(dpi: number, sens: number, yaw: number): number {
  return bad(dpi, sens, yaw) ? 0 : 360 / (yaw * dpi * sens)
}

export function cmPer360(dpi: number, sens: number, yaw: number): number {
  return inchesPer360(dpi, sens, yaw) * CM_PER_INCH
}

/** Sensitivity that keeps the same turn distance after changing DPI (same game). */
export function sensForNewDpi(sens: number, fromDpi: number, toDpi: number): number {
  return bad(sens, fromDpi, toDpi) ? 0 : (sens * fromDpi) / toDpi
}

export function roundTo(value: number, decimals: number): number {
  const f = Math.pow(10, decimals)
  return Math.round(value * f) / f
}

/** DPI needed for a target cm per 360 at a given sensitivity. */
export function dpiForTarget(targetCm: number, sens: number, yaw: number): number {
  return bad(targetCm, sens, yaw) ? 0 : (360 * CM_PER_INCH) / (yaw * sens * targetCm)
}

/** Sensitivity needed for a target cm per 360 at a given DPI. */
export function sensForTarget(targetCm: number, dpi: number, yaw: number): number {
  return bad(targetCm, dpi, yaw) ? 0 : (360 * CM_PER_INCH) / (yaw * dpi * targetCm)
}

/** How much faster B turns than A, as a percent (negative = slower). Uses cm per 360. */
export function percentFaster(aCm: number, bCm: number): number {
  return bad(aCm, bCm) ? 0 : (aCm / bCm - 1) * 100
}

/** How much less hand travel B needs than A for a full turn, as a percent (negative = more). */
export function percentLessTravel(aCm: number, bCm: number): number {
  return bad(aCm, bCm) ? 0 : (1 - bCm / aCm) * 100
}

export interface PadFit {
  fits360: boolean
  fits180: boolean
  /** Centimetres left on the pad after a 180° turn (negative = does not fit). */
  spare180: number
  /** Centimetres a full turn goes past the pad edge (0 if it fits). */
  over360: number
}

export function padFit(cm360: number, padCm: number): PadFit {
  const spare180 = padCm - cm360 / 2
  return {
    fits360: cm360 <= padCm,
    fits180: cm360 / 2 <= padCm,
    spare180,
    over360: Math.max(0, cm360 - padCm),
  }
}

// ── Screen PPI ───────────────────────────────────────────────────────────────
export function ppi(widthPx: number, heightPx: number, diagonalIn: number): number {
  return bad(widthPx, heightPx, diagonalIn) ? 0 : Math.hypot(widthPx, heightPx) / diagonalIn
}

export function pixelSizeMm(ppiValue: number): number {
  return ppiValue > 0 ? 25.4 / ppiValue : 0
}

// ── Share links ──────────────────────────────────────────────────────────────
export interface DpiState {
  gameId: string
  dpi: number
  sens: number
  padCm: number // 0 = not set
}

export function encodeState(s: DpiState): string {
  const p = new URLSearchParams()
  p.set('g', s.gameId)
  p.set('d', String(s.dpi))
  p.set('s', String(s.sens))
  if (s.padCm > 0) p.set('p', String(s.padCm))
  return p.toString()
}

export function decodeState(query: string, validGameIds: string[]): DpiState | null {
  const q = query.includes('?') ? query.slice(query.indexOf('?') + 1) : query
  const p = new URLSearchParams(q.replace(/^#/, ''))
  const g = p.get('g')
  const d = Number(p.get('d'))
  const s = Number(p.get('s'))
  const pad = Number(p.get('p') ?? 0)
  if (!g || !validGameIds.includes(g) || bad(d, s)) return null
  return { gameId: g, dpi: d, sens: s, padCm: Number.isFinite(pad) && pad > 0 ? pad : 0 }
}
