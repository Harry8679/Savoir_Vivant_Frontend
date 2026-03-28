import { Link } from 'react-router-dom'
import { useAuthStore } from '@store/authStore'

const mockBooks = [
  { id: '1', title: 'Suites Numériques', subject: 'Mathématiques', level: 'Terminale', color: 'linear-gradient(135deg,#6366f1,#4338ca)', pages: 180 },
  { id: '2', title: 'Limites de Fonctions', subject: 'Analyse', level: 'MPSI', color: 'linear-gradient(135deg,#0f766e,#0d9488)', pages: 210 },
  { id: '3', title: 'Primitives & Intégrales', subject: 'Calcul', level: 'MP', color: 'linear-gradient(135deg,#b45309,#d97706)', pages: 195 },
]

export default function LibraryPage() {
  const { user } = useAuthStore()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', paddingTop: '6rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 3rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <Link to="/profile" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--color-text-muted)', textDecoration: 'none', fontWeight: 600, marginBottom: '1.5rem', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Mon profil
          </Link>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Ma bibliothèque
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
            {mockBooks.length} livre{mockBooks.length > 1 ? 's' : ''} dans votre collection
          </p>
        </div>

        {/* Abonnement banner */}
        {user?.subscriptionStatus !== 'active' && (
          <div style={{ padding: '1rem 1.5rem', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '2px' }}>
                Accédez à tous les livres
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                Avec l'abonnement à 9€/mois, lisez toute la bibliothèque sans limite.
              </div>
            </div>
            <Link to="/subscription" style={{ padding: '0.5rem 1.25rem', background: 'var(--color-primary)', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
              S'abonner
            </Link>
          </div>
        )}

        {/* Grille livres */}
        {mockBooks.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {mockBooks.map(book => (
              <div key={book.id}
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '14px', overflow: 'hidden', transition: 'all 0.2s', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'var(--color-primary)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--color-border)' }}>
                {/* Cover */}
                <div style={{ background: book.color, aspectRatio: '3/4', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '1rem' }}>
                  <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>{book.subject}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.875rem', color: '#fff', fontWeight: 700, lineHeight: 1.2 }}>{book.title}</div>
                </div>
                {/* Info */}
                <div style={{ padding: '0.875rem 1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500, marginBottom: '8px' }}>{book.level} · {book.pages} pages</div>
                  <button style={{ width: '100%', padding: '0.5rem', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'background 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-primary-hover)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-primary)')}>
                    Lire
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon="📚" title="Aucun livre pour l'instant" desc="Achetez votre premier livre ou souscrivez un abonnement." cta="Explorer le catalogue" href="/catalogue" />
        )}
      </div>
    </div>
  )
}

function EmptyState({ icon, title, desc, cta, href }: { icon: string; title: string; desc: string; cta: string; href: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon}</div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 500, marginBottom: '1.5rem' }}>{desc}</p>
      <Link to={href} style={{ padding: '0.75rem 1.5rem', background: 'var(--color-primary)', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 700 }}>{cta}</Link>
    </div>
  )
}