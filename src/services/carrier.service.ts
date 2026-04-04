// src/services/carrier.service.ts
import api from './api'
import type { ApiResponse } from '@/types/auth.types'

export interface Carrier {
  _id:           string
  name:          string
  isActive:      boolean
  estimatedDays: { min: number; max: number }
  priceRules:    { country: string; price: number }[]
}

export const carrierService = {
  async getAll(): Promise<Carrier[]> {
    const { data } = await api.get<ApiResponse<Carrier[]>>('/carriers')
    return data.data
  },
}