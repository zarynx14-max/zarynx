import { ExternalLink } from 'lucide-react'

export interface Product {
  name: string
  benefit: string
  affiliateUrl: string
}

interface ToolUpgradeProps {
  title: string
  description: string
  products: Product[]
}

export function ToolUpgrade({ title, description, products }: ToolUpgradeProps) {
  return (
    <div className="rounded-xl border border-[rgba(0,229,160,0.18)] bg-[var(--bg2)] p-5">
      <p className="mb-[10px] text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--mint)]">
        Based on your result
      </p>
      <h3 className="mb-[6px] text-[15px] font-medium text-[var(--t1)]">{title}</h3>
      <p className="mb-4 text-[13px] leading-[1.6] text-[var(--t2)]">{description}</p>

      <div className="mb-3 flex flex-col gap-2">
        {products.map(p => (
          <a
            key={p.name}
            href={p.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex items-center justify-between gap-3 rounded-[9px] border border-[var(--border)] bg-[var(--bg3)] px-4 py-3 transition-colors hover:border-[var(--border2)]"
          >
            <div>
              <p className="mb-[3px] text-[13px] font-medium text-[var(--t1)]">{p.name}</p>
              <p className="text-[11px] text-[var(--t3)]">{p.benefit}</p>
            </div>
            <span className="flex flex-shrink-0 items-center gap-1 rounded-[6px] bg-[var(--orange)] px-3 py-[6px] text-[11px] font-medium text-white">
              View deal
              <ExternalLink size={10} />
            </span>
          </a>
        ))}
      </div>

      <p className="border-t border-[var(--border)] pt-[10px] text-[11px] text-[var(--t3)]">
        We may earn a small commission on purchases at no extra cost to you. This helps keep all tools free.
      </p>
    </div>
  )
}
