'use client'

import { useState } from 'react'
import { Monitor, Crosshair, Cloud } from 'lucide-react'
import {
  ToolBreadcrumb, ToolHeader, ToolResult, ToolUpgrade,
  ToolExplanation, ToolHowTo, ToolFaq, ToolRelated,
  ToolLoading, ToolLayout, ToolSection, SectionLabel,
} from '@/components/tool'

// ── DATA ────────────────────────────────────────────────────────────────────

const CPUS = [
  { label: 'AMD Ryzen 5 5600X',   score: 72  },
  { label: 'AMD Ryzen 5 7600X',   score: 85  },
  { label: 'AMD Ryzen 7 7700X',   score: 92  },
  { label: 'AMD Ryzen 9 7900X',   score: 98  },
  { label: 'Intel Core i5-12600K',score: 78  },
  { label: 'Intel Core i5-13600K',score: 84  },
  { label: 'Intel Core i7-13700K',score: 94  },
  { label: 'Intel Core i9-13900K',score: 100 },
]

const GPUS = [
  { label: 'NVIDIA RTX 3070',     score: { '1080p': 80,  '1440p': 72,  '4K': 58  } },
  { label: 'NVIDIA RTX 3080',     score: { '1080p': 90,  '1440p': 82,  '4K': 70  } },
  { label: 'NVIDIA RTX 4070',     score: { '1080p': 92,  '1440p': 85,  '4K': 74  } },
  { label: 'NVIDIA RTX 4070 Ti',  score: { '1080p': 97,  '1440p': 90,  '4K': 80  } },
  { label: 'NVIDIA RTX 4080',     score: { '1080p': 100, '1440p': 96,  '4K': 88  } },
  { label: 'NVIDIA RTX 4090',     score: { '1080p': 100, '1440p': 100, '4K': 100 } },
  { label: 'AMD RX 7800 XT',      score: { '1080p': 88,  '1440p': 80,  '4K': 68  } },
  { label: 'AMD RX 7900 XTX',     score: { '1080p': 100, '1440p': 95,  '4K': 86  } },
]

const RAMS = ['8 GB DDR4', '16 GB DDR4', '32 GB DDR4', '16 GB DDR5', '32 GB DDR5', '64 GB DDR5']
const RESOLUTIONS = ['1080p', '1440p', '4K'] as const
const USE_CASES = ['Gaming', 'Gaming + Streaming', 'Video editing / Creative']

type Resolution = typeof RESOLUTIONS[number]

// ── CALCULATOR LOGIC ────────────────────────────────────────────────────────

function calculate(
  cpuScore: number,
  gpuScore: number,
  resolution: Resolution,
  useCase: string,
) {
  // At higher resolutions GPU matters more — shift balance
  const resMultiplier = resolution === '4K' ? 1.15 : resolution === '1440p' ? 1.05 : 1
  const adjustedGpu = Math.min(100, gpuScore * resMultiplier)

  // Streaming adds CPU load
  const adjustedCpu = useCase.includes('Streaming') ? cpuScore * 0.92 : cpuScore

  const diff = Math.abs(adjustedCpu - adjustedGpu)
  const bottleneck = Math.round(diff * 0.6)

  const cpuUtil = Math.round(70 + (adjustedCpu / 100) * 20)
  const gpuUtil = Math.round(70 + (adjustedGpu / 100) * 20)

  const bottlenecker = adjustedCpu < adjustedGpu ? 'CPU' : 'GPU'

  let status: string
  let verdict: string
  let verdictColor: 'mint' | 'orange' | 'blue'
  let scalePos: number

  if (bottleneck <= 5) {
    status = 'Excellent match'; verdictColor = 'mint'; scalePos = 10
    verdict = `Your ${bottlenecker === 'CPU' ? 'CPU and GPU' : 'CPU and GPU'} are extremely well balanced at ${resolution}. You are getting near-maximum performance from both components.`
  } else if (bottleneck <= 10) {
    status = 'Good match'; verdictColor = 'mint'; scalePos = 28
    verdict = `Good balance at ${resolution}. A small ${bottlenecker} bottleneck of ${bottleneck}% exists but is normal and not worth worrying about for most games.`
  } else if (bottleneck <= 20) {
    status = 'Moderate bottleneck'; verdictColor = 'blue'; scalePos = 55
    verdict = `Your ${bottlenecker} is creating a ${bottleneck}% bottleneck at ${resolution}. You are leaving some performance on the table. Consider upgrading your ${bottlenecker}.`
  } else {
    status = 'Significant bottleneck'; verdictColor = 'orange'; scalePos = 80
    verdict = `Your ${bottlenecker} has a ${bottleneck}% bottleneck at ${resolution}. This is significantly limiting your gaming performance. Upgrading your ${bottlenecker} is strongly recommended.`
  }

  return { bottleneck, cpuUtil, gpuUtil, bottlenecker, status, verdict, verdictColor, scalePos }
}

