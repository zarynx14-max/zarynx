import type { Metadata } from 'next'
import { Monitor, Cpu, CreditCard } from 'lucide-react'
import {
  ArticleBreadcrumb,
  ArticleHero,
  ArticleToc,
  ArticleSectionHeading,
  ArticleProse,
  ArticleCallout,
  ArticleTags,
  ArticleShareBar,
  ArticleSidebarTools,
  ArticleSidebarRelated,
  ArticleSidebarNewsletter,
} from '@/components/article'
import { siteConfig } from '@/lib/config'

export const metadata: Metadata = {
  title: `Best Elden Ring Build for Beginners in 2025 — Vagabond Guide | ${siteConfig.name}`,
  description:
    'New to Elden Ring? This beginner Vagabond build covers stats, weapons, and talismans step by step so you can actually enjoy the game.',
}

const TOC = [
  { id: 'why-vagabond',   label: 'Why Vagabond for beginners' },
  { id: 'stats',          label: 'Stats to level first' },
  { id: 'weapons',        label: 'Best early weapons' },
  { id: 'talismans',      label: 'Talismans to grab early' },
  { id: 'tips',           label: 'Survival tips' },
]

const SIDEBAR_TOOLS = [
  {
    name: 'PC Bottleneck Calculator',
    description: 'Check CPU / GPU balance',
    slug: 'pc-bottleneck-calculator',
    icon: <Monitor size={14} strokeWidth={1.7} />,
    iconBg: 'rgba(0,229,160,0.1)',
    iconColor: 'var(--mint)',
  },
  {
    name: 'FPS Estimator',
    description: 'Estimate in-game FPS',
    slug: 'fps-estimator',
    icon: <Cpu size={14} strokeWidth={1.7} />,
    iconBg: 'rgba(0,229,160,0.1)',
    iconColor: 'var(--mint)',
  },
  {
    name: 'Game Pass Calculator',
    description: 'Is Game Pass worth it?',
    slug: 'game-pass-calculator',
    icon: <CreditCard size={14} strokeWidth={1.7} />,
    iconBg: 'rgba(80,140,255,0.1)',
    iconColor: 'var(--blue)',
  },
]

const SIDEBAR_ARTICLES = [
  {
    category: 'Tier Lists',
    categoryColor: 'var(--orange)',
    title: 'Marvel Rivals tier list — best heroes ranked for Season 2',
    readTime: '8 min',
    date: 'May 2025',
    slug: 'marvel-rivals-tier-list-season-2',
  },
  {
    category: 'Tools',
    categoryColor: 'var(--mint)',
    title: 'How to find your perfect Valorant sensitivity — step-by-step',
    readTime: '5 min',
    date: 'Apr 2025',
    slug: 'valorant-sensitivity-guide',
  },
  {
    category: 'Game Pass',
    categoryColor: 'var(--orange)',
    title: 'Is Game Pass worth it in 2025? Full cost breakdown',
    readTime: '6 min',
    date: 'Apr 2025',
    slug: 'game-pass-worth-it-2025',
  },
]

