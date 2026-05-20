import type { Metadata } from 'next'
import { siteConfig } from '@/lib/config'

export const metadata: Metadata = {
  title: `Valorant Tools — Sensitivity Converter, Crosshair Generator & More | ${siteConfig.name}`,
  description:
    'Free Valorant tools: sensitivity converter, crosshair generator, agent tier list and pro settings database. No sign-up required.',
  openGraph: {
    title: `Valorant Tools — Sensitivity Converter, Crosshair Generator & More | ${siteConfig.name}`,
    description:
      'Free Valorant tools: sensitivity converter, crosshair generator, agent tier list and pro settings.',
    url: `${siteConfig.url}/games/valorant`,
  },
  robots: { index: true, follow: true },
}

export default function ValorantPage() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 py-20 text-center">
      <h1 className="text-3xl font-bold text-[var(--t1)]">Valorant Tools</h1>
      <p className="max-w-md text-[var(--t3)]">
        Sensitivity converter, crosshair generator, agent tier lists and pro settings — all free.
        Full Valorant hub coming soon.
      </p>
      <a href="/games" className="mt-2 text-sm text-[var(--mint)] underline underline-offset-4">
        ← Browse all games
      </a>
    </main>
  )
}
