'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Upload, AlertCircle, Clock } from 'lucide-react'
import BBoxCanvas from '@/components/BBoxCanvas'
import type { BBoxDetection, InspectResponse, SojaInspectResponse, Dominio } from '@/lib/types'

type ActiveDomain = 'baja' | 'soja'

interface BajaResult {
  detections: BBoxDetection[]
  inference_ms: number
  model: string
  image_width: number
  image_height: number
}

interface SojaResult {
  class_name: string
  confidence: number
  inference_ms: number
  model: string
}

type InspectResult = { kind: 'baja'; data: BajaResult } | { kind: 'soja'; data: SojaResult }

function classCounts(detections: BBoxDetection[]): Record<string, number> {
  return detections.reduce<Record<string, number>>((acc, d) => {
    acc[d.class_name] = (acc[d.class_name] ?? 0) + 1
    return acc
  }, {})
}

function avgConfidence(detections: BBoxDetection[]): number {
  if (detections.length === 0) return 0
  return detections.reduce((s, d) => s + d.confidence, 0) / detections.length
}

async function inspectBaja(file: File): Promise<BajaResult> {
  const body = new FormData()
  body.append('file', file)

  const res = await fetch('https://guguinhaxd-baja-paint-inspection.hf.space/inspect', {
    method: 'POST',
    body,
  })

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw new Error(text)
  }

  return res.json() as Promise<BajaResult>
}

async function inspectSoja(file: File): Promise<SojaResult> {
  const buffer = await file.arrayBuffer()
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i])
  const base64 = btoa(binary)

  const res = await fetch('https://guguinhaxd-soja-inspection.hf.space/inspect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image_base64: base64, filename: file.name }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw new Error(text)
  }

  return res.json() as Promise<SojaResult>
}

function isSleepingError(err: unknown): boolean {
  if (!(err instanceof Error)) return false
  const msg = err.message.toLowerCase()
  return (
    msg.includes('503') ||
    msg.includes('502') ||
    msg.includes('sleeping') ||
    msg.includes('starting') ||
    msg.includes('unavailable') ||
    msg.includes('failed to fetch')
  )
}

