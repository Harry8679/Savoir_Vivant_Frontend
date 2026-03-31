import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import api from '@services/api'
import { Collection } from '@/types/book.types'

export default function AdminBookForm() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const isEdit     = !!id
  const pdfRef     = useRef<HTMLInputElement>(null)
  const coverRef   = useRef<HTMLInputElement>(null)

  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading]         = useState(false)
  const [saving, setSaving]           = useState(false)
  const [pdfFile, setPdfFile]         = useState<File | null>(null)
  const [coverFile, setCoverFile]     = useState<File | null>(null)
  const [error, setError]             = useState('')
  const [tags, setTags]               = useState('')

  const [form, setForm] = useState({
    title:                     '',
    description:               '',
    collectionId:              '',
    levels:                    [] as string[],  // ← tableau
    digitalPrice:              '',
    paperPrice:                '',
    author:                    '',
    pageCount:                 '',
    isAvailableInSubscription: true,
    coverUrl:                  '',
  })

  useEffect(() => {
    api.get('/collections').then(r => setCollections(r.data.data)).catch(() => {})
    if (isEdit) {
      setLoading(true)
      api.get(`/books/${id}`)
        .then(r => {
          const b = r.data.data
          setForm({
            title:                     b.title,
            description:               b.description,
            collectionId:              b.collectionId?._id ?? b.collectionId,
            levels:                    b.levels ?? [],
            digitalPrice:              String(b.digitalPrice),
            paperPrice:                String(b.paperPrice),
            author:                    b.author,
            pageCount:                 String(b.pageCount ?? ''),
            isAvailableInSubscription: b.isAvailableInSubscription,
            coverUrl:                  b.coverUrl ?? '',
          })
          setTags(b.tags?.join(', ') ?? '')
        })
        .catch(() => navigate('/admin/books'))
        .finally(() => setLoading(false))
    }
  }, [id, isEdit, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.levels.length === 0) {
      setError('Sélectionne au moins un niveau.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('title',                     form.title)
      fd.append('description',               form.description)
      fd.append('collectionId',              form.collectionId)
      fd.append('digitalPrice',              form.digitalPrice)
      fd.append('paperPrice',               form.paperPrice)
      fd.append('author',                    form.author)
      fd.append('pageCount',                 form.pageCount)
      fd.append('isAvailableInSubscription', String(form.isAvailableInSubscription))
      fd.append('coverUrl',                  form.coverUrl)
      fd.append('levels', JSON.stringify(form.levels))
      fd.append('tags',   JSON.stringify(tags.split(',').map(t => t.trim()).filter(Boolean)))
      if (pdfFile)   fd.append('pdf',   pdfFile)
      if (coverFile) fd.append('cover', coverFile)

      if (isEdit) {
        await api.patch(`/admin/books/${id}`, fd)
      } else {
        await api.post('/admin/books', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      }
      navigate('/admin/books')
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } }
      setError(axiosErr?.response?.data?.message ?? 'Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.75rem 1rem',
    background: 'var(--color-bg)',
    border: '1px solid var(--color-border)',
    borderRadius: '8px', color: 'var(--color-text)',
    fontSize: '0.875rem', fontFamily: 'var(--font-body)',
    fontWeight: 500, outline: 'none', transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  }

  if (loading) return (
    <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Chargement...</div>
  )

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/admin/books"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--color-text-muted)', textDecoration: 'none', fontWeight: 600, marginBottom: '1rem', transition: 'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Retour aux livres
        </Link>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 900, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
          {isEdit ? 'Modifier le livre' : 'Nouveau livre'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Informations générales */}
        <FormSection title="Informations générales">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Field label="Titre *">
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required style={inputStyle}
                onFocus={e => (e.target.style.borderColor = 'var(--color-primary)')}
                onBlur={e => (e.target.style.borderColor = 'var(--color-border)')} />
            </Field>
            <Field label="Auteur *">
              <input value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} required style={inputStyle}
                onFocus={e => (e.target.style.borderColor = 'var(--color-primary)')}
                onBlur={e => (e.target.style.borderColor = 'var(--color-border)')} />
            </Field>
          </div>

          <Field label="Description *">
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required rows={4}
              style={{ ...inputStyle, resize: 'vertical' }}
              onFocus={e => (e.target.style.borderColor = 'var(--color-primary)')}
              onBlur={e => (e.target.style.borderColor = 'var(--color-border)')} />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Field label="Collection *">
              <select value={form.collectionId} onChange={e => setForm({ ...form, collectionId: e.target.value })} required style={inputStyle}>
                <option value="">Choisir...</option>
                {collections.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Nombre de pages">
              <input type="number" value={form.pageCount} onChange={e => setForm({ ...form, pageCount: e.target.value })} style={inputStyle}
                onFocus={e => (e.target.style.borderColor = 'var(--color-primary)')}
                onBlur={e => (e.target.style.borderColor = 'var(--color-border)')} />
            </Field>
          </div>

          {/* Niveaux — cases à cocher multiples */}
          <Field label="Niveaux * (choix multiples)">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {[
                { value: 'college',   label: 'Collège' },
                { value: 'lycee',     label: 'Lycée / Terminale' },
                { value: 'prepa',     label: 'Prépa (MPSI/PCSI/MP...)' },
                { value: 'superieur', label: 'Supérieur / Université' },
              ].map(lvl => {
                const checked = form.levels.includes(lvl.value)
                return (
                  <label key={lvl.value} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', border: `1px solid ${checked ? 'var(--color-primary)' : 'var(--color-border)'}`, borderRadius: '8px', cursor: 'pointer', background: checked ? 'rgba(99,102,241,0.06)' : 'transparent', transition: 'all 0.15s' }}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        setForm(prev => ({
                          ...prev,
                          levels: checked
                            ? prev.levels.filter(l => l !== lvl.value)
                            : [...prev.levels, lvl.value],
                        }))
                      }}
                      style={{ width: '15px', height: '15px', accentColor: 'var(--color-primary)', flexShrink: 0 }}
                    />
                    <span style={{ fontSize: '0.875rem', fontWeight: checked ? 700 : 500, color: checked ? 'var(--color-text)' : 'var(--color-text-muted)' }}>
                      {lvl.label}
                    </span>
                  </label>
                )
              })}
            </div>
            {form.levels.length === 0 && (
              <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '6px', fontWeight: 500 }}>
                Sélectionne au moins un niveau
              </p>
            )}
          </Field>

          <Field label="Tags (séparés par des virgules)">
            <input value={tags} onChange={e => setTags(e.target.value)} placeholder="suites, arithmétique, lycée" style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'var(--color-primary)')}
              onBlur={e => (e.target.style.borderColor = 'var(--color-border)')} />
          </Field>
        </FormSection>

        {/* Tarification */}
        <FormSection title="Tarification">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Field label="Prix numérique (€) *">
              <input type="number" step="0.01" min="0" value={form.digitalPrice} onChange={e => setForm({ ...form, digitalPrice: e.target.value })} required style={inputStyle}
                onFocus={e => (e.target.style.borderColor = 'var(--color-primary)')}
                onBlur={e => (e.target.style.borderColor = 'var(--color-border)')} />
            </Field>
            <Field label="Prix papier (€) *">
              <input type="number" step="0.01" min="0" value={form.paperPrice} onChange={e => setForm({ ...form, paperPrice: e.target.value })} required style={inputStyle}
                onFocus={e => (e.target.style.borderColor = 'var(--color-primary)')}
                onBlur={e => (e.target.style.borderColor = 'var(--color-border)')} />
            </Field>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.isAvailableInSubscription}
              onChange={e => setForm({ ...form, isAvailableInSubscription: e.target.checked })}
              style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }} />
            <span style={{ fontSize: '0.875rem', color: 'var(--color-text)', fontWeight: 500 }}>
              Inclus dans l'abonnement mensuel/annuel
            </span>
          </label>
        </FormSection>

        {/* Fichiers */}
        <FormSection title="Fichiers">
          <Field label="URL de la couverture (ou uploadez une image ci-dessous)">
            <input value={form.coverUrl} onChange={e => setForm({ ...form, coverUrl: e.target.value })} placeholder="https://..." style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'var(--color-primary)')}
              onBlur={e => (e.target.style.borderColor = 'var(--color-border)')} />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Field label="Image de couverture (upload)">
              <div onClick={() => coverRef.current?.click()}
                style={{ border: `2px dashed ${coverFile ? 'var(--color-primary)' : 'var(--color-border)'}`, borderRadius: '10px', padding: '1.5rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', background: coverFile ? 'rgba(99,102,241,0.04)' : 'transparent' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = coverFile ? 'var(--color-primary)' : 'var(--color-border)')}>
                <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>🖼️</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                  {coverFile ? coverFile.name : 'Cliquer pour sélectionner une image'}
                </div>
              </div>
              <input ref={coverRef} type="file" accept="image/*" style={{ display: 'none' }}
                onChange={e => setCoverFile(e.target.files?.[0] ?? null)} />
            </Field>

            <Field label="Fichier PDF du livre">
              <div onClick={() => pdfRef.current?.click()}
                style={{ border: `2px dashed ${pdfFile ? '#10b981' : 'var(--color-border)'}`, borderRadius: '10px', padding: '1.5rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', background: pdfFile ? 'rgba(16,185,129,0.04)' : 'transparent' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = pdfFile ? '#10b981' : 'var(--color-primary)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = pdfFile ? '#10b981' : 'var(--color-border)')}>
                <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>📄</div>
                <div style={{ fontSize: '0.8rem', color: pdfFile ? '#10b981' : 'var(--color-text-muted)', fontWeight: pdfFile ? 700 : 500 }}>
                  {pdfFile ? `✓ ${pdfFile.name}` : 'Cliquer pour sélectionner le PDF'}
                </div>
                {pdfFile && (
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    {(pdfFile.size / 1024 / 1024).toFixed(1)} Mo
                  </div>
                )}
              </div>
              <input ref={pdfRef} type="file" accept=".pdf" style={{ display: 'none' }}
                onChange={e => setPdfFile(e.target.files?.[0] ?? null)} />
            </Field>
          </div>

          {!isEdit && !pdfFile && (
            <div style={{ fontSize: '0.78rem', color: '#f59e0b', fontWeight: 500 }}>
              ⚠️ Sans PDF uploadé, le livre ne sera pas lisible. Vous pourrez l'ajouter plus tard en éditant le livre.
            </div>
          )}
        </FormSection>

        {/* Erreur */}
        {error && (
          <div style={{ padding: '0.875rem 1rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', fontSize: '0.875rem', color: '#ef4444', fontWeight: 600 }}>
            {error}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
          <Link to="/admin/books"
            style={{ padding: '0.75rem 1.5rem', background: 'transparent', border: '1px solid var(--color-border)', borderRadius: '10px', color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}>
            Annuler
          </Link>
          <button type="submit" disabled={saving}
            style={{ padding: '0.75rem 2rem', background: saving ? 'var(--color-surface-2)' : 'var(--color-primary)', color: saving ? 'var(--color-text-muted)' : '#fff', border: 'none', borderRadius: '10px', fontSize: '0.875rem', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.2s' }}>
            {saving ? 'Sauvegarde...' : isEdit ? 'Mettre à jour' : 'Créer le livre'}
          </button>
        </div>
      </form>
    </div>
  )
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '14px', overflow: 'hidden' }}>
      <div style={{ padding: '0.875rem 1.5rem', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)' }}>
        <h2 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>{title}</h2>
      </div>
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {children}
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </label>
      {children}
    </div>
  )
}