export default function ArticlePage() {
  const articleUrl = `${siteConfig.url}/blog/elden-ring-beginner-build-2025`
  const articleTitle = 'Best Elden Ring build for beginners in 2025 — Vagabond guide'

  return (
    <>
      <ArticleBreadcrumb
        category="Game Guides"
        categoryHref="/blog/category/game-guides"
        title="Best Elden Ring build for beginners in 2025 — Vagabond guide"
      />

      <ArticleHero
        tags={[{ label: 'Game Guides', color: 'blue' }]}
        publishedAt="May 2025"
        readTime="10 min read"
        title={
          <>
            Best <span className="text-[var(--mint)]">Elden Ring</span> build for beginners in 2025 — Vagabond guide
          </>
        }
        subtitle="New to Elden Ring? The Vagabond class is the most forgiving starting point. Here is everything you need — stats, weapons, and talismans explained simply."
        authorInitials="ZT"
        authorName="Zarynx Team"
        authorNote="Reviewed by the Zarynx team"
        views="14k"
        comments={31}
      />

      <div className="px-4 sm:px-6">
        <div className="mx-auto grid max-w-[860px] grid-cols-1 items-start gap-5 py-5 lg:grid-cols-[1fr_220px]">
          <article>
            <ArticleToc items={TOC} />

            <ArticleSectionHeading id="why-vagabond">Why Vagabond for beginners</ArticleSectionHeading>
            <ArticleProse>
              The Vagabond starts with the highest Vigor (health) and good Strength and Dexterity of
              any class. It also starts with a sword and shield, which is the most intuitive
              playstyle for new players. You can block attacks while you learn enemy patterns instead
              of having to dodge perfectly every time. It is the closest thing Elden Ring has to an
              easy mode starting class.
            </ArticleProse>
            <ArticleCallout label="Beginner tip">
              Always keep your equip load below 70% (medium roll). A fast roll is far more important
              than wearing the heaviest armour. Check your equip load in the Equipment screen.
            </ArticleCallout>

            <ArticleSectionHeading id="stats">Stats to level first</ArticleSectionHeading>
            <ArticleProse>
              Priority order for your first 30-40 levels:{' '}
              <strong className="text-[var(--t1)]">Vigor to 40</strong> first — this is the single
              most important thing a beginner can do. More health means more chances to learn. Then
              level Endurance to 20 for stamina and equip load. After that, pump your main damage
              stat — Strength if you use heavy weapons, Dexterity if you use fast weapons. Do not
              spread points across every stat early on.
            </ArticleProse>

            <ArticleSectionHeading id="weapons">Best early weapons</ArticleSectionHeading>
            <ArticleProse>
              The starting Longsword is actually excellent and will carry you through the first two
              or three bosses. Once you reach Stormveil Castle, look for the{' '}
              <strong className="text-[var(--t1)]">Lordsworn Straight Sword</strong> — it has
              slightly better scaling and the same moveset. For Strength builds, the Grafted Blade
              Greatsword found in Castle Morne (south Weeping Peninsula) is one of the best early
              strength weapons in the game.
            </ArticleProse>
            <ArticleCallout variant="warn" label="Avoid">
              Do not upgrade multiple weapons at once early on. Smithing Stones are limited until
              mid-game. Pick one weapon and upgrade it to +6 or higher before touching anything else.
            </ArticleCallout>

            <ArticleSectionHeading id="talismans">Talismans to grab early</ArticleSectionHeading>
            <ArticleProse>
              The <strong className="text-[var(--t1)]">Erdtree Favor talisman</strong> (raises HP,
              stamina, and equip load) is found in Fringefolk Hero Grave — worth the two Stonesword
              Keys to enter. The{' '}
              <strong className="text-[var(--t1)]">Vigor talisman</strong> from the Dragon-Burnt
              Ruins raises your HP further. Both are accessible within the first two hours of
              the game.
            </ArticleProse>

            <ArticleSectionHeading id="tips">Survival tips</ArticleSectionHeading>
            <ArticleProse>
              Do not run straight to the first boss. Explore Limgrave fully first — you will find
              weapons, runes, and summon ashes that make Margit much easier. Always have Crimson
              Tears (health flasks) at maximum charge by visiting the Church of Elleh flask upgrade
              site. Use Spirit Ashes (summoned allies) for every difficult boss — this is not
              cheating, it is a core game mechanic.
            </ArticleProse>

            <ArticleTags tags={['Elden Ring', 'Game Guides', 'Vagabond', 'Beginner', 'Build Guide']} />
            <ArticleShareBar url={articleUrl} title={articleTitle} />
          </article>

          <aside className="flex flex-col">
            <ArticleSidebarTools tools={SIDEBAR_TOOLS} />
            <ArticleSidebarRelated articles={SIDEBAR_ARTICLES} />
            <ArticleSidebarNewsletter />
          </aside>
        </div>
      </div>
    </>
  )
}
