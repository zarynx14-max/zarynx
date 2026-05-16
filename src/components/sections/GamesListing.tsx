'use client'

import Link from 'next/link'
import { useState } from 'react'
import { cn } from '@/lib/utils'

/* ─── Types ─────────────────────────────────────────────── */
interface Game {
  id: string
  name: string
  slug: string
  developer: string
  genre: string
  genreKey: string
  color: string
  colorBg: string
  colorBorder: string
  abbr: string
  tools: string[]
  toolCount: number
  available: boolean
  featured?: boolean
}

/* ─── Data ───────────────────────────────────────────────── */
const games: Game[] = [
  {
    id: 'valorant',
    name: 'Valorant',
    slug: 'valorant',
    developer: 'Riot Games',
    genre: 'FPS / Tactical',
    genreKey: 'fps',
    color: '#FF4654',
    colorBg: 'rgba(255,70,84,0.08)',
    colorBorder: 'rgba(255,70,84,0.25)',
    abbr: 'VAL',
    tools: ['Sensitivity Converter', 'Crosshair Generator', 'Agent Tier List', 'Rank Tracker'],
    toolCount: 4,
    available: true,
    featured: true,
  },
  {
    id: 'cs2',
    name: 'CS2',
    slug: 'cs2',
    developer: 'Valve',
    genre: 'FPS / Tactical',
    genreKey: 'fps',
    color: '#EB6E3C',
    colorBg: 'rgba(235,110,60,0.08)',
    colorBorder: 'rgba(235,110,60,0.25)',
    abbr: 'CS2',
    tools: ['Sensitivity Converter', 'Crosshair Generator', 'Trade-Up Calc'],
    toolCount: 3,
    available: true,
  },
  {
    id: 'fortnite',
    name: 'Fortnite',
    slug: 'fortnite',
    developer: 'Epic Games',
    genre: 'Battle Royale',
    genreKey: 'br',
    color: '#64D2FF',
    colorBg: 'rgba(100,210,255,0.08)',
    colorBorder: 'rgba(100,210,255,0.25)',
    abbr: 'FN',
    tools: ['Sensitivity Converter', 'FPS Estimator'],
    toolCount: 2,
    available: true,
  },
  {
    id: 'elden-ring',
    name: 'Elden Ring',
    slug: 'elden-ring',
    developer: 'FromSoftware',
    genre: 'RPG / Souls-like',
    genreKey: 'rpg',
    color: '#C6A864',
    colorBg: 'rgba(198,168,100,0.08)',
    colorBorder: 'rgba(198,168,100,0.25)',
    abbr: 'ER',
    tools: ['Build Optimizer', 'Weapon Tier List'],
    toolCount: 2,
    available: true,
  },
  {
    id: 'marvel-rivals',
    name: 'Marvel Rivals',
    slug: 'marvel-rivals',
    developer: 'NetEase Games',
    genre: 'Hero Shooter',
    genreKey: 'shooter',
    color: '#DC2828',
    colorBg: 'rgba(220,40,40,0.08)',
    colorBorder: 'rgba(220,40,40,0.25)',
    abbr: 'MR',
    tools: ['Hero Tier List'],
    toolCount: 1,
    available: true,
  },
  {
    id: 'pokemon',
    name: 'Pokemon',
    slug: 'pokemon',
    developer: 'Game Freak',
    genre: 'RPG / Strategy',
    genreKey: 'rpg',
    color: '#FFCB05',
    colorBg: 'rgba(255,203,5,0.08)',
    colorBorder: 'rgba(255,203,5,0.25)',
    abbr: 'PKM',
    tools: ['Damage Calculator'],
    toolCount: 1,
    available: true,
  },
  {
    id: 'general-pc',
    name: 'General PC Gaming',
    slug: 'general-pc',
    developer: 'Works with any game',
    genre: 'PC Tools',
    genreKey: 'pc',
    color: '#00E5A0',
    colorBg: 'rgba(0,229,160,0.08)',
    colorBorder: 'rgba(0,229,160,0.25)',
    abbr: 'PC',
    tools: ['Bottleneck Calc', 'FPS Estimator', 'Ping Checker', '+5 more'],
    toolCount: 8,
    available: true,
  },
]

