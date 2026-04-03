// src/pages/Checkout/CheckoutSuccessPage.tsx
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useCartStore } from '../../store/cartStore'

export default function CheckoutSuccessPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { clearCart } = useCartStore()
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    // Vide le panier une fois le paiement confirmé
    clearCart()
  }, [clearCart])

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center
                      justify-center text-4xl mx-auto mb-6">✅</div>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
        Commande confirmée !
      </h1>
      <p className="text-gray-500 text-sm mb-2">
        Merci pour votre achat. Un e-mail de confirmation vous a été envoyé.
      </p>
      {sessionId && (
        <p className="text-xs text-gray-400 mb-8">
          Référence : {sessionId.slice(-12).toUpperCase()}
        </p>
      )}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={() => navigate('/bibliotheque')}
          className="flex-1 py-3 bg-indigo-500 text-white font-semibold
                     rounded-xl text-sm hover:bg-indigo-600 transition-colors"
        >
          📚 Ma bibliothèque
        </button>
        <button
          onClick={() => navigate('/catalogue')}
          className="flex-1 py-3 bg-white border border-gray-200 text-gray-700
                     font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors"
        >
          Continuer mes achats
        </button>
      </div>
    </div>
  )
}