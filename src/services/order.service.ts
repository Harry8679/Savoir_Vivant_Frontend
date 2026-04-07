import api from './api'
import { ApiResponse } from '@/types/auth.types'

export interface OrderItem {
  bookId:    string
  title:     string
  coverUrl?: string
  type:      'digital' | 'paper'
  quantity:  number
  unitPrice: number
}

export interface Order {
  _id:       string
  items:     OrderItem[]
  total:     number
  status:    'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
  address?: {
    fullName:   string
    city:       string
    postalCode: string
  }
}

export const orderService = {
  async getMyOrders(): Promise<Order[]> {
    const { data } = await api.get<ApiResponse<Order[]>>('/orders/me')
    return data.data
  },
}