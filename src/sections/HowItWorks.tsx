const cards = [
  {
    icon: '🔍',
    title: 'تحليل اسم المستخدم',
    text: 'نفحص أنماط التوليد الآلي: الأرقام الطويلة، الحروف العشوائية، والتكرارات المريبة.',
  },
  {
    icon: '📊',
    title: 'تحليل الأرقام',
    text: 'نسبة المتابَعين للمتابِعين، وتيرة النشر، وعمر الحساب — الأرقام ما تكذب.',
  },
  {
    icon: '💬',
    title: 'معدل التفاعل',
    text: 'حساب بعشرة آلاف متابع و10 إعجابات بالمنشور؟ التفاعل المنخفض يفضح الجمهور الوهمي.',
  },
]

export default function HowItWorks() {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-16">
      <h2 className="text-center text-3xl font-bold text-white">شلون نكشف الحسابات الوهمية؟</h2>
      <p className="mx-auto mt-3 max-w-xl text-center text-white/60">
        محرك تحليل يجمع أكثر من 12 مؤشراً سلوكياً في درجة واحدة من 100
      </p>
      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {cards.map((c) => (
          <div
            key={c.title}
            className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-fuchsia-400/40 hover:bg-white/[0.06]"
          >
            <div className="text-4xl">{c.icon}</div>
            <h3 className="mt-4 text-lg font-bold text-white">{c.title}</h3>
            <p className="mt-2 leading-relaxed text-white/55">{c.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
