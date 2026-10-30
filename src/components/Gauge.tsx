interface GaugeProps {
  score: number // 0-100
  tone: 'green' | 'yellow' | 'orange' | 'red'
}

const toneColors: Record<GaugeProps['tone'], string> = {
  green: '#22c55e',
  yellow: '#eab308',
  orange: '#f97316',
  red: '#ef4444',
}

export default function Gauge({ score, tone }: GaugeProps) {
  const size = 220
  const stroke = 18
  const r = (size - stroke) / 2
  const circumference = 2 * Math.PI * r
  const offset = circumference - (score / 100) * circumference
  const color = toneColors[tone]

  return (
    <div className="relative inline-flex items-center justify-center" role="img" aria-label={`درجة الاشتباه ${score} من 100`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease-out, stroke 0.5s' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-6xl font-black tabular-nums" style={{ color }}>
          {score}
        </span>
        <span className="mt-1 text-sm text-white/50">من 100</span>
      </div>
    </div>
  )
}
