import { useMemo, useState } from 'react'
import Gauge from '../components/Gauge'
import {
  computeResult,
  type AccountStats,
  type AnalysisResult,
  type Signal,
} from '../lib/analyzer'

function extractUsername(input: string): string {
  const v = input.trim()
  const m = v.match(/instagram\.com\/([A-Za-z0-9._]+)/i)
  if (m) return m[1]
  return v.replace(/^@/, '')
}

const severityStyle: Record<Signal['severity'], string> = {
  ok: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  warn: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300',
  bad: 'border-red-500/30 bg-red-500/10 text-red-300',
}

const severityDot: Record<Signal['severity'], string> = {
  ok: 'bg-emerald-400',
  warn: 'bg-yellow-400',
  bad: 'bg-red-400',
}

interface NumberFieldProps {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}

function NumberField({ label, value, onChange, placeholder }: NumberFieldProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm text-white/60">{label}</span>
      <input
        type="number"
        min={0}
        dir="ltr"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? '0'}
        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-left text-white outline-none transition focus:border-fuchsia-400/60 focus:bg-white/10"
      />
    </label>
  )
}

export default function Analyzer() {
  const [usernameInput, setUsernameInput] = useState('')
  const [advanced, setAdvanced] = useState(false)
  const [followers, setFollowers] = useState('')
  const [following, setFollowing] = useState('')
  const [posts, setPosts] = useState('')
  const [age, setAge] = useState('')
  const [avgLikes, setAvgLikes] = useState('')
  const [hasPic, setHasPic] = useState(true)
  const [hasBio, setHasBio] = useState(true)
  const [isVerified, setIsVerified] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [analyzedName, setAnalyzedName] = useState('')
  const [error, setError] = useState('')

  const canAnalyze = useMemo(() => extractUsername(usernameInput).length > 0, [usernameInput])

  function handleAnalyze() {
    const username = extractUsername(usernameInput)
    if (!username) {
      setError('أدخل اسم مستخدم أو رابط حساب إنستغرام أولاً')
      return
    }
    setError('')

    let stats: AccountStats | undefined
    if (advanced) {
      stats = {
        followers: Number(followers) || 0,
        following: Number(following) || 0,
        posts: Number(posts) || 0,
        accountAgeMonths: Number(age) || 0,
        avgLikes: Number(avgLikes) || 0,
        hasProfilePic: hasPic,
        hasBio: hasBio,
        isVerified,
      }
    }

    setAnalyzedName(username)
    setResult(computeResult(username, stats))
  }

  return (
    <section id="analyzer" className="mx-auto w-full max-w-4xl px-6 py-16">
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur sm:p-10">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">افحص حساب إنستغرام</h2>
        <p className="mt-2 text-white/60">
          الصق اسم المستخدم أو رابط الحساب — وفعّل التحليل المتقدم لنتيجة أدق
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            dir="ltr"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && canAnalyze && handleAnalyze()}
            placeholder="@username أو https://instagram.com/username"
            className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-left text-lg text-white outline-none transition placeholder:text-white/30 focus:border-fuchsia-400/60 focus:bg-white/10"
          />
          <button
            onClick={handleAnalyze}
            disabled={!canAnalyze}
            className="rounded-2xl bg-gradient-to-l from-fuchsia-500 via-rose-500 to-amber-400 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-fuchsia-500/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          >
            تحليل
          </button>
        </div>

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        <button
          onClick={() => setAdvanced((v) => !v)}
          className="mt-5 text-sm font-medium text-fuchsia-300 transition hover:text-fuchsia-200"
        >
          {advanced ? '▾ إخفاء التحليل المتقدم' : '▸ تحليل متقدم (بيانات الحساب)'}
        </button>

        {advanced && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-6">
            <p className="mb-5 text-sm text-white/50">
              أدخل أرقام الحساب من صفحته على إنستغرام — كلما زادت البيانات كانت النتيجة أدق
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <NumberField label="عدد المتابَعين" value={followers} onChange={setFollowers} />
              <NumberField label="عدد المتابِعين" value={following} onChange={setFollowing} />
              <NumberField label="عدد المنشورات" value={posts} onChange={setPosts} />
              <NumberField label="عمر الحساب (بالأشهر)" value={age} onChange={setAge} />
              <NumberField label="معدل الإعجابات بالمنشور" value={avgLikes} onChange={setAvgLikes} />
            </div>
            <div className="mt-5 flex flex-wrap gap-6">
              {(
                [
                  ['صورة شخصية موجودة', hasPic, setHasPic],
                  ['نبذة (Bio) موجودة', hasBio, setHasBio],
                  ['حساب موثّق ✓', isVerified, setIsVerified],
                ] as const
              ).map(([label, value, setter]) => (
                <label key={label} className="flex cursor-pointer items-center gap-2.5 text-sm text-white/70">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={value}
                    onClick={() => setter(!value)}
                    className={`relative h-6 w-11 rounded-full transition ${value ? 'bg-fuchsia-500' : 'bg-white/15'}`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${value ? 'right-0.5' : 'right-[22px]'}`}
                    />
                  </button>
                  {label}
                </label>
              ))}
            </div>
          </div>
        )}

        {result && (
          <div className="mt-10 border-t border-white/10 pt-10">
            <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
              <div className="flex flex-col items-center gap-3">
                <Gauge score={result.score} tone={result.verdict.tone} />
                <span
                  className={`rounded-full px-5 py-1.5 text-sm font-bold ${
                    {
                      green: 'bg-emerald-500/15 text-emerald-300',
                      yellow: 'bg-yellow-500/15 text-yellow-300',
                      orange: 'bg-orange-500/15 text-orange-300',
                      red: 'bg-red-500/15 text-red-300',
                    }[result.verdict.tone]
                  }`}
                >
                  {result.verdict.label}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white">
                  نتيجة فحص <span dir="ltr" className="text-fuchsia-300">@{analyzedName}</span>
                </h3>
                <p className="mt-2 leading-relaxed text-white/60">{result.verdict.description}</p>

                <ul className="mt-6 space-y-3">
                  {result.signals.map((s) => (
                    <li
                      key={s.id}
                      className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${severityStyle[s.severity]}`}
                    >
                      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${severityDot[s.severity]}`} />
                      <div>
                        <div className="font-bold text-white">{s.label}</div>
                        <div className="mt-0.5 leading-relaxed opacity-80">{s.detail}</div>
                      </div>
                      <span className="mr-auto shrink-0 font-mono text-xs opacity-60" dir="ltr">
                        {s.points > 0 ? `+${s.points}` : s.points}
                      </span>
                    </li>
                  ))}
                </ul>

                <p className="mt-6 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs leading-relaxed text-white/40">
                  تنبيه: هاي النتيجة تقدير إحصائي مبني على مؤشرات سلوكية، وليست حكماً نهائياً.
                  النسخة المدفوعة القادمة ستسحب البيانات تلقائياً وتقدم تقريراً مفصلاً عن جودة الجمهور.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
