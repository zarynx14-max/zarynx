import type { Metadata } from 'next'
import Link from 'next/link'
import {
  CheckCircle2,
  AlertTriangle,
  Cpu,
  RefreshCw,
  Bot,
  ServerCrash,
  ShieldX,
  CopyX,
  Ban,
  ShieldCheck,
  Send,
  Calendar,
  FileText,
} from 'lucide-react'
import { siteConfig } from '@/lib/config'

export const metadata: Metadata = {
  title: `Terms of Service | ${siteConfig.name}`,
  description:
    'Fair rules, plain language. Read the Zarynx Terms of Service to understand how to use our free gaming tools responsibly.',
  openGraph: {
    title: `Terms of Service | ${siteConfig.name}`,
    description:
      'Fair rules, plain language. Read the Zarynx Terms of Service to understand how to use our free gaming tools responsibly.',
    url: `${siteConfig.url}/terms`,
  },
}

const tocItems = [
  { num: '01', label: 'Acceptance of terms' },
  { num: '02', label: 'Use of tools' },
  { num: '03', label: "What's free" },
  { num: '04', label: 'Prohibited conduct' },
  { num: '05', label: 'Intellectual property' },
  { num: '06', label: 'Disclaimers' },
  { num: '07', label: 'Limitation of liability' },
  { num: '08', label: 'Third-party links' },
  { num: '09', label: 'Changes to terms' },
  { num: '10', label: 'Contact us' },
]

