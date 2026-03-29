import { Link, useLocation, Outlet } from 'react-router-dom'
import { useAuthStore } from '@store/authStore'
import { useAuth } from '@hooks/useAuth'

const navItems = [
  { href: '/admin',             label: 'Dashboard',     icon: '◈', exact: true },
  { href: '/admin/books',       label: 'Livres',         icon: '📚' },
  { href: '/admin/collections', label: 'Collections',    icon: '🗂️' },
  { href: '/admin/carriers',    label: 'Transporteurs',  icon: '🚚' },
  { href: '/admin/orders',      label: 'Commandes',      icon: '📦' },
]

export default function AdminLayout() {
  const location = useLocation()
  const { user } = useAuthStore()
  const { logout } = useAuth()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', flexDirection: 'column' }}>

      {/* Top bar admin */}
      <div style={{ height: '56px', background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: '#000' }}>A</div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', color: 'var(--color-text)' }}>
            Admin <span style={{ color: 'var(--color-primary)' }}>SavoirVivant</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/" style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textDecoration: 'none', fontWeight: 500 }}>← Site public</Link>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>{user?.name}</div>
          <button onClick={logout} style={{ fontSize: '0.8rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: 'var(--font-body)' }}>
            Déconnexion
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar */}
        <aside style={{ width: '220px', background: 'var(--color-surface)', borderRight: '1px solid var(--color-border)', padding: '1.5rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '4px', position: 'sticky', top: '56px', height: 'calc(100vh - 56px)', overflowY: 'auto' }}>
          {navItems.map(item => {
            const active = item.exact
              ? location.pathname === item.href
              : location.pathname.startsWith(item.href)
            return (
              <Link key={item.href} to={item.href} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '8px', textDecoration: 'none', fontSize: '0.875rem', fontWeight: active ? 700 : 500, color: active ? 'var(--color-primary)' : 'var(--color-text-muted)', background: active ? 'rgba(99,102,241,0.1)' : 'transparent', borderLeft: active ? '2px solid var(--color-primary)' : '2px solid transparent', transition: 'all 0.15s' }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--color-surface-2)'; e.currentTarget.style.color = 'var(--color-text)' } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-muted)' } }}>
                <span>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </aside>

        {/* Contenu */}
        <main style={{ flex: 1, padding: '2rem 2.5rem', overflowX: 'hidden' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}