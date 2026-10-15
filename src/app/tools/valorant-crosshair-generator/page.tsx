import type { Metadata } from 'next'
import { siteConfig } from '@/lib/config'
import CrosshairGeneratorClient from '@/components/tools/CrosshairGeneratorClient'

export const metadata: Metadata = {
  title: `Valorant Crosshair Generator — Build, Preview & Copy Code | ${siteConfig.name}`,
  description:
    'Free Valorant crosshair generator. Customize color, outlines, center dot and lines, test visibility across maps and resolutions, then copy the profile code straight into your game.',
  openGraph: {
    title: `Valorant Crosshair Generator — Build, Preview & Copy Code | ${siteConfig.name}`,
    description:
      'Build and preview your perfect Valorant crosshair, then copy the code directly into your game. Free, no sign-up.',
    url: `${siteConfig.url}/tools/valorant-crosshair-generator`,
  },
  robots: { index: true, follow: true },
}

export default function Page() {
  return <CrosshairGeneratorClient />
}
