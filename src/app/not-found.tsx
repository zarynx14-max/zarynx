import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="mb-2 text-[11px] uppercase tracking-[0.1em] text-[var(--mint)]">404</p>
      <h1 className="mb-3 text-[24px] font-medium text-[var(--t1)]">Page not found</h1>
      <p className="mb-8 max-w-[320px] text-[13px] leading-[1.65] text-[var(--t2)]">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex gap-3">
        <Link
          href="/"
          className="rounded-lg bg-[var(--mint)] px-5 py-[10px] text-[13px] font-medium text-[#0D0F14] transition-opacity hover:opacity-90"
        >
          Go home
        </Link>
        <Link
          href="/tools"
          className="rounded-lg border border-[var(--border2)] px-5 py-[10px] text-[13px] text-[var(--t2)] transition-colors hover:text-[var(--t1)]"
        >
          Browse tools →
        </Link>
      </div>
    </div>
  )
}
