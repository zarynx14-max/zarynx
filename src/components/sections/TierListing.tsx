'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Search,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  User,
  Layers,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Types ─────────────────────────────────────────────────────────────────────

type GameKey = 'valorant' | 'cs2' | 'marvel' | 'elden' | 'fortnite'
type TypeKey = 'agents' | 'weapons' | 'builds' | 'heroes' | 'strategies'
type TierKey = 'S' | 'A' | 'B' | 'C'

interface TierPreviewRow {
  tier: TierKey
  items: string[]
}

interface PipColor {
  color: string
}

interface TierList {
  slug: string
  game: GameKey
  type: TypeKey
  title: string
  description: string
  patch: string
  updatedAgo: string
  views: string
  count: string
  badge?: 'New' | 'Hot'
  featured?: boolean
  tierPreview: TierPreviewRow[]
  pips: PipColor[]
}

// ── Data ──────────────────────────────────────────────────────────────────────

const GAME_META: Record<GameKey, { label: string; color: string; chipClass: string }> = {
  valorant: {
    label: 'Valorant',
    color: 'var(--orange)',
    chipClass:
      'border-[rgba(255,120,64,0.25)] bg-[rgba(255,120,64,0.08)] text-[var(--orange)]',
  },
  cs2: {
    label: 'CS2',
    color: 'var(--blue)',
    chipClass:
      'border-[rgba(80,140,255,0.25)] bg-[rgba(80,140,255,0.08)] text-[var(--blue)]',
  },
  marvel: {
    label: 'Marvel Rivals',
    color: '#E1343F',
    chipClass:
      'border-[rgba(225,52,63,0.25)] bg-[rgba(225,52,63,0.08)] text-[#E1343F]',
  },
  elden: {
    label: 'Elden Ring',
    color: '#C0913A',
    chipClass:
      'border-[rgba(192,145,58,0.25)] bg-[rgba(192,145,58,0.08)] text-[#C0913A]',
  },
  fortnite: {
    label: 'Fortnite',
    color: 'var(--mint)',
    chipClass:
      'border-[rgba(0,229,160,0.25)] bg-[rgba(0,229,160,0.08)] text-[var(--mint)]',
  },
}

const TIER_COLORS: Record<TierKey, string> = {
  S: 'bg-[rgba(0,229,160,0.15)] text-[var(--mint)]',
  A: 'bg-[rgba(80,140,255,0.15)] text-[var(--blue)]',
  B: 'bg-[rgba(255,120,64,0.12)] text-[var(--orange)]',
  C: 'bg-[rgba(255,255,255,0.05)] text-[var(--t3)]',
}

const FEATURED: TierList = {
  slug: 'valorant-agent-tier-list-patch-10',
  game: 'valorant',
  type: 'agents',
  title: 'Agent tier list — patch 10.01 — all roles ranked',
  description:
    'Every agent ranked S to D for competitive play. Updated post-patch — includes Gekko nerfs and Chamber buffs.',
  patch: '10.01',
  updatedAgo: '2 days ago',
  views: '84k views',
  count: '22 agents ranked',
  featured: true,
  tierPreview: [
    { tier: 'S', items: ['Jo', 'Jt', 'Cy'] },
    { tier: 'A', items: ['Bm', 'Re', 'Sk'] },
    { tier: 'B', items: ['Gz', 'Ph'] },
    { tier: 'C', items: ['Yo'] },
  ],
  pips: [
    { color: 'var(--mint)' },
    { color: 'var(--mint)' },
    { color: 'var(--blue)' },
    { color: 'var(--orange)' },
    { color: 'var(--t3)' },
    { color: 'var(--t3)' },
  ],
}

