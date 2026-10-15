// ── VALORANT CROSSHAIR ENGINE ────────────────────────────────────────────────
// Encodes/decodes crosshair settings to a Valorant-style profile code.
//
// NOTE FOR JG: this follows the general key/value pattern used across the
// community (e.g. "0;P;c;1;h;0;...;0t;1;0l;3;...") but Riot has never
// published an official spec, so every fan site's encoder is reverse
// engineered. Please paste one generated code into Valorant's own
// "Import Profile Code" field after deploying — if any single slider looks
// wrong in-game, tell me which one (e.g. "outline opacity") and I'll fix
// just that part of the encoder. Decoding is lenient: unknown keys are
// ignored instead of crashing, so pasting a code copied from another site
// will still load whatever it recognizes.

export interface CrosshairSettings {
  useCustomColor: boolean
  colorIndex: number        // 0-7, index into COLOR_PRESETS
  customColor: string       // '#RRGGBB', used when useCustomColor is true

  outlineEnabled: boolean
  outlineOpacity: number    // 0-1
  outlineThickness: number  // 1-4

  fadeWithFiringError: boolean

  centerDotEnabled: boolean
  centerDotThickness: number
  centerDotOpacity: number
  centerDotSize: number

  innerLinesEnabled: boolean
  innerLineLength: number
  innerLineOffset: number
  innerLineThickness: number
  innerLineOpacity: number
  innerLineMovementError: boolean
  innerLineFiringError: boolean

  outerLinesEnabled: boolean
  outerLineLength: number
  outerLineOffset: number
  outerLineThickness: number
  outerLineOpacity: number
  outerLineMovementError: boolean
  outerLineFiringError: boolean
}

export const COLOR_PRESETS: { name: string; hex: string }[] = [
  { name: 'Mint Green', hex: '#00E5A0' },
  { name: 'White',      hex: '#FFFFFF' },
  { name: 'Cyan',       hex: '#2FE6E6' },
  { name: 'Yellow',     hex: '#F5D742' },
  { name: 'Pink',       hex: '#FF66C4' },
  { name: 'Orange',     hex: '#FF7840' },
  { name: 'Purple',     hex: '#B084FF' },
  { name: 'Red',        hex: '#FF4D4D' },
]

export function defaultSettings(): CrosshairSettings {
  return {
    useCustomColor: false,
    colorIndex: 0,
    customColor: '#00E5A0',
    outlineEnabled: true,
    outlineOpacity: 1,
    outlineThickness: 1,
    fadeWithFiringError: false,
    centerDotEnabled: false,
    centerDotThickness: 2,
    centerDotOpacity: 1,
    centerDotSize: 2,
    innerLinesEnabled: true,
    innerLineLength: 6,
    innerLineOffset: 3,
    innerLineThickness: 2,
    innerLineOpacity: 1,
    innerLineMovementError: true,
    innerLineFiringError: false,
    outerLinesEnabled: false,
    outerLineLength: 6,
    outerLineOffset: 8,
    outerLineThickness: 2,
    outerLineOpacity: 1,
    outerLineMovementError: false,
    outerLineFiringError: false,
  }
}

function r3(n: number) {
  return Math.round(n * 1000) / 1000
}

