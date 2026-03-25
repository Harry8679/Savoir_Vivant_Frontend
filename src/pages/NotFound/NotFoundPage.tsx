import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Logo from '@components/ui/Logo'

export default function NotFoundPage() {
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(timer)
          navigate('/')
          return 0
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [navigate])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden',
      textAlign: 'center',
    }}>

      {/* Fond grille */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04 }}>
        <defs>
          <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#6366f1" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '3rem' }}>
          <Logo size={36} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text)' }}>
            Savoir<span style={{ color: 'var(--color-primary)' }}>Vivant</span>
          </span>
        </Link>

        {/* 404 */}
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(6rem, 18vw, 12rem)',
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: '-0.04em',
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, var(--color-text) 0%, var(--color-text-dim) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          userSelect: 'none',
        }}>
          404
        </div>

        <div style={{ width: '48px', height: '3px', background: 'var(--color-primary)', borderRadius: '2px', margin: '0 auto 2rem' }} />

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.35rem, 3vw, 2rem)', fontWeight: 800, color: 'var(--color-text)', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
          Page introuvable
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', lineHeight: 1.7, maxWidth: '400px', margin: '0 auto 1.5rem', fontWeight: 500 }}>
          Cette page n'existe pas ou a été déplacée. Vous serez redirigé automatiquement dans quelques secondes.
        </p>

        {/* Countdown */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '0.6rem 1.25rem', background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '100px', marginBottom: '2.5rem' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-primary)', animation: 'shimmer 1s ease-in-out infinite' }} />
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
            Redirection dans <strong style={{ color: 'var(--color-primary)' }}>{countdown}s</strong>
          </span>
        </div>

        {/* Boutons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/"
            style={{ padding: '0.875rem 2rem', background: 'var(--color-primary)', color: '#fff', borderRadius: '10px', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', transition: 'all 0.2s', display: 'inline-block' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-primary-hover)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-primary)'; e.currentTarget.style.transform = 'translateY(0)' }}>
            Retour à l'accueil
          </Link>
          <Link to="/catalogue"
            style={{ padding: '0.875rem 2rem', background: 'transparent', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)', borderRadius: '10px', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', transition: 'all 0.2s', display: 'inline-block' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-text)'; e.currentTarget.style.borderColor = 'var(--color-text-muted)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.borderColor = 'var(--color-border)' }}>
            Voir le catalogue
          </Link>
        </div>

        {/* Liens utiles */}
        <div style={{ marginTop: '3rem', display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[['Connexion', '/login'], ['Inscription', '/register'], ['CGU', '/cgu']].map(([label, href]) => (
            <Link key={label} to={href} style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)', textDecoration: 'none', fontWeight: 600, transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-dim)')}>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}