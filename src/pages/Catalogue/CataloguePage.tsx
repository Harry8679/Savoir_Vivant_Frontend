import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCatalogue } from '@hooks/useCatalogue'
import { useAuthStore } from '@store/authStore'
// import { Book, LEVEL_LABELS } from '@/types/book.types'
import { Book, LEVEL_LABELS } from '@appTypes/book.types'

const LEVELS = ['college', 'lycee', 'prepa', 'superieur']

const COLLECTION_COLORS: Record<string, string> = {
  'mathematiques-vivantes': 'linear-gradient(135deg,#6366f1,#4338ca)',
  'physique-chimie-vivants': 'linear-gradient(135deg,#0f766e,#0d9488)',
  'informatique-vivante': 'linear-gradient(135deg,#b45309,#d97706)',
  'langues-vivantes': 'linear-gradient(135deg,#9d174d,#db2777)',
}

export default function CataloguePage() {
  const { books, collections, loading, error, total, totalPages, filters, updateFilters, setPage } = useCatalogue()
  const { isAuthenticated } = useAuthStore()
  const [searchInput, setSearchInput] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters({ search: searchInput })
  }

  const handleClearFilters = () => {
    setSearchInput('')
    updateFilters({ search: '', collectionId: '', level: '' })
  }

  const hasFilters = !!(filters.search || filters.collectionId || filters.level)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', paddingTop: '72px' }}>

      {/* Hero header */}
      <div style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', padding: '3rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600, marginBottom: '0.5rem' }}>
            Bibliothèque
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 900, color: 'var(--color-text)', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            Catalogue SavoirVivant
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
            {total} livre{total > 1 ? 's' : ''} disponible{total > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2.5rem 3rem', display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2.5rem', alignItems: 'start' }}>

        {/* Sidebar filtres */}
        <aside style={{ position: 'sticky', top: '100px' }}>
          {/* Recherche */}
          <form onSubmit={handleSearch} style={{ marginBottom: '1.5rem' }}>
            <div style={{ position: 'relative' }}>
              <input
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Rechercher un livre..."
                style={{ width: '100%', padding: '0.75rem 2.5rem 0.75rem 1rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '10px', color: 'var(--color-text)', fontSize: '0.875rem', fontFamily: 'var(--font-body)', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
                onFocus={e => (e.target.style.borderColor = 'var(--color-primary)')}
                onBlur={e => (e.target.style.borderColor = 'var(--color-border)')}
              />
              <button type="submit" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: 0, display: 'flex' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M10 10l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </form>

          {/* Collections */}
          <FilterSection title="Collections">
            <button
              onClick={() => updateFilters({ collectionId: '' })}
              style={{ width: '100%', textAlign: 'left', padding: '7px 10px', borderRadius: '8px', background: !filters.collectionId ? 'rgba(99,102,241,0.1)' : 'transparent', color: !filters.collectionId ? 'var(--color-primary)' : 'var(--color-text-muted)', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: !filters.collectionId ? 700 : 500, fontFamily: 'var(--font-body)', transition: 'all 0.15s' }}>
              Toutes les collections
            </button>
            {collections.map(col => (
              <button key={col._id}
                onClick={() => updateFilters({ collectionId: col._id })}
                style={{ width: '100%', textAlign: 'left', padding: '7px 10px', borderRadius: '8px', background: filters.collectionId === col._id ? 'rgba(99,102,241,0.1)' : 'transparent', color: filters.collectionId === col._id ? 'var(--color-primary)' : 'var(--color-text-muted)', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: filters.collectionId === col._id ? 700 : 500, fontFamily: 'var(--font-body)', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: col.color, display: 'inline-block', flexShrink: 0 }} />
                {col.name}
              </button>
            ))}
          </FilterSection>

          {/* Niveaux */}
          <FilterSection title="Niveau">
            <button
              onClick={() => updateFilters({ level: '' })}
              style={{ width: '100%', textAlign: 'left', padding: '7px 10px', borderRadius: '8px', background: !filters.level ? 'rgba(99,102,241,0.1)' : 'transparent', color: !filters.level ? 'var(--color-primary)' : 'var(--color-text-muted)', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: !filters.level ? 700 : 500, fontFamily: 'var(--font-body)', transition: 'all 0.15s' }}>
              Tous les niveaux
            </button>
            {LEVELS.map(level => (
              <button key={level}
                onClick={() => updateFilters({ level })}
                style={{ width: '100%', textAlign: 'left', padding: '7px 10px', borderRadius: '8px', background: filters.level === level ? 'rgba(99,102,241,0.1)' : 'transparent', color: filters.level === level ? 'var(--color-primary)' : 'var(--color-text-muted)', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: filters.level === level ? 700 : 500, fontFamily: 'var(--font-body)', transition: 'all 0.15s' }}>
                {LEVEL_LABELS[level]}
              </button>
            ))}
          </FilterSection>

          {/* Reset */}
          {hasFilters && (
            <button onClick={handleClearFilters}
              style={{ width: '100%', padding: '0.6rem', background: 'transparent', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.2s', marginTop: '0.5rem' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-muted)' }}>
              Réinitialiser les filtres
            </button>
          )}
        </aside>

        {/* Grille livres */}
        <div>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <BookSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#ef4444' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️</div>
              <p style={{ fontWeight: 600 }}>{error}</p>
            </div>
          ) : books.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '6rem 2rem', border: '2px dashed var(--color-border)', borderRadius: '16px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.5rem' }}>Aucun livre trouvé</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                {hasFilters ? 'Essayez de modifier vos filtres.' : 'Aucun livre publié pour l\'instant.'}
              </p>
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                {books.map(book => (
                  <BookCard key={book._id} book={book} isAuthenticated={isAuthenticated} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setPage(p)}
                      style={{ width: '36px', height: '36px', borderRadius: '8px', border: `1px solid ${filters.page === p ? 'var(--color-primary)' : 'var(--color-border)'}`, background: filters.page === p ? 'var(--color-primary)' : 'transparent', color: filters.page === p ? '#fff' : 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.15s' }}>
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function BookCard({ book }: { book: Book; isAuthenticated: boolean }) {
  const col = book.collectionId
  const gradientKey = col?.slug ?? ''
  const gradient = COLLECTION_COLORS[gradientKey] ?? `linear-gradient(135deg, ${col?.color ?? '#6366f1'}, #4338ca)`

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px', overflow: 'hidden', transition: 'all 0.25s', display: 'flex', flexDirection: 'column' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.25)'; e.currentTarget.style.borderColor = col?.color ?? 'var(--color-primary)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--color-border)' }}>

      {/* Cover */}
      <div style={{ background: gradient, aspectRatio: '3/4', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1rem', position: 'relative', overflow: 'hidden' }}>
        {/* Texture subtile */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06 }}>
          <defs><pattern id={`dots-${book._id}`} x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="white" /></pattern></defs>
          <rect width="100%" height="100%" fill={`url(#dots-${book._id})`} />
        </svg>

        {/* Top badges */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
          <span style={{ fontSize: '0.6rem', padding: '2px 8px', background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)', borderRadius: '100px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {/* {book.levels?.map(l => LEVEL_LABELS[l]).join(' · ')} */}
            {book.level?.map(l => LEVEL_LABELS[l]).join(' · ')}
          </span>
          {book.isAvailableInSubscription && (
            <span style={{ fontSize: '0.6rem', padding: '2px 8px', background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)', borderRadius: '100px', fontWeight: 600 }}>
              ♾️ Abonnement
            </span>
          )}
        </div>

        {/* Titre */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '5px' }}>
            {col?.name}
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: '#fff', fontWeight: 800, lineHeight: 1.2 }}>
            {book.title}
          </div>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 500, lineHeight: 1.5, flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {book.description}
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-text)', fontFamily: 'var(--font-display)' }}>
              {book.digitalPrice.toFixed(2)}€
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              ou {book.paperPrice.toFixed(2)}€ papier
            </div>
          </div>
          {book.pageCount && (
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              {book.pageCount}p
            </span>
          )}
        </div>

        <Link to={`/catalogue/${book.slug}`}
          style={{ display: 'block', textAlign: 'center', padding: '0.6rem', background: 'var(--color-primary)', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 700, transition: 'background 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-primary-hover)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-primary)')}>
          Voir le livre
        </Link>
      </div>
    </div>
  )
}

function BookSkeleton() {
  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px', overflow: 'hidden', animation: 'shimmer 1.5s ease-in-out infinite' }}>
      <div style={{ aspectRatio: '3/4', background: 'var(--color-surface-2)' }} />
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ height: '12px', background: 'var(--color-surface-2)', borderRadius: '4px', width: '80%' }} />
        <div style={{ height: '12px', background: 'var(--color-surface-2)', borderRadius: '4px', width: '60%' }} />
        <div style={{ height: '32px', background: 'var(--color-surface-2)', borderRadius: '8px', marginTop: '8px' }} />
      </div>
    </div>
  )
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', padding: '0 10px' }}>
        {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {children}
      </div>
    </div>
  )
}