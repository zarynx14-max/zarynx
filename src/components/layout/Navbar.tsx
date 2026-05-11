'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { navLinks } from '@/lib/config'
import { cn } from '@/lib/utils'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]">
      <div className="mx-auto flex h-[52px] max-w-7xl items-center gap-4 px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex-shrink-0 text-[17px] font-medium tracking-widest text-[var(--t1)]"
          onClick={() => setOpen(false)}
        >
          ZAR<span className="text-[var(--mint)]">Y</span>NX
        </Link>

        {/* Desktop nav */}
        <nav className="hidden flex-1 items-center gap-5 md:flex">
          {navLinks.map(link => {
            const active = pathname === link.href || pathname.startsWith(link.href + '/')
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-[13px] transition-colors pb-[2px]',
                  active
                    ? 'text-[var(--t1)] border-b-[1.5px] border-[var(--mint)]'
                    : 'text-[var(--t2)] hover:text-[var(--t1)]'
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Desktop CTA */}
        <Link
          href="/tools/pc-bottleneck-calculator"
          className="hidden rounded-[7px] bg-[var(--mint)] px-[14px] py-[7px] text-[12px] font-medium text-[#0D0F14] transition-opacity hover:opacity-90 md:block"
        >
          Bottleneck Calc
        </Link>

        {/* Hamburger */}
        <button
          className="ml-auto flex items-center justify-center rounded-md p-1 text-[var(--t2)] md:hidden"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-[var(--border)] bg-[var(--bg2)] md:hidden">
          <nav className="flex flex-col px-4 py-2">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-[var(--border)] py-[10px] text-[14px] text-[var(--t2)] last:border-0 hover:text-[var(--t1)]"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/tools/pc-bottleneck-calculator"
              onClick={() => setOpen(false)}
              className="py-[10px] text-[14px] font-medium text-[var(--mint)]"
            >
              Bottleneck Calc →
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
