import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Globe,
  ShieldOff,
  Mail,
  Cpu,
  LockKeyhole,
  BarChart2,
  Zap,
  Megaphone,
  Link2,
  Search,
  PenLine,
  Trash2,
  Send,
  Calendar,
  RefreshCw,
  Lock,
} from 'lucide-react'
import { siteConfig } from '@/lib/config'

export const metadata: Metadata = {
  title: `Privacy Policy | ${siteConfig.name}`,
  description:
    'Zarynx collects minimal, anonymous data. Your tool inputs never leave your browser. We never sell your data. Read our full privacy policy.',
  openGraph: {
    title: `Privacy Policy | ${siteConfig.name}`,
    description:
      'Zarynx collects minimal, anonymous data. Your tool inputs never leave your browser. We never sell your data.',
    url: `${siteConfig.url}/privacy`,
  },
}

const tocItems = [
  { num: '01', label: 'What we collect' },
  { num: '02', label: 'How we use it' },
  { num: '03', label: 'Cookies & tracking' },
  { num: '04', label: 'Third-party services' },
  { num: '05', label: 'Data storage' },
  { num: '06', label: 'Your rights' },
  { num: '07', label: "Children's privacy" },
  { num: '08', label: 'Policy changes' },
  { num: '09', label: 'Contact us' },
]

