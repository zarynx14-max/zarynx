import Link from 'next/link'
import { type LucideIcon } from 'lucide-react'

export interface RelatedTool {
  name: string
  description: string
  slug: string
  icon: LucideIcon
  iconBg: string
  iconColor: string
}

interface ToolRelatedProps {
  tools: RelatedTool[]
}

export function ToolRelated({ tools }: ToolRelatedProps) {
  return (
    <section className="border-t border-[var(--border)] bg-[var(--bg2)] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-[720px]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[18px] font-medium text-[var(--t1)]">Related tools</h2>
          <Link
            href="/tools"
            className="text-[12px] text-[var(--mint)] transition-colors hover:underline"
          >
            View all tools →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-[10px] sm:grid-cols-3">
          {tools.map(tool => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group rounded-[10px] border border-[var(--border)] bg-[var(--bg)] p-4 transition-all hover:border-[var(--border2)] hover:bg-[var(--bg3)]"
            >
              <div
                className="mb-3 flex h-[38px] w-[38px] items-center justify-center rounded-[9px]"
                style={{ background: tool.iconBg }}
              >
                <tool.icon size={19} strokeWidth={1.7} style={{ color: tool.iconColor }} />
              </div>
              <p className="mb-1 text-[13px] font-medium leading-[1.3] text-[var(--t1)]">
                {tool.name}
              </p>
              <p className="text-[12px] leading-[1.5] text-[var(--t3)]">
                {tool.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
