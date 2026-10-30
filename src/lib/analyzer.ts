// InstaCheck scoring engine
// Pure heuristic model: combines username-pattern signals with
// account-statistics signals into a 0–100 "fake probability" score.

export interface AccountStats {
  followers: number
  following: number
  posts: number
  accountAgeMonths: number
  hasProfilePic: boolean
  hasBio: boolean
  isVerified: boolean
  avgLikes: number
}

export type Severity = 'ok' | 'warn' | 'bad'

export interface Signal {
  id: string
  label: string
  detail: string
  points: number
  severity: Severity
}

export type VerdictTone = 'green' | 'yellow' | 'orange' | 'red'

export interface AnalysisResult {
  score: number
  verdict: {
    label: string
    description: string
    tone: VerdictTone
  }
  signals: Signal[]
}

/* ---------------- Username pattern signals ---------------- */

export function analyzeUsername(rawUsername: string): Signal[] {
  const u = rawUsername.trim().toLowerCase().replace(/^@/, '')
  const signals: Signal[] = []
  if (!u) return signals

  const digits = (u.match(/\d/g) ?? []).length
  const digitRatio = u.length > 0 ? digits / u.length : 0

  // Trailing digit run: "ahmed_2005_x92" style
  const trailing = u.match(/\d+$/)
  if (trailing && trailing[0].length >= 4) {
    signals.push({
      id: 'trailing-digits',
      label: 'أرقام طويلة بنهاية الاسم',
      detail: `الاسم ينتهي بـ ${trailing[0].length} أرقام متتالية — نمط شائع بالحسابات المولّدة آلياً`,
      points: 14,
      severity: 'bad',
    })
  } else if (trailing && trailing[0].length >= 2) {
    signals.push({
      id: 'trailing-digits',
      label: 'أرقام بنهاية الاسم',
      detail: 'رقمان أو أكثر بنهاية الاسم — مؤشر خفيف، شائع أيضاً بالحسابات الحقيقية',
      points: 4,
      severity: 'warn',
    })
  }

  // Digit ratio
  if (digitRatio > 0.5) {
    signals.push({
      id: 'digit-ratio',
      label: 'أرقام أكثر من الحروف',
      detail: `${Math.round(digitRatio * 100)}% من الاسم أرقام — الأسماء الحقيقية نادراً تكون هيج`,
      points: 15,
      severity: 'bad',
    })
  } else if (digitRatio > 0.3) {
    signals.push({
      id: 'digit-ratio',
      label: 'نسبة أرقام مرتفعة',
      detail: `${Math.round(digitRatio * 100)}% من الاسم أرقام`,
      points: 6,
      severity: 'warn',
    })
  }

  // Repeated character runs (aaaa, xxxx)
  if /(.{1})\1{2,}/.test(u)) {
    signals.push({
      id: 'repeats',
      label: 'حروف مكررة بشكل عشوائي',
      detail: 'تكرار نفس الحرف 3 مرات أو أكثر — نمط عشوائي متكرر بالحسابات الوهمية',
      points: 10,
      severity: 'warn',
    })
  }

  // Separator density
  const seps = (u.match(/[._]/g) ?? []).length
  if (seps >= 3) {
    signals.push({
      id: 'separators',
      label: 'نقاط وشرطات كثيرة',
      detail: `${seps} فواصل (.) و(_) بالاسم — الأسماء المولّدة آلياً تكثر منها`,
      points: 8,
      severity: 'warn',
    })
  }

  // Length
  if (u.length > 24) {
    signals.push({
      id: 'length',
      label: 'اسم طويل بشكل غير طبيعي',
      detail: `${u.length} حرفاً — أطول من المعدل الطبيعي للأسماء الحقيقية`,
      points: 8,
      severity: 'warn',
    })
  }

  // Gibberish heuristic: no vowels and long consonant runs
  const letters = u.replace(/[^a-z]/g, '')
  if (letters.length >= 6) {
    const vowels = (letters.match(/[aeiou]/g) ?? []).length
    if (vowels / letters.length < 0.15 && /[bcdfghjklmnpqrstvwxyz]{5,}/.test(letters)) {
      signals.push({
        id: 'gibberish',
        label: 'تركيب حروف عشوائي',
        detail: 'تسلسل حروف ساكنة طويل بدون معنى — يشبه الأسماء المولّدة آلياً',
        points: 12,
        severity: 'bad',
      })
    }
  }

  if (signals.length === 0) {
    signals.push({
      id: 'clean-name',
      label: 'نمط اسم طبيعي',
      detail: 'شكل اسم المستخدم يبدو طبيعياً وما بيه أنماط توليد آلي واضحة',
      points: -5,
      severity: 'ok',
    })
  }

  return signals
}

/* ---------------- Account statistics signals ---------------- */

