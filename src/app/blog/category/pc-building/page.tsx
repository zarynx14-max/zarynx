import type { Metadata } from 'next'
import { siteConfig } from '@/lib/config'
import { BlogCategoryListing } from '@/components/sections/BlogCategoryListing'

export const metadata: Metadata = {
  title: `PC Build Guides — Gaming PC Tips & Upgrades | ${siteConfig.name}`,
  description:
    'In-depth PC build guides, GPU comparisons, CPU benchmarks, and upgrade advice for gamers. Updated for 2025 — no fluff, just real tested advice.',
  openGraph: {
    title: `PC Build Guides — Gaming PC Tips & Upgrades | ${siteConfig.name}`,
    description: 'In-depth PC build guides, GPU comparisons, CPU benchmarks, and upgrade advice for gamers. Updated for 2025.',
    url: `${siteConfig.url}/blog/category/pc-building`,
  },
}

const articles = [
  {
    slug:     'cpu-bottleneck-gpu-upgrade',
    title:    'CPU Bottleneck Explained — When to Upgrade Your CPU vs GPU in 2025',
    excerpt:  'Your GPU is doing all the heavy lifting but your CPU is slowing it down. Here is exactly how to identify a bottleneck and what to upgrade first.',
    tag:      'PC Building',
    tagColor: 'mint' as const,
    date:     'May 12, 2025',
    readTime: '8 min read',
    featured: true,
  },
  {
    slug:     'rtx-4060-ti-vs-rx-7700-xt',
    title:    'RTX 4060 Ti vs RX 7700 XT — Which GPU Is Better for 1080p Gaming?',
    excerpt:  'A head-to-head comparison of two mid-range GPUs at 1080p and 1440p across 10 games.',
    tag:      'GPU Guide',
    tagColor: 'blue' as const,
    date:     'May 8, 2025',
    readTime: '6 min read',
  },
  {
    slug:     '1440p-vs-4k-gaming-2025',
    title:    '1440p vs 4K Gaming in 2025 — Is 4K Worth It Yet?',
    excerpt:  'Resolution, refresh rate, GPU requirements and price — everything you need to decide which monitor is right for you.',
    tag:      'Monitor Guide',
    tagColor: 'mint' as const,
    date:     'Apr 30, 2025',
    readTime: '7 min read',
  },
  {
    slug:     'how-much-ram-gaming-2025',
    title:    'How Much RAM Do You Actually Need for Gaming in 2025?',
    excerpt:  '16GB vs 32GB vs 64GB — what games actually use and when upgrading makes a real difference.',
    tag:      'RAM Guide',
    tagColor: 'orange' as const,
    date:     'Apr 22, 2025',
    readTime: '5 min read',
  },
  {
    slug:     'best-budget-gaming-pc-build-2025',
    title:    'Best Budget Gaming PC Build for Under $600 — Complete Guide 2025',
    excerpt:  'Full parts list, benchmarks, and assembly tips for a PC that handles 1080p gaming at high settings.',
    tag:      'PC Build',
    tagColor: 'blue' as const,
    date:     'Apr 15, 2025',
    readTime: '9 min read',
  },
  {
    slug:     'air-cooling-vs-liquid-cooling-2025',
    title:    'Air Cooling vs Liquid Cooling — What You Actually Need in 2025',
    excerpt:  'Thermal performance, noise levels, price and reliability compared. Most gamers do not need what they think they need.',
    tag:      'Cooling Guide',
    tagColor: 'mint' as const,
    date:     'Apr 8, 2025',
    readTime: '6 min read',
  },
  {
    slug:     'ssd-vs-hdd-gaming-2025',
    title:    'SSD vs HDD for Gaming — Does Storage Speed Actually Matter?',
    excerpt:  'Load time tests, game installation tips and the cheapest way to upgrade your storage for the biggest gain.',
    tag:      'Storage Guide',
    tagColor: 'gray' as const,
    date:     'Mar 28, 2025',
    readTime: '4 min read',
  },
]

const sidebarCategories = [
  { label: 'Game Guides',       href: '/blog/category/guides',     count: 9,  color: 'var(--orange)' },
  { label: 'Performance Tips',  href: '/blog',                     count: 7,  color: 'var(--mint)' },
  { label: 'Hardware Reviews',  href: '/blog',                     count: 5,  color: 'var(--blue)' },
  { label: 'Tier Lists',        href: '/tier-lists',               count: 4,  color: '#C6A864' },
  { label: 'All articles',      href: '/blog',                     count: 28, color: 'var(--t3)' },
]

const popularPosts = [
  { title: 'RTX 4060 Ti vs RX 7700 XT — Best Mid-Range GPU 2025',     slug: 'rtx-4060-ti-vs-rx-7700-xt' },
  { title: 'Best Budget Gaming PC Build Under $600',                    slug: 'best-budget-gaming-pc-build-2025' },
  { title: '1440p vs 4K — Is 4K Worth It Yet?',                        slug: '1440p-vs-4k-gaming-2025' },
  { title: 'How Much RAM Do You Actually Need in 2025?',               slug: 'how-much-ram-gaming-2025' },
]

export default function PCBuildingCategoryPage() {
  return (
    <BlogCategoryListing
      categoryLabel="PC Build Guides"
      categorySlug="pc-building"
      categoryColor="var(--blue)"
      categoryColorBg="rgba(80,140,255,0.08)"
      categoryColorBd="rgba(80,140,255,0.2)"
      description="Everything you need to build, upgrade, and optimise your gaming PC. Tested advice, no fluff — updated for 2025."
      articleCount={12}
      articles={articles}
      sidebarCategories={sidebarCategories}
      popularPosts={popularPosts}
    />
  )
}
