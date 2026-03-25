import { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '@components/ui/Logo'
// import { useThemeStore } from '@store/themeStore'

export default function LoginPage() {
  // const { theme } = useThemeStore()
  // const isDark = theme === 'dark'
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => setLoading(false), 1500)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'var(--color-bg)',
    }}>
      {/* Panneau gauche */}
      <div className="hidden lg:flex" style={{
        width: '45%',
        background: 'var(--color-surface)',
        borderRight: '1px solid var(--color-border)',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '3rem',
        position: 'relative',
        overflow: 'hidden',
        height: '100vh',
      }}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.05 }}>
          <defs>
            <pattern id="dots2" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="#6366f1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots2)" />
        </svg>
        <div style={{ position: 'absolute', top: '20%', right: '-10%', width: '60%', height: '60%', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', position: 'relative', zIndex: 1 }}>
          <Logo size={36} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text)' }}>
            Savoir<span style={{ color: 'var(--color-primary)' }}>Vivant</span>
          </span>
        </Link>

        {/* Centre — bénéfices visuels */}
        <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1.25rem' }}>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text)', lineHeight: 1.2, marginBottom: '0.5rem' }}>
            Rejoignez une<br />
            <span style={{ fontStyle: 'italic', color: 'var(--color-primary)' }}>communauté de curieux</span>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { icon: '📚', title: 'Bibliothèque complète', desc: 'Accès à tous les livres avec l\'abonnement mensuel ou annuel' },
              { icon: '📱', title: 'Web & Mobile', desc: 'Lisez sur tous vos appareils, même sans connexion' },
              { icon: '♾️', title: 'Achat définitif', desc: 'Un livre acheté reste vôtre pour toujours' },
              { icon: '🚀', title: 'Contenu en croissance', desc: 'De nouveaux livres ajoutés chaque mois dans toutes les collections' },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{
                display: 'flex',
                gap: '14px',
                alignItems: 'flex-start',
                padding: '0.875rem 1rem',
                background: 'rgba(99,102,241,0.05)',
                border: '1px solid rgba(99,102,241,0.1)',
                borderRadius: '12px',
              }}>
                <span style={{ fontSize: '1.25rem', flexShrink: 0, marginTop: '1px' }}>{icon}</span>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '2px' }}>{title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: 1.5, fontWeight: 500 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bas — offre mise en avant */}
        <div style={{ position: 'relative', zIndex: 1, background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '12px', padding: '1rem 1.25rem' }}>
          <div style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
            Offre abonnement
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-text)' }}>9€</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>/ mois · ou 79€ / an</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
            Accès illimité à toute la bibliothèque SavoirVivant
          </div>
        </div>
      </div>

      {/* Panneau droit — formulaire */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 2rem',
      }}>
        {/* Logo mobile */}
        <Link to="/" className="flex lg:hidden items-center gap-2 mb-8" style={{ textDecoration: 'none' }}>
          <Logo size={32} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-text)' }}>
            Savoir<span style={{ color: 'var(--color-primary)' }}>Vivant</span>
          </span>
        </Link>

        <div style={{ width: '100%', maxWidth: '420px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Bon retour !
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '2.5rem', fontWeight: 500 }}>
            Pas encore de compte ?{' '}
            <Link to="/inscription" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 700 }}
              onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}>
              S'inscrire
            </Link>
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Adresse e-mail
              </label>
              <input
                type="email"
                placeholder="vous@exemple.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                style={{
                  width: '100%', padding: '0.875rem 1rem',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '10px',
                  color: 'var(--color-text)',
                  fontSize: '0.95rem',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 500,
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--color-primary)')}
                onBlur={e => (e.target.style.borderColor = 'var(--color-border)')}
              />
            </div>

            {/* Mot de passe */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Mot de passe
                </label>
                <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>
                  Mot de passe oublié ?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  style={{
                    width: '100%', padding: '0.875rem 3rem 0.875rem 1rem',
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '10px',
                    color: 'var(--color-text)',
                    fontSize: '0.95rem',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 500,
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'var(--color-primary)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--color-border)')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: 0, display: 'flex', alignItems: 'center' }}
                >
                  {showPassword ? <EyeOff /> : <EyeOn />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '0.9rem',
                background: loading ? 'var(--color-surface-2)' : 'var(--color-primary)',
                color: loading ? 'var(--color-text-muted)' : '#fff',
                border: 'none', borderRadius: '10px',
                fontSize: '0.95rem', fontWeight: 700,
                fontFamily: 'var(--font-body)',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                marginTop: '0.5rem',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'var(--color-primary-hover)' }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = 'var(--color-primary)' }}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

function EyeOn() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOff() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}