export default function TermsPage() {
  return (
    <div className="bg-[var(--bg)]">

      {/* ── HERO ── */}
      <div className="relative overflow-hidden border-b border-[var(--border)] px-4 pb-10 pt-10 sm:px-6">
        {/* Glows */}
        <div className="pointer-events-none absolute left-[-40px] top-[-60px] h-[220px] w-[320px] rounded-full bg-[radial-gradient(ellipse,rgba(255,120,64,0.08)_0%,transparent_70%)]" />
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
            <span className="text-[var(--t2)]">Terms of Service</span>
          </div>

          {/* Badge */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-[rgba(255,120,64,0.2)] bg-[rgba(255,120,64,0.08)] px-[10px] py-[5px] text-[10px] font-medium uppercase tracking-[0.1em] text-[var(--orange)]">
            <span className="h-[5px] w-[5px] rounded-full bg-[var(--orange)]" />
            Legal Document
          </div>

          {/* Title */}
          <h1 className="mb-4 text-[28px] font-medium leading-[1.15] tracking-[-0.025em] text-[var(--t1)] sm:text-[34px]">
            Fair rules,{' '}
            <em className="not-italic text-[var(--orange)]">plain language.</em>
          </h1>

          {/* Meta pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { icon: <Calendar size={13} />, label: 'Effective Jan 1, 2025' },
              { icon: <RefreshCw size={13} />, label: 'Updated May 2025' },
              { icon: <FileText size={13} />, label: 'Applies to zarynx.com' },
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
                      ? 'border border-[rgba(255,120,64,0.13)] bg-[rgba(255,120,64,0.07)]'
                      : ''
                  }`}
                >
                  <span className={`min-w-[18px] text-[10px] ${i === 0 ? 'text-[var(--orange)]' : 'text-[var(--t3)]'}`}>
                    {item.num}
                  </span>
                  <span className={`text-[12px] ${i === 0 ? 'text-[var(--t1)]' : 'text-[var(--t2)]'}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Short summary — hidden on mobile */}
            <div className="mt-5 hidden rounded-[8px] border border-[rgba(255,120,64,0.12)] bg-[rgba(255,120,64,0.05)] p-3 lg:block">
              <p className="text-[11px] leading-[1.65] text-[var(--t3)]">
                <span className="font-medium text-[var(--orange)]">Short version:</span>{' '}
                Use the tools fairly, don&apos;t abuse the site, and understand results are for reference only — not professional advice.
              </p>
            </div>
          </aside>

          {/* ── MAIN CONTENT ── */}
          <main className="flex-1 px-4 py-8 sm:px-8 lg:py-10">

            {/* ── 01 Acceptance ── */}
            <Section num="01" title="Acceptance of terms" sub="By using Zarynx, you agree to these terms">
              <p>
                By accessing or using zarynx.com, you agree to be bound by these Terms of Service.
                If you do not agree, please do not use the site. These terms apply to all visitors,
                users, and anyone who accesses any part of Zarynx.
              </p>
              <p className="mt-[9px]">
                You must be at least 13 years old to use this site. By using Zarynx, you represent
                that you meet this requirement.
              </p>
              <Callout color="orange">
                <strong className="font-medium text-[var(--orange)]">Plain English:</strong> Using
                the site means you&apos;ve read and accepted these rules. It&apos;s that simple.
              </Callout>
            </Section>

            <Divider />

            {/* ── 02 Use of tools ── */}
            <Section num="02" title="Use of tools" sub="Results are estimates — not professional advice">
              <p>
                All tools on Zarynx — including the PC Bottleneck Calculator, Sensitivity Converter,
                Reaction Speed Test, and others — are provided for informational and entertainment
                purposes only.
              </p>
              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <DataCard icon={<CheckCircle2 size={15} />} iconStyle="mint" label="Intended use">
                  Personal gaming reference, learning, and entertainment. Results help you make
                  informed decisions.
                </DataCard>
                <DataCard icon={<AlertTriangle size={15} />} iconStyle="orange" label="Not intended for">
                  Professional hardware procurement, commercial system specifications, or engineering
                  decisions.
                </DataCard>
                <DataCard icon={<Cpu size={15} />} iconStyle="blue" label="Tool accuracy">
                  Calculations are based on aggregated data and community benchmarks — real-world
                  results may vary.
                </DataCard>
                <DataCard icon={<RefreshCw size={15} />} iconStyle="default" label="Updates">
                  Tool data is updated regularly but may not reflect the latest hardware releases at
                  all times.
                </DataCard>
              </div>
            </Section>

            <Divider />

            {/* ── 03 What's free ── */}
            <Section num="03" title="What's free — and what that means" sub="No payment, no account, no catch">
              <p>
                All tools on Zarynx are free to use. We reserve the right to introduce optional
                premium features in the future, but core gaming tools will always remain free.
              </p>
              <Callout color="mint">
                <strong className="font-medium text-[var(--mint)]">Our commitment:</strong> The PC
                Bottleneck Calculator, Sensitivity Converter, Reaction Speed Test, and all current
                tools will always be free. We may display ads to keep the lights on.
              </Callout>
            </Section>

            <Divider />

            {/* ── 04 Prohibited conduct ── */}
            <Section num="04" title="Prohibited conduct" sub="Don't abuse the platform">
              <p>When using Zarynx, you agree not to engage in any of the following:</p>
              <div className="mt-4 flex flex-col gap-[6px]">
                <RuleRow icon={<Bot size={14} />} color="red">
                  <strong className="font-medium text-[var(--t1)]">Automated scraping or crawling</strong>{' '}
                  — Do not use bots, scrapers, or automated tools to extract data from Zarynx at scale.
                </RuleRow>
                <RuleRow icon={<ServerCrash size={14} />} color="red">
                  <strong className="font-medium text-[var(--t1)]">Overloading the service</strong>{' '}
                  — Do not send excessive requests that could degrade performance for other users.
                </RuleRow>
                <RuleRow icon={<ShieldX size={14} />} color="red">
                  <strong className="font-medium text-[var(--t1)]">Circumventing security</strong>{' '}
                  — Do not attempt to bypass, disable, or interfere with any security features of the site.
                </RuleRow>
                <RuleRow icon={<CopyX size={14} />} color="red">
                  <strong className="font-medium text-[var(--t1)]">Copying our tools</strong>{' '}
                  — Do not reproduce, clone, or redistribute Zarynx tools or content without written permission.
                </RuleRow>
                <RuleRow icon={<Ban size={14} />} color="red">
                  <strong className="font-medium text-[var(--t1)]">Illegal use</strong>{' '}
                  — Do not use Zarynx for any purpose that violates applicable local, national, or international laws.
                </RuleRow>
              </div>
            </Section>

            <Divider />

            {/* ── 05 Intellectual property ── */}
            <Section num="05" title="Intellectual property" sub="Our content, our tools, our brand">
              <p>
                All content on Zarynx — including tool designs, code, graphics, text, blog posts, and
                the Zarynx name and logo — is owned by or licensed to Zarynx and protected by
                applicable intellectual property laws.
              </p>
              <p className="mt-[9px]">
                You may share links to Zarynx tools and content. You may not reproduce, republish, or
                build competing products from our work without explicit written permission.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  'Tool UI & logic',
                  'Blog content',
                  'Zarynx name & logo',
                  'Graphics & design',
                ].map(name => (
                  <div
                    key={name}
                    className="flex items-center gap-[6px] rounded-full border border-[var(--border)] bg-[var(--bg2)] px-3 py-[5px] text-[12px] text-[var(--t2)]"
                  >
                    <ShieldCheck size={12} className="text-[var(--t3)]" />
                    {name}
                  </div>
                ))}
              </div>
            </Section>

            <Divider />

            {/* ── 06 Disclaimers ── */}
            <Section num="06" title="Disclaimers" sub="Provided as-is, without warranty">
              <p>
                Zarynx is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without any
                warranties, express or implied. We do not guarantee that the site will be
                uninterrupted, error-free, or that results will be accurate for every hardware
                configuration.
              </p>
              <Callout color="orange">
                <strong className="font-medium text-[var(--orange)]">Plain English:</strong> Tool
                results are estimates. Always cross-reference with professional benchmarks before
                making significant hardware purchases.
              </Callout>
            </Section>

            <Divider />

            {/* ── 07 Limitation of liability ── */}
            <Section num="07" title="Limitation of liability" sub="Our liability is limited to the maximum extent permitted by law">
              <p>
                To the fullest extent permitted by law, Zarynx and its team shall not be liable for
                any indirect, incidental, special, or consequential damages arising from your use of
                the site or reliance on tool results — including but not limited to hardware
                purchasing decisions made based on our calculators.
              </p>
              <Callout color="blue">
                In jurisdictions that do not allow limitation of liability for certain damages, our
                liability is limited to the maximum extent permitted. If you&apos;re in the EU or a
                jurisdiction with stronger consumer protections, those rights are not affected by
                this clause.
              </Callout>
            </Section>

            <Divider />

            {/* ── 08 Third-party ── */}
            <Section num="08" title="Third-party links & content" sub="We don't control external sites">
              <p>
                Zarynx may contain links to external websites, affiliate links, or third-party
                content. We are not responsible for the content, privacy practices, or accuracy of
                any third-party sites.
              </p>
              <p className="mt-[9px]">
                Some links may be affiliate links — we may earn a small commission if you purchase
                through them, at no extra cost to you. This never influences our tool results or
                editorial content.
              </p>
            </Section>

            <Divider />

            {/* ── 09 Changes ── */}
            <Section num="09" title="Changes to these terms" sub="We'll update the date when anything changes">
              <p>
                We may revise these terms at any time. The updated version will be posted on this
                page with a new &ldquo;Last updated&rdquo; date. Continued use of Zarynx after
                changes are posted means you accept the revised terms. We will not remove rights
                granted to you without clear notice.
              </p>
            </Section>

            <Divider />

            {/* ── 10 Contact ── */}
            <Section num="10" title="Contact us" sub="Questions about these terms? Reach out.">
              <p>
                If you have questions about these Terms of Service or believe someone is violating
                them, please get in touch.
              </p>
              <div className="mt-4 flex flex-col items-start justify-between gap-3 rounded-[10px] border border-[var(--border2)] bg-[var(--bg2)] p-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] border border-[rgba(255,120,64,0.18)] bg-[rgba(255,120,64,0.10)]">
                    <FileText size={17} className="text-[var(--orange)]" />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-[var(--t1)]">Legal &amp; terms enquiries</p>
                    <p className="text-[12px] text-[var(--t3)]">
                      legal@zarynx.com · zarynx.com/contact
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

function RuleRow({
  icon,
  color,
  children,
}: {
  icon: React.ReactNode
  color: 'red'
  children: React.ReactNode
}) {
  const styles = {
    red: {
      wrap: 'bg-[rgba(239,68,68,0.10)] border-[rgba(239,68,68,0.18)] text-[#EF4444]',
    },
  }
  return (
    <div className="flex items-start gap-[10px] rounded-[9px] border border-[var(--border)] bg-[var(--bg2)] px-[13px] py-[11px]">
      <div className={`flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[6px] border ${styles[color].wrap}`}>
        {icon}
      </div>
      <p className="text-[13px] leading-[1.6] text-[var(--t2)]">{children}</p>
    </div>
  )
}

function Divider() {
  return <div className="mb-9 h-px bg-[var(--border)]" />
}
