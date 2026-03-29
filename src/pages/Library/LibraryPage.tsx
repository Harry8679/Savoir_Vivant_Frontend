import { Link } from 'react-router-dom'
import { useAuthStore } from '@store/authStore'
import DashboardLayout from '@components/layout/DashboardLayout'

const mockBooks = [
  { id: '1', title: 'Suites Numériques', subject: 'Mathématiques', level: 'Terminale', color: 'linear-gradient(135deg,#6366f1,#4338ca)', pages: 180, progress: 65 },
  { id: '2', title: 'Limites de Fonctions', subject: 'Analyse', level: 'MPSI', color: 'linear-gradient(135deg,#0f766e,#0d9488)', pages: 210, progress: 30 },
  { id: '3', title: 'Primitives & Intégrales', subject: 'Calcul', level: 'MP', color: 'linear-gradient(135deg,#b45309,#d97706)', pages: 195, progress: 0 },
]

export default function LibraryPage() {
  const { user } = useAuthStore()

  return (
    <DashboardLayout
      title="Ma bibliothèque"
      subtitle={`${mockBooks.length} livre${mockBooks.length > 1 ? 's' : ''} dans votre collection`}
    >
      {/* Stats rapides */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
        {[
          { label: 'Livres possédés', value: mockBooks.length, color: 'var(--color-primary)' },
          { label: 'En cours de lecture', value: mockBooks.filter(b => b.progress > 0 && b.progress < 100).length, color: '#f59e0b' },
          { label: 'Terminés', value: mockBooks.filter(b => b.progress === 100).length, color: '#10b981' },
        ].map(stat => (
          <div key={stat.label} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '14px', padding: '1.25rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: stat.color, opacity: 0.7 }} />
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900, color: stat.color, marginBottom: '4px' }}>{stat.value}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Banner abonnement */}
      {user?.subscriptionStatus !== 'active' && (
        <div style={{ padding: '1.25rem 1.5rem', background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(99,102,241,0.03))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '14px', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>♾️</div>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '2px' }}>Accédez à toute la bibliothèque</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Abonnement à 9€/mois — accès illimité à tous les livres.</div>
            </div>
          </div>
          <Link to="/subscription" style={{ padding: '0.6rem 1.25rem', background: 'var(--color-primary)', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 700, whiteSpace: 'nowrap', transition: 'background 0.2s' }}>
            S'abonner
          </Link>
        </div>
      )}

      {/* Grille livres */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
        {mockBooks.map(book => (
          <div key={book.id} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px', overflow: 'hidden', transition: 'all 0.25s', cursor: 'pointer' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)'; e.currentTarget.style.borderColor = 'var(--color-primary)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--color-border)' }}>

            {/* Cover */}
            <div style={{ background: book.color, aspectRatio: '3/4', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.25rem 1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                {book.progress > 0 && (
                  <span style={{ fontSize: '0.6rem', padding: '2px 8px', background: 'rgba(255,255,255,0.2)', color: '#fff', borderRadius: '100px', fontWeight: 600 }}>
                    {book.progress}%
                  </span>
                )}
              </div>
              <div>
                <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>{book.subject}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: '#fff', fontWeight: 800, lineHeight: 1.2 }}>{book.title}</div>
              </div>
            </div>

            {/* Info + progress */}
            <div style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>{book.level}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>{book.pages} pages</span>
              </div>

              {/* Progress bar */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{ height: '4px', background: 'var(--color-border)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${book.progress}%`, background: book.progress === 100 ? '#10b981' : 'var(--color-primary)', borderRadius: '2px', transition: 'width 0.5s ease' }} />
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '4px', fontWeight: 500 }}>
                  {book.progress === 0 ? 'Non commencé' : book.progress === 100 ? 'Terminé ✓' : `${book.progress}% lu`}
                </div>
              </div>

              <button style={{ width: '100%', padding: '0.55rem', background: book.progress > 0 ? 'transparent' : 'var(--color-primary)', color: book.progress > 0 ? 'var(--color-primary)' : '#fff', border: `1px solid var(--color-primary)`, borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-primary)'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background = book.progress > 0 ? 'transparent' : 'var(--color-primary)'; e.currentTarget.style.color = book.progress > 0 ? 'var(--color-primary)' : '#fff' }}>
                {book.progress === 0 ? 'Commencer' : book.progress === 100 ? 'Relire' : 'Continuer'}
              </button>
            </div>
          </div>
        ))}

        {/* Card ajouter */}
        <Link to="/catalogue" style={{
          background: 'transparent', border: '2px dashed var(--color-border)',
          borderRadius: '16px', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '12px',
          minHeight: '320px', textDecoration: 'none', transition: 'all 0.2s',
          color: 'var(--color-text-muted)',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-primary)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-muted)' }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.5" />
            <path d="M16 10v12M10 16h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Ajouter un livre</span>
        </Link>
      </div>
    </DashboardLayout>
  )
}