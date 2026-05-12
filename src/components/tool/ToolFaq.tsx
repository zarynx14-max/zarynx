'use client'

import { useState } from 'react'

export interface FaqItem {
  question: string
  answer: string
}

interface ToolFaqProps {
  items: FaqItem[]
}

export function ToolFaq({ items }: ToolFaqProps) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div>
      <h2 className="mb-4 text-[20px] font-medium text-[var(--t1)] sm:text-[22px]">
        Frequently asked questions
      </h2>
      <div className="flex flex-col gap-[6px]">
        {items.map((item, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-[10px] border border-[var(--border)] bg-[var(--bg2)]"
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between gap-3 px-[18px] py-[14px] text-left text-[14px] font-medium text-[var(--t1)] transition-colors hover:bg-[var(--bg3)]"
            >
              <span>{item.question}</span>
              <span
                className="flex-shrink-0 text-[20px] leading-none transition-all duration-200"
                style={{
                  transform: open === i ? 'rotate(45deg)' : 'none',
                  color: open === i ? 'var(--mint)' : 'var(--t3)',
                }}
              >
                +
              </span>
            </button>
            {open === i && (
              <p className="px-[18px] pb-[14px] text-[13px] leading-[1.7] text-[var(--t2)]">
                {item.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
