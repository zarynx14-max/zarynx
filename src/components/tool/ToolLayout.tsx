interface ToolLayoutProps {
  children: React.ReactNode
}

// Wraps the main content sections with max-width and spacing
export function ToolLayout({ children }: ToolLayoutProps) {
  return (
    <div className="px-4 sm:px-6">
      <div className="mx-auto max-w-[720px]">
        {children}
      </div>
    </div>
  )
}

// Individual section divider
export function ToolSection({
  children,
  last = false,
}: {
  children: React.ReactNode
  last?: boolean
}) {
  return (
    <div className={`py-7 ${!last ? 'border-b border-[var(--border)]' : ''}`}>
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
