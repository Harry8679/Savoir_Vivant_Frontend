import api from './api'
import { Address } from '@/types/address.types'

interface ApiResponse<T> { success: boolean; data: T }

export const addressService = {
  async getAll(): Promise<Address[]> {
    const { data } = await api.get<ApiResponse<Address[]>>('/addresses')
    return data.data
  },

  async create(payload: Omit<Address, '_id' | 'isDefault'>): Promise<Address> {
    const { data } = await api.post<ApiResponse<Address>>('/addresses', payload)
    return data.data
  },

  async update(id: string, payload: Partial<Address>): Promise<Address> {
    const { data } = await api.patch<ApiResponse<Address>>(`/addresses/${id}`, payload)
    return data.data
  },

  async setDefault(id: string): Promise<Address> {
    const { data } = await api.patch<ApiResponse<Address>>(`/addresses/${id}/default`, {})
    return data.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/addresses/${id}`)
  },
}

export const carrierService = {
  async getByCountry(country: string) {
    const { data } = await api.get<ApiResponse<import('@/types/address.types').Carrier[]>>(
      `/carriers?country=${country}`
    )
    return data.data
  },
}