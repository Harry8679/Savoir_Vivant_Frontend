import { Link } from 'react-router-dom'
import { useAuthStore } from '@store/authStore'

const plans = [
  {
    id: 'monthly',
    label: 'Mensuel',
    price: '9€',
    period: '/ mois',
    desc: 'Accès complet, sans engagement.',
    features: ['Tous les livres disponibles', 'Web + application mobile', 'Nouveaux livres inclus', 'Annulation à tout moment'],
    highlight: false,
  },
  {
    id: 'yearly',
    label: 'Annuel',
    price: '79€',
    period: '/ an',
    promo: 'Économisez 29€',
    desc: 'La meilleure offre pour apprendre toute l\'année.',
    features: ['Tous les livres disponibles', 'Web + application mobile', 'Nouveaux livres inclus', '2 mois offerts vs mensuel'],
    highlight: true,
  },
]

export default function SubscriptionPage() {
  const { user } = useAuthStore()
  const isActive = user?.subscriptionStatus === 'active'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', paddingTop: '6rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 3rem' }}>

        <div style={{ marginBottom: '2.5rem' }}>
          <Link to="/profile" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--color-text-muted)', textDecoration: 'none', fontWeight: 600, marginBottom: '1.5rem', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Mon profil
          </Link>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Mon abonnement
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
            {isActive ? 'Votre abonnement est actif.' : 'Choisissez la formule qui vous convient.'}
          </p>
        </div>

        {/* Statut actif */}
        {isActive && (
          <div style={{ padding: '1.25rem 1.5rem', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '14px', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>✓</div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text)' }}>Abonnement actif</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Accès illimité à toute la bibliothèque</div>
              </div>
            </div>
            <button style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#ef4444', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.06)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
              Annuler l'abonnement
            </button>
          </div>
        )}

        {/* Plans */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
          {plans.map(plan => (
            <div key={plan.id} style={{ background: plan.highlight ? 'rgba(245,158,11,0.04)' : 'var(--color-surface)', border: plan.highlight ? '1px solid rgba(245,158,11,0.3)' : '1px solid var(--color-border)', borderRadius: '14px', padding: '1.75rem', position: 'relative' }}>
              {plan.highlight && (
                <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#f59e0b', color: '#000', fontSize: '0.65rem', fontWeight: 700, padding: '3px 12px', borderRadius: '100px', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                  Meilleure offre
                </div>
              )}
              {plan.promo && (
                <div style={{ display: 'inline-block', fontSize: '0.7rem', padding: '2px 8px', background: 'rgba(16,185,129,0.1)', color: '#10b981', borderRadius: '100px', fontWeight: 600, marginBottom: '0.75rem' }}>
                  {plan.promo}
                </div>
              )}
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.5rem' }}>{plan.label}</h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: plan.highlight ? '#f59e0b' : 'var(--color-primary)', fontFamily: 'var(--font-display)' }}>{plan.price}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>{plan.period}</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500, marginBottom: '1.25rem', lineHeight: 1.5 }}>{plan.desc}</p>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                      <circle cx="7" cy="7" r="6" stroke={plan.highlight ? '#f59e0b' : 'var(--color-primary)'} strokeWidth="1" opacity="0.4" />
                      <path d="M4.5 7l2 2 3-3" stroke={plan.highlight ? '#f59e0b' : 'var(--color-primary)'} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                disabled={isActive}
                style={{ width: '100%', padding: '0.75rem', background: isActive ? 'var(--color-surface-2)' : plan.highlight ? '#f59e0b' : 'transparent', color: isActive ? 'var(--color-text-dim)' : plan.highlight ? '#000' : 'var(--color-primary)', border: `1px solid ${isActive ? 'var(--color-border)' : plan.highlight ? '#f59e0b' : 'var(--color-primary)'}`, borderRadius: '8px', fontSize: '0.875rem', fontWeight: 700, cursor: isActive ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.2s' }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = plan.highlight ? '#d97706' : 'var(--color-primary)'; e.currentTarget.style.color = '#fff' } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = plan.highlight ? '#f59e0b' : 'transparent'; e.currentTarget.style.color = plan.highlight ? '#000' : 'var(--color-primary)' } }}>
                {isActive ? 'Déjà abonné' : `Choisir ${plan.label.toLowerCase()}`}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}