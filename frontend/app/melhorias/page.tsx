export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Melhoria } from '@/lib/types'
import { PlusCircle } from 'lucide-react'

const TIPO_ICONS: Record<string, string> = {
  treino_inicial: '🧠',
  fine_tuning: '🔧',
  fine_tuning_validacao: '🔬',
  dataset: '📦',
}

const TIPO_LABELS: Record<string, string> = {
  treino_inicial: 'Treino inicial',
  fine_tuning: 'Fine-tuning',
  fine_tuning_validacao: 'Fine-tuning + validação',
  dataset: 'Dataset',
}

const DOMINIO_LABELS: Record<string, string> = {
  baja: 'Magnus',
  soja: 'Saga',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default async function MelhoriasPage() {
  const { data, error } = await supabase
    .from('melhorias')
    .select('*')
    .order('created_at', { ascending: false })

  const melhorias = (data ?? []) as Melhoria[]

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-10 py-12 space-y-8">

      <div className="flex items-end justify-between">
        <div>
          <p className="text-[11px] text-white/25 tracking-[0.35em] uppercase mb-2">Log</p>
          <h1 className="text-3xl font-bold text-white tracking-tight">Melhorias</h1>
          <p className="text-white/35 mt-1 text-sm">Histórico de evoluções dos modelos</p>
        </div>
        <Link
          href="/melhorias/nova"
          className="flex items-center gap-2 border border-white/[0.12] text-white/60 text-[13px] font-medium px-4 py-2.5 rounded-xl hover:bg-white/[0.04] hover:text-white/80 transition-all"
        >
          <PlusCircle size={15} />
          Nova melhoria
        </Link>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
          Erro ao carregar melhorias.
        </div>
      )}

      {melhorias.length === 0 ? (
        <div className="bg-[#080808] border border-white/[0.06] rounded-2xl p-16 text-center text-white/20 text-sm">
          Nenhuma melhoria registrada.{' '}
          <Link href="/melhorias/nova" className="text-white/40 hover:text-white/60 underline underline-offset-2">
            Registrar a primeira
          </Link>
          .
        </div>
      ) : (
        <div className="relative">
          {/* timeline line */}
          <div className="absolute left-7 top-0 bottom-0 w-px bg-white/[0.05] z-0" aria-hidden="true" />

          <div className="space-y-3 relative z-10">
            {melhorias.map((m) => {
              const icon = TIPO_ICONS[m.tipo] ?? '📋'
              const tipoLabel = TIPO_LABELS[m.tipo] ?? m.tipo

              return (
                <div key={m.id} className="flex gap-5">
                  {/* icon dot */}
                  <div className="w-14 flex-shrink-0 flex justify-center">
                    <span
                      className="w-8 h-8 rounded-full bg-black border border-white/[0.1] flex items-center justify-center text-sm shadow-sm"
                      title={tipoLabel}
                    >
                      {icon}
                    </span>
                  </div>

                  <div className="flex-1 bg-[#080808] border border-white/[0.06] rounded-2xl p-5 mb-1 hover:border-white/[0.1] transition-colors">
                    <div className="flex flex-wrap items-center gap-2 mb-2.5">
                      <span className="text-[11px] font-medium text-white/50 tracking-[0.1em] uppercase">
                        {DOMINIO_LABELS[m.dominio] ?? m.dominio}
                      </span>
                      <span className="text-white/[0.12]">·</span>
                      <span className="text-[11px] text-white/25">{tipoLabel}</span>
                      <time className="text-[11px] text-white/15 ml-auto">
                        {formatDate(m.created_at)}
                      </time>
                    </div>

                    <p className="text-[14px] text-white/70">{m.descricao}</p>

                    {m.metrica_chave && (
                      <p className="text-[12px] text-white/35 mt-2 font-mono">
                        {m.metrica_chave}:{' '}
                        <span>
                          {m.valor_antes != null ? m.valor_antes : '—'}
                          {' → '}
                          {m.valor_depois != null ? m.valor_depois : '—'}
                        </span>
                      </p>
                    )}

                    {(m.modelo_antes || m.modelo_depois) && (
                      <p className="text-[11px] text-white/20 mt-1 font-mono">
                        {m.modelo_antes && <span>antes: {m.modelo_antes}</span>}
                        {m.modelo_antes && m.modelo_depois && '  →  '}
                        {m.modelo_depois && <span>depois: {m.modelo_depois}</span>}
                      </p>
                    )}

                    {m.notas && (
                      <p className="text-[12px] text-white/20 mt-2.5 border-t border-white/[0.05] pt-2.5 italic">
                        {m.notas}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
