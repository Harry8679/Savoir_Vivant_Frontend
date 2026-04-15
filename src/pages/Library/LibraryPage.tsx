// src/pages/Library/LibraryPage.tsx
import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import type { Book } from '../../types/book.types'
import { bookService } from '../../services/book.service'
import { useAuthStore } from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'

export default function LibraryPage() {
  const navigate       = useNavigate()
  const [searchParams] = useSearchParams()
  const { user }       = useAuthStore()
  const { clearCart }  = useCartStore()

  const [books,   setBooks]   = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')

  const paymentSuccess = searchParams.get('payment') === 'success'

  useEffect(() => {
    if (paymentSuccess) clearCart()
  }, [paymentSuccess, clearCart])

  useEffect(() => {
    const isSubscribed = user?.subscriptionStatus === 'active'
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
  }, [user])

  const filtered = books.filter(b =>
    !search ||
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.collectionId?.name?.toLowerCase().includes(search.toLowerCase())
  )

  // ─── Bibliothèque vide ────────────────────────────────────────────────────

  if (!loading && books.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 pt-24 pb-20 text-center">
        <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center
                        justify-center text-4xl mx-auto mb-6">📚</div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
          Votre bibliothèque est vide
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Achetez des livres ou abonnez-vous pour accéder à toute la bibliothèque.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => navigate('/catalogue')}
            className="px-6 py-2.5 bg-indigo-500 text-white font-semibold rounded-xl
                       text-sm hover:bg-indigo-600 transition-colors">
            Parcourir le catalogue →
          </button>
          <button onClick={() => navigate('/abonnement')}
            className="px-6 py-2.5 bg-white border border-indigo-200 text-indigo-600
                       font-semibold rounded-xl text-sm hover:bg-indigo-50 transition-colors">
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
        <div className="mb-6 p-4 rounded-2xl bg-green-50 border border-green-200
                        flex items-center gap-3">
          <span className="text-2xl">✅</span>
          <div>
            <p className="font-bold text-green-700">Paiement confirmé !</p>
            <p className="text-sm text-green-600">
              Votre livre est maintenant disponible dans votre bibliothèque.
            </p>
          </div>
        </div>
      )}

      {/* En-tête */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Ma bibliothèque</h1>
          {!loading && (
            <p className="text-sm text-gray-400 mt-0.5">
              {books.length} livre{books.length > 1 ? 's' : ''}{' '}
              accessible{books.length > 1 ? 's' : ''}
            </p>
          )}
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            🔍
          </span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher dans ma bibliothèque..."
            className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm
                       focus:outline-none focus:ring-2 focus:ring-indigo-300 w-64"
          />
        </div>
      </div>

      {/* Banner abonnement actif */}
      {user?.subscriptionStatus === 'active' && (
        <div className="mb-6 p-4 rounded-2xl bg-indigo-50 border border-indigo-100
                        flex items-center gap-3">
          <span className="text-2xl">∞</span>
          <div>
            <p className="text-sm font-bold text-indigo-700">
              Abonnement actif — accès illimité
            </p>
            <p className="text-xs text-indigo-500">
              Tous les livres numériques inclus dans votre abonnement sont accessibles.
            </p>
          </div>
        </div>
      )}

      {/* Grille livres */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-2/3 rounded-xl bg-gray-200 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-3/4 mb-1" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">Aucun livre ne correspond à votre recherche.</p>
          <button onClick={() => setSearch('')}
            className="mt-2 text-sm text-indigo-500 hover:underline">
            Effacer la recherche
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map(book => {
            const color = book.collectionId?.color ?? '#6366f1'
            return (
              <button
                key={book._id}
                onClick={() => navigate(`/reader/${book._id}`)}
                className="group text-left"
              >
                {/* Couverture */}
                <div className="aspect-[2/3] rounded-xl overflow-hidden mb-2 shadow-md
                                relative transition-transform group-hover:scale-105">
                  {book.coverUrl ? (
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex flex-col justify-between p-3"
                      style={{
                        background: `linear-gradient(135deg, ${color}ee, ${color}88)`,
                      }}
                    >
                      {/* Décoration */}
                      <div className="flex justify-between items-start">
                        <div className="w-5 h-5 rounded-full bg-white/15" />
                        <div className="w-3 h-3 rounded-full bg-white/10" />
                      </div>

                      {/* Titre */}
                      <div>
                        {book.collectionId?.name && (
                          <p className="text-[8px] font-bold uppercase tracking-widest
                                        text-white/60 mb-1.5">
                            {book.collectionId.name}
                          </p>
                        )}
                        <p className="text-xs font-extrabold text-white leading-tight line-clamp-4">
                          {book.title}
                        </p>
                        {book.author && (
                          <p className="text-[9px] text-white/50 mt-1.5 line-clamp-1">
                            {book.author}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Overlay Lire */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100
                                  transition-opacity flex items-center justify-center">
                    <span className="bg-white text-gray-900 text-xs font-bold
                                     px-3 py-1.5 rounded-full shadow">
                      📖 Lire
                    </span>
                  </div>
                </div>

                <p className="text-xs font-semibold text-gray-900 line-clamp-2 leading-tight">
                  {book.title}
                </p>
                {book.collectionId?.name && (
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {book.collectionId.name}
                  </p>
                )}
                {book.pageCount && (
                  <p className="text-[10px] text-gray-300">{book.pageCount} pages</p>
                )}
              </button>
            )
          })}
        </div>
      )}

      {!loading && books.length > 0 && (
        <div className="mt-10 text-center">
          <button onClick={() => navigate('/catalogue')}
            className="text-sm text-indigo-500 hover:underline">
            Découvrir plus de livres →
          </button>
        </div>
      )}
    </div>
  )
}