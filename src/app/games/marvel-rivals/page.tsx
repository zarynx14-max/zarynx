import type { Metadata } from 'next'
import { siteConfig } from '@/lib/config'

export const metadata: Metadata = {
  title: `Marvel Rivals Tools — Hero Tier List, Sensitivity & Guides | ${siteConfig.name}`,
  description:
    'Free Marvel Rivals tools: hero tier list, sensitivity converter, best settings and beginner guides. No sign-up required.',
  openGraph: {
    title: `Marvel Rivals Tools — Hero Tier List, Sensitivity & Guides | ${siteConfig.name}`,
    description:
      'Free Marvel Rivals tools: hero tier list, sensitivity converter, best settings and beginner guides.',
    url: `${siteConfig.url}/games/marvel-rivals`,
  },
  robots: { index: true, follow: true },
}

export default function MarvelRivalsPage() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 py-20 text-center">
      <h1 className="text-3xl font-bold text-[var(--t1)]">Marvel Rivals Tools</h1>
      <p className="max-w-md text-[var(--t3)]">
        Hero tier list, sensitivity converter, best settings and beginner guides — all free.
        Full Marvel Rivals hub coming soon.
      </p>
      <a href="/games" className="mt-2 text-sm text-[var(--mint)] underline underline-offset-4">
        ← Browse all games
      </a>
    </main>
  )
}
