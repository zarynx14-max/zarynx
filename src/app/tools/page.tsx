import type { Metadata } from 'next'
import { siteConfig } from '@/lib/config'
import { ToolsListing } from '@/components/sections/ToolsListing'

export const metadata: Metadata = {
  title: `All Gaming Tools | ${siteConfig.name}`,
  description:
    'Browse all 22 free gaming tools — PC bottleneck calculator, sensitivity converter, reaction speed test, build planners and more. No sign-up required.',
  openGraph: {
    title: `All Gaming Tools | ${siteConfig.name}`,
    description:
      'Browse all 22 free gaming tools — PC bottleneck calculator, sensitivity converter, reaction speed test, build planners and more.',
    url: `${siteConfig.url}/tools`,
  },
}

export default function ToolsPage() {
  return <ToolsListing />
}
