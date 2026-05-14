import type { Metadata } from 'next'
import { Monitor, Cpu, CreditCard } from 'lucide-react'
import {
  ArticleBreadcrumb,
  ArticleHero,
  ArticleToc,
  ArticleSectionHeading,
  ArticleProse,
  ArticleCallout,
  ArticleToolCta,
  ArticleTags,
  ArticleShareBar,
  ArticleSidebarTools,
  ArticleSidebarRelated,
  ArticleSidebarNewsletter,
} from '@/components/article'
import { siteConfig } from '@/lib/config'

export const metadata: Metadata = {
  title: `How to Find Your Perfect Valorant Sensitivity — Step-by-Step | ${siteConfig.name}`,
  description:
    'Use the sensitivity converter to port your CS2 settings in 30 seconds, then follow this step-by-step guide to dial in your perfect Valorant sensitivity.',
}

const TOC = [
  { id: 'why-sensitivity-matters', label: 'Why sensitivity matters' },
  { id: 'edpi-explained',          label: 'eDPI explained' },
  { id: 'convert-from-cs2',        label: 'Converting from CS2' },
  { id: 'finding-your-sens',       label: 'Finding your ideal sensitivity' },
  { id: 'pro-settings',            label: 'What pros use' },
]

const SIDEBAR_TOOLS = [
  {
    name: 'Sensitivity Converter',
    description: 'Convert sens between games',
    slug: 'sensitivity-converter',
    icon: <Cpu size={14} strokeWidth={1.7} />,
    iconBg: 'rgba(80,140,255,0.1)',
    iconColor: 'var(--blue)',
  },
  {
    name: 'PC Bottleneck Calculator',
    description: 'Check CPU / GPU balance',
    slug: 'pc-bottleneck-calculator',
    icon: <Monitor size={14} strokeWidth={1.7} />,
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
    category: 'Game Guides',
    categoryColor: 'var(--blue)',
    title: 'Best Elden Ring build for beginners in 2025 — Vagabond guide',
    readTime: '10 min',
    date: 'May 2025',
    slug: 'elden-ring-beginner-build-2025',
  },
  {
    category: 'Tier Lists',
    categoryColor: 'var(--orange)',
    title: 'Marvel Rivals tier list — best heroes ranked for Season 2',
    readTime: '8 min',
    date: 'May 2025',
    slug: 'marvel-rivals-tier-list-season-2',
  },
  {
    category: 'PC Building',
    categoryColor: 'var(--mint)',
    title: 'Best GPU for 1440p gaming in 2025 — full breakdown',
    readTime: '8 min',
    date: 'May 2025',
    slug: 'best-gpu-1440p-gaming-2025',
  },
]

export default function ArticlePage() {
  const articleUrl = `${siteConfig.url}/blog/valorant-sensitivity-guide`
  const articleTitle = 'How to find your perfect Valorant sensitivity — step-by-step'

  return (
    <>
      <ArticleBreadcrumb
        category="Tools"
        categoryHref="/blog/category/tools"
        title="How to find your perfect Valorant sensitivity — step-by-step"
      />

      <ArticleHero
        tags={[
          { label: 'Tools',    color: 'mint' },
          { label: 'Valorant', color: 'blue' },
        ]}
        publishedAt="Apr 2025"
        readTime="5 min read"
        title={
          <>
            How to find your perfect{' '}
            <span className="text-[var(--mint)]">Valorant sensitivity</span> — step-by-step
          </>
        }
        subtitle="Use the sensitivity converter to port your CS2 settings in 30 seconds, then follow these steps to fine-tune for Valorant specifically."
        authorInitials="ZT"
        authorName="Zarynx Team"
        authorNote="Reviewed by the Zarynx team"
        views="19k"
        comments={11}
      />

      <div className="px-4 sm:px-6">
        <div className="mx-auto grid max-w-[860px] grid-cols-1 items-start gap-5 py-5 lg:grid-cols-[1fr_220px]">
          <article>
            <ArticleToc items={TOC} />

            <ArticleSectionHeading id="why-sensitivity-matters">
              Why sensitivity matters
            </ArticleSectionHeading>
            <ArticleProse>
              In a game like Valorant where a single bullet decides rounds, mouse sensitivity
              directly affects your aim consistency. Too high and your crosshair overshoots targets.
              Too low and you cannot flick fast enough. The goal is finding a sensitivity you can
              use the same way every single game — muscle memory built on a consistent setting beats
              any specific number.
            </ArticleProse>

            <ArticleSectionHeading id="edpi-explained">eDPI explained</ArticleSectionHeading>
            <ArticleProse>
              eDPI (effective DPI) = your mouse DPI multiplied by your in-game sensitivity. It
              lets you compare sensitivities across different hardware setups. Most Valorant pros
              play between{' '}
              <strong className="text-[var(--t1)]">200 and 400 eDPI</strong>. If your eDPI is above
              600, you are likely playing too high. Below 150 and you may struggle with fast
              flick shots.
            </ArticleProse>
            <ArticleCallout label="Formula">
              eDPI = Mouse DPI x In-game Sensitivity. Example: 800 DPI x 0.35 sens = 280 eDPI.
            </ArticleCallout>

            <ArticleToolCta
              icon={<Cpu size={18} strokeWidth={1.7} />}
              title="Sensitivity Converter"
              description="Convert your CS2, Apex, or Overwatch sensitivity to Valorant instantly"
              cta="Convert now →"
              href="/tools/sensitivity-converter"
            />

            <ArticleSectionHeading id="convert-from-cs2">
              Converting from CS2
            </ArticleSectionHeading>
            <ArticleProse>
              Valorant and CS2 use different sensitivity multipliers. CS2 sensitivity 1.0 at 400
              DPI equals approximately{' '}
              <strong className="text-[var(--t1)]">Valorant sensitivity 3.18</strong> at 400 DPI.
              Use our Sensitivity Converter above to get the exact number — paste your CS2 settings
              and it outputs your Valorant equivalent instantly.
            </ArticleProse>

            <ArticleSectionHeading id="finding-your-sens">
              Finding your ideal sensitivity
            </ArticleSectionHeading>
            <ArticleProse>
              Start with your converted sensitivity or a 400 eDPI if starting fresh. Play 10
              deathmatch games without changing anything. If you consistently overshoot heads,
              lower by 10%. If you consistently undershoot, raise by 10%. Repeat until aiming
              feels natural. Give each setting at least 5 hours before judging — your muscles need
              time to adapt.
            </ArticleProse>
            <ArticleCallout variant="warn" label="Important">
              Do not change your sensitivity every day. Pick a setting and commit to it for at
              least one week. Frequent changes reset your muscle memory and will make your aim
              worse, not better.
            </ArticleCallout>

            <ArticleSectionHeading id="pro-settings">What pros use</ArticleSectionHeading>
            <ArticleProse>
              Most Valorant pros play between 800 DPI and 1600 DPI with low in-game sensitivity to
              land between 200-400 eDPI. TenZ plays 800 DPI at 0.408 sens (326 eDPI). Aspas plays
              800 DPI at 0.43 (344 eDPI). These are reference points, not targets — your hand size,
              mousepad size, and playstyle all affect what works for you.
            </ArticleProse>

            <ArticleTags tags={['Valorant', 'Sensitivity', 'CS2', 'Aim', 'Mouse Settings']} />
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
