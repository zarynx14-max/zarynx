'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Monitor, Crosshair, Zap, CreditCard, Aperture, Sword,
  Cpu, Cloud, Tablet, Wrench, Target, Gamepad2, Package,
  BarChart2, Brain, Search as SearchIcon, SlidersHorizontal,
} from 'lucide-react'
import { tools, type ToolCategory } from '@/data/tools'
import { cn } from '@/lib/utils'

/* ─── icon map ─────────────────────────────────────────────────────────────── */
const iconMap: Record<string, React.ElementType> = {
  'bottleneck-calculator':               Monitor,
  'sensitivity-converter':               Crosshair,
  'reaction-speed-test':                 Zap,
  'game-pass-calculator':                CreditCard,
  'valorant-crosshair-generator':        Aperture,
  'elden-ring-build-optimizer':          Sword,
  'cloud-gaming-cost-calculator':        Cloud,
  'handheld-console-comparison':         Tablet,
  'gaming-pc-build-planner':             Cpu,
  'cs2-tradeup-calculator':              BarChart2,
  'fps-sensitivity-calculator':          Target,
  'marvel-rivals-tier-list':             Gamepad2,
  'cs2-valorant-sensitivity-converter':  Crosshair,
  'fortnite-sensitivity-converter':      Target,
  'pokemon-damage-calculator':           Wrench,
  'minecraft-enchantment-optimizer':     Package,
  'universal-tier-list-maker':           BarChart2,
  'spacebar-speed-test':                 Zap,
  'ai-gaming-coach':                     Brain,
  'indie-game-discovery':                SearchIcon,
  'cs2-skin-roi-tracker':                BarChart2,
  '3d-car-tuning-planner':               Wrench,
}

/* ─── badge styles ─────────────────────────────────────────────────────────── */
const badgeStyles: Record<string, string> = {
  mint:   'bg-[rgba(0,229,160,0.1)] text-[var(--mint)]',
  orange: 'bg-[rgba(255,120,64,0.1)] text-[var(--orange)]',
  blue:   'bg-[rgba(80,140,255,0.1)] text-[var(--blue)]',
  gray:   'bg-[rgba(255,255,255,0.06)] text-[var(--t2)]',
}

const catBadge: Record<string, string> = {
  pc: 'PC Tools', game: 'Game Tools', calculator: 'Calculator', tierlist: 'Tier List', esports: 'Esports',
}

/* ─── types ────────────────────────────────────────────────────────────────── */
type SortKey   = 'popular' | 'newest' | 'az'
type GameKey   = 'valorant' | 'cs2' | 'fortnite' | 'elden-ring' | 'pokemon'

const gameTagMap: Record<GameKey, string[]> = {
  valorant:     ['valorant-crosshair-generator', 'cs2-valorant-sensitivity-converter', 'sensitivity-converter'],
  cs2:          ['cs2-tradeup-calculator', 'cs2-valorant-sensitivity-converter', 'cs2-skin-roi-tracker'],
  fortnite:     ['fortnite-sensitivity-converter', 'sensitivity-converter'],
  'elden-ring': ['elden-ring-build-optimizer'],
  pokemon:      ['pokemon-damage-calculator'],
}

const categoryLabels: Record<string, string> = {
  all: 'All categories', pc: 'PC Tools', game: 'Game Tools',
  calculator: 'Calculators', tierlist: 'Tier Lists',
}
const categoryCounts: Record<string, number> = {
  all:        tools.length,
  pc:         tools.filter(t => t.category === 'pc').length,
  game:       tools.filter(t => t.category === 'game').length,
  calculator: tools.filter(t => t.category === 'calculator').length,
  tierlist:   tools.filter(t => t.category === 'tierlist').length,
}

