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
      {/* Panneau gauche — décoratif */}
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
            {/* Grille de points */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.05 }}>
              <defs>
                <pattern id="dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="1" fill="#6366f1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dots)" />
            </svg>
            <div style={{ position: 'absolute', bottom: '15%', left: '-10%', width: '70%', height: '70%', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
    
            {/* Logo */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', position: 'relative', zIndex: 1 }}>
              <Logo size={36} />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text)' }}>
                Savoir<span style={{ color: 'var(--color-primary)' }}>Vivant</span>
              </span>
            </Link>
    
            {/* Centre — livres flottants + stats */}
            <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2.5rem' }}>
    
              {/* Cartes livres */}
              <div style={{ position: 'relative', width: '280px', height: '200px' }}>
                {[
                  { title: 'Suites Numériques', subject: 'Mathématiques', color: 'linear-gradient(135deg,#6366f1,#4338ca)', rotate: '-6deg', left: '0px', top: '20px' },
                  { title: 'Limites de Fonctions', subject: 'Analyse', color: 'linear-gradient(135deg,#0f766e,#0d9488)', rotate: '3deg', left: '80px', top: '0px' },
                  { title: 'Primitives & Intégrales', subject: 'Calcul', color: 'linear-gradient(135deg,#b45309,#d97706)', rotate: '-2deg', left: '155px', top: '15px' },
                ].map((book) => (
                  <div key={book.title} style={{
                    position: 'absolute',
                    left: book.left,
                    top: book.top,
                    width: '110px',
                    transform: `rotate(${book.rotate})`,
                    background: book.color,
                    borderRadius: '8px',
                    padding: '1rem 0.75rem',
                    aspectRatio: '2/3',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    boxShadow: '0 16px 40px rgba(0,0,0,0.4)',
                  }}>
                    <div style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '3px' }}>{book.subject}</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', color: '#fff', fontWeight: 700, lineHeight: 1.2 }}>{book.title}</div>
                  </div>
                ))}
              </div>
    
              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', width: '100%' }}>
                {[
                  { value: '12+', label: 'Livres' },
                  { value: '3', label: 'Collections' },
                  { value: '∞', label: 'Accès abonnement' },
                ].map(stat => (
                  <div key={stat.label} style={{
                    background: 'rgba(99,102,241,0.06)',
                    border: '1px solid rgba(99,102,241,0.15)',
                    borderRadius: '12px',
                    padding: '1rem',
                    textAlign: 'center',
                  }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-text)', marginBottom: '2px' }}>{stat.value}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
      
              {/* Citation bas */}
              <div style={{ position: 'relative', zIndex: 1 }}>
                <blockquote style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, fontStyle: 'italic', lineHeight: 1.4, color: 'var(--color-text)', marginBottom: '1rem' }}>
                  "Le savoir est la seule richesse qui s'accroît quand on la partage."
                </blockquote>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['Mathématiques', 'Physique', 'Informatique', 'Langues'].map(tag => (
                    <span key={tag} style={{ fontSize: '0.7rem', padding: '4px 10px', border: '1px solid var(--color-border)', borderRadius: '100px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                      {tag}
                    </span>
                  ))}
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