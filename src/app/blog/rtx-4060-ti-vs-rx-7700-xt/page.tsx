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
  ArticleCompTable,
  ArticleTags,
  ArticleShareBar,
  ArticleSidebarTools,
  ArticleSidebarRelated,
  ArticleSidebarNewsletter,
} from '@/components/article'
import { siteConfig } from '@/lib/config'

export const metadata: Metadata = {
  title: `RTX 4060 Ti vs RX 7700 XT — Which Should You Buy? | ${siteConfig.name}`,
  description:
    'Head-to-head benchmark comparison of the RTX 4060 Ti vs RX 7700 XT at 1080p and 1440p. Find out which GPU wins for your budget.',
}

const TOC = [
  { id: 'specs',        label: 'Specs comparison' },
  { id: 'benchmarks',   label: 'Benchmark results' },
  { id: 'features',     label: 'Features: DLSS vs FSR' },
  { id: 'price-value',  label: 'Price and value' },
  { id: 'verdict',      label: 'Verdict — which to buy' },
]

const COMP_ROWS = [
  { name: 'RTX 4060 Ti',  fps: '89 fps',  fpsGood: true,  vram: '8 GB',  price: '$399', verdict: 'DLSS 3 + Ray Tracing', verdictGood: true  },
  { name: 'RX 7700 XT',   fps: '93 fps',  fpsGood: true,  vram: '12 GB', price: '$349', verdict: 'Best value pick',       verdictGood: true  },
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
    category: 'PC Building',
    categoryColor: 'var(--mint)',
    title: '1440p vs 4K gaming — is the upgrade worth it in 2025?',
    readTime: '7 min',
    date: 'May 2025',
    slug: '1440p-vs-4k-gaming-2025',
  },
]

export default function ArticlePage() {
  const articleUrl = `${siteConfig.url}/blog/rtx-4060-ti-vs-rx-7700-xt`
  const articleTitle = 'RTX 4060 Ti vs RX 7700 XT — which should you buy?'

  return (
    <>
      <ArticleBreadcrumb
        category="GPU Guide"
        categoryHref="/blog/category/gpu-guide"
        title="RTX 4060 Ti vs RX 7700 XT — which should you buy?"
      />

      <ArticleHero
        tags={[
          { label: 'GPU Guide',   color: 'mint' },
          { label: 'PC Building', color: 'blue' },
        ]}
        publishedAt="Mar 2025"
        readTime="9 min read"
        title={
          <>
            <span className="text-[var(--mint)]">RTX 4060 Ti</span> vs{' '}
            <span className="text-[var(--mint)]">RX 7700 XT</span> —{' '}
            which should you buy?
          </>
        }
        subtitle="Head-to-head at 1080p and 1440p across 10 games. We break down benchmarks, features, and value so you can decide."
        authorInitials="ZT"
        authorName="Zarynx Team"
        authorNote="Reviewed by hardware editors"
        views="22k"
        comments={17}
      />

      <div className="px-4 sm:px-6">
        <div className="mx-auto grid max-w-[860px] grid-cols-1 items-start gap-5 py-5 lg:grid-cols-[1fr_220px]">
          <article>
            <ArticleToc items={TOC} />

            <ArticleSectionHeading id="specs">Specs comparison</ArticleSectionHeading>
            <ArticleProse>
              The RTX 4060 Ti uses Nvidia Ada Lovelace architecture with 8 GB of GDDR6 VRAM on a
              128-bit bus, priced at $399. The RX 7700 XT uses AMD RDNA 3 with{' '}
              <strong className="text-[var(--t1)]">12 GB of GDDR6</strong> on a 192-bit bus at $349.
              The 4 GB VRAM advantage and wider memory bus of the RX 7700 XT are significant
              differences that show up clearly in modern titles.
            </ArticleProse>

            <ArticleSectionHeading id="benchmarks">Benchmark results</ArticleSectionHeading>
            <ArticleProse>
              At 1440p Ultra across 10 games, the RX 7700 XT averaged 93 fps versus 89 fps for the
              RTX 4060 Ti — a modest 4% difference. However in VRAM-heavy titles like Alan Wake 2
              and Cyberpunk 2077, the{' '}
              <strong className="text-[var(--t1)]">RX 7700 XT pulls ahead by 15-20%</strong> due to
              its 12 GB buffer. At 1080p the cards are nearly identical.
            </ArticleProse>

            <ArticleCompTable
              headers={['GPU', 'Avg FPS (1440p)', 'VRAM', 'Price', 'Best for']}
              rows={COMP_ROWS}
            />

            <ArticleToolCta
              icon={<Monitor size={18} strokeWidth={1.7} />}
              title="PC Bottleneck Calculator"
              description="Check if your CPU will hold back either of these GPUs"
              cta="Check now →"
              href="/tools/pc-bottleneck-calculator"
            />

            <ArticleSectionHeading id="features">Features: DLSS vs FSR</ArticleSectionHeading>
            <ArticleProse>
              This is where the RTX 4060 Ti fights back. Nvidia DLSS 3 with Frame Generation is
              genuinely impressive — it can nearly double fps in supported titles while maintaining
              good image quality. AMD FSR 3 is now available in more games and works on any GPU, but
              image quality still trails DLSS at equivalent settings. If you play many DLSS-supported
              titles, the 4060 Ti becomes much more competitive despite lower raw performance.
            </ArticleProse>
            <ArticleCallout label="Key point">
              DLSS 3 Frame Generation only works on RTX 40-series cards. If your game library
              heavily features DLSS 3 titles, the RTX 4060 Ti gains a meaningful advantage.
            </ArticleCallout>

            <ArticleSectionHeading id="price-value">Price and value</ArticleSectionHeading>
            <ArticleProse>
              At $349 vs $399, the RX 7700 XT is{' '}
              <strong className="text-[var(--t1)]">$50 cheaper and slightly faster</strong> in most
              games. The value maths clearly favour AMD. The only reason to pay the Nvidia premium
              is if DLSS 3, ray tracing performance, or Nvidia-specific features matter to you.
            </ArticleProse>

            <ArticleSectionHeading id="verdict">Verdict — which to buy</ArticleSectionHeading>
            <ArticleProse>
              Buy the <strong className="text-[var(--t1)]">RX 7700 XT</strong> if you want the best
              raw performance per dollar, play VRAM-hungry titles, or do not need DLSS. Buy the{' '}
              <strong className="text-[var(--t1)]">RTX 4060 Ti</strong> if you play many DLSS 3
              supported titles, use Nvidia features like Broadcast or Shadowplay, or want the best
              ray tracing at this price point.
            </ArticleProse>

            <ArticleTags tags={['RTX 4060 Ti', 'RX 7700 XT', 'GPU Comparison', 'PC Building', 'Benchmark']} />
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
