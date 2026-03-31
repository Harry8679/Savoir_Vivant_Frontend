import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '@services/api'
import { Book, LEVEL_LABELS } from '@/types/book.types'

export default function AdminBooks() {
  const [books, setBooks]   = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchBooks = () => {
    setLoading(true)
    api.get('/admin/books?limit=50')
      .then(r => setBooks(r.data.data.books))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchBooks() }, [])

  const handlePublish = async (id: string, published: boolean) => {
    await api.patch(`/admin/books/${id}/${published ? 'unpublish' : 'publish'}`)
    fetchBooks()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce livre définitivement ?')) return
    setDeleting(id)
    await api.delete(`/admin/books/${id}`)
    fetchBooks()
    setDeleting(null)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 900, color: 'var(--color-text)', letterSpacing: '-0.02em', marginBottom: '4px' }}>Livres</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>{books.length} livre{books.length > 1 ? 's' : ''} au total</p>
        </div>
        <Link to="/admin/books/new" style={{ padding: '0.7rem 1.5rem', background: 'var(--color-primary)', color: '#fff', borderRadius: '10px', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 700, transition: 'background 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-primary-hover)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-primary)')}>
          + Nouveau livre
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>Chargement...</div>
      ) : (
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '14px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)' }}>
                {['Titre', 'Collection', 'Niveau', 'Prix num.', 'Prix papier', 'Statut', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {books.map((book, i) => (
                <tr key={book._id} style={{ borderBottom: i < books.length - 1 ? '1px solid var(--color-border)' : 'none', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-surface-2)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '2px' }}>{book.title}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>par {book.author}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: '0.78rem', padding: '3px 8px', borderRadius: '6px', background: 'rgba(99,102,241,0.08)', color: 'var(--color-primary)', fontWeight: 600 }}>
                      {/* {(book.collectionId as any)?.name ?? '—'} */}
                      {(book.collectionId as { name?: string })?.name ?? '—'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                    {book.levels?.map(l => LEVEL_LABELS[l]).join(', ')}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text)' }}>
                    {book.digitalPrice.toFixed(2)}€
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text)' }}>
                    {book.paperPrice.toFixed(2)}€
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: '0.72rem', padding: '3px 10px', borderRadius: '100px', background: book.isPublished ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: book.isPublished ? '#10b981' : '#f59e0b', fontWeight: 700 }}>
                      {book.isPublished ? 'Publié' : 'Brouillon'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <Link to={`/admin/books/${book._id}/edit`}
                        style={{ padding: '5px 10px', background: 'transparent', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'var(--color-text-muted)', fontSize: '0.78rem', fontWeight: 600, textDecoration: 'none', transition: 'all 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-primary)' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-muted)' }}>
                        Éditer
                      </Link>
                      <button onClick={() => handlePublish(book._id, book.isPublished)}
                        style={{ padding: '5px 10px', background: 'transparent', border: `1px solid ${book.isPublished ? 'rgba(245,158,11,0.3)' : 'rgba(16,185,129,0.3)'}`, borderRadius: '6px', color: book.isPublished ? '#f59e0b' : '#10b981', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.15s' }}>
                        {book.isPublished ? 'Dépublier' : 'Publier'}
                      </button>
                      <button onClick={() => handleDelete(book._id)}
                        disabled={deleting === book._id}
                        style={{ padding: '5px 10px', background: 'transparent', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', color: '#ef4444', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.15s', opacity: deleting === book._id ? 0.5 : 1 }}>
                        {deleting === book._id ? '...' : 'Suppr.'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {books.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
              Aucun livre. <Link to="/admin/books/new" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Créer le premier</Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}