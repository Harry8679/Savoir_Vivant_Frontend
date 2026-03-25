import { Link } from 'react-router-dom'

export default function HeroSection() {
  return (
    <section style={{ minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>

      {/* Fond : grille + lueur */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        {/* Grille de points */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.07 }}>
          <defs>
            <pattern id="dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="#6366f1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
        {/* Lueur indigo gauche */}
        <div style={{ position: 'absolute', top: '20%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        {/* Lueur ambre droite */}
        <div style={{ position: 'absolute', bottom: '10%', right: '-5%', width: '35vw', height: '35vw', background: 'radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
      </div>

      <div className="max-w-6xl mx-auto px-6 w-full" style={{ position: 'relative', zIndex: 1, paddingTop: '6rem', paddingBottom: '4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>

          {/* Gauche — texte */}
          <div>
            <div className="animate-fade-up opacity-0" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '100px', padding: '6px 14px', marginBottom: '2rem' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', display: 'inline-block' }} className="animate-shimmer" />
              <span style={{ fontSize: '0.75rem', color: '#a5b4fc', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Mathématiques · Physique · Informatique</span>
            </div>

            <h1 className="animate-fade-up opacity-0 delay-100" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: '1.5rem' }}>
              Le savoir,{' '}
              <span style={{ fontStyle: 'italic', color: 'var(--color-primary)' }}>vivant</span>
              <br />à portée de main.
            </h1>

            <p className="animate-fade-up opacity-0 delay-200" style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '440px' }}>
              Des livres pédagogiques pensés pour comprendre vraiment — en numérique, en papier, ou avec un accès illimité par abonnement.
            </p>

            <div className="animate-fade-up opacity-0 delay-300" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link to="/catalogue"
                style={{ padding: '0.875rem 2rem', background: 'var(--color-primary)', color: '#fff', borderRadius: '8px', fontWeight: 500, fontSize: '0.95rem', transition: 'all 0.2s', display: 'inline-block' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-primary-hover)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-primary)'; e.currentTarget.style.transform = 'translateY(0)' }}>
                Explorer le catalogue
              </Link>
              <a href="#offres"
                style={{ padding: '0.875rem 2rem', background: 'transparent', color: 'var(--color-text-muted)', borderRadius: '8px', border: '1px solid var(--color-border)', fontWeight: 400, fontSize: '0.95rem', transition: 'all 0.2s', display: 'inline-block' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-text)'; e.currentTarget.style.borderColor = 'var(--color-text-muted)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.borderColor = 'var(--color-border)' }}>
                Voir les offres
              </a>
            </div>
          </div>

          {/* Droite — livres flottants */}
          <div className="animate-fade-in opacity-0 delay-400" style={{ position: 'relative', height: '480px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookStack />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', opacity: 0.4 }}>
        <span style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Défiler</span>
        <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, var(--color-text-muted), transparent)' }} />
      </div>
    </section>
  )
}

function BookCard({ title, subject, color, rotate, x, y, delay }: {
  title: string, subject: string, color: string, rotate: number, x: string, y: string, delay: string
}) {
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      transform: `rotate(${rotate}deg)`,
      animation: `floatY 6s ease-in-out infinite ${delay}`,
      width: '140px',
    }}>
      <div style={{
        background: color, borderRadius: '10px', padding: '1.25rem 1rem',
        boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)`,
        aspectRatio: '2/3', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      }}>
        <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>{subject}</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', color: '#fff', fontWeight: 700, lineHeight: 1.2 }}>{title}</div>
      </div>
    </div>
  )
}

function BookStack() {
  return (
    <div style={{ position: 'relative', width: '340px', height: '420px' }}>
      <BookCard title="Suites Numériques" subject="Mathématiques" color="linear-gradient(135deg,#6366f1,#4338ca)" rotate={-8} x="10px" y="40px" delay="0s" />
      <BookCard title="Limites de Fonctions" subject="Analyse" color="linear-gradient(135deg,#0f766e,#0d9488)" rotate={4} x="150px" y="20px" delay="1s" />
      <BookCard title="Primitives & Intégrales" subject="Calcul" color="linear-gradient(135deg,#b45309,#d97706)" rotate={-3} x="80px" y="200px" delay="2s" />
    </div>
  )
}