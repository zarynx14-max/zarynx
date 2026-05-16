'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type PillColor = 'mint' | 'blue' | 'orange' | 'gray'

interface CategoryArticle {
  slug:      string
  title:     string
  excerpt:   string
  tag:       string
  tagColor:  PillColor
  date:      string
  readTime:  string
  featured?: boolean
}

interface SidebarCategory {
  label: string
  href:  string
  count: number
  color: string
}

interface PopularPost {
  title: string
  slug:  string
}

export interface BlogCategoryListingProps {
  categoryLabel:     string
  categorySlug:      string
  categoryColor:     string
  categoryColorBg:   string
  categoryColorBd:   string
  description:       string
  articleCount:      number
  articles:          CategoryArticle[]
  sidebarCategories: SidebarCategory[]
  popularPosts:      PopularPost[]
}

const pillClass: Record<PillColor, string> = {
  mint:   'bg-[rgba(0,229,160,0.1)]    text-[var(--mint)]',
  blue:   'bg-[rgba(80,140,255,0.1)]   text-[var(--blue)]',
  orange: 'bg-[rgba(255,120,64,0.1)]   text-[var(--orange)]',
  gray:   'bg-[rgba(255,255,255,0.06)] text-[var(--t2)]',
}

const TABS = [
  { label: 'PC Build Guides', slug: 'pc-building',  href: '/blog/category/pc-building' },
  { label: 'Game Guides',     slug: 'guides',        href: '/blog/category/guides' },
  { label: 'Tier Lists',      slug: 'tier-lists',    href: '/tier-lists' },
  { label: 'Blog',            slug: 'blog',          href: '/blog' },
]

const PER_PAGE = 6

