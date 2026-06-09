'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Dominio, MelhoriaTipo } from '@/lib/types'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const DOMINIOS: { value: Dominio; label: string }[] = [
  { value: 'baja', label: 'Baja' },
  { value: 'soja', label: 'Soja' },
]

const TIPOS: { value: MelhoriaTipo; label: string }[] = [
  { value: 'treino_inicial', label: '🧠 Treino inicial' },
  { value: 'fine_tuning', label: '🔧 Fine-tuning' },
  { value: 'fine_tuning_validacao', label: '🔬 Fine-tuning + validação' },
  { value: 'dataset', label: '📦 Dataset' },
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
  dominio: 'baja',
  tipo: 'treino_inicial',
  descricao: '',
  modelo_antes: '',
  modelo_depois: '',
  metrica_chave: '',
  valor_antes: '',
  valor_depois: '',
  notas: '',
}

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
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/melhorias"
          className="text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Voltar"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Nova Melhoria</h1>
          <p className="text-slate-500 mt-1">Registre uma evolução no modelo ou dataset</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700" htmlFor="dominio">
              Domínio
            </label>
            <select
              id="dominio"
              value={form.dominio}
              onChange={(e) => set('dominio', e.target.value as Dominio)}
              className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
            >
              {DOMINIOS.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700" htmlFor="tipo">
              Tipo
            </label>
            <select
              id="tipo"
              value={form.tipo}
              onChange={(e) => set('tipo', e.target.value as MelhoriaTipo)}
              className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
            >
              {TIPOS.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700" htmlFor="descricao">
            Descrição <span className="text-red-500">*</span>
          </label>
          <input
            id="descricao"
            type="text"
            value={form.descricao}
            onChange={(e) => set('descricao', e.target.value)}
            placeholder="Ex: Fine-tuning com 200 novas amostras de escorrimento"
            className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand placeholder:text-slate-300"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700" htmlFor="modelo_antes">
              Modelo antes
            </label>
            <input
              id="modelo_antes"
              type="text"
              value={form.modelo_antes}
              onChange={(e) => set('modelo_antes', e.target.value)}
              placeholder="Ex: yolov8n_v0"
              className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand placeholder:text-slate-300"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700" htmlFor="modelo_depois">
              Modelo depois
            </label>
            <input
              id="modelo_depois"
              type="text"
              value={form.modelo_depois}
              onChange={(e) => set('modelo_depois', e.target.value)}
              placeholder="Ex: yolov8n_v1"
              className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand placeholder:text-slate-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700" htmlFor="metrica_chave">
              Métrica
            </label>
            <input
              id="metrica_chave"
              type="text"
              value={form.metrica_chave}
              onChange={(e) => set('metrica_chave', e.target.value)}
              placeholder="Ex: mAP50"
              className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand placeholder:text-slate-300"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700" htmlFor="valor_antes">
              Valor antes
            </label>
            <input
              id="valor_antes"
              type="number"
              step="any"
              value={form.valor_antes}
              onChange={(e) => set('valor_antes', e.target.value)}
              placeholder="Ex: 0.82"
              className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand placeholder:text-slate-300"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700" htmlFor="valor_depois">
              Valor depois
            </label>
            <input
              id="valor_depois"
              type="number"
              step="any"
              value={form.valor_depois}
              onChange={(e) => set('valor_depois', e.target.value)}
              placeholder="Ex: 0.989"
              className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand placeholder:text-slate-300"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700" htmlFor="notas">
            Notas
          </label>
          <textarea
            id="notas"
            value={form.notas}
            onChange={(e) => set('notas', e.target.value)}
            placeholder="Observações adicionais, contexto, problemas encontrados…"
            rows={3}
            className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand placeholder:text-slate-300"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-1">
          <Link
            href="/melhorias"
            className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 bg-brand text-white text-sm font-medium rounded-xl hover:bg-brand/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Salvando…' : 'Salvar melhoria'}
          </button>
        </div>
      </form>
    </div>
  )
}
