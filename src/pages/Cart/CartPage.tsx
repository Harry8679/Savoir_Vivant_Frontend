import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCartStore, CartItemType } from '@store/cartStore'
import { useAuthStore } from '@store/authStore'
import { paymentService } from '@services/payment.service'

const COLLECTION_COLORS: Record<string, string> = {
  'mathematiques-vivantes':  'linear-gradient(135deg,#6366f1,#4338ca)',
  'physique-chimie-vivants': 'linear-gradient(135deg,#0f766e,#0d9488)',
  'informatique-vivante':    'linear-gradient(135deg,#b45309,#d97706)',
  'langues-vivantes':        'linear-gradient(135deg,#9d174d,#db2777)',
}

export default function CartPage() {
  const { items, removeItem, updateType, clearCart, total, count } = useCartStore()
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const [paying, setPaying]   = useState(false)

  const digitalItems = items.filter(i => i.type === 'digital')
  const paperItems   = items.filter(i => i.type === 'paper')
  const hasPaper     = paperItems.length > 0
  const hasDigital   = digitalItems.length > 0

  const handleCheckout = async () => {
    if (!isAuthenticated) { navigate('/connexion'); return }

    // Si uniquement du numérique — paiement direct
    if (hasDigital && !hasPaper) {
      try {
        setPaying(true)
        // Pour l'instant un livre à la fois — Stripe ne supporte pas multi-items facilement
        // On prend le premier et redirige
        await paymentService.buyDigital(digitalItems[0].bookId)
      } catch {
        setPaying(false)
      }
      return
    }

    // Si du papier — on va vers le checkout avec adresse
    if (hasPaper) {
      navigate(`/checkout?bookId=${paperItems[0].bookId}`)
    }
  }

  if (items.length === 0) return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', paddingTop: '72px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
      <div style={{ fontSize: '4rem' }}>🛒</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)' }}>
        Votre panier est vide
      </h2>
      <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
        Explorez le catalogue et ajoutez des livres à votre panier.
      </p>
      <Link to="/catalogue"
        style={{ padding: '0.75rem 1.75rem', background: 'var(--color-primary)', color: '#fff', borderRadius: '10px', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 700 }}>
        Explorer le catalogue
      </Link>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', paddingTop: '72px' }}>

      {/* Header */}
      <div style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', padding: '1.5rem 3rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 900, color: 'var(--color-text)', letterSpacing: '-0.02em', marginBottom: '4px' }}>
            Mon panier
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
            {count()} article{count() > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 3rem', display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start' }}>

        {/* Liste articles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {items.map(item => {
            const gradient = COLLECTION_COLORS[item.slug?.split('/')[0] ?? ''] ?? 'linear-gradient(135deg,#6366f1,#4338ca)'
            return (
              <div key={`${item.bookId}-${item.type}`}
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '14px', padding: '1.25rem 1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'center', transition: 'border-color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}>

                {/* Cover mini */}
                <div style={{ width: '56px', height: '76px', borderRadius: '8px', background: gradient, flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }} />

                {/* Infos */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link to={`/catalogue/${item.slug}`}
                    style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text)', textDecoration: 'none', display: 'block', marginBottom: '3px' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-primary)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text)')}>
                    {item.title}
                  </Link>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500, marginBottom: '10px' }}>
                    par {item.author}
                  </div>

                  {/* Toggle format */}
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {(['digital', 'paper'] as CartItemType[]).map(t => (
                      <button key={t}
                        onClick={() => updateType(item.bookId, t)}
                        style={{ padding: '4px 12px', borderRadius: '100px', border: `1px solid ${item.type === t ? 'var(--color-primary)' : 'var(--color-border)'}`, background: item.type === t ? 'rgba(99,102,241,0.1)' : 'transparent', color: item.type === t ? 'var(--color-primary)' : 'var(--color-text-muted)', fontSize: '0.78rem', fontWeight: item.type === t ? 700 : 500, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.15s' }}>
                        {t === 'digital' ? '📱 Numérique' : '📦 Papier'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Prix + supprimer */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 900, color: 'var(--color-text)' }}>
                    {item.price.toFixed(2)}€
                  </span>
                  <button
                    onClick={() => removeItem(item.bookId, item.type)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-dim)', fontSize: '0.78rem', fontWeight: 500, fontFamily: 'var(--font-body)', transition: 'color 0.15s', padding: 0 }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-dim)')}>
                    Supprimer
                  </button>
                </div>
              </div>
            )
          })}

          {/* Vider le panier */}
          <button
            onClick={() => { if (confirm('Vider le panier ?')) clearCart() }}
            style={{ alignSelf: 'flex-start', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-dim)', fontSize: '0.8rem', fontWeight: 500, fontFamily: 'var(--font-body)', transition: 'color 0.15s', padding: 0 }}
            onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-dim)')}>
            Vider le panier
          </button>
        </div>

        {/* Récapitulatif */}
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '1.5rem', position: 'sticky', top: '100px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--color-border)' }}>
            Récapitulatif
          </h3>

          {/* Détail par article */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1rem' }}>
            {items.map(item => (
              <div key={`${item.bookId}-${item.type}`} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--color-text-muted)', fontWeight: 500, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.title} {item.type === 'digital' ? '📱' : '📦'}
                </span>
                <span style={{ color: 'var(--color-text)', fontWeight: 600, flexShrink: 0 }}>
                  {item.price.toFixed(2)}€
                </span>
              </div>
            ))}
          </div>

          {/* Avertissement livraison */}
          {hasPaper && (
            <div style={{ padding: '10px 12px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '8px', fontSize: '0.78rem', color: '#f59e0b', fontWeight: 500, marginBottom: '1rem' }}>
              📦 Les frais de livraison seront calculés à l'étape suivante selon votre adresse et le transporteur choisi.
            </div>
          )}

          {/* Total */}
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--color-border)', marginBottom: '1.25rem' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 800, color: 'var(--color-text)' }}>
              Sous-total
            </span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-text)' }}>
              {total().toFixed(2)}€
            </span>
          </div>

          {isAuthenticated ? (
            <button
              onClick={handleCheckout}
              disabled={paying}
              style={{ width: '100%', padding: '0.9rem', background: paying ? 'var(--color-surface-2)' : 'var(--color-primary)', color: paying ? 'var(--color-text-muted)' : '#fff', border: 'none', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 700, cursor: paying ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.2s' }}>
              {paying ? 'Redirection...' : hasPaper ? 'Choisir la livraison →' : 'Payer avec Stripe →'}
            </button>
          ) : (
            <Link to="/connexion"
              style={{ display: 'block', textAlign: 'center', width: '100%', padding: '0.9rem', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 700, textDecoration: 'none', boxSizing: 'border-box' }}>
              Se connecter pour payer
            </Link>
          )}

          <Link to="/catalogue"
            style={{ display: 'block', textAlign: 'center', marginTop: '10px', fontSize: '0.85rem', color: 'var(--color-text-muted)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}>
            ← Continuer mes achats
          </Link>
        </div>
      </div>
    </div>
  )
}