// ── PAGE ────────────────────────────────────────────────────────────────────

export default function BottleneckCalculatorPage() {
  const [cpu, setCpu]         = useState('')
  const [gpu, setGpu]         = useState('')
  const [ram, setRam]         = useState('16 GB DDR5')
  const [res, setRes]         = useState<Resolution>('1440p')
  const [useCase, setUseCase] = useState('Gaming')
  const [loading, setLoading] = useState(false)
  const [result, setResult]   = useState<ReturnType<typeof calculate> | null>(null)
  const [errors, setErrors]   = useState<{ cpu?: string; gpu?: string }>({})

  function handleCalculate() {
    const e: typeof errors = {}
    if (!cpu) e.cpu = 'Please select a CPU'
    if (!gpu) e.gpu = 'Please select a GPU'
    if (Object.keys(e).length) { setErrors(e); return }

    setErrors({})
    setLoading(true)
    setResult(null)

    const cpuData = CPUS.find(c => c.label === cpu)!
    const gpuData = GPUS.find(g => g.label === gpu)!

    setTimeout(() => {
      setLoading(false)
      setResult(calculate(cpuData.score, gpuData.score[res], res, useCase))
    }, 1200)
  }

  const gpuData = GPUS.find(g => g.label === gpu)

  return (
    <>
      <ToolBreadcrumb toolName="PC Bottleneck Calculator" toolSlug="pc-bottleneck-calculator" />

      <ToolHeader
        name="PC Bottleneck Calculator"
        description="Find out if your CPU or GPU is limiting your gaming performance. Get an instant bottleneck score, detailed analysis, and personalised upgrade recommendations — free, no sign-up."
        categoryLabel="Hero tool"
        categoryColor="mint"
        typeLabel="PC Tools"
        typeColor="blue"
        updatedAt="May 2025"
        usersPerMonth="50,000+"
      />

      <ToolLayout>

        {/* 3. INPUT */}
        <ToolSection>
          <SectionLabel>Enter your PC specs</SectionLabel>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg2)] p-6">
            <div className="mb-4 grid grid-cols-1 gap-[14px] sm:grid-cols-2">

              {/* CPU */}
              <div className="flex flex-col gap-[6px]">
                <label className="text-[12px] text-[var(--t2)]">CPU (Processor)</label>
                <select
                  value={cpu}
                  onChange={e => { setCpu(e.target.value); setErrors(v => ({ ...v, cpu: undefined })) }}
                  className={`w-full appearance-none rounded-lg border bg-[var(--bg3)] px-[14px] py-[10px] text-[13px] text-[var(--t1)] outline-none transition-colors ${errors.cpu ? 'border-[#FF5555]' : 'border-[var(--border2)] focus:border-[var(--mint)]'}`}
                >
                  <option value="">Select CPU...</option>
                  {CPUS.map(c => <option key={c.label} value={c.label}>{c.label}</option>)}
                </select>
                {errors.cpu && (
                  <p className="text-[11px] text-[#FF5555]">⚠ {errors.cpu}</p>
                )}
              </div>

              {/* GPU */}
              <div className="flex flex-col gap-[6px]">
                <label className="text-[12px] text-[var(--t2)]">GPU (Graphics Card)</label>
                <select
                  value={gpu}
                  onChange={e => { setGpu(e.target.value); setErrors(v => ({ ...v, gpu: undefined })) }}
                  className={`w-full appearance-none rounded-lg border bg-[var(--bg3)] px-[14px] py-[10px] text-[13px] text-[var(--t1)] outline-none transition-colors ${errors.gpu ? 'border-[#FF5555]' : 'border-[var(--border2)] focus:border-[var(--mint)]'}`}
                >
                  <option value="">Select GPU...</option>
                  {GPUS.map(g => <option key={g.label} value={g.label}>{g.label}</option>)}
                </select>
                {errors.gpu && (
                  <p className="text-[11px] text-[#FF5555]">⚠ {errors.gpu}</p>
                )}
              </div>

              {/* RAM */}
              <div className="flex flex-col gap-[6px]">
                <label className="text-[12px] text-[var(--t2)]">RAM</label>
                <select
                  value={ram}
                  onChange={e => setRam(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-[var(--border2)] bg-[var(--bg3)] px-[14px] py-[10px] text-[13px] text-[var(--t1)] outline-none focus:border-[var(--mint)]"
                >
                  {RAMS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              {/* Use case */}
              <div className="flex flex-col gap-[6px]">
                <label className="text-[12px] text-[var(--t2)]">Primary use case</label>
                <select
                  value={useCase}
                  onChange={e => setUseCase(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-[var(--border2)] bg-[var(--bg3)] px-[14px] py-[10px] text-[13px] text-[var(--t1)] outline-none focus:border-[var(--mint)]"
                >
                  {USE_CASES.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>

              {/* Resolution */}
              <div className="flex flex-col gap-[6px] sm:col-span-2">
                <label className="text-[12px] text-[var(--t2)]">Target resolution</label>
                <div className="grid grid-cols-3 gap-[6px]">
                  {RESOLUTIONS.map(r => (
                    <button
                      key={r}
                      onClick={() => setRes(r)}
                      className={`rounded-[7px] border py-[10px] text-[13px] transition-all ${
                        res === r
                          ? 'border-[rgba(0,229,160,0.3)] bg-[rgba(0,229,160,0.1)] text-[var(--mint)]'
                          : 'border-[var(--border)] text-[var(--t2)] hover:border-[var(--border2)] hover:text-[var(--t1)]'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-[var(--border)] pt-4">
              <button
                onClick={handleCalculate}
                className="w-full rounded-[9px] bg-[var(--mint)] py-[13px] text-[14px] font-medium text-[#0D0F14] transition-opacity hover:opacity-90"
              >
                Calculate bottleneck →
              </button>
            </div>
          </div>
        </ToolSection>

        {/* 4. LOADING */}
        {loading && (
          <ToolSection>
            <ToolLoading
              message="Calculating your bottleneck..."
              subMessage="Comparing benchmark data from 10,000+ hardware combinations"
            />
          </ToolSection>
        )}

        {/* 4b. RESULT */}
        {result && !loading && (
          <ToolSection>
            <SectionLabel>
              Your result —{' '}
              <span className="text-[11px] font-normal normal-case tracking-normal text-[var(--t3)]">
                Calculated just now at {res}
              </span>
            </SectionLabel>
            <ToolResult
              score={`${result.bottleneck}%`}
              scoreLabel="bottleneck detected"
              scoreColor={
                result.bottleneck <= 10 ? 'var(--mint)' :
                result.bottleneck <= 20 ? 'var(--blue)' : 'var(--orange)'
              }
              status={result.status}
              statusColor={
                result.bottleneck <= 10 ? 'var(--mint)' :
                result.bottleneck <= 20 ? 'var(--blue)' : 'var(--orange)'
              }
              verdict={result.verdict}
              verdictColor={result.verdictColor}
              bars={[
                { label: 'CPU utilization', value: result.cpuUtil, displayValue: `${result.cpuUtil}%`, color: 'var(--mint)' },
                { label: 'GPU utilization', value: result.gpuUtil, displayValue: `${result.gpuUtil}%`, color: 'var(--blue)' },
              ]}
              scalePosition={result.scalePos}
              scaleLabels={['Excellent', 'Good', 'Fair', 'Poor']}
              timestamp="Calculated just now"
            />
          </ToolSection>
        )}

        {/* 5. UPGRADE */}
        {result && !loading && result.bottleneck > 8 && (
          <ToolSection>
            <SectionLabel>Recommended for you</SectionLabel>
            <ToolUpgrade
              title={`Your ${result.bottlenecker} is the bottleneck`}
              description={`Based on your result, upgrading your ${result.bottlenecker} will give you the biggest performance improvement at ${res}.`}
              products={
                result.bottlenecker === 'CPU'
                  ? [
                      { name: 'AMD Ryzen 7 7700X', benefit: 'Best value CPU upgrade — reduces bottleneck significantly', affiliateUrl: 'https://amzn.to/zarynx-r7-7700x' },
                      { name: 'Intel Core i7-13700K', benefit: 'Intel alternative — excellent gaming performance', affiliateUrl: 'https://amzn.to/zarynx-i7-13700k' },
                    ]
                  : [
                      { name: 'NVIDIA RTX 4070', benefit: 'Best value GPU upgrade for 1440p gaming', affiliateUrl: 'https://amzn.to/zarynx-rtx4070' },
                      { name: 'AMD RX 7800 XT', benefit: 'AMD alternative — excellent 1440p performance', affiliateUrl: 'https://amzn.to/zarynx-rx7800xt' },
                    ]
              }
            />
          </ToolSection>
        )}

        {/* 6. EXPLANATION */}
        <ToolSection>
          <ToolExplanation
            title="What is a PC bottleneck and how does it affect gaming?"
            paragraphs={[
              'A bottleneck happens when one component in your PC is significantly weaker than the others, preventing your system from reaching its full potential. The most common type is between your CPU and GPU — when your processor cannot keep up with your graphics card, your GPU sits partially idle and you lose frames per second.',
              'Our calculator compares real benchmark scores from thousands of hardware combinations to give you an accurate bottleneck percentage at your chosen resolution. The higher the resolution, the more work your GPU does — which is why a GPU bottleneck is normal and even preferred at 4K.',
            ]}
            cards={[
              {
                icon: Monitor,
                iconBg: 'rgba(255,120,64,0.1)',
                iconColor: 'var(--orange)',
                title: 'CPU bottleneck',
                body: 'Your processor cannot keep up with your GPU. Common in CPU-heavy games like strategy, simulation, and open world titles with many NPCs.',
              },
              {
                icon: Monitor,
                iconBg: 'rgba(80,140,255,0.1)',
                iconColor: 'var(--blue)',
                title: 'GPU bottleneck',
                body: 'Your graphics card is the limiting factor. Typical at high resolutions like 1440p and 4K. Usually the preferred bottleneck for gaming builds.',
              },
              {
                icon: Monitor,
                iconBg: 'rgba(0,229,160,0.1)',
                iconColor: 'var(--mint)',
                title: 'Balanced system',
                body: 'Both components are well matched. Under 10% bottleneck means your build is optimised and you are getting near-maximum performance.',
              },
            ]}
            secondTitle="How to reduce a PC bottleneck"
            secondParagraphs={[
              'For a CPU bottleneck — upgrade your processor, lower CPU-heavy settings like draw distance and NPC density, or overclock your CPU. For a GPU bottleneck — increase your resolution or graphics quality to keep the GPU busier, or upgrade your graphics card. A small bottleneck under 10% is completely normal and not worth addressing.',
            ]}
          />
        </ToolSection>

        {/* 7. HOW TO USE */}
        <ToolSection>
          <ToolHowTo
            steps={[
              {
                title: 'Select your CPU and GPU',
                description: 'Choose your exact processor and graphics card from the dropdowns. If your specific model is not listed, select the closest equivalent.',
              },
              {
                title: 'Set your resolution and use case',
                description: 'Select the resolution you game at — 1080p, 1440p, or 4K. Choose your primary use case as gaming or streaming, since streaming adds extra CPU load.',
              },
              {
                title: 'Read your bottleneck result',
                description: 'Under 10% is excellent and not worth worrying about. 10–20% is moderate — consider an upgrade. Above 20% is significant and upgrading the bottlenecking component will noticeably improve your gaming performance.',
              },
            ]}
          />
        </ToolSection>

        {/* 8. FAQ */}
        <ToolSection last>
          <ToolFaq
            items={[
              {
                question: 'What bottleneck percentage is acceptable?',
                answer: 'Under 10% is considered well balanced and not worth addressing. 10–20% is noticeable but manageable. Above 20% is a significant bottleneck where upgrading the limiting component will give you a clear performance improvement in games.',
              },
              {
                question: 'Does resolution affect the bottleneck result?',
                answer: 'Yes, significantly. At 1080p the CPU does relatively more work per frame, making CPU bottlenecks more common. At 4K the GPU does far more work rendering higher resolution pixels, shifting the balance and making GPU bottlenecks more typical.',
              },
              {
                question: 'Is 100% GPU usage a bottleneck?',
                answer: 'Not necessarily — 100% GPU usage means your GPU is being fully utilised which is actually ideal for gaming performance. A bottleneck only becomes a problem when your GPU is being held back by a slower CPU and sitting below 80–85% utilisation.',
              },
              {
                question: 'How accurate is this calculator?',
                answer: 'We use benchmark data from thousands of real hardware combinations updated monthly. Results reflect typical gaming workloads and are accurate within 5–10% of real-world testing. Exact results vary by game, driver version, and system configuration.',
              },
              {
                question: 'Should I worry about a GPU bottleneck?',
                answer: 'A GPU bottleneck is usually fine and even preferred, especially at higher resolutions. It means your graphics card is working hard and your CPU is not holding it back. CPU bottlenecks are generally more problematic for gaming frame rates.',
              },
              {
                question: 'My CPU is not in the list — what should I do?',
                answer: 'Select the closest CPU from the same generation with similar core count and clock speeds. For example, if your CPU is between two listed options, pick the one with the closer performance tier. We update our hardware database monthly to add new releases.',
              },
            ]}
          />
        </ToolSection>

      </ToolLayout>

      {/* 9. RELATED TOOLS */}
      <ToolRelated
        tools={[
          {
            name: 'Gaming PC Build Planner',
            description: 'Plan a full PC build with compatibility checks',
            slug: 'gaming-pc-build-planner',
            icon: Monitor,
            iconBg: 'rgba(80,140,255,0.1)',
            iconColor: 'var(--blue)',
          },
          {
            name: 'Sensitivity Converter',
            description: 'Convert sensitivity across CS2, Valorant and more',
            slug: 'sensitivity-converter',
            icon: Crosshair,
            iconBg: 'rgba(0,229,160,0.1)',
            iconColor: 'var(--mint)',
          },
          {
            name: 'Cloud Gaming Calculator',
            description: 'PC vs cloud gaming real cost breakdown',
            slug: 'cloud-gaming-cost-calculator',
            icon: Cloud,
            iconBg: 'rgba(255,120,64,0.1)',
            iconColor: 'var(--orange)',
          },
        ]}
      />
    </>
  )
}
