import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { addressService, carrierService } from '@services/address.service'
import { bookService } from '@services/book.service'
import { Address, Carrier, COUNTRIES } from '@/types/address.types'
import { Book } from '@/types/book.types'

export default function CheckoutPage() {
  const [searchParams]  = useSearchParams()
  const navigate        = useNavigate()
  const bookId          = searchParams.get('bookId') ?? ''

  const [book, setBook]             = useState<Book | null>(null)
  const [addresses, setAddresses]   = useState<Address[]>([])
  const [carriers, setCarriers]     = useState<Carrier[]>([])
  const [selectedAddress, setSelectedAddress] = useState<string>('')
  const [selectedCarrier, setSelectedCarrier] = useState<string>('')
  const [selectedCountry, setSelectedCountry] = useState<string>('FR')
  const [step, setStep]             = useState<'address' | 'carrier' | 'summary'>('address')
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    if (!bookId) { navigate('/catalogue'); return }
    Promise.all([
      bookService.getById(bookId),
      addressService.getAll(),
    ]).then(([b, addrs]) => {
      setBook(b)
      setAddresses(addrs)
      const def = addrs.find(a => a.isDefault)
      if (def) { setSelectedAddress(def._id); setSelectedCountry(def.country) }
    }).finally(() => setLoading(false))
  }, [bookId, navigate])

  useEffect(() => {
    if (selectedCountry) {
      carrierService.getByCountry(selectedCountry).then(setCarriers)
    }
  }, [selectedCountry])

  const selectedCarrierObj = carriers.find(c => c._id === selectedCarrier)
  const selectedAddressObj = addresses.find(a => a._id === selectedAddress)
  const deliveryPrice = selectedCarrierObj?.priceRules.find(r => r.country === selectedCountry)?.price ?? 0
  const total = (book?.paperPrice ?? 0) + deliveryPrice

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', paddingTop: '72px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Chargement...</span>
    </div>
  )

  if (!book) return null

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', paddingTop: '72px' }}>

      {/* Header */}
      <div style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', padding: '1rem 3rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to={`/catalogue/${book.slug}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', color: 'var(--color-text-muted)', textDecoration: 'none', fontWeight: 600 }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Retour
          </Link>

          {/* Étapes */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {[
              { key: 'address', label: 'Adresse' },
              { key: 'carrier', label: 'Livraison' },
              { key: 'summary', label: 'Récapitulatif' },
            ].map((s, i) => (
              <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: step === s.key ? 'var(--color-primary)' : 'var(--color-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: step === s.key ? '#fff' : 'var(--color-text-muted)' }}>
                    {i + 1}
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: step === s.key ? 700 : 500, color: step === s.key ? 'var(--color-text)' : 'var(--color-text-muted)' }}>
                    {s.label}
                  </span>
                </div>
                {i < 2 && <div style={{ width: '24px', height: '1px', background: 'var(--color-border)' }} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2.5rem 3rem', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>

        {/* Panneau gauche — étapes */}
        <div>

          {/* ÉTAPE 1 — Adresse */}
          {step === 'address' && (
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '1.75rem' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '1.5rem' }}>
                Adresse de livraison
              </h2>

              {addresses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', border: '2px dashed var(--color-border)', borderRadius: '12px' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📍</div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 500, marginBottom: '1rem' }}>
                    Aucune adresse enregistrée
                  </p>
                  <Link to="/settings/addresses"
                    style={{ padding: '0.6rem 1.25rem', background: 'var(--color-primary)', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 700 }}>
                    Ajouter une adresse
                  </Link>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.25rem' }}>
                    {addresses.map(addr => (
                      <label key={addr._id}
                        style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '1rem 1.25rem', border: `1px solid ${selectedAddress === addr._id ? 'var(--color-primary)' : 'var(--color-border)'}`, borderRadius: '12px', cursor: 'pointer', background: selectedAddress === addr._id ? 'rgba(99,102,241,0.04)' : 'transparent', transition: 'all 0.15s' }}>
                        <input type="radio" name="address" value={addr._id} checked={selectedAddress === addr._id}
                          onChange={() => { setSelectedAddress(addr._id); setSelectedCountry(addr.country) }}
                          style={{ marginTop: '3px', accentColor: 'var(--color-primary)', flexShrink: 0 }} />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text)' }}>{addr.fullName}</span>
                            {addr.isDefault && (
                              <span style={{ fontSize: '0.68rem', padding: '1px 7px', borderRadius: '100px', background: 'rgba(99,102,241,0.1)', color: 'var(--color-primary)', fontWeight: 700 }}>
                                Par défaut
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: 500, lineHeight: 1.6 }}>
                            {addr.street}, {addr.postalCode} {addr.city}<br />
                            {COUNTRIES.find(c => c.code === addr.country)?.label ?? addr.country} · {addr.phone}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>

                  <Link to="/settings/addresses"
                    style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>
                    + Ajouter une nouvelle adresse
                  </Link>

                  <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={() => setStep('carrier')} disabled={!selectedAddress}
                      style={{ padding: '0.75rem 2rem', background: selectedAddress ? 'var(--color-primary)' : 'var(--color-surface-2)', color: selectedAddress ? '#fff' : 'var(--color-text-muted)', border: 'none', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 700, cursor: selectedAddress ? 'pointer' : 'not-allowed', fontFamily: 'var(--font-body)', transition: 'all 0.2s' }}>
                      Continuer →
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ÉTAPE 2 — Transporteur */}
          {step === 'carrier' && (
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '1.75rem' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
                Mode de livraison
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 500, marginBottom: '1.5rem' }}>
                Livraison vers : <strong style={{ color: 'var(--color-text)' }}>{COUNTRIES.find(c => c.code === selectedCountry)?.label}</strong>
              </p>

              {carriers.length === 0 ? (
                <div style={{ padding: '2rem', background: 'var(--color-surface-2)', borderRadius: '12px', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                    Aucun transporteur disponible pour ce pays.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.5rem' }}>
                  {carriers.map(carrier => {
                    const price = carrier.priceRules.find(r => r.country === selectedCountry)?.price ?? 0
                    return (
                      <label key={carrier._id}
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem 1.25rem', border: `1px solid ${selectedCarrier === carrier._id ? 'var(--color-primary)' : 'var(--color-border)'}`, borderRadius: '12px', cursor: 'pointer', background: selectedCarrier === carrier._id ? 'rgba(99,102,241,0.04)' : 'transparent', transition: 'all 0.15s' }}>
                        <input type="radio" name="carrier" value={carrier._id} checked={selectedCarrier === carrier._id}
                          onChange={() => setSelectedCarrier(carrier._id)}
                          style={{ accentColor: 'var(--color-primary)', flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '3px' }}>{carrier.name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                            {carrier.estimatedDays.min}–{carrier.estimatedDays.max} jours ouvrés
                          </div>
                        </div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 800, color: 'var(--color-text)' }}>
                          {price === 0 ? 'Gratuit' : `${price.toFixed(2)}€`}
                        </div>
                      </label>
                    )
                  })}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={() => setStep('address')}
                  style={{ padding: '0.75rem 1.5rem', background: 'transparent', border: '1px solid var(--color-border)', borderRadius: '10px', color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                  ← Retour
                </button>
                <button onClick={() => setStep('summary')} disabled={!selectedCarrier}
                  style={{ padding: '0.75rem 2rem', background: selectedCarrier ? 'var(--color-primary)' : 'var(--color-surface-2)', color: selectedCarrier ? '#fff' : 'var(--color-text-muted)', border: 'none', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 700, cursor: selectedCarrier ? 'pointer' : 'not-allowed', fontFamily: 'var(--font-body)', transition: 'all 0.2s' }}>
                  Continuer →
                </button>
              </div>
            </div>
          )}

          {/* ÉTAPE 3 — Récapitulatif */}
          {step === 'summary' && (
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '1.75rem' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '1.5rem' }}>
                Récapitulatif de la commande
              </h2>

              {/* Adresse */}
              <div style={{ padding: '1rem', background: 'var(--color-surface-2)', borderRadius: '10px', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Livraison à</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '3px' }}>{selectedAddressObj?.fullName}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                  {selectedAddressObj?.street}, {selectedAddressObj?.postalCode} {selectedAddressObj?.city}<br />
                  {COUNTRIES.find(c => c.code === selectedAddressObj?.country)?.label}
                </div>
              </div>

              {/* Transporteur */}
              <div style={{ padding: '1rem', background: 'var(--color-surface-2)', borderRadius: '10px', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Transporteur</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text)' }}>{selectedCarrierObj?.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                      {selectedCarrierObj?.estimatedDays.min}–{selectedCarrierObj?.estimatedDays.max} jours ouvrés
                    </div>
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '0.9rem' }}>
                    {deliveryPrice === 0 ? 'Gratuit' : `${deliveryPrice.toFixed(2)}€`}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={() => setStep('carrier')}
                  style={{ padding: '0.75rem 1.5rem', background: 'transparent', border: '1px solid var(--color-border)', borderRadius: '10px', color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                  ← Retour
                </button>
                <button
                  style={{ padding: '0.75rem 2rem', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)' }}
                  onClick={() => alert('Stripe bientôt intégré !')}>
                  Payer {total.toFixed(2)}€
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Panneau droit — résumé commande */}
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '1.5rem', position: 'sticky', top: '100px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--color-border)' }}>
            Votre commande
          </h3>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '1.25rem' }}>
            <div style={{ width: '60px', height: '80px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--color-primary), #4338ca)', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '4px' }}>{book.title}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>par {book.author}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 500, marginTop: '4px' }}>📦 Version papier</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>Livre papier</span>
              <span style={{ color: 'var(--color-text)', fontWeight: 600 }}>{book.paperPrice.toFixed(2)}€</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>Livraison</span>
              <span style={{ color: 'var(--color-text)', fontWeight: 600 }}>
                {selectedCarrier ? (deliveryPrice === 0 ? 'Gratuit' : `${deliveryPrice.toFixed(2)}€`) : '—'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid var(--color-border)' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 800, color: 'var(--color-text)' }}>Total</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-text)' }}>{total.toFixed(2)}€</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}