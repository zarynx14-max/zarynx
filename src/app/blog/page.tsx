'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  Monitor,
  Cpu,
  Gamepad2,
  CreditCard,
  ChartBar,
  Sword,
  Crosshair,
  Trophy,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Types ────────────────────────────────────────────────────────────────────
interface Article {
  slug: string
  title: string
  excerpt: string
  categories: { label: string; color: 'mint' | 'blue' | 'orange' }[]
  readTime: string
  date: string
  icon: React.ReactNode
  featured?: boolean
}

// ── Data ─────────────────────────────────────────────────────────────────────
const FEATURED: Article = {
  slug: 'best-gpu-1440p-gaming-2025',
  title: 'Best GPU for 1440p gaming in 2025 — full breakdown and recommendations',
  excerpt:
    'We tested 14 GPUs at 1440p across 10 popular games. Here's exactly which card to buy at every budget — and which ones to skip.',
  categories: [
    { label: 'PC Building', color: 'mint' },
    { label: 'GPU Guide', color: 'blue' },
  ],
  readTime: '8 min read',
  date: 'May 2025',
  icon: <Monitor size={24} strokeWidth={1.5} />,
  featured: true,
}

const GRID_ARTICLES: Article[] = [
  {
    slug: '1440p-vs-4k-gaming-2025',
    title: '1440p vs 4K gaming — is the upgrade worth it in 2025?',
    excerpt: 'We ran the numbers so you can decide if 4K is actually worth the GPU cost.',
    categories: [{ label: 'PC Building', color: 'mint' }],
    readTime: '7 min read',
    date: 'May 2025',
    icon: <Monitor size={28} strokeWidth={1.4} />,
  },
  {
    slug: 'cpu-bottleneck-gpu-upgrade',
    title: 'How to avoid a CPU bottleneck when upgrading your GPU',
    excerpt: 'Upgrading your GPU without checking your CPU first is a costly mistake.',
    categories: [{ label: 'PC Building', color: 'mint' }],
    readTime: '6 min read',
    date: 'Apr 2025',
    icon: <Cpu size={28} strokeWidth={1.4} />,
  },
  {
    slug: 'game-pass-worth-it-2025',
    title: 'Is Game Pass worth it in 2025? Full cost breakdown',
    excerpt: 'We did the math so you don\'t have to. Spoiler: it depends.',
    categories: [{ label: 'Game Pass', color: 'orange' }],
    readTime: '6 min read',
    date: 'Apr 2025',
    icon: <CreditCard size={28} strokeWidth={1.4} />,
  },
  {
    slug: 'rtx-4060-ti-vs-rx-7700-xt',
    title: 'RTX 4060 Ti vs RX 7700 XT — which should you buy?',
    excerpt: 'Head-to-head at 1080p and 1440p with full game benchmarks.',
    categories: [{ label: 'GPU Guide', color: 'mint' }],
    readTime: '9 min read',
    date: 'Mar 2025',
    icon: <ChartBar size={28} strokeWidth={1.4} />,
  },
]

const LIST_ARTICLES: Article[] = [
  {
    slug: 'elden-ring-beginner-build-2025',
    title: 'Best Elden Ring build for beginners in 2025 — Vagabond guide',
    excerpt: 'Stats, weapons, and talismans explained for brand new players.',
    categories: [{ label: 'Game Guides', color: 'blue' }],
    readTime: '10 min read',
    date: 'May 2025',
    icon: <Sword size={22} strokeWidth={1.4} />,
  },
  {
    slug: 'valorant-sensitivity-guide',
    title: 'How to find your perfect Valorant sensitivity — step-by-step',
    excerpt: 'Use the sensitivity converter to port your CS2 settings in 30 seconds.',
    categories: [{ label: 'Tools', color: 'mint' }],
    readTime: '5 min read',
    date: 'Apr 2025',
    icon: <Crosshair size={22} strokeWidth={1.4} />,
  },
  {
    slug: 'marvel-rivals-tier-list-season-2',
    title: 'Marvel Rivals tier list — best heroes ranked for Season 2',
    excerpt: 'Updated with every Season 2 balance patch. S-tier through D-tier.',
    categories: [{ label: 'Tier Lists', color: 'orange' }],
    readTime: '8 min read',
    date: 'May 2025',
    icon: <Trophy size={22} strokeWidth={1.4} />,
  },
]

