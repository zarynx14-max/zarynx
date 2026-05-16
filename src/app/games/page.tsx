import type { Metadata } from 'next'
import { siteConfig } from '@/lib/config'
import { GamesListing } from '@/components/sections/GamesListing'

export const metadata: Metadata = {
  title: `Browse Games — Free Gaming Tools by Game | ${siteConfig.name}`,
  description:
    'Find free gaming tools for Valorant, CS2, Fortnite, Elden Ring, Pokemon, Marvel Rivals and more. Sensitivity converters, tier lists, build optimizers — all free.',
  openGraph: {
    title: `Browse Games — Free Gaming Tools by Game | ${siteConfig.name}`,
    description:
      'Find free gaming tools for your favourite game. Sensitivity converters, tier lists, build planners and more — all free, no sign-up.',
    url: `${siteConfig.url}/games`,
  },
}

export default function GamesPage() {
  return <GamesListing />
}
