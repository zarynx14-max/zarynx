'use client'

// ─── StatsStrip ────────────────────────────────────────────────────────────
export function StatsStrip() {
  const stats = [
    { n: '22',      l: 'Free tools, no paywall',  color: 'var(--mint)'   },
    { n: '10+',     l: 'Games covered',            color: 'var(--blue)'   },
    { n: '0',       l: 'Ads on tool pages',        color: 'var(--orange)' },
    { n: 'Monthly', l: 'Data updates',             color: 'var(--mint)'   },
  ]

  return (
    <div className="grid grid-cols-2 border-b border-t border-[var(--border)] bg-[var(--bg2)] sm:grid-cols-4">
      {stats.map((s, i) => (
        <div
          key={s.l}
          className={`px-4 py-[18px] text-center ${
            i % 2 === 1 ? 'border-l border-[var(--border)] sm:border-l' : ''
          } ${i >= 2 ? 'border-t border-[var(--border)] sm:border-t-0' : ''} ${
            i > 0 && i % 2 === 0 ? 'sm:border-l sm:border-[var(--border)]' : ''
          } sm:border-l sm:first:border-l-0`}
        >
          <p className="mb-[3px] text-[20px] font-medium" style={{ color: s.color }}>{s.n}</p>
          <p className="text-[11px] text-[var(--t3)]">{s.l}</p>
        </div>
      ))}
    </div>
  )
}

// ─── BlogSection ───────────────────────────────────────────────────────────
import Link from 'next/link'

const articles = [
  {
    slug:     'best-gpu-1440p-2025',
    cat:      'PC Building',
    catColor: 'var(--mint)',
    catBg:    'rgba(0,229,160,0.2)',
    title:    'Best GPU for 1440p gaming in 2025 — full breakdown and recommendations',
    read:     '8 min read',
    date:     'May 2025',
    grad:     'linear-gradient(135deg,#0a1628 0%,#0d2a40 50%,#083320 100%)',
    featured: true,
  },
  {
    slug:     'perfect-mouse-sensitivity',
    cat:      'Valorant',
    catColor: 'var(--blue)',
    catBg:    'rgba(80,140,255,0.2)',
    title:    'How to find your perfect mouse sensitivity',
    read:     '5 min read',
    date:     'Apr 2025',
    grad:     'linear-gradient(135deg,#0d1428 0%,#101840 100%)',
    featured: false,
  },
  {
    slug:     'is-game-pass-worth-it-2025',
    cat:      'Game Pass',
    catColor: 'var(--orange)',
    catBg:    'rgba(255,120,64,0.2)',
    title:    'Is Game Pass worth it in 2025? Full cost breakdown',
    read:     '6 min read',
    date:     'Apr 2025',
    grad:     'linear-gradient(135deg,#1a0e0a 0%,#2a1408 100%)',
    featured: false,
  },
]

