import { Link, useLocation } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import Logo from '@components/ui/Logo'
import ThemeToggle from '@components/ui/ThemeToggle'
import { useThemeStore } from '@store/themeStore'
import { useAuthStore } from '@store/authStore'
import { useAuth } from '@hooks/useAuth'

export default function Navbar() {
  const [open, setOpen]         = useState(false)
  const [userMenu, setUserMenu] = useState(false)
  const userMenuRef             = useRef<HTMLDivElement>(null)
  const location                = useLocation()
  const isHome                  = location.pathname === '/'
  const { theme }               = useThemeStore()
  const isDark                  = theme === 'dark'
  const { isAuthenticated, user } = useAuthStore()
  const { logout }              = useAuth()

  // Ferme le menu user si on clique ailleurs
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const navBg = isHome && isDark
    ? 'transparent'
    : isDark
      ? 'rgba(8,12,20,0.95)'
      : 'rgba(248,246,241,0.97)'

  const linkStyle = {
    fontSize: '0.875rem', fontWeight: 600,
    color: 'var(--color-text-muted)',
    transition: 'color 0.2s', textDecoration: 'none',
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{ background: navBg, borderBottom: (isHome && isDark) ? 'none' : '1px solid var(--color-border)', backdropFilter: (isHome && isDark) ? 'none' : 'blur(12px)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 3rem', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <Logo size={36} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.01em', color: isDark ? 'var(--color-text)' : '#1a1208' }}>
            Savoir<span style={{ color: 'var(--color-primary)' }}>Vivant</span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/catalogue" style={linkStyle}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}>
            Catalogue
          </Link>
          <a href="#offres" style={linkStyle}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}>
            Offres
          </a>

          <ThemeToggle />

          {isAuthenticated && user ? (
            /* ── Menu utilisateur ── */
            <div ref={userMenuRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setUserMenu(!userMenu)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: '1px solid var(--color-border)', borderRadius: '100px', padding: '6px 12px 6px 6px', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
                onMouseLeave={e => { if (!userMenu) e.currentTarget.style.borderColor = 'var(--color-border)' }}>
                {/* Avatar initiales */}
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                  {user.name?.slice(0, 2).toUpperCase() ?? 'SV'}
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name?.split(' ')[0]}
                </span>
                {/* Chevron */}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ color: 'var(--color-text-muted)', transition: 'transform 0.2s', transform: userMenu ? 'rotate(180deg)' : 'none', flexShrink: 0 }}>
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Dropdown */}
              {userMenu && (
                <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, minWidth: '200px', background: isDark ? 'rgba(15,22,35,0.98)' : 'rgba(255,255,255,0.98)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '8px', backdropFilter: 'blur(12px)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', zIndex: 100 }}>

                  {/* Infos user */}
                  <div style={{ padding: '8px 12px 12px', borderBottom: '1px solid var(--color-border)', marginBottom: '4px' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '2px' }}>{user.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{user.email}</div>
                    {user.subscriptionStatus === 'active' && (
                      <div style={{ marginTop: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', padding: '2px 8px', background: 'rgba(16,185,129,0.1)', color: '#10b981', borderRadius: '100px', fontWeight: 600 }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                        Abonné
                      </div>
                    )}
                  </div>

                  {/* Liens */}
                  {[
                    { label: 'Mon profil',       href: '/profile',  icon: '👤' },
                    { label: 'Ma bibliothèque',  href: '/library',  icon: '📚' },
                    { label: 'Mes commandes',    href: '/orders',   icon: '📦' },
                    { label: 'Mon abonnement',   href: '/subscription', icon: '♾️' },
                  ].map(item => (
                    <Link key={item.href} to={item.href}
                      onClick={() => setUserMenu(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '8px', textDecoration: 'none', color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: 500, transition: 'all 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-surface-2)'; e.currentTarget.style.color = 'var(--color-text)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-muted)' }}>
                      <span style={{ fontSize: '14px' }}>{item.icon}</span>
                      {item.label}
                    </Link>
                  ))}

                  <div style={{ height: '1px', background: 'var(--color-border)', margin: '4px 0' }} />

                  {/* Déconnexion */}
                  <button onClick={() => { setUserMenu(false); logout() }}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '8px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '0.875rem', fontWeight: 500, transition: 'all 0.15s', textAlign: 'left', fontFamily: 'var(--font-body)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M5 2H2.5A1.5 1.5 0 0 0 1 3.5v7A1.5 1.5 0 0 0 2.5 12H5M9 10l3-3-3-3M12 7H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Se déconnecter
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* ── Non connecté ── */
            <>
              <Link to="/connexiion" style={linkStyle}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}>
                Connexion
              </Link>
              <Link to="/inscription"
                style={{ fontSize: '0.875rem', fontWeight: 700, padding: '0.5rem 1.25rem', background: 'var(--color-primary)', color: '#fff', borderRadius: '6px', transition: 'background 0.2s', textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-primary-hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-primary)')}>
                Commencer
              </Link>
            </>
          )}
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-3">
          <ThemeToggle />
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex', flexDirection: 'column', gap: '5px' }} onClick={() => setOpen(!open)}>
            <span style={{ width: 22, height: 1.5, background: 'var(--color-text)', display: 'block', transition: 'all 0.2s', transform: open ? 'rotate(45deg) translate(3px,3px)' : 'none' }} />
            <span style={{ width: 22, height: 1.5, background: 'var(--color-text)', display: 'block', opacity: open ? 0 : 1, transition: 'all 0.2s' }} />
            <span style={{ width: 22, height: 1.5, background: 'var(--color-text)', display: 'block', transition: 'all 0.2s', transform: open ? 'rotate(-45deg) translate(3px,-3px)' : 'none' }} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ background: isDark ? 'rgba(8,12,20,0.98)' : 'rgba(248,246,241,0.98)', borderTop: '1px solid var(--color-border)', padding: '1.5rem 3rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link to="/catalogue" onClick={() => setOpen(false)} style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none' }}>Catalogue</Link>
          <a href="#offres" onClick={() => setOpen(false)} style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Offres</a>
          {isAuthenticated ? (
            <>
              <Link to="/profile" onClick={() => setOpen(false)} style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none' }}>Mon profil</Link>
              <Link to="/library" onClick={() => setOpen(false)} style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none' }}>Ma bibliothèque</Link>
              <button onClick={() => { setOpen(false); logout() }} style={{ color: '#ef4444', fontSize: '0.9rem', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-body)', padding: 0 }}>
                Se déconnecter
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none' }}>Connexion</Link>
              <Link to="/register" onClick={() => setOpen(false)} style={{ padding: '0.6rem 1rem', background: 'var(--color-primary)', color: '#fff', borderRadius: '6px', textAlign: 'center', fontSize: '0.9rem', textDecoration: 'none', fontWeight: 700 }}>Commencer</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}