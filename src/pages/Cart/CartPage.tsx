import { Link, useNavigate } from 'react-router-dom'
import { useCartStore } from '../../store/cartStore'
import { useAuthStore } from '../../store/authStore'

export default function CartPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    total,
  } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
          Votre panier est vide
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Ajoutez des livres depuis le catalogue pour commencer.
        </p>
        <Link
          to="/catalogue"
          className="inline-block px-6 py-3 bg-indigo-500 text-white font-semibold
                     rounded-xl hover:bg-indigo-600 transition-colors"
        >
          Parcourir le catalogue →
        </Link>
      </div>
    )
  }

  const hasPhysical = items.some(i => i.format === 'paper')

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

      {/* En-tête */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">
          Mon panier{' '}
          <span className="text-base font-normal text-gray-400">
            ({items.length} article{items.length > 1 ? 's' : ''})
          </span>
        </h1>
        <button
          onClick={clearCart}
          className="text-sm text-red-400 hover:text-red-600 transition-colors"
        >
          Vider le panier
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Liste des articles ──────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-3">
          {items.map(item => {
            const unitPrice = item.format === 'digital'
              ? item.book.digitalPrice
              : item.book.paperPrice

            return (
              <div
                key={`${item.book._id}-${item.format}`}
                className="flex gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm"
              >
                {/* Couverture */}
                <div className="w-16 min-w-16 h-20 rounded-xl overflow-hidden flex-shrink-0 shadow">
                  {item.book.coverUrl ? (
                    <img
                      src={item.book.coverUrl}
                      alt={item.book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full"
                      style={{
                        background: `${item.book.collectionId?.color ?? '#6366f1'}22`,
                        borderLeft: `3px solid ${item.book.collectionId?.color ?? '#6366f1'}`,
                      }}
                    />
                  )}
                </div>

                {/* Infos */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 line-clamp-1 mb-0.5">
                    {item.book.title}
                  </p>
                  <p className="text-[10px] text-gray-400 mb-2">
                    par {item.book.author}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      item.format === 'digital'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {item.format === 'digital' ? '📱 Numérique' : '📦 Papier'}
                    </span>
                  </div>
                </div>

                {/* Prix + quantité */}
                <div className="flex flex-col items-end justify-between gap-2">
                  <span className="text-base font-extrabold text-gray-900">
                    {(unitPrice * item.quantity).toFixed(2).replace('.', ',')}€
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Contrôle quantité — uniquement pour le papier */}
                    {item.format === 'paper' && (
                      <div className="flex items-center gap-1.5 bg-gray-100 rounded-lg px-1">
                        <button
                          onClick={() => updateQuantity(item.book._id, item.format, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-gray-600
                                     hover:text-gray-900 text-sm font-bold"
                        >
                          −
                        </button>
                        <span className="text-xs font-semibold w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.book._id, item.format, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-gray-600
                                     hover:text-gray-900 text-sm font-bold"
                        >
                          +
                        </button>
                      </div>
                    )}

                    {/* Supprimer */}
                    <button
                      onClick={() => removeFromCart(item.book._id, item.format)}
                      className="text-gray-300 hover:text-red-400 transition-colors text-sm"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Lien continuer shopping */}
          <Link
            to="/catalogue"
            className="block text-sm text-indigo-500 hover:underline mt-2"
          >
            ← Continuer mes achats
          </Link>
        </div>

        {/* ── Récapitulatif ───────────────────────────────────────────────── */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24">
            <h2 className="font-bold text-gray-900 mb-5 text-base">
              Récapitulatif
            </h2>

            {/* Lignes prix */}
            <div className="space-y-2 mb-4">
              {items.map(item => (
                <div
                  key={`${item.book._id}-${item.format}`}
                  className="flex justify-between text-xs text-gray-500"
                >
                  <span className="line-clamp-1 flex-1 mr-2">
                    {item.book.title} ({item.format === 'digital' ? 'Num.' : 'Papier'})
                    {item.quantity > 1 && ` ×${item.quantity}`}
                  </span>
                  <span className="flex-shrink-0 font-medium text-gray-700">
                    {((item.format === 'digital'
                      ? item.book.digitalPrice
                      : item.book.paperPrice) * item.quantity
                    ).toFixed(2).replace('.', ',')}€
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-3 mb-5">
              {hasPhysical && (
                <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                  <span>Livraison</span>
                  <span className="text-gray-400">Calculée à l'étape suivante</span>
                </div>
              )}
              <div className="flex justify-between font-extrabold text-gray-900 text-base">
                <span>Total</span>
                <span>{total().toFixed(2).replace('.', ',')}€</span>
              </div>
            </div>

            {/* CTA */}
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-3.5 bg-indigo-500 text-white font-bold rounded-xl
                           hover:bg-indigo-600 transition-colors text-sm"
              >
                Commander →
              </button>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/connexion"
                  className="block w-full py-3.5 bg-indigo-500 text-white font-bold
                             rounded-xl text-sm text-center hover:bg-indigo-600 transition-colors"
                >
                  Connexion pour commander
                </Link>
                <Link
                  to="/inscription"
                  className="block w-full py-2.5 bg-white border border-gray-200 text-gray-700
                             font-semibold rounded-xl text-sm text-center hover:bg-gray-50"
                >
                  Créer un compte
                </Link>
              </div>
            )}

            {/* Abonnement si des num dans le panier */}
            {items.some(i => i.format === 'digital' && i.book.isAvailableInSubscription) && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 text-center mb-2">
                  Ces livres sont inclus dans l'abonnement
                </p>
                <Link
                  to="/abonnement"
                  className="block w-full py-2.5 bg-indigo-50 text-indigo-600 font-semibold
                             rounded-xl text-xs text-center hover:bg-indigo-100 transition-colors"
                >
                  ∞ S'abonner pour 9€/mois
                </Link>
              </div>
            )}

            {/* Sécurité */}
            <div className="flex items-center justify-center gap-3 mt-4 text-[10px] text-gray-400">
              <span>🔒 Paiement sécurisé</span>
              <span>·</span>
              <span>💳 Stripe</span>
              <span>·</span>
              <span>↩ 14j</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}