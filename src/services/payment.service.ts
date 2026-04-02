import api from './api'

export const paymentService = {
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
}