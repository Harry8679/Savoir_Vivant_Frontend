// src/pages/Checkout/CheckoutPage.tsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../../store/cartStore'
import { useAuthStore } from '../../store/authStore'
import { addressService } from '../../services/address.service'
import { paymentService } from '../../services/payment.service'
import type { Address } from '../../types/address.types'
import api from '@/services/api'
import { Carrier } from '@/services/carrier.service'

type Step = 'livraison' | 'paiement'

const STEPS = [
  { id: 'livraison' as Step, label: 'Livraison', icon: '📦' },
  { id: 'paiement'  as Step, label: 'Paiement',  icon: '💳' },
]

// ─── Couverture avec fallback coloré ──────────────────────────────────────────

function CoverImage({ coverUrl, title }: { coverUrl: string; title: string }) {
  const [error, setError] = useState(false)

  if (!coverUrl || error) {
    return (
      <div className="w-full h-full bg-indigo-500 relative">
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg, rgba(255,255,255,0.4) 0px, rgba(255,255,255,0.4) 1px,
              transparent 1px, transparent 7px)`,
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-1
                        bg-linear-to-t from-black/30 to-transparent">
          <p className="text-[7px] font-bold text-white leading-tight line-clamp-2">
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

// ─── Récapitulatif ────────────────────────────────────────────────────────────

function OrderSummary({ shippingCost = 0 }: { shippingCost?: number }) {
  const { items, total } = useCartStore()
  const hasPhysical = items.some(i => i.type === 'paper')
  const grandTotal  = total() + (hasPhysical ? shippingCost : 0)

  return (
    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 sticky top-28">
      <h3 className="font-bold text-gray-900 mb-4 text-sm">Récapitulatif</h3>
      <div className="space-y-3 mb-4">
        {items.map(item => {
          const qty = item.quantity ?? 1
          return (
            <div key={`${item.bookId}-${item.type}`} className="flex items-center gap-3">
              {/* Couverture */}
              <div className="w-9 h-12 rounded-lg shrink-0 overflow-hidden shadow-sm">
                <CoverImage coverUrl={item.coverUrl} title={item.title} />
              </div>
              {/* Infos */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-900 line-clamp-1">
                  {item.title}
                </p>
                <p className="text-[10px] text-gray-400">
                  {item.type === 'digital' ? 'Numérique' : 'Papier'}
                  {qty > 1 && ` × ${qty}`}
                </p>
              </div>
              {/* Prix */}
              <span className="text-xs font-bold text-gray-900 shrink-0">
                {(item.price * qty).toFixed(2).replace('.', ',')}€
              </span>
            </div>
          )
        })}
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

interface NewAddressForm {
  fullName:   string
  phone:      string
  street:     string
  city:       string
  postalCode: string
  country:    string
}

const EMPTY_ADDR: NewAddressForm = {
  fullName: '', phone: '', street: '',
  city: '', postalCode: '', country: 'FR',
}

// ─── Étape 1 : Livraison ──────────────────────────────────────────────────────

function StepLivraison({
  onNext,
}: {
  onNext: (addressId: string, carrierId: string, shippingCost: number) => void
}) {
  const { items } = useCartStore()
  const hasPhysical = items.some(i => i.type === 'paper')

  const [addresses,       setAddresses]      = useState<Address[]>([])
  const [carriers,        setCarriers]        = useState<Carrier[]>([])
  const [selectedAddress, setSelectedAddress] = useState('')
  const [selectedCarrier, setSelectedCarrier] = useState('')
  const [showNewAddress,  setShowNewAddress]  = useState(false)
  const [loading,         setLoading]         = useState(true)
  const [saving,          setSaving]          = useState(false)
  const [newAddr,         setNewAddr]         = useState<NewAddressForm>(EMPTY_ADDR)

  useEffect(() => {
    Promise.all([
      addressService.getAll(),
      api.get<{ data: Carrier[] }>('/carriers').then(r => r.data.data),
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
      setNewAddr(EMPTY_ADDR)
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
    const addr = addresses.find(a => a._id === selectedAddress)
    const country = addr?.country ?? 'FR'
    const shippingPrice = carrier?.priceRules.find(r => r.country === country)?.price ?? 0
    onNext(selectedAddress, selectedCarrier, shippingPrice)
  }

  if (loading) return (
    <div className="flex justify-center py-16">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent
                      rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6">
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
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Adresse de livraison</h3>
            <div className="space-y-3">
              {addresses.map((addr: Address) => (
                <label key={addr._id}
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer
                              transition-all ${
                    selectedAddress === addr._id
                      ? 'border-indigo-400 bg-indigo-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}>
                  <input type="radio" name="address" value={addr._id}
                    checked={selectedAddress === addr._id}
                    onChange={() => setSelectedAddress(addr._id)}
                    className="mt-0.5 accent-indigo-500" />
                  <div className="text-sm">
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

              {showNewAddress ? (
                <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50 space-y-3">
                  <input placeholder="Nom complet" value={newAddr.fullName}
                    onChange={e => setNewAddr(p => ({ ...p, fullName: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm
                               bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                  <input placeholder="Rue / Adresse" value={newAddr.street}
                    onChange={e => setNewAddr(p => ({ ...p, street: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm
                               bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                  <div className="grid grid-cols-2 gap-3">
                    <input placeholder="Code postal" value={newAddr.postalCode}
                      onChange={e => setNewAddr(p => ({ ...p, postalCode: e.target.value }))}
                      className="px-3 py-2 rounded-lg border border-gray-200 text-sm
                                 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                    <input placeholder="Ville" value={newAddr.city}
                      onChange={e => setNewAddr(p => ({ ...p, city: e.target.value }))}
                      className="px-3 py-2 rounded-lg border border-gray-200 text-sm
                                 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                  </div>
                  <input placeholder="Téléphone" value={newAddr.phone}
                    onChange={e => setNewAddr(p => ({ ...p, phone: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm
                               bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                  <div className="flex gap-2">
                    <button onClick={handleSaveAddress} disabled={saving}
                      className="flex-1 py-2.5 bg-indigo-500 text-white text-sm font-semibold
                                 rounded-lg hover:bg-indigo-600 disabled:opacity-50">
                      {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                    </button>
                    <button
                      onClick={() => { setShowNewAddress(false); setNewAddr(EMPTY_ADDR) }}
                      className="px-4 py-2.5 bg-white border border-gray-200 text-sm
                                 text-gray-600 rounded-lg hover:bg-gray-50">
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setShowNewAddress(true)}
                  className="flex items-center gap-2 w-full p-4 rounded-xl border border-dashed
                             border-gray-300 text-sm text-gray-500
                             hover:border-indigo-300 hover:text-indigo-500 transition-colors">
                  <span className="text-lg">+</span> Ajouter une adresse
                </button>
              )}
            </div>
          </div>

          {carriers.length > 0 && (
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Mode de livraison</h3>
              <div className="space-y-2">
                {carriers.map(carrier => (
                  <label key={carrier._id}
                    className={`flex items-center justify-between p-4 rounded-xl border
                                cursor-pointer transition-all ${
                      selectedCarrier === carrier._id
                        ? 'border-indigo-400 bg-indigo-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="carrier" value={carrier._id}
                        checked={selectedCarrier === carrier._id}
                        onChange={() => setSelectedCarrier(carrier._id)}
                        className="accent-indigo-500" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{carrier.name}</p>
                        <p className="text-xs text-gray-500">
                          {carrier.estimatedDays.min}–{carrier.estimatedDays.max} jours ouvrés
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                      {(() => {
                        const rule = carrier.priceRules.find(r => r.country === 'FR')
                        const price = rule?.price ?? 0
                        return price === 0 ? 'Gratuit' : `${price.toFixed(2).replace('.', ',')}€`
                      })()}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <button onClick={handleNext} disabled={hasPhysical && !selectedAddress}
        className="w-full py-3.5 bg-indigo-500 text-white font-bold rounded-xl
                   hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed
                   transition-colors text-sm">
        Continuer vers le paiement →
      </button>
    </div>
  )
}

// ─── Étape 2 : Paiement ───────────────────────────────────────────────────────

function StepPaiement({
  addressId,
  carrierId,
  onBack,
}: {
  addressId: string
  carrierId: string
  onBack:    () => void
}) {
  const { items } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  const handlePay = async () => {
    setLoading(true)
    setError(null)
    try {
      const firstItem = items[0]
      if (!firstItem) return

      if (firstItem.type === 'digital') {
        await paymentService.buyDigital(firstItem.bookId)
      } else {
        await paymentService.buyPaper(firstItem.bookId, addressId, carrierId)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <button onClick={onBack}
        className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1">
        ← Modifier la livraison
      </button>

      {/* Articles */}
      <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm space-y-3">
        <h3 className="font-bold text-gray-900 text-sm">Articles</h3>
        {items.map(item => {
          const qty = item.quantity ?? 1
          return (
            <div key={`${item.bookId}-${item.type}`} className="flex items-center gap-3">
              <div className="w-10 h-12 rounded-lg shrink-0 overflow-hidden shadow-sm">
                <CoverImage coverUrl={item.coverUrl} title={item.title} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                  {item.title}
                </p>
                <p className="text-xs text-gray-400">
                  {item.type === 'digital' ? '📱 Numérique' : '📦 Papier'}
                  {qty > 1 && ` × ${qty}`}
                </p>
              </div>
              <span className="text-sm font-bold text-gray-900 shrink-0">
                {(item.price * qty).toFixed(2).replace('.', ',')}€
              </span>
            </div>
          )
        })}
      </div>

      {/* Info Stripe */}
      <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100">
        <p className="text-sm font-semibold text-indigo-700 mb-1">
          🔒 Paiement sécurisé Stripe
        </p>
        <p className="text-xs text-indigo-500">
          Vous allez être redirigé vers la page de paiement Stripe
          pour finaliser votre commande en toute sécurité.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200
                        text-sm text-red-600 flex items-center gap-2">
          <span>⚠️</span>{error}
        </div>
      )}

      <button onClick={handlePay} disabled={loading}
        className="w-full py-3.5 bg-indigo-500 text-white font-bold rounded-xl
                   hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors text-sm flex items-center justify-center gap-2">
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white
                             rounded-full animate-spin" />
            Redirection vers Stripe...
          </>
        ) : '🔒 Payer maintenant'}
      </button>

      <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
        <span>🔒 SSL</span><span>·</span>
        <span>💳 Stripe</span><span>·</span>
        <span>🛡 PCI-DSS</span>
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

  useEffect(() => {
    if (!isAuthenticated) navigate('/login')
    if (items.length === 0) navigate('/catalogue')
  }, [isAuthenticated, items.length, navigate])

  const handleLivraisonNext = (addr: string, carrier: string, cost: number) => {
    setAddressId(addr)
    setCarrierId(carrier)
    setShippingCost(cost)
    setStep('paiement')
  }

  return (
    // ↓ pt-24 pour compenser la Navbar fixe (hauteur 72px)
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-10">
      <Stepper current={step} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {step === 'livraison' && (
            <StepLivraison onNext={handleLivraisonNext} />
          )}
          {step === 'paiement' && (
            <StepPaiement
              addressId={addressId}
              carrierId={carrierId}
              onBack={() => setStep('livraison')}
            />
          )}
        </div>
        <div className="lg:col-span-1">
          <OrderSummary shippingCost={shippingCost} />
        </div>
      </div>
    </div>
  )
}