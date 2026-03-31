import { useEffect, useState } from 'react'
import DashboardLayout from '@components/layout/DashboardLayout'
import { addressService } from '@services/address.service'
import { Address, COUNTRIES } from '@/types/address.types'

const emptyForm = {
  fullName: '', phone: '', street: '',
  city: '', postalCode: '', country: 'FR',
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [showForm, setShowForm]   = useState(false)
  const [editing, setEditing]     = useState<Address | null>(null)
  const [form, setForm]           = useState({ ...emptyForm })
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState('')

  const fetch = () => addressService.getAll().then(setAddresses).catch(() => {})
  useEffect(() => { fetch() }, [])

  const openNew = () => { setEditing(null); setForm({ ...emptyForm }); setShowForm(true) }
  const openEdit = (a: Address) => {
    setEditing(a)
    setForm({ fullName: a.fullName, phone: a.phone, street: a.street, city: a.city, postalCode: a.postalCode, country: a.country })
    setShowForm(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (editing) {
        await addressService.update(editing._id, form)
      } else {
        await addressService.create(form)
      }
      setShowForm(false)
      fetch()
    } catch {
      setError('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette adresse ?')) return
    await addressService.delete(id)
    fetch()
  }

  const handleSetDefault = async (id: string) => {
    await addressService.setDefault(id)
    fetch()
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.75rem 1rem',
    background: 'var(--color-surface-2)',
    border: '1px solid var(--color-border)',
    borderRadius: '8px', color: 'var(--color-text)',
    fontSize: '0.875rem', fontFamily: 'var(--font-body)',
    fontWeight: 500, outline: 'none', boxSizing: 'border-box',
  }

  return (
    <DashboardLayout title="Mes adresses" subtitle="Gérez vos adresses de livraison">

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
          {addresses.length} adresse{addresses.length > 1 ? 's' : ''} enregistrée{addresses.length > 1 ? 's' : ''}
        </p>
        <button onClick={openNew}
          style={{ padding: '0.65rem 1.25rem', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
          + Ajouter une adresse
        </button>
      </div>

      {/* Formulaire */}
      {showForm && (
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '14px', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--color-text)', marginBottom: '1.25rem', fontSize: '1rem' }}>
            {editing ? 'Modifier l\'adresse' : 'Nouvelle adresse'}
          </h3>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Nom complet *</label>
                <input value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} required style={inputStyle} placeholder="Jean Dupont" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Téléphone *</label>
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required style={inputStyle} placeholder="+33 6 12 34 56 78" />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Adresse *</label>
              <input value={form.street} onChange={e => setForm({ ...form, street: e.target.value })} required style={inputStyle} placeholder="12 rue de la Paix" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Ville *</label>
                <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} required style={inputStyle} placeholder="Paris" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Code postal *</label>
                <input value={form.postalCode} onChange={e => setForm({ ...form, postalCode: e.target.value })} required style={inputStyle} placeholder="75001" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Pays *</label>
                <select value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} style={inputStyle}>
                  {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
                </select>
              </div>
            </div>

            {error && (
              <div style={{ padding: '0.75rem 1rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', fontSize: '0.85rem', color: '#ef4444', fontWeight: 600 }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowForm(false)}
                style={{ padding: '0.65rem 1.25rem', background: 'transparent', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'var(--color-text-muted)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600 }}>
                Annuler
              </button>
              <button type="submit" disabled={saving}
                style={{ padding: '0.65rem 1.5rem', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste adresses */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {addresses.length === 0 && !showForm && (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', border: '2px dashed var(--color-border)', borderRadius: '14px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📍</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.5rem' }}>Aucune adresse</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              Ajoutez une adresse pour commander des livres papier.
            </p>
          </div>
        )}
        {addresses.map(address => (
          <div key={address._id}
            style={{ background: 'var(--color-surface)', border: `1px solid ${address.isDefault ? 'var(--color-primary)' : 'var(--color-border)'}`, borderRadius: '14px', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem', transition: 'border-color 0.2s' }}>

            {/* Icône */}
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: address.isDefault ? 'rgba(99,102,241,0.1)' : 'var(--color-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>
              📍
            </div>

            {/* Infos */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--color-text)' }}>{address.fullName}</span>
                {address.isDefault && (
                  <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '100px', background: 'rgba(99,102,241,0.1)', color: 'var(--color-primary)', fontWeight: 700 }}>
                    Par défaut
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 500, lineHeight: 1.6 }}>
                {address.street}<br />
                {address.postalCode} {address.city} — {COUNTRIES.find(c => c.code === address.country)?.label ?? address.country}<br />
                {address.phone}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
              {!address.isDefault && (
                <button onClick={() => handleSetDefault(address._id)}
                  style={{ padding: '5px 10px', background: 'transparent', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'var(--color-text-muted)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-primary)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-muted)' }}>
                  Définir par défaut
                </button>
              )}
              <button onClick={() => openEdit(address)}
                style={{ padding: '5px 10px', background: 'transparent', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'var(--color-text-muted)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-primary)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-muted)' }}>
                Modifier
              </button>
              <button onClick={() => handleDelete(address._id)}
                style={{ padding: '5px 10px', background: 'transparent', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', color: '#ef4444', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                Suppr.
              </button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}