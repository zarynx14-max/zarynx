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
  title: `How to Avoid a CPU Bottleneck When Upgrading Your GPU | ${siteConfig.name}`,
  description:
    'Upgrading your GPU without checking your CPU first is a costly mistake. Learn how to spot and avoid CPU bottlenecks before you buy.',
}

const TOC = [
  { id: 'what-is-bottleneck',  label: 'What is a CPU bottleneck?' },
  { id: 'how-to-check',        label: 'How to check for a bottleneck' },
  { id: 'common-combos',       label: 'Common bottleneck combinations' },
  { id: 'how-to-fix',          label: 'How to fix or avoid it' },
  { id: 'verdict',             label: 'Summary' },
]

const SIDEBAR_TOOLS = [
  {
    name: 'PC Bottleneck Calculator',
    description: 'Check CPU / GPU balance instantly',
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
    title: '1440p vs 4K gaming — is the upgrade worth it in 2025?',
    readTime: '7 min',
    date: 'May 2025',
    slug: '1440p-vs-4k-gaming-2025',
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
  const articleUrl = `${siteConfig.url}/blog/cpu-bottleneck-gpu-upgrade`
  const articleTitle = 'How to avoid a CPU bottleneck when upgrading your GPU'

  return (
    <>
      <ArticleBreadcrumb
        category="PC Building"
        categoryHref="/blog/category/pc-building"
        title="How to avoid a CPU bottleneck when upgrading your GPU"
      />

      <ArticleHero
        tags={[{ label: 'PC Building', color: 'mint' }]}
        publishedAt="Apr 2025"
        readTime="6 min read"
        title={
          <>
            How to avoid a{' '}
            <span className="text-[var(--mint)]">CPU bottleneck</span>{' '}
            when upgrading your GPU
          </>
        }
        subtitle="Upgrading your GPU without checking your CPU first is a costly mistake. Here is exactly what to look for before you buy."
        authorInitials="ZT"
        authorName="Zarynx Team"
        authorNote="Reviewed by hardware editors"
        views="31k"
        comments={14}
      />

      <div className="px-4 sm:px-6">
        <div className="mx-auto grid max-w-[860px] grid-cols-1 items-start gap-5 py-5 lg:grid-cols-[1fr_220px]">
          <article>
            <ArticleToc items={TOC} />

            <ArticleSectionHeading id="what-is-bottleneck">
              What is a CPU bottleneck?
            </ArticleSectionHeading>
            <ArticleProse>
              A CPU bottleneck happens when your processor cannot feed frames to your GPU fast
              enough. Your GPU sits idle waiting for the CPU to finish its calculations, and your
              in-game FPS is limited by the CPU rather than the graphics card. You end up paying for
              a powerful GPU that never runs at full speed.
            </ArticleProse>
            <ArticleCallout label="Quick check">
              In-game, open Task Manager or MSI Afterburner. If your GPU usage is below 95% while
              your CPU is at 95-100%, you have a CPU bottleneck.
            </ArticleCallout>

            <ArticleSectionHeading id="how-to-check">
              How to check for a bottleneck
            </ArticleSectionHeading>
            <ArticleProse>
              The fastest way is our free PC Bottleneck Calculator — enter your CPU and GPU and it
              tells you instantly. Alternatively, monitor your CPU and GPU usage in-game using MSI
              Afterburner with the RivaTuner overlay. If GPU usage is consistently below 90% in
              demanding games, your CPU is holding it back.
            </ArticleProse>

            <ArticleToolCta
              icon={<Monitor size={18} strokeWidth={1.7} />}
              title="PC Bottleneck Calculator"
              description="Enter your CPU and GPU to check for bottlenecks in seconds — free"
              cta="Check now →"
              href="/tools/pc-bottleneck-calculator"
            />

            <ArticleSectionHeading id="common-combos">
              Common bottleneck combinations in 2025
            </ArticleSectionHeading>
            <ArticleProse>
              The most common bottlenecks we see are old Intel 8th/9th gen processors paired with
              new RTX 40-series cards. An{' '}
              <strong className="text-[var(--t1)]">i7-8700K with an RTX 4070</strong> will bottleneck
              heavily at 1080p. Similarly, a Ryzen 5 1600 paired with an RTX 4060 Ti will cap your
              performance well below what the GPU can deliver. At 1440p and 4K, bottlenecks matter
              less because the GPU becomes the limiting factor naturally.
            </ArticleProse>

            <ArticleSectionHeading id="how-to-fix">
              How to fix or avoid it
            </ArticleSectionHeading>
            <ArticleProse>
              If you already have a bottleneck, you have three options. First, play at a higher
              resolution (1440p or 4K) — this shifts the load to the GPU and reduces the bottleneck
              effect. Second, enable your game engine settings that are more CPU-light (lower NPC
              count, draw distance). Third, upgrade your CPU — but only if the bottleneck is above
              15-20%, otherwise the FPS gain will not justify the cost.
            </ArticleProse>
            <ArticleCallout variant="warn" label="Before you buy">
              Always check bottleneck percentage before purchasing a new GPU. A 15% bottleneck is
              acceptable. Above 30% means you will waste a significant portion of your new
              GPU investment.
            </ArticleCallout>

            <ArticleSectionHeading id="verdict">Summary</ArticleSectionHeading>
            <ArticleProse>
              Run our Bottleneck Calculator before every GPU purchase. If your bottleneck is under
              15%, go ahead and upgrade the GPU. If it is above 20-25%, consider upgrading both CPU
              and GPU together for the best performance per dollar.
            </ArticleProse>

            <ArticleTags tags={['CPU Bottleneck', 'GPU Upgrade', 'PC Building', 'Performance', 'FPS']} />
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
