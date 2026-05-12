'use client'

import { Copy, Download, Share2 } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export interface ResultBar {
  label: string
  value: number
  displayValue: string
  color: string
}

export interface ToolResultProps {
  score: string
  scoreLabel: string
  scoreColor?: string
  status: string
  statusColor?: string
  verdict: string
  verdictColor?: 'mint' | 'orange' | 'blue'
  bars?: ResultBar[]
  scalePosition?: number  // 0-100 where marker sits on scale
  scaleLabels?: string[]
  timestamp?: string
}

const verdictStyles = {
  mint:   { bg: 'rgba(0,229,160,0.08)',  border: 'rgba(0,229,160,0.2)',  color: 'var(--mint)'   },
  orange: { bg: 'rgba(255,120,64,0.08)', border: 'rgba(255,120,64,0.2)', color: 'var(--orange)' },
  blue:   { bg: 'rgba(80,140,255,0.08)', border: 'rgba(80,140,255,0.2)', color: 'var(--blue)'   },
}

export function ToolResult({
  score,
  scoreLabel,
  scoreColor = 'var(--mint)',
  status,
  statusColor = 'var(--mint)',
  verdict,
  verdictColor = 'mint',
  bars = [],
  scalePosition = 20,
  scaleLabels = ['Excellent', 'Good', 'Fair', 'Poor'],
  timestamp,
}: ToolResultProps) {
  const [copied, setCopied] = useState(false)
  const vs = verdictStyles[verdictColor]

  function handleCopy() {
    navigator.clipboard.writeText(`${score} ${scoreLabel} — ${verdict} | zarynx.com`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleShare(platform: 'x' | 'reddit') {
    const text = encodeURIComponent(`My result: ${score} ${scoreLabel} — ${verdict}`)
    const url = encodeURIComponent(window.location.href)
    if (platform === 'x') {
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank')
    } else {
      window.open(`https://reddit.com/submit?url=${url}&title=${text}`, '_blank')
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg2)]">

      {/* Top — score + bars */}
      <div className="border-b border-[var(--border)] p-6">

        {/* Score row */}
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="text-[52px] font-medium leading-none" style={{ color: scoreColor }}>
              {score}
            </div>
            <div className="mt-1 text-[13px] text-[var(--t3)]">{scoreLabel}</div>
          </div>
          <div className="text-right">
            {timestamp && (
              <p className="mb-1 text-[11px] text-[var(--t3)]">{timestamp}</p>
            )}
            <p className="text-[13px] font-medium" style={{ color: statusColor }}>{status}</p>
          </div>
        </div>

        {/* Bars */}
        {bars.length > 0 && (
          <div className="mb-5 flex flex-col gap-[10px]">
            {bars.map(bar => (
              <div key={bar.label} className="flex flex-col gap-[5px]">
                <div className="flex justify-between text-[12px] text-[var(--t3)]">
                  <span>{bar.label}</span>
                  <span style={{ color: bar.color }}>{bar.displayValue}</span>
                </div>
                <div className="h-[5px] overflow-hidden rounded-full bg-[var(--bg3)]">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${bar.value}%`, background: bar.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Scale */}
        <div>
          <p className="mb-[6px] text-[11px] text-[var(--t3)]">Result interpretation</p>
          <div className="relative mb-1 h-[6px] overflow-visible rounded-full"
            style={{ background: 'linear-gradient(to right,#00E5A0,#508CFF,#FF7840,#FF5555)' }}
          >
            <div
              className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--mint)] bg-white"
              style={{ left: `${scalePosition}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-[var(--t3)]">
            {scaleLabels.map(l => <span key={l}>{l}</span>)}
          </div>
        </div>
      </div>

      {/* Bottom — verdict + actions */}
      <div className="p-5">
        {/* Verdict pill */}
        <div
          className="mb-4 rounded-[8px] border px-[14px] py-[10px] text-[13px] leading-[1.5]"
          style={{ background: vs.bg, borderColor: vs.border, color: vs.color }}
        >
          {verdict}
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-[5px] rounded-[7px] border border-[var(--border)] bg-[var(--bg3)] px-[14px] py-[8px] text-[12px] text-[var(--t2)] transition-all hover:border-[var(--border2)] hover:text-[var(--t1)]"
          >
            <Copy size={12} />
            {copied ? 'Copied!' : 'Copy result'}
          </button>
          <button
            className="flex items-center gap-[5px] rounded-[7px] border border-[var(--border)] bg-[var(--bg3)] px-[14px] py-[8px] text-[12px] text-[var(--t2)] transition-all hover:border-[var(--border2)] hover:text-[var(--t1)]"
          >
            <Download size={12} />
            Save image
          </button>
          <button
            onClick={() => handleShare('reddit')}
            className="flex items-center gap-[5px] rounded-[7px] border border-[rgba(255,120,64,0.2)] bg-[var(--bg3)] px-[14px] py-[8px] text-[12px] text-[var(--orange)] transition-all hover:border-[rgba(255,120,64,0.4)]"
          >
            <Share2 size={12} />
            Reddit
          </button>
          <button
            onClick={() => handleShare('x')}
            className="flex items-center gap-[5px] rounded-[7px] border border-[var(--border)] bg-[var(--bg3)] px-[14px] py-[8px] text-[12px] text-[var(--t2)] transition-all hover:border-[var(--border2)] hover:text-[var(--t1)]"
          >
            <Share2 size={12} />
            Share on X
          </button>
        </div>
      </div>
    </div>
  )
}
