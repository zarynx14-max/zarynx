import type { Metadata } from 'next'
import Link from 'next/link'
import { Target, Monitor, ShieldCheck, Mail } from 'lucide-react'
import { siteConfig } from '@/lib/config'
import { AdvertiseForm } from './AdvertiseForm'

export const metadata: Metadata = {
  title: `Advertise | ${siteConfig.name}`,
  description:
    'Reach gamers who are about to upgrade. Advertise on Zarynx with homepage banners, guide placements, game hub sponsorships and sponsored product picks.',
  openGraph: {
    title: `Advertise | ${siteConfig.name}`,
    description:
      'Reach gamers who are about to upgrade. Advertise on Zarynx — free gaming tools used by gamers comparing hardware and settings.',
    url: `${siteConfig.url}/advertise`,
  },
}

/* ─────────────────────────────────────────────────────────────
   TODO BEFORE LAUNCH — replace every [PLACEHOLDER] below with
   real numbers from your analytics and your own pricing.
   ───────────────────────────────────────────────────────────── */
const audience = [
  { label: 'Desktop traffic',        value: '[00%]',     pct: 60, color: 'var(--mint)'   },
  { label: 'Aged 18–34',             value: '[00%]',     pct: 70, color: 'var(--blue)'   },
  { label: 'Top country: [COUNTRY]', value: '[00%]',     pct: 45, color: 'var(--orange)' },
]
const analyticsNote = 'Figures from [ANALYTICS SOURCE], [MONTH YEAR]'

const stats = [
  { n: '[00K]', l: 'Monthly visitors',  color: 'var(--mint)'   },
  { n: '[00K]', l: 'Monthly tool uses', color: 'var(--blue)'   },
  { n: String(siteConfig.toolCount), l: 'Free tools', color: 'var(--orange)' },
  { n: `${siteConfig.gameCount}+`,    l: 'Games covered', color: 'var(--t1)' },
]

const packages = [
  {
    name: 'Starter', price: '[$ PRICE]', blurb: 'Test the audience.', color: 'var(--t2)', featured: false,
    cta: 'Choose Starter',
    items: ['1 blog sidebar placement', '[IMPRESSIONS] impressions', 'Monthly performance report'],
  },
  {
    name: 'Growth', price: '[$ PRICE]', blurb: 'Be seen across the site.', color: 'var(--mint)', featured: true,
    cta: 'Choose Growth',
    items: ['Homepage banner', 'Blog sidebar + inline', '[IMPRESSIONS] impressions', 'Click and CTR report'],
  },
  {
    name: 'Game takeover', price: '[$ PRICE]', blurb: 'Own a game audience.', color: 'var(--t2)', featured: false,
    cta: 'Talk to us',
    items: ['Exclusive game hub sponsor', 'Sponsored product pick', 'Custom campaign support'],
  },
]
/* ───────────────────────────────────────────────────────────── */

const why = [
  { icon: <Target size={16} />,      style: 'mint',   title: 'High purchase intent',        body: 'Bottleneck checks, build planners and tier lists attract visitors who are actively comparing products.' },
  { icon: <Monitor size={16} />,     style: 'orange', title: 'Hardware and peripherals fit', body: 'Ideal for GPUs, CPUs, mice, keyboards, monitors, headsets, games and gaming services.' },
  { icon: <ShieldCheck size={16} />, style: 'blue',   title: 'Clean and trusted',           body: 'No ads on tool pages, clearly labelled placements and a fast site. Your brand is never buried in clutter.' },
] as const

const iconStyles = {
  mint:   'bg-[rgba(0,229,160,0.10)] border-[rgba(0,229,160,0.2)] text-[var(--mint)]',
  orange: 'bg-[rgba(255,120,64,0.10)] border-[rgba(255,120,64,0.2)] text-[var(--orange)]',
  blue:   'bg-[rgba(80,140,255,0.10)] border-[rgba(80,140,255,0.2)] text-[var(--blue)]',
}

const steps = [
  { n: '01', color: 'var(--mint)',   title: 'Tell us your goal',     body: 'Send your product, budget and target games using the form below.' },
  { n: '02', color: 'var(--blue)',   title: 'We confirm the plan',   body: 'We reply within [48 HOURS] with placements, dates and a quote.' },
  { n: '03', color: 'var(--orange)', title: 'Launch and report',     body: 'Your ad goes live and you get a performance report each month.' },
]

const standards = [
  'Every ad is labelled Ad or Sponsored',
  'No ads on tool pages',
  'We never sell visitor data',
  'We may decline unsuitable ads',
]

