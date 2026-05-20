import type { Metadata } from 'next'
import { siteConfig } from '@/lib/config'

export const metadata: Metadata = {
  title: `CS2 Tools — Sensitivity Converter, Crosshair & Pro Settings | ${siteConfig.name}`,
  description:
    'Free CS2 tools: sensitivity converter, crosshair codes, map callouts and pro player settings. No sign-up required.',
  openGraph: {
    title: `CS2 Tools — Sensitivity Converter, Crosshair & Pro Settings | ${siteConfig.name}`,
    description:
      'Free CS2 tools: sensitivity converter, crosshair codes, map callouts and pro player settings.',
    url: `${siteConfig.url}/games/cs2`,
  },
  robots: { index: true, follow: true },
}

export default function Cs2Page() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 py-20 text-center">
      <h1 className="text-3xl font-bold text-[var(--t1)]">CS2 Tools</h1>
      <p className="max-w-md text-[var(--t3)]">
        Sensitivity converter, crosshair codes, map callouts and pro player settings — all free.
        Full CS2 hub coming soon.
      </p>
      <a href="/games" className="mt-2 text-sm text-[var(--mint)] underline underline-offset-4">
        ← Browse all games
      </a>
    </main>
  )
}
