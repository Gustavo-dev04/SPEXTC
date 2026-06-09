export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Modelo, ModeloStatus } from '@/lib/types'
import { PlusCircle } from 'lucide-react'

const STATUS_LABELS: Record<ModeloStatus, string> = {
  active: 'active',
  candidate: 'candidate',
  archived: 'archived',
}

const STATUS_STYLES: Record<ModeloStatus, string> = {
  active: 'bg-emerald-100 text-emerald-700',
  candidate: 'bg-amber-100 text-amber-700',
  archived: 'bg-slate-100 text-slate-500',
}

const DOMINIO_LABELS: Record<string, string> = {
  baja: 'Baja',
  soja: 'Soja',
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
  if ('mAP50' in m) return `mAP50 = ${m.mAP50}`
  if ('map50' in m) return `mAP50 = ${m.map50}`
  if ('acuracia' in m) return `Acurácia = ${m.acuracia}`
  if ('accuracy' in m) return `Acurácia = ${m.accuracy}`
  const firstKey = Object.keys(m)[0]
  if (firstKey) return `${firstKey} = ${m[firstKey]}`
  return '—'
}

export default async function ModelosPage() {
  const { data, error } = await supabase
    .from('modelos')
    .select('*')
    .order('dominio', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) console.error('[modelos]', error.code, error.message, error.details)

  const modelos = (data ?? []) as Modelo[]

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Registry de Modelos</h1>
          <p className="text-slate-500 mt-1">Todos os modelos registrados na plataforma</p>
        </div>
        <Link
          href="/melhorias/nova"
          className="flex items-center gap-2 bg-brand text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-brand/90 transition-colors"
        >
          <PlusCircle size={16} />
          Registrar melhoria
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          Erro ao carregar modelos. Verifique a conexão com o Supabase.
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {modelos.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            Nenhum modelo registrado ainda.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Domínio
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    AI / Nome
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Versão
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Pipeline
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Métrica Principal
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Dataset
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Data
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {modelos.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        {DOMINIO_LABELS[m.dominio] ?? m.dominio}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-900">{m.nome}</p>
                      {m.descricao && (
                        <p className="text-slate-400 text-xs mt-0.5 max-w-xs truncate">{m.descricao}</p>
                      )}
                    </td>
                    <td className="px-5 py-4 font-mono text-slate-600">{m.versao}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                          STATUS_STYLES[m.status] ?? STATUS_STYLES.archived
                        }`}
                      >
                        {STATUS_LABELS[m.status] ?? m.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{m.pipeline}</td>
                    <td className="px-5 py-4 text-slate-700 font-medium">{principalMetric(m)}</td>
                    <td className="px-5 py-4 text-slate-500">{m.dataset_versao ?? '—'}</td>
                    <td className="px-5 py-4 text-slate-400 whitespace-nowrap">
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
