const plans = [
  {
    name: 'مجاني',
    price: '0$',
    period: 'للأبد',
    features: ['3 فحوصات باليوم', 'تحليل اسم المستخدم', 'التحليل المتقدم اليدوي', 'نتيجة الاشتباه من 100'],
    highlighted: false,
    cta: 'ابدأ مجاناً',
  },
  {
    name: 'احترافي',
    price: '9$',
    period: 'شهرياً',
    features: [
      'فحوصات غير محدودة',
      'سحب بيانات الحساب تلقائياً',
      'تقرير جودة الجمهور المفصّل',
      'فحص جماعي (حتى 100 حساب)',
      'تصدير التقارير PDF',
    ],
    highlighted: true,
    cta: 'قريباً — سجّل اهتمامك',
  },
]

export default function Pricing() {
  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-16">
      <h2 className="text-center text-3xl font-bold text-white">الخطط والأسعار</h2>
      <p className="mx-auto mt-3 max-w-lg text-center text-white/60">
        ابدأ مجاناً — وارتقِ للنسخة الاحترافية عندما تحتاج تقارير أعمق
      </p>
      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`relative rounded-3xl border p-8 ${
              p.highlighted
                ? 'border-fuchsia-400/50 bg-gradient-to-b from-fuchsia-500/15 to-transparent shadow-xl shadow-fuchsia-500/10'
                : 'border-white/10 bg-white/[0.03]'
            }`}
          >
            {p.highlighted && (
              <span className="absolute -top-3.5 right-6 rounded-full bg-gradient-to-l from-fuchsia-500 to-rose-500 px-4 py-1 text-xs font-bold text-white">
                الأكثر طلباً
              </span>
            )}
            <h3 className="text-lg font-bold text-white/80">{p.name}</h3>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-5xl font-black text-white" dir="ltr">{p.price}</span>
              <span className="text-white/50">/ {p.period}</span>
            </div>
            <ul className="mt-6 space-y-3">
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-white/70">
                  <span className="text-fuchsia-400">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <button
              className={`mt-8 w-full rounded-2xl py-3.5 font-bold transition ${
                p.highlighted
                  ? 'bg-gradient-to-l from-fuchsia-500 to-rose-500 text-white hover:brightness-110'
                  : 'border border-white/15 text-white hover:bg-white/10'
              }`}
            >
              {p.cta}
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
