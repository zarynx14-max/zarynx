import type { Metadata } from 'next'
import { siteConfig } from '@/lib/config'
import { HeroSection }       from '@/components/sections/HeroSection'
import { HowItWorks }        from '@/components/sections/HowItWorks'
import { PopularTools }      from '@/components/sections/PopularTools'
import { TierListsSection }  from '@/components/sections/TierListsSection'
import { StatsStrip }        from '@/components/sections/StatsStrip'
import { BlogSection }       from '@/components/sections/BlogSection'
import { CtaStrip }          from '@/components/sections/CtaStrip'
import { FaqSection }        from '@/components/sections/FaqSection'
import { NewsletterSection } from '@/components/sections/NewsletterSection'

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HowItWorks />
      <PopularTools />
      <TierListsSection />
      <StatsStrip />
      <BlogSection />
      <CtaStrip />
      <FaqSection />
      <NewsletterSection />
    </>
  )
}
