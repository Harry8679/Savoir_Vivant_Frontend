import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import type { Book } from '../../types/book.types'
import { bookService } from '../../services/book.service'
import { useAuthStore } from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'
import BookCover from '../../components/BookCover'

export default function LibraryPage() {
  const navigate       = useNavigate()
  const [searchParams] = useSearchParams()
  const { user }       = useAuthStore()
  const { clearCart }  = useCartStore()

  const [books,   setBooks]   = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')

  const paymentSuccess = searchParams.get('payment') === 'success'
  const isSubscribed   = user?.subscriptionStatus === 'active'

  useEffect(() => {
    if (paymentSuccess) clearCart()
  }, [paymentSuccess, clearCart])

  useEffect(() => {
    const load = async () => {
      try {
        if (isSubscribed) {
          const { books: all } = await bookService.getAll({})
          setBooks(all.filter(b => b.isAvailableInSubscription))
        } else {
          const library = await bookService.getMyLibrary()
          setBooks(library)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user, isSubscribed])

  const filtered = books.filter(b =>
    !search ||
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.collectionId?.name?.toLowerCase().includes(search.toLowerCase())
  )

  // ─── État vide ──────────────────────────────────────────────────────
  if (!loading && books.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 pt-24 pb-20 text-center">
        <div className="relative w-28 h-28 mx-auto mb-8">
          <div className="absolute inset-0 rounded-3xl bg-linear-to-br
                          from-indigo-400 to-purple-500 rotate-6 opacity-70" />
          <div className="absolute inset-0 rounded-3xl bg-linear-to-br
                          from-indigo-500 to-purple-600 -rotate-3 flex items-center
                          justify-center text-5xl shadow-xl">
            📚
          </div>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
          Votre bibliothèque est vide
        </h1>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Achetez des livres à l'unité ou souscrivez à un abonnement pour accéder
          à toute la collection Mathématiques Vivantes.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => navigate('/catalogue')}
            className="px-6 py-3 bg-indigo-500 text-white font-semibold rounded-xl
                       text-sm hover:bg-indigo-600 hover:shadow-lg transition-all">
            Parcourir le catalogue →
          </button>
          <button onClick={() => navigate('/abonnement')}
            className="px-6 py-3 bg-white border-2 border-indigo-200 text-indigo-600
                       font-semibold rounded-xl text-sm hover:border-indigo-400
                       hover:bg-indigo-50 transition-all">
            ∞ Voir les offres
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-8">

      {/* Banner paiement confirmé */}
      {paymentSuccess && (
        <div className="mb-6 p-4 rounded-2xl bg-linear-to-r from-emerald-50 to-green-50
                        border border-emerald-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center
                          justify-center text-xl">✅</div>
          <div>
            <p className="font-bold text-emerald-800">Paiement confirmé !</p>
            <p className="text-sm text-emerald-600">
              Votre livre est maintenant disponible dans votre bibliothèque.
            </p>
          </div>
        </div>
      )}

      {/* Banner abonnement actif */}
      {isSubscribed && (
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50
                        to-indigo-50 border border-indigo-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500
                          to-purple-500 flex items-center justify-center text-white text-lg
                          shadow-md">∞</div>
          <div>
            <p className="text-sm font-bold text-indigo-800">
              Abonnement actif — accès illimité
            </p>
            <p className="text-xs text-indigo-600">
              Tous les livres numériques inclus sont accessibles.
            </p>
          </div>
        </div>
      )}

      {/* En-tête */}
      <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Ma bibliothèque
          </h1>
          {!loading && (
            <p className="text-sm text-gray-500 mt-1">
              {books.length} livre{books.length > 1 ? 's' : ''}{' '}
              accessible{books.length > 1 ? 's' : ''}
              {isSubscribed && ' via votre abonnement'}
            </p>
          )}
        </div>
        {!loading && books.length > 3 && (
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher dans ma bibliothèque..."
              className="pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm
                         focus:outline-none focus:ring-2 focus:ring-indigo-300
                         focus:border-indigo-300 w-72 transition-all"
            />
          </div>
        )}
      </div>

      {/* Grille livres */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-2/3 rounded-xl bg-gray-200 mb-3" />
              <div className="h-3 bg-gray-200 rounded w-3/4 mb-1.5" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-3 opacity-40">🔍</div>
          <p className="text-gray-500 mb-3">
            Aucun livre ne correspond à votre recherche.
          </p>
          <button onClick={() => setSearch('')}
            className="text-sm text-indigo-500 hover:underline font-medium">
            Effacer la recherche
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {filtered.map(book => (
            <button
              key={book._id}
              onClick={() => navigate(`/reader/${book._id}`)}
              className="group text-left transition-transform duration-200
                         hover:-translate-y-1"
            >
              <div className="relative mb-3">
                <BookCover book={book} showOverlay />

                {/* Badge format (toujours numérique dans la library) */}
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm
                                text-[9px] font-bold text-gray-700 px-2 py-1
                                rounded-full shadow uppercase tracking-wider">
                  Numérique
                </div>

                {/* Badge abonnement si applicable */}
                {isSubscribed && book.isAvailableInSubscription && (
                  <div className="absolute top-2 left-2 bg-gradient-to-r from-indigo-500
                                  to-purple-500 text-[9px] font-bold text-white px-2 py-1
                                  rounded-full shadow">
                    ∞
                  </div>
                )}
              </div>

              <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug
                            group-hover:text-indigo-600 transition-colors">
                {book.title}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                {book.collectionId?.name && (
                  <span className="text-[10px] text-gray-500 font-medium">
                    {book.collectionId.name}
                  </span>
                )}
                {book.collectionId?.name && book.pageCount && (
                  <span className="text-[10px] text-gray-300">•</span>
                )}
                {book.pageCount && (
                  <span className="text-[10px] text-gray-400">
                    {book.pageCount} pages
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* CTA bas de page */}
      {!loading && books.length > 0 && (
        <div className="mt-16 pt-8 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500 mb-3">
            Envie d'enrichir votre bibliothèque ?
          </p>
          <button onClick={() => navigate('/catalogue')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border-2
                       border-indigo-200 text-indigo-600 font-semibold rounded-xl
                       text-sm hover:border-indigo-400 hover:bg-indigo-50 transition-all">
            Découvrir plus de livres →
          </button>
        </div>
      )}
    </div>
  )
}