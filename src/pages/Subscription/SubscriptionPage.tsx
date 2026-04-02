import { useState } from 'react'
import DashboardLayout from '@components/layout/DashboardLayout'
import { useAuthStore } from '@store/authStore'
import { paymentService } from '@services/payment.service'

const plans = [
  {
    id:        'monthly' as const,
    label:     'Mensuel',
    price:     '9€',
    period:    '/ mois',
    annual:    '108€/an',
    desc:      'Flexibilité totale, sans engagement.',
    features:  ['Tous les livres disponibles', 'Web + application mobile', 'Nouveaux livres inclus', 'Annulation à tout moment'],
    color:     'var(--color-primary)',
    highlight: false,
  },
  {
    id:        'yearly' as const,
    label:     'Annuel',
    price:     '79€',
    period:    '/ an',
    promo:     '-27%',
    desc:      "La meilleure valeur pour apprendre toute l'année.",
    features:  ['Tous les livres disponibles', 'Web + application mobile', 'Nouveaux livres inclus', '2 mois offerts vs mensuel'],
    color:     '#f59e0b',
    highlight: true,
  },
]

const features = [
  { icon: '📚', label: 'Bibliothèque complète',  desc: 'Accès illimité à tous les livres publiés' },
  { icon: '📱', label: 'Multi-plateforme',        desc: 'Web, iOS et Android inclus' },
  { icon: '🔄', label: 'Mises à jour gratuites',  desc: 'Les nouvelles éditions sont incluses' },
  { icon: '🚀', label: 'Nouveaux livres',          desc: 'Chaque mois, de nouveaux contenus' },
]

export default function SubscriptionPage() {
  const { user }   = useAuthStore()
  const isActive   = user?.subscriptionStatus === 'active'
  const [selected, setSelected] = useState<'monthly' | 'yearly'>('yearly')
  const [paying, setPaying]     = useState(false)
  const [cancelling, setCancelling] = useState(false)

  const handleSubscribe = async () => {
    try {
      setPaying(true)
      await paymentService.subscribe(selected)
    } catch {
      setPaying(false)
    }
  }

  const handleCancel = async () => {
    if (!confirm("Confirmer l'annulation de l'abonnement ?")) return
    try {
      setCancelling(true)
      await paymentService.cancelSubscription()
      alert("Abonnement annulé — il restera actif jusqu'à la fin de la période.")
    } catch {
      alert("Erreur lors de l'annulation")
    } finally {
      setCancelling(false)
    }
  }

  return (
    <DashboardLayout
      title="Mon abonnement"
      subtitle={isActive ? 'Votre abonnement est actif · Accès illimité à toute la bibliothèque' : 'Débloquez toute la bibliothèque SavoirVivant'}
    >
      {/* Statut actif */}
      {isActive && (
        <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(16,185,129,0.03))', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '16px', marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>✓</div>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '2px' }}>Abonnement actif</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Accès illimité à toute la bibliothèque</div>
            </div>
          </div>
          <button
            onClick={handleCancel}
            disabled={cancelling}
            style={{ padding: '0.6rem 1.25rem', background: 'transparent', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', color: '#ef4444', fontSize: '0.85rem', fontWeight: 600, cursor: cancelling ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.2s', opacity: cancelling ? 0.6 : 1 }}
            onMouseEnter={e => { if (!cancelling) e.currentTarget.style.background = 'rgba(239,68,68,0.08)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
            {cancelling ? 'Annulation...' : "Annuler l'abonnement"}
          </button>
        </div>
      )}

      {/* Features */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
        {features.map(f => (
          <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem 1.25rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px' }}>
            <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{f.icon}</span>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '2px' }}>{f.label}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>{f.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Plans */}
      {!isActive && (
        <>
          <div style={{ marginBottom: '1rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Choisir une formule
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem', marginBottom: '1.5rem' }}>
            {plans.map(plan => (
              <div key={plan.id}
                onClick={() => setSelected(plan.id)}
                style={{ background: selected === plan.id ? (plan.highlight ? 'rgba(245,158,11,0.06)' : 'rgba(99,102,241,0.06)') : 'var(--color-surface)', border: selected === plan.id ? `2px solid ${plan.color}` : '1px solid var(--color-border)', borderRadius: '16px', padding: '1.75rem', cursor: 'pointer', transition: 'all 0.2s', position: 'relative' }}>
                {plan.promo && (
                  <div style={{ position: 'absolute', top: '-11px', left: '1.5rem', background: '#f59e0b', color: '#000', fontSize: '0.65rem', fontWeight: 800, padding: '3px 10px', borderRadius: '100px', letterSpacing: '0.06em' }}>
                    {plan.promo} · Meilleure offre
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-text)' }}>{plan.label}</h3>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${selected === plan.id ? plan.color : 'var(--color-border)'}`, background: selected === plan.id ? plan.color : 'transparent', transition: 'all 0.2s', flexShrink: 0 }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '0.5rem' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 900, color: plan.color }}>{plan.price}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>{plan.period}</span>
                </div>
                {'annual' in plan && <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginBottom: '0.75rem' }}>équivalent à {plan.annual}</div>}
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500, marginBottom: '1.25rem', lineHeight: 1.5 }}>{plan.desc}</p>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                      <span style={{ color: plan.color, fontWeight: 700, fontSize: '0.9rem' }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <button
            onClick={handleSubscribe}
            disabled={paying}
            style={{ width: '100%', padding: '1rem', background: paying ? 'var(--color-surface-2)' : selected === 'yearly' ? '#f59e0b' : 'var(--color-primary)', color: paying ? 'var(--color-text-muted)' : selected === 'yearly' ? '#000' : '#fff', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, cursor: paying ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.2s' }}>
            {paying ? 'Redirection vers Stripe...' : `Commencer l'abonnement ${selected === 'yearly' ? 'annuel · 79€' : 'mensuel · 9€/mois'}`}
          </button>
        </>
      )}
    </DashboardLayout>
  )
}