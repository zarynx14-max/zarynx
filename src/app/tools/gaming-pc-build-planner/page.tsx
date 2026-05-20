import type { Metadata } from 'next'
import { siteConfig } from '@/lib/config'

export const metadata: Metadata = {
  title: `Gaming PC Build Planner — Plan Your Perfect Build | ${siteConfig.name}`,
  description:
    'Free gaming PC build planner. Pick a budget, choose your games, and get a balanced CPU + GPU + RAM build recommendation instantly.',
  openGraph: {
    title: `Gaming PC Build Planner — Plan Your Perfect Build | ${siteConfig.name}`,
    description:
      'Free gaming PC build planner. Pick a budget and get a balanced build recommendation instantly.',
    url: `${siteConfig.url}/tools/gaming-pc-build-planner`,
  },
  robots: { index: true, follow: true },
}

export default function GamingPcBuildPlannerPage() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 py-20 text-center">
      <h1 className="text-3xl font-bold text-[var(--t1)]">Gaming PC Build Planner</h1>
      <p className="max-w-md text-[var(--t3)]">
        Plan your perfect gaming PC build by budget. Get balanced CPU, GPU and RAM recommendations
        for 1080p, 1440p or 4K gaming. This tool is coming soon — check back shortly.
      </p>
      <a href="/tools" className="mt-2 text-sm text-[var(--mint)] underline underline-offset-4">
        ← Browse all tools
      </a>
    </main>
  )
}
