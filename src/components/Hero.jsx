import { ArrowRight, Sparkles } from 'lucide-react'

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero-inner">
        <div className="hero-text">
          <span className="hero-eyebrow">
            <Sparkles size={14} /> Fall drop is live — up to 30% off
          </span>
          <h1>
            Everything you love, <span className="hero-highlight">delivered.</span>
          </h1>
          <p>
            Shop electronics, fashion, home goods, sports gear and more from
            independent makers — all in one marketplace.
          </p>
          <a className="hero-cta" href="#products">
            Shop now <ArrowRight size={18} />
          </a>
        </div>
        <div className="hero-art" aria-hidden="true">
          <span className="hero-emoji hero-emoji-1">🎧</span>
          <span className="hero-emoji hero-emoji-2">👟</span>
          <span className="hero-emoji hero-emoji-3">☕</span>
          <span className="hero-emoji hero-emoji-4">📚</span>
        </div>
      </div>
    </section>
  )
}
