import type { Metadata } from 'next'
import { siteConfig } from '@/lib/config'

export const metadata: Metadata = {
  title: `Game Pass Calculator — Is Xbox Game Pass Worth It? | ${siteConfig.name}`,
  description:
    'Calculate whether Xbox Game Pass Ultimate, PC Game Pass, or buying games outright saves you more money. Free calculator — no sign-up required.',
  openGraph: {
    title: `Game Pass Calculator — Is Xbox Game Pass Worth It? | ${siteConfig.name}`,
    description:
      'Calculate whether Xbox Game Pass Ultimate, PC Game Pass, or buying games outright saves you more money.',
    url: `${siteConfig.url}/tools/game-pass-calculator`,
  },
  robots: { index: true, follow: true },
}

export default function GamePassCalculatorPage() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 py-20 text-center">
      <h1 className="text-3xl font-bold text-[var(--t1)]">Game Pass Calculator</h1>
      <p className="max-w-md text-[var(--t3)]">
        Find out whether Xbox Game Pass Ultimate or PC Game Pass is worth it based on the games you
        actually play. This tool is coming soon — check back shortly.
      </p>
      <a href="/tools" className="mt-2 text-sm text-[var(--mint)] underline underline-offset-4">
        ← Browse all tools
      </a>
    </main>
  )
}
