import { useEffect, useState } from 'react'
import api from '@services/api'
import { Collection } from '@/types/book.types'
// import { Collection } from '@appTypes/book.types'

export default function AdminCollections() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [showForm, setShowForm]       = useState(false)
  const [editing, setEditing]         = useState<Collection | null>(null)
  const [form, setForm] = useState({ name: '', description: '', color: '#6366f1' })
  const [saving, setSaving] = useState(false)

  const fetch = () => api.get('/collections').then(r => setCollections(r.data.data)).catch(() => {})
  useEffect(() => { fetch() }, [])

  const openNew = () => { setEditing(null); setForm({ name: '', description: '', color: '#6366f1' }); setShowForm(true) }
  const openEdit = (c: Collection) => { setEditing(c); setForm({ name: c.name, description: c.description, color: c.color }); setShowForm(true) }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        await api.patch(`/admin/collections/${editing._id}`, form)
      } else {
        await api.post('/admin/collections', form)
      }
      setShowForm(false)
      fetch()
    } catch { /* empty */ }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette collection ?')) return
    await api.delete(`/admin/collections/${id}`)
    fetch()
  }

  const inputStyle: React.CSSProperties = { width: '100%', padding: '0.75rem 1rem', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'var(--color-text)', fontSize: '0.875rem', fontFamily: 'var(--font-body)', outline: 'none', boxSizing: 'border-box' }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 900, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>Collections</h1>
        <button onClick={openNew} style={{ padding: '0.7rem 1.5rem', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
          + Nouvelle collection
        </button>
      </div>

      {/* Formulaire */}
      {showForm && (
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '14px', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--color-text)', marginBottom: '1.25rem', fontSize: '1rem' }}>
            {editing ? 'Modifier la collection' : 'Nouvelle collection'}
          </h3>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Nom *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Couleur</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} style={{ width: '44px', height: '38px', border: '1px solid var(--color-border)', borderRadius: '6px', cursor: 'pointer', padding: '2px' }} />
                  <input value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} style={{ ...inputStyle, flex: 1 }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="submit" disabled={saving} style={{ padding: '0.75rem 1.25rem', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}>
                  {saving ? '...' : 'Sauvegarder'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} style={{ padding: '0.75rem 1rem', background: 'transparent', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                  Annuler
                </button>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
          </form>
        </div>
      )}

      {/* Liste */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {collections.map(col => (
          <div key={col._id} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'border-color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = col.color)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: col.color, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '2px' }}>{col.name}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>{col.description}</div>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={() => openEdit(col)} style={{ padding: '5px 12px', background: 'transparent', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-primary)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-muted)' }}>
                Modifier
              </button>
              <button onClick={() => handleDelete(col._id)} style={{ padding: '5px 12px', background: 'transparent', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', color: '#ef4444', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                Suppr.
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}