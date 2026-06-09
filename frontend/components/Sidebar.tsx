'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, BoxesIcon, GitBranch, ScanSearch } from 'lucide-react'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/modelos', label: 'Modelos', icon: BoxesIcon },
  { href: '/melhorias', label: 'Melhorias', icon: GitBranch },
  { href: '/inspecionar/baja', label: 'Inspecionar', icon: ScanSearch },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="fixed top-0 left-0 h-full flex flex-col z-10"
      style={{ width: 'var(--sidebar-width)', backgroundColor: '#1a1a2e' }}
    >
      <div className="px-5 py-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-white font-bold text-xl tracking-tight">SPEXTc</span>
          <span className="bg-brand/20 text-brand text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wide">
            beta
          </span>
        </div>
        <p className="text-white/40 text-xs mt-1">Visão Computacional</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-thin">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === '/'
              ? pathname === '/'
              : pathname === href || pathname.startsWith(href.replace('/baja', ''))

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand/20 text-brand'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="px-5 py-4 border-t border-white/10">
        <p className="text-white/25 text-[11px]">SPEXT Platform v0.1</p>
      </div>
    </aside>
  )
}
