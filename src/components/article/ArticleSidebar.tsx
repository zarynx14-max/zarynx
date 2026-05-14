import Link from 'next/link'

/* ── SIDEBAR CARD WRAPPER ────────────────────────────────── */
function SideCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-[14px] overflow-hidden rounded-[10px] border border-[var(--border)] bg-[var(--bg2)]">
      {children}
    </div>
  )
}

function SideHead({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-b border-[var(--border)] px-[14px] py-[11px] text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--t3)]">
      {children}
    </div>
  )
}

/* ── RELATED TOOLS ───────────────────────────────────────── */
export interface SidebarTool {
  name: string
  description: string
  slug: string
  icon: React.ReactNode
  iconBg: string
  iconColor: string
}

export function ArticleSidebarTools({ tools }: { tools: SidebarTool[] }) {
  return (
    <SideCard>
      <SideHead>Related tools</SideHead>
      {tools.map((tool, i) => (
        <Link
          key={tool.slug}
          href={`/tools/${tool.slug}`}
          className="group flex items-center gap-[10px] border-b border-[var(--border)] px-[14px] py-[9px] transition-colors last:border-0 hover:bg-[var(--bg3)]"
        >
          <div
            className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-[7px]"
            style={{ background: tool.iconBg, color: tool.iconColor }}
          >
            {tool.icon}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-medium text-[var(--t1)] transition-colors group-hover:text-[var(--mint)]">
              {tool.name}
            </p>
            <p className="text-[10px] text-[var(--t3)]">{tool.description}</p>
          </div>
          <span className="flex-shrink-0 text-[12px] text-[var(--t3)] opacity-0 transition-opacity group-hover:opacity-100">
            →
          </span>
        </Link>
      ))}
    </SideCard>
  )
}

/* ── RELATED ARTICLES ────────────────────────────────────── */
export interface SidebarArticle {
  category: string
  categoryColor?: string
  title: string
  readTime: string
  date: string
  slug: string
}

export function ArticleSidebarRelated({ articles }: { articles: SidebarArticle[] }) {
  return (
    <SideCard>
      <SideHead>Related articles</SideHead>
      {articles.map((article) => (
        <Link
          key={article.slug}
          href={`/blog/${article.slug}`}
          className="group block border-b border-[var(--border)] px-[14px] py-[9px] transition-colors last:border-0 hover:bg-[var(--bg3)]"
        >
          <p
            className="mb-[3px] text-[10px] font-medium"
            style={{ color: article.categoryColor ?? 'var(--mint)' }}
          >
            {article.category}
          </p>
          <p className="mb-[3px] text-[12px] font-medium leading-[1.4] text-[var(--t1)] transition-colors group-hover:text-[var(--mint)]">
            {article.title}
          </p>
          <p className="text-[10px] text-[var(--t3)]">
            {article.readTime} read · {article.date}
          </p>
        </Link>
      ))}
    </SideCard>
  )
}

/* ── NEWSLETTER ──────────────────────────────────────────── */
export function ArticleSidebarNewsletter() {
  return (
    <SideCard>
      <SideHead>Stay updated</SideHead>
      <div className="px-[14px] py-3">
        <p className="mb-[10px] text-[11px] leading-[1.55] text-[var(--t2)]">
          New guides and tool launches — one email, no spam.
        </p>
        <input
          type="email"
          placeholder="your@email.com"
          className="mb-2 w-full rounded-[6px] border border-[var(--border2)] bg-[var(--bg3)] px-[10px] py-2 text-[12px] text-[var(--t1)] outline-none placeholder:text-[var(--t3)] focus:border-[rgba(0,229,160,0.35)]"
        />
        <button className="w-full rounded-[6px] bg-[var(--mint)] py-2 text-[12px] font-medium text-[#0D0F14] transition-opacity hover:opacity-90">
          Notify me
        </button>
      </div>
    </SideCard>
  )
}
