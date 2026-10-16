import type { Metadata } from 'next'
import { siteConfig } from '@/lib/config'
import EldenRingBuildClient from '@/components/tools/EldenRingBuildClient'

export const metadata: Metadata = {
  title: `Elden Ring Build Optimizer — Class, Level & Runes Calculator | ${siteConfig.name}`,
  description:
    'Free Elden Ring build planner. Find the best starting class and the lowest level for your weapon requirements, with exact HP, FP, stamina, equip load and rune costs.',
  openGraph: {
    title: `Elden Ring Build Optimizer — Class, Level & Runes Calculator | ${siteConfig.name}`,
    description:
      'Plan your Elden Ring build: best starting class, lowest level for weapon requirements, exact HP, FP, stamina, equip load and rune costs. Free, no sign-up.',
    url: `${siteConfig.url}/tools/elden-ring-build-optimizer`,
  },
  robots: { index: true, follow: true },
}

export default function Page() {
  return <EldenRingBuildClient />
}
