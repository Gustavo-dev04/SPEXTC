export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Melhoria } from '@/lib/types'

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

export default async function HomePage() {
  const { data } = await supabase
    .from('melhorias')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(4)

  const recentes = (data ?? []) as Melhoria[]

  return (
    <div className="min-h-screen bg-black">

      {/* ── Hero ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pt-20 pb-20">
        <p className="text-[11px] text-white/25 tracking-[0.35em] uppercase mb-5">
          Plataforma · v0.1
        </p>
        <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold text-white tracking-tight leading-[1.08] mb-6">
          Visão computacional<br />
          <span className="text-white/40">como linguagem.</span>
        </h1>
        <p className="text-white/45 text-lg leading-relaxed max-w-xl">
          Cada imagem vira tokens. Cada token vira dado de treino.
          Modelos que aprendem continuamente com o uso real.
        </p>
      </section>

      <div className="border-t border-white/[0.05]" />

      {/* ── Modelos ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-20">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-[11px] text-white/25 tracking-[0.35em] uppercase mb-2">
              Modelos
            </p>
            <h2 className="text-2xl font-bold text-white tracking-tight">Os modelos</h2>
          </div>
          <Link
            href="/modelos"
            className="text-[13px] text-white/30 hover:text-white/60 flex items-center gap-1.5 transition-colors pb-0.5"
          >
            Ver registry <ArrowRight size={13} />
          </Link>
        </div>

        <div className="space-y-4">

          {/* ── SAGA — Flagship ── */}
          <div className="relative bg-[#080808] border border-white/[0.07] rounded-2xl p-8 md:p-10 hover:border-white/[0.12] transition-all duration-300 overflow-hidden">
            {/* subtle glow */}
            <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(255,255,255,0.025) 0%, transparent 60%)' }} />

            <div className="relative flex flex-col lg:flex-row lg:items-start gap-10">
              {/* Left */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  <span className="text-[11px] text-white/35 tracking-[0.25em] uppercase font-medium">
                    Flagship · v0 · Em produção
                  </span>
                </div>

                <h3 className="text-[3.5rem] font-bold text-white tracking-tight leading-none mb-1">
                  Saga
                </h3>
                <p className="text-white/30 text-sm mb-6 tracking-wide">
                  Inspeção granular · grãos · quantidades · tokenização
                </p>

                <p className="text-white/60 leading-relaxed max-w-lg text-[15px]">
                  Modelo de percepção em escala para grãos, objetos em alta quantidade e
                  detecção de anomalias em lotes. Arquitetura projetada como base para
                  tokenização semântica — o núcleo do SPEXT.
                </p>

                <div className="mt-7 flex flex-wrap gap-2">
                  {[
                    'Classificação de grãos',
                    'Quantificação de lotes',
                    'Detecção de anomalias',
                    'Tokenização (roadmap)',
                  ].map((cap) => (
                    <span
                      key={cap}
                      className="text-[12px] text-white/40 border border-white/[0.09] px-3 py-1 rounded-full"
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right — Metrics */}
              <div className="lg:w-64 flex-shrink-0 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                    <p className="text-white/25 text-[11px] mb-1.5">Acurácia dataset</p>
                    <p className="text-white text-2xl font-bold">85%</p>
                  </div>
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                    <p className="text-white/25 text-[11px] mb-1.5">Acurácia real</p>
                    <p className="text-white text-2xl font-bold">64%</p>
                    <p className="text-white/20 text-[10px] mt-0.5">após fine-tuning</p>
                  </div>
                </div>

                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white/25 text-[11px]">Meta v1</p>
                    <p className="text-white/35 text-[11px] font-mono">57 / 500</p>
                  </div>
                  <div className="h-[3px] bg-white/[0.07] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white/50 rounded-full transition-all duration-500"
                      style={{ width: `${(57 / 500) * 100}%` }}
                    />
                  </div>
                </div>

                <Link
                  href="/inspecionar/soja"
                  className="flex items-center justify-center gap-2 w-full bg-white text-black text-[13px] font-semibold py-3 px-4 rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all"
                >
                  Inspecionar <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>

          {/* ── MAGNUS — Generalista ── */}
          <div className="relative bg-[#060606] border border-white/[0.05] rounded-2xl p-8 md:p-10 hover:border-white/[0.09] transition-all duration-300">
            <div className="flex flex-col lg:flex-row lg:items-start gap-10">
              {/* Left */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  <span className="text-[11px] text-white/25 tracking-[0.25em] uppercase font-medium">
                    Generalista · v0 · Em produção
                  </span>
                </div>

                <h3 className="text-[3.5rem] font-bold text-white/80 tracking-tight leading-none mb-1">
                  Magnus
                </h3>
                <p className="text-white/20 text-sm mb-6 tracking-wide">
                  Inspeção de superfícies · pintura · defeitos · chassi
                </p>

                <p className="text-white/45 leading-relaxed max-w-lg text-[15px]">
                  Detecção de defeitos de pintura, superfícies e anomalias em inspeções
                  médias e grandes. Alta precisão e velocidade — o modelo de produção
                  para uso diário.
                </p>

                <div className="mt-7 flex flex-wrap gap-2">
                  {[
                    'Defeitos de pintura',
                    'Bounding boxes',
                    'Inspeção de chassi',
                    'Alta velocidade',
                  ].map((cap) => (
                    <span
                      key={cap}
                      className="text-[12px] text-white/25 border border-white/[0.06] px-3 py-1 rounded-full"
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right — Metrics */}
              <div className="lg:w-64 flex-shrink-0 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
                    <p className="text-white/20 text-[11px] mb-1.5">mAP50</p>
                    <p className="text-white/80 text-2xl font-bold">98.9%</p>
                  </div>
                  <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
                    <p className="text-white/20 text-[11px] mb-1.5">Classes</p>
                    <p className="text-white/80 text-2xl font-bold">4</p>
                  </div>
                </div>

                <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
                  <p className="text-white/20 text-[11px] mb-1.5">Pipeline</p>
                  <p className="text-white/60 text-sm font-mono">YOLOv8n fine-tuned</p>
                </div>

                <Link
                  href="/inspecionar/baja"
                  className="flex items-center justify-center gap-2 w-full border border-white/[0.12] text-white/60 text-[13px] font-medium py-3 px-4 rounded-xl hover:bg-white/[0.04] hover:text-white/80 active:scale-[0.98] transition-all"
                >
                  Inspecionar <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── Recentes ── */}
      {recentes.length > 0 && (
        <>
          <div className="border-t border-white/[0.05]" />
          <section className="max-w-7xl mx-auto px-6 md:px-10 py-20">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[11px] text-white/25 tracking-[0.35em] uppercase mb-2">
                  Atividade
                </p>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Últimas atualizações
                </h2>
              </div>
              <Link
                href="/melhorias"
                className="text-[13px] text-white/30 hover:text-white/60 flex items-center gap-1.5 transition-colors pb-0.5"
              >
                Ver todas <ArrowRight size={13} />
              </Link>
            </div>

            <div className="space-y-2">
              {recentes.map((m) => (
                <div
                  key={m.id}
                  className="flex items-start gap-5 bg-[#080808] border border-white/[0.05] rounded-xl px-6 py-4 hover:border-white/[0.09] transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] text-white/35 tracking-widest uppercase">
                        {DOMINIO_LABELS[m.dominio] ?? m.dominio}
                      </span>
                      <span className="text-white/10">·</span>
                      <span className="text-[11px] text-white/20">
                        {TIPO_LABELS[m.tipo] ?? m.tipo}
                      </span>
                    </div>
                    <p className="text-[14px] text-white/65 truncate">{m.descricao}</p>
                    {m.metrica_chave && (
                      <p className="text-[11px] text-white/25 mt-0.5 font-mono">
                        {m.metrica_chave}: {m.valor_antes ?? '—'} → {m.valor_depois ?? '—'}
                      </p>
                    )}
                  </div>
                  <time className="text-[11px] text-white/18 whitespace-nowrap pt-0.5">
                    {formatDate(m.created_at)}
                  </time>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Footer */}
      <div className="border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-6 flex items-center justify-between">
          <span className="text-[11px] text-white/15 tracking-[0.2em] uppercase">
            SPEXTC Platform v0.1
          </span>
          <span className="text-[11px] text-white/10">
            FATEC · Visão Computacional
          </span>
        </div>
      </div>

    </div>
  )
}
