import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '@store/authStore'
import { useAuth } from '@hooks/useAuth'

const navItems = [
  { href: '/profile',      icon: '◈', label: 'Mon profil' },
  { href: '/library',      icon: '◎', label: 'Bibliothèque' },
  { href: '/orders',       icon: '◷', label: 'Commandes' },
  { href: '/subscription', icon: '◈', label: 'Abonnement' },
  { href: '/settings',     icon: '◉', label: 'Paramètres' },
  { href: '/settings/addresses', icon: '📍', label: 'Mes adresses' },
]

export default function DashboardLayout({ children, title, subtitle }: {
  children: React.ReactNode
  title: string
  subtitle?: string
}) {
  const { user } = useAuthStore()
  const { logout } = useAuth()
  const location = useLocation()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', paddingTop: '72px', display: 'flex' }}>

      {/* Sidebar */}
      <aside style={{
        width: '260px', flexShrink: 0,
        background: 'var(--color-surface)',
        borderRight: '1px solid var(--color-border)',
        padding: '2rem 0',
        position: 'sticky', top: '72px',
        height: 'calc(100vh - 72px)',
        display: 'flex', flexDirection: 'column',
        overflowY: 'auto',
      }}>
        {/* Avatar section */}
        <div style={{ padding: '0 1.5rem 1.5rem', borderBottom: '1px solid var(--color-border)', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--color-primary), #4338ca)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem', fontWeight: 800, color: '#fff', flexShrink: 0,
            }}>
              {user?.name?.slice(0, 2).toUpperCase() ?? 'SV'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.email}
              </div>
            </div>
          </div>
          {user?.subscriptionStatus === 'active' && (
            <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', padding: '4px 10px', background: 'rgba(16,185,129,0.1)', color: '#10b981', borderRadius: '6px', fontWeight: 600, width: 'fit-content' }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: 'shimmer 2s ease-in-out infinite' }} />
              Abonné actif
            </div>
          )}
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '0 0.75rem' }}>
          {navItems.map(item => {
            const active = location.pathname === item.href
            return (
              <Link key={item.href} to={item.href} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 12px', borderRadius: '8px', marginBottom: '2px',
                textDecoration: 'none', transition: 'all 0.15s',
                background: active ? 'rgba(99,102,241,0.12)' : 'transparent',
                color: active ? 'var(--color-primary)' : 'var(--color-text-muted)',
                fontWeight: active ? 700 : 500, fontSize: '0.875rem',
                borderLeft: active ? '2px solid var(--color-primary)' : '2px solid transparent',
              }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--color-surface-2)'; e.currentTarget.style.color = 'var(--color-text)' } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-muted)' } }}>
                <span style={{ fontSize: '1rem', opacity: active ? 1 : 0.6 }}>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid var(--color-border)' }}>
          <button onClick={logout} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 12px', borderRadius: '8px', width: '100%',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: 500,
            fontFamily: 'var(--font-body)', transition: 'all 0.15s', textAlign: 'left',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#ef4444' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-muted)' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 2H3.5A1.5 1.5 0 0 0 2 3.5v9A1.5 1.5 0 0 0 3.5 14H6M10 11l3-3-3-3M13 8H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Se déconnecter
          </button>
        </div>
      </aside>

      {/* Contenu principal */}
      <main style={{ flex: 1, overflowX: 'hidden' }}>
        {/* Header page */}
        <div style={{
          padding: '2.5rem 3rem 2rem',
          borderBottom: '1px solid var(--color-border)',
          background: 'var(--color-surface)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 900, color: 'var(--color-text)', letterSpacing: '-0.02em', marginBottom: subtitle ? '6px' : 0 }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>{subtitle}</p>
          )}
        </div>
        <div style={{ padding: '2.5rem 3rem' }}>
          {children}
        </div>
      </main>
    </div>
  )
}