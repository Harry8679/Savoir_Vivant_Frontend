// src/pages/Cart/CartPage.tsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCartStore, type CartItemType } from '../../store/cartStore'
import { useAuthStore } from '../../store/authStore'

// ─── Couverture avec fallback coloré ──────────────────────────────────────────

function CoverImage({ coverUrl, title }: { coverUrl: string; title: string }) {
  const [error, setError] = useState(false)

  if (!coverUrl || error) {
    return (
      <div className="w-full h-full bg-indigo-500 relative">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg, rgba(255,255,255,0.4) 0px, rgba(255,255,255,0.4) 1px,
              transparent 1px, transparent 7px)`,
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-1.5
                        bg-linear-to-t from-black/30 to-transparent">
          <p className="text-[8px] font-bold text-white leading-tight line-clamp-2">
            {title}
          </p>
        </div>
      </div>
    )
  }

  return (
    <img
      src={coverUrl}
      alt={title}
      className="w-full h-full object-cover"
      onError={() => setError(true)}
    />
  )
}

// ─── Page Panier ──────────────────────────────────────────────────────────────

export default function CartPage() {
  const navigate            = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const {
    items,
    removeItem,
    updateType,
    updateQuantity,
    clearCart,
    total,
  } = useCartStore()

  // ── Panier vide ──────────────────────────────────────────────────────────────

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

  const hasPhysical = items.some(i => i.type === 'paper')

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

        {/* ── Articles ─────────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-3">
          {items.map(item => {
            // ?? 1 : sécurise les anciens items sans quantity dans le localStorage
            const qty = item.quantity ?? 1

            return (
              <div
                key={`${item.bookId}-${item.type}`}
                className="flex gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm"
              >
                {/* Couverture */}
                <div className="w-16 min-w-16 h-20 rounded-xl overflow-hidden shrink-0 shadow">
                  <CoverImage coverUrl={item.coverUrl} title={item.title} />
                </div>

                {/* Infos */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 line-clamp-1 mb-0.5">
                    {item.title}
                  </p>
                  <p className="text-[10px] text-gray-400 mb-3">par {item.author}</p>

                  {/* Toggle Numérique / Papier */}
                  <div className="flex gap-1.5">
                    {(['digital', 'paper'] as CartItemType[]).map(t => (
                      <button
                        key={t}
                        onClick={() => updateType(item.bookId, t)}
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-full
                                    transition-colors ${
                          item.type === t
                            ? t === 'digital'
                              ? 'bg-indigo-500 text-white'
                              : 'bg-amber-500 text-white'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {t === 'digital' ? '📱 Numérique' : '📦 Papier'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Prix + quantité + supprimer */}
                <div className="flex flex-col items-end justify-between">

                  {/* Prix total de la ligne */}
                  <span className="text-base font-extrabold text-gray-900">
                    {(item.price * qty).toFixed(2).replace('.', ',')}€
                  </span>
                  {qty > 1 && (
                    <span className="text-[10px] text-gray-400 -mt-0.5">
                      {item.price.toFixed(2).replace('.', ',')}€ × {qty}
                    </span>
                  )}

                  <div className="flex flex-col items-end gap-1.5 mt-auto pt-2">

                    {/* Contrôle quantité — uniquement format papier */}
                    {item.type === 'paper' && (
                      <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.bookId, item.type, qty - 1)}
                          className="w-7 h-7 flex items-center justify-center text-gray-600
                                     hover:bg-gray-200 hover:text-gray-900 text-base
                                     font-bold transition-colors"
                          aria-label="Diminuer"
                        >
                          −
                        </button>
                        <span className="text-xs font-bold w-6 text-center text-gray-900">
                          {qty}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.bookId, item.type, qty + 1)}
                          className="w-7 h-7 flex items-center justify-center text-gray-600
                                     hover:bg-gray-200 hover:text-gray-900 text-base
                                     font-bold transition-colors"
                          aria-label="Augmenter"
                        >
                          +
                        </button>
                      </div>
                    )}

                    {/* Supprimer */}
                    <button
                      onClick={() => removeItem(item.bookId, item.type)}
                      className="text-gray-300 hover:text-red-400 transition-colors text-sm"
                      title="Supprimer"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            )
          })}

          <Link
            to="/catalogue"
            className="block text-sm text-indigo-500 hover:underline mt-2"
          >
            ← Continuer mes achats
          </Link>
        </div>

        {/* ── Récapitulatif ────────────────────────────────────────────── */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24">
            <h2 className="font-bold text-gray-900 mb-5 text-base">Récapitulatif</h2>

            {/* Lignes */}
            <div className="space-y-2 mb-4">
              {items.map(item => {
                const qty = item.quantity ?? 1
                return (
                  <div
                    key={`${item.bookId}-${item.type}`}
                    className="flex justify-between text-xs text-gray-500"
                  >
                    <span className="line-clamp-1 flex-1 mr-2">
                      {item.title}{' '}
                      <span className={
                        item.type === 'digital' ? 'text-indigo-400' : 'text-amber-500'
                      }>
                        ({item.type === 'digital' ? 'Num.' : 'Papier'})
                      </span>
                      {qty > 1 && (
                        <span className="text-gray-400"> ×{qty}</span>
                      )}
                    </span>
                    <span className="shrink-0 font-medium text-gray-700">
                      {(item.price * qty).toFixed(2).replace('.', ',')}€
                    </span>
                  </div>
                )
              })}
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

            {/* Promo abonnement */}
            {items.some(i => i.type === 'digital') && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 text-center mb-2">
                  Accédez à tous les livres avec l'abonnement
                </p>
                <Link
                  to="/subscription"
                  className="block w-full py-2.5 bg-indigo-50 text-indigo-600 font-semibold
                             rounded-xl text-xs text-center hover:bg-indigo-100 transition-colors"
                >
                  ∞ S'abonner pour 9€/mois
                </Link>
              </div>
            )}

            {/* Sécurité */}
            <div className="flex items-center justify-center gap-3 mt-4 text-[10px] text-gray-400">
              <span>🔒 Sécurisé</span>
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