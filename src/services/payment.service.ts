// src/services/payment.service.ts
import api from './api'

export const paymentService = {

  // ── Stripe ──────────────────────────────────────────────────────────────────

  async buyDigital(bookId: string): Promise<void> {
    const { data } = await api.post('/payments/checkout/digital', { bookId })
    window.location.href = data.data.url
  },

  async buyPaper(bookId: string, addressId: string, carrierId: string): Promise<void> {
    const { data } = await api.post('/payments/checkout/paper', {
      bookId, addressId, carrierId,
    })
    window.location.href = data.data.url
  },

  async subscribe(plan: 'monthly' | 'yearly'): Promise<void> {
    const { data } = await api.post('/payments/checkout/subscription', { plan })
    window.location.href = data.data.url
  },

  async cancelSubscription(): Promise<void> {
    await api.delete('/payments/subscription')
  },

  // ── PayPal ──────────────────────────────────────────────────────────────────

  async buyDigitalPaypal(bookId: string): Promise<void> {
    const { data } = await api.post('/payments/paypal/checkout/digital', { bookId })  // ← /checkout/ ajouté
    window.location.href = data.data.url
  },

  async buyPaperPaypal(bookId: string, addressId: string, carrierId: string): Promise<void> {
    const { data } = await api.post('/payments/paypal/checkout/paper', {  // ← /checkout/ ajouté
      bookId, addressId, carrierId,
    })
    window.location.href = data.data.url
  },

  async buyCart(
    items: { bookId: string; type: 'digital' | 'paper'; quantity: number }[],
    addressId?: string,
    carrierId?: string,
  ): Promise<void> {
    const { data } = await api.post('/payments/checkout/cart', {
      items, addressId, carrierId,
    })
    window.location.href = data.data.url
  },

  async buyCartPaypal(
  items: { bookId: string; type: 'digital' | 'paper'; quantity: number }[],
  addressId?: string,
  carrierId?: string,
): Promise<void> {
  const { data } = await api.post('/payments/paypal/checkout/cart', { items, addressId, carrierId })
  window.location.href = data.data.url
},

async capturePaypal(token: string): Promise<void> {
  await api.post(`/payments/paypal/capture?token=${token}`)
},
}