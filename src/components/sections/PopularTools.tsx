'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Monitor, Crosshair, Zap, CreditCard, Aperture, Sword } from 'lucide-react'
import { availableTools, type ToolCategory } from '@/data/tools'
import { cn } from '@/lib/utils'

const tabs: { label: string; value: 'all' | ToolCategory }[] = [
  { label: 'All tools',    value: 'all' },
  { label: 'PC Tools',     value: 'pc' },
  { label: 'Game Tools',   value: 'game' },
  { label: 'Calculators',  value: 'calculator' },
  { label: 'Tier Lists',   value: 'tierlist' },
]

const badgeStyles = {
  mint:   'bg-[rgba(0,229,160,0.1)] text-[var(--mint)]',
  orange: 'bg-[rgba(255,120,64,0.1)] text-[var(--orange)]',
  blue:   'bg-[rgba(80,140,255,0.1)] text-[var(--blue)]',
  gray:   'bg-[rgba(255,255,255,0.06)] text-[var(--t2)]',
}

// Map tool id to Lucide icon
const iconMap: Record<string, React.ElementType> = {
  'bottleneck-calculator':         Monitor,
  'sensitivity-converter':         Crosshair,
  'reaction-speed-test':           Zap,
  'game-pass-calculator':          CreditCard,
  'valorant-crosshair-generator':  Aperture,
  'elden-ring-build-optimizer':    Sword,
}

export function PopularTools() {
  const [active, setActive] = useState<'all' | ToolCategory>('all')

  const displayed = availableTools
    .filter(t => active === 'all' || t.category === active)
    .slice(0, 6)

  const counts: Record<string, number> = {
    all:        availableTools.length,
    pc:         availableTools.filter(t => t.category === 'pc').length,
    game:       availableTools.filter(t => t.category === 'game').length,
    calculator: availableTools.filter(t => t.category === 'calculator').length,
    tierlist:   availableTools.filter(t => t.category === 'tierlist').length,
  }

  return (
    <section className="border-b border-[var(--border)] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[15px] font-medium text-[var(--t1)]">Popular tools</h2>
          <Link href="/tools" className="text-[12px] text-[var(--mint)] hover:underline">
            View all {availableTools.length} →
          </Link>
        </div>

        {/* Tabs */}
        <div className="mb-5 flex flex-wrap gap-2">
          {tabs.map(tab => (
            <button
              key={tab.value}
              onClick={() => setActive(tab.value)}
              className={cn(
                'rounded-full border px-[14px] py-[5px] text-[12px] transition-colors',
                active === tab.value
                  ? 'border-[rgba(0,229,160,0.3)] bg-[rgba(0,229,160,0.1)] text-[var(--mint)]'
                  : 'border-[var(--border)] text-[var(--t2)] hover:border-[var(--border2)] hover:text-[var(--t1)]'
              )}
            >
              {tab.label}
              <span className="ml-[3px] text-[10px] opacity-60">({counts[tab.value] ?? 0})</span>
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {displayed.map(tool => {
            const Icon = iconMap[tool.id] ?? Monitor
            return (
              <Link
                key={tool.id}
                href={`/tools/${tool.slug}`}
                className={cn(
                  'group rounded-xl border p-4 transition-all',
                  tool.featured
                    ? 'border-[rgba(0,229,160,0.25)] bg-[rgba(0,229,160,0.03)] hover:border-[rgba(0,229,160,0.4)]'
                    : 'border-[var(--border)] bg-[var(--bg2)] hover:border-[var(--border2)] hover:bg-[var(--bg3)]'
                )}
              >
                {/* Icon */}
                <div
                  className="mb-3 flex h-11 w-11 items-center justify-center rounded-[11px]"
                  style={{ background: tool.iconBg }}
                >
                  <Icon size={20} strokeWidth={1.7} style={{ color: tool.iconColor }} />
                </div>

                {/* Updated dot */}
                <p className="mb-1 flex items-center gap-1 text-[10px]" style={{ color: 'rgba(0,229,160,0.5)' }}>
                  <span className="inline-block h-1 w-1 rounded-full bg-[rgba(0,229,160,0.5)]" />
                  {tool.updatedAt}
                </p>

                <p className="mb-2 text-[12px] font-medium leading-[1.35] text-[var(--t1)]">
                  {tool.name}
                </p>

                {tool.badge && (
                  <span className={cn('rounded px-[7px] py-[2px] text-[10px] font-medium', badgeStyles[tool.badgeType ?? 'gray'])}>
                    {tool.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
