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
  title: `Marvel Rivals Tier List — Best Heroes Ranked for Season 2 | ${siteConfig.name}`,
  description:
    'Updated Marvel Rivals tier list for Season 2. Every hero ranked from S-tier to D-tier based on current balance patches and competitive play.',
}

const TOC = [
  { id: 's-tier',  label: 'S-Tier — must pick' },
  { id: 'a-tier',  label: 'A-Tier — strong picks' },
  { id: 'b-tier',  label: 'B-Tier — solid options' },
  { id: 'c-tier',  label: 'C-Tier — situational' },
  { id: 'd-tier',  label: 'D-Tier — avoid in ranked' },
  { id: 'changes', label: 'Season 2 changes summary' },
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
    category: 'Game Guides',
    categoryColor: 'var(--blue)',
    title: 'Best Elden Ring build for beginners in 2025 — Vagabond guide',
    readTime: '10 min',
    date: 'May 2025',
    slug: 'elden-ring-beginner-build-2025',
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
  const articleUrl = `${siteConfig.url}/blog/marvel-rivals-tier-list-season-2`
  const articleTitle = 'Marvel Rivals tier list — best heroes ranked for Season 2'

  return (
    <>
      <ArticleBreadcrumb
        category="Tier Lists"
        categoryHref="/blog/category/tier-lists"
        title="Marvel Rivals tier list — best heroes ranked for Season 2"
      />

      <ArticleHero
        tags={[{ label: 'Tier Lists', color: 'orange' }]}
        publishedAt="May 2025"
        readTime="8 min read"
        updated
        title={
          <>
            Marvel Rivals <span className="text-[var(--mint)]">tier list</span> — best heroes ranked for Season 2
          </>
        }
        subtitle="Updated with every Season 2 balance patch. S-tier through D-tier with full reasoning so you know exactly who to pick in ranked."
        authorInitials="ZT"
        authorName="Zarynx Team"
        authorNote="Updated after each patch"
        views="38k"
        comments={44}
      />

      <div className="px-4 sm:px-6">
        <div className="mx-auto grid max-w-[860px] grid-cols-1 items-start gap-5 py-5 lg:grid-cols-[1fr_220px]">
          <article>
            <ArticleToc items={TOC} />

            <ArticleCallout label="Last updated">
              This tier list reflects the Season 2 Week 4 balance patch. We update after every
              significant patch.
            </ArticleCallout>

            <ArticleSectionHeading id="s-tier">S-Tier — must pick</ArticleSectionHeading>
            <ArticleProse>
              <strong className="text-[var(--t1)]">Storm</strong> — Dominant in Season 2 after her
              mobility buffs. Her ultimate controls entire choke points and her damage output is
              unmatched at mid-range. The best hero in the game right now by a clear margin.{' '}
              <strong className="text-[var(--t1)]">Iron Man</strong> — His rework landed perfectly.
              Sustained aerial pressure with excellent burst potential. Counters most dive compositions
              hard.{' '}
              <strong className="text-[var(--t1)]">Luna Snow</strong> — Best support in Season 2.
              Her healing throughput is unmatched and her ult can turn team fights single-handedly.
            </ArticleProse>

            <ArticleSectionHeading id="a-tier">A-Tier — strong picks</ArticleSectionHeading>
            <ArticleProse>
              <strong className="text-[var(--t1)]">Spider-Man</strong> — Still an elite flanker.
              Punishes isolated targets ruthlessly but requires high skill to maximise.{' '}
              <strong className="text-[var(--t1)]">Magneto</strong> — Best frontline tank right now.
              His shield absorbs enormous pressure and his ult displaces entire teams.{' '}
              <strong className="text-[var(--t1)]">Scarlet Witch</strong> — Area denial expert.
              Strong on most maps in Season 2 and very punishing against grouped enemies.
            </ArticleProse>

            <ArticleSectionHeading id="b-tier">B-Tier — solid options</ArticleSectionHeading>
            <ArticleProse>
              <strong className="text-[var(--t1)]">Thor, Black Panther, Mantis, Doctor Strange</strong>{' '}
              — all viable and can carry games in the right hands. Thor received a small nerf to his
              chain lightning but remains a strong pick on enclosed maps. Mantis is a reliable second
              support if Luna is taken.
            </ArticleProse>

            <ArticleSectionHeading id="c-tier">C-Tier — situational</ArticleSectionHeading>
            <ArticleProse>
              <strong className="text-[var(--t1)]">Hawkeye, Hulk, Rocket Raccoon</strong> — viable
              in specific compositions but easily countered. Hulk fell off significantly after his
              Season 2 nerf to rage generation. Only pick these if you have 200+ hours on them and
              know the matchups cold.
            </ArticleProse>

            <ArticleSectionHeading id="d-tier">D-Tier — avoid in ranked</ArticleSectionHeading>
            <ArticleProse>
              <strong className="text-[var(--t1)]">Punisher, Loki</strong> — both undertuned in
              Season 2. Punisher was hit hard by the turret range nerf and struggles against mobile
              heroes. Loki is too gimmick-reliant and gets shut down by players who know the
              matchup. Avoid in any serious ranked game.
            </ArticleProse>
            <ArticleCallout variant="warn" label="Note">
              Tier lists reflect the current patch meta, not hero difficulty. A D-tier hero played
              at mastery level still beats an S-tier hero played poorly.
            </ArticleCallout>

            <ArticleSectionHeading id="changes">Season 2 changes summary</ArticleSectionHeading>
            <ArticleProse>
              The biggest Season 2 shakeups were the Storm mobility buffs (pushed her to S-tier),
              the Hulk rage nerf (dropped him from A to C), and the Iron Man rework (moved him from
              B to S). Punisher turret range was cut by 25%, dropping him from B to D. Luna Snow
              received a 12% healing buff that cemented her as the top support.
            </ArticleProse>

            <ArticleTags tags={['Marvel Rivals', 'Tier List', 'Season 2', 'Meta', 'Hero Rankings']} />
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
