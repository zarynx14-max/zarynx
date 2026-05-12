import Link from 'next/link'

interface Props {
  toolName: string
  toolSlug: string
}

export function ToolBreadcrumb({ toolName, toolSlug }: Props) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="border-b border-[var(--border)] bg-[var(--bg2)] px-4 py-[10px] sm:px-6"
    >
      <ol className="flex flex-wrap items-center gap-[6px] text-[12px] text-[var(--t3)]">
        <li>
          <Link href="/" className="transition-colors hover:text-[var(--mint)]">
            Home
          </Link>
        </li>
        <li>/</li>
        <li>
          <Link href="/tools" className="transition-colors hover:text-[var(--mint)]">
            Tools
          </Link>
        </li>
        <li>/</li>
        <li className="text-[var(--t2)]">{toolName}</li>
      </ol>
    </nav>
  )
}
