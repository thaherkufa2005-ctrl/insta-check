import Hero from '../sections/Hero'
import Analyzer from '../sections/Analyzer'
import HowItWorks from '../sections/HowItWorks'
import Pricing from '../sections/Pricing'
import Footer from '../sections/Footer'

export default function Home() {
  return (
    <div dir="rtl" className="min-h-screen bg-[#0b0710] font-sans text-white antialiased">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <span className="text-xl font-black text-white">
          Insta<span className="text-fuchsia-400">Check</span>
        </span>
        <a
          href="#analyzer"
          className="rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10"
        >
          افحص حساباً
        </a>
      </nav>
      <Hero />
      <Analyzer />
      <HowItWorks />
      <Pricing />
      <Footer />
    </div>
  )
}