export default function PrivacyPage() {
  return (
    <div className="bg-[var(--bg)]">

      {/* ── HERO ── */}
      <div className="relative overflow-hidden border-b border-[var(--border)] px-4 pb-10 pt-10 sm:px-6">
        {/* Glows */}
        <div className="pointer-events-none absolute left-[-40px] top-[-60px] h-[220px] w-[340px] rounded-full bg-[radial-gradient(ellipse,rgba(0,229,160,0.09)_0%,transparent_70%)]" />
        <div className="pointer-events-none absolute bottom-[-80px] right-[-20px] h-[200px] w-[260px] rounded-full bg-[radial-gradient(ellipse,rgba(80,140,255,0.07)_0%,transparent_70%)]" />
        {/* Dot grid */}
        <div
          className="pointer-events-none absolute right-0 top-0 h-[150px] w-[180px]"
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
            <span className="text-[var(--t2)]">Privacy Policy</span>
          </div>

          {/* Badge */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-[rgba(0,229,160,0.2)] bg-[rgba(0,229,160,0.08)] px-[10px] py-[5px] text-[10px] font-medium uppercase tracking-[0.1em] text-[var(--mint)]">
            <span className="h-[5px] w-[5px] rounded-full bg-[var(--mint)]" />
            Legal Document
          </div>

          {/* Title */}
          <h1 className="mb-4 text-[28px] font-medium leading-[1.15] tracking-[-0.025em] text-[var(--t1)] sm:text-[34px]">
            Your privacy,{' '}
            <em className="not-italic text-[var(--mint)]">our responsibility.</em>
          </h1>

          {/* Meta pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { icon: <Calendar size={13} />, label: 'Effective Jan 1, 2025' },
              { icon: <RefreshCw size={13} />, label: 'Updated May 2025' },
              { icon: <Lock size={13} />, label: 'No account required' },
            ].map(({ icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-[6px] rounded-full border border-[var(--border)] bg-[var(--bg2)] px-3 py-[5px] text-[12px] text-[var(--t3)]"
              >
                <span className="text-[var(--t2)]">{icon}</span>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TWO-COLUMN LAYOUT ── */}
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row">

          {/* ── SIDEBAR ── */}
          <aside className="shrink-0 border-b border-[var(--border)] px-4 py-6 sm:px-6 lg:w-[220px] lg:border-b-0 lg:border-r lg:py-8">
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.1em] text-[var(--t3)]">
              On this page
            </p>

            {/* TOC — 2 cols on mobile, stacked on desktop */}
            <div className="grid grid-cols-2 gap-1 lg:flex lg:flex-col lg:gap-0">
              {tocItems.map((item, i) => (
                <div
                  key={item.num}
                  className={`flex items-center gap-2 rounded-[7px] px-[10px] py-[6px] ${
                    i === 0
                      ? 'border border-[rgba(0,229,160,0.13)] bg-[rgba(0,229,160,0.07)]'
                      : ''
                  }`}
                >
                  <span className={`min-w-[18px] text-[10px] ${i === 0 ? 'text-[var(--mint)]' : 'text-[var(--t3)]'}`}>
                    {item.num}
                  </span>
                  <span className={`text-[12px] ${i === 0 ? 'text-[var(--t1)]' : 'text-[var(--t2)]'}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Short summary — hidden on mobile */}
            <div className="mt-5 hidden rounded-[8px] border border-[rgba(0,229,160,0.12)] bg-[rgba(0,229,160,0.05)] p-3 lg:block">
              <p className="text-[11px] leading-[1.65] text-[var(--t3)]">
                <span className="font-medium text-[var(--mint)]">Short version:</span>{' '}
                Minimal data collected. Tool inputs never leave your browser. We never sell anything.
              </p>
            </div>
          </aside>

          {/* ── MAIN CONTENT ── */}
          <main className="flex-1 px-4 py-8 sm:px-8 lg:py-10">

            {/* ── 01 What we collect ── */}
            <Section num="01" title="Information we collect" sub="Minimal, anonymous, purposeful">
              <p>
                Zarynx is a free gaming tools site — no account needed, no forms to fill. We collect
                only what is necessary to keep things running and improving.
              </p>
              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <DataCard icon={<Globe size={15} />} iconStyle="default" label="Auto-collected">
                  Browser type, pages visited, country, device type, referral source
                </DataCard>
                <DataCard icon={<ShieldOff size={15} />} iconStyle="mint" label="Never collected">
                  Passwords, payment info, precise location, or any personally identifying data
                </DataCard>
                <DataCard icon={<Mail size={15} />} iconStyle="default" label="You provide (optional)">
                  Email only if you contact us — never required to use any tool
                </DataCard>
                <DataCard icon={<Cpu size={15} />} iconStyle="orange" label="Tool inputs">
                  CPU / GPU selections run in your browser only. Nothing is sent to our servers.
                </DataCard>
              </div>
            </Section>

            <Divider />

            {/* ── 02 How we use it ── */}
            <Section num="02" title="How we use your data" sub="Analytics only — no profiles, no brokers">
              <p>
                We use aggregated, anonymised analytics to understand which tools are popular and
                where to improve performance.
              </p>
              <Callout color="mint">
                <strong className="font-medium text-[var(--mint)]">Plain English:</strong> Your data
                helps us decide which gaming tools to build next and fix slow pages. We do{' '}
                <strong className="font-medium text-[var(--t1)]">not</strong> sell, rent, or trade
                your data to any third party. Ever.
              </Callout>
            </Section>

            <Divider />

            {/* ── 03 Cookies ── */}
            <Section num="03" title="Cookies & tracking" sub="Disable non-essentials anytime in your browser settings">
              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <DataCard icon={<LockKeyhole size={15} />} iconStyle="default" label="Essential">
                  Session cookies required for the site to function. Cannot be opted out.
                </DataCard>
                <DataCard icon={<BarChart2 size={15} />} iconStyle="blue" label="Analytics — Google / GTM">
                  Anonymous page-view data via Google Tag Manager (GTM-P6HX6KN6)
                </DataCard>
                <DataCard icon={<Zap size={15} />} iconStyle="mint" label="Performance — Vercel">
                  Anonymous load-time metrics to keep Zarynx fast
                </DataCard>
                <DataCard icon={<Megaphone size={15} />} iconStyle="orange" label="Advertising">
                  Contextual ads may appear. Ad partners set their own cookies per their policies.
                </DataCard>
              </div>
            </Section>

            <Divider />

            {/* ── 04 Third-party ── */}
            <Section num="04" title="Third-party services" sub="Each governs their own data practices">
              <p>
                We integrate with these services. Each has its own privacy policy — we encourage you
                to review them.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  'Google Analytics',
                  'Google Tag Manager',
                  'Vercel Analytics',
                  'Cloudflare CDN',
                  'Ad network partners',
                ].map(name => (
                  <div
                    key={name}
                    className="flex items-center gap-[6px] rounded-full border border-[var(--border)] bg-[var(--bg2)] px-3 py-[5px] text-[12px] text-[var(--t2)]"
                  >
                    <Link2 size={12} className="text-[var(--t3)]" />
                    {name}
                  </div>
                ))}
              </div>
            </Section>

            <Divider />

            {/* ── 05 Data storage ── */}
            <Section num="05" title="Data storage & retention" sub="26-month analytics window, no user databases">
              <p>
                Analytics data is retained for up to 26 months in Google Analytics, then
                auto-purged. We run no databases of user information. If you contact us via email,
                your message is kept only as long as needed to respond.
              </p>
              <Callout color="orange">
                <strong className="font-medium text-[var(--orange)]">Note:</strong> Tool inputs —
                like your CPU/GPU selections in the Bottleneck Calculator — are processed entirely in
                your browser via JavaScript. Nothing is sent to or stored on our servers.
              </Callout>
            </Section>

            <Divider />

            {/* ── 06 Your rights ── */}
            <Section num="06" title="Your rights" sub="GDPR · CCPA · and beyond">
              <p>
                Depending on your location, you may have rights including access, correction, or
                deletion of your data. Most requests are resolved simply by clearing your browser
                cookies and cache.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                <RightCard
                  icon={<Search size={15} />}
                  color="blue"
                  label="Access"
                  sub="Request what data we hold about you"
                />
                <RightCard
                  icon={<PenLine size={15} />}
                  color="mint"
                  label="Correct"
                  sub="Ask us to fix inaccurate data"
                />
                <RightCard
                  icon={<Trash2 size={15} />}
                  color="orange"
                  label="Delete"
                  sub="Request removal of your data"
                />
              </div>
              <Callout color="blue">
                Submit formal data requests via our contact form. We respond within{' '}
                <strong className="font-medium text-[var(--blue)]">30 days</strong>.
              </Callout>
            </Section>

            <Divider />

            {/* ── 07 Children ── */}
            <Section num="07" title="Children's privacy" sub="Not directed at users under 13">
              <p>
                Zarynx.com is not directed at children under 13. We don&apos;t knowingly collect data
                from minors. If you believe a child has submitted personal information, contact us
                and we&apos;ll delete it immediately.
              </p>
            </Section>

            <Divider />

            {/* ── 08 Policy changes ── */}
            <Section num="08" title="Changes to this policy" sub="We'll always tell you before reducing your rights">
              <p>
                We may update this policy from time to time. The &ldquo;Last updated&rdquo; date at
                the top of this page reflects any changes. Continued use of Zarynx after changes are
                posted constitutes acceptance. We will never reduce your rights without explicit
                notice.
              </p>
            </Section>

            <Divider />

            {/* ── 09 Contact ── */}
            <Section num="09" title="Contact us" sub="Questions? We actually respond.">
              <p>
                For privacy questions or formal data requests, reach out below. We&apos;ll get back
                to you within 30 days.
              </p>
              <div className="mt-4 flex flex-col items-start justify-between gap-3 rounded-[10px] border border-[var(--border2)] bg-[var(--bg2)] p-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] border border-[rgba(0,229,160,0.18)] bg-[rgba(0,229,160,0.10)]">
                    <Mail size={17} className="text-[var(--mint)]" />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-[var(--t1)]">Privacy enquiries</p>
                    <p className="text-[12px] text-[var(--t3)]">
                      privacy@zarynx.com · zarynx.com/contact
                    </p>
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
            </Section>

          </main>
        </div>
      </div>
    </div>
  )
}

/* ── Sub-components ── */

function Section({
  num,
  title,
  sub,
  children,
}: {
  num: string
  title: string
  sub: string
  children: React.ReactNode
}) {
  return (
    <div className="mb-9">
      {/* Header */}
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[8px] border border-[var(--border2)] bg-[var(--bg3)] text-[11px] font-medium text-[var(--t3)]">
          {num}
        </div>
        <div>
          <h2 className="text-[16px] font-medium leading-snug tracking-[-0.01em] text-[var(--t1)]">
            {title}
          </h2>
          <p className="text-[12px] text-[var(--t3)]">{sub}</p>
        </div>
      </div>

      {/* Body — indent to align with title on desktop */}
      <div className="text-[13.5px] leading-[1.8] text-[var(--t2)] sm:pl-[42px]">
        {children}
      </div>
    </div>
  )
}

type IconStyle = 'default' | 'mint' | 'orange' | 'blue'

const iconStyles: Record<IconStyle, string> = {
  default: 'bg-[var(--bg3)] border-[var(--border2)] text-[var(--t3)]',
  mint:    'bg-[rgba(0,229,160,0.10)] border-[rgba(0,229,160,0.18)] text-[var(--mint)]',
  orange:  'bg-[rgba(255,120,64,0.10)] border-[rgba(255,120,64,0.18)] text-[var(--orange)]',
  blue:    'bg-[rgba(80,140,255,0.10)] border-[rgba(80,140,255,0.18)] text-[var(--blue)]',
}

const labelStyles: Record<IconStyle, string> = {
  default: 'text-[var(--t3)]',
  mint:    'text-[var(--mint)]',
  orange:  'text-[var(--orange)]',
  blue:    'text-[var(--blue)]',
}

function DataCard({
  icon,
  iconStyle,
  label,
  children,
}: {
  icon: React.ReactNode
  iconStyle: IconStyle
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-[10px] border border-[var(--border)] bg-[var(--bg2)] p-[14px]">
      <div className="mb-[7px] flex items-center gap-2">
        <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] border ${iconStyles[iconStyle]}`}>
          {icon}
        </div>
        <span className={`text-[10px] font-medium uppercase tracking-[0.07em] ${labelStyles[iconStyle]}`}>
          {label}
        </span>
      </div>
      <p className="text-[12.5px] leading-[1.6] text-[var(--t2)]">{children}</p>
    </div>
  )
}

type CalloutColor = 'mint' | 'orange' | 'blue'

const calloutStyles: Record<CalloutColor, { wrap: string; bar: string }> = {
  mint:   { wrap: 'bg-[rgba(0,229,160,0.05)] border-[rgba(0,229,160,0.14)]',  bar: 'bg-[var(--mint)]' },
  orange: { wrap: 'bg-[rgba(255,120,64,0.05)] border-[rgba(255,120,64,0.14)]', bar: 'bg-[var(--orange)]' },
  blue:   { wrap: 'bg-[rgba(80,140,255,0.05)] border-[rgba(80,140,255,0.14)]', bar: 'bg-[var(--blue)]' },
}

function Callout({ color, children }: { color: CalloutColor; children: React.ReactNode }) {
  const s = calloutStyles[color]
  return (
    <div className={`mt-4 flex gap-3 rounded-[10px] border p-[13px_15px] ${s.wrap}`}>
      <div className={`w-[3px] shrink-0 self-stretch rounded-full ${s.bar}`} />
      <p className="text-[13px] leading-[1.7] text-[var(--t2)]">{children}</p>
    </div>
  )
}

type RightColor = 'mint' | 'orange' | 'blue'

const rightIconStyles: Record<RightColor, string> = {
  mint:   'bg-[rgba(0,229,160,0.10)] border-[rgba(0,229,160,0.18)] text-[var(--mint)]',
  orange: 'bg-[rgba(255,120,64,0.10)] border-[rgba(255,120,64,0.18)] text-[var(--orange)]',
  blue:   'bg-[rgba(80,140,255,0.10)] border-[rgba(80,140,255,0.18)] text-[var(--blue)]',
}

function RightCard({
  icon,
  color,
  label,
  sub,
}: {
  icon: React.ReactNode
  color: RightColor
  label: string
  sub: string
}) {
  return (
    <div className="rounded-[10px] border border-[var(--border)] bg-[var(--bg2)] p-[14px]">
      <div className={`mb-[9px] flex h-[30px] w-[30px] items-center justify-center rounded-[8px] border ${rightIconStyles[color]}`}>
        {icon}
      </div>
      <p className="mb-[3px] text-[12px] font-medium text-[var(--t1)]">{label}</p>
      <p className="text-[11px] leading-[1.55] text-[var(--t3)]">{sub}</p>
    </div>
  )
}

function Divider() {
  return <div className="mb-9 h-px bg-[var(--border)]" />
}
