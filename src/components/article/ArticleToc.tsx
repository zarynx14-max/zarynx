'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

export interface TocItem {
  id: string
  label: string
}

interface ArticleTocProps {
  items: TocItem[]
}

export function ArticleToc({ items }: ArticleTocProps) {
  const [active, setActive] = useState(items[0]?.id ?? '')

  return (
    <div className="mb-5 rounded-r-[8px] border border-l-2 border-[var(--border)] border-l-[var(--mint)] bg-[var(--bg2)] px-4 py-[14px]">
      <p className="mb-[10px] text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--t3)]">
        In this article
      </p>
      <div className="flex flex-col">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={() => setActive(item.id)}
            className={cn(
              'flex cursor-pointer items-center gap-[6px] py-[3px] text-[12px] transition-colors hover:text-[var(--mint)]',
              active === item.id ? 'text-[var(--mint)]' : 'text-[var(--t2)]'
            )}
          >
            <span
              className={cn(
                'h-[4px] w-[4px] flex-shrink-0 rounded-full',
                active === item.id ? 'bg-[var(--mint)]' : 'bg-[rgba(255,255,255,0.12)]'
              )}
            />
            {item.label}
          </a>
        ))}
      </div>
    </div>
  )
}