/* ─── small pieces ─────────────────────────────────────────────────────────── */
function CheckSvg() {
  return (
    <svg viewBox="0 0 9 9" fill="none" className="w-full h-full">
      <polyline points="1.5,4.5 3.5,6.5 7.5,2.5" stroke="#0D0F14" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function FilterOption({ label, count, active, onClick }: {
  label: string; count?: number; active: boolean; onClick: () => void
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center justify-between py-[7px] rounded-[7px] cursor-pointer transition-colors px-2 -mx-2',
        active
          ? 'bg-[rgba(0,229,160,0.06)] border-l-2 border-[var(--mint)] !pl-[6px]'
          : 'hover:bg-[var(--bg3)]',
      )}
    >
      <div className="flex items-center gap-2">
        <div className={cn(
          'w-[15px] h-[15px] rounded-[4px] flex items-center justify-center flex-shrink-0',
          active
            ? 'bg-[var(--mint)] border border-[var(--mint)]'
            : 'border border-[var(--border2)]',
        )}>
          {active && <CheckSvg />}
        </div>
        <span className={cn('text-[13px]', active ? 'text-[var(--t1)]' : 'text-[var(--t2)]')}>{label}</span>
      </div>
      {count !== undefined && (
        <span className="text-[10px] text-[var(--t3)] bg-[var(--bg3)] rounded-[4px] px-[6px] py-[1px] min-w-[20px] text-center">
          {count}
        </span>
      )}
    </div>
  )
}

/* ─── Sidebar body (reused in desktop aside + mobile drawer) ───────────────── */
function SidebarBody({
  availableOnly, setAvailableOnly,
  category, setCategory,
  gameFilter, setGameFilter,
  sort, setSort,
  onClear,
}: {
  availableOnly: boolean; setAvailableOnly: (v: boolean) => void
  category: string; setCategory: (v: string) => void
  gameFilter: GameKey | null; setGameFilter: (v: GameKey | null) => void
  sort: SortKey; setSort: (v: SortKey) => void
  onClear: () => void
}) {
  return (
    <>
      {/* Availability */}
      <div className="p-4 border-b border-[var(--border)]">
        <p className="text-[10px] font-medium uppercase tracking-[0.09em] text-[var(--t3)] mb-3">Availability</p>
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-[var(--t2)]">Available only</span>
          <button
            onClick={() => setAvailableOnly(!availableOnly)}
            className={cn(
              'w-9 h-5 rounded-[10px] relative flex-shrink-0 transition-colors border-0 cursor-pointer',
              availableOnly ? 'bg-[var(--mint)]' : 'bg-[var(--bg3)]',
            )}
          >
            <div className={cn(
              'w-[14px] h-[14px] bg-white rounded-full absolute top-[3px] transition-all',
              availableOnly ? 'right-[3px]' : 'left-[3px]',
            )} />
          </button>
        </div>
      </div>

      {/* Category */}
      <div className="p-4 border-b border-[var(--border)]">
        <p className="text-[10px] font-medium uppercase tracking-[0.09em] text-[var(--t3)] mb-3">Category</p>
        {(['all', 'pc', 'game', 'calculator', 'tierlist'] as const).map(cat => (
          <FilterOption
            key={cat}
            label={categoryLabels[cat]}
            count={categoryCounts[cat]}
            active={category === cat}
            onClick={() => setCategory(cat)}
          />
        ))}
      </div>

      {/* Game */}
      <div className="p-4 border-b border-[var(--border)]">
        <p className="text-[10px] font-medium uppercase tracking-[0.09em] text-[var(--t3)] mb-3">Game</p>
        {([
          { key: 'valorant' as GameKey,     label: 'Valorant',   count: 3 },
          { key: 'cs2' as GameKey,          label: 'CS2',        count: 3 },
          { key: 'fortnite' as GameKey,     label: 'Fortnite',   count: 2 },
          { key: 'elden-ring' as GameKey,   label: 'Elden Ring', count: 1 },
          { key: 'pokemon' as GameKey,      label: 'Pokemon',    count: 1 },
        ]).map(g => (
          <FilterOption
            key={g.key}
            label={g.label}
            count={g.count}
            active={gameFilter === g.key}
            onClick={() => setGameFilter(gameFilter === g.key ? null : g.key)}
          />
        ))}
      </div>

      {/* Sort */}
      <div className="p-4 border-b border-[var(--border)]">
        <p className="text-[10px] font-medium uppercase tracking-[0.09em] text-[var(--t3)] mb-3">Sort by</p>
        {([
          { key: 'popular' as SortKey, label: 'Most popular' },
          { key: 'newest'  as SortKey, label: 'Newest first' },
          { key: 'az'      as SortKey, label: 'A to Z' },
        ]).map(s => (
          <FilterOption
            key={s.key}
            label={s.label}
            active={sort === s.key}
            onClick={() => setSort(s.key)}
          />
        ))}
      </div>

      {/* Clear */}
      <div className="p-4">
        <button
          onClick={onClear}
          className="w-full bg-transparent border border-[var(--border)] rounded-[7px] py-2 text-[12px] text-[var(--t3)] cursor-pointer hover:border-[rgba(255,85,85,0.3)] hover:text-[#FF5555] transition-colors"
        >
          Clear all filters
        </button>
      </div>
    </>
  )
}

