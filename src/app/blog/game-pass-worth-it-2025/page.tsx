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
  title: `Is Game Pass Worth It in 2025? Full Cost Breakdown | ${siteConfig.name}`,
  description:
    'We did the full math on Xbox Game Pass in 2025. Find out if it saves you money based on how you actually play games.',
}

const TOC = [
  { id: 'what-you-get',   label: 'What you get with Game Pass' },
  { id: 'cost-breakdown', label: 'Cost breakdown by tier' },
  { id: 'the-math',       label: 'The math: does it save money?' },
  { id: 'who-its-for',    label: 'Who it is actually for' },
  { id: 'verdict',        label: 'Verdict' },
]

const SIDEBAR_TOOLS = [
  {
    name: 'Game Pass Calculator',
    description: 'Is Game Pass worth it for you?',
    slug: 'game-pass-calculator',
    icon: <CreditCard size={14} strokeWidth={1.7} />,
    iconBg: 'rgba(255,120,64,0.1)',
    iconColor: 'var(--orange)',
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
    name: 'FPS Estimator',
    description: 'Estimate in-game FPS',
    slug: 'fps-estimator',
    icon: <Cpu size={14} strokeWidth={1.7} />,
    iconBg: 'rgba(0,229,160,0.1)',
    iconColor: 'var(--mint)',
  },
]

const SIDEBAR_ARTICLES = [
  {
    category: 'PC Building',
    categoryColor: 'var(--mint)',
    title: 'Best GPU for 1440p gaming in 2025 — full breakdown',
    readTime: '8 min',
    date: 'May 2025',
    slug: 'best-gpu-1440p-gaming-2025',
  },
  {
    category: 'PC Building',
    categoryColor: 'var(--mint)',
    title: '1440p vs 4K gaming — is the upgrade worth it in 2025?',
    readTime: '7 min',
    date: 'May 2025',
    slug: '1440p-vs-4k-gaming-2025',
  },
  {
    category: 'Tier Lists',
    categoryColor: 'var(--orange)',
    title: 'Marvel Rivals tier list — best heroes ranked for Season 2',
    readTime: '8 min',
    date: 'May 2025',
    slug: 'marvel-rivals-tier-list-season-2',
  },
]

export default function ArticlePage() {
  const articleUrl = `${siteConfig.url}/blog/game-pass-worth-it-2025`
  const articleTitle = 'Is Game Pass worth it in 2025? Full cost breakdown'

  return (
    <>
      <ArticleBreadcrumb
        category="Game Pass"
        categoryHref="/blog/category/game-pass"
        title="Is Game Pass worth it in 2025? Full cost breakdown"
      />

      <ArticleHero
        tags={[{ label: 'Game Pass', color: 'orange' }]}
        publishedAt="Apr 2025"
        readTime="6 min read"
        title={
          <>
            Is <span className="text-[var(--mint)]">Game Pass</span> worth it in 2025?{' '}
            Full cost breakdown
          </>
        }
        subtitle="We did the math so you do not have to. Whether Game Pass saves you money depends entirely on how you play — here is the honest breakdown."
        authorInitials="ZT"
        authorName="Zarynx Team"
        authorNote="Reviewed by the Zarynx team"
        views="27k"
        comments={22}
      />

      <div className="px-4 sm:px-6">
        <div className="mx-auto grid max-w-[860px] grid-cols-1 items-start gap-5 py-5 lg:grid-cols-[1fr_220px]">
          <article>
            <ArticleToc items={TOC} />

            <ArticleSectionHeading id="what-you-get">
              What you get with Game Pass
            </ArticleSectionHeading>
            <ArticleProse>
              Xbox Game Pass Ultimate (the top tier) gives you access to over{' '}
              <strong className="text-[var(--t1)]">400+ games</strong> across PC, Xbox console, and
              cloud streaming. Every Xbox first-party game — Halo, Forza, Starfield, Indiana Jones —
              launches day one on Game Pass. You also get EA Play, which adds another 80+ EA titles
              including FIFA, Battlefield, and Mass Effect.
            </ArticleProse>

            <ArticleSectionHeading id="cost-breakdown">
              Cost breakdown by tier
            </ArticleSectionHeading>
            <ArticleProse>
              In 2025 the tiers are: PC Game Pass at $11.99/month (PC only), Xbox Game Pass at
              $14.99/month (console only), and Game Pass Ultimate at $19.99/month (PC + console +
              cloud + EA Play). Annually that is{' '}
              <strong className="text-[var(--t1)]">$144, $180, and $240</strong> respectively. Microsoft
              regularly offers the first month for $1 for new subscribers.
            </ArticleProse>

            <ArticleToolCta
              icon={<CreditCard size={18} strokeWidth={1.7} />}
              title="Game Pass Calculator"
              description="Calculate exactly how much Game Pass saves or costs you based on your habits"
              cta="Calculate now →"
              href="/tools/game-pass-calculator"
            />

            <ArticleSectionHeading id="the-math">
              The math: does it save money?
            </ArticleSectionHeading>
            <ArticleProse>
              If you buy 3 or more full-price games ($70 each) per year that are on Game Pass, the
              subscription pays for itself easily. The average gamer buys 4-5 new games a year —
              meaning Game Pass saves them{' '}
              <strong className="text-[var(--t1)]">$140-$210 annually</strong> versus buying those
              titles outright. However, if you mostly play older games, free-to-play titles, or buy
              games on sale, Game Pass may not be worth the ongoing cost.
            </ArticleProse>
            <ArticleCallout label="Key factor">
              The biggest variable is whether you play Microsoft first-party games. If you do, Game
              Pass almost always wins financially. If you mostly play third-party titles, the value
              depends on which specific games are in the library that month.
            </ArticleCallout>

            <ArticleSectionHeading id="who-its-for">
              Who it is actually for
            </ArticleSectionHeading>
            <ArticleProse>
              Game Pass makes the most sense for players who want to try many games without
              committing full price, players who enjoy Microsoft first-party titles, families with
              multiple players on different devices, and casual gamers who play 1-2 hours a day
              across many titles. It makes less sense for players who finish games quickly and move
              on, players who only play one or two live-service games, and players who always wait
              for deep sales.
            </ArticleProse>

            <ArticleSectionHeading id="verdict">Verdict</ArticleSectionHeading>
            <ArticleProse>
              For most active gamers: yes, Game Pass Ultimate is worth it at $19.99/month. The
              day-one first-party releases alone justify the cost if you play two or more of them
              per year. Use our calculator to plug in your specific habits for a personalised answer.
            </ArticleProse>
            <ArticleCallout variant="warn" label="Watch out">
              Game Pass prices have increased twice since 2022. Factor in future price rises when
              deciding whether to commit to an annual plan.
            </ArticleCallout>

            <ArticleTags tags={['Game Pass', 'Xbox', 'PC Gaming', 'Subscription', 'Value']} />
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
