export default function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-8 pt-24 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-1/2 h-[500px] w-[700px] translate-x-1/2 rounded-full bg-fuchsia-600/20 blur-[120px]"
      />
      <div className="relative mx-auto max-w-3xl">
        <span className="inline-block rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 px-4 py-1.5 text-sm font-medium text-fuchsia-300">
          كاشف الحسابات الوهمية على إنستغرام
        </span>
        <h1 className="mt-6 text-4xl font-black leading-tight text-white sm:text-6xl">
          هل الحساب حقيقي…
          <br />
          <span className="bg-gradient-to-l from-fuchsia-400 via-rose-400 to-amber-300 bg-clip-text text-transparent">
            أم مجرد وهم؟
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/60">
          InstaCheck يحلل اسم المستخدم وأرقام الحساب عبر أكثر من 12 مؤشراً سلوكياً
          ويطيك نسبة احتمال أن الحساب وهمي — خلال ثوانٍ.
        </p>
        <a
          href="#analyzer"
          className="mt-10 inline-block rounded-2xl bg-gradient-to-l from-fuchsia-500 via-rose-500 to-amber-400 px-10 py-4 text-lg font-bold text-white shadow-xl shadow-fuchsia-500/30 transition hover:brightness-110"
        >
          جرّب الفحص الآن ↓
        </a>
      </div>
    </section>
  )
}