/* ─── Section divider label ────────────────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-[10px] mt-5 mb-3">
      <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--t3)] whitespace-nowrap flex items-center gap-2">
        {children}
      </span>
      <div className="flex-1 h-[0.5px] bg-[var(--border)]" />
    </div>
  )
}

/* ─── Main component ───────────────────────────────────────────────────────── */
export function ToolsListing() {
  const [search, setSearch]             = useState('')
  const [category, setCategory]         = useState<string>('all')
  const [availableOnly, setAvailableOnly] = useState(false)
  const [gameFilter, setGameFilter]     = useState<GameKey | null>(null)
  const [sort, setSort]                 = useState<SortKey>('popular')
  const [drawerOpen, setDrawerOpen]     = useState(false)

  const clearAll = () => {
    setSearch(''); setCategory('all'); setAvailableOnly(false)
    setGameFilter(null); setSort('popular')
  }

  const filtered = useMemo(() => {
    let list = [...tools]
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
    }
    if (availableOnly) list = list.filter(t => t.available)
    if (category !== 'all') list = list.filter(t => t.category === (category as ToolCategory))
    if (gameFilter) {
      const ids = gameTagMap[gameFilter]
      list = list.filter(t => ids.includes(t.id))
    }
    if (sort === 'az')     list.sort((a, b) => a.name.localeCompare(b.name))
    if (sort === 'newest') list.sort((a, b) => (b.updatedAt > a.updatedAt ? 1 : -1))
    return list
  }, [search, category, availableOnly, gameFilter, sort])

  const availableNow  = filtered.filter(t => t.available)
  const comingSoon    = filtered.filter(t => !t.available)
  const featuredTool  = tools.find(t => t.featured)!
  const showFeatured  = !search && category === 'all' && !gameFilter && !availableOnly

  const sidebarProps = {
    availableOnly, setAvailableOnly,
    category, setCategory,
    gameFilter, setGameFilter,
    sort, setSort,
    onClear: clearAll,
  }

  return (
    <div className="bg-[var(--bg)] text-[var(--t1)] min-h-screen">

      {/* ── BREADCRUMB ── */}
      <div className="px-6 py-[10px] bg-[var(--bg2)] border-b border-[var(--border)] flex items-center gap-[6px] text-[12px] text-[var(--t3)]">
        <Link href="/" className="hover:text-[var(--mint)] transition-colors cursor-pointer">Home</Link>
        <span>/</span>
        <span className="text-[var(--t2)]">All Tools</span>
      </div>

      {/* ── PAGE HEADER ── */}
      <div className="bg-[var(--bg)] px-6 pt-9 border-b border-[var(--border)] relative overflow-hidden">
        {/* ambient glow */}
        <div
          className="absolute top-[-60px] left-1/2 -translate-x-1/2 w-[600px] h-[220px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(0,229,160,0.08) 0%, transparent 70%)' }}
        />
        <div className="max-w-[1100px] mx-auto relative z-10">

          {/* top row: title + search */}
          <div className="flex items-end justify-between gap-6 flex-wrap mb-7">
            <div>
              <div className="inline-flex items-center gap-[6px] bg-[rgba(0,229,160,0.08)] border border-[rgba(0,229,160,0.2)] rounded-[20px] px-3 py-1 text-[11px] text-[var(--mint)] mb-[14px]">
                <span className="w-[5px] h-[5px] rounded-full bg-[var(--mint)] animate-pulse-dot flex-shrink-0" />
                22 free gaming tools — no sign-up
              </div>
              <h1 className="text-[30px] sm:text-[30px] text-[22px] font-medium leading-[1.2] mb-2">
                All <em className="text-[var(--mint)] not-italic">Gaming Tools</em>
              </h1>
              <p className="text-[14px] text-[var(--t2)] leading-[1.65] max-w-[460px]">
                Free tools for every gamer — PC builders, competitive players, and casual gamers. Instant results, no account needed.
              </p>
            </div>

            {/* search */}
            <div className="relative w-full sm:w-[280px] flex-shrink-0 self-end">
              <SearchIcon size={14} className="absolute left-[13px] top-1/2 -translate-y-1/2 text-[var(--t3)] pointer-events-none" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search tools..."
                className="w-full bg-[var(--bg2)] border border-[var(--border2)] rounded-[10px] py-[11px] pl-10 pr-11 text-[13px] text-[var(--t1)] outline-none placeholder:text-[var(--t3)] focus:border-[rgba(0,229,160,0.4)] transition-all"
              />
              <span className="absolute right-[10px] top-1/2 -translate-y-1/2 text-[10px] text-[var(--t3)] bg-[var(--bg3)] border border-[var(--border)] rounded-[4px] px-[6px] py-[2px] font-mono">
                ⌘K
              </span>
            </div>
          </div>

          {/* stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-[var(--border)]">
            {[
              { n: '22',   color: 'var(--mint)',   label: 'Total tools' },
              { n: '6',    color: 'var(--blue)',   label: 'Available now' },
              { n: '16',   color: 'var(--orange)', label: 'Coming soon' },
              { n: 'Free', color: 'var(--mint)',   label: 'Always, no paywall' },
            ].map((s, i) => (
              <div
                key={i}
                className={cn(
                  'py-[14px] px-5 text-center',
                  'border-r border-[var(--border)] last:border-r-0',
                  // mobile: 2 cols — remove right border on 2nd, add top border on 3rd+4th
                  'sm:[&:nth-child(2)]:border-r-[0.5px] [&:nth-child(2)]:border-r-0',
                  '[&:nth-child(3)]:border-t sm:[&:nth-child(3)]:border-t-0',
                  '[&:nth-child(4)]:border-t sm:[&:nth-child(4)]:border-t-0',
                )}
              >
                <div className="text-[22px] font-medium mb-[2px]" style={{ color: s.color }}>{s.n}</div>
                <div className="text-[11px] text-[var(--t3)]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="max-w-[1100px] mx-auto px-6 py-6 grid grid-cols-1 md:grid-cols-[210px_1fr] gap-5 items-start">

        {/* Desktop sidebar */}
        <aside className="hidden md:block bg-[var(--bg2)] border border-[var(--border)] rounded-[12px] overflow-hidden sticky top-5">
          <SidebarBody {...sidebarProps} />
        </aside>

        {/* Main content */}
        <div className="min-w-0">

          {/* content bar */}
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <p className="text-[13px] text-[var(--t2)] flex-shrink-0">
              Showing{' '}
              <span className="text-[var(--mint)] font-medium text-[15px]">{filtered.length}</span>{' '}
              tools —{' '}
              <span className="text-[var(--blue)]">{availableNow.length}</span> available now
            </p>
            <div className="flex bg-[var(--bg2)] border border-[var(--border)] rounded-[9px] overflow-hidden flex-shrink-0">
              {([
                ['popular', 'Popular'],
                ['newest',  'Newest'],
                ['az',      'A — Z'],
              ] as const).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSort(key)}
                  className={cn(
                    'text-[12px] py-[7px] px-[14px] cursor-pointer transition-all whitespace-nowrap bg-transparent border-0 border-r border-[var(--border)] last:border-r-0',
                    sort === key
                      ? 'bg-[rgba(0,229,160,0.1)] text-[var(--mint)] font-medium'
                      : 'text-[var(--t2)] hover:text-[var(--t1)] hover:bg-[var(--bg3)]',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* ── FEATURED CARD ── */}
          {showFeatured && (
            <Link
              href={`/tools/${featuredTool.slug}`}
              className="group bg-[var(--bg2)] border border-[rgba(0,229,160,0.2)] rounded-[12px] p-5 flex items-center gap-4 mb-4 transition-all hover:border-[rgba(0,229,160,0.4)] hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)] relative overflow-hidden flex-wrap"
            >
              <div
                className="absolute right-[-40px] top-[-40px] w-[160px] h-[160px] pointer-events-none"
                style={{ background: 'radial-gradient(ellipse, rgba(0,229,160,0.08) 0%, transparent 70%)' }}
              />
              <div className="w-[52px] h-[52px] rounded-[13px] bg-[rgba(0,229,160,0.1)] flex items-center justify-center flex-shrink-0">
                <Monitor size={24} strokeWidth={1.7} style={{ color: '#00E5A0' }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--mint)] mb-[5px] flex items-center gap-[5px]">
                  <span className="w-[5px] h-[5px] rounded-full bg-[var(--mint)] animate-pulse-dot" />
                  Most popular tool
                </div>
                <div className="text-[17px] font-medium text-[var(--t1)] mb-[5px]">PC Bottleneck Calculator</div>
                <div className="hidden sm:block text-[13px] text-[var(--t2)] leading-[1.5] mb-[10px]">
                  Find out if your CPU or GPU is limiting your gaming performance. Instant bottleneck score with personalised upgrade recommendations.
                </div>
                <div className="flex gap-[6px] flex-wrap">
                  <span className="text-[10px] px-2 py-[2px] rounded-[4px] font-medium bg-[rgba(0,229,160,0.1)] text-[var(--mint)]">Hero tool</span>
                  <span className="text-[10px] px-2 py-[2px] rounded-[4px] font-medium bg-[rgba(80,140,255,0.1)] text-[var(--blue)]">PC Tools</span>
                  <span className="text-[10px] px-2 py-[2px] rounded-[4px] font-medium bg-[rgba(255,120,64,0.1)] text-[var(--orange)]">50k users/mo</span>
                  <span className="text-[10px] px-2 py-[2px] rounded-[4px] font-medium bg-[rgba(255,255,255,0.06)] text-[var(--t2)]">Updated May 2025</span>
                </div>
              </div>
              <div className="flex items-center gap-[6px] bg-[var(--mint)] text-[#0D0F14] text-[13px] font-medium rounded-[8px] px-[18px] py-[10px] whitespace-nowrap flex-shrink-0 w-full sm:w-auto justify-center">
                Try now
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          )}

          {/* ── AVAILABLE NOW ── */}
          {availableNow.length > 0 && (
            <>
              <SectionLabel>
                Available now
                <span className="flex items-center gap-1 text-[10px] text-[var(--mint)] font-normal normal-case tracking-normal">
                  <span className="w-1 h-1 rounded-full bg-[var(--mint)] animate-pulse-dot" />
                  {availableNow.length} tools live
                </span>
              </SectionLabel>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {availableNow.map(tool => {
                  const Icon = iconMap[tool.id] ?? Monitor
                  return (
                    <Link
                      key={tool.id}
                      href={`/tools/${tool.slug}`}
                      className="group relative bg-[var(--bg2)] rounded-[12px] p-4 flex flex-col gap-2 cursor-pointer transition-all hover:bg-[var(--bg3)] hover:-translate-y-[1px]"
                      style={{
                        border: '0.5px solid var(--border)',
                        borderLeft: '2px solid transparent',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.borderLeftColor = 'var(--mint)')}
                      onMouseLeave={e => (e.currentTarget.style.borderLeftColor = 'transparent')}
                    >
                      {/* top row */}
                      <div className="flex items-start justify-between gap-[6px]">
                        <div
                          className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0"
                          style={{ background: tool.iconBg }}
                        >
                          <Icon size={18} strokeWidth={1.7} style={{ color: tool.iconColor }} />
                        </div>
                        {tool.badge && (
                          <span className={cn('text-[9px] px-[7px] py-[2px] rounded-[4px] font-medium mt-[2px]', badgeStyles[tool.badgeType ?? 'gray'])}>
                            {tool.badge}
                          </span>
                        )}
                      </div>
                      {/* name */}
                      <div className="text-[13px] font-medium text-[var(--t1)] leading-[1.35]">{tool.name}</div>
                      {/* desc */}
                      <div className="text-[12px] text-[var(--t3)] leading-[1.5] flex-1">{tool.description}</div>
                      {/* footer */}
                      <div className="flex items-center justify-between mt-[2px]">
                        <span className="text-[10px] px-[7px] py-[2px] rounded-[4px] font-medium bg-[rgba(255,255,255,0.06)] text-[var(--t2)]">
                          {catBadge[tool.category]}
                        </span>
                        <span className="text-[10px] text-[var(--t3)] flex items-center gap-[3px]">
                          <span className="w-1 h-1 rounded-full bg-[rgba(0,229,160,0.5)]" />
                          {tool.updatedAt}
                        </span>
                      </div>
                      {/* arrow */}
                      <span className="absolute bottom-[14px] right-[14px] text-[var(--t3)] text-[14px] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    </Link>
                  )
                })}
              </div>
            </>
          )}

          {/* ── COMING SOON ── */}
          {comingSoon.length > 0 && (
            <>
              <SectionLabel>
                Coming soon — {comingSoon.length} tools in development
              </SectionLabel>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {comingSoon.map(tool => {
                  const Icon = iconMap[tool.id] ?? Monitor
                  return (
                    <div
                      key={tool.id}
                      className="bg-[var(--bg2)] border border-[var(--border)] rounded-[10px] p-[14px] flex items-center gap-[10px] opacity-50 hover:opacity-75 transition-opacity"
                    >
                      <div className="w-[34px] h-[34px] rounded-[8px] bg-[var(--bg3)] flex items-center justify-center flex-shrink-0">
                        <Icon size={14} strokeWidth={1.7} className="text-[var(--t3)]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[12px] font-medium text-[var(--t2)] mb-[3px] leading-[1.3] truncate">{tool.name}</div>
                        <div className="text-[10px] text-[var(--t3)]">{catBadge[tool.category]}</div>
                      </div>
                      <span className="text-[9px] text-[var(--t3)] bg-[var(--bg3)] border border-[var(--border)] rounded-[4px] px-[6px] py-[2px] ml-auto flex-shrink-0">
                        Soon
                      </span>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-[var(--t2)] text-[14px]">No tools match your filters.</p>
              <button onClick={clearAll} className="mt-3 text-[12px] text-[var(--mint)] hover:underline cursor-pointer bg-transparent border-0">
                Clear filters
              </button>
            </div>
          )}

          {/* ── CTA STRIP ── */}
          <div className="mt-6 mb-2 bg-[var(--bg2)] border border-[rgba(0,229,160,0.12)] rounded-r-[10px] px-6 py-5 flex items-center justify-between gap-4 flex-wrap"
            style={{ borderLeft: '3px solid var(--mint)' }}
          >
            <div>
              <div className="text-[14px] font-medium text-[var(--t1)] mb-1">Start with our most popular tool</div>
              <div className="text-[12px] text-[var(--t2)]">Find your PC bottleneck in 30 seconds — free, instant, no sign-up.</div>
            </div>
            <Link
              href="/tools/pc-bottleneck-calculator"
              className="bg-[var(--mint)] text-[#0D0F14] text-[13px] font-medium rounded-[8px] px-[18px] py-[10px] hover:opacity-90 transition-opacity whitespace-nowrap w-full sm:w-auto text-center"
            >
              PC Bottleneck Calculator →
            </Link>
          </div>

        </div>
      </div>

      {/* ── MOBILE FILTER FAB ── */}
      <button
        onClick={() => setDrawerOpen(true)}
        className="md:hidden fixed bottom-6 right-5 z-[100] flex items-center gap-[7px] bg-[var(--mint)] text-[#0D0F14] text-[13px] font-semibold rounded-[50px] px-5 py-[11px] border-0 cursor-pointer shadow-[0_4px_20px_rgba(0,229,160,0.3)]"
      >
        <SlidersHorizontal size={14} strokeWidth={2.5} />
        Filters
      </button>

      {/* ── DRAWER OVERLAY ── */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[200] backdrop-blur-sm md:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* ── MOBILE DRAWER ── */}
      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 z-[201] bg-[var(--bg2)] rounded-t-[16px] border-t border-[var(--border)] max-h-[80vh] overflow-y-auto transition-transform duration-300 ease-[cubic-bezier(.4,0,.2,1)] md:hidden',
          drawerOpen ? 'translate-y-0' : 'translate-y-full',
        )}
      >
        <div className="w-9 h-1 bg-[var(--border2)] rounded-full mx-auto mt-3" />
        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          <span className="text-[14px] font-medium text-[var(--t1)]">Filter & Sort</span>
          <button
            onClick={() => setDrawerOpen(false)}
            className="bg-[var(--bg3)] border border-[var(--border)] rounded-[6px] px-[10px] py-[5px] text-[12px] text-[var(--t2)] cursor-pointer"
          >
            Done
          </button>
        </div>
        <div className="px-5 pb-8">
          <SidebarBody
            {...sidebarProps}
            onClear={() => { clearAll(); setDrawerOpen(false) }}
          />
        </div>
      </div>

    </div>
  )
}
