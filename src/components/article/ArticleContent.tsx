import { cn } from '@/lib/utils'

/* ── SECTION HEADING ─────────────────────────────────────── */
export function ArticleSectionHeading({
  id,
  children,
}: {
  id?: string
  children: React.ReactNode
}) {
  return (
    <h2
      id={id}
      className="mb-[10px] mt-5 border-b border-[var(--border)] pb-2 text-[15px] font-medium text-[var(--t1)] first:mt-0"
    >
      {children}
    </h2>
  )
}

/* ── PROSE PARAGRAPH ─────────────────────────────────────── */
export function ArticleProse({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-[14px] text-[13px] leading-[1.7] text-[var(--t2)]">
      {children}
    </p>
  )
}

/* ── CALLOUT ─────────────────────────────────────────────── */
interface CalloutProps {
  variant?: 'default' | 'warn'
  label: string
  children: React.ReactNode
}

export function ArticleCallout({ variant = 'default', label, children }: CalloutProps) {
  const isWarn = variant === 'warn'
  return (
    <div
      className={cn(
        'my-[14px] rounded-r-[8px] border border-l-2 px-[14px] py-3 text-[12px] leading-[1.6] text-[var(--t2)]',
        isWarn
          ? 'border-[rgba(255,120,64,0.15)] border-l-[var(--orange)] bg-[rgba(255,120,64,0.05)]'
          : 'border-[rgba(0,229,160,0.15)] border-l-[var(--mint)] bg-[rgba(0,229,160,0.05)]'
      )}
    >
      <span
        className={cn(
          'font-medium',
          isWarn ? 'text-[var(--orange)]' : 'text-[var(--mint)]'
        )}
      >
        {label}:{' '}
      </span>
      {children}
    </div>
  )
}

/* ── TOOL CTA ────────────────────────────────────────────── */
interface ToolCtaProps {
  icon: React.ReactNode
  title: string
  description: string
  cta: string
  href?: string
}

export function ArticleToolCta({ icon, title, description, cta, href = '#' }: ToolCtaProps) {
  return (
    <div className="my-4 flex flex-wrap items-center gap-3 rounded-[10px] border border-[rgba(0,229,160,0.2)] bg-[var(--bg2)] p-[14px]">
      <div className="flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-[9px] bg-[rgba(0,229,160,0.1)] text-[var(--mint)]">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="mb-[2px] text-[13px] font-medium text-[var(--t1)]">{title}</p>
        <p className="text-[11px] text-[var(--t2)]">{description}</p>
      </div>
      <a
        href={href}
        className="flex-shrink-0 rounded-[7px] bg-[var(--mint)] px-[13px] py-[7px] text-[11px] font-medium text-[#0D0F14] transition-opacity hover:opacity-90 sm:w-auto w-full text-center"
      >
        {cta}
      </a>
    </div>
  )
}

/* ── COMPARISON TABLE ────────────────────────────────────── */
export interface CompRow {
  name: string
  fps: string
  fpsGood?: boolean
  vram: string
  price: string
  verdict: string
  verdictGood?: boolean
  verdictBad?: boolean
}

interface CompTableProps {
  headers: string[]
  rows: CompRow[]
}

export function ArticleCompTable({ rows }: CompTableProps) {
  return (
    <div className="my-[14px] overflow-hidden rounded-[8px] border border-[var(--border)] text-[12px]">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--bg2)]">
            {['GPU', 'Avg FPS', 'VRAM', 'Price', 'Verdict'].map((h) => (
              <th
                key={h}
                className="px-3 py-2 text-left text-[10px] font-medium uppercase tracking-[0.06em] text-[var(--t2)]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-[var(--border)] transition-colors last:border-0 hover:bg-[var(--bg3)]"
            >
              <td className="px-3 py-[9px] font-medium text-[var(--t1)]">{row.name}</td>
              <td className={cn('px-3 py-[9px]', row.fpsGood ? 'text-[var(--mint)]' : 'text-[var(--t2)]')}>
                {row.fps}
              </td>
              <td className="px-3 py-[9px] text-[var(--t2)]">{row.vram}</td>
              <td className="px-3 py-[9px] text-[var(--t2)]">{row.price}</td>
              <td
                className={cn(
                  'px-3 py-[9px]',
                  row.verdictGood
                    ? 'text-[var(--mint)]'
                    : row.verdictBad
                    ? 'text-[var(--orange)]'
                    : 'text-[var(--t2)]'
                )}
              >
                {row.verdict}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ── TAGS ────────────────────────────────────────────────── */
export function ArticleTags({ tags }: { tags: string[] }) {
  return (
    <div className="my-[14px] flex flex-wrap gap-[6px]">
      {tags.map((tag) => (
        <span
          key={tag}
          className="cursor-pointer rounded-[4px] border border-[var(--border)] bg-[var(--bg3)] px-[9px] py-[3px] text-[10px] text-[var(--t3)] transition-colors hover:border-[var(--border2)] hover:text-[var(--t2)]"
        >
          {tag}
        </span>
      ))}
    </div>
  )
}
