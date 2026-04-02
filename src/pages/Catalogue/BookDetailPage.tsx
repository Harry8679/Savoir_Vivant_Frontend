import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { bookService } from '@services/book.service'
import { useAuthStore } from '@store/authStore'
import { Book, LEVEL_LABELS } from '@/types/book.types'
import { paymentService } from '@services/payment.service'

const COLLECTION_COLORS: Record<string, string> = {
  'mathematiques-vivantes':  'linear-gradient(135deg,#6366f1,#4338ca)',
  'physique-chimie-vivants': 'linear-gradient(135deg,#0f766e,#0d9488)',
  'informatique-vivante':    'linear-gradient(135deg,#b45309,#d97706)',
  'langues-vivantes':        'linear-gradient(135deg,#9d174d,#db2777)',
}

export default function BookDetailPage() {
  const { slug }   = useParams<{ slug: string }>()
  const navigate   = useNavigate()
  const { isAuthenticated, user } = useAuthStore()
  const [book, setBook]     = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab]       = useState<'digital' | 'paper'>('digital')
  const [paying, setPaying] = useState(false)

  useEffect(() => {
    if (!slug) return
    bookService.getBySlug(slug)
      .then(setBook)
      .catch(() => navigate('/catalogue'))
      .finally(() => setLoading(false))
  }, [slug, navigate])

  const handleBuyDigital = async () => {
    if (!book) return
    try {
      setPaying(true)
      await paymentService.buyDigital(book._id)
    } catch {
      setPaying(false)
    }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', paddingTop: '72px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Chargement...</div>
    </div>
  )

  if (!book) return null

  const col          = book.collectionId
  const gradient     = COLLECTION_COLORS[col?.slug] ?? `linear-gradient(135deg, ${col?.color ?? '#6366f1'}, #4338ca)`
  const isSubscribed = user?.subscriptionStatus === 'active'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', paddingTop: '72px' }}>

      {/* Back */}
      <div style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', padding: '1rem 3rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <Link to="/catalogue"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', color: 'var(--color-text-muted)', textDecoration: 'none', fontWeight: 600, transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Retour au catalogue
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '3rem', display: 'grid', gridTemplateColumns: '300px 1fr', gap: '4rem', alignItems: 'start' }}>

        {/* Cover */}
        <div>
          <div style={{ background: gradient, borderRadius: '20px', aspectRatio: '2/3', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '1.5rem', boxShadow: '0 24px 60px rgba(0,0,0,0.4)', position: 'relative', overflow: 'hidden', marginBottom: '1.5rem' }}>
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06 }}>
              <defs><pattern id="cover-dots" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="white" /></pattern></defs>
              <rect width="100%" height="100%" fill="url(#cover-dots)" />
            </svg>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>{col?.name}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: '#fff', fontWeight: 900, lineHeight: 1.2, marginBottom: '8px' }}>{book.title}</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>par {book.author}</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {book.tags.map(tag => (
              <span key={tag} style={{ fontSize: '0.72rem', padding: '3px 10px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '100px', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Infos + achat */}
        <div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {book.levels?.map(l => (
              <span key={l} style={{ fontSize: '0.75rem', padding: '4px 12px', background: 'rgba(99,102,241,0.1)', color: 'var(--color-primary)', borderRadius: '100px', fontWeight: 700 }}>
                {LEVEL_LABELS[l]}
              </span>
            ))}
            {book.isAvailableInSubscription && (
              <span style={{ fontSize: '0.75rem', padding: '4px 12px', background: 'rgba(16,185,129,0.1)', color: '#10b981', borderRadius: '100px', fontWeight: 700 }}>
                ♾️ Inclus dans l'abonnement
              </span>
            )}
          </div>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: 'var(--color-text)', letterSpacing: '-0.02em', marginBottom: '0.75rem', lineHeight: 1.1 }}>
            {book.title}
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 500, marginBottom: '0.5rem' }}>
            par <strong style={{ color: 'var(--color-text)' }}>{book.author}</strong>
          </p>
          {book.pageCount && (
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-dim)', fontWeight: 500, marginBottom: '2rem' }}>
              {book.pageCount} pages
            </p>
          )}
          <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', lineHeight: 1.8, marginBottom: '2.5rem', fontWeight: 400 }}>
            {book.description}
          </p>

          {/* Achat */}
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '1.75rem', marginBottom: '1.5rem' }}>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
              {(['digital', 'paper'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  style={{ flex: 1, padding: '0.65rem', borderRadius: '8px', border: `1px solid ${tab === t ? 'var(--color-primary)' : 'var(--color-border)'}`, background: tab === t ? 'rgba(99,102,241,0.08)' : 'transparent', color: tab === t ? 'var(--color-primary)' : 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: tab === t ? 700 : 500, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.2s' }}>
                  {t === 'digital' ? '📱 Numérique' : '📦 Papier'}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '0.5rem' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 900, color: 'var(--color-text)' }}>
                {tab === 'digital' ? `${book.digitalPrice.toFixed(2)}€` : `${book.paperPrice.toFixed(2)}€`}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                {tab === 'digital' ? '— accès illimité' : '— livraison incluse'}
              </span>
            </div>

            {tab === 'digital' && isSubscribed && book.isAvailableInSubscription && (
              <div style={{ padding: '8px 12px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '8px', fontSize: '0.8rem', color: '#10b981', fontWeight: 600, marginBottom: '1rem' }}>
                ✓ Ce livre est inclus dans votre abonnement actif — accès gratuit !
              </div>
            )}

            {isAuthenticated ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {tab === 'digital' && isSubscribed && book.isAvailableInSubscription ? (
                  <button style={{ width: '100%', padding: '0.9rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                    Lire maintenant
                  </button>
                ) : tab === 'digital' ? (
                  <button
                    onClick={handleBuyDigital}
                    disabled={paying}
                    style={{ width: '100%', padding: '0.9rem', background: paying ? 'var(--color-surface-2)' : 'var(--color-primary)', color: paying ? 'var(--color-text-muted)' : '#fff', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 700, cursor: paying ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)', transition: 'background 0.2s' }}>
                    {paying ? 'Redirection...' : `Acheter en numérique — ${book.digitalPrice.toFixed(2)}€`}
                  </button>
                ) : (
                  <Link to={`/checkout?bookId=${book._id}`}
                    style={{ display: 'block', textAlign: 'center', padding: '0.9rem', background: 'var(--color-primary)', color: '#fff', borderRadius: '10px', textDecoration: 'none', fontSize: '1rem', fontWeight: 700, transition: 'background 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-primary-hover)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-primary)')}>
                    Commander en papier — {book.paperPrice.toFixed(2)}€
                  </Link>
                )}

                {tab === 'digital' && !isSubscribed && (
                  <Link to="/subscription"
                    style={{ display: 'block', textAlign: 'center', padding: '0.75rem', background: 'transparent', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)', borderRadius: '10px', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600, transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.color = '#f59e0b' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-muted)' }}>
                    ♾️ Ou s'abonner pour accéder à tous les livres — 9€/mois
                  </Link>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link to="/connexion"
                  style={{ display: 'block', textAlign: 'center', padding: '0.9rem', background: 'var(--color-primary)', color: '#fff', borderRadius: '10px', textDecoration: 'none', fontSize: '1rem', fontWeight: 700 }}>
                  Se connecter pour acheter
                </Link>
                <Link to="/inscription"
                  style={{ display: 'block', textAlign: 'center', padding: '0.75rem', background: 'transparent', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)', borderRadius: '10px', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}>
                  Créer un compte gratuit
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}