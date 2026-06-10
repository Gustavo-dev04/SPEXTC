'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { label: 'Modelos', href: '/modelos', match: '/modelos' },
  { label: 'Melhorias', href: '/melhorias', match: '/melhorias' },
  { label: 'Inspecionar', href: '/inspecionar/baja', match: '/inspecionar' },
]

export default function TopNav() {
  const pathname = usePathname()

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-black/95 backdrop-blur-md"
      style={{ height: 'var(--topnav-height)' }}
    >
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-6 md:px-10">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="text-white font-bold text-sm tracking-[0.28em] uppercase select-none">
            SPEXTC
          </span>
          <span className="hidden sm:inline text-[9px] text-white/25 border border-white/[0.12] px-1.5 py-0.5 rounded uppercase tracking-[0.15em] font-medium">
            Beta
          </span>
        </Link>

        <nav className="flex items-center gap-7">
          {NAV.map(({ label, href, match }) => {
            const active = pathname === '/' ? false : pathname.startsWith(match)
            return (
              <Link
                key={href}
                href={href}
                className={`text-[13px] tracking-wide transition-colors duration-150 ${
                  active ? 'text-white' : 'text-white/35 hover:text-white/65'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