function encodeProfile(tag: 'P' | 'S', s: CrosshairSettings): string {
  const kv: (string | number)[] = []

  if (s.useCustomColor) {
    kv.push('c', 8, 'u', s.customColor.replace('#', '').toUpperCase())
  } else {
    kv.push('c', s.colorIndex)
  }

  kv.push('h', s.outlineEnabled ? 1 : 0, 'o', r3(s.outlineOpacity), 't', s.outlineThickness)
  kv.push('f', s.fadeWithFiringError ? 1 : 0)
  kv.push('d', s.centerDotEnabled ? 1 : 0, 'z', s.centerDotThickness, 'a', r3(s.centerDotOpacity), 's', s.centerDotSize)

  kv.push(
    '0t', s.innerLinesEnabled ? 1 : 0,
    '0l', s.innerLineLength,
    '0o', s.innerLineOffset,
    '0v', s.innerLineThickness,
    '0a', r3(s.innerLineOpacity),
    '0m', s.innerLineMovementError ? 1 : 0,
    '0f', s.innerLineFiringError ? 1 : 0,
  )

  kv.push(
    '1t', s.outerLinesEnabled ? 1 : 0,
    '1l', s.outerLineLength,
    '1o', s.outerLineOffset,
    '1v', s.outerLineThickness,
    '1a', r3(s.outerLineOpacity),
    '1m', s.outerLineMovementError ? 1 : 0,
    '1f', s.outerLineFiringError ? 1 : 0,
  )

  return [tag, ...kv].join(';')
}

export function encodeCrosshair(
  primary: CrosshairSettings,
  ads: CrosshairSettings,
  useSeparateAds: boolean,
): string {
  let code = '0;' + encodeProfile('P', primary)
  if (useSeparateAds) code += ';' + encodeProfile('S', ads)
  return code
}

function applyKey(s: CrosshairSettings, key: string, value: string) {
  switch (key) {
    case 'c':
      if (value === '8') s.useCustomColor = true
      else { s.useCustomColor = false; s.colorIndex = Number(value) || 0 }
      break
    case 'u':
      s.customColor = '#' + value.slice(-6).toUpperCase()
      break
    case 'h': s.outlineEnabled = value === '1'; break
    case 'o': s.outlineOpacity = parseFloat(value) || 0; break
    case 't': s.outlineThickness = parseInt(value) || 1; break
    case 'f': s.fadeWithFiringError = value === '1'; break
    case 'd': s.centerDotEnabled = value === '1'; break
    case 'z': s.centerDotThickness = parseInt(value) || 1; break
    case 'a': s.centerDotOpacity = parseFloat(value) || 0; break
    case 's': s.centerDotSize = parseInt(value) || 1; break
    case '0t': s.innerLinesEnabled = value === '1'; break
    case '0l': s.innerLineLength = parseInt(value) || 0; break
    case '0o': s.innerLineOffset = parseInt(value) || 0; break
    case '0v': s.innerLineThickness = parseInt(value) || 1; break
    case '0a': s.innerLineOpacity = parseFloat(value) || 0; break
    case '0m': s.innerLineMovementError = value === '1'; break
    case '0f': s.innerLineFiringError = value === '1'; break
    case '1t': s.outerLinesEnabled = value === '1'; break
    case '1l': s.outerLineLength = parseInt(value) || 0; break
    case '1o': s.outerLineOffset = parseInt(value) || 0; break
    case '1v': s.outerLineThickness = parseInt(value) || 1; break
    case '1a': s.outerLineOpacity = parseFloat(value) || 0; break
    case '1m': s.outerLineMovementError = value === '1'; break
    case '1f': s.outerLineFiringError = value === '1'; break
    default: break // unknown key — ignore rather than throw
  }
}

export interface DecodedCrosshair {
  primary: CrosshairSettings
  ads: CrosshairSettings | null
}

export function decodeCrosshair(code: string): DecodedCrosshair | null {
  const tokens = code.trim().split(';').filter(Boolean)
  if (tokens.length === 0) return null

  const primary = defaultSettings()
  let ads: CrosshairSettings | null = null
  let current: CrosshairSettings = primary

  let i = tokens[0] === '0' ? 1 : 0
  while (i < tokens.length) {
    const tok = tokens[i]
    if (tok === 'P') { current = primary; i += 1; continue }
    if (tok === 'S') { ads = defaultSettings(); current = ads; i += 1; continue }

    const key = tok
    const value = tokens[i + 1] ?? ''
    applyKey(current, key, value)
    i += 2
  }

  return { primary, ads }
}