export function analyzeStats(s: AccountStats): Signal[] {
  const signals: Signal[] = []

  if (s.isVerified) {
    signals.push({
      id: 'verified',
      label: 'حساب موثّق',
      detail: 'علامة التوثيق الزرقاء — أقوى مؤشر على أن الحساب حقيقي',
      points: -40,
      severity: 'ok',
    })
  }

  // Follower / following ratio
  if (s.following > 0) {
    const ratio = s.followers / s.following
    if (ratio < 0.05 && s.following > 1000) {
      signals.push({
        id: 'ff-ratio',
        label: 'يتابع آلاف ومتابَع من القليل',
        detail: `يتابع ${s.following.toLocaleString()} وعنده بس ${s.followers.toLocaleString()} متابع — نمط كلاسيكي للحسابات الوهمية`,
        points: 25,
        severity: 'bad',
      })
    } else if (ratio < 0.2 && s.following > 500) {
      signals.push({
        id: 'ff-ratio',
        label: 'نسبة متابَعين/متابِعين ضعيفة',
        detail: 'عدد من يتابعهم أكبر بكثير من متابعيه — مؤشر متوسط',
        points: 10,
        severity: 'warn',
      })
    }
  }

  // No posts but many followers
  if (s.posts === 0 && s.followers > 100) {
    signals.push({
      id: 'no-posts',
      label: 'صفر منشورات مع متابعين',
      detail: 'حساب بدون أي منشور وعنده متابعين — غير منطقي لحساب حقيقي',
      points: 20,
      severity: 'bad',
    })
  } else if (s.posts > 0 && s.posts < 3) {
    signals.push({
      id: 'few-posts',
      label: 'منشورات شبه معدومة',
      detail: 'منشور أو منشورين فقط — نشاط ضعيف جداً',
      points: 8,
      severity: 'warn',
    })
  }

  // Account age vs activity
  if (s.accountAgeMonths < 6) {
    signals.push({
      id: 'young',
      label: 'حساب حديث جداً',
      detail: `عمر الحساب ${s.accountAgeMonths} أشهر بس — الحسابات الوهمية عمرها قصير غالباً`,
      points: 10,
      severity: 'warn',
    })
  }
  if (s.accountAgeMonths > 0 && s.posts / s.accountAgeMonths > 30) {
    signals.push({
      id: 'spam-rate',
      label: 'وتيرة نشر مفرطة',
      detail: `أكثر من 30 منشوراً بالشهر — نمط سبام/آلي`,
      points: 12,
      severity: 'warn',
    })
  }

  // Profile completeness
  if (!s.hasProfilePic) {
    signals.push({
      id: 'no-pic',
      label: 'بدون صورة شخصية',
      detail: 'أغلب الحسابات الحقيقية تضع صورة — غيابها مؤشر سلبي',
      points: 12,
      severity: 'warn',
    })
  }
  if (!s.hasBio) {
    signals.push({
      id: 'no-bio',
      label: 'بدون نبذة (Bio)',
      detail: 'النبذة الفارغة شائعة بالحسابات المولّدة بكميات',
      points: 6,
      severity: 'warn',
    })
  }

  // Engagement rate
  if (s.followers > 500 && s.posts > 0) {
    const engagement = (s.avgLikes / s.followers) * 100
    if (engagement < 0.5) {
      signals.push({
        id: 'engagement',
        label: 'تفاعل شبه معدوم',
        detail: `نسبة التفاعل ${engagement.toFixed(2)}% — أقل من 0.5% يعني المتابعين غالباً وهميين أو مجمّدين`,
        points: 20,
        severity: 'bad',
      })
    } else if (engagement < 1.5) {
      signals.push({
        id: 'engagement',
        label: 'تفاعل ضعيف',
        detail: `نسبة التفاعل ${engagement.toFixed(2)}% — أقل من الطبيعي (1.5%–3%)`,
        points: 8,
        severity: 'warn',
      })
    } else {
      signals.push({
        id: 'engagement',
        label: 'تفاعل صحي',
        detail: `نسبة التفاعل ${engagement.toFixed(2)}% — ضمن المعدل الطبيعي، مؤشر إيجابي`,
        points: -10,
        severity: 'ok',
      })
    }
  }

  return signals
}

/* ---------------- Final score ---------------- */

export function computeResult(username: string, stats?: AccountStats): AnalysisResult {
  const signals = [...analyzeUsername(username), ...(stats ? analyzeStats(stats) : [])]

  const raw = signals.reduce((sum, s) => sum + s.points, 15) // prior: slight base suspicion without data
  const score = Math.max(0, Math.min(100, Math.round(raw)))

  const verdicts: Record<VerdictTone, { label: string; description: string }> = {
    green: {
      label: 'غالباً حقيقي',
      description: 'المؤشرات المتوفرة تبدو طبيعية. لا يوجد نمط واضح لحساب وهمي.',
    },
    yellow: {
      label: 'مشكوك فيه',
      description: 'توجد مؤشرات سلبية خفيفة. يُنصح بالتدقيق اليدوي قبل التعامل مع الحساب.',
    },
    orange: {
      label: 'وهمي محتمل',
      description: 'عدة مؤشرات قوية تشير إلى حساب وهمي أو آلي. تعامل معه بحذر شديد.',
    },
    red: {
      label: 'وهمي شبه مؤكد',
      description: 'المؤشرات مجتمعة تشير بقوة إلى حساب وهمي أو مولّد آلياً.',
    },
  }

  const tone: VerdictTone = score <= 25 ? 'green' : score <= 50 ? 'yellow' : score <= 75 ? 'orange' : 'red'

  return {
    score,
    verdict: { ...verdicts[tone], tone },
    signals: signals.sort((a, b) => b.points - a.points),
  }
}
