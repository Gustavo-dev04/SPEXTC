import { ExternalLink } from 'lucide-react'

interface Metric {
  label: string
  value: string
  highlight?: boolean
}

interface DomainCardProps {
  title: string
  subtitle?: string
  badge?: string
  badgeColor?: 'green' | 'yellow' | 'blue'
  metrics: Metric[]
  footer: string
  hfSpace: string
}

const badgeColors = {
  green: 'bg-emerald-100 text-emerald-700',
  yellow: 'bg-amber-100 text-amber-700',
  blue: 'bg-blue-100 text-blue-700',
}

export default function DomainCard({
  title,
  subtitle,
  badge,
  badgeColor = 'green',
  metrics,
  footer,
  hfSpace,
}: DomainCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            {badge && (
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeColors[badgeColor]}`}>
                {badge}
              </span>
            )}
          </div>
          {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        <a
          href={`https://huggingface.co/spaces/${hfSpace}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-brand transition-colors"
          title="Abrir HF Space"
        >
          <ExternalLink size={16} />
        </a>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {metrics.map((m) => (
          <div key={m.label} className="bg-slate-50 rounded-xl px-4 py-3">
            <p className="text-xs text-slate-500 mb-0.5">{m.label}</p>
            <p className={`text-lg font-semibold ${m.highlight ? 'text-amber-600' : 'text-slate-900'}`}>
              {m.value}
            </p>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-400 border-t border-slate-100 pt-3">{footer}</p>
    </div>
  )
}
