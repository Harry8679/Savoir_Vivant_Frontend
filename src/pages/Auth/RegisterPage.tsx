import { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '@components/ui/Logo'
import { useAuth } from '@hooks/useAuth'

type PasswordStrength = 'faible' | 'moyen' | 'fort' | null

function getStrength(pwd: string): PasswordStrength {
  if (!pwd) return null
  if (pwd.length < 6) return 'faible'
  if (pwd.length < 10 || !/[0-9]/.test(pwd) || !/[^a-zA-Z0-9]/.test(pwd)) return 'moyen'
  return 'fort'
}

const strengthColor: Record<string, string> = {
  faible: '#ef4444',
  moyen: '#f59e0b',
  fort: '#10b981',
}

export default function RegisterPage() {
  const [show, setShow] = useState({ password: false, confirm: false })
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const { register, loading, error, setError } = useAuth()

  const strength = getStrength(form.password)
  const passwordMatch = form.confirm && form.password === form.confirm
  const passwordMismatch = form.confirm && form.password !== form.confirm

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }
    await register({ name: form.name, email: form.email, password: form.password })
  }

  const inputStyle = {
    width: '100%', padding: '0.875rem 1rem',
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: '10px', color: 'var(--color-text)',
    fontSize: '0.95rem', fontFamily: 'var(--font-body)',
    fontWeight: 500, outline: 'none', transition: 'border-color 0.2s',
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--color-bg)' }}>

      {/* Panneau gauche */}
      <div className="hidden lg:flex" style={{
        width: '45%', background: 'var(--color-surface)',
        borderRight: '1px solid var(--color-border)',
        flexDirection: 'column', justifyContent: 'space-between',
        padding: '3rem', position: 'relative', overflow: 'hidden', height: '100vh',
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

        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', position: 'relative', zIndex: 1 }}>
          <Logo size={36} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text)' }}>
            Savoir<span style={{ color: 'var(--color-primary)' }}>Vivant</span>
          </span>
        </Link>

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
              <div key={title} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '0.875rem 1rem', background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.1)', borderRadius: '12px' }}>
                <span style={{ fontSize: '1.25rem', flexShrink: 0, marginTop: '1px' }}>{icon}</span>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '2px' }}>{title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: 1.5, fontWeight: 500 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 1, background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '12px', padding: '1rem 1.25rem' }}>
          <div style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>Offre abonnement</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-text)' }}>9€</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>/ mois · ou 79€ / an</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Accès illimité à toute la bibliothèque SavoirVivant</div>
        </div>
      </div>

      {/* Panneau droit — formulaire */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 2rem' }}>
        <Link to="/" className="flex lg:hidden items-center gap-2 mb-8" style={{ textDecoration: 'none' }}>
          <Logo size={32} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-text)' }}>
            Savoir<span style={{ color: 'var(--color-primary)' }}>Vivant</span>
          </span>
        </Link>

        <div style={{ width: '100%', maxWidth: '440px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Créer un compte
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '2.5rem', fontWeight: 500 }}>
            Déjà inscrit ?{' '}
            <Link to="/connexion" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 700 }}
              onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}>
              Se connecter
            </Link>
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Nom complet
              </label>
              <input type="text" placeholder="Harry MacCode" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} required
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = 'var(--color-primary)')}
                onBlur={e => (e.target.style.borderColor = 'var(--color-border)')}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Adresse e-mail
              </label>
              <input type="email" placeholder="vous@exemple.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} required
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = 'var(--color-primary)')}
                onBlur={e => (e.target.style.borderColor = 'var(--color-border)')}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Mot de passe
              </label>
              <div style={{ position: 'relative' }}>
                <input type={show.password ? 'text' : 'password'} placeholder="••••••••"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required
                  style={{ ...inputStyle, paddingRight: '3rem' }}
                  onFocus={e => (e.target.style.borderColor = 'var(--color-primary)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--color-border)')}
                />
                <button type="button" onClick={() => setShow(s => ({ ...s, password: !s.password }))}
                  style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: 0, display: 'flex' }}>
                  {show.password ? <EyeOff /> : <EyeOn />}
                </button>
              </div>
              {strength && (
                <div style={{ marginTop: '0.6rem' }}>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                    {(['faible', 'moyen', 'fort'] as const).map((level, i) => {
                      const active = ['faible', 'moyen', 'fort'].indexOf(strength) >= i
                      return <div key={level} style={{ flex: 1, height: '4px', borderRadius: '2px', background: active ? strengthColor[strength] : 'var(--color-border)', transition: 'background 0.3s' }} />
                    })}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: strengthColor[strength], fontWeight: 600 }}>Sécurité : {strength}</span>
                </div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Confirmer le mot de passe
              </label>
              <div style={{ position: 'relative' }}>
                <input type={show.confirm ? 'text' : 'password'} placeholder="••••••••"
                  value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} required
                  style={{ ...inputStyle, paddingRight: '3rem', borderColor: passwordMismatch ? '#ef4444' : passwordMatch ? '#10b981' : 'var(--color-border)' }}
                  onFocus={e => (e.target.style.borderColor = passwordMismatch ? '#ef4444' : 'var(--color-primary)')}
                  onBlur={e => (e.target.style.borderColor = passwordMismatch ? '#ef4444' : passwordMatch ? '#10b981' : 'var(--color-border)')}
                />
                <button type="button" onClick={() => setShow(s => ({ ...s, confirm: !s.confirm }))}
                  style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: 0, display: 'flex' }}>
                  {show.confirm ? <EyeOff /> : <EyeOn />}
                </button>
              </div>
              {passwordMismatch && <p style={{ fontSize: '0.78rem', color: '#ef4444', marginTop: '0.4rem', fontWeight: 600 }}>Les mots de passe ne correspondent pas</p>}
              {passwordMatch && <p style={{ fontSize: '0.78rem', color: '#10b981', marginTop: '0.4rem', fontWeight: 600 }}>Les mots de passe correspondent</p>}
            </div>

            {/* Erreur API */}
            {error && (
              <div style={{ padding: '0.75rem 1rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', fontSize: '0.85rem', color: '#ef4444', fontWeight: 600 }}>
                {error}
              </div>
            )}

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
              <input type="checkbox" required style={{ marginTop: '2px', accentColor: 'var(--color-primary)', width: '15px', height: '15px', flexShrink: 0 }} />
              <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: 1.5, fontWeight: 500 }}>
                J'accepte les{' '}
                <Link to="/cgu" style={{ color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'none' }}>conditions d'utilisation</Link>
                {' '}et la{' '}
                <Link to="/confidentialite" style={{ color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'none' }}>politique de confidentialité</Link>
              </span>
            </label>

            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '0.9rem', background: loading ? 'var(--color-surface-2)' : 'var(--color-primary)', color: loading ? 'var(--color-text-muted)' : '#fff', border: 'none', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 700, fontFamily: 'var(--font-body)', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', marginTop: '0.25rem' }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'var(--color-primary-hover)' }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = 'var(--color-primary)' }}>
              {loading ? 'Création du compte...' : 'Créer mon compte'}
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
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
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