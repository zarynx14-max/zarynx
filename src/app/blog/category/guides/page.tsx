import type { Metadata } from 'next'
import { siteConfig } from '@/lib/config'
import { BlogCategoryListing } from '@/components/sections/BlogCategoryListing'

export const metadata: Metadata = {
  title: `Game Guides — Tips, Builds & Tier Lists | ${siteConfig.name}`,
  description:
    'In-depth game guides for Valorant, CS2, Elden Ring, Fortnite, Marvel Rivals and more. Sensitivity tips, build guides, tier lists — all free and updated for 2025.',
  openGraph: {
    title: `Game Guides — Tips, Builds & Tier Lists | ${siteConfig.name}`,
    description: 'In-depth game guides for Valorant, CS2, Elden Ring, Fortnite, Marvel Rivals and more. All free, updated for 2025.',
    url: `${siteConfig.url}/blog/category/guides`,
  },
}

const articles = [
  {
    slug:     'valorant-sensitivity-guide',
    title:    'Valorant Sensitivity Guide — Find Your Perfect Settings in 2025',
    excerpt:  'The exact sensitivity settings used by pro players and how to find what works best for your playstyle and mouse.',
    tag:      'Valorant',
    tagColor: 'orange' as const,
    date:     'May 10, 2025',
    readTime: '7 min read',
    featured: true,
  },
  {
    slug:     'marvel-rivals-tier-list-season-2',
    title:    'Marvel Rivals Tier List — Best Heroes in Season 2',
    excerpt:  'Full hero tier list for Season 2 based on win rates, pro picks and community meta. Updated after the latest patch.',
    tag:      'Marvel Rivals',
    tagColor: 'blue' as const,
    date:     'May 5, 2025',
    readTime: '5 min read',
  },
  {
    slug:     'elden-ring-beginner-build-2025',
    title:    'Best Elden Ring Beginner Build — Complete Guide for New Players',
    excerpt:  'The easiest and most powerful starting build for Elden Ring. Stats, weapons, talismans and tips for getting through early game.',
    tag:      'Elden Ring',
    tagColor: 'mint' as const,
    date:     'Apr 28, 2025',
    readTime: '9 min read',
  },
  {
    slug:     'cs2-crosshair-settings-guide',
    title:    'CS2 Crosshair Settings — Copy Pro Player Crosshairs 2025',
    excerpt:  'The best CS2 crosshair codes from top pro players and how to customize your own for better visibility.',
    tag:      'CS2',
    tagColor: 'orange' as const,
    date:     'Apr 20, 2025',
    readTime: '5 min read',
  },
  {
    slug:     'game-pass-worth-it-2025',
    title:    'Is Game Pass Worth It in 2025? Full Cost Breakdown',
    excerpt:  'We did the math comparing Game Pass vs buying individual games. The answer might surprise you.',
    tag:      'Game Pass',
    tagColor: 'blue' as const,
    date:     'Apr 12, 2025',
    readTime: '6 min read',
  },
  {
    slug:     'fortnite-settings-guide-2025',
    title:    'Best Fortnite Settings for High FPS and Better Aim in 2025',
    excerpt:  'Graphics settings, keybinds, and sensitivity tips to get the most out of Fortnite in Chapter 6.',
    tag:      'Fortnite',
    tagColor: 'mint' as const,
    date:     'Apr 5, 2025',
    readTime: '6 min read',
  },
  {
    slug:     'valorant-agent-tier-list-2025',
    title:    'Valorant Agent Tier List — Best Agents in Episode 9 2025',
    excerpt:  'Full agent tier list updated for Episode 9. S-tier to D-tier with reasoning for every agent placement.',
    tag:      'Valorant',
    tagColor: 'orange' as const,
    date:     'Mar 30, 2025',
    readTime: '8 min read',
  },
]

const sidebarCategories = [
  { label: 'PC Build Guides',  href: '/blog/category/pc-building', count: 12, color: 'var(--blue)' },
  { label: 'Performance Tips', href: '/blog',                      count: 7,  color: 'var(--mint)' },
  { label: 'Hardware Reviews', href: '/blog',                      count: 5,  color: 'var(--blue)' },
  { label: 'Tier Lists',       href: '/tier-lists',                count: 4,  color: '#C6A864' },
  { label: 'All articles',     href: '/blog',                      count: 28, color: 'var(--t3)' },
]

const popularPosts = [
  { title: 'Valorant Sensitivity Guide — Find Your Perfect Settings', slug: 'valorant-sensitivity-guide' },
  { title: 'Marvel Rivals Tier List — Best Heroes Season 2',          slug: 'marvel-rivals-tier-list-season-2' },
  { title: 'Best Elden Ring Beginner Build 2025',                     slug: 'elden-ring-beginner-build-2025' },
  { title: 'Is Game Pass Worth It in 2025?',                          slug: 'game-pass-worth-it-2025' },
]

export default function GameGuidesCategoryPage() {
  return (
    <BlogCategoryListing
      categoryLabel="Game Guides"
      categorySlug="guides"
      categoryColor="var(--orange)"
      categoryColorBg="rgba(255,120,64,0.08)"
      categoryColorBd="rgba(255,120,64,0.2)"
      description="In-depth guides for Valorant, CS2, Elden Ring, Fortnite, Marvel Rivals and more. Sensitivity tips, build guides, tier lists — all free."
      articleCount={9}
      articles={articles}
      sidebarCategories={sidebarCategories}
      popularPosts={popularPosts}
    />
  )
}
