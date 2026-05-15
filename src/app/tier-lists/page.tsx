import type { Metadata } from 'next'
import { siteConfig } from '@/lib/config'
import { TierListing } from '@/components/sections/TierListing'

export const metadata: Metadata = {
  title: `Tier Lists — Always Updated | ${siteConfig.name}`,
  description:
    'Up-to-date tier lists for the biggest games — Valorant, CS2, Marvel Rivals, Elden Ring, and more. Ranked by real data, patch notes, and community meta.',
  openGraph: {
    title: `Tier Lists — Always Updated | ${siteConfig.name}`,
    description:
      'Up-to-date tier lists for the biggest games — ranked by real data, patch notes, and community meta.',
    url: `${siteConfig.url}/tier-lists`,
  },
}

export default function TierListsPage() {
  return <TierListing />
}
