import { type LucideIcon } from 'lucide-react'

export interface InfoCard {
  icon: LucideIcon
  iconBg: string
  iconColor: string
  title: string
  body: string
}

interface ToolExplanationProps {
  title: string
  paragraphs: string[]
  cards: InfoCard[]
  secondTitle?: string
  secondParagraphs?: string[]
}

export function ToolExplanation({
  title,
  paragraphs,
  cards,
  secondTitle,
  secondParagraphs,
}: ToolExplanationProps) {
  return (
    <div>
      <h2 className="mb-3 text-[20px] font-medium text-[var(--t1)] sm:text-[22px]">
        {title}
      </h2>
      {paragraphs.map((p, i) => (
        <p key={i} className="mb-3 text-[14px] leading-[1.75] text-[var(--t2)]">
          {p}
        </p>
      ))}

      {/* 3 info cards */}
      <div className="my-5 grid grid-cols-1 gap-[10px] sm:grid-cols-3">
        {cards.map(card => (
          <div
            key={card.title}
            className="rounded-[10px] border border-[var(--border)] bg-[var(--bg2)] p-4"
          >
            <div
              className="mb-[10px] flex h-[34px] w-[34px] items-center justify-center rounded-[8px]"
              style={{ background: card.iconBg }}
            >
              <card.icon size={16} strokeWidth={1.7} style={{ color: card.iconColor }} />
            </div>
            <p className="mb-[5px] text-[13px] font-medium text-[var(--t1)]">{card.title}</p>
            <p className="text-[12px] leading-[1.6] text-[var(--t2)]">{card.body}</p>
          </div>
        ))}
      </div>

      {secondTitle && (
        <>
          <h2 className="mb-3 mt-2 text-[20px] font-medium text-[var(--t1)] sm:text-[22px]">
            {secondTitle}
          </h2>
          {(secondParagraphs ?? []).map((p, i) => (
            <p key={i} className="mb-3 text-[14px] leading-[1.75] text-[var(--t2)]">
              {p}
            </p>
          ))}
        </>
      )}
    </div>
  )
}
