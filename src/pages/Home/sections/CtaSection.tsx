import { Link } from 'react-router-dom'

export default function CtaSection() {
  return (
    <section style={{ padding: '8rem 0' }}>
      <div className="max-w-6xl mx-auto px-6" style={{ textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.25rem)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: '1.5rem' }}>
            Prêt à apprendre<br />
            <span style={{ fontStyle: 'italic', color: 'var(--color-primary)' }}>autrement ?</span>
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '2.5rem' }}>
            Rejoignez SavoirVivant et accédez à une bibliothèque pédagogique pensée pour les esprits curieux.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register"
              style={{ padding: '1rem 2.5rem', background: 'var(--color-primary)', color: '#fff', borderRadius: '8px', fontWeight: 500, fontSize: '1rem', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-primary-hover)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-primary)'; e.currentTarget.style.transform = 'translateY(0)' }}>
              Créer un compte gratuit
            </Link>
            <Link to="/catalogue"
              style={{ padding: '1rem 2.5rem', background: 'transparent', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)', borderRadius: '8px', fontWeight: 400, fontSize: '1rem', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-text)'; e.currentTarget.style.borderColor = 'var(--color-text-muted)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.borderColor = 'var(--color-border)' }}>
              Voir les livres
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}