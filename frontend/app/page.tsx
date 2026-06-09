export const dynamic = 'force-dynamic'

import { supabase } from '@/lib/supabase'
import type { Melhoria } from '@/lib/types'
import DomainCard from '@/components/DomainCard'
import ProgressCard from '@/components/ProgressCard'

const TIPO_LABELS: Record<string, string> = {
  treino_inicial: '🧠 Treino inicial',
  fine_tuning: '🔧 Fine-tuning',
  fine_tuning_validacao: '🔬 Fine-tuning + validação',
  dataset: '📦 Dataset',
}

const DOMINIO_LABELS: Record<string, string> = {
  baja: 'Baja',
  soja: 'Soja',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default async function DashboardPage() {
  const { data: melhorias } = await supabase
    .from('melhorias')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  const ultimasMelhorias = (melhorias ?? []) as Melhoria[]

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">SPEXTc</h1>
        <p className="text-slate-500 mt-1">Plataforma de Visão Computacional</p>
      </div>

      <section>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">
          Domínios ativos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <DomainCard
            title="Saga · Baja"
            subtitle="Inspeção de pintura de chassi"
            badge="active"
            badgeColor="green"
            metrics={[
              { label: 'mAP50', value: '98.9%' },
              { label: 'Classes', value: '4' },
            ]}
            footer="Em produção · HF Space · YOLOv8n fine-tuned"
            hfSpace="Guguinhaxd/baja-paint-inspection"
          />

          <DomainCard
            title="Soja"
            subtitle="Classificação de grãos"
            badge="active"
            badgeColor="green"
            metrics={[
              { label: 'Acurácia dataset', value: '85%' },
              { label: 'Acurácia real', value: '29%', highlight: true },
            ]}
            footer="Em produção · HF Space · EfficientNet-B0"
            hfSpace="Guguinhaxd/soja-inspection"
          />
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">
          Progresso para v1
        </h2>
        <ProgressCard
          title="Soja v1"
          subtitle="Coletando correções para v1"
          current={57}
          total={500}
          criteria={[
            { label: 'Acurácia real ≥ 80%', met: false },
            { label: 'Gap treino–val < 15pp', met: false },
            { label: '500 correções coletadas', met: false },
          ]}
        />
      </section>

      <section>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">
          Últimas melhorias
        </h2>
        {ultimasMelhorias.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400">
            Nenhuma melhoria registrada ainda.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
            {ultimasMelhorias.map((m) => (
              <div key={m.id} className="px-6 py-4 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {DOMINIO_LABELS[m.dominio] ?? m.dominio}
                    </span>
                    <span className="text-xs text-slate-400">
                      {TIPO_LABELS[m.tipo] ?? m.tipo}
                    </span>
                  </div>
                  <p className="text-sm text-slate-800 truncate">{m.descricao}</p>
                  {m.metrica_chave && (
                    <p className="text-xs text-slate-400 mt-0.5">
                      {m.metrica_chave}:{' '}
                      {m.valor_antes != null ? m.valor_antes : '—'} →{' '}
                      {m.valor_depois != null ? m.valor_depois : '—'}
                    </p>
                  )}
                </div>
                <time className="text-xs text-slate-400 whitespace-nowrap pt-1">
                  {formatDate(m.created_at)}
                </time>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