const TIER_LISTS: TierList[] = [
  {
    slug: 'cs2-rifles-patch-141',
    game: 'cs2',
    type: 'weapons',
    title: 'Best rifles — patch 1.41',
    description: 'Full rifle tier list for competitive and casual play.',
    patch: '1.41',
    updatedAgo: '1 week ago',
    views: '31k views',
    count: '18 weapons ranked',
    tierPreview: [
      { tier: 'S', items: ['Sn', 'AR'] },
      { tier: 'A', items: ['Sh'] },
      { tier: 'B', items: ['Sm'] },
    ],
    pips: [
      { color: 'var(--mint)' },
      { color: 'var(--mint)' },
      { color: 'var(--blue)' },
      { color: 'var(--blue)' },
      { color: 'var(--t3)' },
      { color: 'var(--t3)' },
    ],
  },
  {
    slug: 'marvel-rivals-strategists-season-2',
    game: 'marvel',
    type: 'heroes',
    title: 'Best Strategists — Season 2',
    description: 'All support heroes ranked for Season 2 competitive play.',
    patch: 'Season 2',
    updatedAgo: '3 days ago',
    views: '61k views',
    count: '10 heroes ranked',
    badge: 'Hot',
    tierPreview: [
      { tier: 'S', items: ['Mn', 'Lu'] },
      { tier: 'A', items: ['Cl'] },
      { tier: 'B', items: ['Ro'] },
    ],
    pips: [
      { color: 'var(--mint)' },
      { color: 'var(--mint)' },
      { color: 'var(--mint)' },
      { color: 'var(--blue)' },
      { color: 'var(--t3)' },
      { color: 'var(--t3)' },
    ],
  },
  {
    slug: 'valorant-best-duelists-patch-910',
    game: 'valorant',
    type: 'agents',
    title: 'Best duelists — patch 9.10',
    description: 'Top duelist picks for ranked climbing in patch 9.10.',
    patch: '9.10',
    updatedAgo: '2 days ago',
    views: '44k views',
    count: '7 duelists ranked',
    badge: 'New',
    tierPreview: [
      { tier: 'S', items: ['Jt'] },
      { tier: 'A', items: ['Rf', 'Ys'] },
      { tier: 'B', items: ['Ph'] },
    ],
    pips: [
      { color: 'var(--mint)' },
      { color: 'var(--mint)' },
      { color: 'var(--orange)' },
      { color: 'var(--t3)' },
      { color: 'var(--t3)' },
      { color: 'var(--t3)' },
    ],
  },
  {
    slug: 'marvel-rivals-duelists-season-2',
    game: 'marvel',
    type: 'heroes',
    title: 'Best Duelists — Season 2',
    description: 'Every duelist ranked for Season 2 meta.',
    patch: 'Season 2',
    updatedAgo: '3 days ago',
    views: '52k views',
    count: '14 heroes ranked',
    badge: 'Hot',
    tierPreview: [
      { tier: 'S', items: ['Sp', 'Hu'] },
      { tier: 'A', items: ['Ir'] },
      { tier: 'B', items: ['Pw'] },
    ],
    pips: [
      { color: 'var(--mint)' },
      { color: 'var(--mint)' },
      { color: 'var(--mint)' },
      { color: 'var(--blue)' },
      { color: 'var(--t3)' },
      { color: 'var(--t3)' },
    ],
  },
  {
    slug: 'elden-ring-colosseum-pvp-weapons',
    game: 'elden',
    type: 'weapons',
    title: 'Best weapons — Colosseum PvP',
    description: 'Top weapons for Colosseum PvP after the 1.15 patch.',
    patch: '1.15',
    updatedAgo: '3 weeks ago',
    views: '28k views',
    count: '16 weapons ranked',
    tierPreview: [
      { tier: 'S', items: ['Rv', 'Ml'] },
      { tier: 'A', items: ['Bl'] },
      { tier: 'B', items: ['Sp'] },
    ],
    pips: [
      { color: 'var(--mint)' },
      { color: 'var(--mint)' },
      { color: 'var(--blue)' },
      { color: 'var(--orange)' },
      { color: 'var(--t3)' },
      { color: 'var(--t3)' },
    ],
  },
  {
    slug: 'cs2-pistols-eco-rounds',
    game: 'cs2',
    type: 'weapons',
    title: 'Best pistols for eco rounds',
    description: 'Which pistol wins you eco rounds in CS2 competitive.',
    patch: '1.41',
    updatedAgo: '1 week ago',
    views: '19k views',
    count: '8 pistols ranked',
    tierPreview: [
      { tier: 'S', items: ['De'] },
      { tier: 'A', items: ['P25'] },
      { tier: 'B', items: ['Gl'] },
    ],
    pips: [
      { color: 'var(--mint)' },
      { color: 'var(--blue)' },
      { color: 'var(--blue)' },
      { color: 'var(--orange)' },
      { color: 'var(--t3)' },
      { color: 'var(--t3)' },
    ],
  },
  {
    slug: 'fortnite-chapter-6-weapons',
    game: 'fortnite',
    type: 'weapons',
    title: 'Best weapons — Chapter 6 Season 2',
    description: 'All weapons ranked for Chapter 6 Season 2 battle royale.',
    patch: 'Ch.6 S2',
    updatedAgo: '5 days ago',
    views: '37k views',
    count: '20 weapons ranked',
    badge: 'New',
    tierPreview: [
      { tier: 'S', items: ['Sr', 'Ar'] },
      { tier: 'A', items: ['Sg', 'Sm'] },
      { tier: 'B', items: ['Ps'] },
    ],
    pips: [
      { color: 'var(--mint)' },
      { color: 'var(--mint)' },
      { color: 'var(--mint)' },
      { color: 'var(--orange)' },
      { color: 'var(--t3)' },
      { color: 'var(--t3)' },
    ],
  },
  {
    slug: 'elden-ring-ng-plus-builds',
    game: 'elden',
    type: 'builds',
    title: 'Best builds for NG+ — all classes ranked',
    description: 'Which builds survive the hardest NG+ challenges.',
    patch: '1.15',
    updatedAgo: '2 weeks ago',
    views: '22k views',
    count: '12 builds ranked',
    tierPreview: [
      { tier: 'S', items: ['Bl', 'Fa'] },
      { tier: 'A', items: ['St'] },
      { tier: 'B', items: ['Ar'] },
    ],
    pips: [
      { color: 'var(--mint)' },
      { color: 'var(--mint)' },
      { color: 'var(--blue)' },
      { color: 'var(--t3)' },
      { color: 'var(--t3)' },
      { color: 'var(--t3)' },
    ],
  },
  {
    slug: 'valorant-initiators-patch-10',
    game: 'valorant',
    type: 'agents',
    title: 'Best initiators — patch 10.01',
    description: 'Top initiator picks for coordinated team play.',
    patch: '10.01',
    updatedAgo: '4 days ago',
    views: '29k views',
    count: '6 initiators ranked',
    badge: 'New',
    tierPreview: [
      { tier: 'S', items: ['Sk', 'Fa'] },
      { tier: 'A', items: ['Br'] },
      { tier: 'B', items: ['Ka'] },
    ],
    pips: [
      { color: 'var(--mint)' },
      { color: 'var(--mint)' },
      { color: 'var(--blue)' },
      { color: 'var(--orange)' },
      { color: 'var(--t3)' },
      { color: 'var(--t3)' },
    ],
  },
]

