// src/pages/Orders/OrdersPage.tsx
import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'
import { orderService } from '../../services/order.service'

type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'

interface OrderItem {
  bookId:    string
  title:     string
  coverUrl?: string
  type:      'digital' | 'paper'
  quantity:  number
  price:     number
}

interface Order {
  _id:         string
  items:       OrderItem[]
  totalAmount: number
  status:      OrderStatus
  createdAt:   string
  shippingAddress?: {
    fullName:   string
    city:       string
    postalCode: string
  }
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: string }> = {
  pending:   { label: 'En attente', color: 'bg-amber-100 text-amber-700 border-amber-200',   icon: '⏳' },
  paid:      { label: 'Payée',      color: 'bg-blue-100 text-blue-700 border-blue-200',      icon: '✅' },
  shipped:   { label: 'Expédiée',   color: 'bg-indigo-100 text-indigo-700 border-indigo-200',icon: '🚚' },
  delivered: { label: 'Livrée',     color: 'bg-green-100 text-green-700 border-green-200',   icon: '📬' },
  cancelled: { label: 'Annulée',    color: 'bg-red-100 text-red-700 border-red-200',         icon: '❌' },
}

export default function OrdersPage() {
  const { isAuthenticated } = useAuthStore()
  const { clearCart }       = useCartStore()
  const navigate            = useNavigate()
  const [searchParams]      = useSearchParams()

  const [orders,   setOrders]   = useState<Order[]>([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState<string | null>(null)
  const [hydrated, setHydrated] = useState(false)

  const paymentSuccess = searchParams.get('payment') === 'success'

  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => setHydrated(true))
    if (useAuthStore.persist.hasHydrated()) setHydrated(true)
    return () => unsub()
  }, [])

  useEffect(() => {
    if (paymentSuccess) clearCart()
  }, [paymentSuccess, clearCart])

  useEffect(() => {
    if (!hydrated) return
    if (!isAuthenticated) { navigate('/login'); return }
    orderService.getMyOrders()
      .then((data: unknown) => {
        const list = Array.isArray(data)
          ? data
          : (data as Record<string, unknown>)?.orders ?? []
        setOrders(list as Order[])
      })
      .catch(() => setError('Impossible de charger vos commandes.'))
      .finally(() => setLoading(false))
  }, [hydrated, isAuthenticated, navigate])

  // ─── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-8 space-y-4">
        <div className="h-8 w-44 bg-gray-200 rounded-lg animate-pulse mb-6" />
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    )
  }

  // ─── Erreur ────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 pt-24 pb-20 text-center">
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
      <div className="max-w-2xl mx-auto px-4 pt-24 pb-20 text-center">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center
                        justify-center text-4xl mx-auto mb-6">📦</div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Aucune commande</h1>
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-8">

      {/* Banner paiement confirmé */}
      {paymentSuccess && (
        <div className="mb-6 p-4 rounded-2xl bg-green-50 border border-green-200
                        flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center
                          justify-center text-xl shrink-0">✅</div>
          <div>
            <p className="font-bold text-green-700">Commande confirmée !</p>
            <p className="text-sm text-green-600">
              Votre paiement a été accepté. Vous retrouvez votre commande ci-dessous.
            </p>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Mes commandes</h1>

      <div className="space-y-4">
        {orders.map(order => {
          const status = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending
          const hasDigital = order.items.some(i => i.type === 'digital')

          return (
            <div
              key={order._id}
              className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden"
            >
              {/* Header commande */}
              <div className="flex items-center justify-between px-5 py-4
                              border-b border-gray-50 bg-gray-50/60">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-xs font-mono font-bold text-gray-500">
                      #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'long', year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full
                                   border ${status.color}`}>
                    {status.icon} {status.label}
                  </span>
                  <span className="text-base font-extrabold text-gray-900">
                    {order.totalAmount.toFixed(2).replace('.', ',')} €
                  </span>
                </div>
              </div>

              {/* Articles */}
              <div className="divide-y divide-gray-50">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 px-5 py-3.5">

                    {/* Cover */}
                    <div className="w-10 h-14 rounded-lg overflow-hidden shrink-0
                                    bg-indigo-50 flex items-center justify-center">
                      {item.coverUrl ? (
                        <img
                          src={item.coverUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-lg">📖</span>
                      )}
                    </div>

                    {/* Infos */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {item.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          item.type === 'digital'
                            ? 'bg-indigo-100 text-indigo-600'
                            : 'bg-amber-100 text-amber-600'
                        }`}>
                          {item.type === 'digital' ? '📱 Numérique' : '📦 Papier'}
                        </span>
                        {item.quantity > 1 && (
                          <span className="text-xs text-gray-400">× {item.quantity}</span>
                        )}
                      </div>
                    </div>

                    {/* Prix */}
                    <p className="text-sm font-bold text-gray-700 shrink-0">
                      {(item.price * item.quantity).toFixed(2).replace('.', ',')} €
                    </p>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-gray-50 bg-gray-50/40
                              flex items-center justify-between flex-wrap gap-2">

                {/* Adresse */}
                {order.shippingAddress ? (
                  <p className="text-xs text-gray-400">
                    📍 {order.shippingAddress.fullName} — {order.shippingAddress.city}{' '}
                    {order.shippingAddress.postalCode}
                  </p>
                ) : (
                  <span />
                )}

                {/* CTA bibliothèque */}
                {(order.status === 'paid' || order.status === 'delivered') && hasDigital && (
                  <button
                    onClick={() => navigate('/library')}
                    className="text-xs font-semibold text-indigo-500 hover:text-indigo-700
                               flex items-center gap-1 transition-colors"
                  >
                    📚 Accéder à ma bibliothèque →
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}