export default function InspecionarPage() {
  const params = useParams()
  const router = useRouter()
  const rawDomain = params?.dominio as string
  const domain: ActiveDomain = rawDomain === 'soja' ? 'soja' : 'baja'

  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageNatural, setImageNatural] = useState<{ w: number; h: number } | null>(null)
  const [result, setResult] = useState<InspectResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sleeping, setSleeping] = useState(false)
  const [dragging, setDragging] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  function switchDomain(d: ActiveDomain) {
    setImageUrl(null)
    setImageNatural(null)
    setResult(null)
    setError(null)
    setSleeping(false)
    router.replace(`/inspecionar/${d}`)
  }

  async function processFile(file: File) {
    if (!file.type.startsWith('image/')) {
      setError('Envie um arquivo de imagem (PNG, JPG, WebP).')
      return
    }

    setError(null)
    setSleeping(false)
    setResult(null)

    const url = URL.createObjectURL(file)
    setImageUrl(url)

    // resolve natural dimensions before inference
    const natural = await new Promise<{ w: number; h: number }>((resolve) => {
      const img = new Image()
      img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight })
      img.src = url
    })
    setImageNatural(natural)

    setLoading(true)
    try {
      if (domain === 'baja') {
        const data = await inspectBaja(file)
        setResult({ kind: 'baja', data })
      } else {
        const data = await inspectSoja(file)
        setResult({ kind: 'soja', data })
      }
    } catch (err) {
      if (isSleepingError(err)) {
        setSleeping(true)
      } else {
        setError(err instanceof Error ? err.message : 'Erro desconhecido na inferência.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (files?.[0]) processFile(files[0])
    },
    [domain], // eslint-disable-line react-hooks/exhaustive-deps
  )

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault()
    setDragging(true)
  }

  function onDragLeave() {
    setDragging(false)
  }

  const bajaResult = result?.kind === 'baja' ? result.data : null
  const sojaResult = result?.kind === 'soja' ? result.data : null

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Inspecionar</h1>
        <p className="text-slate-500 mt-1">Envie uma imagem para rodar inferência via HF Space</p>
      </div>

      {/* domain tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {(['baja', 'soja'] as ActiveDomain[]).map((d) => (
          <button
            key={d}
            onClick={() => switchDomain(d)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              domain === d
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {d === 'baja' ? 'Baja (Saga)' : 'Soja'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* left: upload + image */}
        <div className="lg:col-span-2 space-y-4">
          {!imageUrl ? (
            <div
              role="button"
              tabIndex={0}
              onClick={() => inputRef.current?.click()}
              onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl p-12 cursor-pointer transition-colors select-none ${
                dragging
                  ? 'border-brand bg-brand/5'
                  : 'border-slate-300 bg-white hover:border-brand hover:bg-brand/5'
              }`}
            >
              <Upload size={32} className={dragging ? 'text-brand' : 'text-slate-400'} />
              <div className="text-center">
                <p className="text-sm font-medium text-slate-700">
                  Arraste uma imagem ou clique para selecionar
                </p>
                <p className="text-xs text-slate-400 mt-1">PNG, JPG ou WebP</p>
              </div>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </div>
          ) : (
            <div className="space-y-3">
              {bajaResult ? (
                <BBoxCanvas
                  imageUrl={imageUrl}
                  detections={bajaResult.detections}
                  naturalWidth={imageNatural?.w ?? bajaResult.image_width}
                  naturalHeight={imageNatural?.h ?? bajaResult.image_height}
                />
              ) : (
                <div className="rounded-2xl overflow-hidden bg-slate-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageUrl} alt="Imagem enviada" className="w-full block" />
                </div>
              )}

              <button
                onClick={() => {
                  setImageUrl(null)
                  setImageNatural(null)
                  setResult(null)
                  setError(null)
                  setSleeping(false)
                  if (inputRef.current) inputRef.current.value = ''
                }}
                className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
              >
                ← Nova imagem
              </button>
            </div>
          )}

          {sleeping && (
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <Clock size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                O Space está acordando, tente em 30 segundos. Os Spaces do HF entram em modo de
                espera após inatividade.
              </p>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>

        {/* right: results panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">Resultado</h2>

            {loading && (
              <div className="flex flex-col items-center gap-3 py-8">
                <div className="w-8 h-8 rounded-full border-2 border-brand border-t-transparent animate-spin" />
                <p className="text-xs text-slate-400">Rodando inferência…</p>
              </div>
            )}

            {!loading && !result && !error && !sleeping && (
              <p className="text-sm text-slate-400 text-center py-8">
                Envie uma imagem para ver os resultados.
              </p>
            )}

            {bajaResult && (
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
                    Detecções por classe
                  </p>
                  {Object.entries(classCounts(bajaResult.detections)).length === 0 ? (
                    <p className="text-sm text-slate-500">Nenhum defeito encontrado.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {Object.entries(classCounts(bajaResult.detections)).map(([cls, count]) => (
                        <div key={cls} className="flex items-center justify-between text-sm">
                          <span className="text-slate-700 capitalize">
                            {cls.replace(/_/g, ' ')}
                          </span>
                          <span className="font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-full text-xs">
                            {count}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-100 pt-3 space-y-2">
                  <Row label="Total de detecções" value={String(bajaResult.detections.length)} />
                  <Row
                    label="Confiança média"
                    value={
                      bajaResult.detections.length > 0
                        ? `${(avgConfidence(bajaResult.detections) * 100).toFixed(1)}%`
                        : '—'
                    }
                  />
                  <Row label="Inference" value={`${bajaResult.inference_ms.toFixed(0)} ms`} />
                  <Row label="Modelo" value={bajaResult.model} mono />
                </div>
              </div>
            )}

            {sojaResult && (
              <div className="space-y-3">
                <div className="bg-slate-50 rounded-xl px-4 py-3">
                  <p className="text-xs text-slate-500 mb-0.5">Classe predita</p>
                  <p className="text-lg font-semibold text-slate-900 capitalize">
                    {sojaResult.class_name.replace(/_/g, ' ')}
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-3 space-y-2">
                  <Row
                    label="Confiança"
                    value={`${(sojaResult.confidence * 100).toFixed(1)}%`}
                  />
                  <Row label="Inference" value={`${sojaResult.inference_ms.toFixed(0)} ms`} />
                  <Row label="Modelo" value={sojaResult.model} mono />
                </div>

                {sojaResult.confidence < 0.6 && (
                  <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                    Confiança baixa — possível domain shift. Considere corrigir no dataset de
                    correções.
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold text-slate-700 mb-2">Sobre este domínio</h2>
            {domain === 'baja' ? (
              <dl className="space-y-1.5">
                <Row label="AI" value="Saga" />
                <Row label="Modelo" value="YOLOv8n fine-tuned" />
                <Row label="mAP50" value="98.9%" />
                <Row label="Classes" value="4" />
              </dl>
            ) : (
              <dl className="space-y-1.5">
                <Row label="Modelo" value="EfficientNet-B0" />
                <Row label="Acurácia dataset" value="85%" />
                <Row label="Acurácia real" value="29% ⚠" />
                <Row label="Correções" value="57 / 500" />
              </dl>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Row({
  label,
  value,
  mono = false,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-500">{label}</span>
      <span className={`text-slate-800 font-medium ${mono ? 'font-mono text-xs' : ''}`}>
        {value}
      </span>
    </div>
  )
}
