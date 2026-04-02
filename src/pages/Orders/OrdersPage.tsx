// ─── OrdersPage.tsx ─────────────────────────────────────────────────────────
// Chemin : src/pages/Orders/OrdersPage.tsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

// ─── Types ordre (à adapter selon ton backend) ────────────────────────────────

type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'

interface OrderItem {
  bookId:    string
  title:     string
  coverUrl?: string
  format:    'digital' | 'paper'
  quantity:  number
  unitPrice: number
}

interface Order {
  _id:        string
  items:      OrderItem[]
  total:      number
  status:     OrderStatus
  createdAt:  string
  address?: {
    firstName: string
    lastName:  string
    city:      string
  }
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string }> = {
  pending:   { label: 'En attente',  color: 'bg-amber-100 text-amber-700' },
  paid:      { label: 'Payée',       color: 'bg-blue-100 text-blue-700' },
  shipped:   { label: 'Expédiée',    color: 'bg-indigo-100 text-indigo-700' },
  delivered: { label: 'Livrée',      color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Annulée',     color: 'bg-red-100 text-red-700' },
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OrdersPage() {
  const { isAuthenticated } = useAuthStore()
  const navigate            = useNavigate()
  const [orders,  setOrders]  = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) { navigate('/connexion'); return }

    // Remplace par ton service réel :
    // orderService.getOrders().then(setOrders).finally(() => setLoading(false))
    setLoading(false) // temporaire
  }, [isAuthenticated, navigate])

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-3">
        <div className="h-7 w-40 bg-gray-200 rounded animate-pulse mb-6" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">📦</div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
          Aucune commande
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Vos commandes apparaîtront ici une fois passées.
        </p>
        <button onClick={() => navigate('/catalogue')}
          className="px-6 py-2.5 bg-indigo-500 text-white font-semibold
                     rounded-xl text-sm hover:bg-indigo-600 transition-colors">
          Découvrir les livres →
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Mes commandes</h1>

      <div className="space-y-3">
        {orders.map(order => {
          const status = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending

          return (
            <div key={order._id}
              className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">

              {/* Header commande */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs font-mono text-gray-400">
                    #{order._id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.color}`}>
                    {status.label}
                  </span>
                  <span className="text-base font-extrabold text-gray-900">
                    {order.total.toFixed(2).replace('.', ',')}€
                  </span>
                </div>
              </div>

              {/* Articles */}
              <div className="flex flex-wrap gap-2">
                {order.items.map((item, i) => (
                  <div key={i}
                    className="flex items-center gap-2 text-xs text-gray-600
                               bg-gray-50 rounded-lg px-2.5 py-1.5">
                    {item.coverUrl ? (
                      <img src={item.coverUrl} alt=""
                        className="w-5 h-6 rounded object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-5 h-6 rounded bg-indigo-100 flex-shrink-0" />
                    )}
                    <span className="font-medium line-clamp-1 max-w-32">{item.title}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                      item.format === 'digital'
                        ? 'bg-indigo-100 text-indigo-600'
                        : 'bg-amber-100 text-amber-600'
                    }`}>
                      {item.format === 'digital' ? 'Num.' : 'Papier'}
                    </span>
                    {item.quantity > 1 && (
                      <span className="text-gray-400">×{item.quantity}</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Livraison */}
              {order.address && (
                <p className="text-xs text-gray-400 mt-3">
                  📦 Livré à {order.address.firstName} {order.address.lastName},{' '}
                  {order.address.city}
                </p>
              )}

              {/* Actions selon statut */}
              {order.status === 'paid' || order.status === 'delivered' ? (
                <div className="mt-3 pt-3 border-t border-gray-50">
                  {order.items.some(i => i.format === 'digital') && (
                    <button
                      onClick={() => navigate('/bibliotheque')}
                      className="text-xs font-semibold text-indigo-500 hover:underline">
                      📖 Accéder aux livres numériques →
                    </button>
                  )}
                </div>
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}