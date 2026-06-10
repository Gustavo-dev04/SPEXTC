import type { Metadata } from 'next'
import './globals.css'
import TopNav from '@/components/TopNav'

export const metadata: Metadata = {
  title: 'SPEXTC — Plataforma de Visão Computacional',
  description: 'Plataforma interna de MLOps para visão computacional',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-black text-white min-h-screen antialiased">
        <TopNav />
        <main style={{ paddingTop: 'var(--topnav-height)' }}>
          {children}
        </main>
      </body>
    </html>
  )
}
