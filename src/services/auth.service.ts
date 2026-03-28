import { ApiResponse, AuthResponse, RegisterPayload } from '@/types/auth.types'
import api from './api'
// import { AuthResponse, LoginPayload, RegisterPayload, ApiResponse } from '@types/auth.types'

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/register', payload)
    return data.data
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/login', payload)
    return data.data
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout')
  },

  async me(): Promise<AuthResponse['user']> {
    const { data } = await api.get<ApiResponse<AuthResponse['user']>>('/auth/me')
    return data.data
  },

  async refresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const { data } = await api.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
      '/auth/refresh',
      { refreshToken }
    )
    return data.data
  },
}