// src/pages/Orders/OrdersPage.tsx
import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'
import { orderService } from '../../services/order.service'

// ─── Types alignés sur ton backend ────────────────────────────────────────────
// Address réel : { fullName, street, city, postalCode, country }
// OrderItem    : adapte selon ce que retourne ton order.service

type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'

interface OrderItem {
  bookId:    string
  title:     string
  coverUrl?: string
  type:      'digital' | 'paper'   // ton CartItem utilise "type" pas "format"
  quantity:  number
  unitPrice: number
}

interface Order {
  _id:       string
  items:     OrderItem[]
  total:     number
  status:    OrderStatus
  createdAt: string
  address?: {
    fullName:   string   // ton Address réel utilise fullName
    city:       string
    postalCode: string
  }
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string }> = {
  pending:   { label: 'En attente', color: 'bg-amber-100 text-amber-700'   },
  paid:      { label: 'Payée',      color: 'bg-blue-100 text-blue-700'     },
  shipped:   { label: 'Expédiée',   color: 'bg-indigo-100 text-indigo-700' },
  delivered: { label: 'Livrée',     color: 'bg-green-100 text-green-700'   },
  cancelled: { label: 'Annulée',    color: 'bg-red-100 text-red-700'       },
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OrdersPage() {
  const { isAuthenticated }   = useAuthStore()
  const { clearCart }         = useCartStore()
  const navigate              = useNavigate()
  const [searchParams]        = useSearchParams()

  const [orders,  setOrders]  = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)

  // Détecte le retour depuis Stripe (?payment=success)
  const paymentSuccess = searchParams.get('payment') === 'success'

  useEffect(() => {
    if (paymentSuccess) clearCart()
  }, [paymentSuccess, clearCart])

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return }

    orderService.getMyOrders()
      // .then(data => setOrders(data as Order[]))
      // .then((data: Order[]) => setOrders(data))
      orderService.getMyOrders()
      .then((data: unknown) => {
        const list = Array.isArray(data) ? data : (data as any)?.orders ?? []
        setOrders(list as Order[])
      })
      .catch(() => setError('Impossible de charger vos commandes.'))
      .finally(() => setLoading(false))
  }, [isAuthenticated, navigate])

  // ─── Loading ───────────────────────────────────────────────────────────────

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

  // ─── Erreur ────────────────────────────────────────────────────────────────

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 bg-indigo-500 text-white font-semibold rounded-xl
                     text-sm hover:bg-indigo-600 transition-colors"
        >
          Réessayer
        </button>
      </div>
    )
  }

  // ─── Aucune commande ───────────────────────────────────────────────────────

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
        <button
          onClick={() => navigate('/catalogue')}
          className="px-6 py-2.5 bg-indigo-500 text-white font-semibold
                     rounded-xl text-sm hover:bg-indigo-600 transition-colors"
        >
          Découvrir les livres →
        </button>
      </div>
    )
  }

  // ─── Liste des commandes ───────────────────────────────────────────────────

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

      {/* Banner paiement confirmé */}
      {paymentSuccess && (
        <div className="mb-6 p-4 rounded-2xl bg-green-50 border border-green-200
                        flex items-center gap-3">
          <span className="text-2xl">✅</span>
          <div>
            <p className="font-bold text-green-700">Commande confirmée !</p>
            <p className="text-sm text-green-600">
              Votre paiement a été accepté. Vous retrouvez votre commande ci-dessous.
            </p>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Mes commandes</h1>

      <div className="space-y-3">
        {orders.map(order => {
          const status = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending

          return (
            <div
              key={order._id}
              className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm"
            >
              {/* Header */}
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
                  <div
                    key={i}
                    className="flex items-center gap-2 text-xs text-gray-600
                               bg-gray-50 rounded-lg px-2.5 py-1.5"
                  >
                    {item.coverUrl ? (
                      <img
                        src={item.coverUrl}
                        alt=""
                        className="w-5 h-6 rounded object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-5 h-6 rounded bg-indigo-100 shrink-0" />
                    )}
                    <span className="font-medium line-clamp-1 max-w-32">{item.title}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                      item.type === 'digital'
                        ? 'bg-indigo-100 text-indigo-600'
                        : 'bg-amber-100 text-amber-600'
                    }`}>
                      {item.type === 'digital' ? 'Num.' : 'Papier'}
                    </span>
                    {item.quantity > 1 && (
                      <span className="text-gray-400">×{item.quantity}</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Adresse de livraison */}
              {order.address && (
                <p className="text-xs text-gray-400 mt-3">
                  📦 Livré à {order.address.fullName}, {order.address.city}
                </p>
              )}

              {/* Lien bibliothèque si numérique payé */}
              {(order.status === 'paid' || order.status === 'delivered') &&
                order.items.some(i => i.type === 'digital') && (
                  <div className="mt-3 pt-3 border-t border-gray-50">
                    <button
                      onClick={() => navigate('/library')}
                      className="text-xs font-semibold text-indigo-500 hover:underline"
                    >
                      📖 Accéder aux livres numériques →
                    </button>
                  </div>
                )}
            </div>
          )
        })}
      </div>
    </div>
  )
}