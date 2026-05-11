import Link from 'next/link'
import { footerLinks } from '@/lib/config'

const socialLinks = [
  { label: 'X',  href: 'https://twitter.com/zarynx' },
  { label: 'YT', href: 'https://youtube.com/@zarynx' },
  { label: 'DC', href: 'https://discord.gg/zarynx' },
]

const footerSections = [
  { title: 'Tools',   links: footerLinks.tools },
  { title: 'Games',   links: footerLinks.games },
  { title: 'Content', links: footerLinks.content },
  { title: 'Zarynx',  links: footerLinks.company },
]

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Link grid */}
        <div className="mb-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {footerSections.map(section => (
            <div key={section.title}>
              <p className="mb-[10px] text-[10px] font-medium uppercase tracking-[0.07em] text-[var(--t2)]">
                {section.title}
              </p>
              <ul className="space-y-[7px]">
                {section.links.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="block text-[12px] text-[var(--t3)] transition-colors hover:text-[var(--t2)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              {/* Social icons under Zarynx column */}
              {section.title === 'Zarynx' && (
                <div className="mt-3 flex gap-2">
                  {socialLinks.map(s => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-7 w-7 items-center justify-center rounded-[7px] border border-[var(--border)] bg-[var(--bg2)] text-[11px] text-[var(--t3)] transition-colors hover:border-[var(--border2)] hover:text-[var(--t2)]"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-4">
          <p className="text-[11px] text-[var(--t3)]">
            © 2025–2026 Zarynx.com — Free gaming tools
          </p>
          <span className="text-[13px] font-medium tracking-widest text-[var(--t2)]">
            ZAR<span className="text-[var(--mint)]">Y</span>NX
          </span>
        </div>
      </div>
    </footer>
  )
}
