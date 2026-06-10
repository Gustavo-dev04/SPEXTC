export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Modelo, ModeloStatus } from '@/lib/types'
import { PlusCircle } from 'lucide-react'

const STATUS_LABELS: Record<ModeloStatus, string> = {
  active: 'Ativo',
  candidate: 'Candidato',
  archived: 'Arquivado',
}

const STATUS_STYLES: Record<ModeloStatus, string> = {
  active: 'text-white/70 border-white/20',
  candidate: 'text-white/50 border-white/10',
  archived: 'text-white/20 border-white/[0.06]',
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

function principalMetric(modelo: Modelo): string {
  const m = modelo.metricas
  if (!m) return '—'
  if ('mAP50' in m) return `mAP50 ${m.mAP50}`
  if ('map50' in m) return `mAP50 ${m.map50}`
  if ('acuracia' in m) return `Acurácia ${m.acuracia}`
  if ('accuracy' in m) return `Acurácia ${m.accuracy}`
  const firstKey = Object.keys(m)[0]
  if (firstKey) return `${firstKey} ${m[firstKey]}`
  return '—'
}

export default async function ModelosPage() {
  const { data, error } = await supabase
    .from('modelos')
    .select('*')
    .order('dominio', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) console.error('[modelos] supabase error:', error.code, error.message)

  const modelos = (data ?? []) as Modelo[]

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 space-y-8">

      <div className="flex items-end justify-between">
        <div>
          <p className="text-[11px] text-white/25 tracking-[0.35em] uppercase mb-2">Registry</p>
          <h1 className="text-3xl font-bold text-white tracking-tight">Modelos</h1>
          <p className="text-white/35 mt-1 text-sm">Todos os modelos registrados na plataforma</p>
        </div>
        <Link
          href="/melhorias/nova"
          className="flex items-center gap-2 border border-white/[0.12] text-white/60 text-[13px] font-medium px-4 py-2.5 rounded-xl hover:bg-white/[0.04] hover:text-white/80 transition-all"
        >
          <PlusCircle size={15} />
          Registrar melhoria
        </Link>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
          Erro ao carregar modelos. Verifique a conexão com o Supabase.
        </div>
      )}

      <div className="bg-[#080808] rounded-2xl border border-white/[0.06] overflow-hidden">
        {modelos.length === 0 ? (
          <div className="p-16 text-center text-white/20 text-sm">
            Nenhum modelo registrado ainda.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {['Modelo', 'Nome', 'Versão', 'Status', 'Pipeline', 'Métrica', 'Dataset', 'Data'].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3.5 text-[11px] font-medium text-white/25 uppercase tracking-[0.15em]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {modelos.map((m) => (
                  <tr key={m.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-5 py-4">
                      <span className="text-[12px] text-white/40 font-medium tracking-wide">
                        {DOMINIO_LABELS[m.dominio] ?? m.dominio}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-white/80">{m.nome}</p>
                      {m.descricao && (
                        <p className="text-white/25 text-xs mt-0.5 max-w-xs truncate">
                          {m.descricao}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4 font-mono text-white/40 text-xs">{m.versao}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                          STATUS_STYLES[m.status] ?? STATUS_STYLES.archived
                        }`}
                      >
                        {STATUS_LABELS[m.status] ?? m.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-white/35 text-xs">{m.pipeline}</td>
                    <td className="px-5 py-4 text-white/60 font-mono text-xs">
                      {principalMetric(m)}
                    </td>
                    <td className="px-5 py-4 text-white/25 text-xs">
                      {m.dataset_versao ?? '—'}
                    </td>
                    <td className="px-5 py-4 text-white/20 text-xs whitespace-nowrap">
                      {formatDate(m.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
