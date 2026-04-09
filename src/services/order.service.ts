// src/services/order.service.ts
import api from './api'
import type { ApiResponse } from '@/types/auth.types'

export interface OrderItem {
  bookId:    string
  title:     string
  coverUrl?: string
  type:      'digital' | 'paper'
  quantity:  number
  unitPrice: number
}

export interface Order {
  _id:         string
  items:       OrderItem[]
  totalAmount: number        // ← était "total"
  status:      'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
  createdAt:   string
  address?: {
    fullName:   string
    city:       string
    postalCode: string
  }
}

export const orderService = {
  async getMyOrders(): Promise<Order[]> {
    const { data } = await api.get<ApiResponse<Order[]>>('/orders/me')
    const result = data.data
    return Array.isArray(result)
      ? result
      : (result as unknown as { orders?: Order[] })?.orders ?? []
  },
}