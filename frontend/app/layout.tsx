import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'

export const metadata: Metadata = {
  title: 'SPEXTc — Plataforma de Visão Computacional',
  description: 'Plataforma interna de MLOps para visão computacional',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Sidebar />
        <main
          className="min-h-screen"
          style={{ marginLeft: 'var(--sidebar-width)', backgroundColor: '#f8fafc' }}
        >
          <div className="p-8">{children}</div>
        </main>
      </body>
    </html>
  )
}