const comingSoon = [
  { name: 'Apex Legends',      genre: 'Battle Royale',  color: '#CC3333', genreKey: 'br' },
  { name: 'League of Legends', genre: 'MOBA',           color: '#C8973A', genreKey: 'moba' },
  { name: 'Minecraft',         genre: 'Sandbox',        color: '#6B8F3E', genreKey: 'other' },
  { name: 'Call of Duty',      genre: 'FPS',            color: '#4A90D9', genreKey: 'fps' },
  { name: 'Overwatch 2',       genre: 'Hero Shooter',   color: '#F5A623', genreKey: 'shooter' },
  { name: 'Rocket League',     genre: 'Sports',         color: '#4A90E2', genreKey: 'other' },
  { name: 'Dota 2',            genre: 'MOBA',           color: '#8B4513', genreKey: 'moba' },
  { name: 'More coming',       genre: 'Always adding',  color: '#555A6B', genreKey: 'other' },
]

const genres = [
  { key: 'all',     label: 'All games' },
  { key: 'fps',     label: 'FPS / Tactical' },
  { key: 'br',      label: 'Battle Royale' },
  { key: 'rpg',     label: 'RPG' },
  { key: 'shooter', label: 'Hero Shooter' },
  { key: 'pc',      label: 'PC Tools' },
]

