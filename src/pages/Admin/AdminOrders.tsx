import { useEffect, useState } from 'react'
import api from '@services/api'

interface Order {
  _id: string
  userId: { name: string; email: string }
  type: 'paper' | 'digital'
  status: string
  totalAmount: number
  items: { title: string; quantity: number; price: number }[]
  createdAt: string
  shippingAddress?: { fullName: string; city: string; country: string }
  trackingNumber?: string
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending:   { label: 'En attente',  color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  paid:      { label: 'Payé',        color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
  shipped:   { label: 'Expédié',     color: '#0d9488', bg: 'rgba(13,148,136,0.1)' },
  delivered: { label: 'Livré',       color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  cancelled: { label: 'Annulé',      color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
}

export default function AdminOrders() {
  const [orders, setOrders]         = useState<Order[]>([])
  const [loading, setLoading]       = useState(true)
  const [tracking, setTracking]     = useState<Record<string, string>>({})
  const [, setShipping]     = useState<string | null>(null)

  const fetch = () => {
    setLoading(true)
    api.get('/admin/orders')
      .then(r => setOrders(r.data.data.orders))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetch() }, [])

  const handleShip = async (id: string) => {
    const num = tracking[id]
    if (!num?.trim()) return
    await api.patch(`/orders/${id}/ship`, { trackingNumber: num })
    setShipping(null)
    fetch()
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 900, color: 'var(--color-text)', letterSpacing: '-0.02em', marginBottom: '4px' }}>Commandes</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>{orders.length} commande{orders.length > 1 ? 's' : ''}</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>Chargement...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map(order => {
            const st = statusConfig[order.status] ?? statusConfig.pending
            return (
              <div key={order._id} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '14px', overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)' }}>#{order._id.slice(-8).toUpperCase()}</span>
                    <span style={{ fontSize: '0.72rem', padding: '3px 10px', borderRadius: '100px', background: st.bg, color: st.color, fontWeight: 700 }}>{st.label}</span>
                    <span style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '6px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                      {order.type === 'digital' ? '📱' : '📦'} {order.type === 'digital' ? 'Numérique' : 'Papier'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{new Date(order.createdAt).toLocaleDateString('fr-FR')}</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 900, color: 'var(--color-text)' }}>{order.totalAmount.toFixed(2)}€</span>
                  </div>
                </div>

                <div style={{ padding: '1rem 1.5rem' }}>
                  <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>Client</div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)' }}>{order.userId?.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{order.userId?.email}</div>
                    </div>
                    {order.shippingAddress && (
                      <div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>Livraison</div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)' }}>{order.shippingAddress.fullName}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{order.shippingAddress.city}, {order.shippingAddress.country}</div>
                      </div>
                    )}
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>Livres</div>
                      {order.items.map((item, i) => (
                        <div key={i} style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                          {item.title} × {item.quantity}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action expédition pour les commandes papier payées */}
                  {order.type === 'paper' && order.status === 'paid' && (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '8px', paddingTop: '12px', borderTop: '1px solid var(--color-border)' }}>
                      <input
                        value={tracking[order._id] ?? ''}
                        onChange={e => setTracking(prev => ({ ...prev, [order._id]: e.target.value }))}
                        placeholder="Numéro de suivi..."
                        style={{ flex: 1, padding: '0.6rem 0.875rem', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'var(--color-text)', fontSize: '0.875rem', fontFamily: 'var(--font-body)', outline: 'none' }}
                      />
                      <button onClick={() => handleShip(order._id)}
                        style={{ padding: '0.6rem 1.25rem', background: '#0d9488', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}>
                        Marquer expédié
                      </button>
                    </div>
                  )}

                  {order.trackingNumber && (
                    <div style={{ marginTop: '8px', fontSize: '0.8rem', color: '#0d9488', fontWeight: 600 }}>
                      📍 Suivi : {order.trackingNumber}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
          {orders.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem', border: '2px dashed var(--color-border)', borderRadius: '14px', color: 'var(--color-text-muted)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📦</div>
              <p style={{ fontWeight: 600 }}>Aucune commande pour l'instant</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}