export function BlogSection() {
  const [featured, ...rest] = articles

  return (
    <section className="border-b border-[var(--border)] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[15px] font-medium text-[var(--t1)]">Guides & articles</h2>
          <Link href="/blog" className="text-[12px] text-[var(--mint)] hover:underline">
            All articles →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {/* Featured — tall card */}
          <Link
            href={`/blog/${featured.slug}`}
            className="group overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg2)] transition-colors hover:border-[var(--border2)]"
          >
            <div
              className="relative flex h-[140px] flex-col items-start justify-end p-[14px]"
              style={{ background: featured.grad }}
            >
              <div className="absolute inset-0 bg-black/45" />
              <div className="relative z-10">
                <span
                  className="mb-[6px] inline-block rounded px-2 py-[2px] text-[10px] font-medium"
                  style={{ background: featured.catBg, color: featured.catColor }}
                >
                  {featured.cat}
                </span>
                <p className="text-[14px] font-medium leading-[1.4] text-white">
                  {featured.title}
                </p>
              </div>
            </div>
            <div className="px-[14px] py-3">
              <p className="text-[11px] text-[var(--t3)]">{featured.read} · {featured.date}</p>
              <p className="mt-1 text-[10px] text-[var(--t3)]">By Zarynx team</p>
            </div>
          </Link>

          {/* Two small cards */}
          <div className="flex flex-col gap-2">
            {rest.map(a => (
              <Link
                key={a.slug}
                href={`/blog/${a.slug}`}
                className="group flex overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg2)] transition-colors hover:border-[var(--border2)]"
              >
                <div
                  className="flex w-[80px] flex-shrink-0 items-center justify-center"
                  style={{ background: a.grad }}
                />
                <div className="p-3">
                  <p className="mb-1 text-[10px] font-medium" style={{ color: a.catColor }}>{a.cat}</p>
                  <p className="mb-1 text-[12px] font-medium leading-[1.4] text-[var(--t1)]">{a.title}</p>
                  <p className="text-[11px] text-[var(--t3)]">{a.read} · {a.date}</p>
                  <p className="mt-[2px] text-[10px] text-[var(--t3)]">By Zarynx team</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── CtaStrip ──────────────────────────────────────────────────────────────
export function CtaStrip() {
  return (
    <div className="border-b border-t border-[var(--border)] border-l-[3px] border-l-[var(--mint)] bg-[var(--bg2)] px-4 py-6 sm:px-6" style={{borderLeft:'3px solid var(--mint)'}}>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-[5px] text-[15px] font-medium text-[var(--t1)]">
            Find your PC bottleneck in 30 seconds
          </p>
          <p className="max-w-[320px] text-[12px] leading-[1.55] text-[var(--t2)]">
            Enter your CPU and GPU — get an instant score, upgrade recommendations, and build advice. Free, no sign-up.
          </p>
        </div>
        <Link
          href="/tools/pc-bottleneck-calculator"
          className="flex-shrink-0 rounded-lg bg-[var(--mint)] px-5 py-[10px] text-[13px] font-medium text-[#0D0F14] transition-opacity hover:opacity-90"
        >
          Run the calculator →
        </Link>
      </div>
    </div>
  )
}

// ─── FaqSection ────────────────────────────────────────────────────────────
import { useState } from 'react'

const faqs = [
  {
    q: 'Are all tools on Zarynx completely free?',
    a: 'Yes — every tool on Zarynx is 100% free. No sign-up, no paywall, no hidden fees. We earn through non-intrusive ads and affiliate links on recommended products.',
  },
  {
    q: 'Do I need to create an account to use the tools?',
    a: 'No account required. All tools run instantly in your browser. We do not collect personal data or require any login to use any feature.',
  },
  {
    q: 'How accurate is the PC Bottleneck Calculator?',
    a: 'Our calculator uses real benchmark data from thousands of CPU and GPU combinations, updated monthly. Results reflect typical gaming workloads at 1080p, 1440p, and 4K.',
  },
  {
    q: 'How often are tier lists and tool data updated?',
    a: 'Tier lists are updated after every major game patch. Calculator databases are refreshed monthly. Each tool card shows its last updated date so you always know how fresh the data is.',
  },
  {
    q: 'Can I suggest a new tool or game to add?',
    a: 'Absolutely. Use the Contact page to send your suggestion. We review every request and regularly add new tools based on community feedback.',
  },
]

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="border-b border-[var(--border)] bg-[var(--bg2)] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-5 text-[15px] font-medium text-[var(--t1)]">
          Frequently asked questions
        </h2>
        <div className="flex flex-col gap-[6px]">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-[10px] border border-[var(--border)] bg-[var(--bg)]"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-3 px-4 py-[14px] text-left text-[13px] font-medium text-[var(--t1)] transition-colors hover:bg-[var(--bg3)]"
              >
                {faq.q}
                <span
                  className="flex-shrink-0 text-[18px] text-[var(--t3)] transition-transform duration-200"
                  style={{
                    transform: open === i ? 'rotate(45deg)' : 'none',
                    color: open === i ? 'var(--mint)' : undefined,
                  }}
                >
                  +
                </span>
              </button>
              {open === i && (
                <p className="px-4 pb-[14px] text-[12px] leading-[1.65] text-[var(--t2)]">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── NewsletterSection ─────────────────────────────────────────────────────
import { useRef, FormEvent } from 'react'

export function NewsletterSection() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [done, setDone] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (inputRef.current?.value) setDone(true)
  }

  return (
    <section className="border-b border-[var(--border)] bg-[var(--bg)] px-4 py-7 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5">
        <div>
          <p className="mb-1 text-[14px] font-medium text-[var(--t1)]">
            Get notified when new tools drop
          </p>
          <p className="text-[12px] text-[var(--t2)]">
            No spam. One email when something new launches.
          </p>
        </div>

        {done ? (
          <p className="text-[13px] text-[var(--mint)]">You&apos;re on the list!</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="email"
                required
                placeholder="your@email.com"
                className="w-[200px] rounded-lg border border-[var(--border2)] bg-[var(--bg2)] px-[14px] py-[9px] text-[12px] text-[var(--t1)] placeholder-[var(--t3)] outline-none transition-colors focus:border-[var(--mint)]"
              />
              <button
                type="submit"
                className="rounded-lg bg-[var(--mint)] px-4 py-[9px] text-[12px] font-medium text-[#0D0F14] transition-opacity hover:opacity-90"
              >
                Notify me
              </button>
            </div>
            <p className="text-[10px] text-[var(--t3)]">
              We never share your email. Unsubscribe anytime.
            </p>
          </form>
        )}
      </div>
    </section>
  )
}
