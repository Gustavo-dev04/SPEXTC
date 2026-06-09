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

const DOMINIO_STYLES: Record<string, string> = {
  baja: 'bg-blue-100 text-blue-700',
  soja: 'bg-amber-100 text-amber-700',
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Log de Melhorias</h1>
          <p className="text-slate-500 mt-1">Histórico de evoluções dos modelos</p>
        </div>
        <Link
          href="/melhorias/nova"
          className="flex items-center gap-2 bg-brand text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-brand/90 transition-colors"
        >
          <PlusCircle size={16} />
          Nova melhoria
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          Erro ao carregar melhorias. Verifique a conexão com o Supabase.
        </div>
      )}

      {melhorias.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
          Nenhuma melhoria registrada ainda.{' '}
          <Link href="/melhorias/nova" className="text-brand hover:underline">
            Registrar a primeira
          </Link>
          .
        </div>
      ) : (
        <div className="relative">
          {/* timeline line */}
          <div className="absolute left-7 top-0 bottom-0 w-px bg-slate-200 z-0" aria-hidden="true" />

          <div className="space-y-4 relative z-10">
            {melhorias.map((m) => {
              const icon = TIPO_ICONS[m.tipo] ?? '📋'
              const tipoLabel = TIPO_LABELS[m.tipo] ?? m.tipo

              return (
                <div key={m.id} className="flex gap-5">
                  {/* icon dot */}
                  <div className="w-14 flex-shrink-0 flex justify-center">
                    <span
                      className="w-8 h-8 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-base shadow-sm"
                      title={tipoLabel}
                    >
                      {icon}
                    </span>
                  </div>

                  <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-5 mb-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          DOMINIO_STYLES[m.dominio] ?? 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {m.dominio === 'baja' ? 'Baja' : 'Soja'}
                      </span>
                      <span className="text-xs text-slate-500">{tipoLabel}</span>
                      <time className="text-xs text-slate-400 ml-auto">{formatDate(m.created_at)}</time>
                    </div>

                    <p className="text-sm font-medium text-slate-800">{m.descricao}</p>

                    {m.metrica_chave && (
                      <p className="text-xs text-slate-500 mt-1.5">
                        <span className="font-medium">{m.metrica_chave}:</span>{' '}
                        <span className="font-mono">
                          {m.valor_antes != null ? m.valor_antes : '—'}
                          {' → '}
                          {m.valor_depois != null ? m.valor_depois : '—'}
                        </span>
                      </p>
                    )}

                    {(m.modelo_antes || m.modelo_depois) && (
                      <p className="text-xs text-slate-400 mt-1">
                        {m.modelo_antes && <span>antes: <span className="font-mono">{m.modelo_antes}</span></span>}
                        {m.modelo_antes && m.modelo_depois && ' · '}
                        {m.modelo_depois && <span>depois: <span className="font-mono">{m.modelo_depois}</span></span>}
                      </p>
                    )}

                    {m.notas && (
                      <p className="text-xs text-slate-400 mt-2 border-t border-slate-100 pt-2 italic">
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
