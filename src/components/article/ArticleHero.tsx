import { Eye, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const pillStyles: Record<string, string> = {
  mint:   'bg-[rgba(0,229,160,0.1)] text-[var(--mint)] border-[rgba(0,229,160,0.2)]',
  blue:   'bg-[rgba(80,140,255,0.1)] text-[var(--blue)] border-[rgba(80,140,255,0.2)]',
  orange: 'bg-[rgba(255,120,64,0.1)] text-[var(--orange)] border-[rgba(255,120,64,0.2)]',
}

export interface ArticleTag {
  label: string
  color?: 'mint' | 'blue' | 'orange'
}

interface ArticleHeroProps {
  tags: ArticleTag[]
  publishedAt: string
  readTime: string
  updated?: boolean
  title: React.ReactNode
  subtitle: string
  authorInitials?: string
  authorName: string
  authorNote?: string
  views: string
  comments: number
}

export function ArticleHero({
  tags,
  publishedAt,
  readTime,
  updated,
  title,
  subtitle,
  authorInitials = 'ZT',
  authorName,
  authorNote,
  views,
  comments,
}: ArticleHeroProps) {
  return (
    <div className="relative overflow-hidden border-b border-[var(--border)] bg-[var(--bg2)] px-4 pb-[22px] pt-7 sm:px-6">
      {/* Glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-[-40px] h-[180px] w-[500px] -translate-x-1/2"
        style={{ background: 'radial-gradient(ellipse, rgba(0,229,160,0.07) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 mx-auto max-w-[820px]">
        {/* Meta row */}
        <div className="mb-[14px] flex flex-wrap items-center gap-2">
          {tags.map((t) => (
            <span
              key={t.label}
              className={cn(
                'rounded-[20px] border px-[10px] py-[3px] text-[10px] font-medium',
                pillStyles[t.color ?? 'mint']
              )}
            >
              {t.label}
            </span>
          ))}
          <span className="h-[3px] w-[3px] rounded-full bg-[var(--t3)]" />
          <span className="text-[11px] text-[var(--t3)]">{publishedAt}</span>
          <span className="h-[3px] w-[3px] rounded-full bg-[var(--t3)]" />
          <span className="text-[11px] text-[var(--t3)]">{readTime}</span>
          {updated && (
            <>
              <span className="h-[3px] w-[3px] rounded-full bg-[var(--t3)]" />
              <span className="text-[11px] text-[var(--mint)]">Updated</span>
            </>
          )}
        </div>

        {/* Title */}
        <h1 className="mb-3 max-w-[680px] text-[22px] font-medium leading-[1.3] text-[var(--t1)] sm:text-[24px]">
          {title}
        </h1>

        {/* Subtitle */}
        <p className="mb-[18px] max-w-[600px] text-[13px] leading-[1.65] text-[var(--t2)]">
          {subtitle}
        </p>

        {/* Byline */}
        <div className="flex flex-wrap items-center gap-[10px] border-t border-[var(--border)] pt-[14px]">
          {/* Avatar */}
          <div className="flex h-[28px] w-[28px] flex-shrink-0 items-center justify-center rounded-full bg-[rgba(0,229,160,0.15)] text-[10px] font-medium text-[var(--mint)]">
            {authorInitials}
          </div>
          <div className="text-[11px] text-[var(--t2)]">
            <span className="font-medium text-[var(--t1)]">{authorName}</span>
            {authorNote && ` · ${authorNote}`}
          </div>

          {/* Stats */}
          <div className="ml-auto flex flex-wrap gap-[14px]">
            <div className="flex items-center gap-1 text-[11px] text-[var(--t3)]">
              <Eye size={12} />
              {views} views
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[var(--t3)]">
              <MessageCircle size={12} />
              {comments} comments
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
