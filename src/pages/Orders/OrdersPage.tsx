import DashboardLayout from '@components/layout/DashboardLayout'

const mockOrders = [
  {
    id: 'CMD-2025-001',
    date: '15 mars 2025',
    type: 'digital' as const,
    status: 'paid' as const,
    items: [{ title: 'Suites Numériques', price: 12.99 }],
    total: 12.99,
  },
  {
    id: 'CMD-2025-002',
    date: '2 février 2025',
    type: 'paper' as const,
    status: 'delivered' as const,
    items: [
      { title: 'Limites de Fonctions', price: 19.99 },
      { title: 'Primitives & Intégrales', price: 19.99 },
    ],
    total: 39.98,
    address: '12 rue de la Paix, 75001 Paris',
    tracking: 'FR123456789',
  },
]

const statusConfig = {
  pending:   { label: 'En attente',  color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',   dot: '#f59e0b' },
  paid:      { label: 'Payé',        color: '#6366f1', bg: 'rgba(99,102,241,0.1)',   dot: '#6366f1' },
  shipped:   { label: 'Expédié',     color: '#0d9488', bg: 'rgba(13,148,136,0.1)',   dot: '#0d9488' },
  delivered: { label: 'Livré',       color: '#10b981', bg: 'rgba(16,185,129,0.1)',   dot: '#10b981' },
  cancelled: { label: 'Annulé',      color: '#ef4444', bg: 'rgba(239,68,68,0.1)',    dot: '#ef4444' },
}

export default function OrdersPage() {
  const totalSpent = mockOrders.reduce((acc, o) => acc + o.total, 0)

  return (
    <DashboardLayout
      title="Mes commandes"
      subtitle={`${mockOrders.length} commande${mockOrders.length > 1 ? 's' : ''} — ${totalSpent.toFixed(2)}€ dépensés au total`}
    >
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
        {[
          { label: 'Commandes total', value: mockOrders.length, color: 'var(--color-primary)' },
          { label: 'Livres numériques', value: mockOrders.filter(o => o.type === 'digital').length, color: '#6366f1' },
          { label: 'Livres papier', value: mockOrders.filter(o => o.type === 'paper').length, color: '#f59e0b' },
        ].map(stat => (
          <div key={stat.label} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '14px', padding: '1.25rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: stat.color, opacity: 0.7 }} />
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900, color: stat.color, marginBottom: '4px' }}>{stat.value}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {mockOrders.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {mockOrders.map(order => {
            const st = statusConfig[order.status]
            return (
              <div key={order.id} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px', overflow: 'hidden', transition: 'border-color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}>

                {/* Header */}
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', background: 'var(--color-surface-2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)' }}>{order.id}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', padding: '3px 10px', borderRadius: '100px', background: st.bg, color: st.color, fontWeight: 700 }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: st.dot, display: 'inline-block' }} />
                      {st.label}
                    </span>
                    <span style={{ fontSize: '0.72rem', padding: '3px 10px', borderRadius: '100px', background: 'var(--color-surface)', color: 'var(--color-text-muted)', fontWeight: 600, border: '1px solid var(--color-border)' }}>
                      {order.type === 'digital' ? '📱 Numérique' : '📦 Papier'}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>{order.date}</span>
                </div>

                {/* Body */}
                <div style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ marginBottom: '1rem' }}>
                    {order.items.map((item, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < order.items.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                        <span style={{ fontSize: '0.875rem', color: 'var(--color-text)', fontWeight: 500 }}>{item.title}</span>
                        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text)' }}>{item.price.toFixed(2)}€</span>
                      </div>
                    ))}
                  </div>

                  {'address' in order && (
                    <div style={{ padding: '10px 12px', background: 'var(--color-surface-2)', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                      📍 {order.address}
                      {'tracking' in order && (
                        <span style={{ marginLeft: '12px', color: 'var(--color-primary)', fontWeight: 600 }}>· Suivi : {order.tracking}</span>
                      )}
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem', paddingTop: '8px', borderTop: '1px solid var(--color-border)' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Total</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-text)' }}>{order.total.toFixed(2)}€</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '6rem 2rem', border: '2px dashed var(--color-border)', borderRadius: '16px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.5rem' }}>Aucune commande</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Vous n'avez pas encore passé de commande.</p>
        </div>
      )}
    </DashboardLayout>
  )
}