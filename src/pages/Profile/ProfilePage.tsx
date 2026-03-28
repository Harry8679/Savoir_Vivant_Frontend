import { useAuthStore } from '@store/authStore'
import { useAuth } from '@hooks/useAuth'

export default function ProfilePage() {
  const { user } = useAuthStore()
  const { logout } = useAuth()

  if (!user) return null

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', paddingTop: '6rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 3rem' }}>

        {/* Header profil */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '3rem', padding: '2rem', background: 'var(--color-surface)', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
            {user.name?.slice(0, 2).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '4px' }}>
              {user.name}
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>{user.email}</p>
            <div style={{ marginTop: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', padding: '3px 10px', background: user.subscriptionStatus === 'active' ? 'rgba(16,185,129,0.1)' : 'rgba(99,102,241,0.1)', color: user.subscriptionStatus === 'active' ? '#10b981' : 'var(--color-primary)', borderRadius: '100px', fontWeight: 600 }}>
              {user.subscriptionStatus === 'active' ? '✓ Abonné' : 'Sans abonnement'}
            </div>
          </div>
          <button onClick={logout}
            style={{ padding: '0.6rem 1.25rem', background: 'transparent', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = '#ef4444' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.borderColor = 'var(--color-border)' }}>
            Déconnexion
          </button>
        </div>

        {/* Liens rapides */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          {[
            { icon: '📚', label: 'Ma bibliothèque', desc: 'Vos livres numériques achetés', href: '/library' },
            { icon: '📦', label: 'Mes commandes', desc: 'Historique de vos achats', href: '/orders' },
            { icon: '♾️', label: 'Mon abonnement', desc: 'Gérer votre abonnement', href: '/subscription' },
            { icon: '⚙️', label: 'Paramètres', desc: 'Modifier vos informations', href: '/settings' },
          ].map(card => (
            <a key={card.href} href={card.href}
              style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem 1.5rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', textDecoration: 'none', transition: 'all 0.2s', cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.transform = 'translateY(0)' }}>
              <span style={{ fontSize: '1.5rem' }}>{card.icon}</span>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '2px' }}>{card.label}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>{card.desc}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}