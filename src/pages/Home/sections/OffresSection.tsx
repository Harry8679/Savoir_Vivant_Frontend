import { Link } from 'react-router-dom'

const offres = [
  {
    id: 'papier',
    icon: '📦',
    title: 'Livre Papier',
    price: 'À partir de 19€',
    description: 'Recevez vos livres chez vous. Un objet à tenir entre les mains, à annoter, à garder.',
    features: ['Livraison à domicile', 'Impression haute qualité', 'Accès numérique non inclus'],
    cta: 'Commander en papier',
    href: '/catalogue',
    accent: '#6366f1',
    highlight: false,
  },
  {
    id: 'numerique',
    icon: '📱',
    title: 'Livre Numérique',
    price: 'À partir de 12€',
    description: 'Achetez un livre, lisez-le à vie sur web et mobile. Aucun abonnement requis.',
    features: ['Accès illimité au livre acheté', 'Lecture web + mobile', 'Mises à jour incluses'],
    cta: 'Acheter en numérique',
    href: '/catalogue',
    accent: '#0d9488',
    highlight: false,
  },
  {
    id: 'abonnement',
    icon: '♾️',
    title: 'Abonnement',
    price: '9€ / mois',
    priceSub: 'ou 79€ / an',
    description: 'Accédez à toute la bibliothèque SavoirVivant, en illimité, sur tous vos appareils.',
    features: ['Tous les livres disponibles', 'Web + application mobile', 'Nouveaux livres inclus', 'Annulation à tout moment'],
    cta: "Commencer l'abonnement",
    href: '/register',
    accent: '#f59e0b',
    highlight: true,
  },
]

export default function OffresSection() {
  return (
    <section id="offres" style={{ padding: '7rem 0', background: 'var(--color-surface)', margin: '0 -2rem', padding: '7rem 2rem' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        {/* Header centré */}
        <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 500, marginBottom: '1rem' }}>
            Nos offres
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            Choisissez comment<br />
            <span style={{ fontStyle: 'italic', color: 'var(--color-text-muted)' }}>vous voulez apprendre</span>
          </h2>
        </div>

        {/* Grille centrée avec max-width */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 360px))',
          gap: '1.5rem',
          justifyContent: 'center',
          margin: '0 auto',
        }}>
          {offres.map((offre) => (
            <div
              key={offre.id}
              style={{
                background: offre.highlight ? 'rgba(245,158,11,0.04)' : 'var(--color-surface-2)',
                border: offre.highlight ? '1px solid rgba(245,158,11,0.35)' : '1px solid var(--color-border)',
                borderRadius: '16px',
                padding: '2rem',
                position: 'relative',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              {offre.highlight && (
                <div style={{
                  position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)',
                  background: '#f59e0b', color: '#000', fontSize: '0.65rem', fontWeight: 700,
                  padding: '4px 14px', borderRadius: '100px', textTransform: 'uppercase',
                  letterSpacing: '0.08em', whiteSpace: 'nowrap',
                }}>
                  Le plus populaire
                </div>
              )}

              <div style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>{offre.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text)' }}>
                {offre.title}
              </h3>
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: offre.accent }}>{offre.price}</span>
                {offre.priceSub && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginLeft: '8px' }}>{offre.priceSub}</span>
                )}
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.65, marginBottom: '1.5rem' }}>
                {offre.description}
              </p>

              <ul style={{ listStyle: 'none', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '8px', padding: 0 }}>
                {offre.features.map((f) => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                      <circle cx="8" cy="8" r="7" stroke={offre.accent} strokeWidth="1" opacity="0.4" />
                      <path d="M5 8l2 2 4-4" stroke={offre.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                to={offre.href}
                style={{
                  display: 'block', textAlign: 'center', padding: '0.8rem',
                  background: offre.highlight ? offre.accent : 'transparent',
                  color: offre.highlight ? '#000' : offre.accent,
                  border: `1px solid ${offre.accent}`,
                  borderRadius: '8px', fontSize: '0.9rem', fontWeight: 500, transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = offre.accent; e.currentTarget.style.color = offre.highlight ? '#000' : '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background = offre.highlight ? offre.accent : 'transparent'; e.currentTarget.style.color = offre.highlight ? '#000' : offre.accent }}
              >
                {offre.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}