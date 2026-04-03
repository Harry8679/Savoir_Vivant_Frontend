// src/pages/Checkout/CheckoutPage.tsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useCartStore } from '../../store/cartStore'
import { useAuthStore } from '../../store/authStore'
import { addressService } from '../../services/address.service'
import { paymentService } from '../../services/payment.service'
import type { Address } from '../../types/address.types'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!)

// ─── Types locaux ─────────────────────────────────────────────────────────────

interface Carrier {
  _id:   string
  name:  string
  price: number
  delay: string
}

type Step = 'livraison' | 'paiement' | 'confirmation'

const STEPS = [
  { id: 'livraison'     as Step, label: 'Livraison',     icon: '📦' },
  { id: 'paiement'      as Step, label: 'Paiement',      icon: '💳' },
  { id: 'confirmation'  as Step, label: 'Confirmation',  icon: '✅' },
]

// ─── Stepper ──────────────────────────────────────────────────────────────────

function Stepper({ current }: { current: Step }) {
  const idx = STEPS.findIndex(s => s.id === current)
  return (
    <div className="flex items-center justify-center mb-10">
      {STEPS.map((step, i) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center
                            text-base font-bold transition-all ${
              i < idx   ? 'bg-green-500 text-white'
            : i === idx ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-200'
            :             'bg-gray-100 text-gray-400'
            }`}>
              {i < idx ? '✓' : step.icon}
            </div>
            <span className={`text-xs mt-1.5 font-medium ${
              i === idx ? 'text-indigo-600' : 'text-gray-400'
            }`}>
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`w-20 h-0.5 mx-2 mb-5 transition-colors ${
              i < idx ? 'bg-green-400' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Récapitulatif commande ────────────────────────────────────────────────────
// CartItem réel : { bookId, title, coverUrl, type, price, digitalPrice, paperPrice }

function OrderSummary({ shippingCost = 0 }: { shippingCost?: number }) {
  const { items, total } = useCartStore()

  // ton CartItem utilise "type" (pas "format")
  const hasPhysical = items.some(i => i.type === 'paper')
  const grandTotal  = total() + (hasPhysical ? shippingCost : 0)

  return (
    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 sticky top-24">
      <h3 className="font-bold text-gray-900 mb-4 text-sm">Récapitulatif</h3>

      <div className="space-y-3 mb-4">
        {items.map(item => (
          <div key={`${item.bookId}-${item.type}`} className="flex items-center gap-3">
            {/* Couverture */}
            <div className="w-9 h-12 rounded-lg shrink-0 overflow-hidden">
              {item.coverUrl ? (
                <img src={item.coverUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-indigo-100" />
              )}
            </div>

            {/* Infos */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-900 line-clamp-1">
                {item.title}
              </p>
              <p className="text-[10px] text-gray-400">
                {item.type === 'digital' ? 'Numérique' : 'Papier'}
              </p>
            </div>

            {/* Prix */}
            <span className="text-xs font-bold text-gray-900 shrink-0">
              {item.price.toFixed(2).replace('.', ',')}€
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-3 space-y-1.5">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Sous-total</span>
          <span>{total().toFixed(2).replace('.', ',')}€</span>
        </div>
        {hasPhysical && (
          <div className="flex justify-between text-xs text-gray-500">
            <span>Livraison</span>
            <span>
              {shippingCost === 0
                ? "Calculée à l'étape suivante"
                : `${shippingCost.toFixed(2).replace('.', ',')}€`}
            </span>
          </div>
        )}
        <div className="flex justify-between text-sm font-extrabold text-gray-900
                        pt-1 border-t border-gray-200">
          <span>Total</span>
          <span>{grandTotal.toFixed(2).replace('.', ',')}€</span>
        </div>
      </div>
    </div>
  )
}

// ─── Formulaire nouvelle adresse ──────────────────────────────────────────────
// Address réel : { _id, fullName, phone, street, city, postalCode, country, isDefault }

interface NewAddressForm {
  fullName:   string
  phone:      string
  street:     string
  city:       string
  postalCode: string
  country:    string
}

const EMPTY_ADDRESS: NewAddressForm = {
  fullName:   '',
  phone:      '',
  street:     '',
  city:       '',
  postalCode: '',
  country:    'FR',
}

// ─── Étape 1 : Livraison ──────────────────────────────────────────────────────

function StepLivraison({
  onNext,
}: {
  onNext: (addressId: string, carrierId: string, shippingCost: number) => void
}) {
  const { items } = useCartStore()
  const hasPhysical = items.some(i => i.type === 'paper')

  const [addresses,       setAddresses]       = useState<Address[]>([])
  const [carriers,        setCarriers]         = useState<Carrier[]>([])
  const [selectedAddress, setSelectedAddress]  = useState('')
  const [selectedCarrier, setSelectedCarrier]  = useState('')
  const [showNewAddress,  setShowNewAddress]   = useState(false)
  const [loading,         setLoading]          = useState(true)
  const [saving,          setSaving]           = useState(false)
  const [newAddr,         setNewAddr]          = useState<NewAddressForm>(EMPTY_ADDRESS)

  useEffect(() => {
    Promise.all([
      addressService.getAll(),
      // Décommente si tu as un carrierService :
      // carrierService.getAll(),
      Promise.resolve([] as Carrier[]),
    ])
      .then(([addrs, cars]) => {
        setAddresses(addrs)
        setCarriers(cars)
        const def = addrs.find((a: Address) => a.isDefault)
        if (def?._id) setSelectedAddress(def._id)
        if (cars[0])  setSelectedCarrier(cars[0]._id)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSaveAddress = async () => {
    setSaving(true)
    try {
      const saved = await addressService.create(newAddr as unknown as Omit<Address, '_id'>)
      setAddresses(prev => [...prev, saved])
      setSelectedAddress(saved._id)
      setShowNewAddress(false)
      setNewAddr(EMPTY_ADDRESS)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleNext = () => {
    if (!hasPhysical) { onNext('', '', 0); return }
    if (!selectedAddress) return
    const carrier = carriers.find(c => c._id === selectedCarrier)
    onNext(selectedAddress, selectedCarrier, carrier?.price ?? 0)
  }

  if (loading) return (
    <div className="flex justify-center py-16">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent
                      rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6">

      {/* Commande 100% numérique */}
      {!hasPhysical ? (
        <div className="p-5 rounded-2xl bg-green-50 border border-green-200 text-center">
          <p className="text-2xl mb-2">📱</p>
          <p className="font-semibold text-green-700">Commande 100% numérique</p>
          <p className="text-sm text-green-600 mt-1">
            Accès immédiat après paiement — aucune livraison requise
          </p>
        </div>
      ) : (
        <>
          {/* Adresses existantes */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Adresse de livraison</h3>
            <div className="space-y-3">
              {addresses.map((addr: Address) => (
                <label
                  key={addr._id}
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer
                              transition-all ${
                    selectedAddress === addr._id
                      ? 'border-indigo-400 bg-indigo-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    value={addr._id}
                    checked={selectedAddress === addr._id}
                    onChange={() => setSelectedAddress(addr._id)}
                    className="mt-0.5 accent-indigo-500"
                  />
                  <div className="text-sm">
                    {/* Address réel : fullName, street, city, postalCode, country */}
                    <p className="font-semibold text-gray-900">{addr.fullName}</p>
                    <p className="text-gray-500">{addr.street}</p>
                    <p className="text-gray-500">
                      {addr.postalCode} {addr.city}, {addr.country}
                    </p>
                    {addr.phone && (
                      <p className="text-gray-400 text-xs mt-0.5">{addr.phone}</p>
                    )}
                  </div>
                </label>
              ))}

              {/* Nouvelle adresse */}
              {showNewAddress ? (
                <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50 space-y-3">
                  <input
                    placeholder="Nom complet"
                    value={newAddr.fullName}
                    onChange={e => setNewAddr(p => ({ ...p, fullName: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm
                               bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                  <input
                    placeholder="Rue / Adresse"
                    value={newAddr.street}
                    onChange={e => setNewAddr(p => ({ ...p, street: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm
                               bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      placeholder="Code postal"
                      value={newAddr.postalCode}
                      onChange={e => setNewAddr(p => ({ ...p, postalCode: e.target.value }))}
                      className="px-3 py-2 rounded-lg border border-gray-200 text-sm
                                 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                    <input
                      placeholder="Ville"
                      value={newAddr.city}
                      onChange={e => setNewAddr(p => ({ ...p, city: e.target.value }))}
                      className="px-3 py-2 rounded-lg border border-gray-200 text-sm
                                 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                  </div>
                  <input
                    placeholder="Téléphone"
                    value={newAddr.phone}
                    onChange={e => setNewAddr(p => ({ ...p, phone: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm
                               bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveAddress}
                      disabled={saving}
                      className="flex-1 py-2.5 bg-indigo-500 text-white text-sm font-semibold
                                 rounded-lg hover:bg-indigo-600 disabled:opacity-50"
                    >
                      {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                    </button>
                    <button
                      onClick={() => { setShowNewAddress(false); setNewAddr(EMPTY_ADDRESS) }}
                      className="px-4 py-2.5 bg-white border border-gray-200 text-sm
                                 text-gray-600 rounded-lg hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowNewAddress(true)}
                  className="flex items-center gap-2 w-full p-4 rounded-xl border border-dashed
                             border-gray-300 text-sm text-gray-500
                             hover:border-indigo-300 hover:text-indigo-500 transition-colors"
                >
                  <span className="text-lg">+</span> Ajouter une adresse
                </button>
              )}
            </div>
          </div>

          {/* Transporteurs */}
          {carriers.length > 0 && (
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Mode de livraison</h3>
              <div className="space-y-2">
                {carriers.map(carrier => (
                  <label
                    key={carrier._id}
                    className={`flex items-center justify-between p-4 rounded-xl border
                                cursor-pointer transition-all ${
                      selectedCarrier === carrier._id
                        ? 'border-indigo-400 bg-indigo-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="carrier"
                        value={carrier._id}
                        checked={selectedCarrier === carrier._id}
                        onChange={() => setSelectedCarrier(carrier._id)}
                        className="accent-indigo-500"
                      />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{carrier.name}</p>
                        <p className="text-xs text-gray-500">{carrier.delay}</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                      {carrier.price === 0
                        ? 'Gratuit'
                        : `${carrier.price.toFixed(2).replace('.', ',')}€`}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <button
        onClick={handleNext}
        disabled={hasPhysical && !selectedAddress}
        className="w-full py-3.5 bg-indigo-500 text-white font-bold rounded-xl
                   hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed
                   transition-colors text-sm"
      >
        Continuer vers le paiement →
      </button>
    </div>
  )
}

// ─── Étape 2 : Paiement Stripe ────────────────────────────────────────────────

function StripePaymentForm({
  addressId,
  carrierId,
  onSuccess,
}: {
  addressId: string
  carrierId: string
  onSuccess: (orderId: string) => void
}) {
  const stripe   = useStripe()
  const elements = useElements()
  const { items, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)
    setError(null)

    try {
      // Adapte l'appel selon les méthodes réelles de ton paymentService.
      // Exemple : paymentService.createIntent({ ... })
      // Remplace par le nom exact de ta méthode.
      const result = await (paymentService as any).createIntent?.({
        items: items.map(i => ({
          bookId: i.bookId,
          type:   i.type,       // 'digital' | 'paper'
          price:  i.price,
        })),
        addressId: addressId || undefined,
        carrierId: carrierId || undefined,
      }) ?? await (paymentService as any).createCheckoutSession?.({
        items: items.map(i => ({
          bookId: i.bookId,
          type:   i.type,
          price:  i.price,
        })),
        addressId: addressId || undefined,
        carrierId: carrierId || undefined,
      })

      const { clientSecret, orderId } = result

      // Confirmer avec Stripe
      const cardElement = elements.getElement(CardElement)
      if (!cardElement) throw new Error('Card element not found')

      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: { card: cardElement },
        })

      if (stripeError) {
        setError(stripeError.message ?? 'Erreur de paiement')
        return
      }

      if (paymentIntent?.status === 'succeeded') {
        clearCart()
        onSuccess(orderId)
      }
    } catch (err: any) {
      setError(err.message ?? err.response?.data?.message ?? 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h3 className="font-bold text-gray-900">Informations de paiement</h3>

      <div className="p-4 rounded-xl border border-gray-200 bg-white
                      focus-within:border-indigo-400 focus-within:ring-2
                      focus-within:ring-indigo-100 transition-all">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '15px',
                color: '#111827',
                fontFamily: 'system-ui, sans-serif',
                '::placeholder': { color: '#9ca3af' },
              },
              invalid: { color: '#ef4444' },
            },
            hidePostalCode: false,
          }}
        />
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200
                        text-sm text-red-600 flex items-center gap-2">
          <span>⚠️</span>{error}
        </div>
      )}

      <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
        <span>🔒 Chiffrement SSL</span>
        <span>💳 Stripe</span>
        <span>🛡 PCI-DSS</span>
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-3.5 bg-indigo-500 text-white font-bold rounded-xl
                   hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed
                   transition-colors text-sm flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white
                             rounded-full animate-spin" />
            Traitement en cours...
          </>
        ) : '🔒 Payer maintenant'}
      </button>
    </form>
  )
}

// ─── Étape 3 : Confirmation ───────────────────────────────────────────────────

function StepConfirmation({ orderId }: { orderId: string }) {
  const navigate = useNavigate()
  return (
    <div className="text-center py-10 space-y-5">
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center
                      justify-center text-4xl mx-auto">✅</div>
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
          Commande confirmée !
        </h2>
        <p className="text-gray-500 text-sm">
          Merci pour votre achat. Un e-mail de confirmation vous a été envoyé.
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Commande #{orderId.slice(-8).toUpperCase()}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
        <button
          onClick={() => navigate('/bibliotheque')}
          className="flex-1 py-3 bg-indigo-500 text-white font-semibold rounded-xl
                     text-sm hover:bg-indigo-600 transition-colors"
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

// ─── Page Checkout ────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const { items }           = useCartStore()
  const { isAuthenticated } = useAuthStore()
  const navigate            = useNavigate()

  const [step,         setStep]         = useState<Step>('livraison')
  const [addressId,    setAddressId]    = useState('')
  const [carrierId,    setCarrierId]    = useState('')
  const [shippingCost, setShippingCost] = useState(0)
  const [orderId,      setOrderId]      = useState('')

  useEffect(() => {
    if (!isAuthenticated) navigate('/connexion')
    if (items.length === 0 && step !== 'confirmation') navigate('/catalogue')
  }, [isAuthenticated, items.length, step, navigate])

  const handleLivraisonNext = (addr: string, carrier: string, cost: number) => {
    setAddressId(addr)
    setCarrierId(carrier)
    setShippingCost(cost)
    setStep('paiement')
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <Stepper current={step} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Formulaire */}
        <div className="lg:col-span-2">
          {step === 'livraison' && (
            <StepLivraison onNext={handleLivraisonNext} />
          )}

          {step === 'paiement' && (
            <div className="space-y-4">
              <button
                onClick={() => setStep('livraison')}
                className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1"
              >
                ← Modifier la livraison
              </button>
              <Elements stripe={stripePromise}>
                <StripePaymentForm
                  addressId={addressId}
                  carrierId={carrierId}
                  onSuccess={id => { setOrderId(id); setStep('confirmation') }}
                />
              </Elements>
            </div>
          )}

          {step === 'confirmation' && <StepConfirmation orderId={orderId} />}
        </div>

        {/* Récapitulatif */}
        {step !== 'confirmation' && (
          <div className="lg:col-span-1">
            <OrderSummary shippingCost={shippingCost} />
          </div>
        )}
      </div>
    </div>
  )
}