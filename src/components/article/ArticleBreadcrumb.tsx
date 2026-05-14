import Link from 'next/link'

interface Props {
  category: string
  categoryHref: string
  title: string
}

export function ArticleBreadcrumb({ category, categoryHref, title }: Props) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="border-b border-[var(--border)] bg-[var(--bg2)] px-4 py-[9px] sm:px-6"
    >
      <ol className="flex flex-wrap items-center gap-[6px] text-[11px] text-[var(--t3)]">
        <li>
          <Link href="/" className="transition-colors hover:text-[var(--mint)]">Home</Link>
        </li>
        <li>/</li>
        <li>
          <Link href="/blog" className="transition-colors hover:text-[var(--mint)]">Blog</Link>
        </li>
        <li>/</li>
        <li>
          <Link href={categoryHref} className="transition-colors hover:text-[var(--mint)]">{category}</Link>
        </li>
        <li>/</li>
        <li className="text-[var(--t2)] line-clamp-1">{title}</li>
      </ol>
    </nav>
  )
}
