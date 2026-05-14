import { Monitor, Activity, CreditCard } from 'lucide-react'
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

// ── Static data ─────────────────────────────────────────────
const TOC = [
  { id: 'what-to-look-for', label: 'What to look for in a 1440p GPU' },
  { id: 'budget',           label: 'Budget picks under $300' },
  { id: 'mid-range',        label: 'Mid-range $300–$500' },
  { id: 'high-end',         label: 'High-end $500+' },
  { id: 'comparison-table', label: 'GPU comparison table' },
  { id: 'recommendation',   label: 'Our top recommendation' },
  { id: 'faq',              label: 'FAQ' },
]

const GPU_ROWS = [
  { name: 'RTX 4070 Super', fps: '118 fps', fpsGood: true,  vram: '12 GB', price: '$599', verdict: 'Best overall',   verdictGood: true  },
  { name: 'RX 7800 XT',     fps: '109 fps', fpsGood: true,  vram: '16 GB', price: '$499', verdict: 'Best value',     verdictGood: true  },
  { name: 'RTX 4060 Ti',    fps: '89 fps',  fpsGood: false, vram: '8 GB',  price: '$399', verdict: 'Good budget',    verdictGood: false },
  { name: 'RX 7700 XT',     fps: '84 fps',  fpsGood: false, vram: '12 GB', price: '$349', verdict: 'Solid mid-range',verdictGood: false },
  { name: 'RTX 3060 Ti',    fps: '76 fps',  fpsGood: false, vram: '8 GB',  price: '$279', verdict: 'Skip — aging',   verdictBad: true   },
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
    icon: <Activity size={14} strokeWidth={1.7} />,
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
    title: 'How to avoid a CPU bottleneck when upgrading your GPU',
    readTime: '6 min',
    date: 'Apr 2025',
    slug: 'cpu-bottleneck-gpu-upgrade',
  },
  {
    category: 'Guides',
    categoryColor: 'var(--blue)',
    title: '1440p vs 4K gaming — is the upgrade worth it in 2025?',
    readTime: '7 min',
    date: 'Mar 2025',
    slug: '1440p-vs-4k-gaming-2025',
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
  const articleUrl = `${siteConfig.url}/blog/best-gpu-1440p-gaming-2025`
  const articleTitle = 'Best GPU for 1440p gaming in 2025 — full breakdown'

  return (
    <>
      {/* Breadcrumb */}
      <ArticleBreadcrumb
        category="PC Building"
        categoryHref="/blog/category/pc-building"
        title="Best GPU for 1440p gaming in 2025"
      />

      {/* Hero */}
      <ArticleHero
        tags={[
          { label: 'PC Building', color: 'mint' },
          { label: 'GPU Guide',   color: 'blue' },
        ]}
        publishedAt="May 12, 2025"
        readTime="8 min read"
        updated
        title={
          <>
            Best GPU for{' '}
            <span className="text-[var(--mint)]">1440p gaming</span>{' '}
            in 2025 —<br />full breakdown and recommendations
          </>
        }
        subtitle="We tested 14 GPUs at 1440p across 10 popular games. Here's exactly which card to buy at every budget — and which ones to skip."
        authorInitials="ZT"
        authorName="Zarynx Team"
        authorNote="Reviewed by hardware editors"
        views="42k"
        comments={18}
      />

      {/* Body: article + sidebar */}
      <div className="px-4 sm:px-6">
        <div className="mx-auto grid max-w-[860px] grid-cols-1 items-start gap-5 py-5 lg:grid-cols-[1fr_220px]">

          {/* ── MAIN ARTICLE ── */}
          <article>
            {/* Table of Contents */}
            <ArticleToc items={TOC} />

            {/* Section 1 */}
            <ArticleSectionHeading id="what-to-look-for">
              What to look for in a 1440p GPU
            </ArticleSectionHeading>
            <ArticleProse>
              At 1440p you need a card that can consistently hit{' '}
              <strong className="text-[var(--t1)]">60+ fps on high settings</strong>, and ideally 100+ fps
              if you have a high-refresh monitor. VRAM matters more at this resolution — we recommend
              nothing below 8 GB, and 12 GB if you play modern open-world titles.
            </ArticleProse>
            <ArticleCallout label="Quick tip">
              Use our free PC Bottleneck Calculator first. If your CPU is already a bottleneck,
              upgrading your GPU alone won't give you the frames you expect.
            </ArticleCallout>

            {/* Tool CTA */}
            <ArticleToolCta
              icon={<Monitor size={18} strokeWidth={1.7} />}
              title="PC Bottleneck Calculator"
              description="Check if your CPU will hold back your new GPU — free, instant"
              cta="Try free →"
              href="/tools/pc-bottleneck-calculator"
            />

            {/* Section 2 */}
            <ArticleSectionHeading id="budget">Budget picks under $300</ArticleSectionHeading>
            <ArticleProse>
              Under $300, the <strong className="text-[var(--t1)]">RTX 3060 Ti</strong> and{' '}
              <strong className="text-[var(--t1)]">RX 7600</strong> are the main contenders. The 3060 Ti
              still holds up in most titles but is showing its age in demanding games with heavy VRAM
              usage. If you can stretch to $320, the RX 7700 XT is a much better investment.
            </ArticleProse>

            {/* Section 3 */}
            <ArticleSectionHeading id="mid-range">Mid-range $300–$500</ArticleSectionHeading>
            <ArticleProse>
              This is where the real value is. The{' '}
              <strong className="text-[var(--t1)]">RX 7800 XT at $499</strong> beats cards costing $100
              more, thanks to its 16 GB of VRAM and strong rasterization performance. The RTX 4060 Ti
              is a solid alternative if you need DLSS or ray tracing.
            </ArticleProse>

            {/* Section 4 */}
            <ArticleSectionHeading id="high-end">High-end $500+</ArticleSectionHeading>
            <ArticleProse>
              At $599, the <strong className="text-[var(--t1)]">RTX 4070 Super</strong> is the best
              all-round card for 1440p gaming. It delivers 100+ fps in virtually every title, supports
              DLSS 3.5, and runs cool and quiet. Step up to the RTX 4070 Ti Super only if you want a
              card that will handle 4K as well.
            </ArticleProse>

            {/* Section 5 – Table */}
            <ArticleSectionHeading id="comparison-table">GPU comparison table</ArticleSectionHeading>
            <ArticleProse>All cards tested at 1440p Ultra, averaged across 10 games.</ArticleProse>
            <ArticleCompTable
              headers={['GPU', 'Avg FPS', 'VRAM', 'Price', 'Verdict']}
              rows={GPU_ROWS}
            />
            <ArticleCallout variant="warn" label="Warning">
              Cards with only 8 GB VRAM are already struggling in Alan Wake 2 and Cyberpunk 2077 at
              Ultra. Budget for 12 GB minimum if you plan to keep this card 2+ years.
            </ArticleCallout>

            {/* Section 6 */}
            <ArticleSectionHeading id="recommendation">Our top recommendation</ArticleSectionHeading>
            <ArticleProse>
              For most 1440p gamers the <strong className="text-[var(--t1)]">RX 7800 XT</strong> is the
              clear winner on value — 16 GB VRAM, strong rasterization, and a $100 price advantage over
              the RTX 4070 Super. If you use DLSS or need ray tracing, the RTX 4070 Super justifies the
              premium.
            </ArticleProse>

            {/* Tags */}
            <ArticleTags
              tags={['GPU', '1440p', 'PC Building', 'RTX 4070', 'RX 7800 XT', 'Benchmark']}
            />

            {/* Share bar */}
            <ArticleShareBar url={articleUrl} title={articleTitle} />
          </article>

          {/* ── SIDEBAR ── */}
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
