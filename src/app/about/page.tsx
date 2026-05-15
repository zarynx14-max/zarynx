import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Zap,
  Shield,
  Cpu,
  LayoutGrid,
  Mail,
  Send,
  MousePointer2,
  Timer,
  Layers,
  Layout,
  PlusCircle,
} from 'lucide-react'
import { siteConfig } from '@/lib/config'

export const metadata: Metadata = {
  title: `About Us | ${siteConfig.name}`,
  description:
    'Built by gamers, for every gamer. Zarynx offers 22+ free gaming tools — no sign-ups, no paywalls. Learn our story, mission, and what drives us.',
  openGraph: {
    title: `About Us | ${siteConfig.name}`,
    description:
      'Built by gamers, for every gamer. Zarynx offers 22+ free gaming tools — no sign-ups, no paywalls.',
    url: `${siteConfig.url}/about`,
  },
}

const stats = [
  { num: '22+', label: 'Free tools',        color: 'mint'   as const },
  { num: '10',  label: 'Games covered',     color: 'orange' as const },
  { num: '0',   label: 'Accounts required', color: 'blue'   as const },
  { num: '2024',label: 'Founded',           color: 'plain'  as const },
]

const missionCards = [
  {
    icon: <Zap size={15} />,
    style: 'mint'   as const,
    title: 'Always free',
    body:  'Core tools will never go behind a paywall. We may add optional extras, but the essentials stay free forever.',
  },
  {
    icon: <Shield size={15} />,
    style: 'orange' as const,
    title: 'Privacy first',
    body:  'Tool inputs run entirely in your browser. We don\'t collect what you type, and we never sell data.',
  },
  {
    icon: <Cpu size={15} />,
    style: 'blue'   as const,
    title: 'Accurate data',
    body:  'Results are based on real benchmark data and community-sourced hardware info, updated regularly.',
  },
  {
    icon: <LayoutGrid size={15} />,
    style: 'default' as const,
    title: 'No clutter',
    body:  'Fast pages, clean UI. We cut the noise so you can get your answer and get back to gaming.',
  },
]

const timeline = [
  {
    year:  'Early 2024',
    title: 'The idea',
    body:  'Frustrated by inaccurate bottleneck checkers hidden behind ads, we built our own PC Bottleneck Calculator over a weekend.',
    color: 'mint'   as const,
  },
  {
    year:  'Mid 2024',
    title: 'First tools launched',
    body:  'Sensitivity Converter and Reaction Speed Test followed. Word spread on Reddit and Discord — we realised there was real demand.',
    color: 'orange' as const,
  },
  {
    year:  'Late 2024',
    title: 'Zarynx goes live',
    body:  'We packaged everything under one roof — tools, tier lists, and blog guides. The site launched publicly with 10 tools.',
    color: 'blue'   as const,
  },
  {
    year:  'Today',
    title: '22+ tools and growing',
    body:  'New tools ship regularly based on community requests. The goal hasn\'t changed — the fastest free gaming tools on the web.',
    color: 'gray'   as const,
  },
]

const tools = [
  { icon: <Cpu size={14} />,           style: 'mint'    as const, name: 'Bottleneck Calc',      desc: 'Check CPU/GPU balance for any game'   },
  { icon: <MousePointer2 size={14} />, style: 'orange'  as const, name: 'Sensitivity Converter', desc: 'Cross-game mouse sensitivity'          },
  { icon: <Timer size={14} />,         style: 'blue'    as const, name: 'Reaction Speed Test',   desc: 'Benchmark your reaction time'          },
  { icon: <Layers size={14} />,        style: 'default' as const, name: 'Tier Lists',            desc: 'Ranked guides for top games'           },
  { icon: <Layout size={14} />,        style: 'mint'    as const, name: 'PC Build Planner',      desc: 'Plan your next gaming rig'             },
  { icon: <PlusCircle size={14} />,    style: 'orange'  as const, name: 'More coming',           desc: 'New tools drop every month'            },
]

