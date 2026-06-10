'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Dominio, MelhoriaTipo } from '@/lib/types'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const DOMINIOS: { value: Dominio; label: string }[] = [
  { value: 'soja', label: 'Saga — Inspeção granular' },
  { value: 'baja', label: 'Magnus — Inspeção de superfícies' },
]

const TIPOS: { value: MelhoriaTipo; label: string }[] = [
  { value: 'treino_inicial', label: 'Treino inicial' },
  { value: 'fine_tuning', label: 'Fine-tuning' },
  { value: 'fine_tuning_validacao', label: 'Fine-tuning + validação' },
  { value: 'dataset', label: 'Dataset' },
]

interface FormState {
  dominio: Dominio
  tipo: MelhoriaTipo
  descricao: string
  modelo_antes: string
  modelo_depois: string
  metrica_chave: string
  valor_antes: string
  valor_depois: string
  notas: string
}

const INITIAL: FormState = {
  dominio: 'soja',
  tipo: 'treino_inicial',
  descricao: '',
  modelo_antes: '',
  modelo_depois: '',
  metrica_chave: '',
  valor_antes: '',
  valor_depois: '',
  notas: '',
}

const inputClass =
  'bg-white/[0.03] border border-white/[0.1] rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-colors'

const labelClass = 'block text-[12px] font-medium text-white/40 mb-1.5 tracking-wide'

export default function NovaMelhoriaPage() {
  const router = useRouter()
  const [form, setForm] = useState<FormState>(INITIAL)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.descricao.trim()) {
      setError('A descrição é obrigatória.')
      return
    }

    setSaving(true)
    setError(null)

    const payload = {
      dominio: form.dominio,
      tipo: form.tipo,
      descricao: form.descricao.trim(),
      modelo_antes: form.modelo_antes.trim() || null,
      modelo_depois: form.modelo_depois.trim() || null,
      metrica_chave: form.metrica_chave.trim() || null,
      valor_antes: form.valor_antes !== '' ? parseFloat(form.valor_antes) : null,
      valor_depois: form.valor_depois !== '' ? parseFloat(form.valor_depois) : null,
      notas: form.notas.trim() || null,
    }

    const { error: insertError } = await supabase.from('melhorias').insert([payload])

    if (insertError) {
      setError(`Erro ao salvar: ${insertError.message}`)
      setSaving(false)
      return
    }

    router.push('/melhorias')
  }

  return (
    <div className="max-w-2xl mx-auto px-6 md:px-10 py-12 space-y-8">
      <div className="flex items-start gap-4">
        <Link
          href="/melhorias"
          className="text-white/20 hover:text-white/50 transition-colors mt-1.5"
          aria-label="Voltar"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <p className="text-[11px] text-white/25 tracking-[0.35em] uppercase mb-2">Log</p>
          <h1 className="text-3xl font-bold text-white tracking-tight">Nova Melhoria</h1>
          <p className="text-white/30 mt-1 text-sm">Registre uma evolução no modelo ou dataset</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#080808] border border-white/[0.07] rounded-2xl p-7 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="dominio">Modelo</label>
            <select
              id="dominio"
              value={form.dominio}
              onChange={(e) => set('dominio', e.target.value as Dominio)}
              className={inputClass + ' w-full appearance-none cursor-pointer'}
            >
              {DOMINIOS.map((d) => (
                <option key={d.value} value={d.value} className="bg-[#111] text-white">
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="tipo">Tipo</label>
            <select
              id="tipo"
              value={form.tipo}
              onChange={(e) => set('tipo', e.target.value as MelhoriaTipo)}
              className={inputClass + ' w-full appearance-none cursor-pointer'}
            >
              {TIPOS.map((t) => (
                <option key={t.value} value={t.value} className="bg-[#111] text-white">
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="descricao">
            Descrição <span className="text-red-400/70">*</span>
          </label>
          <input
            id="descricao"
            type="text"
            value={form.descricao}
            onChange={(e) => set('descricao', e.target.value)}
            placeholder="Ex: Fine-tuning com 200 novas amostras de escorrimento"
            className={inputClass + ' w-full'}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="modelo_antes">Modelo antes</label>
            <input
              id="modelo_antes"
              type="text"
              value={form.modelo_antes}
              onChange={(e) => set('modelo_antes', e.target.value)}
              placeholder="Ex: saga@v0"
              className={inputClass + ' w-full'}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="modelo_depois">Modelo depois</label>
            <input
              id="modelo_depois"
              type="text"
              value={form.modelo_depois}
              onChange={(e) => set('modelo_depois', e.target.value)}
              placeholder="Ex: saga@v1"
              className={inputClass + ' w-full'}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClass} htmlFor="metrica_chave">Métrica</label>
            <input
              id="metrica_chave"
              type="text"
              value={form.metrica_chave}
              onChange={(e) => set('metrica_chave', e.target.value)}
              placeholder="Ex: mAP50"
              className={inputClass + ' w-full'}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="valor_antes">Antes</label>
            <input
              id="valor_antes"
              type="number"
              step="any"
              value={form.valor_antes}
              onChange={(e) => set('valor_antes', e.target.value)}
              placeholder="0.82"
              className={inputClass + ' w-full'}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="valor_depois">Depois</label>
            <input
              id="valor_depois"
              type="number"
              step="any"
              value={form.valor_depois}
              onChange={(e) => set('valor_depois', e.target.value)}
              placeholder="0.989"
              className={inputClass + ' w-full'}
            />
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="notas">Notas</label>
          <textarea
            id="notas"
            value={form.notas}
            onChange={(e) => set('notas', e.target.value)}
            placeholder="Observações adicionais, contexto, problemas encontrados…"
            rows={3}
            className={inputClass + ' w-full resize-none'}
          />
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-1">
          <Link
            href="/melhorias"
            className="px-4 py-2.5 text-sm text-white/30 hover:text-white/60 transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 bg-white text-black text-sm font-semibold rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? 'Salvando…' : 'Salvar melhoria'}
          </button>
        </div>
      </form>
    </div>
  )
}
