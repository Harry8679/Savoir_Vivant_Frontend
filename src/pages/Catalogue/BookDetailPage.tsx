import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import type { Book } from '../../types/book.types'
import { LEVEL_LABELS } from '../../types/book.types'
import { bookService } from '../../services/book.service'
import { useCartStore } from '../../store/cartStore'
import { useAuthStore } from '../../store/authStore'

export default function BookDetailPage() {
  const { slug }    = useParams<{ slug: string }>()
  const navigate    = useNavigate()
  const { addToCart, openCart } = useCartStore()
  const { isAuthenticated, user } = useAuthStore()

  const [book, setBook]     = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [format, setFormat]   = useState<'digital' | 'paper'>('digital')
  const [added, setAdded]     = useState(false)

  // Vérifie si l'user a accès (acheté ou abonné)
  const hasAccess =
    user?.purchasedBooks?.includes(book?._id ?? '') ||
    (user?.subscription?.status === 'active' && book?.isAvailableInSubscription)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    bookService.getBook(slug)
      .then(setBook)
      .catch(() => navigate('/catalogue'))
      .finally(() => setLoading(false))
  }, [slug, navigate])

  const handleAddToCart = () => {
    if (!book) return
    addToCart(book, format)
    setAdded(true)
    openCart()
    setTimeout(() => setAdded(false), 2000)
  }

  const handleBuyNow = () => {
    if (!book) return
    addToCart(book, format)
    navigate('/checkout')
  }

  const price = format === 'digital' ? book?.digitalPrice : book?.paperPrice

  if (loading) return <BookDetailSkeleton />
  if (!book)   return null

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link to="/catalogue" className="hover:text-gray-600 transition-colors">
          ← Retour au catalogue
        </Link>
        <span>/</span>
        <span className="text-gray-600 line-clamp-1">{book.title}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-10">

        {/* ── Colonne gauche ─────────────────────────────────────────────── */}
        <div className="flex flex-col items-center lg:items-start gap-5 lg:w-72 shrink-0">

          {/* Couverture */}
          <div className="w-52 rounded-2xl shadow-2xl overflow-hidden">
            {book.coverUrl ? (
              <img
                src={book.coverUrl}
                alt={book.title}
                className="w-full object-cover"
              />
            ) : (
              <div
                className="w-full h-72 flex flex-col justify-end p-5"
                style={{
                  background: `${book.collectionId?.color ?? '#6366f1'}22`,
                  borderLeft: `4px solid ${book.collectionId?.color ?? '#6366f1'}`,
                }}
              >
                <p className="text-[8px] font-black uppercase tracking-widest text-gray-500 mb-1">
                  {book.collectionId?.name}
                </p>
                <p className="text-lg font-extrabold text-gray-800 leading-tight">
                  {book.title}
                </p>
                <p className="text-xs text-gray-500 mt-1">par {book.author}</p>
              </div>
            )}
          </div>

          {/* Tags */}
          {book.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              {book.tags.map(tag => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600
                             border border-gray-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Niveaux couverts */}
          <div className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100">
            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
              Niveaux couverts
            </p>
            <div className="flex flex-wrap gap-1.5">
              {book.levels.map(lvl => (
                <span
                  key={lvl}
                  className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600
                             font-medium border border-indigo-100"
                >
                  {LEVEL_LABELS[lvl]}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Colonne droite ──────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">

          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <span
              className="text-xs px-3 py-1 rounded-full font-semibold text-white"
              style={{ background: book.collectionId?.color ?? '#6366f1' }}
            >
              {book.collectionId?.name}
            </span>
            {book.isAvailableInSubscription && (
              <span className="text-xs px-3 py-1 rounded-full bg-indigo-100 text-indigo-700
                               font-semibold border border-indigo-200">
                ∞ Inclus dans l'abonnement
              </span>
            )}
          </div>

          {/* Titre */}
          <h1 className="text-3xl font-extrabold text-gray-900 leading-tight mb-2">
            {book.title}
          </h1>
          <p className="text-sm text-gray-500 mb-1">
            par <span className="font-semibold text-gray-700">{book.author}</span>
          </p>
          {book.pageCount && (
            <p className="text-sm text-gray-400 mb-5">{book.pageCount} pages</p>
          )}

          {/* Description */}
          <p className="text-base text-gray-600 leading-relaxed mb-8">
            {book.description}
          </p>

          {/* ── Accès déjà acquis ─────────────────────────────────────────── */}
          {hasAccess ? (
            <div className="p-6 rounded-2xl border border-green-200 bg-green-50">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-green-500 text-xl">✓</span>
                <p className="text-base font-bold text-green-700">
                  {user?.subscription?.status === 'active'
                    ? 'Inclus dans votre abonnement'
                    : 'Vous possédez ce livre'}
                </p>
              </div>
              <button
                onClick={() => navigate(`/reader/${book._id}`)}
                className="w-full py-3.5 bg-green-500 text-white font-bold rounded-xl
                           hover:bg-green-600 transition-colors text-sm"
              >
                📖 Lire maintenant
              </button>
            </div>

          ) : (
            /* ── Bloc achat ─────────────────────────────────────────────── */
            <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm space-y-5">

              {/* Toggle Numérique / Papier */}
              <div className="flex rounded-xl overflow-hidden border border-gray-200">
                {(['digital', 'paper'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm
                                font-semibold transition-colors
                                ${f !== 'digital' ? 'border-l border-gray-200' : ''}
                                ${format === f
                                  ? 'bg-indigo-500 text-white'
                                  : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  >
                    {f === 'digital' ? '📱 Numérique' : '📦 Papier'}
                  </button>
                ))}
              </div>

              {/* Prix */}
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-gray-900">
                  {price?.toFixed(2).replace('.', ',')}€
                </span>
                <span className="text-sm text-gray-400">
                  — {format === 'digital' ? 'accès illimité' : 'livraison en France'}
                </span>
              </div>

              {/* Avantages */}
              <ul className="space-y-1.5">
                {(format === 'digital'
                  ? ['Accès immédiat après paiement', 'Lecture sur tous vos appareils', 'Mises à jour gratuites']
                  : ['Livre physique haute qualité', 'Livraison en 3 à 5 jours ouvrés', 'Retours sous 14 jours']
                ).map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="text-green-400">✓</span>{f}
                  </li>
                ))}
              </ul>

              {/* CTA Panier */}
              {isAuthenticated ? (
                <button
                  onClick={handleAddToCart}
                  className={`w-full py-3.5 font-bold rounded-xl text-sm transition-all ${
                    added
                      ? 'bg-green-500 text-white'
                      : 'bg-indigo-500 text-white hover:bg-indigo-600'
                  }`}
                >
                  {added
                    ? '✓ Ajouté au panier !'
                    : `🛒 Ajouter au panier — ${price?.toFixed(2).replace('.', ',')}€`}
                </button>
              ) : (
                <Link
                  to="/connexion"
                  className="block w-full py-3.5 bg-indigo-500 text-white font-bold
                             rounded-xl text-sm text-center hover:bg-indigo-600 transition-colors"
                >
                  Connexion pour acheter
                </Link>
              )}

              {/* Acheter directement */}
              {isAuthenticated && (
                <button
                  onClick={handleBuyNow}
                  className="w-full py-3 bg-white border border-gray-200 text-gray-700
                             font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors"
                >
                  Acheter directement →
                </button>
              )}

              {/* Abonnement */}
              {book.isAvailableInSubscription && (
                <button
                  onClick={() => navigate('/abonnement')}
                  className="w-full py-3 bg-white border border-indigo-100 text-indigo-600
                             font-semibold rounded-xl text-sm hover:bg-indigo-50 transition-colors"
                >
                  ∞ Ou s'abonner pour accéder à tous les livres — 9€/mois
                </button>
              )}
            </div>
          )}

          {/* Sécurité */}
          <div className="flex items-center justify-center gap-6 mt-4 text-xs text-gray-400">
            <span>🔒 Paiement sécurisé</span>
            <span>💳 Stripe</span>
            <span>↩ Remboursement 14j</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Skeleton ──────────────────────────────────────────────────────────────────

function BookDetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-8 animate-pulse">
      <div className="h-4 w-40 bg-gray-200 rounded mb-8" />
      <div className="flex gap-10">
        <div className="w-72 shrink-0 space-y-4">
          <div className="w-52 h-72 bg-gray-200 rounded-2xl" />
          <div className="flex gap-2">
            <div className="h-6 w-16 bg-gray-200 rounded-full" />
            <div className="h-6 w-20 bg-gray-200 rounded-full" />
          </div>
        </div>
        <div className="flex-1 space-y-4">
          <div className="flex gap-2">
            <div className="h-6 w-24 bg-gray-200 rounded-full" />
            <div className="h-6 w-32 bg-gray-200 rounded-full" />
          </div>
          <div className="h-9 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-100 rounded w-1/4" />
          <div className="space-y-2">
            <div className="h-3 bg-gray-100 rounded" />
            <div className="h-3 bg-gray-100 rounded w-5/6" />
            <div className="h-3 bg-gray-100 rounded w-4/5" />
          </div>
          <div className="h-64 bg-gray-100 rounded-2xl mt-6" />
        </div>
      </div>
    </div>
  )
}