import type { Metadata } from 'next'
import { siteConfig } from '@/lib/config'
import { BlogListing } from '@/components/sections/BlogListing'

export const metadata: Metadata = {
  title: `Blog — Gaming Guides & Articles | ${siteConfig.name}`,
  description:
    'In-depth gaming guides, GPU benchmarks, PC build tips, game guides, and tool walkthroughs. Updated regularly by the Zarynx team.',
  openGraph: {
    title: `Blog — Gaming Guides & Articles | ${siteConfig.name}`,
    description:
      'In-depth gaming guides, GPU benchmarks, PC build tips, game guides, and tool walkthroughs.',
    url: `${siteConfig.url}/blog`,
  },
}

export default function BlogPage() {
  return <BlogListing />
}
