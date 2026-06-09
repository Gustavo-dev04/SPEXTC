interface Criterion {
  label: string
  met: boolean
}

interface ProgressCardProps {
  title: string
  subtitle: string
  current: number
  total: number
  criteria: Criterion[]
}

export default function ProgressCard({ title, subtitle, current, total, criteria }: ProgressCardProps) {
  const pct = Math.min((current / total) * 100, 100)

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
        </div>
        <span className="text-2xl font-bold text-slate-900">
          {pct.toFixed(1)}%
        </span>
      </div>

      <div className="mb-2">
        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <p className="text-sm text-slate-600 mb-4">
        {current.toLocaleString('pt-BR')} de {total.toLocaleString('pt-BR')} fotos coletadas ({pct.toFixed(1)}%)
      </p>

      <div className="border-t border-slate-100 pt-3 space-y-1.5">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">Critérios para v1</p>
        {criteria.map((c) => (
          <div key={c.label} className="flex items-center gap-2 text-sm">
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
              c.met ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
            }`}>
              {c.met ? '✓' : '·'}
            </span>
            <span className={c.met ? 'text-emerald-700' : 'text-slate-500'}>{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
