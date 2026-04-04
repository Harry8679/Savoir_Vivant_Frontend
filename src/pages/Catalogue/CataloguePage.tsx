import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import type { Book, BookFilters, BooksResponse } from '../../types/book.types'
import { LEVEL_LABELS } from '../../types/book.types'
import { bookService } from '../../services/book.service'
import { useCartStore } from '../../store/cartStore'

// ─── Constantes ────────────────────────────────────────────────────────────────

const LEVEL_IDS = ['college', 'lycee', 'prepa', 'superieur'] as const

// ─── BookCard ──────────────────────────────────────────────────────────────────

function BookCard({ book }: { book: Book }) {
  const { addItem, hasItem } = useCartStore()
  const [addedFormat, setAddedFormat] = useState<'digital' | 'paper' | null>(null)
  const inCart = hasBook(book._id)

  const quickAdd = (e: React.MouseEvent, format: 'digital' | 'paper') => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      bookId:       book._id,
      title:        book.title,
      author:       book.author,
      coverUrl:     book.coverUrl ?? '',
      slug:         book.slug,
      type:         format,
      price:        format === 'digital' ? book.digitalPrice : book.paperPrice,
      digitalPrice: book.digitalPrice,
      paperPrice:   book.paperPrice,
    })
    setAddedFormat(format)
    setTimeout(() => setAddedFormat(null), 1500)
  }

  return (
    <Link
      to={`/catalogue/${book.slug}`}
      className="group flex gap-4 p-4 rounded-2xl bg-white border border-gray-100
                 hover:border-gray-200 hover:shadow-lg transition-all duration-200"
    >
      {/* Couverture */}
      <div className="w-24 min-w-24 h-32 rounded-xl shrink-0 overflow-hidden shadow-md">
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full flex flex-col justify-end p-2"
            style={{ background: `${book.collectionId?.color ?? '#6366f1'}22`,
                     borderLeft: `3px solid ${book.collectionId?.color ?? '#6366f1'}` }}
          >
            <p className="text-[9px] font-bold text-gray-700 leading-tight">{book.title}</p>
          </div>
        )}
      </div>

      {/* Infos */}
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        {/* Collection + abonnement */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-[9px] font-black uppercase tracking-wider"
            style={{ color: book.collectionId?.color ?? '#6366f1' }}
          >
            {book.collectionId?.name}
          </span>
          {book.isAvailableInSubscription && (
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-500
                             font-semibold border border-indigo-100">
              ∞ Abonnement
            </span>
          )}
          {inCart && (
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-green-50 text-green-600
                             font-semibold border border-green-100">
              ✓ Dans le panier
            </span>
          )}
        </div>

        {/* Titre */}
        <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2">
          {book.title}
        </h3>

        {/* Niveaux + pages */}
        <div className="flex items-center gap-2 flex-wrap">
          {book.levels.map(lvl => (
            <span key={lvl}
              className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600
                         font-medium border border-indigo-100">
              {LEVEL_LABELS[lvl]}
            </span>
          ))}
          {book.pageCount && (
            <span className="text-[10px] text-gray-400">{book.pageCount} pages</span>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
          {book.description}
        </p>

        {/* Prix + CTA */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
          <div>
            <span className="text-base font-extrabold text-gray-900">
              {book.digitalPrice.toFixed(2).replace('.', ',')}€
            </span>
            <span className="text-[10px] text-gray-400 ml-1.5">
              ou {book.paperPrice.toFixed(2).replace('.', ',')}€ papier
            </span>
          </div>

          {/* Boutons quick-add (visibles au hover) */}
          <div className="hidden group-hover:flex gap-1.5">
            <button
              onClick={e => quickAdd(e, 'digital')}
              className="text-[10px] font-semibold px-2.5 py-1.5 rounded-lg
                         bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
            >
              {addedFormat === 'digital' ? '✓' : '+ Num.'}
            </button>
            <button
              onClick={e => quickAdd(e, 'paper')}
              className="text-[10px] font-semibold px-2.5 py-1.5 rounded-lg
                         bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              {addedFormat === 'paper' ? '✓' : '+ Papier'}
            </button>
          </div>

          <span className="text-xs font-semibold text-gray-500 group-hover:hidden">
            Voir →
          </span>
        </div>
      </div>
    </Link>
  )
}

// ─── Skeleton ──────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="flex gap-4 p-4 rounded-2xl bg-white border border-gray-100 animate-pulse">
      <div className="w-24 min-w-24 h-32 rounded-xl bg-gray-200 shrink-0" />
      <div className="flex-1 space-y-3 pt-1">
        <div className="h-2.5 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-gray-100 rounded-full" />
          <div className="h-5 w-20 bg-gray-100 rounded-full" />
        </div>
        <div className="space-y-1.5">
          <div className="h-2.5 bg-gray-100 rounded" />
          <div className="h-2.5 bg-gray-100 rounded w-5/6" />
        </div>
        <div className="flex justify-between pt-1">
          <div className="h-4 w-20 bg-gray-200 rounded" />
          <div className="h-6 w-16 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function CataloguePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [books, setBooks]   = useState<Book[]>([])
  const [total, setTotal]   = useState(0)
  const [loading, setLoading] = useState(true)

  // Paramètres depuis l'URL
  const activeCol   = searchParams.get('collection') ?? 'all'
  const activeLevel = searchParams.get('level')      ?? 'all'
  const search      = searchParams.get('q')          ?? ''

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams)
    if (!value || value === 'all') next.delete(key)
    else next.set(key, value)
    setSearchParams(next)
  }

  const fetchBooks = useCallback(async () => {
    setLoading(true)
    try {
      const filters: BookFilters = {}
      if (activeCol   !== 'all') filters.collectionId = activeCol
      if (activeLevel !== 'all') filters.level        = activeLevel
      if (search)                filters.search       = search

      const data: BooksResponse = await bookService.getBooks(filters)
      setBooks(data.books)
      setTotal(data.total)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [activeCol, activeLevel, search])

  useEffect(() => { fetchBooks() }, [fetchBooks])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex gap-8">

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside className="w-52 min-w-52 flex-shrink-0 hidden md:block">

        {/* Recherche */}
        <div className="relative mb-7">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            defaultValue={search}
            placeholder="Rechercher un livre..."
            onKeyDown={e => {
              if (e.key === 'Enter')
                setParam('q', (e.target as HTMLInputElement).value)
            }}
            onChange={e => { if (!e.target.value) setParam('q', '') }}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 bg-white
                       text-sm text-gray-800 placeholder:text-gray-400
                       focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        {/* Collections — chargées dynamiquement */}
        <CollectionFilter activeCol={activeCol} onSelect={v => setParam('collection', v)} />

        {/* Niveaux */}
        <div className="mt-6">
          <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3">
            Niveau
          </p>
          <button
            onClick={() => setParam('level', 'all')}
            className={filterClass(activeLevel === 'all')}
          >
            Tous les niveaux
          </button>
          {LEVEL_IDS.map(lvl => (
            <button
              key={lvl}
              onClick={() => setParam('level', lvl)}
              className={filterClass(activeLevel === lvl)}
            >
              {LEVEL_LABELS[lvl]}
            </button>
          ))}
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────────────────── */}
      <main className="flex-1 min-w-0">

        {/* En-tête */}
        <div className="flex items-baseline gap-3 mb-5">
          <h1 className="text-xl font-extrabold text-gray-900">
            {activeCol === 'all' ? 'Tous les livres' : 'Catalogue'}
          </h1>
          {!loading && (
            <span className="text-sm text-gray-400">
              {total} livre{total > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Banner abonnement */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-violet-50
                        border border-indigo-100 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-indigo-700">
              ∞ Accès illimité à toute la bibliothèque
            </p>
            <p className="text-xs text-indigo-500 mt-0.5">
              Tous les livres numériques inclus — 9€/mois ou 79€/an
            </p>
          </div>
          <Link
            to="/abonnement"
            className="text-xs font-semibold bg-indigo-500 text-white px-4 py-2 rounded-xl
                       hover:bg-indigo-600 transition-colors whitespace-nowrap flex-shrink-0"
          >
            S'abonner →
          </Link>
        </div>

        {/* Grille */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} />)
            : books.length === 0
              ? (
                <div className="col-span-2 text-center py-20">
                  <div className="text-4xl mb-3">📚</div>
                  <p className="text-gray-500">Aucun livre trouvé pour ces filtres.</p>
                  <button
                    onClick={() => setSearchParams({})}
                    className="mt-4 text-sm text-indigo-500 hover:underline"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              )
              : books.map(book => <BookCard key={book._id} book={book} />)
          }
        </div>
      </main>
    </div>
  )
}

// ─── Filtre collections (chargé depuis l'API) ─────────────────────────────────

function CollectionFilter({
  activeCol,
  onSelect,
}: {
  activeCol: string
  onSelect: (id: string) => void
}) {
  const [collections, setCollections] = useState<
    Array<{ _id: string; name: string; color: string }>
  >([])

  useEffect(() => {
    bookService.getCollections?.()
      .then(setCollections)
      .catch(() => {})
  }, [])

  return (
    <div>
      <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3">
        Collections
      </p>
      <button
        onClick={() => onSelect('all')}
        className={filterClass(activeCol === 'all')}
      >
        Toutes les collections
      </button>
      {collections.map(c => (
        <button
          key={c._id}
          onClick={() => onSelect(c._id)}
          className={filterClass(activeCol === c._id)}
        >
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ background: c.color }}
          />
          {c.name}
        </button>
      ))}
    </div>
  )
}

// Classe helper bouton filtre
const filterClass = (active: boolean) =>
  `flex items-center gap-2.5 w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium
   mb-0.5 transition-colors ${
     active
       ? 'bg-indigo-50 text-indigo-600 font-semibold'
       : 'text-gray-600 hover:bg-gray-100'
   }`