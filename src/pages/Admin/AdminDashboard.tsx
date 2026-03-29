import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '@services/api'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalBooks: 0, totalOrders: 0 })

  useEffect(() => {
    api.get('/admin/stats').then(r => setStats(r.data.data)).catch(() => {})
  }, [])

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 900, color: 'var(--color-text)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
        Dashboard
      </h1>
      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 500, marginBottom: '2rem' }}>
        Vue d'ensemble de SavoirVivant
      </p>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        {[
          { label: 'Livres publiés', value: stats.totalBooks, color: 'var(--color-primary)', icon: '📚', href: '/admin/books' },
          { label: 'Commandes', value: stats.totalOrders, color: '#0d9488', icon: '📦', href: '/admin/orders' },
          { label: 'Collections', value: 4, color: '#f59e0b', icon: '🗂️', href: '/admin/collections' },
          { label: 'Transporteurs', value: 0, color: '#db2777', icon: '🚚', href: '/admin/carriers' },
        ].map(stat => (
          <Link key={stat.label} to={stat.href} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '14px', padding: '1.5rem', textDecoration: 'none', display: 'block', position: 'relative', overflow: 'hidden', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = stat.color; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.transform = 'translateY(0)' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: stat.color }} />
            <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{stat.icon}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900, color: stat.color, marginBottom: '4px' }}>{stat.value}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* Actions rapides */}
      <div style={{ marginBottom: '1rem', fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Actions rapides</div>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Link to="/admin/books/new" style={{ padding: '0.75rem 1.5rem', background: 'var(--color-primary)', color: '#fff', borderRadius: '10px', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', transition: 'background 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-primary-hover)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-primary)')}>
          + Ajouter un livre
        </Link>
        <Link to="/admin/collections" style={{ padding: '0.75rem 1.5rem', background: 'transparent', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)', borderRadius: '10px', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600, transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-primary)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-muted)' }}>
          Gérer les collections
        </Link>
        <Link to="/admin/carriers" style={{ padding: '0.75rem 1.5rem', background: 'transparent', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)', borderRadius: '10px', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600, transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#0d9488'; e.currentTarget.style.color = '#0d9488' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-muted)' }}>
          Gérer les transporteurs
        </Link>
      </div>
    </div>
  )
}