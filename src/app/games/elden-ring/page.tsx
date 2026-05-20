import type { Metadata } from 'next'
import { siteConfig } from '@/lib/config'

export const metadata: Metadata = {
  title: `Elden Ring Tools — Build Optimizer, Tier Lists & Guides | ${siteConfig.name}`,
  description:
    'Free Elden Ring tools: build optimizer, weapon tier list, boss guides and beginner builds. No sign-up required.',
  openGraph: {
    title: `Elden Ring Tools — Build Optimizer, Tier Lists & Guides | ${siteConfig.name}`,
    description:
      'Free Elden Ring tools: build optimizer, weapon tier list, boss guides and beginner builds.',
    url: `${siteConfig.url}/games/elden-ring`,
  },
  robots: { index: true, follow: true },
}

export default function EldenRingPage() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 py-20 text-center">
      <h1 className="text-3xl font-bold text-[var(--t1)]">Elden Ring Tools</h1>
      <p className="max-w-md text-[var(--t3)]">
        Build optimizer, weapon tier list, boss guides and beginner builds — all free.
        Full Elden Ring hub coming soon.
      </p>
      <a href="/games" className="mt-2 text-sm text-[var(--mint)] underline underline-offset-4">
        ← Browse all games
      </a>
    </main>
  )
}
