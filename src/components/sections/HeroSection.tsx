import Link from 'next/link'
import { Check } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[var(--bg)] px-4 pb-10 pt-12 sm:px-6">
      {/* Glows */}
      <div className="pointer-events-none absolute left-1/2 top-[-40px] h-[220px] w-[500px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(0,229,160,0.10)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute bottom-5 left-[-60px] h-[220px] w-[220px] rounded-full bg-[radial-gradient(ellipse,rgba(80,140,255,0.06)_0%,transparent_70%)]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">

          {/* LEFT — copy */}
          <div className="flex-1 animate-fade-up">
            {/* Pill */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[rgba(0,229,160,0.2)] bg-[rgba(0,229,160,0.08)] px-3 py-1 text-[11px] text-[var(--mint)]">
              <span className="h-[5px] w-[5px] animate-pulse-dot rounded-full bg-[var(--mint)]" />
              22 free gaming tools — no sign-up
            </div>

            {/* Headline */}
            <h1 className="mb-3 text-[28px] font-medium leading-[1.22] text-[var(--t1)] sm:text-[34px]">
              The fastest free<br />
              gaming tools<br />
              on <em className="not-italic text-[var(--mint)]">the web.</em>
            </h1>

            {/* Subtext */}
            <p className="mb-4 max-w-[360px] text-[13px] leading-[1.65] text-[var(--t2)]">
              PC bottleneck calculators, sensitivity converters, build planners
              and more — built for gamers who want answers fast.
            </p>

            {/* Checkmarks */}
            <div className="mb-6 flex flex-wrap gap-4">
              {['100% Free', 'Instant results', 'No sign-up'].map(item => (
                <div key={item} className="flex items-center gap-[5px] text-[12px] text-[var(--t2)]">
                  <span className="flex h-[14px] w-[14px] items-center justify-center rounded-full border border-[rgba(0,229,160,0.3)] bg-[rgba(0,229,160,0.15)]">
                    <Check size={8} strokeWidth={2.5} className="text-[var(--mint)]" />
                  </span>
                  {item}
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/tools/pc-bottleneck-calculator"
                className="rounded-lg bg-[var(--mint)] px-5 py-[10px] text-[13px] font-medium text-[#0D0F14] transition-opacity hover:opacity-90"
              >
                PC Bottleneck Calculator
              </Link>
              <Link
                href="/tools"
                className="rounded-lg border border-[var(--border2)] px-5 py-[10px] text-[13px] text-[var(--t2)] transition-colors hover:text-[var(--t1)]"
              >
                Browse all tools →
              </Link>
            </div>
          </div>

          {/* RIGHT — preview card */}
          <div className="animate-fade-up delay-200 w-full max-w-[240px] self-start rounded-xl border border-[var(--border)] bg-[var(--bg2)] p-4 lg:w-[240px] lg:flex-shrink-0">
            <p className="mb-2 text-[10px] uppercase tracking-[0.07em] text-[var(--t3)]">
              Live preview — Bottleneck Calc
            </p>
            <p className="mb-3 text-[12px] font-medium leading-[1.3] text-[var(--t1)]">
              RTX 4070 + Ryzen 5 7600X
            </p>

            {[
              { label: 'CPU load',   pct: 71, color: 'var(--mint)'   },
              { label: 'GPU load',   pct: 94, color: 'var(--blue)'   },
              { label: 'Bottleneck', pct:  8, color: 'var(--orange)' },
            ].map(row => (
              <div key={row.label} className="mb-2">
                <div className="mb-1 flex justify-between text-[11px] text-[var(--t3)]">
                  <span>{row.label}</span>
                  <span style={{ color: row.color }}>{row.pct}%</span>
                </div>
                <div className="h-[4px] overflow-hidden rounded-full bg-[var(--bg3)]">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${row.pct}%`, background: row.color }}
                  />
                </div>
              </div>
            ))}

            <div className="mb-3 mt-3 rounded-[7px] border border-[rgba(0,229,160,0.2)] bg-[rgba(0,229,160,0.08)] px-[10px] py-2 text-[11px] text-[var(--mint)]">
              Good match — no bottleneck detected
            </div>
            <div className="border-t border-[var(--border)] pt-2 text-center">
              <Link
                href="/tools/pc-bottleneck-calculator"
                className="text-[11px] text-[var(--mint)] hover:underline"
              >
                Try this tool →
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 flex border-t border-[var(--border)] pt-6">
          {[
            { n: '22',  l: 'Free tools'       },
            { n: '10+', l: 'Games covered'    },
            { n: '0',   l: 'Sign-up required' },
          ].map((s, i) => (
            <div
              key={s.l}
              className={`flex flex-1 flex-col items-center gap-[3px] ${i > 0 ? 'border-l border-[var(--border)]' : ''}`}
            >
              <span className="text-[22px] font-medium text-[var(--t1)]">{s.n}</span>
              <span className="text-center text-[11px] text-[var(--t3)]">{s.l}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
