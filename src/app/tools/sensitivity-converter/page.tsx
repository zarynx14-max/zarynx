import type { Metadata } from 'next'
import { siteConfig } from '@/lib/config'

export const metadata: Metadata = {
  title: `Sensitivity Converter — CS2, Valorant, Apex & More | ${siteConfig.name}`,
  description:
    'Free mouse sensitivity converter for CS2, Valorant, Apex Legends, Fortnite and 30+ games. Convert your sens instantly — no sign-up required.',
  openGraph: {
    title: `Sensitivity Converter — CS2, Valorant, Apex & More | ${siteConfig.name}`,
    description:
      'Free mouse sensitivity converter for CS2, Valorant, Apex Legends, Fortnite and 30+ games.',
    url: `${siteConfig.url}/tools/sensitivity-converter`,
  },
  robots: { index: true, follow: true },
}

export default function SensitivityConverterPage() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 py-20 text-center">
      <h1 className="text-3xl font-bold text-[var(--t1)]">Sensitivity Converter</h1>
      <p className="max-w-md text-[var(--t3)]">
        Convert your mouse sensitivity across CS2, Valorant, Apex Legends, Fortnite and 30+ games.
        This tool is coming soon — check back shortly.
      </p>
      <a href="/tools" className="mt-2 text-sm text-[var(--mint)] underline underline-offset-4">
        ← Browse all tools
      </a>
    </main>
  )
}
