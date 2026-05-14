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
  title: `1440p vs 4K Gaming — Is the Upgrade Worth It in 2025? | ${siteConfig.name}`,
  description:
    'We ran the numbers on 1440p vs 4K gaming in 2025. Find out if 4K is actually worth the GPU cost for your setup.',
}

const TOC = [
  { id: 'resolution-difference',  label: 'What actually changes at 4K' },
  { id: 'gpu-requirement',        label: 'GPU requirement jump' },
  { id: 'monitor-cost',           label: 'Monitor cost difference' },
  { id: 'real-world-fps',         label: 'Real-world FPS comparison' },
  { id: 'verdict',                label: 'Our verdict' },
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
    title: 'How to avoid a CPU bottleneck when upgrading your GPU',
    readTime: '6 min',
    date: 'Apr 2025',
    slug: 'cpu-bottleneck-gpu-upgrade',
  },
  {
    category: 'GPU Guide',
    categoryColor: 'var(--blue)',
    title: 'RTX 4060 Ti vs RX 7700 XT — which should you buy?',
    readTime: '9 min',
    date: 'Mar 2025',
    slug: 'rtx-4060-ti-vs-rx-7700-xt',
  },
]

export default function ArticlePage() {
  const articleUrl = `${siteConfig.url}/blog/1440p-vs-4k-gaming-2025`
  const articleTitle = '1440p vs 4K gaming — is the upgrade worth it in 2025?'

  return (
    <>
      <ArticleBreadcrumb
        category="PC Building"
        categoryHref="/blog/category/pc-building"
        title="1440p vs 4K gaming — is the upgrade worth it in 2025?"
      />

      <ArticleHero
        tags={[
          { label: 'PC Building', color: 'mint' },
          { label: 'GPU Guide',   color: 'blue' },
        ]}
        publishedAt="May 2025"
        readTime="7 min read"
        title={
          <>
            1440p vs <span className="text-[var(--mint)]">4K gaming</span> —<br />
            is the upgrade worth it in 2025?
          </>
        }
        subtitle="We ran benchmarks on both resolutions across 12 games to answer the question every PC gamer asks before buying a monitor."
        authorInitials="ZT"
        authorName="Zarynx Team"
        authorNote="Reviewed by hardware editors"
        views="18k"
        comments={9}
      />

      <div className="px-4 sm:px-6">
        <div className="mx-auto grid max-w-[860px] grid-cols-1 items-start gap-5 py-5 lg:grid-cols-[1fr_220px]">
          <article>
            <ArticleToc items={TOC} />

            <ArticleSectionHeading id="resolution-difference">
              What actually changes at 4K
            </ArticleSectionHeading>
            <ArticleProse>
              Moving from 1440p (2560×1440) to 4K (3840×2160) means rendering{' '}
              <strong className="text-[var(--t1)]">2.25× more pixels</strong> every frame. Everything
              looks noticeably sharper — especially text, foliage, and fine detail on character models.
              The difference is clearest on monitors 27 inches and above. On a 24-inch screen, most
              people cannot reliably tell the two apart.
            </ArticleProse>
            <ArticleCallout label="Key insight">
              4K only looks meaningfully better if your monitor is 27 inches or larger and you sit
              within 3 feet of it. On smaller screens the sharpness gain is minimal.
            </ArticleCallout>

            <ArticleSectionHeading id="gpu-requirement">
              GPU requirement jump
            </ArticleSectionHeading>
            <ArticleProse>
              This is where 4K gets expensive. To hit a smooth{' '}
              <strong className="text-[var(--t1)]">60 fps at 4K Ultra</strong> in demanding 2025
              titles, you need at minimum an RTX 4070 Ti Super or RX 7900 XTX — cards starting at
              $700–$900. At 1440p, the RTX 4070 Super ($599) or RX 7800 XT ($499) get you 100+ fps
              with ease. That is a significant price gap for a resolution many players cannot even
              perceive on their current monitor.
            </ArticleProse>

            <ArticleToolCta
              icon={<Monitor size={18} strokeWidth={1.7} />}
              title="PC Bottleneck Calculator"
              description="Check if your current CPU can keep up with a 4K-capable GPU"
              cta="Try free →"
              href="/tools/pc-bottleneck-calculator"
            />

            <ArticleSectionHeading id="monitor-cost">
              Monitor cost difference
            </ArticleSectionHeading>
            <ArticleProse>
              A quality 1440p 165 Hz IPS monitor costs $250–$350 in 2025. A comparable 4K 144 Hz
              monitor starts at $500 and quickly climbs past $800 for high-refresh OLED panels. Add
              that to the GPU premium and the total upgrade cost from a solid 1440p setup to a proper
              4K setup is{' '}
              <strong className="text-[var(--t1)]">$700–$1,200 more</strong> for most people.
            </ArticleProse>

            <ArticleSectionHeading id="real-world-fps">
              Real-world FPS comparison
            </ArticleSectionHeading>
            <ArticleProse>
              Across our 12-game test suite with an RTX 4070 Super, average fps at 1440p Ultra was
              112 fps. The same card at 4K Ultra averaged 54 fps — below 60 in several titles. You
              would need to drop settings to Medium/High to hold 60 fps at 4K, which partly defeats
              the purpose of the higher resolution.
            </ArticleProse>
            <ArticleCallout variant="warn" label="Warning">
              If you have a high-refresh 1440p monitor (144 Hz+), downgrading to 60 fps at 4K will
              feel noticeably worse in fast-paced games like Valorant, CS2, and Apex Legends.
            </ArticleCallout>

            <ArticleSectionHeading id="verdict">Our verdict</ArticleSectionHeading>
            <ArticleProse>
              For most gamers in 2025,{' '}
              <strong className="text-[var(--t1)]">1440p at high refresh rate</strong> is the sweet
              spot. You get excellent image quality, smooth gameplay, and a much lower GPU and monitor
              cost. 4K is worth it only if you play slow-paced single-player games, own a 32-inch+ TV
              or monitor, and are willing to invest $700+ more in your setup.
            </ArticleProse>

            <ArticleTags
              tags={['1440p', '4K', 'PC Building', 'GPU', 'Monitor', 'Resolution']}
            />
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
