import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import Logo from '@components/ui/Logo'
import ThemeToggle from '@components/ui/ThemeToggle'
import { useThemeStore } from '@store/themeStore'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  const navBg = isHome && isDark
    ? 'transparent'
    : isDark
      ? 'rgba(8,12,20,0.95)'
      : 'rgba(248,246,241,0.97)'

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: navBg,
        borderBottom: (isHome && isDark) ? 'none' : '1px solid var(--color-border)',
        backdropFilter: (isHome && isDark) ? 'none' : 'blur(12px)',
      }}
    >
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 3rem',
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo + nom */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <Logo size={36} />
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.25rem',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            color: isDark ? 'var(--color-text)' : '#1a1208',
          }}>
            Savoir<span style={{ color: 'var(--color-primary)' }}>Vivant</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {[['Catalogue', '/catalogue'], ['Connexion', '/login']].map(([label, href]) => (
            <Link key={label} to={href}
              style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', transition: 'color 0.2s', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}>
              {label}
            </Link>
          ))}
          <a href="#offres"
            style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', transition: 'color 0.2s', textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}>
            Offres
          </a>
          <ThemeToggle />
          <Link to="/inscription"
            style={{ fontSize: '0.875rem', padding: '0.5rem 1.25rem', background: 'var(--color-primary)', color: '#fff', borderRadius: '6px', fontWeight: 500, transition: 'background 0.2s', textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-primary-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-primary)')}>
            Commencer
          </Link>
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
        <div style={{
          background: isDark ? 'rgba(8,12,20,0.98)' : 'rgba(248,246,241,0.98)',
          borderTop: '1px solid var(--color-border)',
          padding: '1.5rem 3rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          <Link to="/catalogue" onClick={() => setOpen(false)} style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', textDecoration: 'none' }}>Catalogue</Link>
          <a href="#offres" onClick={() => setOpen(false)} style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Offres</a>
          <Link to="/login" onClick={() => setOpen(false)} style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', textDecoration: 'none' }}>Connexion</Link>
          <Link to="/register" onClick={() => setOpen(false)} style={{ padding: '0.6rem 1rem', background: 'var(--color-primary)', color: '#fff', borderRadius: '6px', textAlign: 'center', fontSize: '0.9rem', textDecoration: 'none' }}>Commencer</Link>
        </div>
      )}
    </nav>
  )
}