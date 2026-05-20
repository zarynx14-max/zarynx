import type { Metadata } from 'next'
import { siteConfig } from '@/lib/config'

export const metadata: Metadata = {
  title: `Fortnite Tools — Sensitivity Converter, Build Tips & Settings | ${siteConfig.name}`,
  description:
    'Free Fortnite tools: sensitivity converter, best controller and PC settings, building tips and season guides. No sign-up required.',
  openGraph: {
    title: `Fortnite Tools — Sensitivity Converter, Build Tips & Settings | ${siteConfig.name}`,
    description:
      'Free Fortnite tools: sensitivity converter, best settings, building tips and season guides.',
    url: `${siteConfig.url}/games/fortnite`,
  },
  robots: { index: true, follow: true },
}

export default function FortnitePage() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 py-20 text-center">
      <h1 className="text-3xl font-bold text-[var(--t1)]">Fortnite Tools</h1>
      <p className="max-w-md text-[var(--t3)]">
        Sensitivity converter, best controller and PC settings, building tips and season guides — all free.
        Full Fortnite hub coming soon.
      </p>
      <a href="/games" className="mt-2 text-sm text-[var(--mint)] underline underline-offset-4">
        ← Browse all games
      </a>
    </main>
  )
}