const TRENDING = [
  { slug: 'marvel-rivals-tier-list-season-2', title: 'Marvel Rivals tier list S2', meta: 'Tier Lists · May 2025' },
  { slug: 'valorant-sensitivity-guide', title: 'Best Valorant sensitivity guide', meta: 'Tools · Apr 2025' },
  { slug: 'game-pass-worth-it-2025', title: 'Game Pass worth it in 2025?', meta: 'Game Pass · Apr 2025' },
  { slug: 'best-gpu-1440p-gaming-2025', title: 'Best GPU for 1440p gaming', meta: 'GPU Guide · May 2025' },
]

const TOPICS = ['All', 'GPU', '1440p', 'PC Building', 'Valorant', 'CS2', 'Elden Ring', 'Game Pass', 'Benchmarks', 'Tier Lists', 'Reviews', 'Sensitivity']

const FILTERS = [
  { label: 'All', color: 'default' as const },
  { label: 'PC Building', color: 'mint' as const },
  { label: 'Game Guides', color: 'blue' as const },
  { label: 'GPU Guides', color: 'mint' as const },
  { label: 'Tier Lists', color: 'orange' as const },
  { label: 'Tools', color: 'mint' as const },
  { label: 'Game Pass', color: 'orange' as const },
  { label: 'Valorant', color: 'blue' as const },
  { label: 'Benchmarks', color: 'mint' as const },
]

// ── Pill helper ───────────────────────────────────────────────────────────────
const pillStyles = {
  mint:   'bg-[rgba(0,229,160,0.08)] text-[var(--mint)] border-[rgba(0,229,160,0.2)]',
  blue:   'bg-[rgba(80,140,255,0.08)] text-[var(--blue)] border-[rgba(80,140,255,0.2)]',
  orange: 'bg-[rgba(255,120,64,0.08)] text-[var(--orange)] border-[rgba(255,120,64,0.2)]',
}

