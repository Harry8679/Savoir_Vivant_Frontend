import { Link } from 'react-router-dom'

const mockOrders = [
  {
    id: 'CMD-001',
    date: '15 mars 2025',
    type: 'digital' as const,
    status: 'paid' as const,
    items: [{ title: 'Suites Numériques', price: 12.99 }],
    total: 12.99,
  },
  {
    id: 'CMD-002',
    date: '2 février 2025',
    type: 'paper' as const,
    status: 'delivered' as const,
    items: [{ title: 'Limites de Fonctions', price: 19.99 }, { title: 'Primitives & Intégrales', price: 19.99 }],
    total: 39.98,
  },
]

const statusConfig = {
  pending:   { label: 'En attente',  color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  paid:      { label: 'Payé',        color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
  shipped:   { label: 'Expédié',     color: '#0d9488', bg: 'rgba(13,148,136,0.1)' },
  delivered: { label: 'Livré',       color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  cancelled: { label: 'Annulé',      color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
}

export default function OrdersPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', paddingTop: '6rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 3rem' }}>

        <div style={{ marginBottom: '2.5rem' }}>
          <Link to="/profile" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--color-text-muted)', textDecoration: 'none', fontWeight: 600, marginBottom: '1.5rem', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Mon profil
          </Link>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Mes commandes
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
            {mockOrders.length} commande{mockOrders.length > 1 ? 's' : ''} au total
          </p>
        </div>

        {mockOrders.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {mockOrders.map(order => {
              const st = statusConfig[order.status]
              return (
                <div key={order.id} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '14px', overflow: 'hidden' }}>
                  {/* Header commande */}
                  <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)', fontFamily: 'var(--font-mono)' }}>{order.id}</span>
                      <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '100px', background: st.bg, color: st.color, fontWeight: 600 }}>{st.label}</span>
                      <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '100px', background: 'var(--color-surface-2)', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                        {order.type === 'digital' ? '📱 Numérique' : '📦 Papier'}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>{order.date}</span>
                  </div>

                  {/* Livres */}
                  <div style={{ padding: '1rem 1.5rem' }}>
                    {order.items.map(item => (
                      <div key={item.title} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--color-border)' }}>
                        <span style={{ fontSize: '0.875rem', color: 'var(--color-text)', fontWeight: 500 }}>{item.title}</span>
                        <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>{item.price.toFixed(2)}€</span>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '10px' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text)' }}>Total : {order.total.toFixed(2)}€</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.5rem' }}>Aucune commande</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 500, marginBottom: '1.5rem' }}>Vous n'avez pas encore passé de commande.</p>
            <Link to="/catalogue" style={{ padding: '0.75rem 1.5rem', background: 'var(--color-primary)', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 700 }}>
              Explorer le catalogue
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}