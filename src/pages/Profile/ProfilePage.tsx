import { Link } from 'react-router-dom'
import DashboardLayout from '@components/layout/DashboardLayout'
import { useAuthStore } from '@store/authStore'

const quickLinks = [
  { icon: '📚', label: 'Ma bibliothèque', desc: '3 livres dans votre collection', href: '/library', color: '#6366f1' },
  { icon: '📦', label: 'Mes commandes', desc: '2 commandes passées', href: '/orders', color: '#0d9488' },
  { icon: '♾️', label: 'Mon abonnement', desc: 'Sans abonnement actif', href: '/subscription', color: '#f59e0b' },
  { icon: '⚙️', label: 'Paramètres', desc: 'Gérer vos préférences', href: '/settings', color: '#db2777' },
]

export default function ProfilePage() {
  const { user } = useAuthStore()
  if (!user) return null

  return (
    <DashboardLayout title={`Bonjour, ${user.name?.split(' ')[0]} 👋`} subtitle="Bienvenue dans votre espace personnel SavoirVivant">

      {/* Carte profil */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(99,102,241,0.03))',
        border: '1px solid rgba(99,102,241,0.2)', borderRadius: '20px',
        padding: '2rem', marginBottom: '2.5rem',
        display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '180px', height: '180px', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Avatar grand */}
        <div style={{
          width: '80px', height: '80px', borderRadius: '20px', flexShrink: 0,
          background: 'linear-gradient(135deg, var(--color-primary), #4338ca)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2rem', fontWeight: 800, color: '#fff',
          boxShadow: '0 8px 24px rgba(99,102,241,0.3)',
        }}>
          {user.name?.slice(0, 2).toUpperCase()}
        </div>

        <div style={{ flex: 1 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 900, color: 'var(--color-text)', marginBottom: '4px', letterSpacing: '-0.02em' }}>
            {user.name}
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 500, marginBottom: '10px' }}>{user.email}</p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.72rem', padding: '3px 10px', borderRadius: '100px', background: user.subscriptionStatus === 'active' ? 'rgba(16,185,129,0.1)' : 'rgba(99,102,241,0.1)', color: user.subscriptionStatus === 'active' ? '#10b981' : 'var(--color-primary)', fontWeight: 700 }}>
              {user.subscriptionStatus === 'active' ? '✓ Abonné actif' : 'Sans abonnement'}
            </span>
            <span style={{ fontSize: '0.72rem', padding: '3px 10px', borderRadius: '100px', background: 'rgba(99,102,241,0.08)', color: 'var(--color-primary)', fontWeight: 600, border: '1px solid rgba(99,102,241,0.2)' }}>
              {user.role === 'admin' ? '👑 Admin' : '👤 Utilisateur'}
            </span>
          </div>
        </div>

        <Link to="/settings" style={{ padding: '0.65rem 1.25rem', background: 'transparent', border: '1px solid var(--color-border)', borderRadius: '10px', color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-primary)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-muted)' }}>
          Modifier le profil
        </Link>
      </div>

      {/* Liens rapides */}
      <div style={{ marginBottom: '1rem', fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        Accès rapide
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
        {quickLinks.map(card => (
          <Link key={card.href} to={card.href} style={{
            display: 'flex', alignItems: 'center', gap: '1.25rem',
            padding: '1.5rem', background: 'var(--color-surface)',
            border: '1px solid var(--color-border)', borderRadius: '16px',
            textDecoration: 'none', transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = card.color; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.15)` }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${card.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
              {card.icon}
            </div>
            <div>
              <div style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '3px' }}>{card.label}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>{card.desc}</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginLeft: 'auto', color: 'var(--color-text-dim)', flexShrink: 0 }}>
              <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        ))}
      </div>
    </DashboardLayout>
  )
}