function CatPill({ label, color }: { label: string; color: 'mint' | 'blue' | 'orange' }) {
  return (
    <span className={cn('rounded-[20px] border px-[9px] py-[2px] text-[10px] font-medium', pillStyles[color])}>
      {label}
    </span>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function BlogPage() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [activeTopic, setActiveTopic] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [search, setSearch] = useState('')
  const [activePage, setActivePage] = useState(1)

  return (
    <>
      {/* ── Hero ── */}
      <div className="relative overflow-hidden border-b border-[var(--border)] bg-[var(--bg2)] px-4 pb-[22px] pt-6 sm:px-6">
        {/* Glow */}
        <div
          className="pointer-events-none absolute left-1/2 top-[-30px] h-[140px] w-[400px] -translate-x-1/2"
          style={{ background: 'radial-gradient(ellipse, rgba(0,229,160,0.06) 0%, transparent 70%)' }}
        />
        <div className="relative z-10 mx-auto max-w-[860px]">
          <h1 className="mb-[6px] text-[20px] font-medium text-[var(--t1)]">
            Guides &amp; <em className="not-italic text-[var(--mint)]">Articles</em>
          </h1>
          <p className="mb-4 text-[12px] text-[var(--t2)]">
            In-depth gaming guides, GPU benchmarks, build tips, and tool walkthroughs — updated regularly.
          </p>
          {/* Search */}
          <div className="flex max-w-[420px] items-center gap-2 rounded-[8px] border border-[var(--border2)] bg-[var(--bg3)] px-3 py-2">
            <Search size={13} className="flex-shrink-0 text-[var(--t3)]" />
            <input
              type="text"
              placeholder="Search articles…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-[12px] text-[var(--t1)] outline-none placeholder:text-[var(--t3)]"
            />
          </div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="border-b border-[var(--border)] bg-[var(--bg)] px-4 py-[10px] sm:px-6">
        <div className="mx-auto flex max-w-[860px] flex-wrap items-center gap-[6px]">
          <span className="mr-1 flex-shrink-0 text-[10px] uppercase tracking-[0.06em] text-[var(--t3)]">Filter:</span>
          {FILTERS.map(f => (
            <button
              key={f.label}
              onClick={() => setActiveFilter(f.label)}
              className={cn(
                'whitespace-nowrap rounded-[20px] border px-[11px] py-[4px] text-[11px] transition-colors',
                activeFilter === f.label
                  ? f.color === 'mint' || f.color === 'default'
                    ? 'border-[rgba(0,229,160,0.25)] bg-[rgba(0,229,160,0.1)] text-[var(--mint)]'
                    : f.color === 'orange'
                    ? 'border-[rgba(255,120,64,0.25)] bg-[rgba(255,120,64,0.1)] text-[var(--orange)]'
                    : 'border-[rgba(80,140,255,0.25)] bg-[rgba(80,140,255,0.1)] text-[var(--blue)]'
                  : 'border-[var(--border2)] text-[var(--t2)] hover:text-[var(--t1)]'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="px-4 sm:px-6">
        <div className="mx-auto grid max-w-[860px] grid-cols-1 items-start gap-5 py-5 lg:grid-cols-[1fr_200px]">

          {/* ── Main column ── */}
          <div>
            {/* Featured card */}
            <Link
              href={`/blog/${FEATURED.slug}`}
              className="group mb-4 grid overflow-hidden rounded-[12px] border border-[var(--border)] bg-[var(--bg2)] transition-colors hover:border-[var(--border2)] sm:grid-cols-2"
            >
              {/* Image pane */}
              <div className="relative flex min-h-[160px] items-center justify-center border-b border-[var(--border)] bg-[var(--bg3)] sm:border-b-0 sm:border-r">
                {/* Featured badge */}
                <div className="absolute left-[10px] top-[10px] rounded-[5px] bg-[var(--mint)] px-[8px] py-[3px] text-[10px] font-medium text-[#0D0F14]">
                  Featured
                </div>
                <div className="text-center">
                  <div className="mx-auto mb-2 flex h-[56px] w-[56px] items-center justify-center rounded-[14px] bg-[rgba(0,229,160,0.1)] text-[var(--mint)]">
                    {FEATURED.icon}
                  </div>
                  <p className="text-[10px] text-[var(--t3)]">Latest guide</p>
                </div>
              </div>
              {/* Content pane */}
              <div className="flex flex-col justify-between p-[18px]">
                <div>
                  <div className="mb-[10px] flex flex-wrap gap-[6px]">
                    {FEATURED.categories.map(c => <CatPill key={c.label} {...c} />)}
                  </div>
                  <h2 className="mb-2 text-[15px] font-medium leading-[1.35] text-[var(--t1)] group-hover:text-[var(--mint)] transition-colors">
                    {FEATURED.title}
                  </h2>
                  <p className="mb-3 text-[12px] leading-[1.6] text-[var(--t2)]">{FEATURED.excerpt}</p>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-[var(--t3)]">
                  <div className="flex h-[20px] w-[20px] flex-shrink-0 items-center justify-center rounded-full bg-[rgba(0,229,160,0.15)] text-[8px] font-medium text-[var(--mint)]">
                    ZT
                  </div>
                  <span>Zarynx Team</span>
                  <span className="h-[2px] w-[2px] rounded-full bg-[var(--t3)]" />
                  <span>{FEATURED.readTime}</span>
                  <span className="h-[2px] w-[2px] rounded-full bg-[var(--t3)]" />
                  <span>{FEATURED.date}</span>
                  <span className="ml-auto font-medium text-[var(--mint)]">Read →</span>
                </div>
              </div>
            </Link>

            {/* List header */}
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[12px] text-[var(--t3)]">
                Showing <span className="font-medium text-[var(--t2)]">24</span> articles
              </p>
              <div className="flex items-center gap-2">
                <select className="rounded-[6px] border border-[var(--border2)] bg-[var(--bg3)] px-2 py-[4px] text-[11px] text-[var(--t2)] outline-none">
                  <option>Latest first</option>
                  <option>Most popular</option>
                  <option>Oldest first</option>
                </select>
                <div className="flex gap-[3px]">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      'flex h-[26px] w-[26px] items-center justify-center rounded-[6px] border border-[var(--border2)] transition-colors',
                      viewMode === 'grid'
                        ? 'border-[rgba(0,229,160,0.2)] bg-[rgba(0,229,160,0.1)] text-[var(--mint)]'
                        : 'bg-[var(--bg2)] text-[var(--t3)]'
                    )}
                  >
                    <LayoutGrid size={13} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      'flex h-[26px] w-[26px] items-center justify-center rounded-[6px] border border-[var(--border2)] transition-colors',
                      viewMode === 'list'
                        ? 'border-[rgba(0,229,160,0.2)] bg-[rgba(0,229,160,0.1)] text-[var(--mint)]'
                        : 'bg-[var(--bg2)] text-[var(--t3)]'
                    )}
                  >
                    <List size={13} />
                  </button>
                </div>
              </div>
            </div>

            {/* Article grid */}
            {viewMode === 'grid' && (
              <div className="mb-3 grid grid-cols-1 gap-[10px] sm:grid-cols-2">
                {GRID_ARTICLES.map(article => (
                  <Link
                    key={article.slug}
                    href={`/blog/${article.slug}`}
                    className="group overflow-hidden rounded-[10px] border border-[var(--border)] bg-[var(--bg2)] transition-colors hover:border-[var(--border2)]"
                  >
                    {/* Img placeholder */}
                    <div className="relative flex h-[90px] items-center justify-center border-b border-[var(--border)] bg-[var(--bg3)]">
                      <span className="text-[var(--t3)] opacity-40">{article.icon}</span>
                      <div className="absolute bottom-[7px] left-[9px]">
                        {article.categories.map(c => <CatPill key={c.label} {...c} />)}
                      </div>
                    </div>
                    <div className="p-[11px]">
                      <p className="mb-[6px] text-[12px] font-medium leading-[1.4] text-[var(--t1)] transition-colors group-hover:text-[var(--mint)]">
                        {article.title}
                      </p>
                      <p className="mb-2 line-clamp-2 text-[11px] leading-[1.55] text-[var(--t3)]">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center gap-[5px] text-[10px] text-[var(--t3)]">
                        {article.readTime}
                        <span className="h-[2px] w-[2px] rounded-full bg-[var(--t3)]" />
                        {article.date}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* List view articles (always shown below grid, or replaces grid in list mode) */}
            {viewMode === 'list' && (
              <div className="mb-3 flex flex-col gap-2">
                {[...GRID_ARTICLES, ...LIST_ARTICLES].map(article => (
                  <Link
                    key={article.slug}
                    href={`/blog/${article.slug}`}
                    className="group flex gap-3 rounded-[10px] border border-[var(--border)] bg-[var(--bg2)] p-3 transition-colors hover:border-[var(--border2)]"
                  >
                    <div className="flex h-[70px] w-[70px] flex-shrink-0 items-center justify-center rounded-[8px] bg-[var(--bg3)] text-[var(--t3)] opacity-40">
                      {article.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-[5px] flex flex-wrap gap-[5px]">
                        {article.categories.map(c => <CatPill key={c.label} {...c} />)}
                      </div>
                      <p className="mb-1 text-[13px] font-medium leading-[1.35] text-[var(--t1)] transition-colors group-hover:text-[var(--mint)]">
                        {article.title}
                      </p>
                      <p className="mb-[6px] text-[11px] leading-[1.5] text-[var(--t3)]">{article.excerpt}</p>
                      <div className="flex items-center gap-[5px] text-[10px] text-[var(--t3)]">
                        {article.readTime}
                        <span className="h-[2px] w-[2px] rounded-full bg-[var(--t3)]" />
                        {article.date}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Grid mode list rows */}
            {viewMode === 'grid' && (
              <div className="mb-3 flex flex-col gap-2">
                {LIST_ARTICLES.map(article => (
                  <Link
                    key={article.slug}
                    href={`/blog/${article.slug}`}
                    className="group flex gap-3 rounded-[10px] border border-[var(--border)] bg-[var(--bg2)] p-3 transition-colors hover:border-[var(--border2)]"
                  >
                    <div className="flex h-[70px] w-[70px] flex-shrink-0 items-center justify-center rounded-[8px] bg-[var(--bg3)] text-[var(--t3)] opacity-40">
                      {article.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-[5px] flex flex-wrap gap-[5px]">
                        {article.categories.map(c => <CatPill key={c.label} {...c} />)}
                      </div>
                      <p className="mb-1 text-[13px] font-medium leading-[1.35] text-[var(--t1)] transition-colors group-hover:text-[var(--mint)]">
                        {article.title}
                      </p>
                      <p className="mb-[6px] text-[11px] leading-[1.5] text-[var(--t3)]">{article.excerpt}</p>
                      <div className="flex items-center gap-[5px] text-[10px] text-[var(--t3)]">
                        {article.readTime}
                        <span className="h-[2px] w-[2px] rounded-full bg-[var(--t3)]" />
                        {article.date}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-center gap-1 py-2">
              <button className="flex h-[30px] w-[30px] items-center justify-center rounded-[7px] border border-[var(--border2)] bg-[var(--bg2)] text-[var(--t2)] transition-colors hover:border-[var(--border2)] hover:text-[var(--t1)]">
                <ChevronLeft size={14} />
              </button>
              {[1, 2, 3].map(p => (
                <button
                  key={p}
                  onClick={() => setActivePage(p)}
                  className={cn(
                    'flex h-[30px] w-[30px] items-center justify-center rounded-[7px] border text-[12px] transition-colors',
                    activePage === p
                      ? 'border-[rgba(0,229,160,0.25)] bg-[rgba(0,229,160,0.1)] text-[var(--mint)]'
                      : 'border-[var(--border2)] bg-[var(--bg2)] text-[var(--t2)] hover:text-[var(--t1)]'
                  )}
                >
                  {p}
                </button>
              ))}
              <span className="flex h-[30px] w-[30px] items-center justify-center text-[10px] text-[var(--t3)]">…</span>
              <button className="flex h-[30px] w-[30px] items-center justify-center rounded-[7px] border border-[var(--border2)] bg-[var(--bg2)] text-[12px] text-[var(--t2)] transition-colors hover:text-[var(--t1)]">
                8
              </button>
              <button className="flex h-[30px] w-[30px] items-center justify-center rounded-[7px] border border-[var(--border2)] bg-[var(--bg2)] text-[var(--t2)] transition-colors hover:text-[var(--t1)]">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div>
            {/* Trending */}
            <div className="mb-3 overflow-hidden rounded-[10px] border border-[var(--border)] bg-[var(--bg2)]">
              <div className="border-b border-[var(--border)] px-[14px] py-[10px] text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--t3)]">
                Trending this week
              </div>
              {TRENDING.map((item, i) => (
                <Link
                  key={item.slug}
                  href={`/blog/${item.slug}`}
                  className="group flex cursor-pointer items-center gap-[9px] border-b border-[var(--border)] px-[14px] py-[8px] transition-colors last:border-0 hover:bg-[var(--bg3)]"
                >
                  <span className="min-w-[18px] text-[16px] font-medium text-[var(--bg3)]">
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

            {/* Browse topics */}
            <div className="mb-3 overflow-hidden rounded-[10px] border border-[var(--border)] bg-[var(--bg2)]">
              <div className="border-b border-[var(--border)] px-[14px] py-[10px] text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--t3)]">
                Browse topics
              </div>
              <div className="flex flex-wrap gap-[6px] p-[11px]">
                {TOPICS.map(topic => (
                  <button
                    key={topic}
                    onClick={() => setActiveTopic(topic)}
                    className={cn(
                      'rounded-[4px] border px-[9px] py-[3px] text-[10px] transition-colors',
                      activeTopic === topic
                        ? 'border-[rgba(0,229,160,0.25)] bg-[rgba(0,229,160,0.08)] text-[var(--mint)]'
                        : 'border-[var(--border)] bg-[var(--bg3)] text-[var(--t3)] hover:text-[var(--t2)]'
                    )}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="overflow-hidden rounded-[10px] border border-[var(--border)] bg-[var(--bg2)]">
              <div className="border-b border-[var(--border)] px-[14px] py-[10px] text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--t3)]">
                Stay updated
              </div>
              <div className="p-[13px]">
                <p className="mb-2 text-[11px] leading-[1.55] text-[var(--t2)]">
                  New guides and tool launches — one email, no spam.
                </p>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="mb-[7px] w-full rounded-[6px] border border-[var(--border2)] bg-[var(--bg3)] px-[9px] py-[7px] text-[11px] text-[var(--t1)] outline-none placeholder:text-[var(--t3)] focus:border-[rgba(0,229,160,0.35)]"
                />
                <button className="w-full rounded-[6px] bg-[var(--mint)] py-[7px] text-[11px] font-medium text-[#0D0F14] transition-opacity hover:opacity-90">
                  Notify me
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