const TRENDING = [
  { slug: 'marvel-rivals-strategists-season-2', title: 'Marvel Rivals Strategists S2', meta: 'Marvel Rivals · 3 days ago' },
  { slug: 'valorant-agent-tier-list-patch-10', title: 'Valorant agent tier list', meta: 'Valorant · 2 days ago' },
  { slug: 'elden-ring-ng-plus-builds', title: 'Elden Ring NG+ builds', meta: 'Elden Ring · 2 weeks ago' },
  { slug: 'fortnite-chapter-6-weapons', title: 'Fortnite Chapter 6 weapons', meta: 'Fortnite · 5 days ago' },
]

const PIP_LEGEND = [
  { label: 'S/A', color: 'var(--mint)' },
  { label: 'B/C', color: 'var(--blue)' },
  { label: 'D',   color: 'var(--t3)' },
]

// ── Sub-components ─────────────────────────────────────────────────────────────

function TierPreview({ rows }: { rows: TierPreviewRow[] }) {
  return (
    <div className="flex flex-col gap-1">
      {rows.map(row => (
        <div key={row.tier} className="flex items-center gap-[5px]">
          <div
            className={cn(
              'flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-[4px] text-[9px] font-bold',
              TIER_COLORS[row.tier],
            )}
          >
            {row.tier}
          </div>
          <div className="flex flex-wrap gap-[3px]">
            {row.items.map(item => (
              <div
                key={item}
                className="flex h-6 w-6 items-center justify-center rounded-[5px] border border-[var(--border2)] bg-[var(--bg3)] text-[8px] font-semibold text-[var(--t2)]"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function Pips({ pips }: { pips: PipColor[] }) {
  return (
    <div className="flex gap-[2px]">
      {pips.map((p, i) => (
        <div
          key={i}
          className="h-[3px] flex-1 rounded-[2px]"
          style={{ background: p.color }}
        />
      ))}
    </div>
  )
}

function PipLegend() {
  return (
    <div className="flex gap-[7px]">
      {PIP_LEGEND.map(leg => (
        <div key={leg.label} className="flex items-center gap-[3px]">
          <div className="h-[3px] w-[6px] rounded-[1px]" style={{ background: leg.color }} />
          <span className="text-[9px] text-[var(--t3)]">{leg.label}</span>
        </div>
      ))}
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export function TierListing() {
  const [query, setQuery] = useState('')
  const [activeGame, setActiveGame] = useState<'all' | GameKey>('all')
  const [activeType, setActiveType] = useState<'all' | TypeKey>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [activePage, setActivePage] = useState(1)
  const [activeTopic, setActiveTopic] = useState('All')

  const filtered = useMemo(() => {
    return TIER_LISTS.filter(tl => {
      const gameMatch = activeGame === 'all' || tl.game === activeGame
      const typeMatch = activeType === 'all' || tl.type === activeType
      const q = query.toLowerCase()
      const queryMatch =
        q === '' ||
        tl.title.toLowerCase().includes(q) ||
        GAME_META[tl.game].label.toLowerCase().includes(q)
      return gameMatch && typeMatch && queryMatch
    })
  }, [activeGame, activeType, query])

  const games: Array<{ key: 'all' | GameKey; label: string; dotColor: string; chipActive: string }> = [
    {
      key: 'all',
      label: 'All Games',
      dotColor: 'var(--orange)',
      chipActive: 'border-[rgba(255,120,64,0.25)] bg-[rgba(255,120,64,0.08)] text-[var(--orange)]',
    },
    {
      key: 'valorant',
      label: 'Valorant',
      dotColor: 'var(--orange)',
      chipActive: GAME_META.valorant.chipClass,
    },
    {
      key: 'cs2',
      label: 'CS2',
      dotColor: 'var(--blue)',
      chipActive: GAME_META.cs2.chipClass,
    },
    {
      key: 'marvel',
      label: 'Marvel Rivals',
      dotColor: '#E1343F',
      chipActive: GAME_META.marvel.chipClass,
    },
    {
      key: 'elden',
      label: 'Elden Ring',
      dotColor: '#C0913A',
      chipActive: GAME_META.elden.chipClass,
    },
    {
      key: 'fortnite',
      label: 'Fortnite',
      dotColor: 'var(--mint)',
      chipActive: GAME_META.fortnite.chipClass,
    },
  ]

  const types: Array<{ key: 'all' | TypeKey; label: string }> = [
    { key: 'all', label: 'All types' },
    { key: 'agents', label: 'Agents' },
    { key: 'weapons', label: 'Weapons' },
    { key: 'builds', label: 'Builds' },
    { key: 'heroes', label: 'Heroes' },
    { key: 'strategies', label: 'Strategies' },
  ]

  const sidebarTopics = ['All', 'Agents', 'Weapons', 'Builds', 'Heroes', 'Strategies']

  return (
    <>
      {/* ── Hero ── */}
      <div className="relative overflow-hidden border-b border-[var(--border)] bg-[var(--bg2)] px-6 py-8">
        {/* Background glows */}
        <div className="pointer-events-none absolute -left-8 -top-12 h-[200px] w-[300px] rounded-full bg-[radial-gradient(ellipse,rgba(255,120,64,0.07)_0%,transparent_70%)]" />
        <div className="pointer-events-none absolute -bottom-12 -right-2 h-[180px] w-[240px] rounded-full bg-[radial-gradient(ellipse,rgba(80,140,255,0.06)_0%,transparent_70%)]" />
        <div
          className="pointer-events-none absolute right-0 top-0 h-[130px] w-[180px]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '18px 18px',
          }}
        />

        <div className="relative mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <div className="mb-3 flex items-center gap-[5px] text-[12px] text-[var(--t3)]">
            <Link href="/" className="transition-colors hover:text-[var(--t2)]">Home</Link>
            <span>›</span>
            <span className="text-[var(--t2)]">Tier Lists</span>
          </div>

          {/* Badge */}
          <div className="mb-3 inline-flex items-center gap-[6px] rounded-[6px] border border-[rgba(255,120,64,0.2)] bg-[rgba(255,120,64,0.08)] px-[10px] py-[4px] text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--orange)]">
            <span
              className="h-[5px] w-[5px] rounded-full bg-[var(--orange)]"
              style={{ animation: 'pulse-dot 2s ease-in-out infinite' }}
            />
            Community ranked
          </div>

          <h1 className="mb-[10px] text-[26px] font-medium leading-[1.15] tracking-[-0.025em] text-[var(--t1)]">
            Every tier list,{' '}
            <em className="not-italic text-[var(--orange)]">always updated.</em>
          </h1>
          <p className="mb-[18px] max-w-[500px] text-[13px] leading-[1.75] text-[var(--t2)]">
            Up-to-date tier lists for the biggest games — ranked by real data, patch notes, and
            community meta. No outdated picks.
          </p>

          {/* Pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { icon: <Layers size={13} />, label: '14 tier lists' },
              { icon: null, label: '8 games covered' },
              { icon: null, label: 'Updated weekly' },
            ].map(pill => (
              <div
                key={pill.label}
                className="flex items-center gap-[6px] rounded-[20px] border border-[var(--border)] bg-[var(--bg)] px-3 py-[5px] text-[12px] text-[var(--t3)]"
              >
                {pill.icon && <span className="text-[var(--t2)]">{pill.icon}</span>}
                {pill.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div className="sticky top-[52px] z-40 border-b border-[var(--border)] bg-[var(--bg)] px-4 py-[11px] sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2">
          {/* Search */}
          <div className="flex w-[200px] flex-shrink-0 items-center gap-[7px] rounded-[8px] border border-[var(--border2)] bg-[var(--bg2)] px-[10px]">
            <Search size={14} className="text-[var(--t3)]" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search tier lists…"
              className="w-full bg-transparent py-[7px] text-[12px] text-[var(--t2)] outline-none placeholder:text-[var(--t3)]"
            />
          </div>

          {/* Divider */}
          <div className="h-5 w-px flex-shrink-0 bg-[var(--border2)]" />

          {/* Game chips */}
          <div className="flex flex-1 gap-[5px] overflow-x-auto">
            {games.map(g => (
              <button
                key={g.key}
                onClick={() => setActiveGame(g.key)}
                className={cn(
                  'flex flex-shrink-0 items-center gap-[5px] whitespace-nowrap rounded-[20px] border px-[10px] py-1 text-[11px] transition-all',
                  activeGame === g.key
                    ? g.chipActive
                    : 'border-[var(--border)] bg-[var(--bg2)] text-[var(--t2)]',
                )}
              >
                <span
                  className="h-[5px] w-[5px] flex-shrink-0 rounded-full"
                  style={{ background: activeGame === g.key ? g.dotColor : 'var(--t3)' }}
                />
                {g.label}
              </button>
            ))}
          </div>

          {/* Sort + view */}
          <div className="ml-auto flex items-center gap-[6px]">
            <select className="rounded-[7px] border border-[var(--border2)] bg-[var(--bg2)] px-[9px] py-[5px] text-[11px] text-[var(--t2)] outline-none">
              <option>Latest updated</option>
              <option>Most viewed</option>
              <option>A–Z</option>
            </select>

            <div className="h-5 w-px bg-[var(--border2)]" />

            <div className="flex gap-[2px]">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-[6px] border text-[14px] transition-all',
                  viewMode === 'grid'
                    ? 'border-[rgba(0,229,160,0.25)] bg-[rgba(0,229,160,0.1)] text-[var(--mint)]'
                    : 'border-[var(--border2)] bg-[var(--bg2)] text-[var(--t3)]',
                )}
              >
                <LayoutGrid size={14} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-[6px] border text-[14px] transition-all',
                  viewMode === 'list'
                    ? 'border-[rgba(0,229,160,0.25)] bg-[rgba(0,229,160,0.1)] text-[var(--mint)]'
                    : 'border-[var(--border2)] bg-[var(--bg2)] text-[var(--t3)]',
                )}
              >
                <List size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="mx-auto max-w-7xl px-4 py-[18px] sm:px-6">
        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[1fr_188px]">

          {/* ── Main column ── */}
          <div>

            {/* Featured card */}
            <p className="mb-[9px] text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--t3)]">
              Featured
            </p>
            <Link
              href={`/tier-lists/${FEATURED.slug}`}
              className="mb-[18px] grid cursor-pointer grid-cols-[1fr_auto] gap-[14px] rounded-[12px] border border-[var(--border2)] bg-[var(--bg2)] p-[17px] transition-colors hover:border-[rgba(255,120,64,0.3)]"
            >
              <div>
                <div className="mb-2 inline-flex items-center gap-[5px] rounded-[5px] border border-[rgba(255,120,64,0.18)] bg-[rgba(255,120,64,0.08)] px-2 py-[3px] text-[9px] font-semibold uppercase tracking-[0.1em] text-[var(--orange)]">
                  <span className="h-1 w-1 rounded-full bg-[var(--orange)]" />
                  Editor's pick
                </div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.08em]" style={{ color: GAME_META[FEATURED.game].color }}>
                  {GAME_META[FEATURED.game].label}
                </p>
                <h2 className="mb-[6px] text-[15px] font-medium leading-[1.3] tracking-[-0.01em] text-[var(--t1)]">
                  {FEATURED.title}
                </h2>
                <p className="mb-[11px] text-[12px] leading-[1.7] text-[var(--t2)]">
                  {FEATURED.description}
                </p>
                <div className="flex flex-wrap items-center gap-[10px]">
                  <span className="flex items-center gap-1 text-[11px] text-[var(--t3)]">
                    <Clock size={12} /> Updated {FEATURED.updatedAgo}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-[var(--t3)]">
                    <Eye size={12} /> {FEATURED.views}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-[var(--t3)]">
                    <User size={12} /> Community ranked
                  </span>
                </div>
                <p className="mt-[6px] text-[11px] text-[var(--t3)]">{FEATURED.count}</p>
              </div>
              <div className="min-w-[128px]">
                <TierPreview rows={FEATURED.tierPreview} />
              </div>
            </Link>

            {/* Type filter chips */}
            <div className="mb-[14px] flex flex-wrap gap-[5px]">
              {types.map(t => (
                <button
                  key={t.key}
                  onClick={() => setActiveType(t.key)}
                  className={cn(
                    'whitespace-nowrap rounded-[20px] border px-[11px] py-1 text-[11px] transition-all',
                    activeType === t.key
                      ? 'border-[rgba(0,229,160,0.25)] bg-[rgba(0,229,160,0.08)] text-[var(--mint)]'
                      : 'border-[var(--border)] bg-[var(--bg2)] text-[var(--t2)]',
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Count row */}
            <div className="mb-[10px] flex items-center justify-between">
              <p className="text-[12px] text-[var(--t3)]">
                Showing <span className="font-medium text-[var(--t2)]">{filtered.length}</span> of{' '}
                <span className="font-medium text-[var(--t2)]">{TIER_LISTS.length}</span> tier lists
              </p>
            </div>

            {/* Grid / list */}
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-[10px] border border-[var(--border)] bg-[var(--bg2)] px-5 py-12 text-center">
                <p className="mb-[6px] text-[14px] font-medium text-[var(--t2)]">No tier lists found</p>
                <p className="max-w-[260px] text-[12px] leading-[1.6] text-[var(--t3)]">
                  No tier lists match your current filters. Try a different game or type.
                </p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                {filtered.map(tl => {
                  const gm = GAME_META[tl.game]
                  return (
                    <Link
                      key={tl.slug}
                      href={`/tier-lists/${tl.slug}`}
                      className="relative cursor-pointer rounded-[10px] border border-[var(--border)] bg-[var(--bg2)] p-[13px] transition-colors hover:border-[var(--border2)]"
                    >
                      {tl.badge === 'New' && (
                        <span className="absolute right-[9px] top-[9px] rounded-[4px] border border-[rgba(0,229,160,0.25)] bg-[rgba(0,229,160,0.1)] px-[6px] py-[2px] text-[9px] font-semibold text-[var(--mint)]">
                          New
                        </span>
                      )}
                      {tl.badge === 'Hot' && (
                        <span className="absolute right-[9px] top-[9px] rounded-[4px] border border-[rgba(255,120,64,0.25)] bg-[rgba(255,120,64,0.1)] px-[6px] py-[2px] text-[9px] font-semibold text-[var(--orange)]">
                          Hot
                        </span>
                      )}
                      <p className="mb-[3px] text-[10px] font-semibold uppercase tracking-[0.07em]" style={{ color: gm.color }}>
                        {gm.label}
                      </p>
                      <p className="mb-[2px] text-[12px] font-medium leading-[1.35] text-[var(--t1)]">
                        {tl.title}
                      </p>
                      <p className="mb-2 text-[10px] text-[var(--t3)]">
                        Patch <span className="text-[var(--t2)]">{tl.patch}</span>
                      </p>
                      <p className="mb-2 text-[11px] text-[var(--t3)]">Updated {tl.updatedAgo}</p>
                      <Pips pips={tl.pips} />
                      <div className="mt-1 mb-[4px]">
                        <PipLegend />
                      </div>
                      <p className="text-[10px] text-[var(--t3)]">{tl.count}</p>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {filtered.map(tl => {
                  const gm = GAME_META[tl.game]
                  return (
                    <Link
                      key={tl.slug}
                      href={`/tier-lists/${tl.slug}`}
                      className="flex cursor-pointer items-start gap-[14px] rounded-[10px] border border-[var(--border)] bg-[var(--bg2)] px-[14px] py-3 transition-colors hover:border-[var(--border2)]"
                    >
                      {/* Left */}
                      <div className="min-w-0 flex-1">
                        {tl.badge === 'New' && (
                          <span className="mb-[5px] inline-block rounded-[4px] border border-[rgba(0,229,160,0.25)] bg-[rgba(0,229,160,0.1)] px-[6px] py-[2px] text-[9px] font-semibold text-[var(--mint)]">
                            New
                          </span>
                        )}
                        {tl.badge === 'Hot' && (
                          <span className="mb-[5px] inline-block rounded-[4px] border border-[rgba(255,120,64,0.25)] bg-[rgba(255,120,64,0.1)] px-[6px] py-[2px] text-[9px] font-semibold text-[var(--orange)]">
                            Hot
                          </span>
                        )}
                        <p className="mb-[3px] text-[10px] font-semibold uppercase tracking-[0.07em]" style={{ color: gm.color }}>
                          {gm.label}
                        </p>
                        <p className="mb-[3px] text-[13px] font-medium leading-[1.35] text-[var(--t1)]">
                          {tl.title}
                        </p>
                        <p className="mb-2 text-[11px] text-[var(--t3)]">Updated {tl.updatedAgo}</p>
                        <Pips pips={tl.pips} />
                        <div className="mt-1 mb-1">
                          <PipLegend />
                        </div>
                        <p className="text-[10px] text-[var(--t3)]">{tl.count}</p>
                      </div>
                      {/* Right: tier preview */}
                      <div className="flex-shrink-0">
                        <TierPreview rows={tl.tierPreview} />
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}

            {/* Pagination */}
            {filtered.length > 0 && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-[11px] text-[var(--t3)]">
                  Showing <span className="text-[var(--t2)]">1</span>–
                  <span className="text-[var(--t2)]">{filtered.length}</span> of{' '}
                  <span className="text-[var(--t2)]">{TIER_LISTS.length}</span>
                </p>
                <div className="flex items-center gap-[3px]">
                  <button className="flex h-7 w-7 items-center justify-center rounded-[7px] border border-[var(--border2)] bg-[var(--bg2)] text-[var(--t2)]">
                    <ChevronLeft size={13} />
                  </button>
                  {[1, 2, 5].map((p, i) => (
                    <>
                      {i === 2 && (
                        <span key="dots" className="flex h-7 w-7 items-center justify-center text-[10px] text-[var(--t3)]">
                          …
                        </span>
                      )}
                      <button
                        key={p}
                        onClick={() => setActivePage(p)}
                        className={cn(
                          'flex h-7 w-7 items-center justify-center rounded-[7px] border text-[11px] transition-colors',
                          activePage === p
                            ? 'border-[rgba(0,229,160,0.25)] bg-[rgba(0,229,160,0.1)] text-[var(--mint)]'
                            : 'border-[var(--border2)] bg-[var(--bg2)] text-[var(--t2)]',
                        )}
                      >
                        {p}
                      </button>
                    </>
                  ))}
                  <button className="flex h-7 w-7 items-center justify-center rounded-[7px] border border-[var(--border2)] bg-[var(--bg2)] text-[var(--t2)]">
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            )}

          </div>{/* end main column */}

          {/* ── Sidebar ── */}
          <div>

            {/* Trending */}
            <div className="mb-3 overflow-hidden rounded-[10px] border border-[var(--border)] bg-[var(--bg2)]">
              <div className="border-b border-[var(--border)] px-[13px] py-[9px] text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--t3)]">
                Trending this week
              </div>
              {TRENDING.map((item, i) => (
                <Link
                  key={item.slug}
                  href={`/tier-lists/${item.slug}`}
                  className="group flex items-center gap-2 border-b border-[var(--border)] px-[13px] py-[7px] transition-colors last:border-0 hover:bg-[var(--bg3)]"
                >
                  <span className="min-w-[18px] text-[13px] font-medium text-[var(--bg3)]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="text-[11px] font-medium leading-[1.35] text-[var(--t1)] transition-colors group-hover:text-[var(--mint)]">
                      {item.title}
                    </p>
                    <p className="text-[10px] text-[var(--t3)]">{item.meta}</p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Browse by type */}
            <div className="mb-3 overflow-hidden rounded-[10px] border border-[var(--border)] bg-[var(--bg2)]">
              <div className="border-b border-[var(--border)] px-[13px] py-[9px] text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--t3)]">
                Browse by type
              </div>
              <div className="flex flex-wrap gap-[5px] p-[11px]">
                {sidebarTopics.map(topic => (
                  <button
                    key={topic}
                    onClick={() => {
                      setActiveTopic(topic)
                      const typeKey = topic === 'All' ? 'all' : (topic.toLowerCase() as TypeKey)
                      setActiveType(typeKey)
                    }}
                    className={cn(
                      'rounded-[4px] border px-2 py-[3px] text-[10px] transition-all',
                      activeTopic === topic
                        ? 'border-[rgba(0,229,160,0.25)] bg-[rgba(0,229,160,0.08)] text-[var(--mint)]'
                        : 'border-[var(--border)] bg-[var(--bg3)] text-[var(--t3)]',
                    )}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="overflow-hidden rounded-[10px] border border-[var(--border)] bg-[var(--bg2)]">
              <div className="border-b border-[var(--border)] px-[13px] py-[9px] text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--t3)]">
                Stay updated
              </div>
              <div className="p-[13px]">
                <p className="mb-2 text-[11px] leading-[1.55] text-[var(--t2)]">
                  New tier lists drop every week — one email, no spam.
                </p>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="mb-[6px] w-full rounded-[6px] border border-[var(--border2)] bg-[var(--bg3)] px-[9px] py-[7px] text-[11px] text-[var(--t1)] outline-none placeholder:text-[var(--t3)] focus:border-[rgba(0,229,160,0.35)]"
                />
                <button className="w-full rounded-[6px] bg-[var(--mint)] py-[7px] text-[11px] font-medium text-[#0D0F14] transition-opacity hover:opacity-90">
                  Notify me
                </button>
              </div>
            </div>

          </div>{/* end sidebar */}

        </div>
      </div>
    </>
  )
}