export default function AboutPage() {
  return (
    <div className="bg-[var(--bg)]">

      {/* ── HERO ── */}
      <div className="relative overflow-hidden border-b border-[var(--border)] px-4 pb-12 pt-10 sm:px-8">
        {/* Glows */}
        <div className="pointer-events-none absolute left-[-40px] top-[-60px] h-[240px] w-[340px] rounded-full bg-[radial-gradient(ellipse,rgba(0,229,160,0.08)_0%,transparent_70%)]" />
        <div className="pointer-events-none absolute bottom-[-80px] right-[-20px] h-[220px] w-[280px] rounded-full bg-[radial-gradient(ellipse,rgba(80,140,255,0.07)_0%,transparent_70%)]" />
        {/* Dot grid */}
        <div
          className="pointer-events-none absolute right-0 top-0 h-[170px] w-[200px]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)',
            backgroundSize: '18px 18px',
          }}
        />

        <div className="relative mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <div className="mb-5 flex items-center gap-[5px] text-[12px] text-[var(--t3)]">
            <Link href="/" className="transition-colors hover:text-[var(--t2)]">Home</Link>
            <span>›</span>
            <span className="text-[var(--t2)]">About</span>
          </div>

          {/* Badge */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-[rgba(0,229,160,0.2)] bg-[rgba(0,229,160,0.08)] px-[10px] py-[5px] text-[10px] font-medium uppercase tracking-[0.1em] text-[var(--mint)]">
            <span className="h-[5px] w-[5px] rounded-full bg-[var(--mint)]" />
            Our story
          </div>

          {/* Title */}
          <h1 className="mb-4 text-[28px] font-medium leading-[1.15] tracking-[-0.025em] text-[var(--t1)] sm:text-[36px]">
            Built by gamers,{' '}
            <em className="not-italic text-[var(--mint)]">for every gamer.</em>
          </h1>

          {/* Description */}
          <p className="mb-6 max-w-[560px] text-[14px] leading-[1.75] text-[var(--t2)]">
            Zarynx exists because free, fast, no-nonsense gaming tools shouldn&apos;t be hard to find.
            No sign-ups, no paywalls — just the tools you actually need.
          </p>

          {/* Stat pills */}
          <div className="flex flex-wrap gap-[10px]">
            {stats.map(({ num, label, color }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-[10px] border border-[var(--border2)] bg-[var(--bg2)] px-[14px] py-[9px]"
              >
                <span className={`text-[18px] font-bold ${
                  color === 'mint'   ? 'text-[var(--mint)]'   :
                  color === 'orange' ? 'text-[var(--orange)]' :
                  color === 'blue'   ? 'text-[var(--blue)]'   :
                  'text-[var(--t1)]'
                }`}>
                  {num}
                </span>
                <span className="text-[11px] text-[var(--t3)]">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl">

        {/* ── MISSION ── */}
        <PageSection label="Our mission" title={<>Gaming tools that <em className="not-italic text-[var(--mint)]">respect your time.</em></>}>
          <p className="text-[13.5px] leading-[1.8] text-[var(--t2)]">
            We started Zarynx after getting fed up with bloated gaming sites that hide tools behind
            paywalls or drown you in ads. Every tool we build is free, loads instantly, and requires
            zero account creation.
          </p>
          <div className="mt-5 grid grid-cols-1 gap-[10px] sm:grid-cols-2">
            {missionCards.map(({ icon, style, title, body }) => (
              <MissionCard key={title} icon={icon} iconStyle={style} title={title} body={body} />
            ))}
          </div>
        </PageSection>

        {/* ── TIMELINE ── */}
        <PageSection label="How we got here" title={<>A short <em className="not-italic text-[var(--orange)]">timeline.</em></>}>
          <div className="mt-6 flex flex-col">
            {timeline.map((item, i) => (
              <div key={item.year} className="flex gap-4">
                {/* Left spine */}
                <div className="flex w-10 shrink-0 flex-col items-center">
                  <div className={`mt-1 h-3 w-3 shrink-0 rounded-full ${
                    item.color === 'mint'   ? 'bg-[var(--mint)]'   :
                    item.color === 'orange' ? 'bg-[var(--orange)]' :
                    item.color === 'blue'   ? 'bg-[var(--blue)]'   :
                    'bg-[var(--t3)]'
                  }`} />
                  {i < timeline.length - 1 && (
                    <div className="mt-1 w-px flex-1 bg-[var(--border)]" />
                  )}
                </div>
                {/* Content */}
                <div className="pb-6">
                  <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--t3)]">
                    {item.year}
                  </p>
                  <p className="mb-1 text-[13px] font-medium text-[var(--t1)]">{item.title}</p>
                  <p className="text-[12px] leading-[1.65] text-[var(--t3)]">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </PageSection>

        {/* ── TOOLS ── */}
        <PageSection label="What we build" title={<>Tools for every kind of <em className="not-italic text-[var(--mint)]">gamer.</em></>}>
          <p className="text-[13.5px] leading-[1.8] text-[var(--t2)]">
            From hardware planners to in-game calculators — built for PC builders, competitive
            players, and casual gamers alike.
          </p>
          <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map(({ icon, style, name, desc }) => (
              <ToolCard key={name} icon={icon} iconStyle={style} name={name} desc={desc} />
            ))}
          </div>
          {/* Callout */}
          <div className="mt-5 flex gap-3 rounded-[10px] border border-[rgba(0,229,160,0.14)] bg-[rgba(0,229,160,0.05)] p-[13px_15px]">
            <div className="w-[3px] shrink-0 self-stretch rounded-full bg-[var(--mint)]" />
            <p className="text-[13px] leading-[1.7] text-[var(--t2)]">
              <span className="font-medium text-[var(--mint)]">Community-driven:</span>{' '}
              Most of our tools were requested directly by gamers on Reddit and Discord. Got an
              idea? We actually read suggestions.
            </p>
          </div>
        </PageSection>

        {/* ── CONTACT ── */}
        <PageSection label="Get in touch" title={<>We&apos;re real people. <em className="not-italic text-[var(--mint)]">Say hello.</em></>} last>
          <p className="text-[13.5px] leading-[1.8] text-[var(--t2)]">
            Whether it&apos;s feedback, a tool request, a bug report, or a partnership — we respond
            to everything.
          </p>
          <div className="mt-5 flex flex-col items-start justify-between gap-3 rounded-[10px] border border-[var(--border2)] bg-[var(--bg2)] p-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] border border-[rgba(0,229,160,0.18)] bg-[rgba(0,229,160,0.10)]">
                <Mail size={17} className="text-[var(--mint)]" />
              </div>
              <div>
                <p className="text-[13px] font-medium text-[var(--t1)]">General enquiries</p>
                <p className="text-[12px] text-[var(--t3)]">hello@zarynx.com · zarynx.com/contact</p>
              </div>
            </div>
            <Link
              href="/contact"
              className="flex items-center gap-[6px] rounded-[7px] bg-[var(--mint)] px-4 py-[8px] text-[12px] font-medium text-[#0D0F14] transition-opacity hover:opacity-90"
            >
              <Send size={13} />
              Send message
            </Link>
          </div>
        </PageSection>

      </div>
    </div>
  )
}

/* ── Sub-components ── */

function PageSection({
  label,
  title,
  children,
  last = false,
}: {
  label: string
  title: React.ReactNode
  children: React.ReactNode
  last?: boolean
}) {
  return (
    <div className={`px-4 py-10 sm:px-8 ${last ? '' : 'border-b border-[var(--border)]'}`}>
      <p className="mb-[10px] text-[10px] font-medium uppercase tracking-[0.1em] text-[var(--t3)]">
        {label}
      </p>
      <h2 className="mb-4 text-[20px] font-medium tracking-[-0.02em] text-[var(--t1)]">
        {title}
      </h2>
      {children}
    </div>
  )
}

type IconStyle = 'default' | 'mint' | 'orange' | 'blue'

const iconWrapStyles: Record<IconStyle, string> = {
  default: 'bg-[var(--bg3)] border-[var(--border2)] text-[var(--t3)]',
  mint:    'bg-[rgba(0,229,160,0.10)] border-[rgba(0,229,160,0.18)] text-[var(--mint)]',
  orange:  'bg-[rgba(255,120,64,0.10)] border-[rgba(255,120,64,0.18)] text-[var(--orange)]',
  blue:    'bg-[rgba(80,140,255,0.10)] border-[rgba(80,140,255,0.18)] text-[var(--blue)]',
}

function MissionCard({
  icon,
  iconStyle,
  title,
  body,
}: {
  icon: React.ReactNode
  iconStyle: IconStyle
  title: string
  body: string
}) {
  return (
    <div className="rounded-[10px] border border-[var(--border)] bg-[var(--bg2)] p-4">
      <div className={`mb-[10px] flex h-8 w-8 items-center justify-center rounded-[8px] border ${iconWrapStyles[iconStyle]}`}>
        {icon}
      </div>
      <p className="mb-[5px] text-[13px] font-medium text-[var(--t1)]">{title}</p>
      <p className="text-[12px] leading-[1.65] text-[var(--t3)]">{body}</p>
    </div>
  )
}

function ToolCard({
  icon,
  iconStyle,
  name,
  desc,
}: {
  icon: React.ReactNode
  iconStyle: IconStyle
  name: string
  desc: string
}) {
  return (
    <div className="flex items-start gap-[10px] rounded-[10px] border border-[var(--border)] bg-[var(--bg2)] p-[14px]">
      <div className={`flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[8px] border ${iconWrapStyles[iconStyle]}`}>
        {icon}
      </div>
      <div>
        <p className="mb-[3px] text-[12px] font-medium text-[var(--t1)]">{name}</p>
        <p className="text-[11px] leading-[1.5] text-[var(--t3)]">{desc}</p>
      </div>
    </div>
  )
}
