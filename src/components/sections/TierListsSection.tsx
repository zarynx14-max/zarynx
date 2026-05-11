import Link from 'next/link'

const tierLists = [
  {
    game:    'Marvel Rivals',
    title:   'Season 2 Tier List',
    meta:    'Updated 3 days ago',
    color:   'var(--mint)',
    latest:  true,
    pips:    ['mint','mint','blue','blue','gray','gray'],
    href:    '/tier-lists/marvel-rivals-season-2',
  },
  {
    game:    'CS2',
    title:   'Best rifles — patch 1.41',
    meta:    'Updated 1 week ago',
    color:   'var(--blue)',
    latest:  false,
    pips:    ['mint','mint','mint','blue','gray','gray'],
    href:    '/tier-lists/cs2-rifles-patch-141',
  },
  {
    game:    'Valorant',
    title:   'Agent tier list — patch 9.0',
    meta:    'Updated 5 days ago',
    color:   'var(--orange)',
    latest:  false,
    pips:    ['mint','orange','blue','blue','gray','gray'],
    href:    '/tier-lists/valorant-agents-patch-9',
  },
]

const pipColor: Record<string, string> = {
  mint:   'var(--mint)',
  blue:   'var(--blue)',
  orange: 'var(--orange)',
  gray:   'var(--t3)',
}

const pipLegend = [
  { label: 'S/A', color: 'var(--mint)' },
  { label: 'B/C', color: 'var(--blue)' },
  { label: 'D',   color: 'var(--t3)'   },
]

export function TierListsSection() {
  return (
    <section className="border-b border-[var(--border)] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[15px] font-medium text-[var(--t1)]">Latest tier lists</h2>
          <Link href="/tier-lists" className="text-[12px] text-[var(--mint)] hover:underline">
            All tier lists →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {tierLists.map(tl => (
            <Link
              key={tl.title}
              href={tl.href}
              className="relative block rounded-[10px] border border-[var(--border)] bg-[var(--bg2)] p-[14px] transition-colors hover:bg-[var(--bg3)]"
            >
              {tl.latest && (
                <span className="absolute right-[10px] top-[10px] rounded-[4px] border border-[rgba(0,229,160,0.25)] bg-[rgba(0,229,160,0.1)] px-[6px] py-[2px] text-[9px] font-medium text-[var(--mint)]">
                  Latest
                </span>
              )}
              <p className="mb-[5px] text-[10px] font-medium uppercase tracking-[0.06em]" style={{ color: tl.color }}>
                {tl.game}
              </p>
              <p className="mb-[3px] text-[12px] font-medium leading-[1.3] text-[var(--t1)]">
                {tl.title}
              </p>
              <p className="text-[11px] text-[var(--t3)]">{tl.meta}</p>

              {/* Pips */}
              <div className="mt-[10px] flex gap-[3px]">
                {tl.pips.map((p, i) => (
                  <div
                    key={i}
                    className="h-[3px] flex-1 rounded-[2px]"
                    style={{ background: pipColor[p] }}
                  />
                ))}
              </div>

              {/* Legend */}
              <div className="mt-[6px] flex gap-[10px]">
                {pipLegend.map(leg => (
                  <div key={leg.label} className="flex items-center gap-[3px]">
                    <div className="h-[3px] w-[6px] rounded-[1px]" style={{ background: leg.color }} />
                    <span className="text-[9px] text-[var(--t3)]">{leg.label}</span>
                  </div>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