export function BlogCategoryListing({
  categoryLabel,
  categorySlug,
  categoryColor,
  categoryColorBg,
  categoryColorBd,
  description,
  articleCount,
  articles,
  sidebarCategories,
  popularPosts,
}: BlogCategoryListingProps) {
  const [search, setSearch] = useState('')
  const [page,   setPage]   = useState(1)

  const featured = articles.find(a => a.featured)
  const rest      = articles.filter(a => !a.featured)

  const filtered = rest.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.excerpt.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const titleWords = categoryLabel.split(' ')
  const titleFirst = titleWords[0]
  const titleRest  = titleWords.slice(1).join(' ')

  return (
    <div className="min-h-screen bg-[var(--bg)]">

      {/* BREADCRUMB */}
      <div className="border-b border-[var(--border)] bg-[var(--bg2)] px-6 py-[10px]">
        <div className="mx-auto flex max-w-7xl items-center gap-2 text-[12px] text-[var(--t3)]">
          <Link href="/" className="transition-colors hover:text-[var(--mint)]">Home</Link>
          <span>/</span>
          <Link href="/blog" className="transition-colors hover:text-[var(--mint)]">Blog</Link>
          <span>/</span>
          <span className="text-[var(--t2)]">{categoryLabel}</span>
        </div>
      </div>

      {/* PAGE HEADER */}
      <div className="relative overflow-hidden border-b border-[var(--border)] bg-[var(--bg)] px-6 pb-0 pt-9">
        <div
          className="pointer-events-none absolute left-1/2 top-[-60px] h-[220px] w-[600px] -translate-x-1/2"
          style={{ background: `radial-gradient(ellipse, ${categoryColorBg} 0%, transparent 70%)` }}
        />
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-6">
            <div>
              <div
                className="mb-[14px] inline-flex items-center gap-[6px] rounded-full px-3 py-1 text-[11px]"
                style={{ background: categoryColorBg, border: `0.5px solid ${categoryColorBd}`, color: categoryColor }}
              >
                {categoryLabel}
              </div>
              <h1 className="mb-2 text-[30px] font-medium leading-tight text-[var(--t1)]">
                {titleFirst}{' '}
                <span style={{ color: categoryColor }}>{titleRest}</span>
              </h1>
              <p className="max-w-[460px] text-[14px] leading-relaxed text-[var(--t2)]">{description}</p>
            </div>
            <div className="relative w-full max-w-[280px]">
              <Search size={14} className="absolute left-[13px] top-1/2 -translate-y-1/2 text-[var(--t3)]" />
              <input
                type="text"
                placeholder="Search guides..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }}
                className="w-full rounded-[10px] border border-[var(--border2)] bg-[var(--bg2)] py-[11px] pl-[40px] pr-[44px] text-[13px] text-[var(--t1)] outline-none placeholder:text-[var(--t3)] focus:border-[rgba(0,229,160,0.4)]"
              />
              <span className="absolute right-[10px] top-1/2 -translate-y-1/2 rounded border border-[var(--border)] bg-[var(--bg3)] px-[6px] py-[2px] font-mono text-[10px] text-[var(--t3)]">⌘K</span>
            </div>
          </div>

          {/* STATS STRIP */}
          <div className="grid grid-cols-4 border-t border-[var(--border)]">
            {[
              { n: String(articleCount), label: 'Articles',        color: categoryColor },
              { n: 'Weekly',             label: 'New guides',      color: 'var(--mint)' },
              { n: '2025',               label: 'Always updated',  color: 'var(--orange)' },
              { n: 'Free',               label: 'No paywall',      color: 'var(--mint)' },
            ].map((s, i) => (
              <div key={i} className={cn('py-[14px] text-center', i < 3 && 'border-r border-[var(--border)]')}>
                <div className="mb-[2px] text-[22px] font-medium" style={{ color: s.color }}>{s.n}</div>
                <div className="text-[11px] text-[var(--t3)]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CATEGORY TABS */}
      <div className="flex flex-wrap gap-2 border-b border-[var(--border)] bg-[var(--bg2)] px-6 py-4">
        {TABS.map(tab => (
          <Link
            key={tab.label}
            href={tab.href}
            className={cn(
              'rounded-full border px-[14px] py-[6px] text-[12px] transition-all',
              tab.slug === categorySlug
                ? 'border-[rgba(80,140,255,0.3)] bg-[rgba(80,140,255,0.1)] text-[var(--blue)]'
                : 'border-[var(--border)] bg-transparent text-[var(--t2)] hover:border-[var(--border2)] hover:text-[var(--t1)]'
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* BODY */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-6 px-6 pb-12 pt-7 lg:grid-cols-[1fr_280px]">

        {/* MAIN */}
        <div>
          {/* FEATURED */}
          {featured && !search && (
            <>
              <div className="mb-4 flex items-center gap-[10px] text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--t3)]">
                <span>Featured guide</span>
                <span className="h-px flex-1 bg-[var(--border)]" />
              </div>
              <Link
                href={`/blog/${featured.slug}`}
                className="group mb-6 block overflow-hidden rounded-[12px] p-[22px] transition-all hover:-translate-y-[1px]"
                style={{ background: `linear-gradient(135deg, ${categoryColorBg} 0%, var(--bg2) 70%)`, border: `0.5px solid ${categoryColorBd}` }}
              >
                <div className="mb-3 flex items-center gap-2">
                  <span className="rounded-[4px] px-[8px] py-[2px] text-[10px] font-medium" style={{ background: categoryColorBg, color: categoryColor }}>Featured</span>
                  <span className="text-[11px] text-[var(--t3)]">{featured.date} · {featured.readTime}</span>
                </div>
                <div className="mb-2 text-[18px] font-medium leading-snug text-[var(--t1)] transition-colors group-hover:text-[var(--mint)]">{featured.title}</div>
                <div className="mb-4 text-[13px] leading-relaxed text-[var(--t2)]">{featured.excerpt}</div>
                <div className="flex items-center justify-between">
                  <span className={cn('rounded-[4px] px-[8px] py-[2px] text-[10px] font-medium', pillClass[featured.tagColor])}>{featured.tag}</span>
                  <span className="flex items-center gap-1 text-[12px] text-[var(--t3)] transition-colors group-hover:text-[var(--mint)]">Read guide <ChevronRight size={13} /></span>
                </div>
              </Link>
            </>
          )}

          {/* ARTICLE LIST */}
          <div className="mb-4 flex items-center gap-[10px] text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--t3)]">
            <span>All {categoryLabel.toLowerCase()}</span>
            <span className="h-px flex-1 bg-[var(--border)]" />
          </div>
          <div className="mb-6 flex flex-col gap-[10px]">
            {paginated.length === 0 && (
              <div className="py-10 text-center text-[14px] text-[var(--t3)]">No guides found for &ldquo;{search}&rdquo;</div>
            )}
            {paginated.map((article, i) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="group relative flex items-start gap-4 rounded-[10px] border border-[var(--border)] bg-[var(--bg2)] px-[18px] py-4 transition-all hover:-translate-y-[1px] hover:border-[var(--border2)]"
              >
                <div className="min-w-[20px] pt-[2px] text-[11px] font-medium text-[var(--t3)]">
                  {String((page - 1) * PER_PAGE + i + 1).padStart(2, '0')}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-[6px] flex items-center gap-2">
                    <span className={cn('rounded-[4px] px-[7px] py-[2px] text-[10px] font-medium', pillClass[article.tagColor])}>{article.tag}</span>
                    <span className="text-[11px] text-[var(--t3)]">{article.date} · {article.readTime}</span>
                  </div>
                  <div className="mb-[5px] text-[14px] font-medium leading-snug text-[var(--t1)] transition-colors group-hover:text-[var(--mint)]">{article.title}</div>
                  <div className="text-[12px] leading-relaxed text-[var(--t3)]">{article.excerpt}</div>
                </div>
                <ChevronRight size={15} className="mt-1 flex-shrink-0 text-[var(--t3)] opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            ))}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-[6px]">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="flex h-[34px] w-[34px] items-center justify-center rounded-[7px] border border-[var(--border)] bg-transparent text-[var(--t2)] transition-all hover:border-[var(--border2)] hover:text-[var(--t1)] disabled:opacity-30">
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={cn('flex h-[34px] w-[34px] items-center justify-center rounded-[7px] border text-[13px] transition-all',
                    page === p ? 'border-[rgba(80,140,255,0.3)] bg-[rgba(80,140,255,0.1)] text-[var(--blue)]'
                               : 'border-[var(--border)] bg-transparent text-[var(--t2)] hover:border-[var(--border2)] hover:text-[var(--t1)]')}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="flex h-[34px] w-[34px] items-center justify-center rounded-[7px] border border-[var(--border)] bg-transparent text-[var(--t2)] transition-all hover:border-[var(--border2)] hover:text-[var(--t1)] disabled:opacity-30">
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <aside className="flex flex-col gap-4 lg:sticky lg:top-5">
          <div className="rounded-[12px] border border-[var(--border)] bg-[var(--bg2)] p-[18px]">
            <div className="mb-[14px] text-[10px] font-medium uppercase tracking-[0.09em] text-[var(--t3)]">Other categories</div>
            {sidebarCategories.map(cat => (
              <Link key={cat.label} href={cat.href}
                className="group -mx-[10px] flex items-center justify-between rounded-[7px] px-[10px] py-[8px] transition-colors hover:bg-[var(--bg3)]">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 flex-shrink-0 rounded-full" style={{ background: cat.color }} />
                  <span className="text-[13px] text-[var(--t2)] transition-colors group-hover:text-[var(--t1)]">{cat.label}</span>
                </div>
                <span className="rounded-[4px] bg-[var(--bg3)] px-[6px] py-[1px] text-[10px] text-[var(--t3)]">{cat.count}</span>
              </Link>
            ))}
          </div>

          <div className="rounded-[12px] border border-[var(--border)] bg-[var(--bg2)] p-[18px]">
            <div className="mb-[14px] text-[10px] font-medium uppercase tracking-[0.09em] text-[var(--t3)]">Popular this week</div>
            <div className="flex flex-col">
              {popularPosts.map((post, i) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}
                  className={cn('flex items-start gap-[10px] py-[8px] transition-colors hover:text-[var(--mint)]', i < popularPosts.length - 1 && 'border-b border-[var(--border)]')}>
                  <span className="min-w-[16px] text-[13px] font-medium text-[var(--t3)]">{i + 1}</span>
                  <span className="text-[12px] leading-snug text-[var(--t2)]">{post.title}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[12px] border border-[rgba(0,229,160,0.15)] bg-[var(--bg2)] p-[18px]">
            <div className="mb-1 text-[13px] font-medium text-[var(--t1)]">Get new guides first</div>
            <div className="mb-3 text-[12px] leading-relaxed text-[var(--t2)]">Weekly gaming guides straight to your inbox. No spam.</div>
            <input type="email" placeholder="your@email.com"
              className="mb-2 w-full rounded-[7px] border border-[var(--border2)] bg-[var(--bg3)] px-3 py-[9px] text-[13px] text-[var(--t1)] outline-none placeholder:text-[var(--t3)] focus:border-[rgba(0,229,160,0.4)]" />
            <button className="w-full rounded-[7px] bg-[var(--mint)] py-[9px] text-[13px] font-medium text-[#0D0F14] transition-opacity hover:opacity-90">
              Subscribe free
            </button>
          </div>
        </aside>

      </div>
    </div>
  )
}
