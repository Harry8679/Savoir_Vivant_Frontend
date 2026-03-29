import { useEffect, useState } from 'react'
import api from '@services/api'

interface Carrier {
  _id: string
  name: string
  countries: string[]
  estimatedDays: { min: number; max: number }
  priceRules: { country: string; price: number }[]
  isActive: boolean
}

const COUNTRIES = [
  { code: 'FR', label: 'France' },
  { code: 'BE', label: 'Belgique' },
  { code: 'CH', label: 'Suisse' },
  { code: 'DE', label: 'Allemagne' },
  { code: 'ES', label: 'Espagne' },
  { code: 'IT', label: 'Italie' },
  { code: 'GB', label: 'Royaume-Uni' },
  { code: 'CM', label: 'Cameroun' },
  { code: 'SN', label: 'Sénégal' },
  { code: 'CI', label: 'Côte d\'Ivoire' },
  { code: 'MA', label: 'Maroc' },
  { code: 'TN', label: 'Tunisie' },
  { code: 'OTHER', label: 'Autre' },
]

const emptyForm = {
  name: '',
  minDays: '2',
  maxDays: '7',
  countries: [] as string[],
  priceRules: [] as { country: string; price: string }[],
  isActive: true,
}

export default function AdminCarriers() {
  const [carriers, setCarriers] = useState<Carrier[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing]   = useState<Carrier | null>(null)
  const [form, setForm]         = useState({ ...emptyForm })
  const [saving, setSaving]     = useState(false)

  const fetch = () => api.get('/admin/carriers?all=true').then(r => setCarriers(r.data.data)).catch(() => {})
  useEffect(() => { fetch() }, [])

  const openNew = () => { setEditing(null); setForm({ ...emptyForm }); setShowForm(true) }
  const openEdit = (c: Carrier) => {
    setEditing(c)
    setForm({
      name: c.name,
      minDays: String(c.estimatedDays.min),
      maxDays: String(c.estimatedDays.max),
      countries: c.countries,
      priceRules: c.priceRules.map(r => ({ country: r.country, price: String(r.price) })),
      isActive: c.isActive,
    })
    setShowForm(true)
  }

  const toggleCountry = (code: string) => {
    setForm(prev => {
      const exists = prev.countries.includes(code)
      const countries = exists ? prev.countries.filter(c => c !== code) : [...prev.countries, code]
      const priceRules = exists
        ? prev.priceRules.filter(r => r.country !== code)
        : [...prev.priceRules, { country: code, price: '0' }]
      return { ...prev, countries, priceRules }
    })
  }

  const updatePrice = (country: string, price: string) => {
    setForm(prev => ({ ...prev, priceRules: prev.priceRules.map(r => r.country === country ? { ...r, price } : r) }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        name: form.name,
        estimatedDays: { min: parseInt(form.minDays), max: parseInt(form.maxDays) },
        countries: form.countries,
        priceRules: form.priceRules.map(r => ({ country: r.country, price: parseFloat(r.price) })),
        isActive: form.isActive,
      }
      if (editing) {
        await api.patch(`/admin/carriers/${editing._id}`, payload)
      } else {
        await api.post('/admin/carriers', payload)
      }
      setShowForm(false)
      fetch()
    } catch { /* empty */ }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce transporteur ?')) return
    await api.delete(`/admin/carriers/${id}`)
    fetch()
  }

  const inputStyle: React.CSSProperties = { width: '100%', padding: '0.65rem 0.875rem', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'var(--color-text)', fontSize: '0.875rem', fontFamily: 'var(--font-body)', outline: 'none', boxSizing: 'border-box' }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 900, color: 'var(--color-text)', letterSpacing: '-0.02em', marginBottom: '4px' }}>Transporteurs</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Gérez les options de livraison pour les commandes papier</p>
        </div>
        <button onClick={openNew} style={{ padding: '0.7rem 1.5rem', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
          + Nouveau transporteur
        </button>
      </div>

      {/* Formulaire */}
      {showForm && (
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '14px', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--color-text)', marginBottom: '1.5rem', fontSize: '1rem' }}>
            {editing ? 'Modifier' : 'Nouveau transporteur'}
          </h3>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Nom du transporteur *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="Ex: Colissimo, DHL..." style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Délai min (jours)</label>
                <input type="number" min="1" value={form.minDays} onChange={e => setForm({ ...form, minDays: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Délai max (jours)</label>
                <input type="number" min="1" value={form.maxDays} onChange={e => setForm({ ...form, maxDays: e.target.value })} style={inputStyle} />
              </div>
            </div>

            {/* Pays et prix */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Pays desservis et tarifs
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
                {COUNTRIES.map(country => {
                  const selected = form.countries.includes(country.code)
                  const rule = form.priceRules.find(r => r.country === country.code)
                  return (
                    <div key={country.code} style={{ border: `1px solid ${selected ? 'var(--color-primary)' : 'var(--color-border)'}`, borderRadius: '8px', padding: '10px', background: selected ? 'rgba(99,102,241,0.05)' : 'transparent', transition: 'all 0.15s' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: selected ? '8px' : 0 }}>
                        <input type="checkbox" checked={selected} onChange={() => toggleCountry(country.code)} style={{ accentColor: 'var(--color-primary)', width: '14px', height: '14px' }} />
                        <span style={{ fontSize: '0.85rem', fontWeight: selected ? 700 : 500, color: selected ? 'var(--color-text)' : 'var(--color-text-muted)' }}>
                          {country.label}
                        </span>
                      </label>
                      {selected && rule && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <input type="number" step="0.01" min="0" value={rule.price} onChange={e => updatePrice(country.code, e.target.value)} placeholder="Prix €" style={{ ...inputStyle, fontSize: '0.8rem', padding: '5px 8px' }} />
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>€</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }} />
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text)', fontWeight: 500 }}>Transporteur actif (visible par les utilisateurs)</span>
            </label>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: '0.7rem 1.25rem', background: 'transparent', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'var(--color-text-muted)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600 }}>Annuler</button>
              <button type="submit" disabled={saving} style={{ padding: '0.7rem 1.5rem', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste transporteurs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {carriers.length === 0 && !showForm && (
          <div style={{ textAlign: 'center', padding: '4rem', border: '2px dashed var(--color-border)', borderRadius: '14px', color: 'var(--color-text-muted)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🚚</div>
            <p style={{ fontWeight: 600, marginBottom: '4px' }}>Aucun transporteur</p>
            <p style={{ fontSize: '0.875rem' }}>Ajoutez des transporteurs pour les commandes papier.</p>
          </div>
        )}
        {carriers.map(carrier => (
          <div key={carrier._id} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', transition: 'border-color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}>
            <div style={{ flex: 1, minWidth: '150px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <div style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--color-text)' }}>{carrier.name}</div>
                <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '100px', background: carrier.isActive ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: carrier.isActive ? '#10b981' : '#ef4444', fontWeight: 700 }}>
                  {carrier.isActive ? 'Actif' : 'Inactif'}
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                {carrier.estimatedDays.min}–{carrier.estimatedDays.max} jours · {carrier.countries.length} pays
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', flex: 2 }}>
              {carrier.priceRules.slice(0, 6).map(rule => (
                <span key={rule.country} style={{ fontSize: '0.72rem', padding: '3px 8px', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                  {rule.country} — {rule.price.toFixed(2)}€
                </span>
              ))}
              {carrier.priceRules.length > 6 && (
                <span style={{ fontSize: '0.72rem', padding: '3px 8px', color: 'var(--color-text-dim)', fontWeight: 500 }}>
                  +{carrier.priceRules.length - 6} autres
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={() => openEdit(carrier)} style={{ padding: '5px 12px', background: 'transparent', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-primary)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-muted)' }}>
                Modifier
              </button>
              <button onClick={() => handleDelete(carrier._id)} style={{ padding: '5px 12px', background: 'transparent', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', color: '#ef4444', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                Suppr.
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}