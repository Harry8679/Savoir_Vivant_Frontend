import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Book } from '../../types/book.types'
import { bookService } from '../../services/book.service'
import { useAuthStore } from '../../store/authStore'

export default function LibraryPage() {
  const navigate            = useNavigate()
  const { user }            = useAuthStore()
  const [books,   setBooks]   = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')

  useEffect(() => {
    bookService.getBooks({}).then(({ books: all }) => {
      const accessible = all.filter(b =>
        user?.purchasedBooks?.includes(b._id) ||
        (user?.subscription?.status === 'active' && b.isAvailableInSubscription)
      )
      setBooks(accessible)
    }).finally(() => setLoading(false))
  }, [user])

  const filtered = books.filter(b =>
    !search ||
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.collectionId?.name.toLowerCase().includes(search.toLowerCase())
  )

  // ─── Vide ────────────────────────────────────────────────────────────────

  if (!loading && books.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">📚</div>
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

      {/* En-tête */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Ma bibliothèque</h1>
          {!loading && (
            <p className="text-sm text-gray-400 mt-0.5">
              {books.length} livre{books.length > 1 ? 's' : ''} accessible{books.length > 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Recherche */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
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
      {user?.subscription?.status === 'active' && (
        <div className="mb-6 p-4 rounded-2xl bg-indigo-50 border border-indigo-100
                        flex items-center gap-3">
          <span className="text-2xl">∞</span>
          <div>
            <p className="text-sm font-bold text-indigo-700">
              Abonnement actif — accès illimité
            </p>
            <p className="text-xs text-indigo-500">
              Renouvellement le{' '}
              {new Date(user.subscription.currentPeriodEnd).toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
      )}

      {/* Grille livres */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[2/3] rounded-xl bg-gray-200 mb-2" />
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
          {filtered.map(book => (
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
                    className="w-full h-full flex flex-col justify-end p-3"
                    style={{
                      background: `${book.collectionId?.color ?? '#6366f1'}15`,
                      borderLeft: `3px solid ${book.collectionId?.color ?? '#6366f1'}`,
                    }}
                  >
                    <p className="text-[7px] font-bold uppercase tracking-wider mb-1"
                       style={{ color: book.collectionId?.color }}>
                      {book.collectionId?.name}
                    </p>
                    <p className="text-xs font-bold text-gray-800 leading-tight">
                      {book.title}
                    </p>
                  </div>
                )}

                {/* Overlay "Lire" au hover */}
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
              <p className="text-[10px] text-gray-400 mt-0.5">
                {book.collectionId?.name}
              </p>
              {book.pageCount && (
                <p className="text-[10px] text-gray-300">{book.pageCount} pages</p>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lien catalogue */}
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