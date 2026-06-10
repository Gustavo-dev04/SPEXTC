'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Upload, AlertCircle, Clock } from 'lucide-react'
import BBoxCanvas from '@/components/BBoxCanvas'
import type { BBoxDetection } from '@/lib/types'

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

async function inspectMagnus(file: File): Promise<BajaResult> {
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

async function inspectSaga(file: File): Promise<SojaResult> {
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

const DOMAIN_CONFIG: Record<ActiveDomain, { label: string; tagline: string }> = {
  baja: { label: 'Magnus', tagline: 'Inspeção de superfícies' },
  soja: { label: 'Saga', tagline: 'Inspeção granular' },
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

    const natural = await new Promise<{ w: number; h: number }>((resolve) => {
      const img = new Image()
      img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight })
      img.src = url
    })
    setImageNatural(natural)

    setLoading(true)
    try {
      if (domain === 'baja') {
        const data = await inspectMagnus(file)
        setResult({ kind: 'baja', data })
      } else {
        const data = await inspectSaga(file)
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

  const bajaResult = result?.kind === 'baja' ? result.data : null
  const sojaResult = result?.kind === 'soja' ? result.data : null

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 py-12 space-y-8">

      <div>
        <p className="text-[11px] text-white/25 tracking-[0.35em] uppercase mb-2">Inferência</p>
        <h1 className="text-3xl font-bold text-white tracking-tight">Inspecionar</h1>
        <p className="text-white/30 mt-1 text-sm">Envie uma imagem para rodar inferência via HF Space</p>
      </div>

      {/* Domain tabs */}
      <div className="flex gap-1 bg-white/[0.04] border border-white/[0.07] p-1 rounded-xl w-fit">
        {(['baja', 'soja'] as ActiveDomain[]).map((d) => (
          <button
            key={d}
            onClick={() => switchDomain(d)}
            className={`px-5 py-2 text-[13px] font-medium rounded-lg transition-all ${
              domain === d
                ? 'bg-white text-black shadow-sm'
                : 'text-white/35 hover:text-white/60'
            }`}
          >
            {DOMAIN_CONFIG[d].label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Upload + Image */}
        <div className="lg:col-span-2 space-y-4">
          {!imageUrl ? (
            <div
              role="button"
              tabIndex={0}
              onClick={() => inputRef.current?.click()}
              onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
              onDrop={onDrop}
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              className={`flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-2xl p-16 cursor-pointer transition-all select-none ${
                dragging
                  ? 'border-white/30 bg-white/[0.04]'
                  : 'border-white/[0.1] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.03]'
              }`}
            >
              <Upload size={28} className={dragging ? 'text-white/60' : 'text-white/20'} />
              <div className="text-center">
                <p className="text-sm text-white/50">
                  Arraste uma imagem ou clique para selecionar
                </p>
                <p className="text-xs text-white/20 mt-1">PNG, JPG ou WebP</p>
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
                <div className="rounded-2xl overflow-hidden bg-[#080808] border border-white/[0.06]">
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
                className="text-xs text-white/25 hover:text-white/50 transition-colors"
              >
                ← Nova imagem
              </button>
            </div>
          )}

          {sleeping && (
            <div className="flex items-start gap-3 bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3">
              <Clock size={15} className="text-white/40 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-white/50">
                O Space está acordando — tente em 30 segundos. Os Spaces do HF entram em modo de
                espera após inatividade.
              </p>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              <AlertCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
        </div>

        {/* Results panel */}
        <div className="space-y-4">
          <div className="bg-[#080808] border border-white/[0.06] rounded-2xl p-5">
            <h2 className="text-[12px] font-medium text-white/35 uppercase tracking-[0.15em] mb-4">
              Resultado
            </h2>

            {loading && (
              <div className="flex flex-col items-center gap-3 py-8">
                <div className="w-7 h-7 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
                <p className="text-xs text-white/25">Rodando inferência…</p>
              </div>
            )}

            {!loading && !result && !error && !sleeping && (
              <p className="text-sm text-white/20 text-center py-8">
                Envie uma imagem para ver os resultados.
              </p>
            )}

            {bajaResult && (
              <div className="space-y-4">
                <div>
                  <p className="text-[11px] text-white/25 uppercase tracking-[0.15em] mb-2">
                    Detecções por classe
                  </p>
                  {Object.entries(classCounts(bajaResult.detections)).length === 0 ? (
                    <p className="text-sm text-white/30">Nenhum defeito encontrado.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {Object.entries(classCounts(bajaResult.detections)).map(([cls, count]) => (
                        <div key={cls} className="flex items-center justify-between text-sm">
                          <span className="text-white/50 capitalize">
                            {cls.replace(/_/g, ' ')}
                          </span>
                          <span className="font-mono text-white/60 text-xs bg-white/[0.06] px-2 py-0.5 rounded-full">
                            {count}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-t border-white/[0.06] pt-3 space-y-2">
                  <Row label="Total" value={String(bajaResult.detections.length)} />
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
                <div className="bg-white/[0.04] border border-white/[0.07] rounded-xl px-4 py-3">
                  <p className="text-[11px] text-white/25 mb-1">Classe predita</p>
                  <p className="text-lg font-semibold text-white/80 capitalize">
                    {sojaResult.class_name.replace(/_/g, ' ')}
                  </p>
                </div>

                <div className="border-t border-white/[0.06] pt-3 space-y-2">
                  <Row label="Confiança" value={`${(sojaResult.confidence * 100).toFixed(1)}%`} />
                  <Row label="Inference" value={`${sojaResult.inference_ms.toFixed(0)} ms`} />
                  <Row label="Modelo" value={sojaResult.model} mono />
                </div>

                {sojaResult.confidence < 0.6 && (
                  <p className="text-xs text-white/30 bg-white/[0.03] border border-white/[0.07] rounded-lg px-3 py-2">
                    Confiança baixa — possível domain shift. Considere corrigir no dataset de
                    correções.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Model info */}
          <div className="bg-[#080808] border border-white/[0.06] rounded-2xl p-5">
            <h2 className="text-[12px] font-medium text-white/35 uppercase tracking-[0.15em] mb-3">
              {DOMAIN_CONFIG[domain].label}
            </h2>
            {domain === 'baja' ? (
              <dl className="space-y-2">
                <Row label="Tipo" value="Generalista" />
                <Row label="Pipeline" value="YOLOv8n fine-tuned" mono />
                <Row label="mAP50" value="98.9%" />
                <Row label="Classes" value="4" />
              </dl>
            ) : (
              <dl className="space-y-2">
                <Row label="Tipo" value="Flagship" />
                <Row label="Pipeline" value="EfficientNet-B0" mono />
                <Row label="Acurácia dataset" value="85%" />
                <Row label="Acurácia real" value="64%" />
                <Row label="Correções" value="57 / 500" />
              </dl>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between text-[13px]">
      <span className="text-white/30">{label}</span>
      <span className={`text-white/60 font-medium ${mono ? 'font-mono text-[11px]' : ''}`}>
        {value}
      </span>
    </div>
  )
}
