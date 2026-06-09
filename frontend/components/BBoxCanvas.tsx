'use client'

import { useEffect, useRef } from 'react'
import type { BBoxDetection } from '@/lib/types'

const CLASS_COLORS: Record<string, string> = {
  casca_de_laranja: '#f97316',
  escorrimento: '#3b82f6',
  bolha: '#a855f7',
  water_spotting: '#06b6d4',
}

const DEFAULT_COLOR = '#4f8ef7'

interface BBoxCanvasProps {
  imageUrl: string
  detections: BBoxDetection[]
  naturalWidth: number
  naturalHeight: number
}

export default function BBoxCanvas({ imageUrl, detections, naturalWidth, naturalHeight }: BBoxCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.src = imageUrl
    img.onload = () => {
      const containerWidth = container.clientWidth
      const scale = containerWidth / naturalWidth
      const displayHeight = naturalHeight * scale

      canvas.width = containerWidth
      canvas.height = displayHeight

      ctx.drawImage(img, 0, 0, containerWidth, displayHeight)

      detections.forEach((det) => {
        const [x1, y1, x2, y2] = det.bbox
        const color = CLASS_COLORS[det.class_name] ?? DEFAULT_COLOR

        const rx = x1 * scale
        const ry = y1 * scale
        const rw = (x2 - x1) * scale
        const rh = (y2 - y1) * scale

        ctx.strokeStyle = color
        ctx.lineWidth = 2
        ctx.strokeRect(rx, ry, rw, rh)

        const label = `${det.class_name} ${(det.confidence * 100).toFixed(0)}%`
        ctx.font = '12px system-ui'
        const textWidth = ctx.measureText(label).width
        const labelHeight = 18

        ctx.fillStyle = color
        ctx.fillRect(rx, ry - labelHeight, textWidth + 8, labelHeight)

        ctx.fillStyle = '#ffffff'
        ctx.fillText(label, rx + 4, ry - 4)
      })
    }
  }, [imageUrl, detections, naturalWidth, naturalHeight])

  return (
    <div ref={containerRef} className="w-full rounded-xl overflow-hidden bg-slate-900">
      <canvas ref={canvasRef} className="w-full block" />
    </div>
  )
}
