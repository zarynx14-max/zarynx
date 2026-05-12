import { Users, Clock, Check, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

const badgeStyles = {
  mint:   'bg-[rgba(0,229,160,0.1)] text-[var(--mint)]',
  orange: 'bg-[rgba(255,120,64,0.1)] text-[var(--orange)]',
  blue:   'bg-[rgba(80,140,255,0.1)] text-[var(--blue)]',
  gray:   'bg-[rgba(255,255,255,0.06)] text-[var(--t2)]',
}

interface ToolHeaderProps {
  name: string
  description: string
  categoryLabel: string
  categoryColor?: 'mint' | 'orange' | 'blue' | 'gray'
  typeLabel: string
  typeColor?: 'mint' | 'orange' | 'blue' | 'gray'
  updatedAt: string
  usersPerMonth?: string
}

export function ToolHeader({
  name,
  description,
  categoryLabel,
  categoryColor = 'mint',
  typeLabel,
  typeColor = 'blue',
  updatedAt,
  usersPerMonth = '10,000+',
}: ToolHeaderProps) {
  const stats = [
    { icon: Users,      val: usersPerMonth, label: 'users this month',  iconBg: 'rgba(0,229,160,0.1)',   iconColor: 'var(--mint)'   },
    { icon: Clock,      val: 'Instant',     label: 'results',           iconBg: 'rgba(80,140,255,0.1)',  iconColor: 'var(--blue)'   },
    { icon: Check,      val: 'Free',        label: 'no sign-up',        iconBg: 'rgba(0,229,160,0.1)',   iconColor: 'var(--mint)'   },
    { icon: RefreshCw,  val: 'Monthly',     label: 'data updates',      iconBg: 'rgba(255,120,64,0.1)',  iconColor: 'var(--orange)' },
  ]

  return (
    <div className="border-b border-[var(--border)] bg-[var(--bg)] px-4 pb-0 pt-7 sm:px-6">
      <div className="mx-auto max-w-[720px]">

        {/* Badges + updated */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className={cn('rounded-[5px] px-[9px] py-[3px] text-[11px] font-medium', badgeStyles[categoryColor])}>
            {categoryLabel}
          </span>
          <span className={cn('rounded-[5px] px-[9px] py-[3px] text-[11px] font-medium', badgeStyles[typeColor])}>
            {typeLabel}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-[var(--t3)]">
            <span className="inline-block h-[5px] w-[5px] rounded-full bg-[rgba(0,229,160,0.5)]" />
            Updated {updatedAt}
          </span>
        </div>

        {/* Title */}
        <h1 className="mb-[10px] text-[26px] font-medium leading-[1.2] text-[var(--t1)] sm:text-[28px]">
          {name}
        </h1>

        {/* Description */}
        <p className="mb-5 max-w-[600px] text-[14px] leading-[1.7] text-[var(--t2)]">
          {description}
        </p>

        {/* Stats bar */}
        <div className="flex flex-wrap gap-0 border-t border-[var(--border)]">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={cn(
                'flex items-center gap-[6px] px-[18px] py-3 text-[12px] text-[var(--t3)]',
                i > 0 && 'border-l border-[var(--border)]',
                i === 0 && 'pl-0'
              )}
            >
              <span
                className="flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-[5px]"
                style={{ background: s.iconBg }}
              >
                <s.icon size={10} style={{ color: s.iconColor }} />
              </span>
              <span className="font-medium text-[var(--t2)]">{s.val}</span>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
