import { type CrosshairSettings, defaultSettings, encodeCrosshair } from '@/lib/crosshair'

function build(overrides: Partial<CrosshairSettings>): CrosshairSettings {
  return { ...defaultSettings(), ...overrides }
}

export interface CrosshairPreset {
  id: string
  name: string
  note: string
  settings: CrosshairSettings
}

// NOTE FOR JG: these are archetypal styles inspired by commonly-described pro
// playstyles (small dot vs. classic lines vs. minimalist), NOT verified real
// settings pulled from any specific player's actual config. Labeling one of
// these as "TenZ's real crosshair" without a sourced, verified code would be
// putting words in a real person's mouth — so I kept the names generic. If
// you want real pro codes, the move is sourcing them from an official
// interview, the player's own stream/socials, or a site like Liquipedia, and
// I'm happy to help you search for and verify those once you're ready.
export const STYLE_PRESETS: CrosshairPreset[] = [
  {
    id: 'pro-small-dot',
    name: 'Pro Style — Small Dot',
    note: 'Tiny center dot, no lines. Favoured by players who prioritize a clean sightline.',
    settings: build({
      centerDotEnabled: true, centerDotSize: 1, centerDotThickness: 1, centerDotOpacity: 1,
      innerLinesEnabled: false, outerLinesEnabled: false, outlineThickness: 1,
    }),
  },
  {
    id: 'pro-classic-cross',
    name: 'Pro Style — Classic Cross',
    note: 'Short, thick inner lines with no outer lines. The most common competitive shape.',
    settings: build({
      innerLinesEnabled: true, innerLineLength: 4, innerLineOffset: 2, innerLineThickness: 2,
      outerLinesEnabled: false,
    }),
  },
  {
    id: 'pro-minimalist',
    name: 'Pro Style — Minimalist',
    note: 'Very short, thin lines close to center. Low visual clutter at long range.',
    settings: build({
      innerLinesEnabled: true, innerLineLength: 2, innerLineOffset: 1, innerLineThickness: 1,
      outerLinesEnabled: false, outlineEnabled: false,
    }),
  },
  {
    id: 'pro-wide-cross',
    name: 'Pro Style — Wide Cross',
    note: 'Longer inner lines with a wider offset for players who track with peripheral vision.',
    settings: build({
      innerLinesEnabled: true, innerLineLength: 8, innerLineOffset: 5, innerLineThickness: 2,
      outerLinesEnabled: false,
    }),
  },
  {
    id: 'pro-full-cross',
    name: 'Pro Style — Full Cross',
    note: 'Inner + outer lines both on, for a traditional four-line reticle.',
    settings: build({
      innerLinesEnabled: true, innerLineLength: 4, innerLineOffset: 2, innerLineThickness: 2,
      outerLinesEnabled: true, outerLineLength: 4, outerLineOffset: 10, outerLineThickness: 2,
    }),
  },
]

// Fun / novelty presets — still built from Valorant's real line + dot system
// (the game has no support for literal pixel-art shapes), just arranged in
// ways the community gives playful names to.
export const FUN_PRESETS: CrosshairPreset[] = [
  {
    id: 'fun-big-box',
    name: 'Big Box Frame',
    note: 'Long outer lines, no inner lines — frames the target in a big square.',
    settings: build({
      innerLinesEnabled: false,
      outerLinesEnabled: true, outerLineLength: 14, outerLineOffset: 14, outerLineThickness: 2,
      colorIndex: 5,
    }),
  },
  {
    id: 'fun-ghost-dot',
    name: 'Ghost Dot',
    note: 'A barely-visible low-opacity dot — for players who want almost nothing on screen.',
    settings: build({
      centerDotEnabled: true, centerDotOpacity: 0.3, centerDotSize: 2,
      innerLinesEnabled: false, outlineEnabled: false,
    }),
  },
  {
    id: 'fun-laser-x',
    name: 'Laser X',
    note: 'Thick, long, high-opacity lines close together — impossible to lose track of.',
    settings: build({
      innerLinesEnabled: true, innerLineLength: 12, innerLineOffset: 1, innerLineThickness: 3,
      colorIndex: 7,
    }),
  },
]

export const MAP_BACKGROUNDS: { id: string; name: string; gradient: string }[] = [
  { id: 'ascent', name: 'Ascent',  gradient: 'linear-gradient(160deg,#5b4a3a,#2b241d)' },
  { id: 'bind',   name: 'Bind',    gradient: 'linear-gradient(160deg,#8a5a3a,#3a2416)' },
  { id: 'haven',  name: 'Haven',   gradient: 'linear-gradient(160deg,#3a5a56,#1b2b29)' },
  { id: 'icebox', name: 'Icebox',  gradient: 'linear-gradient(160deg,#6b8a9e,#223038)' },
  { id: 'range',  name: 'Range',   gradient: 'linear-gradient(160deg,#5a5a5a,#232323)' },
  { id: 'dark',   name: 'Dark BG', gradient: 'linear-gradient(160deg,#0d1117,#05060a)' },
]

export const STARTER_CODE = encodeCrosshair(defaultSettings(), defaultSettings(), false)
