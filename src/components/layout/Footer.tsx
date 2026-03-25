import { Link } from 'react-router-dom'
import Logo from '@components/ui/Logo'

const footerLinks = {
  Catalogue: [
    { label: 'Mathématiques', href: '/catalogue' },
    { label: 'Physique & Chimie', href: '/catalogue' },
    { label: 'Informatique', href: '/catalogue' },
    { label: 'Langues', href: '/catalogue' },
  ],
  Offres: [
    { label: 'Livre papier', href: '#offres' },
    { label: 'Livre numérique', href: '#offres' },
    { label: 'Abonnement mensuel', href: '#offres' },
    { label: 'Abonnement annuel', href: '#offres' },
  ],
  Compte: [
    { label: 'Connexion', href: '/login' },
    { label: 'Inscription', href: '/register' },
    { label: 'Mon profil', href: '/profile' },
    { label: 'Ma bibliothèque', href: '/library' },
  ],
}

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--color-border)',
      background: 'var(--color-surface)',
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '4rem 3rem 2rem',
      }}>

        {/* Grille principale */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: '3rem',
          marginBottom: '3rem',
        }}>

          {/* Colonne brand */}
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '1.25rem' }}>
              <Logo size={34} />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)' }}>
                Savoir<span style={{ color: 'var(--color-primary)' }}>Vivant</span>
              </span>
            </Link>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.7, maxWidth: '280px', marginBottom: '1.5rem' }}>
              Des livres pédagogiques pour apprendre les mathématiques, la physique, l'informatique et les langues autrement.
            </p>
            {/* Badges plateforme */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['Web', 'iOS', 'Android'].map(p => (
                <span key={p} style={{
                  fontSize: '0.7rem', padding: '4px 10px',
                  border: '1px solid var(--color-border)',
                  borderRadius: '100px',
                  color: 'var(--color-text-muted)',
                  fontWeight: 500,
                }}>
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Colonnes liens */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <div style={{
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--color-text-dim)',
                fontWeight: 500,
                marginBottom: '1.25rem',
              }}>
                {title}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {links.map(({ label, href }) => (
                  <li key={label}>
                    {href.startsWith('#') ? (
                      <a href={href} style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}>
                        {label}
                      </a>
                    ) : (
                      <Link to={href} style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}>
                        {label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Séparateur */}
        <div style={{ height: '1px', background: 'var(--color-border)', marginBottom: '1.75rem' }} />

        {/* Barre du bas */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)' }}>
            © 2026 SavoirVivant — Tous droits réservés
          </span>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {[['CGU', '/cgu'], ['Confidentialité', '/confidentialite'], ['Mentions légales', '/mentions']].map(([label, href]) => (
              <Link key={label} to={href} style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-dim)')}>
                {label}
              </Link>
            ))}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)' }}>
            Fait avec passion en France 🇫🇷
          </span>
        </div>

      </div>
    </footer>
  )
}