/* ─── Component ─────────────────────────────────────────── */
export function GamesListing() {
  const [activeGenre, setActiveGenre] = useState('all')
  const [search, setSearch] = useState('')

  const featured = games.find(g => g.featured)!
  const rest = games.filter(g => !g.featured && g.available)

  const filtered = rest.filter(g => {
    const matchGenre = activeGenre === 'all' || g.genreKey === activeGenre
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase())
    return matchGenre && matchSearch
  })

  return (
    <div className="min-h-screen bg-[var(--bg)]">

      {/* BREADCRUMB */}
      <div className="border-b border-[var(--border)] bg-[var(--bg2)] px-6 py-[10px]">
        <div className="mx-auto flex max-w-7xl items-center gap-2 text-[12px] text-[var(--t3)]">
          <Link href="/" className="transition-colors hover:text-[var(--mint)]">Home</Link>
          <span>/</span>
          <span className="text-[var(--t2)]">Games</span>
        </div>
      </div>

      {/* PAGE HEADER */}
      <div className="relative overflow-hidden border-b border-[var(--border)] bg-[var(--bg)] px-6 pb-0 pt-9">
        <div
          className="pointer-events-none absolute left-1/2 top-[-60px] h-[220px] w-[600px] -translate-x-1/2"
          style={{ background: 'radial-gradient(ellipse, rgba(0,229,160,0.08) 0%, transparent 70%)' }}
        />
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="mb-[14px] inline-flex items-center gap-[6px] rounded-full border border-[rgba(0,229,160,0.2)] bg-[rgba(0,229,160,0.08)] px-3 py-1 text-[11px] text-[var(--mint)]">
                <span className="h-[5px] w-[5px] animate-pulse rounded-full bg-[var(--mint)]" />
                Tools for {games.filter(g => g.available).length} games — more coming
              </div>
              <h1 className="mb-2 text-[30px] font-medium leading-tight text-[var(--t1)]">
                Browse by <span className="text-[var(--mint)]">Game</span>
              </h1>
              <p className="max-w-[460px] text-[14px] leading-relaxed text-[var(--t2)]">
                Find tools made for your game. Sensitivity converters, tier lists, build planners and more — all free, no account needed.
              </p>
            </div>
            {/* Search */}
            <div className="relative w-full max-w-[280px]">
              <svg className="absolute left-[13px] top-1/2 -translate-y-1/2 text-[var(--t3)]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search games..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full rounded-[10px] border border-[var(--border2)] bg-[var(--bg2)] py-[11px] pl-[40px] pr-[44px] text-[13px] text-[var(--t1)] outline-none placeholder:text-[var(--t3)] focus:border-[rgba(0,229,160,0.4)]"
              />
              <span className="absolute right-[10px] top-1/2 -translate-y-1/2 rounded border border-[var(--border)] bg-[var(--bg3)] px-[6px] py-[2px] font-mono text-[10px] text-[var(--t3)]">⌘K</span>
            </div>
          </div>

          {/* STATS STRIP */}
          <div className="grid grid-cols-4 border-t border-[var(--border)]">
            {[
              { n: '10', label: 'Games supported',  color: 'var(--mint)' },
              { n: '22', label: 'Total tools',       color: 'var(--blue)' },
              { n: '6',  label: 'Available now',     color: 'var(--orange)' },
              { n: 'Free', label: 'Always, no paywall', color: 'var(--mint)' },
            ].map((s, i) => (
              <div key={i} className={cn('py-[14px] text-center', i < 3 && 'border-r border-[var(--border)]')}>
                <div className="mb-[2px] text-[22px] font-medium" style={{ color: s.color }}>{s.n}</div>
                <div className="text-[11px] text-[var(--t3)]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="mx-auto max-w-7xl px-6 pb-12 pt-8">

        {/* GENRE FILTER */}
        <div className="mb-7 flex flex-wrap gap-2">
          {genres.map(g => (
            <button
              key={g.key}
              onClick={() => setActiveGenre(g.key)}
              className={cn(
                'rounded-full border px-[14px] py-[6px] text-[12px] transition-all',
                activeGenre === g.key
                  ? 'border-[rgba(0,229,160,0.3)] bg-[rgba(0,229,160,0.1)] text-[var(--mint)]'
                  : 'border-[var(--border)] bg-transparent text-[var(--t2)] hover:border-[var(--border2)] hover:text-[var(--t1)]'
              )}
            >
              {g.label}
            </button>
          ))}
        </div>

        {/* FEATURED GAME */}
        {(activeGenre === 'all' || activeGenre === featured.genreKey) && !search && (
          <>
            <div className="mb-4 flex items-center gap-[10px] text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--t3)]">
              <span>Most popular game</span>
              <span className="h-px flex-1 bg-[var(--border)]" />
            </div>
            <Link
              href={`/games/${featured.slug}`}
              className="group mb-7 flex items-center gap-7 rounded-[14px] p-7 transition-all hover:-translate-y-[1px]"
              style={{
                background: `linear-gradient(135deg, ${featured.colorBg} 0%, var(--bg2) 60%)`,
                border: `0.5px solid ${featured.colorBorder}`,
              }}
            >
              {/* Left accent bar */}
              <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-[14px]" style={{ background: featured.color }} />
              {/* Abbr block */}
              <div
                className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-[14px] text-[13px] font-semibold tracking-wide text-white"
                style={{ background: featured.color }}
              >
                {featured.abbr}
              </div>
              <div className="flex-1 min-w-0">
                <div className="mb-[6px] flex items-center gap-[5px] text-[10px] font-medium uppercase tracking-[0.08em]" style={{ color: featured.color }}>
                  <span className="h-[5px] w-[5px] animate-pulse rounded-full" style={{ background: featured.color }} />
                  Most tools available
                </div>
                <div className="mb-[6px] text-[20px] font-medium text-[var(--t1)]">{featured.name}</div>
                <div className="mb-[14px] text-[13px] leading-relaxed text-[var(--t2)]">
                  The most popular game on Zarynx. Sensitivity converters, crosshair generators, agent tier lists and ranked tools — all built specifically for {featured.name} players.
                </div>
                <div className="flex flex-wrap gap-[6px]">
                  {featured.tools.map(t => (
                    <span
                      key={t}
                      className="rounded-[4px] border px-[9px] py-[3px] text-[11px] font-medium"
                      style={{ background: `${featured.color}18`, color: featured.color, borderColor: `${featured.color}30` }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div
                className="flex flex-shrink-0 items-center gap-[6px] rounded-[8px] px-5 py-[10px] text-[13px] font-medium text-white transition-opacity group-hover:opacity-90"
                style={{ background: featured.color }}
              >
                View tools
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
            </Link>
          </>
        )}

        {/* ALL GAMES GRID */}
        <div className="mb-4 flex items-center gap-[10px] text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--t3)]">
          <span>All supported games</span>
          <span className="h-px flex-1 bg-[var(--border)]" />
        </div>
        <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(game => (
            <Link
              key={game.id}
              href={`/games/${game.slug}`}
              className="group relative overflow-hidden rounded-[12px] border bg-[var(--bg2)] transition-all hover:-translate-y-[2px]"
              style={{ borderColor: game.colorBorder }}
            >
              {/* Top color bar */}
              <div className="h-[3px] w-full" style={{ background: game.color }} />
              <div className="p-[18px]">
                {/* Head */}
                <div className="mb-[10px] flex items-center justify-between">
                  <div className="flex items-center gap-[10px]">
                    <div className="h-[10px] w-[10px] flex-shrink-0 rounded-full" style={{ background: game.color }} />
                    <span className="text-[15px] font-medium text-[var(--t1)]">{game.name}</span>
                  </div>
                  <span
                    className="rounded-[4px] px-[7px] py-[2px] text-[10px] font-medium"
                    style={{ background: `${game.color}18`, color: game.color }}
                  >
                    {game.genre.split(' / ')[0]}
                  </span>
                </div>
                <div className="mb-3 text-[11px] text-[var(--t3)]">{game.name} — {game.developer}</div>
                {/* Tool tags */}
                <div className="mb-[14px] flex flex-wrap gap-[5px]">
                  {game.tools.map(t => (
                    <span key={t} className="rounded-[4px] border border-[var(--border)] bg-[var(--bg3)] px-[8px] py-[3px] text-[11px] text-[var(--t2)]">
                      {t}
                    </span>
                  ))}
                </div>
                {/* Footer */}
                <div className="flex items-center justify-between border-t border-[var(--border)] pt-3">
                  <span className="text-[12px] text-[var(--t3)]">
                    <span className="mr-[3px] text-[14px] font-medium text-[var(--t1)]">{game.toolCount}</span>
                    {game.toolCount === 1 ? 'tool' : 'tools'} available
                  </span>
                  <svg className="text-[var(--t3)] opacity-0 transition-opacity group-hover:opacity-100" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* COMING SOON */}
        <div className="mb-4 flex items-center gap-[10px] text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--t3)]">
          <span>Coming soon</span>
          <span className="h-px flex-1 bg-[var(--border)]" />
        </div>
        <div className="mb-8 grid grid-cols-2 gap-[10px] sm:grid-cols-4">
          {comingSoon.map(g => (
            <div
              key={g.name}
              className="flex items-center justify-between rounded-[10px] border border-[var(--border)] bg-[var(--bg2)] px-4 py-[14px] opacity-45 transition-opacity hover:opacity-70"
            >
              <div className="flex items-center gap-[10px]">
                <div className="h-[8px] w-[8px] flex-shrink-0 rounded-full" style={{ background: g.color }} />
                <div>
                  <div className="text-[12px] font-medium text-[var(--t2)]">{g.name}</div>
                  <div className="text-[10px] text-[var(--t3)]">{g.genre}</div>
                </div>
              </div>
              <span className="rounded-[4px] border border-[var(--border)] bg-[var(--bg3)] px-[6px] py-[2px] text-[9px] text-[var(--t3)]">Soon</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-r-[10px] border border-[rgba(0,229,160,0.12)] border-l-[3px] border-l-[var(--mint)] bg-[var(--bg2)] px-6 py-5">
          <div>
            <div className="mb-1 text-[14px] font-medium text-[var(--t1)]">Not sure where to start?</div>
            <div className="text-[12px] text-[var(--t2)]">Browse all 22 free tools — no account needed, instant results.</div>
          </div>
          <Link
            href="/tools"
            className="rounded-[8px] bg-[var(--mint)] px-[18px] py-[10px] text-[13px] font-medium text-[#0D0F14] transition-opacity hover:opacity-90"
          >
            Browse all tools →
          </Link>
        </div>

      </div>
    </div>
  )
}