function Bar({ w = '100%' }: { w?: string }) {
  return <div className="h-[7px] rounded-[4px] bg-[var(--bg3)]" style={{ width: w }} />
}

function Slot({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex items-center justify-center rounded-[6px] border border-dashed border-[var(--mint)] bg-[rgba(0,229,160,0.08)] text-[10px] text-[var(--mint)] ${className}`}>
      {children}
    </div>
  )
}

function Preview({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[120px] flex-col gap-[6px] rounded-[8px] border border-[var(--border)] bg-[var(--bg)] p-[10px]" aria-hidden="true">
      {children}
    </div>
  )
}

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="rounded-[5px] border border-[var(--border2)] px-2 py-[3px] text-[10px] text-[var(--t2)]">{children}</span>
}

function Eyebrow({ color, children }: { color: string; children: React.ReactNode }) {
  return <p className="mb-[10px] text-[10px] font-medium uppercase tracking-[0.1em]" style={{ color }}>{children}</p>
}

function Dot() {
  return <span className="absolute left-[2px] top-[6px] h-[6px] w-[6px] rounded-full bg-[var(--mint)]" />
}

export default function AdvertisePage() {
  return (
    <div className="bg-[var(--bg)]">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden px-4 pb-14 pt-12 sm:px-6">
        <div className="pointer-events-none absolute left-1/2 top-[-60px] h-[240px] w-[560px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(0,229,160,0.10)_0%,transparent_70%)]" />
        <div
          className="pointer-events-none absolute right-0 top-0 h-[150px] w-[180px]"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)', backgroundSize: '18px 18px' }}
        />
        <div className="relative mx-auto flex max-w-[1120px] flex-col gap-10 lg:flex-row lg:items-center">
          <div className="flex-1 animate-fade-up">
            <div className="mb-5 flex items-center gap-[5px] text-[12px] text-[var(--t2)]">
              <Link href="/" className="transition-colors hover:text-[var(--t1)]">Home</Link>
              <span>›</span>
              <span>Advertise</span>
            </div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[rgba(0,229,160,0.2)] bg-[rgba(0,229,160,0.08)] px-3 py-1 text-[11px] text-[var(--mint)]">
              <span className="h-[5px] w-[5px] animate-pulse-dot rounded-full bg-[var(--mint)]" />
              Advertise on Zarynx
            </div>
            <h1 className="mb-[14px] text-[28px] font-medium leading-[1.15] tracking-[-0.025em] text-[var(--t1)] sm:text-[38px]">
              Reach gamers who are<br />
              about to <em className="not-italic text-[var(--mint)]">upgrade.</em>
            </h1>
            <p className="mb-6 max-w-[560px] text-[13.5px] leading-[1.7] text-[var(--t2)]">
              Our visitors come to compare hardware, tune their settings and plan their next build.
              Put your product in front of them at the moment they are deciding.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#contact" className="rounded-lg bg-[var(--mint)] px-5 py-[11px] text-[13px] font-medium text-[#0D0F14] transition-opacity hover:opacity-90">
                Request media kit
              </a>
              <a href="#placements" className="rounded-lg border border-[var(--border2)] px-5 py-[11px] text-[13px] text-[var(--t2)] transition-colors hover:text-[var(--t1)]">
                See placements →
              </a>
            </div>
          </div>

          <div className="animate-fade-up delay-200 w-full rounded-xl border border-[var(--border)] bg-[var(--bg2)] p-5 lg:w-[300px] lg:flex-shrink-0">
            <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.1em] text-[var(--t2)]">Audience snapshot</p>
            {audience.map(a => (
              <div key={a.label} className="mb-4">
                <div className="mb-[6px] flex justify-between text-[12px] text-[var(--t2)]">
                  <span>{a.label}</span>
                  <span style={{ color: a.color }}>{a.value}</span>
                </div>
                <div className="h-[4px] overflow-hidden rounded-full bg-[var(--bg3)]">
                  <div className="h-full rounded-full" style={{ width: `${a.pct}%`, background: a.color }} />
                </div>
              </div>
            ))}
            <p className="border-t border-[var(--border)] pt-[10px] text-[11px] text-[var(--t2)]">{analyticsNote}</p>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="border-b border-t border-[var(--border)] bg-[var(--bg2)]">
        <div className="mx-auto grid max-w-[1120px] grid-cols-2 sm:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.l} className={`px-4 py-5 text-center ${i > 0 ? 'sm:border-l sm:border-[var(--border)]' : ''} ${i % 2 === 1 ? 'border-l border-[var(--border)] sm:border-l' : ''}`}>
              <p className="text-[22px] font-medium" style={{ color: s.color }}>{s.n}</p>
              <p className="text-[11px] text-[var(--t2)]">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── WHY ── */}
      <section className="px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-[1120px]">
          <Eyebrow color="var(--mint)">Why Zarynx</Eyebrow>
          <h2 className="mb-[10px] text-[24px] font-medium leading-[1.2] tracking-[-0.02em] text-[var(--t1)]">An audience that is ready to buy</h2>
          <p className="max-w-[560px] text-[13.5px] leading-[1.7] text-[var(--t2)]">
            People use our calculators and guides to make real decisions about GPUs, CPUs, mice and monitors,
            so your message lands next to the exact choice they are making.
          </p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {why.map(w => (
              <div key={w.title} className="rounded-xl border border-[var(--border)] bg-[var(--bg2)] p-5">
                <div className={`flex h-[34px] w-[34px] items-center justify-center rounded-[8px] border ${iconStyles[w.style]}`}>{w.icon}</div>
                <p className="mb-[6px] mt-3 text-[14px] font-medium text-[var(--t1)]">{w.title}</p>
                <p className="text-[12.5px] leading-[1.65] text-[var(--t2)]">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLACEMENTS ── */}
      <section id="placements" className="scroll-mt-16 border-t border-[var(--border)] px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-[1120px]">
          <Eyebrow color="var(--blue)">Placements</Eyebrow>
          <h2 className="mb-[10px] text-[24px] font-medium leading-[1.2] tracking-[-0.02em] text-[var(--t1)]">Where your ad appears</h2>
          <p className="max-w-[560px] text-[13.5px] leading-[1.7] text-[var(--t2)]">
            Four formats across our content pages. Tool pages stay ad-free so results load fast and stay trustworthy.
          </p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg2)] p-5">
              <Preview><Bar w="40%" /><Slot className="h-[30px]">Your banner</Slot><Bar w="80%" /><Bar w="60%" /></Preview>
              <p className="mb-[6px] mt-3 text-[14px] font-medium text-[var(--t1)]">Homepage banner</p>
              <p className="text-[12.5px] leading-[1.65] text-[var(--t2)]">Top-of-page spot seen by every visitor who lands on Zarynx.</p>
              <div className="mt-3 flex flex-wrap gap-[6px]"><Tag>Monthly slot</Tag><Tag>[LIMIT] advertiser</Tag></div>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg2)] p-5">
              <Preview>
                <Bar w="70%" />
                <div className="flex flex-1 gap-2">
                  <div className="flex flex-1 flex-col gap-[6px]"><Bar /><Bar w="85%" /><Bar /></div>
                  <Slot className="w-[34%]">Ad</Slot>
                </div>
              </Preview>
              <p className="mb-[6px] mt-3 text-[14px] font-medium text-[var(--t1)]">Blog and guide sidebar</p>
              <p className="text-[12.5px] leading-[1.65] text-[var(--t2)]">Native placements inside PC building and game guides.</p>
              <div className="mt-3 flex flex-wrap gap-[6px]"><Tag>Monthly slot</Tag><Tag>Sidebar + inline</Tag></div>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg2)] p-5">
              <Preview>
                <div className="flex justify-between"><Bar w="30%" /><Slot className="h-[16px] w-[38%]">Presented by</Slot></div>
                <Bar /><Bar w="75%" /><Bar w="55%" />
              </Preview>
              <p className="mb-[6px] mt-3 text-[14px] font-medium text-[var(--t1)]">Tier list and game hub sponsor</p>
              <p className="text-[12.5px] leading-[1.65] text-[var(--t2)]">Own a game hub such as Valorant or CS2 with a sponsor badge.</p>
              <div className="mt-3 flex flex-wrap gap-[6px]"><Tag>Exclusive per game</Tag></div>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg2)] p-5">
              <Preview><Bar w="50%" /><Slot className="h-[38px]">Sponsored pick</Slot><Bar w="70%" /></Preview>
              <p className="mb-[6px] mt-3 text-[14px] font-medium text-[var(--t1)]">Sponsored product pick</p>
              <p className="text-[12.5px] leading-[1.65] text-[var(--t2)]">A labelled product recommendation in our upgrade and build lists.</p>
              <div className="mt-3 flex flex-wrap gap-[6px]"><Tag>Labelled Sponsored</Tag></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PACKAGES ── */}
      <section className="border-t border-[var(--border)] px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-[1120px]">
          <Eyebrow color="var(--orange)">Packages</Eyebrow>
          <h2 className="mb-[10px] text-[24px] font-medium leading-[1.2] tracking-[-0.02em] text-[var(--t1)]">Pick a starting point</h2>
          <p className="max-w-[560px] text-[13.5px] leading-[1.7] text-[var(--t2)]">
            Every package is monthly and can be tailored. Prices are shown after we discuss your goals.
          </p>
          <div className="mt-7 grid gap-3 md:grid-cols-3">
            {packages.map(p => (
              <div
                key={p.name}
                className={`flex flex-col rounded-xl border p-5 ${p.featured ? 'border-[rgba(0,229,160,0.35)] bg-[linear-gradient(180deg,rgba(0,229,160,0.06),var(--bg2)_60%)]' : 'border-[var(--border)] bg-[var(--bg2)]'}`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-medium uppercase tracking-[0.1em]" style={{ color: p.color }}>{p.name}</p>
                  {p.featured && <span className="rounded-[5px] bg-[var(--mint)] px-2 py-[3px] text-[10px] font-medium text-[#0D0F14]">Most popular</span>}
                </div>
                <p className="mb-1 mt-[10px] text-[26px] font-medium text-[var(--t1)]">
                  {p.price}<span className="text-[12px] font-normal text-[var(--t2)]"> /month</span>
                </p>
                <p className="mb-4 text-[12.5px] text-[var(--t2)]">{p.blurb}</p>
                <ul className="mb-5 flex-1">
                  {p.items.map(it => (
                    <li key={it} className="relative mb-2 pl-[18px] text-[12.5px] leading-[1.5] text-[var(--t2)]"><Dot />{it}</li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className={`block rounded-lg py-[11px] text-center text-[13px] transition-opacity hover:opacity-90 ${p.featured ? 'bg-[var(--mint)] font-medium text-[#0D0F14]' : 'border border-[var(--border2)] text-[var(--t2)] hover:text-[var(--t1)]'}`}
                >
                  {p.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="border-t border-[var(--border)] px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-[1120px]">
          <Eyebrow color="var(--mint)">How it works</Eyebrow>
          <h2 className="mb-[10px] text-[24px] font-medium leading-[1.2] tracking-[-0.02em] text-[var(--t1)]">Live in three steps</h2>
          <div className="mt-7 grid gap-3 md:grid-cols-3">
            {steps.map(s => (
              <div key={s.n} className="rounded-xl border border-[var(--border)] bg-[var(--bg2)] p-5">
                <p className="text-[12px] font-medium" style={{ color: s.color }}>{s.n}</p>
                <p className="mb-[6px] mt-[6px] text-[14px] font-medium text-[var(--t1)]">{s.title}</p>
                <p className="text-[12.5px] leading-[1.65] text-[var(--t2)]">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT FORM ── */}
      <section id="contact" className="scroll-mt-16 border-t border-[var(--border)] px-4 py-14 sm:px-6">
        <div className="mx-auto flex max-w-[1120px] flex-col gap-10 lg:flex-row">
          <div className="flex-1">
            <Eyebrow color="var(--mint)">Get started</Eyebrow>
            <h2 className="mb-[10px] text-[24px] font-medium leading-[1.2] tracking-[-0.02em] text-[var(--t1)]">Request our media kit</h2>
            <p className="mb-6 max-w-[560px] text-[13.5px] leading-[1.7] text-[var(--t2)]">
              Tell us a little about your campaign and we will send rates and availability.
            </p>
            <AdvertiseForm />
          </div>

          <aside className="flex w-full flex-col gap-3 lg:w-[320px] lg:shrink-0">
            <div className="flex gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg2)] p-5">
              <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[8px] border border-[rgba(0,229,160,0.2)] bg-[rgba(0,229,160,0.10)] text-[var(--mint)]">
                <Mail size={16} />
              </div>
              <div>
                <p className="mb-[3px] text-[12px] font-medium text-[var(--t1)]">Prefer email?</p>
                <p className="text-[12.5px] text-[var(--t2)]">partners@zarynx.com</p>
              </div>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg2)] p-5">
              <p className="mb-2 text-[12px] font-medium text-[var(--t1)]">Our ad standards</p>
              <ul>
                {standards.map(s => (
                  <li key={s} className="relative mb-2 pl-[18px] text-[12.5px] leading-[1.5] text-[var(--t2)]"><Dot />{s}</li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

    </div>
  )
}
