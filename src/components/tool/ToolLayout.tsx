interface ToolLayoutProps {
  children: React.ReactNode
  wide?: boolean
}

// Wraps the main content sections with max-width and spacing
export function ToolLayout({ children, wide = false }: ToolLayoutProps) {
  return (
    <div className="px-4 sm:px-6">
      <div className={`mx-auto ${wide ? 'max-w-[960px]' : 'max-w-[720px]'}`}>
        {children}
      </div>
    </div>
  )
}

// Individual section divider
export function ToolSection({
  children,
  last = false,
  wide = false,
}: {
  children: React.ReactNode
  last?: boolean
  wide?: boolean
}) {
  return (
    <div className={`py-7 ${!last ? 'border-b border-[var(--border)]' : ''} ${wide ? 'max-w-none' : ''}`}>
      {children}
    </div>
  )
}

// Section label (small uppercase label above a section)
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--t3)]">
      {children}
    </p>
  )
}
